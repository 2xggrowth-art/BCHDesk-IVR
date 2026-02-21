// ============================================================
// BCH CRM - Sync Hook (Online/Offline Sync Manager)
// ============================================================

import { useEffect, useCallback, useRef } from 'react';
import { useUIStore } from '@/store/uiStore';
import { syncPendingActions } from '@/services/api';
import { getPendingCount } from '@/services/offline';

export function useSync() {
  const { setOffline, setPendingSyncCount, showToast, isOffline } = useUIStore();
  const syncIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const performSync = useCallback(async () => {
    const pendingCount = await getPendingCount();
    setPendingSyncCount(pendingCount);

    if (pendingCount > 0 && navigator.onLine) {
      try {
        const synced = await syncPendingActions();
        if (synced > 0) {
          showToast(`Synced ${synced} offline actions`, 'success');
          const remaining = await getPendingCount();
          setPendingSyncCount(remaining);
        }
      } catch {
        // Will retry on next interval
      }
    }
  }, [setPendingSyncCount, showToast]);

  useEffect(() => {
    // Check pending count on mount
    performSync();

    // Sync when coming back online
    const handleOnline = () => {
      setOffline(false);
      showToast('Back online! Syncing...', 'info');
      performSync();
    };

    const handleOffline = () => {
      setOffline(true);
      showToast('You are offline. Changes will sync later.', 'warning');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic sync every 30 seconds
    syncIntervalRef.current = setInterval(performSync, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [performSync, setOffline, showToast]);

  return { performSync, isOffline };
}
