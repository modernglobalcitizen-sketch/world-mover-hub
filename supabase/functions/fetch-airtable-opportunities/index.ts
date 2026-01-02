import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiToken = Deno.env.get('AIRTABLE_API_TOKEN');
    const baseId = Deno.env.get('AIRTABLE_BASE_ID');
    const tableName = Deno.env.get('AIRTABLE_TABLE_NAME');

    if (!apiToken || !baseId || !tableName) {
      console.error('Missing Airtable configuration:', { 
        hasToken: !!apiToken, 
        hasBaseId: !!baseId, 
        hasTableName: !!tableName 
      });
      throw new Error('Missing Airtable configuration');
    }

    console.log(`Fetching opportunities from Airtable base: ${baseId}, table: ${tableName}`);

    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Airtable API error:', response.status, errorText);
      throw new Error(`Airtable API error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Fetched ${data.records?.length || 0} records from Airtable`);

    // Transform Airtable records to match the opportunities format
    const opportunities = data.records.map((record: any) => ({
      id: record.id,
      title: record.fields.Title || record.fields.title || '',
      description: record.fields.Description || record.fields.description || '',
      category: record.fields.Category || record.fields.category || 'General',
      location: record.fields.Location || record.fields.location || null,
      deadline: record.fields.Deadline || record.fields.deadline || null,
      requirements: record.fields.Requirements || record.fields.requirements || null,
      is_active: record.fields.Active !== false && record.fields.is_active !== false,
    })).filter((opp: any) => opp.is_active && opp.title);

    console.log(`Returning ${opportunities.length} active opportunities`);

    return new Response(JSON.stringify({ opportunities }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in fetch-airtable-opportunities:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
