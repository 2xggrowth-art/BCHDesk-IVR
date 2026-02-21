// ============================================================
// BCH CRM - Staff: Follow-ups Page
// ============================================================

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ChipBadge } from '@/components/ui/Chip';
import { followupsApi, leadsApi } from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { useUIStore } from '@/store/uiStore';
import { formatDate, timeAgo } from '@/utils/format';
import type { Followup, Lead } from '@/types';

export function FollowupsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { showToast } = useUIStore();
  const [followups, setFollowups] = useState<(Followup & { lead?: Lead })[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'today' | 'pending' | 'completed'>('today');

  useEffect(() => {
    if (user) loadFollowups();
  }, [user, filter]);

  const loadFollowups = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      let data: Followup[];
      if (filter === 'today') {
        data = await followupsApi.getDueToday(user.id);
      } else {
        data = await followupsApi.getByUser(user.id, filter === 'completed' ? 'completed' : 'pending');
      }

      // Enrich with lead data
      const enriched = await Promise.all(
        data.map(async (f) => {
          const lead = await leadsApi.getById(f.lead_id);
          return { ...f, lead: lead || undefined };
        })
      );

      setFollowups(enriched);
    } catch {
      showToast('Failed to load follow-ups', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async (followupId: string) => {
    try {
      await followupsApi.markCompleted(followupId);
      setFollowups((prev) => prev.filter((f) => f.id !== followupId));
      showToast('Follow-up completed', 'success');
    } catch {
      showToast('Failed to complete follow-up', 'error');
    }
  };

  return (
    <div className="p-4 pb-24">
      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { id: 'today' as const, label: 'Due Today' },
          { id: 'pending' as const, label: 'All Pending' },
          { id: 'completed' as const, label: 'Completed' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold active:scale-95
              ${filter === f.id ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">Loading...</div>
      ) : followups.length === 0 ? (
        <div className="text-center py-12">
          <span className="text-4xl">✅</span>
          <p className="text-sm text-gray-400 mt-2">No follow-ups {filter === 'today' ? 'due today' : 'in this list'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {followups.map((f) => (
            <Card key={f.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => f.lead && navigate(`/staff/lead/${f.lead.id}`)}
                >
                  <p className="text-sm font-bold text-gray-900">
                    {f.lead?.name || f.lead?.phone || 'Unknown Lead'}
                  </p>
                  <div className="flex gap-1 mt-1">
                    {f.lead?.interest && (
                      <ChipBadge label={f.lead.interest} color="blue" />
                    )}
                    <ChipBadge label={formatDate(f.next_date)} color="orange" />
                  </div>
                </div>
                {f.status === 'pending' && (
                  <Button
                    variant="success"
                    size="sm"
                    onClick={() => handleComplete(f.id)}
                  >
                    Done
                  </Button>
                )}
              </div>
              {f.notes && (
                <p className="text-xs text-gray-500 mt-1">{f.notes}</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
