import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://zoubqdwxemivxrjruvam.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvdWJxZHd4ZW1pdnhyanJ1dmFtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODQyMDE5NywiZXhwIjoyMDUzOTk2MTk3fQ.VM'
)

interface EnergyMetric {
  id: string
  user_id: string
  type: 'physical' | 'mental' | 'focus' | 'sleep'
  value: number
  timestamp: string
  notes?: string
}

const energyMetricsService = {
  async getMetrics(params?: {
    startDate?: string
    endDate?: string
    type?: EnergyMetric['type']
  }) {
    let query = supabase
      .from('energy_metrics')
      .select('*')
      .order('timestamp', { ascending: false })

    if (params?.startDate) {
      query = query.gte('timestamp', params.startDate)
    }
    if (params?.endDate) {
      query = query.lte('timestamp', params.endDate)
    }
    if (params?.type) {
      query = query.eq('type', params.type)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch energy metrics: ${error.message}`)
    }

    return data as EnergyMetric[]
  },

  async addMetric(metric: Omit<EnergyMetric, 'id' | 'user_id' | 'timestamp'>) {
    const { data, error } = await supabase
      .from('energy_metrics')
      .insert([
        {
          ...metric,
          timestamp: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      throw new Error(`Failed to add energy metric: ${error.message}`)
    }

    return data[0] as EnergyMetric
  },

  async getAggregatedMetrics(params: {
    startDate: string
    endDate: string
    type: EnergyMetric['type']
  }) {
    const { data, error } = await supabase
      .from('energy_metrics')
      .select('value, timestamp')
      .eq('type', params.type)
      .gte('timestamp', params.startDate)
      .lte('timestamp', params.endDate)
      .order('timestamp', { ascending: true })

    if (error) {
      throw new Error(`Failed to fetch aggregated metrics: ${error.message}`)
    }

    // Calculate average, min, max
    const metrics = data as { value: number; timestamp: string }[]
    const values = metrics.map(m => m.value)
    
    return {
      average: values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0,
      min: values.length ? Math.min(...values) : 0,
      max: values.length ? Math.max(...values) : 0,
      timeline: metrics,
    }
  },
}

async function testEnergyMetrics() {
  try {
    // Skip authentication for now
    console.log('Testing with service role key')

    // Add a test metric
    const newMetric = await energyMetricsService.addMetric({
      type: 'physical',
      value: 85,
      notes: 'Test energy metric'
    })

    console.log('Added new metric:', newMetric)

    // Get all metrics
    const metrics = await energyMetricsService.getMetrics()
    console.log('All metrics:', metrics)

    // Get aggregated metrics for the last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    const aggregated = await energyMetricsService.getAggregatedMetrics({
      type: 'physical',
      startDate: sevenDaysAgo.toISOString(),
      endDate: new Date().toISOString()
    })

    console.log('Aggregated metrics:', aggregated)

  } catch (error) {
    console.error('Error:', error)
  }
}

testEnergyMetrics()
