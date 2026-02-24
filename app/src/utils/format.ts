// ============================================================
// BCH CRM - Formatting Utilities
// ============================================================

export function formatRupees(amount: number): string {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }
  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount}`;
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getSourceLabel(source: string): string {
  const map: Record<string, string> = {
    bch_main_ig: 'BCH Main IG',
    bch_main_yt: 'BCH Main YT',
    wattsonwheelz_ig: 'Wattsonwheelz IG',
    wattsonwheelz_yt: 'Wattsonwheelz YT',
    bch_2ndlife_ig: 'BCH 2ndLife',
    bch_toyz_ig: 'BCH Toyz',
    bch_lux_ig: 'BCH Lux',
    em_doodle_ig: 'EM Doodle',
    raleigh_bch_ig: 'Raleigh x BCH',
    raleigh_bch_yt: 'Raleigh YT',
    next_blr_ig: 'Next.BLR',
    google_business: 'Google',
    direct_referral: 'Direct/Ref',
    walk_in: 'Walk-in',
    ivr: 'IVR',
  };
  return map[source] || source;
}

export function getScoreLabel(score: string): string {
  const map: Record<string, string> = {
    very_hot: 'VERY HOT',
    hot: 'HOT',
    warm: 'WARM',
    cold: 'COLD',
  };
  return map[score] || score;
}

export function getStageLabel(stage: string): string {
  const map: Record<string, string> = {
    ivr_filtered: 'IVR Filtered',
    lead_created: 'Lead Created',
    bdc_contacted: 'BDC Contacted',
    qualified: 'Qualified',
    follow_up_active: 'Follow-up',
    visit_scheduled: 'Visit Scheduled',
    visit_done: 'Visit Done',
    purchased: 'Purchased',
    post_sale: 'Post-Sale',
    lost: 'Lost',
  };
  return map[stage] || stage;
}

export function getBudgetLabel(budget: string): string {
  const map: Record<string, string> = {
    under_10k: 'Under ₹10K',
    '10k_20k': '₹10-20K',
    '20k_35k': '₹20-35K',
    '35k_50k': '₹35-50K',
    '50k_1l': '₹50K-1L',
    above_1l: '₹1L+',
    not_shared: 'Not Shared',
  };
  return map[budget] || budget;
}

export function getInterestLabel(interest: string): string {
  const map: Record<string, string> = {
    electric: 'Electric',
    gear: 'Gear',
    kids_teen: 'Kids/Teen',
    second_hand: 'Second Hand',
    service: 'Service',
    other: 'Other',
  };
  return map[interest] || interest;
}

export function percentOf(part: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((part / total) * 100)}%`;
}

/** Sanitize phone number to digits only (strips non-numeric chars for safe use in URLs) */
export function sanitizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, '');
}
