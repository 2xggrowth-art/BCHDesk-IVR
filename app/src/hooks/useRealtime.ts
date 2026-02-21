// ============================================================
// BCH CRM - Realtime Subscription Hook
// ============================================================

import { useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/services/supabase';

type RealtimeCallback = (payload: {
  eventType: string;
  new: Record<string, unknown>;
  old: Record<string, unknown>;
}) => void;

export function useRealtime(
  table: string,
  callback: RealtimeCallback,
  enabled = true
) {
  useEffect(() => {
    if (!enabled || !isSupabaseConfigured()) return;

    const channel = supabase
      .channel(`${table}-realtime`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        (payload) => {
          callback({
            eventType: payload.eventType,
            new: payload.new as Record<string, unknown>,
            old: payload.old as Record<string, unknown>,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, callback, enabled]);
}
