-- ============================================================
-- BCH CRM - Complete Supabase Schema
-- PostgreSQL + Row Level Security + Realtime
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('bdc', 'staff', 'manager');
CREATE TYPE lead_source AS ENUM (
  'bch_main_ig', 'bch_main_yt', 'wattsonwheelz_ig', 'wattsonwheelz_yt',
  'bch_2ndlife_ig', 'bch_toyz_ig', 'bch_lux_ig', 'em_doodle_ig',
  'raleigh_bch_ig', 'raleigh_bch_yt', 'next_blr_ig',
  'google_business', 'direct_referral', 'walk_in', 'ivr'
);
CREATE TYPE lead_interest AS ENUM ('electric', 'gear', 'kids_teen', 'second_hand', 'service', 'other');
CREATE TYPE budget_range AS ENUM ('under_10k', '10k_20k', '20k_35k', '35k_50k', '50k_1l', 'above_1l', 'not_shared');
CREATE TYPE lead_score AS ENUM ('very_hot', 'hot', 'warm', 'cold');
CREATE TYPE lead_stage AS ENUM (
  'ivr_filtered', 'lead_created', 'bdc_contacted', 'qualified',
  'follow_up_active', 'visit_scheduled', 'visit_done',
  'purchased', 'post_sale', 'lost'
);
CREATE TYPE call_outcome AS ENUM (
  'coming_today', 'coming_tomorrow', 'coming_weekend', 'coming_next_week',
  'not_sure', 'no_answer', 'family_approval', 'price_concern',
  'competitor', 'not_interested', 'wrong_number', 'callback_later'
);
CREATE TYPE walkin_outcome AS ENUM ('purchased', 'walked_out', 'coming_back', 'still_here');
CREATE TYPE walkout_reason AS ENUM (
  'too_expensive', 'not_in_stock', 'family_approval', 'just_looking',
  'will_come_back', 'competitor', 'emi_rejected', 'wrong_size_color'
);
CREATE TYPE visit_intent AS ENUM (
  'coming_today', 'coming_tomorrow', 'coming_weekend',
  'coming_next_week', 'not_sure', 'refused'
);
CREATE TYPE emi_option AS ENUM ('yes_999', 'yes_regular', 'no_cash_card', 'didnt_discuss');
CREATE TYPE followup_status AS ENUM ('pending', 'completed', 'overdue', 'cancelled');
CREATE TYPE automation_type AS ENUM ('whatsapp', 'notification', 'escalation', 'system');
CREATE TYPE activity_action AS ENUM (
  'lead_created', 'lead_qualified', 'lead_assigned', 'lead_reassigned',
  'call_made', 'call_outcome_logged', 'whatsapp_sent', 'followup_created',
  'followup_completed', 'walkin_captured', 'walkin_matched', 'purchase_logged',
  'walkout_logged', 'spam_marked', 'escalation_triggered', 'note_added'
);

-- ============================================================
-- TABLES
-- ============================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role user_role NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  specialty TEXT, -- e.g., 'Electric', 'Premium', 'Kids', '2nd Life'
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Leads table
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone TEXT NOT NULL,
  name TEXT,
  source lead_source NOT NULL DEFAULT 'direct_referral',
  language TEXT DEFAULT 'english',
  location TEXT,
  area TEXT,
  age_bracket TEXT,
  interest lead_interest,
  brand TEXT,
  model TEXT,
  budget budget_range,
  emi emi_option,
  visit_intent visit_intent,
  score lead_score DEFAULT 'warm',
  score_value NUMERIC(3,2) DEFAULT 0.50,
  stage lead_stage DEFAULT 'lead_created',
  assigned_to UUID REFERENCES public.users(id),
  call_notes TEXT[], -- array of chip-selected notes
  is_spam BOOLEAN DEFAULT false,
  visit_date TIMESTAMPTZ,
  purchase_amount NUMERIC(10,2),
  invoice_number TEXT,
  lost_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_contact TIMESTAMPTZ,
  follow_up_date TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Calls log
CREATE TABLE public.calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id),
  outcome call_outcome,
  notes TEXT[],
  duration_seconds INTEGER,
  is_missed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Walk-ins
CREATE TABLE public.walkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone TEXT,
  name TEXT,
  matched_lead_id UUID REFERENCES public.leads(id),
  interest lead_interest,
  assigned_to UUID REFERENCES public.users(id),
  outcome walkin_outcome,
  walkout_reason walkout_reason,
  purchase_amount NUMERIC(10,2),
  invoice_number TEXT,
  is_from_lead BOOLEAN DEFAULT false,
  follow_up_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Follow-ups
CREATE TABLE public.followups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id),
  next_date TIMESTAMPTZ NOT NULL,
  status followup_status DEFAULT 'pending',
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Activity audit log
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  lead_id UUID REFERENCES public.leads(id),
  walkin_id UUID REFERENCES public.walkins(id),
  action activity_action NOT NULL,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Automation logs
CREATE TABLE public.automation_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  rule_id TEXT NOT NULL,
  rule_name TEXT NOT NULL,
  automation_type automation_type NOT NULL,
  lead_id UUID REFERENCES public.leads(id),
  user_id UUID REFERENCES public.users(id),
  trigger_event TEXT NOT NULL,
  action_taken TEXT NOT NULL,
  status TEXT DEFAULT 'success',
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Callback queue
CREATE TABLE public.callbacks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone TEXT NOT NULL,
  lead_id UUID REFERENCES public.leads(id),
  source lead_source,
  interest lead_interest,
  missed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'pending', -- pending, called_back, skipped, escalated
  assigned_to UUID REFERENCES public.users(id),
  handled_at TIMESTAMPTZ,
  handled_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_leads_assigned_to ON public.leads(assigned_to);
CREATE INDEX idx_leads_stage ON public.leads(stage);
CREATE INDEX idx_leads_score ON public.leads(score);
CREATE INDEX idx_leads_source ON public.leads(source);
CREATE INDEX idx_leads_phone ON public.leads(phone);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX idx_leads_follow_up_date ON public.leads(follow_up_date);
CREATE INDEX idx_calls_lead_id ON public.calls(lead_id);
CREATE INDEX idx_calls_user_id ON public.calls(user_id);
CREATE INDEX idx_calls_created_at ON public.calls(created_at DESC);
CREATE INDEX idx_walkins_created_at ON public.walkins(created_at DESC);
CREATE INDEX idx_walkins_phone ON public.walkins(phone);
CREATE INDEX idx_followups_user_id ON public.followups(user_id);
CREATE INDEX idx_followups_next_date ON public.followups(next_date);
CREATE INDEX idx_followups_status ON public.followups(status);
CREATE INDEX idx_activities_lead_id ON public.activities(lead_id);
CREATE INDEX idx_activities_created_at ON public.activities(created_at DESC);
CREATE INDEX idx_callbacks_status ON public.callbacks(status);
CREATE INDEX idx_callbacks_assigned_to ON public.callbacks(assigned_to);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.walkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.callbacks ENABLE ROW LEVEL SECURITY;

-- Helper function: get current user's role
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Helper function: check if user is manager
CREATE OR REPLACE FUNCTION public.is_manager()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'manager');
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ---- USERS policies ----
CREATE POLICY "Users can read all users" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- ---- LEADS policies ----
-- BDC: see unassigned/incoming leads
-- Staff: see only assigned leads
-- Manager: see all leads
CREATE POLICY "BDC sees unassigned leads" ON public.leads
  FOR SELECT USING (
    public.get_user_role() = 'bdc' AND (assigned_to IS NULL OR stage IN ('lead_created', 'bdc_contacted', 'qualified'))
  );

CREATE POLICY "Staff sees assigned leads" ON public.leads
  FOR SELECT USING (
    public.get_user_role() = 'staff' AND assigned_to = auth.uid()
  );

CREATE POLICY "Manager sees all leads" ON public.leads
  FOR SELECT USING (public.is_manager());

CREATE POLICY "BDC can insert leads" ON public.leads
  FOR INSERT WITH CHECK (public.get_user_role() IN ('bdc', 'manager'));

CREATE POLICY "BDC can update unassigned leads" ON public.leads
  FOR UPDATE USING (
    public.get_user_role() = 'bdc' AND (assigned_to IS NULL OR stage IN ('lead_created', 'bdc_contacted', 'qualified'))
  );

CREATE POLICY "Staff can update assigned leads" ON public.leads
  FOR UPDATE USING (
    public.get_user_role() = 'staff' AND assigned_to = auth.uid()
  );

CREATE POLICY "Manager can update all leads" ON public.leads
  FOR UPDATE USING (public.is_manager());

-- ---- CALLS policies ----
CREATE POLICY "Users see own calls" ON public.calls
  FOR SELECT USING (user_id = auth.uid() OR public.is_manager());

CREATE POLICY "Users can insert calls" ON public.calls
  FOR INSERT WITH CHECK (user_id = auth.uid());

-- ---- WALKINS policies ----
CREATE POLICY "Staff and manager see walkins" ON public.walkins
  FOR SELECT USING (
    public.get_user_role() IN ('staff', 'manager') AND
    (assigned_to = auth.uid() OR public.is_manager())
  );

CREATE POLICY "Staff can insert walkins" ON public.walkins
  FOR INSERT WITH CHECK (public.get_user_role() IN ('staff', 'manager'));

CREATE POLICY "Staff can update own walkins" ON public.walkins
  FOR UPDATE USING (assigned_to = auth.uid() OR public.is_manager());

-- ---- FOLLOWUPS policies ----
CREATE POLICY "Users see own followups" ON public.followups
  FOR SELECT USING (user_id = auth.uid() OR public.is_manager());

CREATE POLICY "Users can insert followups" ON public.followups
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own followups" ON public.followups
  FOR UPDATE USING (user_id = auth.uid() OR public.is_manager());

-- ---- ACTIVITIES policies ----
CREATE POLICY "All authenticated users see activities" ON public.activities
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "System and users can insert activities" ON public.activities
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ---- AUTOMATION LOGS policies ----
CREATE POLICY "Manager sees all automation logs" ON public.automation_logs
  FOR SELECT USING (public.is_manager());

CREATE POLICY "System can insert automation logs" ON public.automation_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- ---- CALLBACKS policies ----
CREATE POLICY "BDC sees callbacks" ON public.callbacks
  FOR SELECT USING (
    public.get_user_role() IN ('bdc', 'manager')
  );

CREATE POLICY "BDC can insert callbacks" ON public.callbacks
  FOR INSERT WITH CHECK (public.get_user_role() IN ('bdc', 'manager'));

CREATE POLICY "BDC can update callbacks" ON public.callbacks
  FOR UPDATE USING (public.get_user_role() IN ('bdc', 'manager'));

-- ============================================================
-- REALTIME SUBSCRIPTIONS
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.callbacks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.walkins;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activities;
ALTER PUBLICATION supabase_realtime ADD TABLE public.followups;

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_walkins_updated_at
  BEFORE UPDATE ON public.walkins
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Auto-calculate lead score based on filled fields
CREATE OR REPLACE FUNCTION public.calculate_lead_score()
RETURNS TRIGGER AS $$
DECLARE
  filled INTEGER := 0;
  total INTEGER := 8;
  calc_score NUMERIC(3,2);
BEGIN
  IF NEW.name IS NOT NULL THEN filled := filled + 1; END IF;
  IF NEW.area IS NOT NULL THEN filled := filled + 1; END IF;
  IF NEW.budget IS NOT NULL THEN filled := filled + 1; END IF;
  IF NEW.interest IS NOT NULL THEN filled := filled + 1; END IF;
  IF NEW.brand IS NOT NULL THEN filled := filled + 1; END IF;
  IF NEW.model IS NOT NULL THEN filled := filled + 1; END IF;
  IF NEW.visit_intent IS NOT NULL THEN filled := filled + 1; END IF;
  IF NEW.emi IS NOT NULL THEN filled := filled + 1; END IF;

  calc_score := filled::NUMERIC / total;

  -- Boost for high-intent signals
  IF NEW.visit_intent IN ('coming_today', 'coming_tomorrow') THEN
    calc_score := LEAST(calc_score + 0.15, 1.0);
  END IF;
  IF NEW.budget IN ('50k_1l', 'above_1l') THEN
    calc_score := LEAST(calc_score + 0.05, 1.0);
  END IF;

  NEW.score_value := calc_score;

  IF calc_score >= 0.85 THEN NEW.score := 'very_hot';
  ELSIF calc_score >= 0.65 THEN NEW.score := 'hot';
  ELSIF calc_score >= 0.40 THEN NEW.score := 'warm';
  ELSE NEW.score := 'cold';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_score_on_lead_change
  BEFORE INSERT OR UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.calculate_lead_score();

-- Auto-log activity on lead creation
CREATE OR REPLACE FUNCTION public.log_lead_created()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.activities (lead_id, action, details)
  VALUES (NEW.id, 'lead_created', jsonb_build_object(
    'source', NEW.source,
    'phone', NEW.phone,
    'interest', NEW.interest
  ));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_lead_created
  AFTER INSERT ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.log_lead_created();

-- Auto-log activity on lead assignment
CREATE OR REPLACE FUNCTION public.log_lead_assigned()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.assigned_to IS DISTINCT FROM NEW.assigned_to AND NEW.assigned_to IS NOT NULL THEN
    INSERT INTO public.activities (lead_id, user_id, action, details)
    VALUES (NEW.id, NEW.assigned_to,
      CASE WHEN OLD.assigned_to IS NULL THEN 'lead_assigned' ELSE 'lead_reassigned' END,
      jsonb_build_object(
        'from', OLD.assigned_to,
        'to', NEW.assigned_to
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_lead_assigned
  AFTER UPDATE ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.log_lead_assigned();

-- ============================================================
-- VIEWS for dashboard aggregation
-- ============================================================

CREATE OR REPLACE VIEW public.daily_stats AS
SELECT
  DATE(created_at) AS day,
  COUNT(*) AS total_leads,
  COUNT(*) FILTER (WHERE score IN ('hot', 'very_hot')) AS qualified_leads,
  COUNT(*) FILTER (WHERE assigned_to IS NOT NULL) AS assigned_leads,
  COUNT(*) FILTER (WHERE last_contact IS NOT NULL) AS contacted_leads,
  COUNT(*) FILTER (WHERE stage = 'purchased') AS purchased,
  COALESCE(SUM(purchase_amount) FILTER (WHERE stage = 'purchased'), 0) AS revenue
FROM public.leads
GROUP BY DATE(created_at);

CREATE OR REPLACE VIEW public.staff_performance AS
SELECT
  u.id AS user_id,
  u.name,
  COUNT(l.id) AS leads_received,
  COUNT(l.id) FILTER (WHERE l.last_contact IS NOT NULL) AS contacted,
  CASE WHEN COUNT(l.id) > 0
    THEN ROUND(COUNT(l.id) FILTER (WHERE l.last_contact IS NOT NULL)::NUMERIC / COUNT(l.id) * 100, 1)
    ELSE 0
  END AS contact_rate,
  COUNT(l.id) FILTER (WHERE l.stage = 'visit_done') AS visits,
  COUNT(l.id) FILTER (WHERE l.stage = 'purchased') AS purchased,
  CASE WHEN COUNT(l.id) FILTER (WHERE l.last_contact IS NOT NULL) > 0
    THEN ROUND(COUNT(l.id) FILTER (WHERE l.stage = 'purchased')::NUMERIC /
         NULLIF(COUNT(l.id) FILTER (WHERE l.last_contact IS NOT NULL), 0) * 100, 1)
    ELSE 0
  END AS conversion_rate,
  COALESCE(SUM(l.purchase_amount) FILTER (WHERE l.stage = 'purchased'), 0) AS revenue
FROM public.users u
LEFT JOIN public.leads l ON l.assigned_to = u.id
WHERE u.role = 'staff'
GROUP BY u.id, u.name;
