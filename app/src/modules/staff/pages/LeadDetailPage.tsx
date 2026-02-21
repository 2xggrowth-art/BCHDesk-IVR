// ============================================================
// BCH CRM - Staff: Lead Detail Page
// ============================================================

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button, ActionButton } from '@/components/ui/Button';
import { ChipGroup, ChipBadge } from '@/components/ui/Chip';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { CALL_OUTCOMES } from '@/config/constants';
import { leadsApi, callsApi, followupsApi, activitiesApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import {
  getSourceLabel, getBudgetLabel, getInterestLabel, getStageLabel,
  timeAgo, formatDate,
} from '@/utils/format';
import type { Lead, Call, Activity, CallOutcome } from '@/types';

export function LeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const { showToast } = useUIStore();

  const [lead, setLead] = useState<Lead | null>(null);
  const [calls, setCalls] = useState<Call[]>([]);
  const [timeline, setTimeline] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Outcome logging state
  const [showOutcome, setShowOutcome] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState<string>('');
  const [followUpDate, setFollowUpDate] = useState('');

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
      window.open(`tel:${lead.phone}`, '_self');
      setShowOutcome(true);
    }
  };

  const handleWhatsApp = () => {
    if (lead?.phone) {
      const msg = encodeURIComponent(
        `Hi ${lead.name || ''}! This is from Bharath Cycle Hub. Thank you for your interest in our ${lead.interest || 'cycles'}. How can we help you today?`
      );
      window.open(`https://wa.me/91${lead.phone}?text=${msg}`, '_blank');
    }
  };

  const handleLogOutcome = async () => {
    if (!selectedOutcome || !lead || !user) return;

    try {
      await callsApi.logCall({
        lead_id: lead.id,
        user_id: user.id,
        outcome: selectedOutcome as CallOutcome,
      });

      // Update lead stage based on outcome
      let newStage = lead.stage;
      if (['coming_today', 'coming_tomorrow', 'coming_weekend', 'coming_next_week'].includes(selectedOutcome)) {
        newStage = 'visit_scheduled';
      } else if (['not_interested', 'wrong_number'].includes(selectedOutcome)) {
        newStage = 'lost';
      } else {
        newStage = 'follow_up_active';
      }

      await leadsApi.update(lead.id, {
        stage: newStage,
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

      showToast('Call outcome logged', 'success');
      setShowOutcome(false);
      setSelectedOutcome('');
      setFollowUpDate('');
      loadLeadDetail(lead.id);
    } catch {
      showToast('Failed to log outcome', 'error');
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-gray-400">Loading...</div>;
  }

  if (!lead) {
    return <div className="flex items-center justify-center py-20 text-gray-400">Lead not found</div>;
  }

  return (
    <div className="p-4 pb-24 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">{lead.name || lead.phone}</h2>
          {lead.name && <p className="text-sm text-gray-500">{lead.phone}</p>}
        </div>
        <ScoreBadge score={lead.score} size="md" showValue value={lead.score_value} />
      </div>

      {/* Quick action buttons */}
      <div className="flex gap-3">
        <ActionButton label="CALL NOW" icon="📞" color="blue" onClick={handleCall} />
        <ActionButton label="WHATSAPP" icon="💬" color="green" onClick={handleWhatsApp} />
      </div>

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
              <div key={label} className="flex justify-between items-center py-1 border-b border-gray-50">
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

      {/* Outcome section (shown after call) */}
      {showOutcome && (
        <Card className="p-4 border-2 border-primary-200">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Log Call Outcome</h3>

          <ChipGroup
            label="What happened?"
            options={CALL_OUTCOMES}
            value={selectedOutcome}
            onChange={(v) => setSelectedOutcome(v as string)}
            size="lg"
            columns={3}
          />

          <div className="mt-3">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Schedule Follow-up
            </label>
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-300 outline-none"
            />
          </div>

          <Button
            variant="success"
            size="lg"
            fullWidth
            onClick={handleLogOutcome}
            disabled={!selectedOutcome}
            className="mt-4"
          >
            LOG THIS CALL
          </Button>
        </Card>
      )}

      {!showOutcome && (
        <Button
          variant="outline"
          size="md"
          fullWidth
          onClick={() => setShowOutcome(true)}
        >
          Log Call Outcome
        </Button>
      )}

      {/* Timeline */}
      <Card className="p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Timeline</h3>
        {timeline.length === 0 && calls.length === 0 ? (
          <p className="text-sm text-gray-400">No activity yet</p>
        ) : (
          <div className="space-y-3">
            {calls.map((call) => (
              <div key={call.id} className="flex gap-3 items-start">
                <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
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
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
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
