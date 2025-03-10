import { SUPABASE_URL, SUPABASE_KEY } from '@/integrations/supabase/db-client';

export interface EnergyMetric {
  id: string;
  user_id: string;
  type: 'physical' | 'mental' | 'focus' | 'sleep';
  value: number;
  timestamp: string;
  notes?: string;
}

export class EnergyMetricsService {
  private static instance: EnergyMetricsService;
  private initialized: boolean = false;

  private constructor() {}

  public static getInstance(): EnergyMetricsService {
    if (!EnergyMetricsService.instance) {
      EnergyMetricsService.instance = new EnergyMetricsService();
    }
    return EnergyMetricsService.instance;
  }

  private async supabaseRestCall(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(`${SUPABASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        ...options.headers
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || response.statusText);
    }

    return await response.json();
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await this.supabaseRestCall('/rest/v1/rpc/initialize_energy_metrics', {
        method: 'POST'
      });
      
      this.initialized = true;
      console.log('Energy metrics service initialized');
    } catch (error) {
      console.error('Failed to initialize energy metrics service:', error);
      throw error;
    }
  }

  public async getMetrics(params?: {
    startDate?: string;
    endDate?: string;
    type?: EnergyMetric['type'];
    userId?: string;
  }): Promise<EnergyMetric[]> {
    try {
      let url = '/rest/v1/energy_metrics?select=*&order=timestamp.desc';

      if (params?.startDate) {
        url += `&timestamp=gte.${params.startDate}`;
      }
      if (params?.endDate) {
        url += `&timestamp=lte.${params.endDate}`;
      }
      if (params?.type) {
        url += `&type=eq.${params.type}`;
      }
      if (params?.userId) {
        url += `&user_id=eq.${params.userId}`;
      }

      const data = await this.supabaseRestCall(url);
      return data;
    } catch (error) {
      console.error('Failed to get energy metrics:', error);
      throw error;
    }
  }

  public async addMetric(data: {
    user_id: string;
    type: EnergyMetric['type'];
    value: number;
    notes?: string;
  }): Promise<EnergyMetric> {
    try {
      const response = await this.supabaseRestCall('/rest/v1/energy_metrics', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString()
        })
      });
      return response[0];
    } catch (error) {
      console.error('Failed to add energy metric:', error);
      throw error;
    }
  }

  public async getAggregatedMetrics(params: {
    startDate: string;
    endDate: string;
    type: EnergyMetric['type'];
    userId: string;
  }): Promise<{
    average: number;
    min: number;
    max: number;
    timeline: { value: number; timestamp: string }[];
  }> {
    try {
      const url = `/rest/v1/energy_metrics?select=value,timestamp&type=eq.${params.type}&user_id=eq.${params.userId}&timestamp=gte.${params.startDate}&timestamp=lte.${params.endDate}&order=timestamp.asc`;

      const metrics = await this.supabaseRestCall(url);
      const values = metrics.map((m: any) => m.value);

      return {
        average: values.length ? values.reduce((a: number, b: number) => a + b, 0) / values.length : 0,
        min: values.length ? Math.min(...values) : 0,
        max: values.length ? Math.max(...values) : 0,
        timeline: metrics,
      };
    } catch (error) {
      console.error('Failed to get aggregated metrics:', error);
      throw error;
    }
  }

  public async getMetricsByType(type: EnergyMetric['type'], userId: string): Promise<EnergyMetric[]> {
    try {
      const data = await this.supabaseRestCall(
        `/rest/v1/energy_metrics?type=eq.${type}&user_id=eq.${userId}&order=timestamp.desc`
      );
      return data;
    } catch (error) {
      console.error(`Failed to get ${type} metrics:`, error);
      throw error;
    }
  }

  public async updateMetric(metricId: string, data: Partial<EnergyMetric>): Promise<void> {
    try {
      await this.supabaseRestCall(
        `/rest/v1/energy_metrics?id=eq.${metricId}`,
        {
          method: 'PATCH',
          body: JSON.stringify(data)
        }
      );
    } catch (error) {
      console.error('Failed to update energy metric:', error);
      throw error;
    }
  }

  public async deleteMetric(metricId: string): Promise<void> {
    try {
      await this.supabaseRestCall(
        `/rest/v1/energy_metrics?id=eq.${metricId}`,
        {
          method: 'DELETE'
        }
      );
    } catch (error) {
      console.error('Failed to delete energy metric:', error);
      throw error;
    }
  }
}
