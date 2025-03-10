import { SUPABASE_URL, SUPABASE_KEY } from "@/integrations/supabase/db-client";

export interface BlockingRule {
  id: string;
  user_id: string;
  type: 'website' | 'app' | 'notification';
  target: string;
  schedule: {
    start_time: string;
    end_time: string;
    days: string[];
  };
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export class BlockingService {
  private static instance: BlockingService;
  private initialized: boolean = false;

  private constructor() {}

  public static getInstance(): BlockingService {
    if (!BlockingService.instance) {
      BlockingService.instance = new BlockingService();
    }
    return BlockingService.instance;
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
      await this.supabaseRestCall('/rest/v1/rpc/initialize_blocking_service', {
        method: 'POST'
      });
      
      this.initialized = true;
      console.log('Blocking service initialized');
    } catch (error) {
      console.error('Failed to initialize blocking service:', error);
      throw error;
    }
  }

  public async getBlockingRules(userId: string): Promise<BlockingRule[]> {
    try {
      const data = await this.supabaseRestCall(
        `/rest/v1/blocking_rules?user_id=eq.${userId}&order=created_at.desc`
      );
      return data;
    } catch (error) {
      console.error('Failed to get blocking rules:', error);
      throw error;
    }
  }

  public async addBlockingRule(data: Omit<BlockingRule, 'id' | 'created_at' | 'updated_at'>): Promise<BlockingRule> {
    try {
      const response = await this.supabaseRestCall('/rest/v1/blocking_rules', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      });
      return response[0];
    } catch (error) {
      console.error('Failed to add blocking rule:', error);
      throw error;
    }
  }

  public async updateBlockingRule(ruleId: string, data: Partial<BlockingRule>): Promise<void> {
    try {
      await this.supabaseRestCall(
        `/rest/v1/blocking_rules?id=eq.${ruleId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            ...data,
            updated_at: new Date().toISOString()
          })
        }
      );
    } catch (error) {
      console.error('Failed to update blocking rule:', error);
      throw error;
    }
  }

  public async deleteBlockingRule(ruleId: string): Promise<void> {
    try {
      await this.supabaseRestCall(
        `/rest/v1/blocking_rules?id=eq.${ruleId}`,
        {
          method: 'DELETE'
        }
      );
    } catch (error) {
      console.error('Failed to delete blocking rule:', error);
      throw error;
    }
  }

  public async getActiveRules(userId: string): Promise<BlockingRule[]> {
    try {
      const now = new Date();
      const currentTime = now.toTimeString().split(' ')[0];
      const currentDay = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][now.getDay()];

      const data = await this.supabaseRestCall(
        `/rest/v1/blocking_rules?user_id=eq.${userId}&enabled=eq.true`
      );

      return data.filter((rule: BlockingRule) => {
        const { start_time, end_time, days } = rule.schedule;
        return days.includes(currentDay) && 
               currentTime >= start_time && 
               currentTime <= end_time;
      });
    } catch (error) {
      console.error('Failed to get active rules:', error);
      throw error;
    }
  }

  public async logBlockedAttempt(data: {
    user_id: string;
    rule_id: string;
    target: string;
    type: string;
  }): Promise<void> {
    try {
      await this.supabaseRestCall('/rest/v1/blocking_attempts', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to log blocked attempt:', error);
      throw error;
    }
  }

  public async getBlockingStats(userId: string, timeframe: string): Promise<any> {
    try {
      const data = await this.supabaseRestCall(
        `/rest/v1/rpc/get_blocking_stats`,
        {
          method: 'POST',
          body: JSON.stringify({
            p_user_id: userId,
            p_timeframe: timeframe
          })
        }
      );
      return data;
    } catch (error) {
      console.error('Failed to get blocking stats:', error);
      throw error;
    }
  }
}
