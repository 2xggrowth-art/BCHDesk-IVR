// ============================================================
// BCH CRM - Supabase Client
// ============================================================

import { createClient } from '@supabase/supabase-js';
import { ENV } from '@/config/env';

const supabaseUrl = ENV.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = ENV.SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false, // Mobile app, no URL auth
    flowType: 'implicit',
  },
  global: {
    headers: {
      apikey: supabaseKey,
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
      apikey: supabaseKey,
    },
  },
});

export function isSupabaseConfigured(): boolean {
  return Boolean(ENV.SUPABASE_URL && ENV.SUPABASE_ANON_KEY);
}
