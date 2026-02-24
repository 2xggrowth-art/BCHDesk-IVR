// ============================================================
// BCH CRM - BDC Leads List Page
// ============================================================

import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeadCard } from '@/components/shared/LeadCard';
import { useLeadsStore } from '@/store/leadsStore';
import { supabase, isSupabaseConfigured } from '@/services/supabase';
import { setSupabaseSessionReady } from '@/services/api';

export function LeadsListPage() {
  const navigate = useNavigate();
  const { leads, isLoading, fetchLeads } = useLeadsStore();
  const [filter, setFilter] = useState('all');

  // Fetch leads on mount, and re-fetch when Supabase session becomes available
  const loadLeads = useCallback(() => { fetchLeads(); }, [fetchLeads]);

  useEffect(() => {
    loadLeads();

    // Listen for Supabase auth state changes — re-fetch when session is established
    if (!isSupabaseConfigured()) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        setSupabaseSessionReady(true);
        loadLeads();
      }
    });
    return () => { subscription.unsubscribe(); };
  }, [loadLeads]);

  const filteredLeads = leads.filter((lead) => {
    if (filter === 'today') {
      return lead.created_at.startsWith(new Date().toISOString().split('T')[0]);
    }
    if (filter === 'callback') {
      return lead.stage === 'bdc_contacted';
    }
    if (filter === 'followup') {
      return lead.follow_up_date !== null;
    }
    return true;
  });

  const todayCount = leads.filter((l) =>
    l.created_at.startsWith(new Date().toISOString().split('T')[0])
  ).length;

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'today', label: 'Today' },
    { id: 'callback', label: 'Callback' },
    { id: 'followup', label: 'Follow-up' },
  ];

  return (
    <div className="p-4 pb-24">
      {/* Filter chips */}
      <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`
              px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap
              transition-all active:scale-95
              ${filter === f.id
                ? 'bg-primary-500 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200'
              }
            `}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div className="bg-white rounded-xl p-3 mb-4 border border-gray-100">
        <p className="text-[10px] text-gray-500 font-semibold uppercase">
          TODAY | {todayCount} qualified | {leads.filter((l) => l.assigned_to).length} assigned
        </p>
      </div>

      {/* Lead cards */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading leads...</div>
      ) : filteredLeads.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No leads found</div>
      ) : (
        <div className="space-y-3">
          {filteredLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onClick={() => navigate(`/bdc/leads/${lead.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
