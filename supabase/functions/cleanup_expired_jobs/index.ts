import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response('Missing Supabase credentials', { status: 500 });
  }

  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Delete jobs with status ARCHIVED or DRAFT older than 30 days
  const { error: error1 } = await supabase
    .from('jobs')
    .delete()
    .lt('updated_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .in('status', ['ARCHIVED', 'DRAFT']);

  // Optionally, delete jobs with expires_at in the past (if you add this field)
  // const { error: error2 } = await supabase
  //   .from('jobs')
  //   .delete()
  //   .lt('expires_at', new Date().toISOString());

  if (error1) {
    return new Response(`Cleanup failed: ${error1.message}`, { status: 500 });
  }

  return new Response('Expired jobs cleaned up successfully', { status: 200 });
}); 