// ============================================================
// BCH CRM - Staff: Walk-in Capture Page
// ============================================================

import { useState } from 'react';
import { Card, AlertCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChipGroup, ChipBadge } from '@/components/ui/Chip';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { INTERESTS, WALKOUT_REASONS } from '@/config/constants';
import { leadsApi, walkinsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { getInterestLabel, getBudgetLabel } from '@/utils/format';
import type { Lead, LeadInterest, WalkinOutcome, WalkoutReason } from '@/types';

export function WalkinPage() {
  const { user } = useAuthStore();
  const { showToast } = useUIStore();

  const [phone, setPhone] = useState('');
  const [matchedLead, setMatchedLead] = useState<Lead | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [hasChecked, setHasChecked] = useState(false);

  const [interest, setInterest] = useState('');
  const [outcome, setOutcome] = useState<WalkinOutcome | ''>('');
  const [walkoutReason, setWalkoutReason] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');

  const handleCheckPhone = async () => {
    if (!phone || phone.length < 10) {
      showToast('Enter a valid phone number', 'warning');
      return;
    }

    setIsChecking(true);
    try {
      const lead = await leadsApi.searchByPhone(phone);
      setMatchedLead(lead);
      if (lead) {
        setInterest(lead.interest || '');
      }
      setHasChecked(true);
    } catch {
      showToast('Error checking phone', 'error');
    } finally {
      setIsChecking(false);
    }
  };

  const handleCapture = async () => {
    try {
      const walkin = await walkinsApi.create({
        phone: phone || null,
        matched_lead_id: matchedLead?.id || null,
        interest: (interest as LeadInterest) || null,
        assigned_to: user?.id,
        is_from_lead: !!matchedLead,
        outcome: (outcome as WalkinOutcome) || null,
        walkout_reason: outcome === 'walked_out' ? (walkoutReason as WalkoutReason) : null,
        invoice_number: outcome === 'purchased' ? invoiceNumber : null,
        follow_up_date: outcome === 'coming_back' ? new Date(followUpDate).toISOString() : null,
      });

      // If purchased, update the lead too
      if (outcome === 'purchased' && matchedLead) {
        await leadsApi.update(matchedLead.id, {
          stage: 'purchased',
          visit_date: new Date().toISOString(),
          invoice_number: invoiceNumber,
        });
      }

      showToast('Walk-in captured!', 'success');
      resetForm();
    } catch {
      showToast('Failed to capture walk-in', 'error');
    }
  };

  const resetForm = () => {
    setPhone('');
    setMatchedLead(null);
    setHasChecked(false);
    setInterest('');
    setOutcome('');
    setWalkoutReason('');
    setInvoiceNumber('');
    setFollowUpDate('');
  };

  return (
    <div className="p-4 pb-24 space-y-4">
      <h2 className="text-base font-bold text-gray-900">Capture Walk-in</h2>

      {/* Phone input */}
      <Card className="p-4">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Customer Phone (optional)
        </label>
        <div className="flex gap-2">
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number..."
            className="flex-1 px-4 py-3 text-base border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-300 outline-none"
            maxLength={10}
          />
          <Button
            variant="primary"
            size="md"
            onClick={handleCheckPhone}
            disabled={isChecking || phone.length < 10}
          >
            {isChecking ? '...' : 'CHECK'}
          </Button>
        </div>
      </Card>

      {/* Matched lead banner */}
      {hasChecked && matchedLead && (
        <AlertCard variant="success">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-bold text-sm">✅ Lead Found!</span>
            <ScoreBadge score={matchedLead.score} />
          </div>
          <p className="text-sm font-medium">{matchedLead.name || matchedLead.phone}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {matchedLead.interest && <ChipBadge label={getInterestLabel(matchedLead.interest)} color="blue" size="sm" />}
            {matchedLead.budget && <ChipBadge label={getBudgetLabel(matchedLead.budget)} color="green" size="sm" />}
            {matchedLead.brand && <ChipBadge label={matchedLead.brand} color="purple" size="sm" />}
          </div>
        </AlertCard>
      )}

      {hasChecked && !matchedLead && (
        <AlertCard variant="info">
          <p className="text-sm font-bold">Fresh walk-in — no prior record</p>
        </AlertCard>
      )}

      {/* Interest (if no matched lead or fresh walk-in) */}
      {(!matchedLead || !matchedLead.interest) && (
        <ChipGroup
          label="Interest"
          options={INTERESTS}
          value={interest}
          onChange={(v) => setInterest(v as string)}
          size="lg"
          columns={3}
        />
      )}

      {/* Outcome buttons */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Outcome
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: 'purchased', label: 'PURCHASED', color: 'bg-success-500' },
            { value: 'walked_out', label: 'WALKED OUT', color: 'bg-danger-500' },
            { value: 'coming_back', label: 'COMING BACK', color: 'bg-warning-500' },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setOutcome(opt.value as WalkinOutcome)}
              className={`
                py-4 rounded-xl text-xs font-bold transition-all active:scale-95
                ${outcome === opt.value ? `${opt.color} text-white shadow-md ring-2 ring-offset-1` : 'bg-gray-100 text-gray-700'}
              `}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Conditional fields based on outcome */}
      {outcome === 'purchased' && (
        <Card className="p-4">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Invoice Number
          </label>
          <input
            type="text"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            placeholder="Enter invoice number..."
            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-300 outline-none"
          />
        </Card>
      )}

      {outcome === 'walked_out' && (
        <ChipGroup
          label="Walk-out Reason"
          options={WALKOUT_REASONS}
          value={walkoutReason}
          onChange={(v) => setWalkoutReason(v as string)}
          size="lg"
          columns={2}
        />
      )}

      {outcome === 'coming_back' && (
        <Card className="p-4">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Expected Return Date
          </label>
          <input
            type="date"
            value={followUpDate}
            onChange={(e) => setFollowUpDate(e.target.value)}
            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-300 outline-none"
          />
        </Card>
      )}

      {/* Capture button */}
      <Button
        variant="success"
        size="xl"
        fullWidth
        onClick={handleCapture}
        disabled={!interest && !matchedLead?.interest}
      >
        CAPTURE WALK-IN
      </Button>
    </div>
  );
}
