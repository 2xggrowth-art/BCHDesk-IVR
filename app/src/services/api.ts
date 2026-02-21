// ============================================================
// BCH CRM - API Service Layer (Supabase Integration)
// ============================================================

import { supabase, isSupabaseConfigured } from './supabase';
import { cacheData, queueAction, getCachedData } from './offline';
import type {
  Lead, Call, Walkin, Followup, Callback, Activity, User,
  LeadStage, CallOutcome, WalkinOutcome, WalkoutReason, FollowupStatus,
} from '@/types';

// ---- Network Status ----
let isOnline = navigator.onLine;
window.addEventListener('online', () => { isOnline = true; });
window.addEventListener('offline', () => { isOnline = false; });

function canUseSupabase(): boolean {
  return isOnline && isSupabaseConfigured();
}

// ============================================================
// LEADS API
// ============================================================

export const leadsApi = {
  async getAll(filters?: {
    stage?: LeadStage;
    assigned_to?: string;
    score?: string;
    is_spam?: boolean;
  }): Promise<Lead[]> {
    if (!canUseSupabase()) {
      return getCachedData<Lead>('leads');
    }

    let query = supabase.from('leads').select('*').eq('is_spam', false).order('created_at', { ascending: false });

    if (filters?.stage) query = query.eq('stage', filters.stage);
    if (filters?.assigned_to) query = query.eq('assigned_to', filters.assigned_to);
    if (filters?.score) query = query.eq('score', filters.score);
    if (filters?.is_spam !== undefined) query = query.eq('is_spam', filters.is_spam);

    const { data, error } = await query;
    if (error) throw error;

    const leads = (data || []) as Lead[];
    await cacheData('leads', leads);
    return leads;
  },

  async getById(id: string): Promise<Lead | null> {
    if (!canUseSupabase()) {
      const cached = await getCachedData<Lead>('leads');
      return cached.find(l => l.id === id) || null;
    }

    const { data, error } = await supabase.from('leads').select('*').eq('id', id).single();
    if (error) throw error;
    return data as Lead;
  },

  async getUnassigned(): Promise<Lead[]> {
    if (!canUseSupabase()) {
      const cached = await getCachedData<Lead>('leads');
      return cached.filter(l => !l.assigned_to && !l.is_spam);
    }

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .is('assigned_to', null)
      .eq('is_spam', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    const leads = (data || []) as Lead[];
    return leads;
  },

  async getByAssignee(userId: string): Promise<Lead[]> {
    if (!canUseSupabase()) {
      const cached = await getCachedData<Lead>('leads');
      return cached.filter(l => l.assigned_to === userId);
    }

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('assigned_to', userId)
      .eq('is_spam', false)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Lead[];
  },

  async create(lead: Partial<Lead>): Promise<Lead> {
    if (!canUseSupabase()) {
      const offlineLead = { ...lead, id: crypto.randomUUID(), created_at: new Date().toISOString() } as Lead;
      await queueAction('leads', 'insert', offlineLead as unknown as Record<string, unknown>);
      return offlineLead;
    }

    const { data, error } = await supabase.from('leads').insert(lead).select().single();
    if (error) throw error;
    return data as Lead;
  },

  async update(id: string, updates: Partial<Lead>): Promise<Lead> {
    if (!canUseSupabase()) {
      await queueAction('leads', 'update', { id, ...updates } as Record<string, unknown>);
      return { id, ...updates } as Lead;
    }

    const { data, error } = await supabase.from('leads').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data as Lead;
  },

  async markSpam(id: string): Promise<void> {
    await this.update(id, { is_spam: true });
  },

  async assign(leadId: string, userId: string): Promise<Lead> {
    return this.update(leadId, {
      assigned_to: userId,
      stage: 'qualified',
    });
  },

  async getTodayCount(): Promise<number> {
    if (!canUseSupabase()) {
      const cached = await getCachedData<Lead>('leads');
      const today = new Date().toISOString().split('T')[0];
      return cached.filter(l => l.created_at.startsWith(today)).length;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count, error } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    if (error) throw error;
    return count || 0;
  },

  async searchByPhone(phone: string): Promise<Lead | null> {
    if (!canUseSupabase()) {
      const cached = await getCachedData<Lead>('leads');
      return cached.find(l => l.phone === phone) || null;
    }

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .eq('phone', phone)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data as Lead | null;
  },
};

// ============================================================
// CALLS API
// ============================================================

export const callsApi = {
  async getByLead(leadId: string): Promise<Call[]> {
    if (!canUseSupabase()) {
      const cached = await getCachedData<Call>('calls');
      return cached.filter(c => c.lead_id === leadId);
    }

    const { data, error } = await supabase
      .from('calls')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Call[];
  },

  async logCall(call: {
    lead_id: string;
    user_id: string;
    outcome: CallOutcome;
    notes?: string[];
    duration_seconds?: number;
  }): Promise<Call> {
    if (!canUseSupabase()) {
      const offlineCall = { ...call, id: crypto.randomUUID(), created_at: new Date().toISOString(), is_missed: false } as Call;
      await queueAction('calls', 'insert', offlineCall as unknown as Record<string, unknown>);
      return offlineCall;
    }

    const { data, error } = await supabase.from('calls').insert(call).select().single();
    if (error) throw error;

    // Also update lead's last_contact
    await supabase.from('leads').update({ last_contact: new Date().toISOString() }).eq('id', call.lead_id);

    return data as Call;
  },
};

// ============================================================
// WALKINS API
// ============================================================

export const walkinsApi = {
  async getToday(): Promise<Walkin[]> {
    if (!canUseSupabase()) {
      return getCachedData<Walkin>('walkins');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('walkins')
      .select('*')
      .gte('created_at', today.toISOString())
      .order('created_at', { ascending: false });

    if (error) throw error;
    const walkins = (data || []) as Walkin[];
    await cacheData('walkins', walkins);
    return walkins;
  },

  async create(walkin: Partial<Walkin>): Promise<Walkin> {
    if (!canUseSupabase()) {
      const offlineWalkin = { ...walkin, id: crypto.randomUUID(), created_at: new Date().toISOString() } as Walkin;
      await queueAction('walkins', 'insert', offlineWalkin as unknown as Record<string, unknown>);
      return offlineWalkin;
    }

    const { data, error } = await supabase.from('walkins').insert(walkin).select().single();
    if (error) throw error;
    return data as Walkin;
  },

  async updateOutcome(id: string, outcome: WalkinOutcome, details?: {
    walkout_reason?: WalkoutReason;
    purchase_amount?: number;
    invoice_number?: string;
    follow_up_date?: string;
  }): Promise<Walkin> {
    const updates = { outcome, ...details };

    if (!canUseSupabase()) {
      await queueAction('walkins', 'update', { id, ...updates } as Record<string, unknown>);
      return { id, ...updates } as Walkin;
    }

    const { data, error } = await supabase.from('walkins').update(updates).eq('id', id).select().single();
    if (error) throw error;
    return data as Walkin;
  },
};

// ============================================================
// FOLLOWUPS API
// ============================================================

export const followupsApi = {
  async getByUser(userId: string, status?: FollowupStatus): Promise<Followup[]> {
    if (!canUseSupabase()) {
      const cached = await getCachedData<Followup>('followups');
      return cached.filter(f => f.user_id === userId && (!status || f.status === status));
    }

    let query = supabase.from('followups').select('*').eq('user_id', userId).order('next_date', { ascending: true });

    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw error;
    return (data || []) as Followup[];
  },

  async getDueToday(userId: string): Promise<Followup[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (!canUseSupabase()) {
      const cached = await getCachedData<Followup>('followups');
      return cached.filter(f =>
        f.user_id === userId &&
        f.status === 'pending' &&
        new Date(f.next_date) >= today &&
        new Date(f.next_date) < tomorrow
      );
    }

    const { data, error } = await supabase
      .from('followups')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .gte('next_date', today.toISOString())
      .lt('next_date', tomorrow.toISOString());

    if (error) throw error;
    return (data || []) as Followup[];
  },

  async create(followup: {
    lead_id: string;
    user_id: string;
    next_date: string;
    notes?: string;
  }): Promise<Followup> {
    if (!canUseSupabase()) {
      const offline = { ...followup, id: crypto.randomUUID(), status: 'pending' as const, created_at: new Date().toISOString(), completed_at: null } as Followup;
      await queueAction('followups', 'insert', offline as unknown as Record<string, unknown>);
      return offline;
    }

    const { data, error } = await supabase.from('followups').insert(followup).select().single();
    if (error) throw error;

    // Update lead follow_up_date
    await supabase.from('leads').update({ follow_up_date: followup.next_date }).eq('id', followup.lead_id);

    return data as Followup;
  },

  async markCompleted(id: string): Promise<void> {
    if (!canUseSupabase()) {
      await queueAction('followups', 'update', { id, status: 'completed', completed_at: new Date().toISOString() });
      return;
    }

    await supabase.from('followups').update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    }).eq('id', id);
  },
};

// ============================================================
// CALLBACKS API
// ============================================================

export const callbacksApi = {
  async getPending(): Promise<Callback[]> {
    if (!canUseSupabase()) {
      const cached = await getCachedData<Callback>('callbacks');
      return cached.filter(c => c.status === 'pending');
    }

    const { data, error } = await supabase
      .from('callbacks')
      .select('*')
      .eq('status', 'pending')
      .order('missed_at', { ascending: true });

    if (error) throw error;
    const callbacks = (data || []) as Callback[];
    await cacheData('callbacks', callbacks);
    return callbacks;
  },

  async markHandled(id: string, userId: string, status: 'called_back' | 'skipped'): Promise<void> {
    if (!canUseSupabase()) {
      await queueAction('callbacks', 'update', { id, status, handled_by: userId, handled_at: new Date().toISOString() });
      return;
    }

    await supabase.from('callbacks').update({
      status,
      handled_by: userId,
      handled_at: new Date().toISOString(),
    }).eq('id', id);
  },

  async create(callback: Partial<Callback>): Promise<Callback> {
    if (!canUseSupabase()) {
      const offline = { ...callback, id: crypto.randomUUID(), created_at: new Date().toISOString() } as Callback;
      await queueAction('callbacks', 'insert', offline as unknown as Record<string, unknown>);
      return offline;
    }

    const { data, error } = await supabase.from('callbacks').insert(callback).select().single();
    if (error) throw error;
    return data as Callback;
  },
};

// ============================================================
// ACTIVITIES API
// ============================================================

export const activitiesApi = {
  async getRecent(limit = 50): Promise<Activity[]> {
    if (!canUseSupabase()) return [];

    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return (data || []) as Activity[];
  },

  async getByLead(leadId: string): Promise<Activity[]> {
    if (!canUseSupabase()) return [];

    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('lead_id', leadId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as Activity[];
  },

  async log(activity: {
    user_id?: string;
    lead_id?: string;
    walkin_id?: string;
    action: string;
    details?: Record<string, unknown>;
  }): Promise<void> {
    if (!canUseSupabase()) return;

    await supabase.from('activities').insert(activity);
  },
};

// ============================================================
// USERS API
// ============================================================

export const usersApi = {
  async getAll(): Promise<User[]> {
    if (!canUseSupabase()) {
      return getCachedData<User>('users');
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    const users = (data || []) as User[];
    await cacheData('users', users);
    return users;
  },

  async getByRole(role: string): Promise<User[]> {
    if (!canUseSupabase()) {
      const cached = await getCachedData<User>('users');
      return cached.filter(u => u.role === role);
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('role', role)
      .eq('is_active', true);

    if (error) throw error;
    return (data || []) as User[];
  },
};

// ============================================================
// DASHBOARD STATS API (Manager)
// ============================================================

export const dashboardApi = {
  async getDailyStats(): Promise<Record<string, unknown>> {
    if (!canUseSupabase()) return {};

    const { data, error } = await supabase.from('daily_stats').select('*').order('day', { ascending: false }).limit(7);
    if (error) throw error;
    return { daily: data };
  },

  async getStaffPerformance(): Promise<Record<string, unknown>[]> {
    if (!canUseSupabase()) return [];

    const { data, error } = await supabase.from('staff_performance').select('*');
    if (error) throw error;
    return (data || []) as Record<string, unknown>[];
  },

  async getSourceStats(): Promise<Record<string, unknown>[]> {
    if (!canUseSupabase()) return [];

    const { data, error } = await supabase
      .from('leads')
      .select('source, stage, purchase_amount')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Aggregate by source
    const sourceMap = new Map<string, { calls: number; qualified: number; visits: number; purchased: number; revenue: number }>();
    for (const lead of (data || []) as Lead[]) {
      const existing = sourceMap.get(lead.source) || { calls: 0, qualified: 0, visits: 0, purchased: 0, revenue: 0 };
      existing.calls++;
      if (['qualified', 'follow_up_active', 'visit_scheduled', 'visit_done', 'purchased', 'post_sale'].includes(lead.stage)) {
        existing.qualified++;
      }
      if (['visit_done', 'purchased', 'post_sale'].includes(lead.stage)) {
        existing.visits++;
      }
      if (lead.stage === 'purchased' || lead.stage === 'post_sale') {
        existing.purchased++;
        existing.revenue += lead.purchase_amount || 0;
      }
      sourceMap.set(lead.source, existing);
    }

    return Array.from(sourceMap.entries()).map(([source, stats]) => ({
      source,
      ...stats,
    }));
  },

  async getPipelineCounts(): Promise<Record<string, number>> {
    if (!canUseSupabase()) return {};

    const { data, error } = await supabase.from('leads').select('stage');
    if (error) throw error;

    const counts: Record<string, number> = {};
    for (const lead of (data || []) as { stage: string }[]) {
      counts[lead.stage] = (counts[lead.stage] || 0) + 1;
    }
    return counts;
  },
};

// ============================================================
// SYNC SERVICE (Offline → Online)
// ============================================================

export async function syncPendingActions(): Promise<number> {
  if (!canUseSupabase()) return 0;

  const { getPendingActions, removePendingAction } = await import('./offline');
  const pending = await getPendingActions();
  let synced = 0;

  for (const action of pending) {
    try {
      if (action.action === 'insert') {
        await supabase.from(action.table).insert(action.data);
      } else if (action.action === 'update') {
        const { id, ...updates } = action.data;
        await supabase.from(action.table).update(updates).eq('id', id);
      } else if (action.action === 'delete') {
        await supabase.from(action.table).delete().eq('id', action.data.id);
      }
      await removePendingAction(action.id);
      synced++;
    } catch {
      // Keep in queue for next sync attempt
      console.error(`Failed to sync action ${action.id}`);
    }
  }

  return synced;
}
