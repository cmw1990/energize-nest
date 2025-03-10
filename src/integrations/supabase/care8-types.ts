// Type definitions for care8 tables
import { Database as OriginalDatabase } from './types';

// Extend the Database interface to include care8 tables
export interface Database extends OriginalDatabase {
  public: {
    Tables: OriginalDatabase['public']['Tables'] & {
      // Add care8 tables
      care8_groups: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
          created_by: string;
          updated_at: string;
          is_public: boolean;
          image_url: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
          created_by: string;
          updated_at?: string;
          is_public?: boolean;
          image_url?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
          created_by?: string;
          updated_at?: string;
          is_public?: boolean;
          image_url?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "care8_groups_created_by_fkey";
            columns: ["created_by"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      care8_group_members: {
        Row: {
          id: string;
          group_id: string;
          user_id: string;
          role: string;
          joined_at: string;
          invited_by: string | null;
        };
        Insert: {
          id?: string;
          group_id: string;
          user_id: string;
          role: string;
          joined_at?: string;
          invited_by?: string | null;
        };
        Update: {
          id?: string;
          group_id?: string;
          user_id?: string;
          role?: string;
          joined_at?: string;
          invited_by?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "care8_group_members_group_id_fkey";
            columns: ["group_id"];
            referencedRelation: "care8_groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "care8_group_members_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "care8_group_members_invited_by_fkey";
            columns: ["invited_by"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      care8_group_invitations: {
        Row: {
          id: string;
          group_id: string;
          invited_email: string;
          invited_by: string;
          created_at: string;
          expires_at: string;
          status: string;
        };
        Insert: {
          id?: string;
          group_id: string;
          invited_email: string;
          invited_by: string;
          created_at?: string;
          expires_at?: string;
          status?: string;
        };
        Update: {
          id?: string;
          group_id?: string;
          invited_email?: string;
          invited_by?: string;
          created_at?: string;
          expires_at?: string;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "care8_group_invitations_group_id_fkey";
            columns: ["group_id"];
            referencedRelation: "care8_groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "care8_group_invitations_invited_by_fkey";
            columns: ["invited_by"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      care8_group_tasks: {
        Row: {
          id: string
          group_id: string
          title: string
          description: string | null
          created_at: string
          created_by: string
          due_date: string | null
          status: string
          assigned_to: string | null
          priority: string | null
        }
        Insert: {
          id?: string
          group_id: string
          title: string
          description?: string | null
          created_at?: string
          created_by: string
          due_date?: string | null
          status?: string
          assigned_to?: string | null
          priority?: string | null
        }
        Update: {
          id?: string
          group_id?: string
          title?: string
          description?: string | null
          created_at?: string
          created_by?: string
          due_date?: string | null
          status?: string
          assigned_to?: string | null
          priority?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "care8_group_tasks_group_id_fkey"
            columns: ["group_id"]
            referencedRelation: "care8_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care8_group_tasks_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care8_group_tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      care8_health_records: {
        Row: {
          id: string
          user_id: string
          record_type: string
          date: string
          notes: string | null
          data: Record<string, any> | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          record_type: string
          date: string
          notes?: string | null
          data?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          record_type?: string
          date?: string
          notes?: string | null
          data?: Record<string, any> | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "care8_health_records_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      care8_providers: {
        Row: {
          id: string
          name: string
          specialty: string | null
          contact_info: Record<string, any> | null
          location: string | null
          created_at: string
          created_by: string | null
          verified: boolean
        }
        Insert: {
          id?: string
          name: string
          specialty?: string | null
          contact_info?: Record<string, any> | null
          location?: string | null
          created_at?: string
          created_by?: string | null
          verified?: boolean
        }
        Update: {
          id?: string
          name?: string
          specialty?: string | null
          contact_info?: Record<string, any> | null
          location?: string | null
          created_at?: string
          created_by?: string | null
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "care8_providers_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      care8_provider_reviews: {
        Row: {
          id: string
          provider_id: string
          user_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          provider_id: string
          user_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          provider_id?: string
          user_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "care8_provider_reviews_provider_id_fkey"
            columns: ["provider_id"]
            referencedRelation: "care8_providers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care8_provider_reviews_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      care8_activity_log: {
        Row: {
          id: string
          user_id: string
          action: string
          entity_type: string
          entity_id: string
          timestamp: string
          metadata: Record<string, any> | null
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          entity_type: string
          entity_id: string
          timestamp?: string
          metadata?: Record<string, any> | null
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          entity_type?: string
          entity_id?: string
          timestamp?: string
          metadata?: Record<string, any> | null
        }
        Relationships: [
          {
            foreignKeyName: "care8_activity_log_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      care8_group_events: {
        Row: {
          id: string
          group_id: string
          title: string
          description: string | null
          start_time: string
          end_time: string | null
          location: string | null
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          group_id: string
          title: string
          description?: string | null
          start_time: string
          end_time?: string | null
          location?: string | null
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          group_id?: string
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string | null
          location?: string | null
          created_at?: string
          created_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "care8_group_events_group_id_fkey"
            columns: ["group_id"]
            referencedRelation: "care8_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care8_group_events_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      care8_group_posts: {
        Row: {
          id: string
          group_id: string
          content: string
          created_at: string
          created_by: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          group_id: string
          content: string
          created_at?: string
          created_by: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          group_id?: string
          content?: string
          created_at?: string
          created_by?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "care8_group_posts_group_id_fkey"
            columns: ["group_id"]
            referencedRelation: "care8_groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care8_group_posts_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      care8_group_comments: {
        Row: {
          id: string
          post_id: string
          content: string
          created_at: string
          created_by: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          post_id: string
          content: string
          created_at?: string
          created_by: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          post_id?: string
          content?: string
          created_at?: string
          created_by?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "care8_group_comments_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "care8_group_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "care8_group_comments_created_by_fkey"
            columns: ["created_by"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    };
    Views: OriginalDatabase['public']['Views'];
    Functions: OriginalDatabase['public']['Functions'];
    Enums: OriginalDatabase['public']['Enums'];
    CompositeTypes: OriginalDatabase['public']['CompositeTypes'];
  };
} 