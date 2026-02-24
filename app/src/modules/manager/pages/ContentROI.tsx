// ============================================================
// BCH CRM - Manager: Content ROI Analytics
// ============================================================

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { dashboardApi } from '@/services/api';
import { formatRupees, getSourceLabel } from '@/utils/format';

interface SourceStat {
  source: string;
  calls: number;
  qualified: number;
  visits: number;
  purchased: number;
  revenue: number;
}

export function ContentROI() {
  const [sources, setSources] = useState<SourceStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await dashboardApi.getSourceStats();
      setSources((data as unknown as SourceStat[]).sort((a, b) => b.revenue - a.revenue));
    } catch (err) {
      console.error('Failed to load source stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const totalCalls = sources.reduce((s, r) => s + r.calls, 0);
  const totalQualified = sources.reduce((s, r) => s + r.qualified, 0);
  const totalVisits = sources.reduce((s, r) => s + r.visits, 0);
  const totalPurchased = sources.reduce((s, r) => s + r.purchased, 0);
  const totalRevenue = sources.reduce((s, r) => s + r.revenue, 0);

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-gray-400">Loading...</div>;
  }

  return (
    <div className="p-4 pb-24 space-y-4">
      <h3 className="text-sm font-bold text-gray-900">Source Performance</h3>

      {/* Scrollable table */}
      <div className="overflow-x-auto -mx-4 px-4">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2 font-semibold text-gray-500 sticky left-0 bg-gray-50">Profile</th>
              <th className="text-right p-2 font-semibold text-gray-500">Calls</th>
              <th className="text-right p-2 font-semibold text-gray-500">Qual.</th>
              <th className="text-right p-2 font-semibold text-gray-500">Visits</th>
              <th className="text-right p-2 font-semibold text-gray-500">Sold</th>
              <th className="text-right p-2 font-semibold text-gray-500">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {sources.map((s, i) => (
              <tr
                key={s.source}
                className={`border-b border-gray-50 ${i === 0 ? 'bg-success-50' : ''}`}
              >
                <td className="p-2 font-medium text-gray-900 sticky left-0 bg-inherit whitespace-nowrap">
                  {getSourceLabel(s.source)}
                  {i === 0 && <span className="ml-1 text-[10px] text-success-500">BEST</span>}
                </td>
                <td className="p-2 text-right text-gray-700">{s.calls}</td>
                <td className="p-2 text-right text-gray-700">{s.qualified}</td>
                <td className="p-2 text-right text-gray-700">{s.visits}</td>
                <td className="p-2 text-right font-medium text-success-500">{s.purchased}</td>
                <td className="p-2 text-right font-bold text-gray-900">{formatRupees(s.revenue)}</td>
              </tr>
            ))}
            <tr className="bg-gray-100 font-bold">
              <td className="p-2 sticky left-0 bg-gray-100">TOTAL</td>
              <td className="p-2 text-right">{totalCalls}</td>
              <td className="p-2 text-right">{totalQualified}</td>
              <td className="p-2 text-right">{totalVisits}</td>
              <td className="p-2 text-right text-success-500">{totalPurchased}</td>
              <td className="p-2 text-right">{formatRupees(totalRevenue)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Conversion funnel */}
      <Card className="p-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-3">Conversion Funnel</h3>
        <div className="space-y-2">
          {[
            { label: 'Calls → Qualified', value: totalCalls > 0 ? Math.round((totalQualified / totalCalls) * 100) : 0 },
            { label: 'Qualified → Visit', value: totalQualified > 0 ? Math.round((totalVisits / totalQualified) * 100) : 0 },
            { label: 'Visit → Purchase', value: totalVisits > 0 ? Math.round((totalPurchased / totalVisits) * 100) : 0 },
            { label: 'Overall', value: totalCalls > 0 ? ((totalPurchased / totalCalls) * 100).toFixed(1) : 0 },
          ].map((step) => (
            <div key={step.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">{step.label}</span>
                <span className="font-bold text-gray-900">{step.value}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary-500 rounded-full transition-all"
                  style={{ width: `${Math.min(Number(step.value), 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
