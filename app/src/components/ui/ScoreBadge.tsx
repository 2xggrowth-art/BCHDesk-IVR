// ============================================================
// BCH CRM - Score Badge Component
// ============================================================

import { SCORE_COLORS } from '@/config/constants';
import { getScoreLabel } from '@/utils/format';

interface ScoreBadgeProps {
  score: string;
  size?: 'sm' | 'md';
  showValue?: boolean;
  value?: number;
}

export function ScoreBadge({ score, size = 'sm', showValue, value }: ScoreBadgeProps) {
  const colorClass = SCORE_COLORS[score] || SCORE_COLORS.cold;
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-3 py-1 text-xs',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-bold ${colorClass} ${sizeClasses[size]}`}>
      {getScoreLabel(score)}
      {showValue && value !== undefined && (
        <span className="opacity-80">({Math.round(value * 100)}%)</span>
      )}
    </span>
  );
}
