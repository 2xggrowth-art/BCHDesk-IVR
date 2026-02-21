// ============================================================
// BCH CRM - Leads Store (Zustand)
// ============================================================

import { create } from 'zustand';
import { leadsApi } from '@/services/api';
import { supabase, isSupabaseConfigured } from '@/services/supabase';
import type { Lead, LeadStage } from '@/types';

interface LeadsState {
  leads: Lead[];
  currentLead: Lead | null;
  isLoading: boolean;
  filter: {
    stage?: LeadStage;
    score?: string;
    search?: string;
  };

  fetchLeads: (assignedTo?: string) => Promise<void>;
  fetchUnassigned: () => Promise<void>;
  fetchByAssignee: (userId: string) => Promise<void>;
  setCurrentLead: (lead: Lead | null) => void;
  createLead: (lead: Partial<Lead>) => Promise<Lead>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  assignLead: (leadId: string, userId: string) => Promise<void>;
  markSpam: (leadId: string) => Promise<void>;
  searchByPhone: (phone: string) => Promise<Lead | null>;
  setFilter: (filter: Partial<LeadsState['filter']>) => void;
  subscribeToChanges: () => () => void;
}

export const useLeadsStore = create<LeadsState>((set, get) => ({
  leads: [],
  currentLead: null,
  isLoading: false,
  filter: {},

  fetchLeads: async (assignedTo?: string) => {
    set({ isLoading: true });
    try {
      const leads = await leadsApi.getAll(
        assignedTo ? { assigned_to: assignedTo } : undefined
      );
      set({ leads, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch leads:', error);
      set({ isLoading: false });
    }
  },

  fetchUnassigned: async () => {
    set({ isLoading: true });
    try {
      const leads = await leadsApi.getUnassigned();
      set({ leads, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch unassigned leads:', error);
      set({ isLoading: false });
    }
  },

  fetchByAssignee: async (userId: string) => {
    set({ isLoading: true });
    try {
      const leads = await leadsApi.getByAssignee(userId);
      set({ leads, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch leads by assignee:', error);
      set({ isLoading: false });
    }
  },

  setCurrentLead: (lead) => set({ currentLead: lead }),

  createLead: async (lead) => {
    const newLead = await leadsApi.create(lead);
    set((state) => ({ leads: [newLead, ...state.leads] }));
    return newLead;
  },

  updateLead: async (id, updates) => {
    const updated = await leadsApi.update(id, updates);
    set((state) => ({
      leads: state.leads.map((l) => (l.id === id ? { ...l, ...updated } : l)),
      currentLead: state.currentLead?.id === id ? { ...state.currentLead, ...updated } : state.currentLead,
    }));
  },

  assignLead: async (leadId, userId) => {
    await leadsApi.assign(leadId, userId);
    set((state) => ({
      leads: state.leads.map((l) =>
        l.id === leadId ? { ...l, assigned_to: userId, stage: 'qualified' as LeadStage } : l
      ),
    }));
  },

  markSpam: async (leadId) => {
    await leadsApi.markSpam(leadId);
    set((state) => ({
      leads: state.leads.filter((l) => l.id !== leadId),
    }));
  },

  searchByPhone: async (phone) => {
    return leadsApi.searchByPhone(phone);
  },

  setFilter: (filter) => set((state) => ({
    filter: { ...state.filter, ...filter },
  })),

  subscribeToChanges: () => {
    if (!isSupabaseConfigured()) return () => {};

    const channel = supabase
      .channel('leads-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads' },
        (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;

          set((state) => {
            if (eventType === 'INSERT') {
              return { leads: [newRecord as Lead, ...state.leads] };
            }
            if (eventType === 'UPDATE') {
              return {
                leads: state.leads.map((l) =>
                  l.id === (newRecord as Lead).id ? (newRecord as Lead) : l
                ),
                currentLead:
                  state.currentLead?.id === (newRecord as Lead).id
                    ? (newRecord as Lead)
                    : state.currentLead,
              };
            }
            if (eventType === 'DELETE') {
              return {
                leads: state.leads.filter((l) => l.id !== (oldRecord as Lead).id),
              };
            }
            return state;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
}));
