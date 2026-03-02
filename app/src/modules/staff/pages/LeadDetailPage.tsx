// ============================================================
// BCH CRM - Staff: Lead Detail Page
// Card-based outcome logging with follow-up scheduling
// ============================================================

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button, ActionButton } from '@/components/ui/Button';
import { ChipBadge } from '@/components/ui/Chip';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { leadsApi, callsApi, followupsApi, activitiesApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import {
  getSourceLabel, getBudgetLabel, getInterestLabel, getStageLabel,
  timeAgo, sanitizePhone,
} from '@/utils/format';
import type { Lead, Call, Activity, CallOutcome } from '@/types';

// Outcome cards config with emoji, label, color, and resulting stage
const OUTCOME_CARDS: {
  value: CallOutcome;
  label: string;
  emoji: string;
  color: string;
  bgColor: string;
  stage: string;
  description: string;
}[] = [
  { value: 'coming_today', label: 'Coming Today', emoji: '🏃', color: 'text-green-700', bgColor: 'bg-green-50 border-green-200', stage: 'visit_scheduled', description: 'Customer will visit today' },
  { value: 'coming_tomorrow', label: 'Tomorrow', emoji: '📅', color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-200', stage: 'visit_scheduled', description: 'Will visit tomorrow' },
  { value: 'coming_weekend', label: 'Weekend', emoji: '🗓️', color: 'text-indigo-700', bgColor: 'bg-indigo-50 border-indigo-200', stage: 'visit_scheduled', description: 'Planning for weekend' },
  { value: 'coming_next_week', label: 'Next Week', emoji: '⏰', color: 'text-purple-700', bgColor: 'bg-purple-50 border-purple-200', stage: 'visit_scheduled', description: 'Will come next week' },
  { value: 'not_sure', label: 'Not Sure', emoji: '🤔', color: 'text-yellow-700', bgColor: 'bg-yellow-50 border-yellow-200', stage: 'follow_up_active', description: 'Undecided, needs follow-up' },
  { value: 'no_answer', label: 'No Answer', emoji: '📵', color: 'text-gray-700', bgColor: 'bg-gray-50 border-gray-200', stage: 'follow_up_active', description: 'Call not picked up' },
  { value: 'family_approval', label: 'Family Approval', emoji: '👨‍👩‍👧', color: 'text-orange-700', bgColor: 'bg-orange-50 border-orange-200', stage: 'follow_up_active', description: 'Needs family consent' },
  { value: 'price_concern', label: 'Price Concern', emoji: '💰', color: 'text-amber-700', bgColor: 'bg-amber-50 border-amber-200', stage: 'follow_up_active', description: 'Feels price is high' },
  { value: 'competitor', label: 'Competitor', emoji: '🏪', color: 'text-red-700', bgColor: 'bg-red-50 border-red-200', stage: 'follow_up_active', description: 'Checking other shops' },
  { value: 'callback_later', label: 'Callback Later', emoji: '🔄', color: 'text-cyan-700', bgColor: 'bg-cyan-50 border-cyan-200', stage: 'follow_up_active', description: 'Asked to call back' },
  { value: 'not_interested', label: 'Not Interested', emoji: '❌', color: 'text-red-700', bgColor: 'bg-red-50 border-red-300', stage: 'lost', description: 'No longer interested' },
  { value: 'wrong_number', label: 'Wrong Number', emoji: '🚫', color: 'text-gray-700', bgColor: 'bg-gray-100 border-gray-300', stage: 'lost', description: 'Invalid contact' },
];

export function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { showToast } = useUIStore();

  const [lead, setLead] = useState<Lead | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [timeline, setTimeline] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Outcome logging state
  const [showOutcome, setShowOutcome] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState<CallOutcome | null>(null);
  const [followUpDate, setFollowUpDate] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (id) loadLeadDetail(id);
  }, [id]);

  const loadLeadDetail = async (leadId: string) => {
    setIsLoading(true);
    try {
      const [leadData, callsData, timelineData] = await Promise.all([
        leadsApi.getById(leadId),
        callsApi.getByLead(leadId),
        activitiesApi.getByLead(leadId),
      ]);
      setLead(leadData);
      setCalls(callsData);
      setTimeline(timelineData);
    } catch {
      showToast('Failed to load lead details', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCall = () => {
    if (lead?.phone) {
      window.open(`tel:${sanitizePhone(lead.phone)}`, '_self');
      setShowOutcome(true);
    }
  };

  const handleWhatsApp = () => {
    if (lead?.phone) {
      const msg = encodeURIComponent(
        `Hi ${lead.name || ''}! This is from Bharath Cycle Hub. Thank you for your interest in our ${lead.interest || 'cycles'}. How can we help you today?`
      );
      window.open(`https://wa.me/91${sanitizePhone(lead.phone)}?text=${msg}`, '_blank');
    }
  };

  const handleSelectOutcome = (outcome: CallOutcome) => {
    setSelectedOutcome(outcome);
  };

  const handleConfirmOutcome = async () => {
    if (!selectedOutcome || !lead || !user) return;

    setIsSaving(true);
    try {
      await callsApi.logCall({
        lead_id: lead.id,
        user_id: user.id,
        outcome: selectedOutcome,
      });

      // Get new stage from outcome config
      const outcomeConfig = OUTCOME_CARDS.find(o => o.value === selectedOutcome);
      const newStage = outcomeConfig?.stage || 'follow_up_active';

      await leadsApi.update(lead.id, {
        stage: newStage as Lead['stage'],
        last_contact: new Date().toISOString(),
      });

      // Create follow-up if date selected
      if (followUpDate) {
        await followupsApi.create({
          lead_id: lead.id,
          user_id: user.id,
          next_date: new Date(followUpDate).toISOString(),
        });
      }

      showToast('Outcome saved!', 'success');
      setShowOutcome(false);
      setSelectedOutcome(null);
      setFollowUpDate('');
      loadLeadDetail(lead.id);
    } catch {
      showToast('Failed to save outcome', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-3" />
        <p className="text-sm">Loading lead...</p>
      </div>
    );
  }

  if (!lead) {
    return <div className="flex items-center justify-center py-20 text-gray-400">Lead not found</div>;
  }

  return (
    <div className="p-4 pb-24 space-y-4">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-primary-500 active:opacity-70 -mt-1 mb-1"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        <span className="text-xs font-semibold">Back</span>
      </button>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{lead.name || lead.phone}</h2>
          {lead.name && <p className="text-sm text-gray-500">{lead.phone}</p>}
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary-100 text-primary-700">
              {getStageLabel(lead.stage)}
            </span>
            {lead.last_contact && (
              <span className="text-[10px] text-gray-400">Last contact: {timeAgo(lead.last_contact)}</span>
            )}
          </div>
        </div>
        <ScoreBadge score={lead.score} size="md" showValue value={lead.score_value} />
      </div>

      {/* Quick action buttons */}
      <div className="flex gap-3">
        <ActionButton label="CALL NOW" icon="📞" color="blue" onClick={handleCall} />
        <ActionButton label="WHATSAPP" icon="💬" color="green" onClick={handleWhatsApp} />
      </div>

      {/* ============ OUTCOME CARD SECTION ============ */}
      {showOutcome && !selectedOutcome && (
        <Card className="p-4 border-2 border-primary-200">
          <h3 className="text-sm font-bold text-gray-900 mb-1">What happened?</h3>
          <p className="text-xs text-gray-400 mb-3">Tap the outcome after your call</p>

          <div className="grid grid-cols-2 gap-2">
            {OUTCOME_CARDS.map((outcome) => (
              <button
                key={outcome.value}
                onClick={() => handleSelectOutcome(outcome.value)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border-2 ${outcome.bgColor} active:scale-[0.97] transition-all text-left`}
              >
                <span className="text-xl flex-shrink-0">{outcome.emoji}</span>
                <div className="min-w-0">
                  <p className={`text-xs font-bold ${outcome.color}`}>{outcome.label}</p>
                  <p className="text-[10px] text-gray-500 leading-tight truncate">{outcome.description}</p>
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Confirm selected outcome */}
      {showOutcome && selectedOutcome && (
        <Card className="p-4 border-2 border-green-200 bg-green-50/30">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">{OUTCOME_CARDS.find(o => o.value === selectedOutcome)?.emoji}</span>
            <div>
              <p className="text-sm font-bold text-gray-900">
                {OUTCOME_CARDS.find(o => o.value === selectedOutcome)?.label}
              </p>
              <p className="text-xs text-gray-500">
                {OUTCOME_CARDS.find(o => o.value === selectedOutcome)?.description}
              </p>
            </div>
            <button
              onClick={() => setSelectedOutcome(null)}
              className="ml-auto text-xs text-primary-500 font-semibold"
            >
              Change
            </button>
          </div>

          {/* Follow-up date (show for non-lost outcomes) */}
          {!['not_interested', 'wrong_number'].includes(selectedOutcome) && (
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                Schedule Follow-up (optional)
              </label>
              <input
                type="date"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-300 outline-none bg-white"
              />
            </div>
          )}

          <Button
            variant="success"
            size="lg"
            fullWidth
            onClick={handleConfirmOutcome}
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'CONFIRM & SAVE'}
          </Button>
        </Card>
      )}

      {/* Show outcome button when not already open */}
      {!showOutcome && (
        <button
          onClick={() => setShowOutcome(true)}
          className="w-full py-3 bg-primary-50 border-2 border-dashed border-primary-200 rounded-xl text-sm font-bold text-primary-600 active:scale-[0.98]"
        >
          + Log Call Outcome
        </button>
      )}

      {/* Lead info card */}
      <Card className="p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Lead Information</h3>
        <div className="space-y-2">
          {[
            { label: 'Source', value: lead.source, render: getSourceLabel },
            { label: 'Interest', value: lead.interest, render: getInterestLabel },
            { label: 'Budget', value: lead.budget, render: getBudgetLabel },
            { label: 'Brand', value: lead.brand },
            { label: 'Model', value: lead.model },
            { label: 'Area', value: lead.area },
            { label: 'EMI', value: lead.emi },
            { label: 'Visit Intent', value: lead.visit_intent },
            { label: 'Stage', value: lead.stage, render: getStageLabel },
          ].map(({ label, value, render }) =>
            value ? (
              <div key={label} className="flex justify-between items-center py-1.5 border-b border-gray-50">
                <span className="text-sm text-gray-500">{label}</span>
                <span className="text-sm font-medium text-gray-900">
                  {render ? render(value) : value}
                </span>
              </div>
            ) : null
          )}
        </div>

        {/* Call notes */}
        {lead.call_notes && lead.call_notes.length > 0 && (
          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-1.5">Call Notes</p>
            <div className="flex flex-wrap gap-1">
              {lead.call_notes.map((note) => (
                <ChipBadge key={note} label={note.replace(/_/g, ' ')} color="gray" size="sm" />
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Timeline */}
      <Card className="p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Timeline</h3>
        {timeline.length === 0 && calls.length === 0 ? (
          <p className="text-sm text-gray-400">No activity yet</p>
        ) : (
          <div className="space-y-3">
            {calls.map((call) => (
              <div key={call.id} className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0 text-sm">
                  📞
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Call — {call.outcome?.replace(/_/g, ' ') || 'No outcome'}
                  </p>
                  <p className="text-xs text-gray-400">{timeAgo(call.created_at)}</p>
                </div>
              </div>
            ))}
            {timeline.map((activity) => (
              <div key={activity.id} className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-sm">
                  📝
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.action.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-gray-400">{timeAgo(activity.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
