// ============================================================
// BCH CRM - Staff: My Leads Page
// ============================================================

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LeadCard } from '@/components/shared/LeadCard';
import { AlertCard, StatCard } from '@/components/ui/Card';
import { useLeadsStore } from '@/store/leadsStore';
import { useAuthStore } from '@/store/authStore';

export function MyLeadsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { leads, isLoading, fetchByAssignee, subscribeToChanges } = useLeadsStore();
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchByAssignee(user.id);
      const unsub = subscribeToChanges();
      return unsub;
    }
  }, [user, fetchByAssignee, subscribeToChanges]);

  const urgentLeads = leads.filter(
    (l) => !l.last_contact && new Date(l.created_at).getTime() < Date.now() - 2 * 3600000
  );
  const followUpsDue = leads.filter(
    (l) => l.follow_up_date && new Date(l.follow_up_date).toDateString() === new Date().toDateString()
  );
  const newLeads = leads.filter(
    (l) => l.stage === 'qualified' && !l.last_contact
  );

  const filteredLeads = leads.filter((l) => {
    if (filter === 'new') return l.stage === 'qualified' && !l.last_contact;
    if (filter === 'followup') return l.stage === 'follow_up_active';
    if (filter === 'visit') return l.stage === 'visit_scheduled';
    if (filter === 'visited') return l.stage === 'visit_done';
    return true;
  });

  const pipelineCounts = {
    new: leads.filter((l) => l.stage === 'qualified' && !l.last_contact).length,
    followup: leads.filter((l) => l.stage === 'follow_up_active').length,
    visit: leads.filter((l) => l.stage === 'visit_scheduled').length,
    visited: leads.filter((l) => l.stage === 'visit_done').length,
  };

  const purchased = leads.filter((l) => l.stage === 'purchased').length;
  const contacted = leads.filter((l) => l.last_contact).length;

  return (
    <div className="p-4 pb-24">
      {/* Alert cards */}
      {urgentLeads.length > 0 && (
        <AlertCard variant="danger" className="mb-2">
          <p className="text-sm font-bold">{urgentLeads.length} URGENT — Action needed NOW</p>
        </AlertCard>
      )}
      {followUpsDue.length > 0 && (
        <AlertCard variant="warning" className="mb-2">
          <p className="text-sm font-bold">{followUpsDue.length} Follow-ups due TODAY</p>
        </AlertCard>
      )}
      {newLeads.length > 0 && (
        <AlertCard variant="info" className="mb-3">
          <p className="text-sm font-bold">{newLeads.length} New leads assigned</p>
        </AlertCard>
      )}

      {/* Pipeline strip */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <StatCard label="New" value={pipelineCounts.new} color="blue" />
        <StatCard label="Follow-up" value={pipelineCounts.followup} color="orange" />
        <StatCard label="Visit" value={pipelineCounts.visit} color="green" />
        <StatCard label="Visited" value={pipelineCounts.visited} color="purple" />
      </div>

      {/* Monthly stats */}
      <div className="bg-white rounded-xl p-3 mb-4 border border-gray-100">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <p className="text-lg font-bold text-primary-500">{leads.length}</p>
            <p className="text-[10px] text-gray-500">Leads</p>
          </div>
          <div>
            <p className="text-lg font-bold text-success-500">{contacted}</p>
            <p className="text-[10px] text-gray-500">Contacted</p>
          </div>
          <div>
            <p className="text-lg font-bold text-warning-500">{purchased}</p>
            <p className="text-[10px] text-gray-500">Converted</p>
          </div>
          <div>
            <p className="text-lg font-bold text-purple-600">
              {leads.length > 0 ? Math.round((contacted / leads.length) * 100) : 0}%
            </p>
            <p className="text-[10px] text-gray-500">Rate</p>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'All' },
          { id: 'new', label: `New (${pipelineCounts.new})` },
          { id: 'followup', label: `Follow-up (${pipelineCounts.followup})` },
          { id: 'visit', label: `Visit (${pipelineCounts.visit})` },
          { id: 'visited', label: `Visited (${pipelineCounts.visited})` },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap active:scale-95
              ${filter === f.id ? 'bg-primary-500 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lead cards */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading your leads...</div>
      ) : filteredLeads.length === 0 ? (
        <div className="text-center py-12 text-gray-400">No leads in this category</div>
      ) : (
        <div className="space-y-3">
          {filteredLeads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onClick={() => navigate(`/staff/lead/${lead.id}`)}
              showAssignee={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
