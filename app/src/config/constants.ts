// ============================================================
// BCH CRM - Constants & Enumerations (Chip Options)
// ============================================================

import type { ChipOption } from '@/types';

export const INTERESTS: ChipOption[] = [
  { value: 'electric', label: 'Electric' },
  { value: 'gear', label: 'Gear' },
  { value: 'kids_teen', label: 'Kids/Teen' },
  { value: 'second_hand', label: 'Second Hand' },
  { value: 'service', label: 'Service' },
  { value: 'other', label: 'Other' },
];

export const BUDGETS: ChipOption[] = [
  { value: 'under_10k', label: 'Under ₹10K' },
  { value: '10k_20k', label: '₹10-20K' },
  { value: '20k_35k', label: '₹20-35K' },
  { value: '35k_50k', label: '₹35-50K' },
  { value: '50k_1l', label: '₹50K-1L' },
  { value: 'above_1l', label: '₹1L+' },
  { value: 'not_shared', label: 'Not Shared' },
];

export const BRANDS: ChipOption[] = [
  { value: 'emotorad', label: 'EMotorad' },
  { value: 'raleigh', label: 'Raleigh' },
  { value: 'aoki', label: 'AOKI' },
  { value: 'hercules', label: 'Hercules' },
  { value: 'hero_lectro', label: 'Hero Lectro' },
  { value: 'giant', label: 'Giant' },
  { value: 'other', label: 'Other' },
];

export const MODELS: ChipOption[] = [
  { value: 'desire', label: 'Desire' },
  { value: 'doodle', label: 'Doodle' },
  { value: 't_rex', label: 'T-Rex' },
  { value: 'x1', label: 'X1' },
  { value: 'x2', label: 'X2' },
  { value: 'x3', label: 'X3' },
  { value: 'raleigh_eco', label: 'Raleigh Eco' },
  { value: 'other', label: 'Other' },
  { value: 'none', label: 'None' },
];

export const VISIT_INTENTS: ChipOption[] = [
  { value: 'coming_today', label: 'Coming Today' },
  { value: 'coming_tomorrow', label: 'Tomorrow' },
  { value: 'coming_weekend', label: 'Weekend' },
  { value: 'coming_next_week', label: 'Next Week' },
  { value: 'not_sure', label: 'Not Sure' },
  { value: 'refused', label: 'Refused' },
];

export const EMI_OPTIONS: ChipOption[] = [
  { value: 'yes_999', label: 'Yes ₹999' },
  { value: 'yes_regular', label: 'Yes Regular' },
  { value: 'no_cash_card', label: 'No Cash/Card' },
  { value: 'didnt_discuss', label: "Didn't Discuss" },
];

export const CALL_NOTES: ChipOption[] = [
  { value: 'wants_test_ride', label: 'Wants Test Ride' },
  { value: 'comparing_brands', label: 'Comparing Brands' },
  { value: 'family_approval', label: 'Family Approval' },
  { value: 'price_sensitive', label: 'Price Sensitive' },
  { value: 'emi_interest', label: 'EMI Interest' },
  { value: 'repeat_caller', label: 'Repeat Caller' },
  { value: 'urgent_need', label: 'Urgent Need' },
  { value: 'gift_purchase', label: 'Gift Purchase' },
  { value: 'delivery_query', label: 'Delivery Query' },
];

export const AREAS: ChipOption[] = [
  { value: 'jayanagar', label: 'Jayanagar' },
  { value: 'koramangala', label: 'Koramangala' },
  { value: 'indiranagar', label: 'Indiranagar' },
  { value: 'whitefield', label: 'Whitefield' },
  { value: 'hsr', label: 'HSR' },
  { value: 'btm', label: 'BTM' },
  { value: 'banashankari', label: 'Banashankari' },
  { value: 'malleshwaram', label: 'Malleshwaram' },
  { value: 'electronic_city', label: 'Electronic City' },
  { value: 'other_blr', label: 'Other BLR' },
  { value: 'outskirts', label: 'Outskirts' },
];

export const CALL_OUTCOMES: ChipOption[] = [
  { value: 'coming_today', label: 'Coming Today' },
  { value: 'coming_tomorrow', label: 'Tomorrow' },
  { value: 'coming_weekend', label: 'Weekend' },
  { value: 'coming_next_week', label: 'Next Week' },
  { value: 'not_sure', label: 'Not Sure' },
  { value: 'no_answer', label: 'No Answer' },
  { value: 'family_approval', label: 'Family Approval' },
  { value: 'price_concern', label: 'Price Concern' },
  { value: 'competitor', label: 'Competitor' },
  { value: 'not_interested', label: 'Not Interested' },
  { value: 'wrong_number', label: 'Wrong Number' },
  { value: 'callback_later', label: 'Callback Later' },
];

export const WALKOUT_REASONS: ChipOption[] = [
  { value: 'too_expensive', label: 'Too Expensive' },
  { value: 'not_in_stock', label: 'Not in Stock' },
  { value: 'family_approval', label: 'Family Approval' },
  { value: 'just_looking', label: 'Just Looking' },
  { value: 'will_come_back', label: 'Will Come Back' },
  { value: 'competitor', label: 'Competitor' },
  { value: 'emi_rejected', label: 'EMI Rejected' },
  { value: 'wrong_size_color', label: 'Wrong Size/Color' },
];

export const SOURCES: ChipOption[] = [
  { value: 'bch_main_ig', label: 'BCH Main IG' },
  { value: 'bch_main_yt', label: 'BCH Main YT' },
  { value: 'wattsonwheelz_ig', label: 'Wattsonwheelz IG' },
  { value: 'wattsonwheelz_yt', label: 'Wattsonwheelz YT' },
  { value: 'bch_2ndlife_ig', label: 'BCH 2ndLife IG' },
  { value: 'bch_toyz_ig', label: 'BCH Toyz IG' },
  { value: 'bch_lux_ig', label: 'BCH Lux IG' },
  { value: 'em_doodle_ig', label: 'EM Doodle IG' },
  { value: 'raleigh_bch_ig', label: 'Raleigh x BCH IG' },
  { value: 'raleigh_bch_yt', label: 'Raleigh x BCH YT' },
  { value: 'next_blr_ig', label: 'Next.BLR IG' },
  { value: 'google_business', label: 'Google Business' },
  { value: 'direct_referral', label: 'Direct/Referral' },
  { value: 'walk_in', label: 'Walk-in' },
  { value: 'ivr', label: 'IVR' },
];

export const LEAD_STAGES: ChipOption[] = [
  { value: 'ivr_filtered', label: 'IVR Filtered' },
  { value: 'lead_created', label: 'Lead Created' },
  { value: 'bdc_contacted', label: 'BDC Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'follow_up_active', label: 'Follow-up' },
  { value: 'visit_scheduled', label: 'Visit Scheduled' },
  { value: 'visit_done', label: 'Visit Done' },
  { value: 'purchased', label: 'Purchased' },
  { value: 'post_sale', label: 'Post-Sale' },
  { value: 'lost', label: 'Lost' },
];

// Staff auto-assignment rules
export const ASSIGNMENT_RULES: Record<string, { name: string; specialty: string }> = {
  electric: { name: 'Suma', specialty: 'E-cycles' },
  gear: { name: 'Abhi Gowda', specialty: 'Gear Cycles' },
  kids_teen: { name: 'Nithin', specialty: 'Kids/Budget' },
  second_hand: { name: 'Baba', specialty: '2nd Life' },
  service: { name: 'Ranjitha', specialty: 'Service' },
  other: { name: 'Sunil', specialty: 'Premium' },
};

// Score color mapping
export const SCORE_COLORS: Record<string, string> = {
  very_hot: 'bg-danger-500 text-white',
  hot: 'bg-warning-500 text-white',
  warm: 'bg-yellow-400 text-gray-900',
  cold: 'bg-gray-400 text-white',
};

export const SCORE_BORDER_COLORS: Record<string, string> = {
  very_hot: 'border-l-danger-500',
  hot: 'border-l-warning-500',
  warm: 'border-l-yellow-400',
  cold: 'border-l-gray-400',
};
