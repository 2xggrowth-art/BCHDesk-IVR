// ============================================================
// BCH CRM - BDC Incoming Call Screen with Inline Qualification
// Detects real incoming calls and shows qualify form
// - Protects ongoing qualification from new incoming calls
// - Queues missed/new calls while qualifying
// - Preserves state when calling back
// ============================================================

import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChipGroup } from '@/components/ui/Chip';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { useLeadsStore } from '@/store/leadsStore';
import { useUIStore } from '@/store/uiStore';
import { callbacksApi, leadsApi } from '@/services/api';
import { timeAgo, getStageLabel, getInterestLabel } from '@/utils/format';
import {
  AREAS, BUDGETS, VISIT_INTENTS, EMI_OPTIONS, CALL_NOTES, INTERESTS,
  INTEREST_BRANDS, BRAND_MODELS, STAFF_LIST,
} from '@/config/constants';
import {
  startSpeechRecognition, startCallListener, onIncomingCall, onCallStateChanged,
} from '@/services/calllog';
import { sanitizePhone } from '@/utils/format';
import type { Lead, Callback } from '@/types';

interface QueuedCall {
  phone: string;
  time: Date;
  type: 'missed' | 'incoming' | 'ended';
}

const EMPTY_FORM = {
  name: '', area: '', budget: '', interest: '', brand: '', model: '',
  visitIntent: '', emi: '', callNotes: [] as string[], assignTo: '',
};

export function IncomingPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { createLead, updateLead } = useLeadsStore();
  const { showToast } = useUIStore();

  // Track if user is actively qualifying (form open with data)
  const qualifyingRef = useRef(false);

  // Incoming call state
  const [callState, setCallState] = useState<'waiting' | 'ringing' | 'on_call' | 'ended'>('waiting');
  const [incomingPhone, setIncomingPhone] = useState('');
  const [manualPhone, setManualPhone] = useState('');

  // Queue for calls that came in while user was busy qualifying
  const [callQueue, setCallQueue] = useState<QueuedCall[]>([]);

  // Session history of completed qualifications
  const [callHistory, setCallHistory] = useState<{ phone: string; time: Date; saved: boolean }[]>([]);

  // IVR data placeholder
  const ivrData = useMemo(() => ({
    source: 'direct_referral' as const, location: '', ageBracket: '', interest: '' as const, language: 'hindi',
  }), []);

  // Check if navigated from CallLog with a phone number
  useEffect(() => {
    const phoneParam = searchParams.get('phone');
    if (phoneParam) {
      setIncomingPhone(phoneParam);
      setCallState('ended');
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Start listening for real phone calls
  useEffect(() => {
    startCallListener();

    const removeIncoming = onIncomingCall((data) => {
      if (data.state === 'ringing') {
        const number = data.number || 'Unknown';

        if (qualifyingRef.current) {
          // User is busy qualifying — queue this call, don't interrupt
          setCallQueue(prev => {
            if (prev.some(c => c.phone === number)) return prev;
            return [{ phone: number, time: new Date(), type: 'incoming' }, ...prev];
          });
        } else {
          // Not qualifying — show the call normally
          setCallState('ringing');
          setIncomingPhone(number);
          setShowQualifyForm(false);
        }
      }
    });

    const removeStateChange = onCallStateChanged((data) => {
      if (data.state === 'answered') {
        if (!qualifyingRef.current) {
          setCallState('on_call');
        }
      } else if (data.state === 'idle') {
        if (qualifyingRef.current) {
          // Call ended while qualifying — update queued call to "missed"
          setCallQueue(prev => prev.map(c =>
            c.type === 'incoming' ? { ...c, type: 'missed' } : c
          ));
        } else {
          // Not qualifying — transition to ended for qualification
          setCallState(prev => (prev === 'ringing' || prev === 'on_call') ? 'ended' : prev);
        }
      }
    });

    return () => { removeIncoming(); removeStateChange(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Qualify form state
  const [showQualifyForm, setShowQualifyForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [customArea, setCustomArea] = useState('');
  const [form, setForm] = useState({ ...EMPTY_FORM });

  // Customer phone (real number entered by BDC, not IVR number)
  const [customerPhone, setCustomerPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [duplicateLead, setDuplicateLead] = useState<Lead | null>(null);
  const [isCheckingPhone, setIsCheckingPhone] = useState(false);
  const [mergeMode, setMergeMode] = useState<'none' | 'update' | 'create'>('none');
  const phoneCheckTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep qualifyingRef in sync with form visibility
  useEffect(() => {
    qualifyingRef.current = showQualifyForm && callState !== 'waiting';
  }, [showQualifyForm, callState]);

  const activePhone = incomingPhone;

  // Auto-calculate score
  const scoreInfo = useMemo(() => {
    let filled = 0;
    const total = 8;
    if (form.name) filled++;
    if (form.area) filled++;
    if (form.budget) filled++;
    if (form.interest) filled++;
    if (form.brand) filled++;
    if (form.model) filled++;
    if (form.visitIntent) filled++;
    if (form.emi) filled++;
    let score = filled / total;
    if (form.visitIntent === 'coming_today' || form.visitIntent === 'coming_tomorrow') score = Math.min(score + 0.15, 1.0);
    if (form.budget === '50k_1l' || form.budget === 'above_1l') score = Math.min(score + 0.05, 1.0);
    let level: string;
    if (score >= 0.85) level = 'very_hot';
    else if (score >= 0.65) level = 'hot';
    else if (score >= 0.40) level = 'warm';
    else level = 'cold';
    return { score, level, filled, total };
  }, [form]);

  const availableBrands = useMemo(() => {
    if (!form.interest) return [];
    return INTEREST_BRANDS[form.interest] || [];
  }, [form.interest]);

  const availableModels = useMemo(() => {
    if (!form.brand) return [];
    return BRAND_MODELS[form.brand] || [];
  }, [form.brand]);

  const updateField = (field: string, value: string | string[]) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'interest') { next.brand = ''; next.model = ''; }
      if (field === 'brand') { next.model = ''; }
      return next;
    });
  };

  const handleMicInput = async () => {
    setIsListening(true);
    const result = await startSpeechRecognition('en-IN');
    setIsListening(false);
    if (result.text) updateField('name', result.text);
    else if (result.error) showToast(result.error, 'error');
  };

  // Debounced duplicate phone check
  const checkDuplicatePhone = (digits: string) => {
    if (phoneCheckTimerRef.current) clearTimeout(phoneCheckTimerRef.current);
    setDuplicateLead(null);
    setMergeMode('none');
    setPhoneError('');
    if (digits.length < 10) { setIsCheckingPhone(false); return; }
    if (digits.length > 10) { setPhoneError('Phone number should be 10 digits'); return; }
    setIsCheckingPhone(true);
    phoneCheckTimerRef.current = setTimeout(async () => {
      try {
        const existing = await leadsApi.searchByPhone(digits);
        if (existing && !existing.is_spam) setDuplicateLead(existing);
      } catch { /* lookup failed silently */ }
      finally { setIsCheckingPhone(false); }
    }, 400);
  };

  const handleCustomerPhoneChange = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 10);
    setCustomerPhone(digits);
    checkDuplicatePhone(digits);
  };

  // Cleanup debounce timer
  useEffect(() => {
    return () => { if (phoneCheckTimerRef.current) clearTimeout(phoneCheckTimerRef.current); };
  }, []);

  const resetForm = () => {
    setForm({ ...EMPTY_FORM });
    setCustomArea('');
    setCustomerPhone('');
    setPhoneError('');
    setDuplicateLead(null);
    setMergeMode('none');
    setIsCheckingPhone(false);
    if (phoneCheckTimerRef.current) clearTimeout(phoneCheckTimerRef.current);
    setShowQualifyForm(false);
    setCallState('waiting');
    setIncomingPhone('');
    setManualPhone('');
  };

  // Pick next call from queue after finishing current one
  const pickFromQueue = (item: QueuedCall) => {
    setCallQueue(prev => prev.filter(c => c.phone !== item.phone));
    setForm({ ...EMPTY_FORM });
    setCustomArea('');
    setCustomerPhone('');
    setDuplicateLead(null);
    setMergeMode('none');
    setShowQualifyForm(false);
    setIncomingPhone(item.phone);
    setCallState('ended');
  };

  const handleSaveAndAssign = async () => {
    const digits = customerPhone.replace(/\D/g, '');
    if (digits.length !== 10) { showToast("Enter customer's 10-digit phone number", 'error'); return; }
    if (!form.assignTo) { showToast('Please select a staff member to assign', 'error'); return; }
    if (duplicateLead && mergeMode === 'none') { showToast('Duplicate found — choose Update Existing or Create New', 'error'); return; }
    const assignedStaff = STAFF_LIST.find(s => s.value === form.assignTo);
    const areaValue = form.area === '__custom__' ? customArea : form.area;
    setIsSubmitting(true);
    try {
      const leadData: Partial<Lead> = {
        phone: digits,
        name: form.name || null,
        source: ivrData.source || 'direct_referral',
        language: ivrData.language || 'hindi',
        location: ivrData.location || null,
        area: areaValue || null,
        age_bracket: ivrData.ageBracket || null,
        interest: form.interest as Lead['interest'] || null,
        brand: form.brand || null,
        model: form.model || null,
        budget: form.budget as Lead['budget'] || null,
        emi: form.emi as Lead['emi'] || null,
        visit_intent: form.visitIntent as Lead['visit_intent'] || null,
        call_notes: form.callNotes.length > 0 ? form.callNotes : null,
        stage: 'qualified',
        assigned_to: form.assignTo || null,
      };
      if (mergeMode === 'update' && duplicateLead) {
        await updateLead(duplicateLead.id, leadData);
        showToast(`Updated lead & assigned to ${assignedStaff?.name || 'staff'}`, 'success');
      } else {
        await createLead(leadData);
        showToast(`Lead saved & assigned to ${assignedStaff?.name || 'staff'}`, 'success');
      }
      setCallHistory(prev => [{ phone: digits, time: new Date(), saved: true }, ...prev.slice(0, 19)]);
      resetForm();
    } catch {
      showToast('Failed to save lead', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCallback = async () => {
    const effectivePhone = customerPhone.length === 10 ? customerPhone : activePhone;
    if (!effectivePhone) { showToast('No phone number', 'error'); return; }
    try {
      await callbacksApi.create({
        phone: effectivePhone,
        source: ivrData.source || null,
        interest: (form.interest || null) as Callback['interest'],
        missed_at: new Date().toISOString(),
        status: 'pending',
      });
      showToast('Added to callback queue', 'success');
      setCallHistory(prev => [{ phone: effectivePhone, time: new Date(), saved: false }, ...prev.slice(0, 19)]);
      resetForm();
      navigate('/bdc/callbacks');
    } catch {
      showToast('Failed to add callback', 'error');
    }
  };

  const handleSpam = async () => {
    const effectivePhone = customerPhone.length === 10 ? customerPhone : activePhone;
    if (effectivePhone) {
      try {
        await createLead({
          phone: effectivePhone,
          source: ivrData.source || 'direct_referral',
          stage: 'lead_created',
          is_spam: true,
        });
        showToast('Marked as spam/wrong number', 'warning');
      } catch {
        showToast('Marked as spam/wrong number', 'warning');
      }
    } else {
      showToast('Marked as spam/wrong number', 'warning');
    }
    resetForm();
  };

  // ========== WAITING STATE — no active call ==========
  if (callState === 'waiting' && !showQualifyForm) {
    return (
      <div className="p-4 pb-24 space-y-4">
        {/* Queued / Missed calls banner */}
        {callQueue.length > 0 && (
          <div>
            <h3 className="text-[11px] font-bold text-red-500 uppercase tracking-wider mb-2">
              Pending Calls ({callQueue.length})
            </h3>
            <div className="space-y-1.5">
              {callQueue.map((item, i) => (
                <Card key={`q-${item.phone}-${i}`} className={`p-3 ${item.type === 'missed' ? 'border-l-3 border-l-red-400' : 'border-l-3 border-l-yellow-400'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.type === 'missed' ? 'bg-red-50' : 'bg-yellow-50'}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={item.type === 'missed' ? '#dc2626' : '#d97706'} strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.phone}</p>
                        <p className="text-[10px] text-gray-400">
                          {item.type === 'missed' ? 'Missed' : 'Ended'} — {item.time.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => window.open(`tel:${sanitizePhone(item.phone)}`, '_self')}
                        className="px-2.5 py-1.5 text-xs font-medium text-green-700 bg-green-50 rounded-lg active:scale-95"
                      >
                        Call
                      </button>
                      <button
                        onClick={() => pickFromQueue(item)}
                        className="px-2.5 py-1.5 text-xs font-medium text-primary-500 bg-primary-50 rounded-lg active:scale-95"
                      >
                        Qualify
                      </button>
                      <button
                        onClick={() => setCallQueue(prev => prev.filter(c => c.phone !== item.phone))}
                        className="px-2.5 py-1.5 text-xs font-medium text-gray-400 bg-gray-100 rounded-lg active:scale-95"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Waiting for call */}
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gray-100 mb-4">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-gray-400">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-700">Waiting for Incoming Call</h2>
          <p className="text-sm text-gray-400 mt-1">When a call comes in, the caller's<br/>number will appear here automatically</p>

          {/* Manual entry option */}
          <div className="mt-6">
            <p className="text-xs text-gray-400 mb-2">Or enter a number manually:</p>
            <div className="flex gap-2 max-w-xs mx-auto">
              <input
                type="tel"
                placeholder="Enter phone number"
                value={manualPhone}
                onChange={(e) => setManualPhone(e.target.value)}
                className="flex-1 px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary-300 outline-none text-center"
              />
              <button
                onClick={() => {
                  if (manualPhone.length >= 10) {
                    setIncomingPhone(manualPhone);
                    setCallState('ended');
                    setCallHistory(prev => [{ phone: manualPhone, time: new Date(), saved: false }, ...prev.slice(0, 19)]);
                  }
                }}
                disabled={manualPhone.length < 10}
                className="px-4 py-2.5 bg-primary-500 text-white text-sm font-semibold rounded-xl active:scale-95 disabled:opacity-40"
              >
                Go
              </button>
            </div>
          </div>
        </div>

        {/* Session history */}
        {callHistory.length > 0 && (
          <div>
            <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Session History</h3>
            <div className="space-y-1.5">
              {callHistory.map((item, i) => (
                <Card key={`h-${item.phone}-${i}`} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.saved ? 'bg-green-50' : 'bg-gray-100'}`}>
                        {item.saved ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.phone}</p>
                        <p className="text-[10px] text-gray-400">
                          {item.saved ? 'Saved' : 'Not saved'} — {item.time.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true })}
                        </p>
                      </div>
                    </div>
                    {!item.saved && (
                      <button
                        onClick={() => { setIncomingPhone(item.phone); setCallState('ended'); }}
                        className="text-xs font-medium text-primary-500 px-3 py-1.5 bg-primary-50 rounded-lg active:scale-95"
                      >
                        Qualify
                      </button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // ========== RINGING / ON CALL / ENDED — show incoming call screen ==========
  return (
    <div className="p-4 pb-24 space-y-4">
      {/* Queued calls banner while qualifying */}
      {callQueue.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3">
          <p className="text-xs font-bold text-red-600 mb-1.5">
            {callQueue.length} call{callQueue.length > 1 ? 's' : ''} waiting
          </p>
          <div className="space-y-1">
            {callQueue.slice(0, 3).map((item, i) => (
              <div key={`qb-${item.phone}-${i}`} className="flex items-center justify-between">
                <span className="text-xs text-red-700 font-medium">{item.phone}</span>
                <span className="text-[10px] text-red-400">{item.type === 'missed' ? 'Missed' : 'Waiting'}</span>
              </div>
            ))}
          </div>
          {callQueue.length > 3 && <p className="text-[10px] text-red-400 mt-1">+{callQueue.length - 3} more</p>}
        </div>
      )}

      {/* Incoming Call Header */}
      <div className="text-center py-4">
        <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-3 ${
          callState === 'ringing' ? 'bg-green-100 animate-pulse' :
          callState === 'on_call' ? 'bg-blue-100' : 'bg-gray-100'
        }`}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className={
            callState === 'ringing' ? 'text-green-600' :
            callState === 'on_call' ? 'text-blue-600' : 'text-gray-600'
          }>
            <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <p className="text-sm font-mono text-gray-400 tracking-wide">
          IVR: <span className="line-through">{activePhone || 'Unknown'}</span>
        </p>
        <p className="text-[10px] text-gray-300 mt-0.5">IVR number — ask customer for real number</p>
        <p className={`text-sm mt-1.5 font-medium ${
          callState === 'ringing' ? 'text-green-600' :
          callState === 'on_call' ? 'text-blue-600' : 'text-gray-500'
        }`}>
          {callState === 'ringing' ? 'Incoming Call...' :
           callState === 'on_call' ? 'On Call' : 'Call Ended — Qualify Now'}
        </p>
      </div>

      {/* Quick actions — Call/SMS/WhatsApp (always visible, don't reset state) */}
      {!showQualifyForm && (
        <div className="flex gap-2">
          <button
            onClick={() => window.open(`tel:${sanitizePhone(activePhone)}`, '_self')}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-50 text-green-700 rounded-xl text-sm font-semibold active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
            </svg>
            Call
          </button>
          <button
            onClick={() => window.open(`sms:${sanitizePhone(activePhone)}`, '_self')}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-700 rounded-xl text-sm font-semibold active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
            SMS
          </button>
          <button
            onClick={() => window.open(`https://wa.me/91${sanitizePhone(activePhone)}`, '_blank')}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-semibold active:scale-95"
          >
            WhatsApp
          </button>
        </div>
      )}

      {/* Qualify Button */}
      <Button
        variant="primary"
        size="xl"
        fullWidth
        onClick={() => setShowQualifyForm(!showQualifyForm)}
        icon={<span>{showQualifyForm ? '▲' : '▼'}</span>}
      >
        {showQualifyForm ? 'HIDE QUALIFICATION FORM' : 'QUALIFY THIS LEAD'}
      </Button>

      {/* Inline Qualification Form */}
      {showQualifyForm && (
        <div className="space-y-1 bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <p className="text-xs text-gray-500 text-center mb-3">Tap to select — zero typing qualification</p>

          {/* Customer Phone Number (mandatory) */}
          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
              Customer Phone <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                inputMode="numeric"
                value={customerPhone}
                onChange={(e) => handleCustomerPhoneChange(e.target.value)}
                placeholder="Ask customer their real number..."
                maxLength={10}
                className={`w-full px-3 py-2.5 text-sm border rounded-xl bg-white focus:ring-2 outline-none font-mono tracking-wider ${
                  phoneError ? 'border-red-300 focus:ring-red-300' :
                  duplicateLead ? 'border-amber-300 focus:ring-amber-300' :
                  customerPhone.length === 10 && !isCheckingPhone ? 'border-green-300 focus:ring-green-300' :
                  'border-gray-200 focus:ring-primary-300'
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isCheckingPhone && (
                  <div className="w-4 h-4 border-2 border-primary-300 border-t-transparent rounded-full animate-spin" />
                )}
                {!isCheckingPhone && customerPhone.length === 10 && !duplicateLead && !phoneError && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                )}
                {duplicateLead && !isCheckingPhone && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                )}
              </div>
            </div>
            <p className="text-[10px] text-gray-300 mt-0.5 text-right">{customerPhone.length}/10</p>
            {phoneError && <p className="text-[10px] text-red-500 mt-0.5">{phoneError}</p>}
          </div>

          {/* Duplicate Lead Found */}
          {duplicateLead && (
            <div className="mb-3 bg-amber-50 border border-amber-200 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <span className="text-xs font-bold text-amber-700">Existing Lead Found</span>
              </div>
              <div className="bg-white rounded-lg p-2.5 mb-2.5 border border-amber-100">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-semibold text-gray-900">{duplicateLead.name || 'No name'}</span>
                  <ScoreBadge score={duplicateLead.score} size="sm" />
                </div>
                <div className="space-y-0.5 text-[11px] text-gray-500">
                  {duplicateLead.interest && (
                    <p>Interest: <span className="font-medium text-gray-700">{getInterestLabel(duplicateLead.interest)}</span>
                      {duplicateLead.brand && <span> — {duplicateLead.brand}</span>}
                    </p>
                  )}
                  <p>Stage: <span className="font-medium text-gray-700">{getStageLabel(duplicateLead.stage)}</span></p>
                  {duplicateLead.last_contact && (
                    <p>Last contact: <span className="font-medium text-gray-700">{timeAgo(duplicateLead.last_contact)}</span></p>
                  )}
                  <p>Created: <span className="font-medium text-gray-700">{timeAgo(duplicateLead.created_at)}</span></p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setMergeMode('update')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg active:scale-95 transition-colors ${
                    mergeMode === 'update' ? 'bg-amber-600 text-white' : 'bg-white text-amber-700 border border-amber-300'
                  }`}
                >
                  Update Existing
                </button>
                <button
                  onClick={() => setMergeMode('create')}
                  className={`flex-1 py-2 text-xs font-semibold rounded-lg active:scale-95 transition-colors ${
                    mergeMode === 'create' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 border border-gray-300'
                  }`}
                >
                  Create New Lead
                </button>
              </div>
              {mergeMode === 'none' && (
                <p className="text-[10px] text-amber-600 mt-1.5 text-center">Choose an action above to continue</p>
              )}
            </div>
          )}

          {/* Name with Mic */}
          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Name</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Tap mic or type..."
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary-300 outline-none"
              />
              <button
                onClick={handleMicInput}
                disabled={isListening}
                className={`w-10 h-10 rounded-xl flex items-center justify-center active:scale-90 ${
                  isListening ? 'bg-red-500 animate-pulse' : 'bg-primary-500'
                }`}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="0">
                  <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                  <path d="M19 10v2a7 7 0 01-14 0v-2" fill="none" strokeWidth="2" />
                  <line x1="12" y1="19" x2="12" y2="23" fill="none" strokeWidth="2" />
                  <line x1="8" y1="23" x2="16" y2="23" fill="none" strokeWidth="2" />
                </svg>
              </button>
              <button
                onClick={() => updateField('name', "Didn't share")}
                className="px-3 py-2 text-xs font-medium bg-gray-200 text-gray-600 rounded-xl active:scale-95"
              >
                Skip
              </button>
            </div>
            {isListening && (
              <p className="text-xs text-red-500 mt-1 animate-pulse">Listening... speak the name</p>
            )}
          </div>

          {/* Area — dropdown with custom option */}
          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Area</label>
            <select
              value={form.area}
              onChange={(e) => updateField('area', e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary-300 outline-none appearance-none"
            >
              <option value="">Select area...</option>
              {AREAS.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
              <option value="__custom__">+ Add Custom Area</option>
            </select>
            {form.area === '__custom__' && (
              <input
                type="text"
                value={customArea}
                onChange={(e) => setCustomArea(e.target.value)}
                placeholder="Type area name..."
                className="w-full mt-2 px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary-300 outline-none"
              />
            )}
          </div>

          <ChipGroup label="Budget" options={BUDGETS} value={form.budget} onChange={(v) => updateField('budget', v as string)} columns={3} />
          <ChipGroup label="Interest" options={INTERESTS} value={form.interest} onChange={(v) => updateField('interest', v as string)} columns={3} />

          {form.interest && (
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Brand</label>
              <select
                value={form.brand}
                onChange={(e) => updateField('brand', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary-300 outline-none appearance-none"
              >
                <option value="">Select brand...</option>
                {availableBrands.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>
          )}

          {form.brand && (
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Model</label>
              <select
                value={form.model}
                onChange={(e) => updateField('model', e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary-300 outline-none appearance-none"
              >
                <option value="">Select model...</option>
                {availableModels.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
              </select>
            </div>
          )}

          <ChipGroup label="Visit Intent" options={VISIT_INTENTS} value={form.visitIntent} onChange={(v) => updateField('visitIntent', v as string)} columns={3} />
          <ChipGroup label="EMI" options={EMI_OPTIONS} value={form.emi} onChange={(v) => updateField('emi', v as string)} columns={2} />
          <ChipGroup label="Call Notes" options={CALL_NOTES} value={form.callNotes} onChange={(v) => updateField('callNotes', v)} multiple columns={3} />

          {/* Auto Score */}
          <Card className="p-3 mt-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[11px] font-bold text-gray-400 uppercase">Auto Score</h3>
                <p className="text-xs text-gray-400 mt-0.5">{scoreInfo.filled}/{scoreInfo.total} fields</p>
              </div>
              <ScoreBadge score={scoreInfo.level} size="md" showValue value={scoreInfo.score} />
            </div>
            <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all duration-300"
                style={{ width: `${scoreInfo.score * 100}%` }}
              />
            </div>
          </Card>

          {/* Manual Staff Assignment */}
          <div className="mb-3 mt-3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Assign To</label>
            <select
              value={form.assignTo}
              onChange={(e) => updateField('assignTo', e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-primary-300 outline-none appearance-none"
            >
              <option value="">Select staff member...</option>
              {STAFF_LIST.map(s => (
                <option key={s.value} value={s.value}>{s.name} — {s.specialty}</option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-3">
            <Button variant="success" size="xl" fullWidth onClick={handleSaveAndAssign} disabled={isSubmitting || customerPhone.length !== 10 || (duplicateLead !== null && mergeMode === 'none')} icon={<span>✓</span>}>
              {isSubmitting ? 'SAVING...' : mergeMode === 'update' ? 'UPDATE & ASSIGN' : 'SAVE & ASSIGN'}
            </Button>
            <div className="flex gap-2">
              <Button variant="warning" size="md" fullWidth onClick={handleCallback}>CALLBACK</Button>
              <Button variant="outline" size="md" fullWidth onClick={() => { resetForm(); showToast('Marked as cold', 'info'); }}>COLD</Button>
            </div>
          </div>
        </div>
      )}

      {/* Spam Button */}
      <Button
        variant="danger"
        size="lg"
        fullWidth
        onClick={handleSpam}
        icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>}
      >
        SPAM / WRONG NUMBER
      </Button>
    </div>
  );
}
