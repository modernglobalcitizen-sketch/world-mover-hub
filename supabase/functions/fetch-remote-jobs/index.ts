import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { category, search, limit = 20 } = await req.json();

    // Validate limit
    const safeLimit = Math.min(Math.max(1, Number(limit) || 20), 50);

    // Build Remotive API URL
    let url = `https://remotive.com/api/remote-jobs?limit=${safeLimit}`;
    if (category && typeof category === 'string') url += `&category=${encodeURIComponent(category.slice(0, 100))}`;
    if (search && typeof search === 'string') url += `&search=${encodeURIComponent(search.slice(0, 200))}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Remotive API error: ${response.status}`);
    }

    const responseData = await response.json();

    return new Response(JSON.stringify({ success: true, jobs: responseData.jobs || [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Failed to fetch jobs' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
