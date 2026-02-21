// ============================================================
// BCH CRM - BDC Incoming Call Screen
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, AlertCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChipBadge } from '@/components/ui/Chip';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { useLeadsStore } from '@/store/leadsStore';
import { useUIStore } from '@/store/uiStore';
import { getSourceLabel, getInterestLabel } from '@/utils/format';
import type { Lead } from '@/types';

export function IncomingPage() {
  const navigate = useNavigate();
  const { markSpam } = useLeadsStore();
  const { showToast } = useUIStore();

  // Simulated incoming call data (in production, from IVR/CallerDesk webhook)
  const [incomingCall] = useState({
    phone: '9876543210',
    source: 'bch_toyz_ig' as const,
    location: 'Bangalore',
    ageBracket: '12+',
    interest: 'electric' as const,
    language: 'english',
  });

  const [returningLead] = useState<Lead | null>(null);

  const handleQualify = () => {
    navigate('/bdc/qualify', {
      state: { incomingCall },
    });
  };

  const handleSpam = async () => {
    showToast('Marked as spam/wrong number', 'warning');
  };

  return (
    <div className="p-4 pb-24 space-y-4">
      {/* Ringing animation */}
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success-500 animate-pulse mb-4">
          <span className="text-4xl animate-ring">📞</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
          {incomingCall.phone}
        </h2>
        <p className="text-sm text-gray-500 mt-1">Incoming Qualified Call</p>
      </div>

      {/* Auto-populated caller details */}
      <Card className="p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          IVR Auto-Captured Data
        </h3>
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Source</span>
            <ChipBadge label={getSourceLabel(incomingCall.source)} color="purple" size="sm" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Location</span>
            <ChipBadge label={incomingCall.location} color="green" size="sm" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Age Bracket</span>
            <ChipBadge label={incomingCall.ageBracket} color="blue" size="sm" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Interest</span>
            <ChipBadge label={getInterestLabel(incomingCall.interest)} color="orange" size="sm" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Language</span>
            <ChipBadge label={incomingCall.language} color="gray" size="sm" />
          </div>
        </div>
      </Card>

      {/* Returning caller banner */}
      {returningLead && (
        <AlertCard variant="info">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold">🔄 Returning Caller</span>
            <ScoreBadge score={returningLead.score} />
          </div>
          <p className="text-xs">
            {returningLead.name} — Previously asked about {returningLead.interest}
          </p>
        </AlertCard>
      )}

      {/* Action buttons */}
      <div className="space-y-3 pt-2">
        <Button
          variant="primary"
          size="xl"
          fullWidth
          onClick={handleQualify}
          icon={<span>📋</span>}
        >
          QUALIFY THIS LEAD
        </Button>

        <Button
          variant="danger"
          size="lg"
          fullWidth
          onClick={handleSpam}
          icon={<span>🚫</span>}
        >
          SPAM / WRONG NUMBER
        </Button>
      </div>
    </div>
  );
}
