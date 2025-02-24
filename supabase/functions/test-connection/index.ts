import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers })
  }

  try {
    return new Response(
      JSON.stringify({ message: 'Connection test successful', timestamp: new Date().toISOString() }),
      { headers: { ...headers, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...headers, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
