// ============================================================
// BCH CRM - Type Definitions
// ============================================================

export type UserRole = 'bdc' | 'staff' | 'manager';

export type LeadSource =
  | 'bch_main_ig' | 'bch_main_yt' | 'wattsonwheelz_ig' | 'wattsonwheelz_yt'
  | 'bch_2ndlife_ig' | 'bch_toyz_ig' | 'bch_lux_ig' | 'em_doodle_ig'
  | 'raleigh_bch_ig' | 'raleigh_bch_yt' | 'next_blr_ig'
  | 'google_business' | 'direct_referral' | 'walk_in' | 'ivr';

export type LeadInterest = 'electric' | 'gear' | 'kids_teen' | 'second_hand' | 'service' | 'other';
export type BudgetRange = 'under_10k' | '10k_20k' | '20k_35k' | '35k_50k' | '50k_1l' | 'above_1l' | 'not_shared';
export type LeadScore = 'very_hot' | 'hot' | 'warm' | 'cold';
export type LeadStage =
  | 'ivr_filtered' | 'lead_created' | 'bdc_contacted' | 'qualified'
  | 'follow_up_active' | 'visit_scheduled' | 'visit_done'
  | 'purchased' | 'post_sale' | 'lost';

export type CallOutcome =
  | 'coming_today' | 'coming_tomorrow' | 'coming_weekend' | 'coming_next_week'
  | 'not_sure' | 'no_answer' | 'family_approval' | 'price_concern'
  | 'competitor' | 'not_interested' | 'wrong_number' | 'callback_later';

export type WalkinOutcome = 'purchased' | 'walked_out' | 'coming_back' | 'still_here';
export type WalkoutReason =
  | 'too_expensive' | 'not_in_stock' | 'family_approval' | 'just_looking'
  | 'will_come_back' | 'competitor' | 'emi_rejected' | 'wrong_size_color';

export type VisitIntent = 'coming_today' | 'coming_tomorrow' | 'coming_weekend' | 'coming_next_week' | 'not_sure' | 'refused';
export type EmiOption = 'yes_999' | 'yes_regular' | 'no_cash_card' | 'didnt_discuss';
export type FollowupStatus = 'pending' | 'completed' | 'overdue' | 'cancelled';
export type AutomationType = 'whatsapp' | 'notification' | 'escalation' | 'system';

export type ActivityAction =
  | 'lead_created' | 'lead_qualified' | 'lead_assigned' | 'lead_reassigned'
  | 'call_made' | 'call_outcome_logged' | 'whatsapp_sent' | 'followup_created'
  | 'followup_completed' | 'walkin_captured' | 'walkin_matched' | 'purchase_logged'
  | 'walkout_logged' | 'spam_marked' | 'escalation_triggered' | 'note_added';

// ============================================================
// Database Row Types
// ============================================================

export interface User {
  id: string;
  name: string;
  role: UserRole;
  phone: string | null;
  avatar_url: string | null;
  specialty: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  phone: string;
  name: string | null;
  source: LeadSource;
  language: string | null;
  location: string | null;
  area: string | null;
  age_bracket: string | null;
  interest: LeadInterest | null;
  brand: string | null;
  model: string | null;
  budget: BudgetRange | null;
  emi: EmiOption | null;
  visit_intent: VisitIntent | null;
  score: LeadScore;
  score_value: number;
  stage: LeadStage;
  assigned_to: string | null;
  call_notes: string[] | null;
  is_spam: boolean;
  visit_date: string | null;
  purchase_amount: number | null;
  invoice_number: string | null;
  lost_reason: string | null;
  created_at: string;
  last_contact: string | null;
  follow_up_date: string | null;
  updated_at: string;
}

export interface Call {
  id: string;
  lead_id: string;
  user_id: string;
  outcome: CallOutcome | null;
  notes: string[] | null;
  duration_seconds: number | null;
  is_missed: boolean;
  created_at: string;
}

export interface Walkin {
  id: string;
  phone: string | null;
  name: string | null;
  matched_lead_id: string | null;
  interest: LeadInterest | null;
  assigned_to: string | null;
  outcome: WalkinOutcome | null;
  walkout_reason: WalkoutReason | null;
  purchase_amount: number | null;
  invoice_number: string | null;
  is_from_lead: boolean;
  follow_up_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Followup {
  id: string;
  lead_id: string;
  user_id: string;
  next_date: string;
  status: FollowupStatus;
  notes: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface Activity {
  id: string;
  user_id: string | null;
  lead_id: string | null;
  walkin_id: string | null;
  action: ActivityAction;
  details: Record<string, unknown>;
  created_at: string;
}

export interface AutomationLog {
  id: string;
  rule_id: string;
  rule_name: string;
  automation_type: AutomationType;
  lead_id: string | null;
  user_id: string | null;
  trigger_event: string;
  action_taken: string;
  status: string;
  details: Record<string, unknown>;
  created_at: string;
}

export interface Callback {
  id: string;
  phone: string;
  lead_id: string | null;
  source: LeadSource | null;
  interest: LeadInterest | null;
  missed_at: string;
  status: string;
  assigned_to: string | null;
  handled_at: string | null;
  handled_by: string | null;
  created_at: string;
}

// ============================================================
// UI / App Types
// ============================================================

export interface ChipOption {
  value: string;
  label: string;
  icon?: string;
}

export interface StatItem {
  label: string;
  value: string | number;
  color?: string;
  trend?: 'up' | 'down' | 'neutral';
}

export interface TabItem {
  id: string;
  label: string;
  icon?: string;
  badge?: number;
}

export interface DailyStats {
  day: string;
  total_leads: number;
  qualified_leads: number;
  assigned_leads: number;
  contacted_leads: number;
  purchased: number;
  revenue: number;
}

export interface StaffPerformance {
  user_id: string;
  name: string;
  leads_received: number;
  contacted: number;
  contact_rate: number;
  visits: number;
  purchased: number;
  conversion_rate: number;
  revenue: number;
}
