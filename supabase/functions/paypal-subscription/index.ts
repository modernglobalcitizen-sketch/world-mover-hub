import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PAYPAL_API_URL = Deno.env.get('PAYPAL_MODE') === 'live' 
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 10 * 60 * 1000;

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

async function getPayPalAccessToken(): Promise<string> {
  const clientId = Deno.env.get('PAYPAL_CLIENT_ID')
  const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET')
  
  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured')
  }

  const auth = btoa(`${clientId}:${clientSecret}`)
  
  const response = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!response.ok) {
    throw new Error('Failed to authenticate with PayPal')
  }

  const data = await response.json()
  return data.access_token
}

async function createPayPalProduct(accessToken: string): Promise<string> {
  const listResponse = await fetch(`${PAYPAL_API_URL}/v1/catalogs/products?page_size=20`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (listResponse.ok) {
    const products = await listResponse.json()
    const existingProduct = products.products?.find((p: any) => p.name === 'Global Moves Network Membership')
    if (existingProduct) {
      return existingProduct.id
    }
  }

  const response = await fetch(`${PAYPAL_API_URL}/v1/catalogs/products`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': `product-${Date.now()}`,
    },
    body: JSON.stringify({
      name: 'Global Moves Network Membership',
      description: 'Monthly membership to Global Moves Network',
      type: 'SERVICE',
      category: 'MEMBERSHIP_CLUBS_AND_ORGANIZATIONS',
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to create PayPal product')
  }

  const product = await response.json()
  return product.id
}

async function createPayPalPlan(accessToken: string, productId: string): Promise<string> {
  const listResponse = await fetch(`${PAYPAL_API_URL}/v1/billing/plans?product_id=${productId}&page_size=20`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (listResponse.ok) {
    const plans = await listResponse.json()
    const existingPlan = plans.plans?.find((p: any) => p.name === 'Monthly $3 Membership' && p.status === 'ACTIVE')
    if (existingPlan) {
      return existingPlan.id
    }
  }

  const response = await fetch(`${PAYPAL_API_URL}/v1/billing/plans`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': `plan-${Date.now()}`,
    },
    body: JSON.stringify({
      product_id: productId,
      name: 'Monthly $3 Membership',
      description: 'Monthly subscription to Global Moves Network at $3/month',
      status: 'ACTIVE',
      billing_cycles: [
        {
          frequency: { interval_unit: 'MONTH', interval_count: 1 },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: { fixed_price: { value: '3', currency_code: 'USD' } },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: { value: '0', currency_code: 'USD' },
        setup_fee_failure_action: 'CONTINUE',
        payment_failure_threshold: 3,
      },
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to create PayPal plan')
  }

  const plan = await response.json()
  return plan.id
}

async function createSubscription(accessToken: string, planId: string, email: string, returnUrl: string, cancelUrl: string) {
  const response = await fetch(`${PAYPAL_API_URL}/v1/billing/subscriptions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': `sub-${Date.now()}-${email}`,
    },
    body: JSON.stringify({
      plan_id: planId,
      subscriber: { email_address: email },
      application_context: {
        brand_name: 'Global Moves Network',
        locale: 'en-US',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'SUBSCRIBE_NOW',
        return_url: returnUrl,
        cancel_url: cancelUrl,
      },
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to create PayPal subscription')
  }

  return await response.json()
}

async function getSubscriptionDetails(accessToken: string, subscriptionId: string) {
  const response = await fetch(`${PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to get subscription details')
  }

  return await response.json()
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Rate limit by IP
    const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(clientIp)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again later.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { action, email, subscriptionId, returnUrl, cancelUrl, signupData } = await req.json()

    if (!action || typeof action !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Invalid action' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'create-subscription') {
      if (!email || typeof email !== 'string' || !email.includes('@') || email.length > 255) {
        return new Response(
          JSON.stringify({ error: 'Valid email is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const accessToken = await getPayPalAccessToken()
      const productId = await createPayPalProduct(accessToken)
      const planId = await createPayPalPlan(accessToken, productId)

      const ALLOWED_ORIGINS = [
        'https://globalmovesnetwork.com',
        'https://world-mover-hub.lovable.app',
      ]
      const rawOrigin = req.headers.get('origin') || ''
      const origin = ALLOWED_ORIGINS.includes(rawOrigin) ? rawOrigin : 'https://globalmovesnetwork.com'
      
      const subscription = await createSubscription(
        accessToken, 
        planId, 
        email.trim(), 
        `${origin}/auth?payment=success`,
        `${origin}/auth?payment=cancelled`
      )

      const { error: dbError } = await supabase
        .from('subscriptions')
        .insert({
          paypal_subscription_id: subscription.id,
          email: email.trim(),
          status: 'pending',
          plan_id: planId,
        })

      if (dbError) {
        console.error('Database error storing subscription')
      }

      const approvalUrl = subscription.links?.find((link: any) => link.rel === 'approve')?.href

      return new Response(
        JSON.stringify({ 
          subscriptionId: subscription.id,
          approvalUrl: approvalUrl,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'verify-subscription') {
      if (!subscriptionId || typeof subscriptionId !== 'string') {
        return new Response(
          JSON.stringify({ error: 'Subscription ID is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const accessToken = await getPayPalAccessToken()
      const details = await getSubscriptionDetails(accessToken, subscriptionId)

      if (details.status === 'ACTIVE' || details.status === 'APPROVED') {
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            paypal_payer_id: details.subscriber?.payer_id,
            current_period_start: details.billing_info?.last_payment?.time || new Date().toISOString(),
            current_period_end: details.billing_info?.next_billing_time,
          })
          .eq('paypal_subscription_id', subscriptionId)

        return new Response(
          JSON.stringify({ 
            verified: true,
            status: details.status,
            email: details.subscriber?.email_address,
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ verified: false, status: details.status }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'link-user') {
      if (!subscriptionId || !signupData) {
        return new Response(
          JSON.stringify({ error: 'Subscription ID and signup data are required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Validate signup data
      if (!signupData.email || typeof signupData.email !== 'string' || !signupData.email.includes('@')) {
        return new Response(
          JSON.stringify({ error: 'Valid email is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
      if (!signupData.password || typeof signupData.password !== 'string' || signupData.password.length < 8) {
        return new Response(
          JSON.stringify({ error: 'Password must be at least 8 characters' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Verify subscription is active via PayPal API directly (not just DB)
      const accessToken = await getPayPalAccessToken()
      const paypalDetails = await getSubscriptionDetails(accessToken, subscriptionId)
      
      if (paypalDetails.status !== 'ACTIVE' && paypalDetails.status !== 'APPROVED') {
        return new Response(
          JSON.stringify({ error: 'Subscription is not active with PayPal' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Ensure the signup email matches the verified PayPal subscriber email
      const paypalEmail = paypalDetails.subscriber?.email_address?.toLowerCase()
      const signupEmail = signupData.email.trim().toLowerCase()
      if (!paypalEmail || paypalEmail !== signupEmail) {
        return new Response(
          JSON.stringify({ error: 'Signup email must match the PayPal subscription email' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Also check DB record exists
      const { data: subscription, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('paypal_subscription_id', subscriptionId)
        .single()

      if (subError || !subscription) {
        return new Response(
          JSON.stringify({ error: 'Subscription not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Check if subscription is already linked to a user
      if (subscription.user_id) {
        return new Response(
          JSON.stringify({ error: 'Subscription already linked to an account' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: signupData.email,
        password: signupData.password,
        email_confirm: true,
        user_metadata: {
          country: signupData.country,
          field_of_work: signupData.fieldOfWork,
          opportunity_interests: signupData.opportunityInterests,
        },
      })

      if (authError) {
        return new Response(
          JSON.stringify({ error: 'Failed to create account. Email may already be in use.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      await supabase
        .from('subscriptions')
        .update({ user_id: authData.user.id })
        .eq('paypal_subscription_id', subscriptionId)

      return new Response(
        JSON.stringify({ success: true, userId: authData.user.id }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('paypal-subscription error:', error instanceof Error ? error.message : String(error), error instanceof Error ? error.stack : '')
    return new Response(
      JSON.stringify({ error: 'An error occurred. Please try again later.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
