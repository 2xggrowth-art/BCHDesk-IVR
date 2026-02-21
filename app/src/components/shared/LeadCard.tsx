// ============================================================
// BCH CRM - Lead Card Component (Shared across modules)
// ============================================================

import { Card } from '@/components/ui/Card';
import { ScoreBadge } from '@/components/ui/ScoreBadge';
import { ChipBadge } from '@/components/ui/Chip';
import { SCORE_BORDER_COLORS } from '@/config/constants';
import { getSourceLabel, getBudgetLabel, getInterestLabel, timeAgo } from '@/utils/format';
import type { Lead } from '@/types';

interface LeadCardProps {
  lead: Lead;
  onClick?: () => void;
  showAssignee?: boolean;
  compact?: boolean;
}

export function LeadCard({ lead, onClick, showAssignee = true, compact = false }: LeadCardProps) {
  const borderColor = SCORE_BORDER_COLORS[lead.score] || 'border-l-gray-400';

  return (
    <Card
      borderColor={borderColor}
      onClick={onClick}
      className={`p-3 ${compact ? 'p-2' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-gray-900 truncate">
              {lead.name || lead.phone}
            </h4>
            <ScoreBadge score={lead.score} />
          </div>
          {lead.name && (
            <p className="text-xs text-gray-500 mt-0.5">{lead.phone}</p>
          )}
        </div>
        {lead.interest && (
          <ChipBadge label={getInterestLabel(lead.interest)} color="blue" />
        )}
      </div>

      {/* Meta tags */}
      {!compact && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {lead.source && (
            <ChipBadge label={getSourceLabel(lead.source)} color="purple" />
          )}
          {lead.budget && (
            <ChipBadge label={getBudgetLabel(lead.budget)} color="green" />
          )}
          {lead.visit_intent && (
            <ChipBadge
              label={lead.visit_intent.replace(/_/g, ' ')}
              color={
                lead.visit_intent === 'coming_today' || lead.visit_intent === 'coming_tomorrow'
                  ? 'orange'
                  : 'gray'
              }
            />
          )}
          {lead.area && (
            <ChipBadge label={lead.area} color="gray" />
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between text-[10px] text-gray-400">
        {showAssignee && lead.assigned_to && (
          <span>Assigned to staff</span>
        )}
        <span className="ml-auto">{timeAgo(lead.created_at)}</span>
      </div>
    </Card>
  );
}
