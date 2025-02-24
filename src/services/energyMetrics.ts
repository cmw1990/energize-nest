import { supabase } from '@/integrations/supabase/client'

export interface EnergyMetric {
  id: string
  user_id: string
  type: 'physical' | 'mental' | 'focus' | 'sleep'
  value: number
  timestamp: string
  notes?: string
}

export const energyMetricsService = {
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

  async deleteMetric(id: string) {
    const { error } = await supabase
      .from('energy_metrics')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete energy metric: ${error.message}`)
    }

    return true
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
