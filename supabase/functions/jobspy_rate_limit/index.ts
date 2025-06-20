import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response('Missing Supabase credentials', { status: 500 });
  }
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Identify the client (by IP or API key)
  const identifier = req.headers.get('x-api-key') || req.headers.get('x-forwarded-for') || req.headers.get('host') || 'unknown';
  const MAX_REQUESTS = 10; // max requests per hour
  const WINDOW_SIZE = 60 * 60 * 1000; // 1 hour in ms
  const now = Date.now();
  const windowStart = new Date(now - (now % WINDOW_SIZE)).toISOString();

  // Check current usage
  const { data, error } = await supabase
    .from('rate_limits')
    .select('*')
    .eq('identifier', identifier)
    .eq('window_start', windowStart)
    .single();

  if (error && error.code !== 'PGRST116') {
    // Not found is OK, any other error is not
    return new Response('Rate limit check failed', { status: 500 });
  }

  if (data && data.count >= MAX_REQUESTS) {
    return new Response('Rate limit exceeded. Try again later.', { status: 429 });
  }

  // Increment or create usage record
  if (data) {
    await supabase
      .from('rate_limits')
      .update({ count: data.count + 1 })
      .eq('id', data.id);
  } else {
    await supabase
      .from('rate_limits')
      .insert({ identifier, count: 1, window_start: windowStart });
  }

  // Proceed with the actual JobSpy logic (placeholder)
  return new Response('Request allowed', { status: 200 });
}); 