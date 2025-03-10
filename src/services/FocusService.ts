import { SUPABASE_URL, SUPABASE_KEY } from '../integrations/supabase/db-client';

export interface FocusSession8 {
  id?: string;
  user_id: string;
  duration_seconds: number;
  focus_type: string;
  start_time: string;
  end_time?: string;
  completed: boolean;
  created_at?: string;
  version8: number;
}

export interface NoiseSession8 {
  id?: string;
  user_id: string;
  sound_type: string;
  duration_seconds: number;
  volume: number;
  start_time: string;
  end_time?: string;
  created_at?: string;
  version8: number;
}

export class FocusService {
  private static instance: FocusService;
  private initialized: boolean = false;
  
  private constructor() {}
  
  public static getInstance(): FocusService {
    if (!FocusService.instance) {
      FocusService.instance = new FocusService();
    }
    return FocusService.instance;
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

  /**
   * Initialize the focus tables in the database
   */
  public async initializeTables(): Promise<void> {
    if (this.initialized) return;

    try {
      await this.supabaseRestCall('/rest/v1/rpc/create_focus_tables8', {
        method: 'POST'
      });
      
      console.log('Focus tables initialized successfully');
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize focus tables:', error);
      throw error;
    }
  }

  /**
   * Start a new focus session
   */
  public async startFocusSession(
    userId: string,
    focusType: string,
    startTime: string
  ): Promise<string> {
    try {
      const data = await this.supabaseRestCall('/rest/v1/focus_sessions8', {
        method: 'POST',
        headers: {
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          user_id: userId,
          focus_type: focusType,
          duration_seconds: 0,
          start_time: startTime,
          completed: false,
          version8: 8
        })
      });

      return data[0].id;
    } catch (error) {
      console.error('Failed to start focus session:', error);
      throw error;
    }
  }

  /**
   * Complete a focus session
   */
  public async completeFocusSession(
    sessionId: string,
    endTime: string,
    durationSeconds: number
  ): Promise<void> {
    try {
      await this.supabaseRestCall(`/rest/v1/focus_sessions8?id=eq.${sessionId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          end_time: endTime,
          duration_seconds: durationSeconds,
          completed: true
        })
      });
    } catch (error) {
      console.error('Failed to complete focus session:', error);
      throw error;
    }
  }

  /**
   * Get focus session history for a user
   */
  public async getFocusSessionHistory(userId: string, limit: number = 10): Promise<FocusSession8[]> {
    try {
      const data = await this.supabaseRestCall(
        `/rest/v1/focus_sessions8?user_id=eq.${userId}&order=created_at.desc&limit=${limit}`,
        {
          method: 'GET'
        }
      );

      return data || [];
    } catch (error) {
      console.error('Failed to get focus session history:', error);
      throw error;
    }
  }

  /**
   * Start a new noise session
   */
  public async startNoiseSession(
    userId: string,
    soundType: string,
    volume: number,
    startTime: string
  ): Promise<string> {
    try {
      const data = await this.supabaseRestCall('/rest/v1/noise_sessions8', {
        method: 'POST',
        headers: {
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          user_id: userId,
          sound_type: soundType,
          volume: volume,
          duration_seconds: 0,
          start_time: startTime,
          version8: 8
        })
      });

      return data[0].id;
    } catch (error) {
      console.error('Failed to start noise session:', error);
      throw error;
    }
  }

  /**
   * Update a noise session with end time and duration
   */
  public async updateNoiseSession(
    sessionId: string,
    endTime: string,
    durationSeconds: number
  ): Promise<void> {
    try {
      await this.supabaseRestCall(`/rest/v1/noise_sessions8?id=eq.${sessionId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          end_time: endTime,
          duration_seconds: durationSeconds
        })
      });
    } catch (error) {
      console.error('Failed to update noise session:', error);
      throw error;
    }
  }

  /**
   * Get noise session history for a user
   */
  public async getNoiseSessionHistory(userId: string, limit: number = 10): Promise<NoiseSession8[]> {
    try {
      const data = await this.supabaseRestCall(
        `/rest/v1/noise_sessions8?user_id=eq.${userId}&order=created_at.desc&limit=${limit}`,
        {
          method: 'GET'
        }
      );

      return data || [];
    } catch (error) {
      console.error('Failed to get noise session history:', error);
      throw error;
    }
  }
} 