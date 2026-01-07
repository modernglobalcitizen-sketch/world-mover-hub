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
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      throw new Error('Missing Supabase configuration');
    }

    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Missing authorization' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create client with user's auth token to verify identity
    const userSupabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify user is authenticated
    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await userSupabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      console.error('Auth error:', claimsError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = claimsData.claims.sub;
    console.log(`Sync requested by user: ${userId}`);

    // Check if user is admin using service role (to bypass RLS)
    const adminSupabase = createClient(supabaseUrl, supabaseServiceKey);
    const { data: roleData, error: roleError } = await adminSupabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .eq('role', 'admin')
      .maybeSingle();

    if (roleError) {
      console.error('Role check error:', roleError);
      return new Response(JSON.stringify({ error: 'Failed to verify permissions' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!roleData) {
      console.log(`User ${userId} attempted sync without admin role`);
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Admin user ${userId} authorized for sync`);

    // Now proceed with Airtable sync using service role
    const apiToken = Deno.env.get('AIRTABLE_API_TOKEN');
    const baseId = Deno.env.get('AIRTABLE_BASE_ID');
    const tableName = Deno.env.get('AIRTABLE_TABLE_NAME');

    if (!apiToken || !baseId || !tableName) {
      throw new Error('Missing Airtable configuration');
    }

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
    const { error: deactivateError } = await adminSupabase
      .from('opportunities')
      .update({ is_active: false })
      .eq('is_active', true);

    if (deactivateError) {
      console.error('Error deactivating old opportunities:', deactivateError);
    }

    // Insert new opportunities
    const { data: insertedData, error: insertError } = await adminSupabase
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
