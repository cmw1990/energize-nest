import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    // Get auth user
    const authHeader = req.headers.get('Authorization')!
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Handle different HTTP methods
    switch (req.method) {
      case 'GET': {
        // Get achievements for user
        const { data, error } = await supabase
          .from('wellness_achievements')
          .select('*')
          .eq('user_id', user.id)
          .order('achieved_at', { ascending: false })

        if (error) throw error

        return new Response(
          JSON.stringify({ achievements: data }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        )
      }

      case 'POST': {
        // Award new achievement
        const { title, description, category, points } = await req.json()

        const { data, error } = await supabase.rpc(
          'award_achievement',
          {
            p_user_id: user.id,
            p_title: title,
            p_description: description,
            p_category: category,
            p_points: points
          }
        )

        if (error) throw error

        return new Response(
          JSON.stringify({ achievement_id: data }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 201,
          }
        )
      }

      default:
        return new Response('Method not allowed', {
          headers: { ...corsHeaders },
          status: 405,
        })
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message === 'Unauthorized' ? 401 : 400,
      }
    )
  }
})
