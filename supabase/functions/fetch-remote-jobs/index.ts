const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { category, search, limit = 20 } = await req.json();

    // Build Remotive API URL
    let url = `https://remotive.com/api/remote-jobs?limit=${limit}`;
    if (category) url += `&category=${encodeURIComponent(category)}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;

    console.log('Fetching remote jobs from:', url);

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Remotive API error: ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify({ success: true, jobs: data.jobs || [] }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching remote jobs:', error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Failed to fetch jobs' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
