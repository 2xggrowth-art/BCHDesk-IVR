// ============================================================
// BCH CRM - BDC Callbacks Queue Page
// Shows pending callbacks, lets caller call back & create lead
// ============================================================

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, AlertCard } from '@/components/ui/Card';
import { ChipBadge } from '@/components/ui/Chip';
import { callbacksApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { timeAgo, getSourceLabel, getInterestLabel } from '@/utils/format';
import type { Callback } from '@/types';

export function CallbacksPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { showToast } = useUIStore();
  const [callbacks, setCallbacks] = useState<Callback[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCallbacks();
  }, []);

  const loadCallbacks = async () => {
    setIsLoading(true);
    try {
      const data = await callbacksApi.getPending();
      setCallbacks(data);
    } catch {
      showToast('Failed to load callbacks', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Call back & then go to qualify page with that number
  const handleCallAndQualify = async (cb: Callback) => {
    window.open(`tel:${cb.phone}`, '_self');
    try {
      await callbacksApi.markHandled(cb.id, user!.id, 'called_back');
    } catch { /* ignore */ }
    // Navigate to incoming page with phone pre-filled for qualification
    navigate(`/bdc/incoming?phone=${encodeURIComponent(cb.phone)}`);
  };

  // Just create lead directly without calling
  const handleCreateLead = async (cb: Callback) => {
    try {
      await callbacksApi.markHandled(cb.id, user!.id, 'called_back');
    } catch { /* ignore */ }
    navigate(`/bdc/incoming?phone=${encodeURIComponent(cb.phone)}`);
  };

  const handleSkip = async (cb: Callback) => {
    try {
      await callbacksApi.markHandled(cb.id, user!.id, 'skipped');
      setCallbacks((prev) => prev.filter((c) => c.id !== cb.id));
      showToast('Callback skipped', 'warning');
    } catch {
      showToast('Failed to skip', 'error');
    }
  };

  const oldestTime = callbacks.length > 0
    ? timeAgo(callbacks[callbacks.length - 1].missed_at)
    : 'N/A';

  return (
    <div className="p-4 pb-24">
      {/* Warning banner */}
      {callbacks.length > 0 && (
        <AlertCard variant="danger" className="mb-4">
          <p className="text-sm font-bold">⚠️ {callbacks.length} callbacks waiting</p>
          <p className="text-xs mt-1">Respond within 15 min of missed call</p>
        </AlertCard>
      )}

      {/* Header with refresh */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-gray-900">Callbacks</h2>
        <button
          onClick={loadCallbacks}
          className="text-xs font-medium text-primary-500 px-3 py-1.5 bg-primary-50 rounded-lg active:scale-95"
        >
          Refresh
        </button>
      </div>

      {/* Callback cards */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading callbacks...</p>
        </div>
      ) : callbacks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p className="text-base font-bold text-gray-700">All callbacks handled!</p>
          <p className="text-sm text-gray-400 mt-1">No pending callbacks right now</p>
        </div>
      ) : (
        <div className="space-y-3">
          {callbacks.map((cb) => (
            <Card key={cb.id} className="p-4 border-l-3 border-l-red-400">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-base font-bold text-gray-900">{cb.phone}</p>
                  <div className="flex gap-1.5 mt-1">
                    {cb.source && (
                      <ChipBadge label={getSourceLabel(cb.source)} color="purple" />
                    )}
                    {cb.interest && (
                      <ChipBadge label={getInterestLabel(cb.interest)} color="blue" />
                    )}
                  </div>
                </div>
                <span className="px-2 py-1 bg-danger-50 text-danger-500 text-[10px] font-bold rounded-full">
                  {timeAgo(cb.missed_at)}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleCallAndQualify(cb)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-green-50 text-green-700 rounded-xl text-xs font-semibold active:scale-95"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  Call & Qualify
                </button>
                <button
                  onClick={() => handleCreateLead(cb)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-primary-50 text-primary-700 rounded-xl text-xs font-semibold active:scale-95"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" />
                  </svg>
                  Create Lead
                </button>
                <button
                  onClick={() => handleSkip(cb)}
                  className="px-3 flex items-center justify-center py-2.5 bg-gray-100 text-gray-500 rounded-xl text-xs font-semibold active:scale-95"
                >
                  Skip
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Footer stats */}
      {callbacks.length > 0 && (
        <div className="mt-4 text-center text-xs text-gray-400">
          Oldest: {oldestTime} | Target: within 15 min
        </div>
      )}
    </div>
  );
}
