// ============================================================
// BCH CRM - Manager: Team Performance Scorecard
// ============================================================

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { dashboardApi } from '@/services/api';
import { formatRupees } from '@/utils/format';
import type { StaffPerformance } from '@/types';

export function TeamPage() {
  const [staff, setStaff] = useState<StaffPerformance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTeam();
  }, []);

  const loadTeam = async () => {
    setIsLoading(true);
    try {
      const data = await dashboardApi.getStaffPerformance();
      setStaff((data as StaffPerformance[]).sort((a, b) => b.revenue - a.revenue));
    } catch (err) {
      console.error('Failed to load team:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const bestRevenue = Math.max(...staff.map((s) => s.revenue), 0);
  const worstContactRate = Math.min(...staff.map((s) => s.contact_rate), 100);

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-gray-400">Loading...</div>;
  }

  return (
    <div className="p-4 pb-24 space-y-4">
      <h3 className="text-sm font-bold text-gray-900">Weekly Scorecard</h3>

      {/* Scrollable performance table */}
      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2 font-semibold text-gray-500 sticky left-0 bg-gray-50">Name</th>
              <th className="text-right p-2 font-semibold text-gray-500">Leads</th>
              <th className="text-right p-2 font-semibold text-gray-500">Contact%</th>
              <th className="text-right p-2 font-semibold text-gray-500">Visits</th>
              <th className="text-right p-2 font-semibold text-gray-500">Conv%</th>
              <th className="text-right p-2 font-semibold text-gray-500">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => {
              const isTop = s.revenue === bestRevenue && bestRevenue > 0;
              const isLow = s.contact_rate === worstContactRate && s.contact_rate < 70;

              return (
                <tr
                  key={s.user_id}
                  className={`border-b border-gray-50 ${
                    isTop ? 'bg-success-50' : isLow ? 'bg-danger-50' : ''
                  }`}
                >
                  <td className="p-2 font-medium text-gray-900 sticky left-0 bg-inherit whitespace-nowrap">
                    {s.name}
                    {isTop && <span className="ml-1 text-[10px] text-success-500 font-bold">TOP</span>}
                    {isLow && <span className="ml-1 text-[10px] text-danger-500 font-bold">LOW</span>}
                  </td>
                  <td className="p-2 text-right">{s.leads_received}</td>
                  <td className={`p-2 text-right font-medium ${
                    s.contact_rate >= 80 ? 'text-success-500' : s.contact_rate >= 60 ? 'text-warning-500' : 'text-danger-500'
                  }`}>
                    {s.contact_rate}%
                  </td>
                  <td className="p-2 text-right">{s.visits}</td>
                  <td className={`p-2 text-right font-medium ${
                    s.conversion_rate >= 25 ? 'text-success-500' : 'text-gray-700'
                  }`}>
                    {s.conversion_rate}%
                  </td>
                  <td className="p-2 text-right font-bold text-gray-900">
                    {formatRupees(s.revenue)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <Button variant="outline" size="sm" fullWidth>
          Reassign Lead
        </Button>
        <Button variant="outline" size="sm" fullWidth>
          View Uncontacted
        </Button>
      </div>
    </div>
  );
}
