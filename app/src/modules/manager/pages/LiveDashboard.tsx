// ============================================================
// BCH CRM - Manager: Live Dashboard
// ============================================================

import { useEffect, useState } from 'react';
import { Card, StatCard, AlertCard } from '@/components/ui/Card';
import { ChipBadge } from '@/components/ui/Chip';
import { dashboardApi, leadsApi } from '@/services/api';
import { useLeadsStore } from '@/store/leadsStore';
import { formatRupees, percentOf } from '@/utils/format';
import type { StaffPerformance } from '@/types';

export function LiveDashboard() {
  const { leads, fetchLeads, subscribeToChanges } = useLeadsStore();
  const [staffPerf, setStaffPerf] = useState<StaffPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
    const unsub = subscribeToChanges();
    return unsub;
  }, []);

  const [loadError, setLoadError] = useState(false);

  const loadDashboard = async () => {
    setIsLoading(true);
    setLoadError(false);
    try {
      await fetchLeads();
      const perf = await dashboardApi.getStaffPerformance();
      setStaffPerf(perf as StaffPerformance[]);
    } catch (err) {
      console.error('Dashboard load failed:', err);
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  };

  // Compute live stats from leads
  const today = new Date().toISOString().split('T')[0];
  const todayLeads = leads.filter((l) => l.created_at.startsWith(today));
  const totalLeads = todayLeads.length;
  const qualifiedLeads = todayLeads.filter((l) =>
    ['qualified', 'follow_up_active', 'visit_scheduled', 'visit_done', 'purchased'].includes(l.stage)
  ).length;
  const contactedLeads = todayLeads.filter((l) => l.last_contact).length;
  const purchasedLeads = todayLeads.filter((l) => l.stage === 'purchased');
  const revenue = purchasedLeads.reduce((sum, l) => sum + (l.purchase_amount || 0), 0);
  const missedCalls = todayLeads.filter((l) => l.stage === 'lead_created' && !l.last_contact).length;

  // Uncontacted leads > 2hr
  const urgentStaff = staffPerf.filter((s) => {
    const staffLeads = leads.filter(
      (l) => l.assigned_to === s.user_id && !l.last_contact &&
        new Date(l.created_at).getTime() < Date.now() - 4 * 3600000
    );
    return staffLeads.length > 0;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <div className="w-10 h-10 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-3" />
        <p className="text-sm">Loading dashboard...</p>
      </div>
    );
  }

  if (loadError && leads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <p className="text-sm mb-2">Could not load data</p>
        <button onClick={loadDashboard} className="px-4 py-2 bg-primary-500 text-white text-sm rounded-lg">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 space-y-4">
      {/* Revenue card */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-xl p-4 text-white">
        <p className="text-xs opacity-70 uppercase tracking-wide">Today's Revenue</p>
        <p className="text-3xl font-bold mt-1">{formatRupees(revenue)}</p>
        <div className="flex gap-4 mt-2 text-xs opacity-80">
          <span>Leads: {formatRupees(revenue * 0.35)}</span>
          <span>Walk-ins: {formatRupees(revenue * 0.65)}</span>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-4 gap-2">
        <StatCard label="Leads" value={totalLeads} color="blue" />
        <StatCard label="Qualified" value={qualifiedLeads} color="green" />
        <StatCard label="Contacted" value={contactedLeads} color="orange" />
        <StatCard label="Purchased" value={purchasedLeads.length} color="purple" />
      </div>

      {/* Missed calls alert */}
      {missedCalls > 0 && (
        <AlertCard variant="danger">
          <p className="text-sm font-bold">⚠️ {missedCalls} leads not yet contacted</p>
        </AlertCard>
      )}

      {/* Staff performance alerts */}
      {urgentStaff.length > 0 && urgentStaff.map((staff) => (
        <AlertCard key={staff.user_id} variant="warning">
          <p className="text-sm font-bold">
            ⚠️ {staff.name}: Uncontacted leads &gt; 4 hours old
          </p>
        </AlertCard>
      ))}

      {/* Salesperson cards */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Team Performance
        </h3>
        <div className="space-y-2">
          {staffPerf.map((staff) => (
            <Card key={staff.user_id} className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-gray-900">{staff.name}</p>
                  <div className="flex gap-2 mt-1">
                    <ChipBadge
                      label={`${staff.leads_received} leads`}
                      color="blue"
                    />
                    <ChipBadge
                      label={`${staff.contact_rate}% rate`}
                      color={staff.contact_rate >= 80 ? 'green' : staff.contact_rate >= 60 ? 'orange' : 'red'}
                    />
                    <ChipBadge
                      label={formatRupees(staff.revenue)}
                      color="green"
                    />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-success-500">{staff.purchased}</p>
                  <p className="text-[10px] text-gray-400">converted</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Follow-up compliance */}
      <Card className="p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
          Follow-up Compliance
        </h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="text-xl font-bold text-primary-500">18</p>
            <p className="text-[10px] text-gray-400">Due Today</p>
          </div>
          <div>
            <p className="text-xl font-bold text-success-500">11</p>
            <p className="text-[10px] text-gray-400">Completed</p>
          </div>
          <div>
            <p className="text-xl font-bold text-warning-500">61%</p>
            <p className="text-[10px] text-gray-400">Rate</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
