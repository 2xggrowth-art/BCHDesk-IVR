// ============================================================
// BCH CRM - BDC Qualification Form (Zero-Typing Chip UI)
// ============================================================

import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChipGroup } from '@/components/ui/Chip';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import {
  AREAS, BUDGETS, BRANDS, MODELS, VISIT_INTENTS, EMI_OPTIONS, CALL_NOTES, INTERESTS,
} from '@/config/constants';
import { ASSIGNMENT_RULES } from '@/config/constants';
import { useLeadsStore } from '@/store/leadsStore';
import { useUIStore } from '@/store/uiStore';
import { callbacksApi } from '@/services/api';
import type { Lead } from '@/types';

export function QualifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { createLead } = useLeadsStore();
  const { showToast } = useUIStore();

  const incomingCall = location.state?.incomingCall;

  const [form, setForm] = useState({
    name: '',
    area: '',
    budget: '',
    interest: incomingCall?.interest || '',
    brand: '',
    model: '',
    visitIntent: '',
    emi: '',
    callNotes: [] as string[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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

    // Intent boost
    if (form.visitIntent === 'coming_today' || form.visitIntent === 'coming_tomorrow') {
      score = Math.min(score + 0.15, 1.0);
    }
    if (form.budget === '50k_1l' || form.budget === 'above_1l') {
      score = Math.min(score + 0.05, 1.0);
    }

    let level: string;
    if (score >= 0.85) level = 'very_hot';
    else if (score >= 0.65) level = 'hot';
    else if (score >= 0.40) level = 'warm';
    else level = 'cold';

    return { score, level, filled, total };
  }, [form]);

  // Auto-assign based on interest
  const autoAssign = useMemo(() => {
    if (!form.interest) return null;
    return ASSIGNMENT_RULES[form.interest] || ASSIGNMENT_RULES.other;
  }, [form.interest]);

  const updateField = (field: string, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAndAssign = async () => {
    setIsSubmitting(true);
    try {
      await createLead({
        phone: incomingCall?.phone || '',
        name: form.name || null,
        source: incomingCall?.source || 'direct_referral',
        language: incomingCall?.language || 'english',
        location: incomingCall?.location || null,
        area: form.area || null,
        age_bracket: incomingCall?.ageBracket || null,
        interest: form.interest as Lead['interest'] || null,
        brand: form.brand || null,
        model: form.model || null,
        budget: form.budget as Lead['budget'] || null,
        emi: form.emi as Lead['emi'] || null,
        visit_intent: form.visitIntent as Lead['visit_intent'] || null,
        call_notes: form.callNotes.length > 0 ? form.callNotes : null,
        stage: 'qualified',
        assigned_to: autoAssign?.userId || null,
      });

      showToast(`Lead saved & assigned to ${autoAssign?.name || 'staff'}`, 'success');
      navigate('/bdc/incoming');
    } catch {
      showToast('Failed to save lead', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCallback = async () => {
    if (!incomingCall?.phone) {
      showToast('No phone number for callback', 'error');
      return;
    }
    try {
      await callbacksApi.create({
        phone: incomingCall.phone,
        source: incomingCall.source || null,
        interest: form.interest || null,
        missed_at: new Date().toISOString(),
        status: 'pending',
      });
      showToast('Added to callback queue', 'success');
      navigate('/bdc/callbacks');
    } catch {
      showToast('Failed to add callback', 'error');
    }
  };

  return (
    <div className="p-4 pb-24 space-y-1">
      {/* Phone header */}
      <div className="text-center mb-4">
        <p className="text-lg font-bold text-gray-900">{incomingCall?.phone || 'New Lead'}</p>
        <p className="text-xs text-gray-500">Qualify this caller — tap to select</p>
      </div>

      {/* Name (voice-to-text or skip) */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Name
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Voice-to-text or type..."
            className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-300 focus:border-primary-400 outline-none"
          />
          <button
            onClick={() => updateField('name', "Didn't share")}
            className="px-3 py-2.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-xl active:scale-95"
          >
            Skip
          </button>
        </div>
      </div>

      {/* Chip-based qualification fields */}
      <ChipGroup label="Area" options={AREAS} value={form.area} onChange={(v) => updateField('area', v as string)} columns={3} />
      <ChipGroup label="Budget" options={BUDGETS} value={form.budget} onChange={(v) => updateField('budget', v as string)} columns={3} />
      <ChipGroup label="Interest" options={INTERESTS} value={form.interest} onChange={(v) => updateField('interest', v as string)} columns={3} />
      <ChipGroup label="Brand" options={BRANDS} value={form.brand} onChange={(v) => updateField('brand', v as string)} columns={3} />
      <ChipGroup label="Model" options={MODELS} value={form.model} onChange={(v) => updateField('model', v as string)} columns={3} />
      <ChipGroup label="Visit Intent" options={VISIT_INTENTS} value={form.visitIntent} onChange={(v) => updateField('visitIntent', v as string)} columns={3} />
      <ChipGroup label="EMI" options={EMI_OPTIONS} value={form.emi} onChange={(v) => updateField('emi', v as string)} columns={2} />
      <ChipGroup label="Call Notes" options={CALL_NOTES} value={form.callNotes} onChange={(v) => updateField('callNotes', v)} multiple columns={3} />

      {/* Auto Score Card */}
      <Card className="p-4 mt-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase">Auto Score</h3>
            <p className="text-xs text-gray-400 mt-0.5">{scoreInfo.filled}/{scoreInfo.total} fields filled</p>
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

      {/* Auto Assign Card */}
      {autoAssign && (
        <Card className="p-4 mt-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">Auto-Assign</h3>
          <div className="flex items-center gap-2">
            <span className="text-2xl">👤</span>
            <div>
              <p className="text-sm font-bold text-gray-900">{autoAssign.name}</p>
              <p className="text-xs text-gray-500">{autoAssign.specialty}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="space-y-3 pt-4">
        <Button
          variant="success"
          size="xl"
          fullWidth
          onClick={handleSaveAndAssign}
          disabled={isSubmitting}
          icon={<span>✓</span>}
        >
          {isSubmitting ? 'SAVING...' : 'SAVE & ASSIGN'}
        </Button>

        <div className="flex gap-3">
          <Button variant="warning" size="lg" fullWidth onClick={handleCallback}>
            SCHEDULE CALLBACK
          </Button>
          <Button variant="outline" size="lg" fullWidth onClick={() => navigate('/bdc/incoming')}>
            MARK AS COLD
          </Button>
        </div>
      </div>
    </div>
  );
}
