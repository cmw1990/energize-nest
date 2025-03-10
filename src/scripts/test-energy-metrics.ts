import { SUPABASE_URL, SUPABASE_KEY } from '@/integrations/supabase/db-client';

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
    let url = `${SUPABASE_URL}/rest/v1/energy_metrics?select=*&order=timestamp.desc`;

    if (params?.startDate) {
      url += `&timestamp=gte.${params.startDate}`;
    }
    if (params?.endDate) {
      url += `&timestamp=lte.${params.endDate}`;
    }
    if (params?.type) {
      url += `&type=eq.${params.type}`;
    }

    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to fetch energy metrics: ${error.message || response.statusText}`);
    }

    return await response.json() as EnergyMetric[];
  },

  async addMetric(metric: Omit<EnergyMetric, 'id' | 'user_id' | 'timestamp'>) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/energy_metrics`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        ...metric,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to add energy metric: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    return data[0] as EnergyMetric;
  },

  async getAggregatedMetrics(params: {
    startDate: string
    endDate: string
    type: EnergyMetric['type']
  }) {
    const url = `${SUPABASE_URL}/rest/v1/energy_metrics?select=value,timestamp&type=eq.${params.type}&timestamp=gte.${params.startDate}&timestamp=lte.${params.endDate}&order=timestamp.asc`;

    const response = await fetch(url, {
      headers: {
        'apikey': SUPABASE_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to fetch aggregated metrics: ${error.message || response.statusText}`);
    }

    // Calculate average, min, max
    const metrics = await response.json() as { value: number; timestamp: string }[];
    const values = metrics.map(m => m.value);
    
    return {
      average: values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0,
      min: values.length ? Math.min(...values) : 0,
      max: values.length ? Math.max(...values) : 0,
      timeline: metrics,
    };
  },
};

async function testEnergyMetrics() {
  try {
    // Skip authentication for now
    console.log('Testing with service role key');

    // Add a test metric
    const newMetric = await energyMetricsService.addMetric({
      type: 'physical',
      value: 85,
      notes: 'Test energy metric'
    });

    console.log('Added new metric:', newMetric);

    // Get all metrics
    const metrics = await energyMetricsService.getMetrics();
    console.log('All metrics:', metrics);

    // Get aggregated metrics for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const aggregated = await energyMetricsService.getAggregatedMetrics({
      type: 'physical',
      startDate: sevenDaysAgo.toISOString(),
      endDate: new Date().toISOString()
    });

    console.log('Aggregated metrics:', aggregated);

  } catch (error) {
    console.error('Error:', error);
  }
}

testEnergyMetrics();
