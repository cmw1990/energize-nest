import { SUPABASE_URL, SUPABASE_KEY } from "@/integrations/supabase/db-client";

export class NotificationService {
  private static instance: NotificationService;
  private initialized: boolean = false;

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
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
      await this.supabaseRestCall('/rest/v1/rpc/initialize_notifications', {
        method: 'POST'
      });
      
      this.initialized = true;
      console.log('Notification service initialized');
    } catch (error) {
      console.error('Failed to initialize notification service:', error);
      throw error;
    }
  }

  public async getNotifications(userId: string): Promise<any[]> {
    try {
      const data = await this.supabaseRestCall(
        `/rest/v1/notifications?user_id=eq.${userId}&order=created_at.desc`,
        {
          method: 'GET'
        }
      );
      return data;
    } catch (error) {
      console.error('Failed to get notifications:', error);
      throw error;
    }
  }

  public async markAsRead(notificationId: string): Promise<void> {
    try {
      await this.supabaseRestCall(
        `/rest/v1/notifications?id=eq.${notificationId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            read: true,
            read_at: new Date().toISOString()
          })
        }
      );
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  }

  public async createNotification(data: {
    user_id: string;
    type: string;
    title: string;
    message: string;
    metadata?: Record<string, any>;
  }): Promise<void> {
    try {
      await this.supabaseRestCall('/rest/v1/notifications', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          created_at: new Date().toISOString(),
          read: false
        })
      });
    } catch (error) {
      console.error('Failed to create notification:', error);
      throw error;
    }
  }

  public async deleteNotification(notificationId: string): Promise<void> {
    try {
      await this.supabaseRestCall(
        `/rest/v1/notifications?id=eq.${notificationId}`,
        {
          method: 'DELETE'
        }
      );
    } catch (error) {
      console.error('Failed to delete notification:', error);
      throw error;
    }
  }

  public async updateNotificationPreferences(userId: string, preferences: Record<string, boolean>): Promise<void> {
    try {
      await this.supabaseRestCall(
        `/rest/v1/notification_preferences?user_id=eq.${userId}`,
        {
          method: 'PATCH',
          body: JSON.stringify({
            preferences,
            updated_at: new Date().toISOString()
          })
        }
      );
    } catch (error) {
      console.error('Failed to update notification preferences:', error);
      throw error;
    }
  }

  public async getNotificationPreferences(userId: string): Promise<Record<string, boolean>> {
    try {
      const data = await this.supabaseRestCall(
        `/rest/v1/notification_preferences?user_id=eq.${userId}`,
        {
          method: 'GET'
        }
      );
      return data[0]?.preferences || {};
    } catch (error) {
      console.error('Failed to get notification preferences:', error);
      throw error;
    }
  }
}
