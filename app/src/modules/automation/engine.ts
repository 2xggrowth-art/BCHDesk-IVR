// ============================================================
// BCH CRM - Automation Engine (Rule-Based)
// ============================================================

import { supabase, isSupabaseConfigured } from '@/services/supabase';
import type { Lead } from '@/types';

export interface AutomationRule {
  id: string;
  name: string;
  type: 'whatsapp' | 'notification' | 'escalation' | 'system';
  trigger: string;
  action: string;
  timing: string;
  enabled: boolean;
}

export const AUTOMATION_RULES: AutomationRule[] = [
  // WhatsApp auto-messages
  { id: 'wa-1', name: 'Welcome WhatsApp', type: 'whatsapp', trigger: 'Lead created', action: 'Send store location + offers', timing: 'Immediate', enabled: true },
  { id: 'wa-2', name: 'Visit Reminder', type: 'whatsapp', trigger: 'Visit scheduled tomorrow', action: 'Send visit reminder', timing: '6 PM day before', enabled: true },
  { id: 'wa-3', name: 'Post-Visit Thanks', type: 'whatsapp', trigger: "Visited, didn't buy", action: 'Send thanks + questions', timing: '2 hours after', enabled: true },
  { id: 'wa-4', name: 'Day 3 Follow-up', type: 'whatsapp', trigger: "Visited, didn't buy, Day 3", action: 'Send offers + urgency', timing: 'Day 3', enabled: true },
  { id: 'wa-5', name: 'Post-Purchase', type: 'whatsapp', trigger: 'Lead purchased', action: 'Thank you + review link', timing: '3 days after', enabled: true },
  { id: 'wa-6', name: 'Referral Ask', type: 'whatsapp', trigger: 'Lead purchased, Day 7', action: 'Referral ask', timing: '7 days after', enabled: true },
  { id: 'wa-7', name: 'Service Reminder', type: 'whatsapp', trigger: 'Lead purchased, Day 30', action: 'Free service reminder', timing: '30 days after', enabled: true },
  { id: 'wa-8', name: 'Outstation Info', type: 'whatsapp', trigger: 'Outstation caller (IVR)', action: 'Delivery info', timing: 'Immediate', enabled: true },

  // Notifications
  { id: 'notif-1', name: 'Hot Lead Alert', type: 'notification', trigger: 'Lead score hot/very hot', action: 'Push notification to salesperson', timing: 'Immediate', enabled: true },
  { id: 'notif-2', name: '2hr Reminder', type: 'notification', trigger: 'Lead uncontacted 2 hrs', action: 'Reminder to salesperson', timing: '2 hours', enabled: true },
  { id: 'notif-3', name: 'Morning Follow-ups', type: 'notification', trigger: "Follow-ups due today", action: 'Morning notification', timing: '10 AM', enabled: true },

  // Escalations
  { id: 'esc-1', name: '4hr Escalation', type: 'escalation', trigger: 'Lead uncontacted 4 hrs', action: 'Escalation to manager', timing: '4 hours', enabled: true },
  { id: 'esc-2', name: 'Callback Escalation', type: 'escalation', trigger: 'Callback not done 15 min', action: 'Escalate to 2nd BDC', timing: '15 minutes', enabled: true },
  { id: 'esc-3', name: 'Day 7 Final', type: 'escalation', trigger: "Visited, didn't buy, Day 7", action: 'Final follow-up call reminder', timing: 'Day 7', enabled: true },

  // System actions
  { id: 'sys-1', name: 'Missed Call Queue', type: 'system', trigger: 'Missed call', action: 'Add to callback queue + notify BDC', timing: 'Immediate', enabled: true },
  { id: 'sys-2', name: 'Kids Price Auto', type: 'system', trigger: 'Kids U12 caller (IVR)', action: 'Auto-WhatsApp kids pricing', timing: 'Immediate', enabled: true },
  { id: 'sys-3', name: 'Family Recovery', type: 'system', trigger: 'Lead "Family Approval"', action: 'Start SOP #8 sequence', timing: 'Next day', enabled: true },
  { id: 'sys-4', name: 'Auto-Archive', type: 'system', trigger: 'Lead inactive 14 days', action: 'Auto-move to LOST', timing: 'Day 14', enabled: true },
];

// ---- Automation Engine Runner ----

export async function checkEscalations(): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const twoHoursAgo = new Date(Date.now() - 2 * 3600000).toISOString();
  const fourHoursAgo = new Date(Date.now() - 4 * 3600000).toISOString();

  // 2-hour reminder
  const { data: uncontacted2h } = await supabase
    .from('leads')
    .select('id, assigned_to, phone, name')
    .not('assigned_to', 'is', null)
    .is('last_contact', null)
    .lt('created_at', twoHoursAgo)
    .gte('created_at', fourHoursAgo)
    .eq('is_spam', false)
    .not('stage', 'in', '("lost","purchased","post_sale")');

  if (uncontacted2h && uncontacted2h.length > 0) {
    for (const lead of uncontacted2h) {
      await logAutomation('notif-2', '2hr Reminder', 'notification', lead.id, lead.assigned_to,
        'Lead uncontacted 2 hrs', `Reminder sent to staff for ${lead.name || lead.phone}`);
    }
  }

  // 4-hour escalation
  const { data: uncontacted4h } = await supabase
    .from('leads')
    .select('id, assigned_to, phone, name')
    .not('assigned_to', 'is', null)
    .is('last_contact', null)
    .lt('created_at', fourHoursAgo)
    .eq('is_spam', false)
    .not('stage', 'in', '("lost","purchased","post_sale")');

  if (uncontacted4h && uncontacted4h.length > 0) {
    for (const lead of uncontacted4h) {
      await logAutomation('esc-1', '4hr Escalation', 'escalation', lead.id, lead.assigned_to,
        'Lead uncontacted 4 hrs', `Escalation to manager for ${lead.name || lead.phone}`);
    }
  }
}

export async function checkInactiveLeads(): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const fourteenDaysAgo = new Date(Date.now() - 14 * 86400000).toISOString();

  const { data: inactive } = await supabase
    .from('leads')
    .select('id')
    .lt('updated_at', fourteenDaysAgo)
    .not('stage', 'in', '("lost","purchased","post_sale","ivr_filtered")')
    .eq('is_spam', false);

  if (inactive && inactive.length > 0) {
    for (const lead of inactive) {
      await supabase.from('leads').update({ stage: 'lost', lost_reason: 'inactive_14_days' }).eq('id', lead.id);
      await logAutomation('sys-4', 'Auto-Archive', 'system', lead.id, null,
        'Lead inactive 14 days', 'Auto-moved to LOST');
    }
  }
}

async function logAutomation(
  ruleId: string,
  ruleName: string,
  type: string,
  leadId: string | null,
  userId: string | null,
  trigger: string,
  action: string
): Promise<void> {
  await supabase.from('automation_logs').insert({
    rule_id: ruleId,
    rule_name: ruleName,
    automation_type: type,
    lead_id: leadId,
    user_id: userId,
    trigger_event: trigger,
    action_taken: action,
  });
}

// Start automation polling (runs every 5 minutes)
let automationInterval: ReturnType<typeof setInterval> | null = null;

export function startAutomationEngine(): void {
  if (automationInterval) return;

  // Run immediately
  checkEscalations();

  // Then every 5 minutes
  automationInterval = setInterval(() => {
    checkEscalations();
  }, 5 * 60 * 1000);

  // Check inactive leads once per hour
  setInterval(() => {
    checkInactiveLeads();
  }, 60 * 60 * 1000);
}

export function stopAutomationEngine(): void {
  if (automationInterval) {
    clearInterval(automationInterval);
    automationInterval = null;
  }
}
