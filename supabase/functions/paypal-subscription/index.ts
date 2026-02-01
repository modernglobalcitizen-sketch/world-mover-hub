import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const PAYPAL_API_URL = Deno.env.get('PAYPAL_MODE') === 'live' 
  ? 'https://api-m.paypal.com'
  : 'https://api-m.sandbox.paypal.com'

async function getPayPalAccessToken(): Promise<string> {
  const clientId = Deno.env.get('PAYPAL_CLIENT_ID')
  const clientSecret = Deno.env.get('PAYPAL_CLIENT_SECRET')
  const paypalMode = Deno.env.get('PAYPAL_MODE')
  
  console.log('PayPal config check:', {
    mode: paypalMode,
    api: PAYPAL_API_URL,
    clientIdPrefix: clientId?.substring(0, 10) + '...',
    clientIdLen: clientId?.length,
    clientSecretLen: clientSecret?.length,
  })
  
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
    const error = await response.text()
    console.error('PayPal auth error:', error)
    throw new Error('Failed to authenticate with PayPal')
  }

  const data = await response.json()
  return data.access_token
}

async function createPayPalProduct(accessToken: string): Promise<string> {
  // First check if product exists
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

  // Create new product
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
    const error = await response.text()
    console.error('PayPal product creation error:', error)
    throw new Error('Failed to create PayPal product')
  }

  const product = await response.json()
  return product.id
}

async function createPayPalPlan(accessToken: string, productId: string): Promise<string> {
  // First check if plan exists
  const listResponse = await fetch(`${PAYPAL_API_URL}/v1/billing/plans?product_id=${productId}&page_size=20`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  if (listResponse.ok) {
    const plans = await listResponse.json()
    const existingPlan = plans.plans?.find((p: any) => p.name === 'Monthly $10 Membership' && p.status === 'ACTIVE')
    if (existingPlan) {
      return existingPlan.id
    }
  }

  // Create new plan
  const response = await fetch(`${PAYPAL_API_URL}/v1/billing/plans`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'PayPal-Request-Id': `plan-${Date.now()}`,
    },
    body: JSON.stringify({
      product_id: productId,
      name: 'Monthly $10 Membership',
      description: 'Monthly subscription to Global Moves Network at $10/month',
      status: 'ACTIVE',
      billing_cycles: [
        {
          frequency: {
            interval_unit: 'MONTH',
            interval_count: 1,
          },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0,
          pricing_scheme: {
            fixed_price: {
              value: '10',
              currency_code: 'USD',
            },
          },
        },
      ],
      payment_preferences: {
        auto_bill_outstanding: true,
        setup_fee: {
          value: '0',
          currency_code: 'USD',
        },
        setup_fee_failure_action: 'CONTINUE',
        payment_failure_threshold: 3,
      },
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    console.error('PayPal plan creation error:', error)
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
      subscriber: {
        email_address: email,
      },
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
    const error = await response.text()
    console.error('PayPal subscription creation error:', error)
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
    const error = await response.text()
    console.error('PayPal get subscription error:', error)
    throw new Error('Failed to get subscription details')
  }

  return await response.json()
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { action, email, subscriptionId, returnUrl, cancelUrl, signupData } = await req.json()

    console.log(`PayPal action: ${action}`)

    if (action === 'create-subscription') {
      if (!email) {
        return new Response(
          JSON.stringify({ error: 'Email is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const accessToken = await getPayPalAccessToken()
      const productId = await createPayPalProduct(accessToken)
      const planId = await createPayPalPlan(accessToken, productId)
      
      // Generate subscription first to get ID for return URL
      const origin = req.headers.get('origin') || 'https://world-mover-hub.lovable.app'
      
      // We'll create subscription with a placeholder, then return actual ID
      // PayPal will redirect back with subscription_id as a query param
      const subscription = await createSubscription(
        accessToken, 
        planId, 
        email, 
        `${origin}/auth?payment=success`,
        `${origin}/auth?payment=cancelled`
      )

      // Store pending subscription in database
      const { error: dbError } = await supabase
        .from('subscriptions')
        .insert({
          paypal_subscription_id: subscription.id,
          email: email,
          status: 'pending',
          plan_id: planId,
        })

      if (dbError) {
        console.error('Database error:', dbError)
      }

      // Find the approval URL and replace placeholder with actual subscription ID
      let approvalUrl = subscription.links?.find((link: any) => link.rel === 'approve')?.href
      if (approvalUrl) {
        // PayPal will redirect with subscription_id param, but we also encode it in our return URL
        approvalUrl = approvalUrl // PayPal handles the return
      }

      return new Response(
        JSON.stringify({ 
          subscriptionId: subscription.id,
          approvalUrl: approvalUrl,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'verify-subscription') {
      if (!subscriptionId) {
        return new Response(
          JSON.stringify({ error: 'Subscription ID is required' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const accessToken = await getPayPalAccessToken()
      const details = await getSubscriptionDetails(accessToken, subscriptionId)

      console.log('Subscription status:', details.status)

      if (details.status === 'ACTIVE' || details.status === 'APPROVED') {
        // Update subscription in database
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            paypal_payer_id: details.subscriber?.payer_id,
            current_period_start: details.billing_info?.last_payment?.time || new Date().toISOString(),
            current_period_end: details.billing_info?.next_billing_time,
          })
          .eq('paypal_subscription_id', subscriptionId)

        if (updateError) {
          console.error('Database update error:', updateError)
        }

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
        JSON.stringify({ 
          verified: false,
          status: details.status,
        }),
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

      // Get subscription to verify it's active
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

      if (subscription.status !== 'active') {
        return new Response(
          JSON.stringify({ error: 'Subscription is not active' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Create the user account
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: signupData.email,
        password: signupData.password,
        email_confirm: true, // Auto-confirm since they paid
        user_metadata: {
          country: signupData.country,
          field_of_work: signupData.fieldOfWork,
          opportunity_interests: signupData.opportunityInterests,
        },
      })

      if (authError) {
        console.error('Auth error:', authError)
        return new Response(
          JSON.stringify({ error: authError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Link subscription to user
      const { error: linkError } = await supabase
        .from('subscriptions')
        .update({ user_id: authData.user.id })
        .eq('paypal_subscription_id', subscriptionId)

      if (linkError) {
        console.error('Link error:', linkError)
      }

      return new Response(
        JSON.stringify({ 
          success: true,
          userId: authData.user.id,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('PayPal function error:', error)
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
