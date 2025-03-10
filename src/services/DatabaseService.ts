import { SUPABASE_URL, SUPABASE_KEY } from '../integrations/supabase/db-client';

export class DatabaseService {
  private static instance: DatabaseService;
  private initialized: boolean = false;
  private connectionFailed: boolean = false;
  private errorMessage: string = '';
  private lastError: any = null;

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
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
   * Initialize the database service and ensure required tables exist
   */
  public async initialize(): Promise<boolean> {
    if (this.initialized) return true;
    
    try {
      console.log('Initializing database service...');
      
      // Verify configuration
      if (!SUPABASE_URL || !SUPABASE_KEY) {
        console.error('Supabase configuration missing');
        this.connectionFailed = true;
        this.errorMessage = 'Database configuration missing. Please check your environment variables.';
        return false;
      }
      
      // Check for active session
      console.log('Checking for active session...');
      const storedSession = localStorage.getItem('supabase.auth.token');
      const session = storedSession ? JSON.parse(storedSession) : null;
      
      if (!session || !session.access_token) {
        console.error('No active session found');
        this.connectionFailed = true;
        this.errorMessage = 'No active session found. Please login again.';
        return false;
      }
      
      // Verify the session token is valid
      try {
        const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'apikey': SUPABASE_KEY
          }
        });
        
        if (!response.ok) {
          console.error('Invalid session token');
          this.connectionFailed = true;
          this.errorMessage = 'Invalid session token. Please login again.';
          return false;
        }
        
        const userData = await response.json();
        console.log('Session found:', userData.email);
      } catch (error) {
        console.error('Session verification failed:', error);
        this.connectionFailed = true;
        this.errorMessage = 'Session verification failed. Please login again.';
        return false;
      }

      // First verify database connection with a simple query
      console.log('Testing database connection...');
      const isConnected = await this.checkConnection();

      if (!isConnected) {
        console.error('Database connection failed');
        this.connectionFailed = true;
        this.errorMessage = 'Database connection failed';
        return false;
      }

      console.log('Database connection successful');
      this.initialized = true;
      this.connectionFailed = false;
      return true;
    } catch (error) {
      console.error('Unexpected error during initialization:', error);
      this.connectionFailed = true;
      this.errorMessage = `Unexpected error: ${error instanceof Error ? error.message : String(error)}`;
      this.lastError = error;
      return false;
    }
  }

  /**
   * Check database connection
   */
  public async checkConnection(): Promise<boolean> {
    try {
      // Simple test query to check connection
      await this.supabaseRestCall('/rest/v1/test_connection?select=id&limit=1', {
        method: 'GET'
      });
      return true;
    } catch (error) {
      console.error('Database connection error:', error);
      return false;
    }
  }

  /**
   * Get the current connection status
   */
  public getConnectionStatus(): { failed: boolean; errorMessage: string; lastError: any } {
    return {
      failed: this.connectionFailed,
      errorMessage: this.errorMessage,
      lastError: this.lastError
    };
  }

  /**
   * Reset the connection status to force a reconnection
   */
  public resetConnectionStatus(): void {
    console.log('Resetting database connection status');
    this.connectionFailed = false;
    this.errorMessage = '';
    this.lastError = null;
    this.initialized = false;
  }
} 