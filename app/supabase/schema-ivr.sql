-- ============================================================
-- BCH CRM - CallerDesk IVR Integration Schema
-- Run this in Supabase SQL Editor after the main schema
-- ============================================================

-- ============================================================
-- IVR Number → Source Mapping Table
-- Configurable without code changes
-- ============================================================
CREATE TABLE public.ivr_number_map (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  did_number TEXT NOT NULL UNIQUE, -- CallerDesk virtual number (10 digits)
  source lead_source NOT NULL,     -- maps to existing lead_source enum
  label TEXT,                       -- human-readable label e.g. "BCH Main IG"
  device_name TEXT,                 -- physical device e.g. "Green Mobile"
  sim_id TEXT,                      -- e.g. "TS01"
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Seed data from BCH phone mapping (PDF)
INSERT INTO public.ivr_number_map (did_number, source, label, device_name, sim_id) VALUES
  ('9380097119', 'bch_main_ig',      'BCH Main',           'Green Mobile', 'TS01'),
  ('7996994427', 'wattsonwheelz_ig', 'Wattsonwheelz / EM Doodle', 'Blue Mobile', 'TS02'),
  ('9019107283', 'bch_toyz_ig',      'BCH Toyz / WhatsApp API',   'Red Mobile',  'TS03'),
  ('9844353759', 'direct_referral',  'Red Mobile SIM 2',   'Red Mobile',  'TS05'),
  ('9844079427', 'bch_2ndlife_ig',   'Second Hand',         NULL,          NULL),
  ('9844187264', 'bch_2ndlife_ig',   'Second Hand',         NULL,          'TS04'),
  ('7996635356', 'bch_lux_ig',       'BCH Lux / Content',  NULL,          NULL),
  ('8892031480', 'google_business',  'Google Profile',      NULL,          NULL),
  ('9844223174', 'direct_referral',  'Service No',          NULL,          NULL),
  ('8088329031', 'direct_referral',  'Delivery No',         NULL,          NULL);

-- ============================================================
-- Pending Calls Table
-- Stores incoming call data from CallerDesk webhook
-- App reads this via Realtime to auto-fill source
-- ============================================================
CREATE TABLE public.pending_calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  caller_number TEXT NOT NULL,         -- customer's real phone number
  did_number TEXT,                      -- CallerDesk virtual number that was dialed
  source lead_source,                   -- auto-mapped from ivr_number_map
  callerdesk_call_id TEXT,             -- CallerDesk's unique call ID
  call_status TEXT DEFAULT 'ringing',  -- ringing, answered, completed, missed
  status TEXT DEFAULT 'pending',       -- pending = waiting for BDC to pick up, matched = qualified, expired = timed out
  raw_payload JSONB DEFAULT '{}',      -- store full CallerDesk webhook payload for debugging
  created_at TIMESTAMPTZ DEFAULT now(),
  matched_at TIMESTAMPTZ               -- when BDC matched this to a lead
);

CREATE INDEX idx_pending_calls_caller ON public.pending_calls(caller_number);
CREATE INDEX idx_pending_calls_status ON public.pending_calls(status);
CREATE INDEX idx_pending_calls_created ON public.pending_calls(created_at DESC);

-- ============================================================
-- RLS Policies
-- ============================================================
ALTER TABLE public.ivr_number_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pending_calls ENABLE ROW LEVEL SECURITY;

-- ivr_number_map: anyone authenticated can read, manager can update
CREATE POLICY "Anyone can read ivr_number_map" ON public.ivr_number_map
  FOR SELECT USING (true);

CREATE POLICY "Manager can manage ivr_number_map" ON public.ivr_number_map
  FOR ALL USING (public.is_manager());

-- pending_calls: webhook inserts via service role (bypasses RLS), BDC/manager can read/update
CREATE POLICY "BDC and Manager can read pending_calls" ON public.pending_calls
  FOR SELECT USING (public.get_user_role() IN ('bdc', 'manager'));

CREATE POLICY "BDC can update pending_calls" ON public.pending_calls
  FOR UPDATE USING (public.get_user_role() IN ('bdc', 'manager'));

-- Allow service role insert (Edge Function uses service role key)
-- No INSERT policy needed for authenticated users — only the webhook inserts

-- ============================================================
-- Realtime — so app gets instant updates
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.pending_calls;

-- ============================================================
-- Auto-expire old pending calls (optional cleanup)
-- Run as a cron job or Supabase pg_cron extension
-- ============================================================
-- UPDATE public.pending_calls
-- SET status = 'expired'
-- WHERE status = 'pending' AND created_at < now() - interval '10 minutes';
