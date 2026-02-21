// ============================================================
// BCH CRM - Manager: Pipeline Visualization
// ============================================================

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { dashboardApi } from '@/services/api';
import { getStageLabel, formatRupees } from '@/utils/format';

const PIPELINE_ORDER = [
  'ivr_filtered', 'lead_created', 'bdc_contacted', 'qualified',
  'follow_up_active', 'visit_scheduled', 'visit_done',
  'purchased', 'post_sale', 'lost',
];

const STAGE_COLORS: Record<string, string> = {
  ivr_filtered: 'bg-gray-300',
  lead_created: 'bg-primary-300',
  bdc_contacted: 'bg-primary-400',
  qualified: 'bg-primary-500',
  follow_up_active: 'bg-warning-400',
  visit_scheduled: 'bg-warning-500',
  visit_done: 'bg-success-400',
  purchased: 'bg-success-500',
  post_sale: 'bg-success-600',
  lost: 'bg-danger-400',
};

export function PipelinePage() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPipeline();
  }, []);

  const loadPipeline = async () => {
    setIsLoading(true);
    try {
      const data = await dashboardApi.getPipelineCounts();
      setCounts(data);
    } catch (err) {
      console.error('Failed to load pipeline:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const totalLeads = Object.values(counts).reduce((s, c) => s + c, 0);
  const maxCount = Math.max(...Object.values(counts), 1);

  if (isLoading) {
    return <div className="flex items-center justify-center py-20 text-gray-400">Loading...</div>;
  }

  return (
    <div className="p-4 pb-24 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">Lead Pipeline</h3>
        <span className="text-xs text-gray-500">{totalLeads} total</span>
      </div>

      {/* Pipeline stages */}
      <Card className="p-4">
        <div className="space-y-3">
          {PIPELINE_ORDER.map((stage) => {
            const count = counts[stage] || 0;
            const width = Math.max((count / maxCount) * 100, 2);

            return (
              <div key={stage}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-gray-700">
                    {getStageLabel(stage)}
                  </span>
                  <span className="text-xs font-bold text-gray-900">{count}</span>
                </div>
                <div className="h-6 bg-gray-50 rounded-lg overflow-hidden">
                  <div
                    className={`h-full ${STAGE_COLORS[stage]} rounded-lg transition-all duration-500 flex items-center px-2`}
                    style={{ width: `${width}%` }}
                  >
                    {count > 0 && width > 15 && (
                      <span className="text-[10px] font-bold text-white">{count}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Pipeline value summary */}
      <div className="grid grid-cols-3 gap-2">
        <Card className="p-3 text-center">
          <p className="text-lg font-bold text-primary-500">
            {(counts.qualified || 0) + (counts.follow_up_active || 0) + (counts.visit_scheduled || 0)}
          </p>
          <p className="text-[10px] text-gray-500">Active Pipeline</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-lg font-bold text-success-500">{counts.purchased || 0}</p>
          <p className="text-[10px] text-gray-500">Purchased</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-lg font-bold text-danger-500">{counts.lost || 0}</p>
          <p className="text-[10px] text-gray-500">Lost</p>
        </Card>
      </div>
    </div>
  );
}
