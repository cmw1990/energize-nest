// Auto-generated types for Supabase
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      care_groups: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          created_by: string
          updated_at: string
          is_public: boolean
          image_url: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          created_by: string
          updated_at?: string
          is_public?: boolean
          image_url?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          created_by?: string
          updated_at?: string
          is_public?: boolean
          image_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "care_groups_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      care_group_members: {
        Row: {
          id: string
          group_id: string
          user_id: string
          role: string
          joined_at: string
          invited_by: string | null
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          role: string
          joined_at?: string
          invited_by?: string | null
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          role?: string
          joined_at?: string
          invited_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "care_group_members_group_id_fkey"
            columns: ["group_id"]
            referencedRelation: "care_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care_group_members_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care_group_members_invited_by_fkey"
            columns: ["invited_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      care_group_invitations: {
        Row: {
          id: string
          group_id: string
          invited_email: string
          invited_by: string
          created_at: string
          expires_at: string
          status: string
        }
        Insert: {
          id?: string
          group_id: string
          invited_email: string
          invited_by: string
          created_at?: string
          expires_at?: string
          status?: string
        }
        Update: {
          id?: string
          group_id?: string
          invited_email?: string
          invited_by?: string
          created_at?: string
          expires_at?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "care_group_invitations_group_id_fkey"
            columns: ["group_id"]
            referencedRelation: "care_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care_group_invitations_invited_by_fkey"
            columns: ["invited_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      // Add other tables as needed
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export interface StepPoints {
  steps: number;
  source: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  points: number;
  start_date: string;
  end_date: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface SubscriptionReward {
  id: string;
  title: string;
  description: string;
  points_cost: number;
  valid_from: string;
  valid_until: string;
  type: string;
  metadata?: Record<string, any>;
}

export interface StoreProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  points_cost: number;
  category: string;
  image_url?: string;
  discounted?: boolean;
}

export interface PointsTransaction {
  id: string;
  user_id: string;
  points: number;
  type: 'earned' | 'spent' | 'bonus' | 'challenge' | 'streak';
  category: string;
  description: string;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface ProductPurchase {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  points_spent: number;
  created_at: string;
  metadata?: Record<string, any>;
}

export interface StreakUpdate {
  id: string;
  user_id: string;
  activity_type: string;
  timestamp: string;
  streak_count: number;
  metadata?: Record<string, any>;
}
