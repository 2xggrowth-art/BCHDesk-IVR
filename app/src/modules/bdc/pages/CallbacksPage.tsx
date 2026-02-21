// ============================================================
// BCH CRM - BDC Callbacks Queue Page
// ============================================================

import { useEffect, useState } from 'react';
import { Card, AlertCard } from '@/components/ui/Card';
import { ActionButton } from '@/components/ui/Button';
import { ChipBadge } from '@/components/ui/Chip';
import { callbacksApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { timeAgo, getSourceLabel, getInterestLabel } from '@/utils/format';
import type { Callback } from '@/types';

export function CallbacksPage() {
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

  const handleCall = async (cb: Callback) => {
    // Open phone dialer
    window.open(`tel:${cb.phone}`, '_self');
    await callbacksApi.markHandled(cb.id, user!.id, 'called_back');
    setCallbacks((prev) => prev.filter((c) => c.id !== cb.id));
    showToast('Callback handled', 'success');
  };

  const handleSkip = async (cb: Callback) => {
    await callbacksApi.markHandled(cb.id, user!.id, 'skipped');
    setCallbacks((prev) => prev.filter((c) => c.id !== cb.id));
    showToast('Callback skipped', 'warning');
  };

  // Find oldest callback
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

      {/* Callback cards */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading callbacks...</div>
      ) : callbacks.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-4xl">✅</span>
          <p className="text-gray-500 mt-2 text-sm">All callbacks handled!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {callbacks.map((cb) => (
            <Card key={cb.id} className="p-4">
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
                  Missed {timeAgo(cb.missed_at)}
                </span>
              </div>

              <div className="flex gap-2">
                <ActionButton label="CALL" icon="📞" color="blue" onClick={() => handleCall(cb)} />
                <ActionButton label="LATER" icon="⏰" color="orange" onClick={() => {}} />
                <ActionButton label="SKIP" icon="⏩" color="red" onClick={() => handleSkip(cb)} />
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
