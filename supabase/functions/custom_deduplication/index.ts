import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  // Parse request body
  const { jobs } = await req.json();

  // Deduplicate jobs by title+company+location
  const uniqueJobs = [];
  const seen = new Set();
  for (const job of jobs) {
    const key = `${job.title}|${job.company}|${job.location}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueJobs.push(job);
    }
  }

  return new Response(JSON.stringify({ jobs: uniqueJobs }), {
    headers: { "Content-Type": "application/json" },
  });
}); 