import { SUPABASE_URL, SUPABASE_KEY } from '@/integrations/supabase/db-client';

export interface AudioTrack {
  id: string;
  title: string;
  description?: string;
  audio_url: string;
  duration_seconds: number;
  category: string;
  tags?: string[];
}

export class AudioService {
  private static instance: AudioService;
  private audioContext: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private initialized: boolean = false;

  private constructor() {}

  public static getInstance(): AudioService {
    if (!AudioService.instance) {
      AudioService.instance = new AudioService();
    }
    return AudioService.instance;
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
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      
      await this.supabaseRestCall('/rest/v1/rpc/initialize_audio_service', {
        method: 'POST'
      });
      
      this.initialized = true;
      console.log('Audio service initialized');
    } catch (error) {
      console.error('Failed to initialize audio service:', error);
      throw error;
    }
  }

  public async loadAudioFile(filename: string): Promise<ArrayBuffer> {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/storage/v1/object/public/audio/${filename}`,
        {
          headers: {
            'apikey': SUPABASE_KEY
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to load audio file: ${filename}`);
      }

      return await response.arrayBuffer();
    } catch (error) {
      console.error('Error loading audio file:', error);
      throw error;
    }
  }

  public async saveAudioPreferences(userId: string, preferences: Record<string, any>): Promise<void> {
    try {
      await this.supabaseRestCall(
        `/rest/v1/audio_preferences?user_id=eq.${userId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            preferences,
            updated_at: new Date().toISOString()
          })
        }
      );
    } catch (error) {
      console.error('Failed to save audio preferences:', error);
      throw error;
    }
  }

  public async getAudioPreferences(userId: string): Promise<Record<string, any>> {
    try {
      const data = await this.supabaseRestCall(
        `/rest/v1/audio_preferences?user_id=eq.${userId}`,
        {
          method: 'GET'
        }
      );
      return data[0]?.preferences || {};
    } catch (error) {
      console.error('Failed to get audio preferences:', error);
      throw error;
    }
  }

  public async logAudioSession(data: {
    user_id: string;
    session_type: string;
    duration_seconds: number;
    settings: Record<string, any>;
  }): Promise<void> {
    try {
      await this.supabaseRestCall('/rest/v1/audio_sessions', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          created_at: new Date().toISOString()
        })
      });
    } catch (error) {
      console.error('Failed to log audio session:', error);
      throw error;
    }
  }

  public startOscillator(frequency: number, type: OscillatorType = 'sine'): void {
    if (!this.audioContext || !this.gainNode) {
      throw new Error('Audio service not initialized');
    }

    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator.disconnect();
    }

    this.oscillator = this.audioContext.createOscillator();
    this.oscillator.type = type;
    this.oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    this.oscillator.connect(this.gainNode);
    this.oscillator.start();
  }

  public stopOscillator(): void {
    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator.disconnect();
      this.oscillator = null;
    }
  }

  public setVolume(volume: number): void {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  public async getAudioAssets(): Promise<string[]> {
    try {
      const response = await fetch(
        `${SUPABASE_URL}/storage/v1/object/list/audio`,
        {
          headers: {
            'apikey': SUPABASE_KEY
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to list audio assets');
      }

      const data = await response.json();
      return data.map((item: any) => item.name);
    } catch (error) {
      console.error('Error getting audio assets:', error);
      throw error;
    }
  }

  async getMeditationAudio(): Promise<AudioTrack[]> {
    const { data, error } = await this.supabaseRestCall('/rest/v1/meditation_audio');
    
    if (error) throw error;
    return data;
  }

  async getFocusMusic(): Promise<AudioTrack[]> {
    const { data, error } = await this.supabaseRestCall('/rest/v1/focus_music');
    
    if (error) throw error;
    return data;
  }

  async getMeditationAudioByCategory(category: string): Promise<AudioTrack[]> {
    const { data, error } = await this.supabaseRestCall(`/rest/v1/meditation_audio?category=eq.${category}`);
    
    if (error) throw error;
    return data;
  }

  async getFocusMusicByCategory(category: string): Promise<AudioTrack[]> {
    const { data, error } = await this.supabaseRestCall(`/rest/v1/focus_music?category=eq.${category}`);
    
    if (error) throw error;
    return data;
  }
}