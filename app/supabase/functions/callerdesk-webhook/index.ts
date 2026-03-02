// ============================================================
// BCH CRM - CallerDesk Webhook Receiver
// Supabase Edge Function
//
// Receives incoming call notifications from CallerDesk,
// maps the dialed virtual number to a lead source,
// and inserts into pending_calls for the BDC app to pick up.
//
// Deploy: supabase functions deploy callerdesk-webhook --no-verify-jwt
// Set secrets:
//   supabase secrets set WEBHOOK_SECRET=your-secret-here
//   supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-key-here
//
// CallerDesk webhook URL:
//   https://<project-ref>.supabase.co/functions/v1/callerdesk-webhook
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-webhook-secret, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Verify webhook secret (optional but recommended)
  const webhookSecret = Deno.env.get('WEBHOOK_SECRET');
  if (webhookSecret) {
    const providedSecret = req.headers.get('x-webhook-secret') ||
      new URL(req.url).searchParams.get('secret');
    if (providedSecret !== webhookSecret) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }

  try {
    const payload = await req.json();

    // ============================================================
    // CallerDesk payload field extraction
    // Adjust these field names based on actual CallerDesk webhook format.
    // Common CallerDesk fields: caller_id, did, agent_number, call_id, status
    // We try multiple common field names to be flexible.
    // ============================================================
    const callerNumber = sanitizePhone(
      payload.caller_id || payload.caller_number || payload.caller ||
      payload.from || payload.customer_number || payload.cli || ''
    );

    const didNumber = sanitizePhone(
      payload.did || payload.did_number || payload.dialed_number ||
      payload.to || payload.virtual_number || payload.called_number || ''
    );

    const callId =
      payload.call_id || payload.callid || payload.uuid ||
      payload.session_id || payload.id || '';

    const callStatus =
      payload.call_status || payload.status || payload.call_type ||
      payload.event || 'ringing';

    if (!callerNumber) {
      return new Response(JSON.stringify({ error: 'Missing caller number' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create Supabase client with service role key (bypasses RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Look up the DID number in ivr_number_map to get source
    let source: string | null = null;
    if (didNumber) {
      const { data: mapping } = await supabase
        .from('ivr_number_map')
        .select('source')
        .eq('did_number', didNumber)
        .eq('is_active', true)
        .single();

      if (mapping) {
        source = mapping.source;
      }
    }

    // Insert into pending_calls
    const { data, error } = await supabase
      .from('pending_calls')
      .insert({
        caller_number: callerNumber,
        did_number: didNumber || null,
        source: source,
        callerdesk_call_id: callId || null,
        call_status: normalizeStatus(callStatus),
        status: 'pending',
        raw_payload: payload,
      })
      .select('id')
      .single();

    if (error) {
      console.error('Insert error:', error);
      return new Response(JSON.stringify({ error: 'Failed to store call', details: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({
      success: true,
      id: data.id,
      source: source,
      caller: callerNumber,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Webhook error:', err);
    return new Response(JSON.stringify({ error: 'Internal error', message: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Strip +91, spaces, dashes — keep last 10 digits
function sanitizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

// Normalize various status strings to our standard values
function normalizeStatus(status: string): string {
  const s = status.toLowerCase();
  if (s.includes('ring')) return 'ringing';
  if (s.includes('answer') || s.includes('connect')) return 'answered';
  if (s.includes('complete') || s.includes('end') || s.includes('hangup')) return 'completed';
  if (s.includes('miss') || s.includes('no_answer') || s.includes('busy') || s.includes('abandon')) return 'missed';
  return s;
}
