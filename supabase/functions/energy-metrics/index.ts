import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { corsHeaders } from '../_shared/cors.ts'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user ID from the authenticated request
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    switch (req.method) {
      case 'GET': {
        // Get user's energy metrics for a date range
        const url = new URL(req.url)
        const startDate = url.searchParams.get('startDate')
        const endDate = url.searchParams.get('endDate')
        const type = url.searchParams.get('type')

        let query = supabaseClient
          .from('energy_metrics')
          .select('*')
          .eq('user_id', user.id)
          .order('timestamp', { ascending: false })

        if (startDate) {
          query = query.gte('timestamp', startDate)
        }
        if (endDate) {
          query = query.lte('timestamp', endDate)
        }
        if (type) {
          query = query.eq('type', type)
        }

        const { data, error } = await query

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }

        return new Response(
          JSON.stringify({ data }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'POST': {
        // Add new energy metric
        const { type, value, notes } = await req.json()

        const { data, error } = await supabaseClient
          .from('energy_metrics')
          .insert([
            {
              user_id: user.id,
              type,
              value,
              notes,
              timestamp: new Date().toISOString(),
            },
          ])
          .select()

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }

        return new Response(
          JSON.stringify({ data: data[0] }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      case 'DELETE': {
        // Delete an energy metric
        const { id } = await req.json()

        const { error } = await supabaseClient
          .from('energy_metrics')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id) // Ensure users can only delete their own metrics

        if (error) {
          return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
          )
        }

        return new Response(
          JSON.stringify({ success: true }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 405 }
        )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
