import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiToken = Deno.env.get('AIRTABLE_API_TOKEN');
    const baseId = Deno.env.get('AIRTABLE_BASE_ID');
    const tableName = Deno.env.get('AIRTABLE_TABLE_NAME');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!apiToken || !baseId || !tableName) {
      throw new Error('Missing Airtable configuration');
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log(`Syncing opportunities from Airtable base: ${baseId}, table: ${tableName}`);

    // Fetch all records from Airtable
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

    // Transform Airtable records to match database schema
    const opportunities = data.records.map((record: any) => ({
      title: record.fields.Title || record.fields.title || '',
      description: record.fields.Description || record.fields.description || '',
      category: record.fields.Category || record.fields.category || 'General',
      location: record.fields.Location || record.fields.location || null,
      deadline: record.fields.Deadline || record.fields.deadline || null,
      requirements: record.fields.Requirements || record.fields.requirements || null,
      is_active: record.fields.Active !== false && record.fields.is_active !== false,
    })).filter((opp: any) => opp.title);

    if (opportunities.length === 0) {
      console.log('No valid opportunities to sync');
      return new Response(JSON.stringify({ message: 'No opportunities to sync', synced: 0 }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Deactivate existing opportunities before inserting new ones
    const { error: deactivateError } = await supabase
      .from('opportunities')
      .update({ is_active: false })
      .eq('is_active', true);

    if (deactivateError) {
      console.error('Error deactivating old opportunities:', deactivateError);
    }

    // Insert new opportunities
    const { data: insertedData, error: insertError } = await supabase
      .from('opportunities')
      .insert(opportunities)
      .select();

    if (insertError) {
      console.error('Error inserting opportunities:', insertError);
      throw new Error(`Failed to insert opportunities: ${insertError.message}`);
    }

    console.log(`Successfully synced ${insertedData?.length || 0} opportunities`);

    return new Response(JSON.stringify({ 
      message: 'Sync completed successfully', 
      synced: insertedData?.length || 0 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error in sync-airtable-opportunities:', errorMessage);
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
