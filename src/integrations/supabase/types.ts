export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ab_test_assignments: {
        Row: {
          assigned_at: string | null
          id: string
          test_name: string
          user_id: string | null
          variant_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          id?: string
          test_name: string
          user_id?: string | null
          variant_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          id?: string
          test_name?: string
          user_id?: string | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ab_test_assignments_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "ab_test_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_test_events: {
        Row: {
          assignment_id: string | null
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
        }
        Insert: {
          assignment_id?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
        }
        Update: {
          assignment_id?: string | null
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ab_test_events_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "ab_test_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      ab_test_variants: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          test_name: string
          updated_at: string | null
          variant_name: string
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          test_name: string
          updated_at?: string | null
          variant_name: string
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          test_name?: string
          updated_at?: string | null
          variant_name?: string
          weight?: number | null
        }
        Relationships: []
      }
      accommodation_calendar: {
        Row: {
          accommodation_id: string | null
          base_price: number | null
          check_in_allowed: boolean | null
          check_out_allowed: boolean | null
          created_at: string | null
          date: string
          id: string
          is_available: boolean | null
          minimum_stay: number | null
          notes: string | null
          special_conditions: Json | null
          updated_at: string | null
        }
        Insert: {
          accommodation_id?: string | null
          base_price?: number | null
          check_in_allowed?: boolean | null
          check_out_allowed?: boolean | null
          created_at?: string | null
          date: string
          id?: string
          is_available?: boolean | null
          minimum_stay?: number | null
          notes?: string | null
          special_conditions?: Json | null
          updated_at?: string | null
        }
        Update: {
          accommodation_id?: string | null
          base_price?: number | null
          check_in_allowed?: boolean | null
          check_out_allowed?: boolean | null
          created_at?: string | null
          date?: string
          id?: string
          is_available?: boolean | null
          minimum_stay?: number | null
          notes?: string | null
          special_conditions?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accommodation_calendar_accommodation_id_fkey"
            columns: ["accommodation_id"]
            isOneToOne: false
            referencedRelation: "nordic_accommodations"
            referencedColumns: ["id"]
          },
        ]
      }
      accommodation_finances: {
        Row: {
          accommodation_id: string | null
          average_daily_rate: number | null
          cleaning_fees: number | null
          created_at: string | null
          id: string
          maintenance_costs: number | null
          month: number | null
          net_income: number | null
          occupancy_rate: number | null
          platform_fees: number | null
          revenue_per_available_room: number | null
          total_bookings: number | null
          total_revenue: number | null
          updated_at: string | null
          vendor_id: string | null
          year: number | null
        }
        Insert: {
          accommodation_id?: string | null
          average_daily_rate?: number | null
          cleaning_fees?: number | null
          created_at?: string | null
          id?: string
          maintenance_costs?: number | null
          month?: number | null
          net_income?: number | null
          occupancy_rate?: number | null
          platform_fees?: number | null
          revenue_per_available_room?: number | null
          total_bookings?: number | null
          total_revenue?: number | null
          updated_at?: string | null
          vendor_id?: string | null
          year?: number | null
        }
        Update: {
          accommodation_id?: string | null
          average_daily_rate?: number | null
          cleaning_fees?: number | null
          created_at?: string | null
          id?: string
          maintenance_costs?: number | null
          month?: number | null
          net_income?: number | null
          occupancy_rate?: number | null
          platform_fees?: number | null
          revenue_per_available_room?: number | null
          total_bookings?: number | null
          total_revenue?: number | null
          updated_at?: string | null
          vendor_id?: string | null
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "accommodation_finances_accommodation_id_fkey"
            columns: ["accommodation_id"]
            isOneToOne: false
            referencedRelation: "nordic_accommodations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accommodation_finances_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      accommodation_maintenance: {
        Row: {
          accommodation_id: string | null
          attachments: string[] | null
          completed_date: string | null
          cost: number | null
          created_at: string | null
          description: string | null
          id: string
          priority: string | null
          scheduled_date: string | null
          status: string | null
          type: string
          updated_at: string | null
          vendor_notes: string | null
        }
        Insert: {
          accommodation_id?: string | null
          attachments?: string[] | null
          completed_date?: string | null
          cost?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          scheduled_date?: string | null
          status?: string | null
          type: string
          updated_at?: string | null
          vendor_notes?: string | null
        }
        Update: {
          accommodation_id?: string | null
          attachments?: string[] | null
          completed_date?: string | null
          cost?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          scheduled_date?: string | null
          status?: string | null
          type?: string
          updated_at?: string | null
          vendor_notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accommodation_maintenance_accommodation_id_fkey"
            columns: ["accommodation_id"]
            isOneToOne: false
            referencedRelation: "nordic_accommodations"
            referencedColumns: ["id"]
          },
        ]
      }
      accommodation_reviews: {
        Row: {
          accommodation_id: string | null
          accuracy_rating: number | null
          booking_id: string | null
          checkin_rating: number | null
          cleanliness_rating: number | null
          communication_rating: number | null
          created_at: string | null
          guest_id: string | null
          helpful_votes: number | null
          host_response: string | null
          id: string
          location_rating: number | null
          photos: string[] | null
          rating: number | null
          reported: boolean | null
          review_text: string | null
          status: string | null
          updated_at: string | null
          value_rating: number | null
        }
        Insert: {
          accommodation_id?: string | null
          accuracy_rating?: number | null
          booking_id?: string | null
          checkin_rating?: number | null
          cleanliness_rating?: number | null
          communication_rating?: number | null
          created_at?: string | null
          guest_id?: string | null
          helpful_votes?: number | null
          host_response?: string | null
          id?: string
          location_rating?: number | null
          photos?: string[] | null
          rating?: number | null
          reported?: boolean | null
          review_text?: string | null
          status?: string | null
          updated_at?: string | null
          value_rating?: number | null
        }
        Update: {
          accommodation_id?: string | null
          accuracy_rating?: number | null
          booking_id?: string | null
          checkin_rating?: number | null
          cleanliness_rating?: number | null
          communication_rating?: number | null
          created_at?: string | null
          guest_id?: string | null
          helpful_votes?: number | null
          host_response?: string | null
          id?: string
          location_rating?: number | null
          photos?: string[] | null
          rating?: number | null
          reported?: boolean | null
          review_text?: string | null
          status?: string | null
          updated_at?: string | null
          value_rating?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "accommodation_reviews_accommodation_id_fkey"
            columns: ["accommodation_id"]
            isOneToOne: false
            referencedRelation: "nordic_accommodations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accommodation_reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      achievement_progress: {
        Row: {
          achievement_id: string
          current_progress: number | null
          id: string
          last_updated: string | null
          user_id: string
        }
        Insert: {
          achievement_id: string
          current_progress?: number | null
          id?: string
          last_updated?: string | null
          user_id: string
        }
        Update: {
          achievement_id?: string
          current_progress?: number | null
          id?: string
          last_updated?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "achievement_progress_achievement_id_fkey"
            columns: ["achievement_id"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["id"]
          },
        ]
      }
      achievement_rules: {
        Row: {
          badge_icon: string | null
          category: string
          created_at: string | null
          description: string | null
          id: string
          name: string
          points_reward: number | null
          trigger_type: string
          trigger_value: number | null
        }
        Insert: {
          badge_icon?: string | null
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          points_reward?: number | null
          trigger_type: string
          trigger_value?: number | null
        }
        Update: {
          badge_icon?: string | null
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          points_reward?: number | null
          trigger_type?: string
          trigger_value?: number | null
        }
        Relationships: []
      }
      achievements: {
        Row: {
          category: string | null
          created_at: string | null
          description: string
          icon: string
          id: string
          level: number | null
          next_level_points: number | null
          points: number
          progress: number | null
          streak_count: number | null
          target_value: number | null
          title: string
          type: string
          unlocked_at: string | null
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description: string
          icon: string
          id?: string
          level?: number | null
          next_level_points?: number | null
          points?: number
          progress?: number | null
          streak_count?: number | null
          target_value?: number | null
          title: string
          type: string
          unlocked_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string
          icon?: string
          id?: string
          level?: number | null
          next_level_points?: number | null
          points?: number
          progress?: number | null
          streak_count?: number | null
          target_value?: number | null
          title?: string
          type?: string
          unlocked_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      achievements_config: {
        Row: {
          badge_icon: string | null
          category: Database["public"]["Enums"]["achievement_category"]
          created_at: string | null
          description: string
          id: string
          name: string
          points: number
          threshold: number | null
        }
        Insert: {
          badge_icon?: string | null
          category: Database["public"]["Enums"]["achievement_category"]
          created_at?: string | null
          description: string
          id?: string
          name: string
          points?: number
          threshold?: number | null
        }
        Update: {
          badge_icon?: string | null
          category?: Database["public"]["Enums"]["achievement_category"]
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          points?: number
          threshold?: number | null
        }
        Relationships: []
      }
      activity_points: {
        Row: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          boosted: boolean | null
          created_at: string | null
          earned_at: string | null
          expires_at: string | null
          id: string
          points: number
          source_details: Json | null
          user_id: string
        }
        Insert: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          boosted?: boolean | null
          created_at?: string | null
          earned_at?: string | null
          expires_at?: string | null
          id?: string
          points: number
          source_details?: Json | null
          user_id: string
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["activity_type"]
          boosted?: boolean | null
          created_at?: string | null
          earned_at?: string | null
          expires_at?: string | null
          id?: string
          points?: number
          source_details?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      activity_tracking: {
        Row: {
          activity_name: string
          created_at: string | null
          duration_minutes: number | null
          id: string
          impact: Database["public"]["Enums"]["activity_impact"] | null
          notes: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activity_name: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          impact?: Database["public"]["Enums"]["activity_impact"] | null
          notes?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activity_name?: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          impact?: Database["public"]["Enums"]["activity_impact"] | null
          notes?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ad_blocking_exceptions: {
        Row: {
          created_at: string | null
          domain: string
          expiry_date: string | null
          id: string
          is_temporary: boolean | null
          reason: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          domain: string
          expiry_date?: string | null
          id?: string
          is_temporary?: boolean | null
          reason?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          domain?: string
          expiry_date?: string | null
          id?: string
          is_temporary?: boolean | null
          reason?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ad_blocking_filter_lists: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          enabled_by_default: boolean | null
          id: string
          is_premium: boolean | null
          last_updated: string | null
          name: string
          rules_count: number | null
          url: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          enabled_by_default?: boolean | null
          id?: string
          is_premium?: boolean | null
          last_updated?: string | null
          name: string
          rules_count?: number | null
          url: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          enabled_by_default?: boolean | null
          id?: string
          is_premium?: boolean | null
          last_updated?: string | null
          name?: string
          rules_count?: number | null
          url?: string
        }
        Relationships: []
      }
      ad_blocking_options: {
        Row: {
          cosmetic_filtering: boolean | null
          created_at: string | null
          custom_css: string | null
          custom_scripts: string | null
          element_hiding: boolean | null
          filter_lists: Json | null
          id: string
          is_premium: boolean | null
          network_filtering: boolean | null
          script_injection: boolean | null
          stealth_mode: boolean | null
          updated_at: string | null
          user_id: string | null
          whitelist_search: boolean | null
          whitelist_social: boolean | null
        }
        Insert: {
          cosmetic_filtering?: boolean | null
          created_at?: string | null
          custom_css?: string | null
          custom_scripts?: string | null
          element_hiding?: boolean | null
          filter_lists?: Json | null
          id?: string
          is_premium?: boolean | null
          network_filtering?: boolean | null
          script_injection?: boolean | null
          stealth_mode?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          whitelist_search?: boolean | null
          whitelist_social?: boolean | null
        }
        Update: {
          cosmetic_filtering?: boolean | null
          created_at?: string | null
          custom_css?: string | null
          custom_scripts?: string | null
          element_hiding?: boolean | null
          filter_lists?: Json | null
          id?: string
          is_premium?: boolean | null
          network_filtering?: boolean | null
          script_injection?: boolean | null
          stealth_mode?: boolean | null
          updated_at?: string | null
          user_id?: string | null
          whitelist_search?: boolean | null
          whitelist_social?: boolean | null
        }
        Relationships: []
      }
      ad_blocking_rules: {
        Row: {
          created_at: string | null
          description: string | null
          hits_count: number | null
          id: string
          is_active: boolean | null
          pattern: string
          priority: number | null
          rule_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          hits_count?: number | null
          id?: string
          is_active?: boolean | null
          pattern: string
          priority?: number | null
          rule_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          hits_count?: number | null
          id?: string
          is_active?: boolean | null
          pattern?: string
          priority?: number | null
          rule_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ad_blocking_stats: {
        Row: {
          ads_blocked: number | null
          bandwidth_saved: number | null
          created_at: string | null
          date: string
          id: string
          load_time_saved: number | null
          stats_data: Json | null
          trackers_blocked: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ads_blocked?: number | null
          bandwidth_saved?: number | null
          created_at?: string | null
          date?: string
          id?: string
          load_time_saved?: number | null
          stats_data?: Json | null
          trackers_blocked?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ads_blocked?: number | null
          bandwidth_saved?: number | null
          created_at?: string | null
          date?: string
          id?: string
          load_time_saved?: number | null
          stats_data?: Json | null
          trackers_blocked?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ad_campaign_stats: {
        Row: {
          campaign_id: string | null
          clicks: number | null
          conversion_count: number | null
          created_at: string | null
          date: string | null
          id: string
          impressions: number | null
          spend: number | null
        }
        Insert: {
          campaign_id?: string | null
          clicks?: number | null
          conversion_count?: number | null
          created_at?: string | null
          date?: string | null
          id?: string
          impressions?: number | null
          spend?: number | null
        }
        Update: {
          campaign_id?: string | null
          clicks?: number | null
          conversion_count?: number | null
          created_at?: string | null
          date?: string | null
          id?: string
          impressions?: number | null
          spend?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_campaign_stats_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "sponsored_products"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_display_zones: {
        Row: {
          created_at: string | null
          id: string
          price_multiplier: number
          zone_type: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          price_multiplier?: number
          zone_type: string
        }
        Update: {
          created_at?: string | null
          id?: string
          price_multiplier?: number
          zone_type?: string
        }
        Relationships: []
      }
      ad_impressions: {
        Row: {
          clicked_at: string | null
          cost: number | null
          id: string
          impressed_at: string | null
          sponsored_product_id: string
          user_id: string | null
        }
        Insert: {
          clicked_at?: string | null
          cost?: number | null
          id?: string
          impressed_at?: string | null
          sponsored_product_id: string
          user_id?: string | null
        }
        Update: {
          clicked_at?: string | null
          cost?: number | null
          id?: string
          impressed_at?: string | null
          sponsored_product_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ad_impressions_sponsored_product_id_fkey"
            columns: ["sponsored_product_id"]
            isOneToOne: false
            referencedRelation: "sponsored_products"
            referencedColumns: ["id"]
          },
        ]
      }
      ad_viewer_demographics: {
        Row: {
          age_range: string
          created_at: string | null
          id: string
          impression_id: string
        }
        Insert: {
          age_range: string
          created_at?: string | null
          id?: string
          impression_id: string
        }
        Update: {
          age_range?: string
          created_at?: string | null
          id?: string
          impression_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_viewer_demographics_impression_id_fkey"
            columns: ["impression_id"]
            isOneToOne: false
            referencedRelation: "ad_impressions"
            referencedColumns: ["id"]
          },
        ]
      }
      adhd_task_organization: {
        Row: {
          created_at: string | null
          difficulty_level: number | null
          energy_required: number | null
          estimated_focus_blocks: number | null
          id: string
          priority_method: string
          reward_points: number | null
          task_id: string
          updated_at: string | null
          user_id: string
          visual_tags: Json | null
        }
        Insert: {
          created_at?: string | null
          difficulty_level?: number | null
          energy_required?: number | null
          estimated_focus_blocks?: number | null
          id?: string
          priority_method: string
          reward_points?: number | null
          task_id: string
          updated_at?: string | null
          user_id: string
          visual_tags?: Json | null
        }
        Update: {
          created_at?: string | null
          difficulty_level?: number | null
          energy_required?: number | null
          estimated_focus_blocks?: number | null
          id?: string
          priority_method?: string
          reward_points?: number | null
          task_id?: string
          updated_at?: string | null
          user_id?: string
          visual_tags?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "adhd_task_organization_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_clicks: {
        Row: {
          affiliate_id: string
          clicked_at: string | null
          commission_amount: number | null
          converted_at: string | null
          id: string
          product_id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          affiliate_id: string
          clicked_at?: string | null
          commission_amount?: number | null
          converted_at?: string | null
          id?: string
          product_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          affiliate_id?: string
          clicked_at?: string | null
          commission_amount?: number | null
          converted_at?: string | null
          id?: string
          product_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_clicks_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "affiliate_clicks_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_commissions: {
        Row: {
          base_rate: number
          created_at: string | null
          id: string
          product_id: string | null
          special_rate: number | null
          special_rate_end: string | null
          special_rate_start: string | null
          updated_at: string | null
        }
        Insert: {
          base_rate?: number
          created_at?: string | null
          id?: string
          product_id?: string | null
          special_rate?: number | null
          special_rate_end?: string | null
          special_rate_start?: string | null
          updated_at?: string | null
        }
        Update: {
          base_rate?: number
          created_at?: string | null
          id?: string
          product_id?: string | null
          special_rate?: number | null
          special_rate_end?: string | null
          special_rate_start?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_commissions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "affiliate_commissions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliate_links: {
        Row: {
          affiliate_code: string
          clicks: number | null
          conversions: number | null
          created_at: string
          earnings: number | null
          id: string
          persona_type: string | null
          user_id: string
        }
        Insert: {
          affiliate_code: string
          clicks?: number | null
          conversions?: number | null
          created_at?: string
          earnings?: number | null
          id?: string
          persona_type?: string | null
          user_id: string
        }
        Update: {
          affiliate_code?: string
          clicks?: number | null
          conversions?: number | null
          created_at?: string
          earnings?: number | null
          id?: string
          persona_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      affiliate_tracking: {
        Row: {
          clicked_at: string | null
          commission_amount: number | null
          converted_at: string | null
          created_at: string | null
          id: string
          product_id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          clicked_at?: string | null
          commission_amount?: number | null
          converted_at?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          clicked_at?: string | null
          commission_amount?: number | null
          converted_at?: string | null
          created_at?: string | null
          id?: string
          product_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_tracking_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "affiliate_tracking_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_devotionals: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_shared: boolean | null
          personalization_context: Json | null
          scheduled_for: string | null
          theme: string | null
          title: string
          user_id: string | null
          verse_reference: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_shared?: boolean | null
          personalization_context?: Json | null
          scheduled_for?: string | null
          theme?: string | null
          title: string
          user_id?: string | null
          verse_reference: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_shared?: boolean | null
          personalization_context?: Json | null
          scheduled_for?: string | null
          theme?: string | null
          title?: string
          user_id?: string | null
          verse_reference?: string
        }
        Relationships: []
      }
      ai_verse_recommendations: {
        Row: {
          context_tags: string[] | null
          created_at: string | null
          id: string
          reasoning: string | null
          recommendation_type: string
          sentiment_match: number | null
          user_id: string
          verse_reference: string
        }
        Insert: {
          context_tags?: string[] | null
          created_at?: string | null
          id?: string
          reasoning?: string | null
          recommendation_type: string
          sentiment_match?: number | null
          user_id: string
          verse_reference: string
        }
        Update: {
          context_tags?: string[] | null
          created_at?: string | null
          id?: string
          reasoning?: string | null
          recommendation_type?: string
          sentiment_match?: number | null
          user_id?: string
          verse_reference?: string
        }
        Relationships: []
      }
      analytics_access: {
        Row: {
          access_level: string
          created_at: string | null
          expires_at: string | null
          granted_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_level: string
          created_at?: string | null
          expires_at?: string | null
          granted_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_level?: string
          created_at?: string | null
          expires_at?: string | null
          granted_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      artifacts: {
        Row: {
          created_at: string
          description: string
          history: string
          id: string
          name: string
          owner: string | null
          powers: string[]
          search_rank: number | null
          search_vector: unknown | null
          tags: string[] | null
          type: string | null
        }
        Insert: {
          created_at?: string
          description: string
          history: string
          id?: string
          name: string
          owner?: string | null
          powers: string[]
          search_rank?: number | null
          search_vector?: unknown | null
          tags?: string[] | null
          type?: string | null
        }
        Update: {
          created_at?: string
          description?: string
          history?: string
          id?: string
          name?: string
          owner?: string | null
          powers?: string[]
          search_rank?: number | null
          search_vector?: unknown | null
          tags?: string[] | null
          type?: string | null
        }
        Relationships: []
      }
      artwork_collection_items: {
        Row: {
          added_at: string
          artwork_id: string
          collection_id: string
        }
        Insert: {
          added_at?: string
          artwork_id: string
          collection_id: string
        }
        Update: {
          added_at?: string
          artwork_id?: string
          collection_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "artwork_collection_items_artwork_id_fkey"
            columns: ["artwork_id"]
            isOneToOne: false
            referencedRelation: "nordic_artwork"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artwork_collection_items_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "artwork_collections"
            referencedColumns: ["id"]
          },
        ]
      }
      artwork_collections: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      artwork_comments: {
        Row: {
          artwork_id: string | null
          content: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          artwork_id?: string | null
          content: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          artwork_id?: string | null
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "artwork_comments_artwork_id_fkey"
            columns: ["artwork_id"]
            isOneToOne: false
            referencedRelation: "nordic_artwork"
            referencedColumns: ["id"]
          },
        ]
      }
      artwork_likes: {
        Row: {
          artwork_id: string | null
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          artwork_id?: string | null
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          artwork_id?: string | null
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "artwork_likes_artwork_id_fkey"
            columns: ["artwork_id"]
            isOneToOne: false
            referencedRelation: "nordic_artwork"
            referencedColumns: ["id"]
          },
        ]
      }
      audio_bible_progress: {
        Row: {
          book: string
          chapter: number
          completed: boolean | null
          created_at: string
          id: string
          last_position: number | null
          updated_at: string
          user_id: string
          verse: number
        }
        Insert: {
          book: string
          chapter: number
          completed?: boolean | null
          created_at?: string
          id?: string
          last_position?: number | null
          updated_at?: string
          user_id: string
          verse: number
        }
        Update: {
          book?: string
          chapter?: number
          completed?: boolean | null
          created_at?: string
          id?: string
          last_position?: number | null
          updated_at?: string
          user_id?: string
          verse?: number
        }
        Relationships: []
      }
      audio_bible_settings: {
        Row: {
          auto_advance: boolean | null
          created_at: string
          id: string
          playback_speed: number | null
          preferred_narrator: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_advance?: boolean | null
          created_at?: string
          id?: string
          playback_speed?: number | null
          preferred_narrator?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_advance?: boolean | null
          created_at?: string
          id?: string
          playback_speed?: number | null
          preferred_narrator?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      audio_content: {
        Row: {
          audio_url: string
          content_type: string
          created_at: string
          description: string | null
          duration_seconds: number | null
          id: string
          realm_id: string | null
          title: string
        }
        Insert: {
          audio_url: string
          content_type: string
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          realm_id?: string | null
          title: string
        }
        Update: {
          audio_url?: string
          content_type?: string
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          realm_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "audio_content_realm_id_fkey"
            columns: ["realm_id"]
            isOneToOne: false
            referencedRelation: "realms"
            referencedColumns: ["id"]
          },
        ]
      }
      baby_tracking: {
        Row: {
          baby_name: string | null
          birth_date: string | null
          created_at: string
          feeding_method: Database["public"]["Enums"]["feeding_method"] | null
          head_circumference_cm: number | null
          height_cm: number | null
          id: string
          milestones: Json | null
          updated_at: string
          user_id: string
          weight_kg: number | null
        }
        Insert: {
          baby_name?: string | null
          birth_date?: string | null
          created_at?: string
          feeding_method?: Database["public"]["Enums"]["feeding_method"] | null
          head_circumference_cm?: number | null
          height_cm?: number | null
          id?: string
          milestones?: Json | null
          updated_at?: string
          user_id: string
          weight_kg?: number | null
        }
        Update: {
          baby_name?: string | null
          birth_date?: string | null
          created_at?: string
          feeding_method?: Database["public"]["Enums"]["feeding_method"] | null
          head_circumference_cm?: number | null
          height_cm?: number | null
          id?: string
          milestones?: Json | null
          updated_at?: string
          user_id?: string
          weight_kg?: number | null
        }
        Relationships: []
      }
      bathing_achievements: {
        Row: {
          achieved_at: string
          achievement_type: string
          id: string
          streak_count: number | null
          total_sessions: number | null
          user_id: string
        }
        Insert: {
          achieved_at?: string
          achievement_type: string
          id?: string
          streak_count?: number | null
          total_sessions?: number | null
          user_id: string
        }
        Update: {
          achieved_at?: string
          achievement_type?: string
          id?: string
          streak_count?: number | null
          total_sessions?: number | null
          user_id?: string
        }
        Relationships: []
      }
      bathing_reminders: {
        Row: {
          created_at: string
          days_of_week: string[]
          id: string
          is_active: boolean | null
          reminder_time: string
          routine_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          days_of_week: string[]
          id?: string
          is_active?: boolean | null
          reminder_time: string
          routine_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          days_of_week?: string[]
          id?: string
          is_active?: boolean | null
          reminder_time?: string
          routine_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bathing_reminders_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "bathing_routines"
            referencedColumns: ["id"]
          },
        ]
      }
      bathing_routines: {
        Row: {
          benefits: string[]
          created_at: string
          creator_id: string | null
          description: string | null
          duration_minutes: number
          id: string
          is_public: boolean | null
          mood_tags: string[]
          name: string
          scientific_sources: string[] | null
          steps: string[]
          water_temperature: string
        }
        Insert: {
          benefits: string[]
          created_at?: string
          creator_id?: string | null
          description?: string | null
          duration_minutes: number
          id?: string
          is_public?: boolean | null
          mood_tags: string[]
          name: string
          scientific_sources?: string[] | null
          steps: string[]
          water_temperature: string
        }
        Update: {
          benefits?: string[]
          created_at?: string
          creator_id?: string | null
          description?: string | null
          duration_minutes?: number
          id?: string
          is_public?: boolean | null
          mood_tags?: string[]
          name?: string
          scientific_sources?: string[] | null
          steps?: string[]
          water_temperature?: string
        }
        Relationships: []
      }
      bible_audio: {
        Row: {
          audio_url: string
          book: string
          chapter: number
          created_at: string
          duration_seconds: number | null
          id: string
          narrator_name: string | null
          translation_code: string | null
          verse: number
        }
        Insert: {
          audio_url: string
          book: string
          chapter: number
          created_at?: string
          duration_seconds?: number | null
          id?: string
          narrator_name?: string | null
          translation_code?: string | null
          verse: number
        }
        Update: {
          audio_url?: string
          book?: string
          chapter?: number
          created_at?: string
          duration_seconds?: number | null
          id?: string
          narrator_name?: string | null
          translation_code?: string | null
          verse?: number
        }
        Relationships: [
          {
            foreignKeyName: "bible_audio_translation_code_fkey"
            columns: ["translation_code"]
            isOneToOne: false
            referencedRelation: "bible_translations"
            referencedColumns: ["code"]
          },
        ]
      }
      bible_books: {
        Row: {
          created_at: string
          id: string
          name: string
          testament: Database["public"]["Enums"]["bible_testament"]
          total_chapters: number
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          testament: Database["public"]["Enums"]["bible_testament"]
          total_chapters: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          testament?: Database["public"]["Enums"]["bible_testament"]
          total_chapters?: number
        }
        Relationships: []
      }
      bible_commentaries: {
        Row: {
          author: string
          book: string
          chapter: number
          content: string
          created_at: string
          id: string
          source: string | null
          translation_code: string | null
          verse: number
        }
        Insert: {
          author: string
          book: string
          chapter: number
          content: string
          created_at?: string
          id?: string
          source?: string | null
          translation_code?: string | null
          verse: number
        }
        Update: {
          author?: string
          book?: string
          chapter?: number
          content?: string
          created_at?: string
          id?: string
          source?: string | null
          translation_code?: string | null
          verse?: number
        }
        Relationships: []
      }
      bible_maps: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string
          locations: Json | null
          period: string | null
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url: string
          locations?: Json | null
          period?: string | null
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string
          locations?: Json | null
          period?: string | null
          title?: string
        }
        Relationships: []
      }
      bible_quiz_questions: {
        Row: {
          category: string | null
          correct_answer: string
          created_at: string
          difficulty_level: string | null
          explanation: string | null
          id: string
          question: string
          wrong_answers: string[]
        }
        Insert: {
          category?: string | null
          correct_answer: string
          created_at?: string
          difficulty_level?: string | null
          explanation?: string | null
          id?: string
          question: string
          wrong_answers: string[]
        }
        Update: {
          category?: string | null
          correct_answer?: string
          created_at?: string
          difficulty_level?: string | null
          explanation?: string | null
          id?: string
          question?: string
          wrong_answers?: string[]
        }
        Relationships: []
      }
      bible_quiz_scores: {
        Row: {
          category: string | null
          created_at: string
          difficulty_level: string | null
          id: string
          questions_answered: number
          score: number
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          difficulty_level?: string | null
          id?: string
          questions_answered: number
          score: number
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          difficulty_level?: string | null
          id?: string
          questions_answered?: number
          score?: number
          user_id?: string | null
        }
        Relationships: []
      }
      bible_quizzes: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          difficulty_level: string | null
          id: string
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          id?: string
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      bible_study_groups: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_private: boolean | null
          meeting_schedule: Json | null
          name: string
          updated_at: string | null
          zoom_link: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_private?: boolean | null
          meeting_schedule?: Json | null
          name: string
          updated_at?: string | null
          zoom_link?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_private?: boolean | null
          meeting_schedule?: Json | null
          name?: string
          updated_at?: string | null
          zoom_link?: string | null
        }
        Relationships: []
      }
      bible_study_members: {
        Row: {
          created_at: string | null
          group_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          group_id: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          group_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bible_study_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "bible_study_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      bible_timeline_events: {
        Row: {
          biblical_reference: string | null
          category: string | null
          created_at: string
          date_approx: string | null
          description: string | null
          id: string
          image_url: string | null
          title: string
          year_approx: number | null
        }
        Insert: {
          biblical_reference?: string | null
          category?: string | null
          created_at?: string
          date_approx?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          title: string
          year_approx?: number | null
        }
        Update: {
          biblical_reference?: string | null
          category?: string | null
          created_at?: string
          date_approx?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          title?: string
          year_approx?: number | null
        }
        Relationships: []
      }
      bible_translations: {
        Row: {
          code: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      bible_verses: {
        Row: {
          book: string
          chapter: number
          created_at: string
          id: string
          text: string
          translation_code: string
          verse: number
        }
        Insert: {
          book: string
          chapter: number
          created_at?: string
          id?: string
          text: string
          translation_code: string
          verse: number
        }
        Update: {
          book?: string
          chapter?: number
          created_at?: string
          id?: string
          text?: string
          translation_code?: string
          verse?: number
        }
        Relationships: [
          {
            foreignKeyName: "bible_verses_translation_code_fkey"
            columns: ["translation_code"]
            isOneToOne: false
            referencedRelation: "bible_translations"
            referencedColumns: ["code"]
          },
        ]
      }
      bible_version_details: {
        Row: {
          created_at: string
          description: string | null
          id: string
          includes_deuterocanonical: boolean | null
          language: string | null
          tradition: Database["public"]["Enums"]["bible_tradition"] | null
          translation_code: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          includes_deuterocanonical?: boolean | null
          language?: string | null
          tradition?: Database["public"]["Enums"]["bible_tradition"] | null
          translation_code?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          includes_deuterocanonical?: boolean | null
          language?: string | null
          tradition?: Database["public"]["Enums"]["bible_tradition"] | null
          translation_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bible_version_details_translation_code_fkey"
            columns: ["translation_code"]
            isOneToOne: false
            referencedRelation: "bible_translations"
            referencedColumns: ["code"]
          },
        ]
      }
      biohacking_devices: {
        Row: {
          brand: string | null
          created_at: string | null
          device_type: Database["public"]["Enums"]["biohacking_activity_type"]
          effectiveness_rating: number | null
          id: string
          model: string | null
          notes: string | null
          price: number | null
          purchase_date: string | null
          user_id: string | null
        }
        Insert: {
          brand?: string | null
          created_at?: string | null
          device_type: Database["public"]["Enums"]["biohacking_activity_type"]
          effectiveness_rating?: number | null
          id?: string
          model?: string | null
          notes?: string | null
          price?: number | null
          purchase_date?: string | null
          user_id?: string | null
        }
        Update: {
          brand?: string | null
          created_at?: string | null
          device_type?: Database["public"]["Enums"]["biohacking_activity_type"]
          effectiveness_rating?: number | null
          id?: string
          model?: string | null
          notes?: string | null
          price?: number | null
          purchase_date?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      biohacking_discussions: {
        Row: {
          activity_type:
            | Database["public"]["Enums"]["biohacking_activity_type"]
            | null
          content: string
          created_at: string | null
          id: string
          tags: string[] | null
          title: string
          updated_at: string | null
          upvotes: number | null
          user_id: string | null
        }
        Insert: {
          activity_type?:
            | Database["public"]["Enums"]["biohacking_activity_type"]
            | null
          content: string
          created_at?: string | null
          id?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string | null
        }
        Update: {
          activity_type?:
            | Database["public"]["Enums"]["biohacking_activity_type"]
            | null
          content?: string
          created_at?: string | null
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      biohacking_effects: {
        Row: {
          created_at: string | null
          duration_hours: number | null
          effect_type: string
          id: string
          intensity: number | null
          notes: string | null
          session_id: string | null
        }
        Insert: {
          created_at?: string | null
          duration_hours?: number | null
          effect_type: string
          id?: string
          intensity?: number | null
          notes?: string | null
          session_id?: string | null
        }
        Update: {
          created_at?: string | null
          duration_hours?: number | null
          effect_type?: string
          id?: string
          intensity?: number | null
          notes?: string | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "biohacking_effects_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "biohacking_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      biohacking_reviews: {
        Row: {
          cons: string[] | null
          created_at: string | null
          device_id: string | null
          id: string
          pros: string[] | null
          rating: number | null
          review_text: string | null
          updated_at: string | null
          upvotes: number | null
          user_id: string | null
        }
        Insert: {
          cons?: string[] | null
          created_at?: string | null
          device_id?: string | null
          id?: string
          pros?: string[] | null
          rating?: number | null
          review_text?: string | null
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string | null
        }
        Update: {
          cons?: string[] | null
          created_at?: string | null
          device_id?: string | null
          id?: string
          pros?: string[] | null
          rating?: number | null
          review_text?: string | null
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "biohacking_reviews_device_id_fkey"
            columns: ["device_id"]
            isOneToOne: false
            referencedRelation: "biohacking_devices"
            referencedColumns: ["id"]
          },
        ]
      }
      biohacking_sessions: {
        Row: {
          activity_type: Database["public"]["Enums"]["biohacking_activity_type"]
          created_at: string | null
          duration_minutes: number | null
          energy_level: number | null
          focus_level: number | null
          id: string
          mood_after: number | null
          mood_before: number | null
          notes: string | null
          recovery_impact: number | null
          settings: Json | null
          sleep_impact: number | null
          user_id: string | null
        }
        Insert: {
          activity_type: Database["public"]["Enums"]["biohacking_activity_type"]
          created_at?: string | null
          duration_minutes?: number | null
          energy_level?: number | null
          focus_level?: number | null
          id?: string
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          recovery_impact?: number | null
          settings?: Json | null
          sleep_impact?: number | null
          user_id?: string | null
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["biohacking_activity_type"]
          created_at?: string | null
          duration_minutes?: number | null
          energy_level?: number | null
          focus_level?: number | null
          id?: string
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          recovery_impact?: number | null
          settings?: Json | null
          sleep_impact?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      blocking_rules: {
        Row: {
          blocking_type: Database["public"]["Enums"]["blocking_type"]
          created_at: string | null
          description: string | null
          distraction_score: number | null
          id: string
          is_active: boolean | null
          is_premium: boolean | null
          name: string
          pattern: Database["public"]["Enums"]["rule_pattern"]
          rule_value: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          blocking_type: Database["public"]["Enums"]["blocking_type"]
          created_at?: string | null
          description?: string | null
          distraction_score?: number | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          name: string
          pattern: Database["public"]["Enums"]["rule_pattern"]
          rule_value: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          blocking_type?: Database["public"]["Enums"]["blocking_type"]
          created_at?: string | null
          description?: string | null
          distraction_score?: number | null
          id?: string
          is_active?: boolean | null
          is_premium?: boolean | null
          name?: string
          pattern?: Database["public"]["Enums"]["rule_pattern"]
          rule_value?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      board_games: {
        Row: {
          board_size: number | null
          completed_at: string | null
          created_at: string | null
          difficulty_level: number
          game_state: Json
          game_type: Database["public"]["Enums"]["game_type"]
          id: string
          last_move_at: string | null
          moves: Json[] | null
          score: number | null
          started_at: string | null
          status: string
          updated_at: string | null
          user_id: string | null
          variant: string | null
          winner: string | null
        }
        Insert: {
          board_size?: number | null
          completed_at?: string | null
          created_at?: string | null
          difficulty_level?: number
          game_state?: Json
          game_type: Database["public"]["Enums"]["game_type"]
          id?: string
          last_move_at?: string | null
          moves?: Json[] | null
          score?: number | null
          started_at?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
          variant?: string | null
          winner?: string | null
        }
        Update: {
          board_size?: number | null
          completed_at?: string | null
          created_at?: string | null
          difficulty_level?: number
          game_state?: Json
          game_type?: Database["public"]["Enums"]["game_type"]
          id?: string
          last_move_at?: string | null
          moves?: Json[] | null
          score?: number | null
          started_at?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
          variant?: string | null
          winner?: string | null
        }
        Relationships: []
      }
      body_doubling_participants: {
        Row: {
          created_at: string | null
          id: string
          join_time: string | null
          leave_time: string | null
          session_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          join_time?: string | null
          leave_time?: string | null
          session_id: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          join_time?: string | null
          leave_time?: string | null
          session_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "body_doubling_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "body_doubling_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      body_doubling_sessions: {
        Row: {
          accountability_type: string | null
          achievement_metrics: Json | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          environment_settings: Json | null
          feedback_summary: string | null
          host_id: string
          id: string
          is_private: boolean | null
          max_participants: number | null
          meeting_link: string | null
          session_goals: Json | null
          session_type: string
          start_time: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          accountability_type?: string | null
          achievement_metrics?: Json | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          environment_settings?: Json | null
          feedback_summary?: string | null
          host_id: string
          id?: string
          is_private?: boolean | null
          max_participants?: number | null
          meeting_link?: string | null
          session_goals?: Json | null
          session_type: string
          start_time: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          accountability_type?: string | null
          achievement_metrics?: Json | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          environment_settings?: Json | null
          feedback_summary?: string | null
          host_id?: string
          id?: string
          is_private?: boolean | null
          max_participants?: number | null
          meeting_link?: string | null
          session_goals?: Json | null
          session_type?: string
          start_time?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      body_doubling_templates: {
        Row: {
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          focus_area: string[] | null
          id: string
          max_participants: number | null
          recurring_schedule: Json | null
          template_name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          focus_area?: string[] | null
          id?: string
          max_participants?: number | null
          recurring_schedule?: Json | null
          template_name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          focus_area?: string[] | null
          id?: string
          max_participants?: number | null
          recurring_schedule?: Json | null
          template_name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          accommodation_id: string | null
          additional_services: Json | null
          arrival_time: string | null
          cancellation_date: string | null
          cancellation_reason: string | null
          check_in: string
          check_in_instructions: string | null
          check_out: string
          created_at: string | null
          departure_time: string | null
          dietary_requirements: string[] | null
          guest_count: number
          guest_count_adults: number | null
          guest_count_children: number | null
          guest_count_infants: number | null
          guest_id: string
          guest_notes: string | null
          host_notes: string | null
          house_rules_accepted: boolean | null
          id: string
          payment_status: string | null
          refund_amount: number | null
          review_submitted: boolean | null
          special_requests: string | null
          status: string | null
          total_price: number
          transportation_needed: boolean | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          accommodation_id?: string | null
          additional_services?: Json | null
          arrival_time?: string | null
          cancellation_date?: string | null
          cancellation_reason?: string | null
          check_in: string
          check_in_instructions?: string | null
          check_out: string
          created_at?: string | null
          departure_time?: string | null
          dietary_requirements?: string[] | null
          guest_count: number
          guest_count_adults?: number | null
          guest_count_children?: number | null
          guest_count_infants?: number | null
          guest_id: string
          guest_notes?: string | null
          host_notes?: string | null
          house_rules_accepted?: boolean | null
          id?: string
          payment_status?: string | null
          refund_amount?: number | null
          review_submitted?: boolean | null
          special_requests?: string | null
          status?: string | null
          total_price: number
          transportation_needed?: boolean | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          accommodation_id?: string | null
          additional_services?: Json | null
          arrival_time?: string | null
          cancellation_date?: string | null
          cancellation_reason?: string | null
          check_in?: string
          check_in_instructions?: string | null
          check_out?: string
          created_at?: string | null
          departure_time?: string | null
          dietary_requirements?: string[] | null
          guest_count?: number
          guest_count_adults?: number | null
          guest_count_children?: number | null
          guest_count_infants?: number | null
          guest_id?: string
          guest_notes?: string | null
          host_notes?: string | null
          house_rules_accepted?: boolean | null
          id?: string
          payment_status?: string | null
          refund_amount?: number | null
          review_submitted?: boolean | null
          special_requests?: string | null
          status?: string | null
          total_price?: number
          transportation_needed?: boolean | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_accommodation_id_fkey"
            columns: ["accommodation_id"]
            isOneToOne: false
            referencedRelation: "nordic_accommodations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      brain_game_scores: {
        Row: {
          created_at: string | null
          difficulty: number | null
          duration_seconds: number | null
          game_type: string
          id: string
          metadata: Json | null
          score: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          difficulty?: number | null
          duration_seconds?: number | null
          game_type: string
          id?: string
          metadata?: Json | null
          score: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          difficulty?: number | null
          duration_seconds?: number | null
          game_type?: string
          id?: string
          metadata?: Json | null
          score?: number
          user_id?: string | null
        }
        Relationships: []
      }
      caffeine_products: {
        Row: {
          affiliate_link: string | null
          brand: string | null
          caffeine_content: number
          category: string
          commission_rate: number | null
          cons: string[] | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          ingredients: string[] | null
          name: string
          price: number | null
          pros: string[] | null
          serving_size: string
          updated_at: string
          warnings: string[] | null
        }
        Insert: {
          affiliate_link?: string | null
          brand?: string | null
          caffeine_content: number
          category: string
          commission_rate?: number | null
          cons?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          name: string
          price?: number | null
          pros?: string[] | null
          serving_size: string
          updated_at?: string
          warnings?: string[] | null
        }
        Update: {
          affiliate_link?: string | null
          brand?: string | null
          caffeine_content?: number
          category?: string
          commission_rate?: number | null
          cons?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          ingredients?: string[] | null
          name?: string
          price?: number | null
          pros?: string[] | null
          serving_size?: string
          updated_at?: string
          warnings?: string[] | null
        }
        Relationships: []
      }
      card_sorting_responses: {
        Row: {
          card_groups: Json
          completion_time: number | null
          created_at: string | null
          feedback: string | null
          id: string
          participant_id: string | null
          study_id: string | null
        }
        Insert: {
          card_groups: Json
          completion_time?: number | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          participant_id?: string | null
          study_id?: string | null
        }
        Update: {
          card_groups?: Json
          completion_time?: number | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          participant_id?: string | null
          study_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "card_sorting_responses_study_id_fkey"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "card_sorting_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      card_sorting_studies: {
        Row: {
          cards: Json | null
          categories: Json | null
          created_at: string | null
          description: string | null
          id: string
          instructions: string | null
          sort_type: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cards?: Json | null
          categories?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          instructions?: string | null
          sort_type: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cards?: Json | null
          categories?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          instructions?: string | null
          sort_type?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      cbt_exercises: {
        Row: {
          alternative_thoughts: string | null
          behaviors: string
          created_at: string | null
          emotions: string[]
          exercise_type: Database["public"]["Enums"]["cbt_exercise_type"]
          id: string
          outcome: string | null
          situation: string
          thoughts: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          alternative_thoughts?: string | null
          behaviors: string
          created_at?: string | null
          emotions: string[]
          exercise_type: Database["public"]["Enums"]["cbt_exercise_type"]
          id?: string
          outcome?: string | null
          situation: string
          thoughts: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          alternative_thoughts?: string | null
          behaviors?: string
          created_at?: string | null
          emotions?: string[]
          exercise_type?: Database["public"]["Enums"]["cbt_exercise_type"]
          id?: string
          outcome?: string | null
          situation?: string
          thoughts?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      character_relationships: {
        Row: {
          character1_id: string
          character2_id: string
          created_at: string
          description: string | null
          id: string
          relationship_type: string
        }
        Insert: {
          character1_id: string
          character2_id: string
          created_at?: string
          description?: string | null
          id?: string
          relationship_type: string
        }
        Update: {
          character1_id?: string
          character2_id?: string
          created_at?: string
          description?: string | null
          id?: string
          relationship_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "character_relationships_character1_id_fkey"
            columns: ["character1_id"]
            isOneToOne: false
            referencedRelation: "creatures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "character_relationships_character2_id_fkey"
            columns: ["character2_id"]
            isOneToOne: false
            referencedRelation: "creatures"
            referencedColumns: ["id"]
          },
        ]
      }
      characters: {
        Row: {
          created_at: string
          description: string
          family_connections: Json | null
          id: string
          image_url: string | null
          name: string
          powers: string[] | null
          realm_id: string | null
          search_vector: unknown | null
          title: string | null
          type: string
        }
        Insert: {
          created_at?: string
          description: string
          family_connections?: Json | null
          id?: string
          image_url?: string | null
          name: string
          powers?: string[] | null
          realm_id?: string | null
          search_vector?: unknown | null
          title?: string | null
          type: string
        }
        Update: {
          created_at?: string
          description?: string
          family_connections?: Json | null
          id?: string
          image_url?: string | null
          name?: string
          powers?: string[] | null
          realm_id?: string | null
          search_vector?: unknown | null
          title?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "characters_realm_id_fkey"
            columns: ["realm_id"]
            isOneToOne: false
            referencedRelation: "realms"
            referencedColumns: ["id"]
          },
        ]
      }
      child_faith_milestones: {
        Row: {
          created_at: string
          description: string | null
          family_member_id: string | null
          id: string
          milestone_date: string
          milestone_type: string
          photos: string[] | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          family_member_id?: string | null
          id?: string
          milestone_date: string
          milestone_type: string
          photos?: string[] | null
        }
        Update: {
          created_at?: string
          description?: string | null
          family_member_id?: string | null
          id?: string
          milestone_date?: string
          milestone_type?: string
          photos?: string[] | null
        }
        Relationships: []
      }
      christian_events: {
        Row: {
          church_id: string | null
          created_at: string | null
          description: string
          end_date: string
          event_type: string
          id: string
          location: Json | null
          max_attendees: number | null
          organizer_id: string | null
          start_date: string
          ticket_info: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          church_id?: string | null
          created_at?: string | null
          description: string
          end_date: string
          event_type: string
          id?: string
          location?: Json | null
          max_attendees?: number | null
          organizer_id?: string | null
          start_date: string
          ticket_info?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          church_id?: string | null
          created_at?: string | null
          description?: string
          end_date?: string
          event_type?: string
          id?: string
          location?: Json | null
          max_attendees?: number | null
          organizer_id?: string | null
          start_date?: string
          ticket_info?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "christian_events_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      christian_marriage_resources: {
        Row: {
          bible_reference: string | null
          category: string
          content: string
          created_at: string
          id: string
          tags: string[] | null
          title: string
        }
        Insert: {
          bible_reference?: string | null
          category: string
          content: string
          created_at?: string
          id?: string
          tags?: string[] | null
          title: string
        }
        Update: {
          bible_reference?: string | null
          category?: string
          content?: string
          created_at?: string
          id?: string
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
      christian_parenting_resources: {
        Row: {
          age_group: string
          bible_reference: string | null
          category: string
          content: string
          created_at: string
          id: string
          title: string
        }
        Insert: {
          age_group: string
          bible_reference?: string | null
          category: string
          content: string
          created_at?: string
          id?: string
          title: string
        }
        Update: {
          age_group?: string
          bible_reference?: string | null
          category?: string
          content?: string
          created_at?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      church_events: {
        Row: {
          church_id: string | null
          created_at: string
          description: string | null
          end_time: string | null
          event_type: string | null
          id: string
          is_recurring: boolean | null
          location: string | null
          recurrence_pattern: Json | null
          start_time: string
          title: string
          updated_at: string
        }
        Insert: {
          church_id?: string | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          event_type?: string | null
          id?: string
          is_recurring?: boolean | null
          location?: string | null
          recurrence_pattern?: Json | null
          start_time: string
          title: string
          updated_at?: string
        }
        Update: {
          church_id?: string | null
          created_at?: string
          description?: string | null
          end_time?: string | null
          event_type?: string | null
          id?: string
          is_recurring?: boolean | null
          location?: string | null
          recurrence_pattern?: Json | null
          start_time?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_events_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      church_followers: {
        Row: {
          church_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          church_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          church_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_followers_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      church_ownership_claims: {
        Row: {
          church_id: string
          created_at: string
          id: string
          proof_documents: string[] | null
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          church_id: string
          created_at?: string
          id?: string
          proof_documents?: string[] | null
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          church_id?: string
          created_at?: string
          id?: string
          proof_documents?: string[] | null
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_ownership_claims_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      church_post_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_post_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "church_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      church_post_likes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_post_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "church_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      church_posts: {
        Row: {
          author_id: string
          church_id: string
          comments_count: number | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          likes_count: number | null
          updated_at: string
        }
        Insert: {
          author_id: string
          church_id: string
          comments_count?: number | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number | null
          updated_at?: string
        }
        Update: {
          author_id?: string
          church_id?: string
          comments_count?: number | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_posts_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      church_reviews: {
        Row: {
          church_id: string | null
          created_at: string
          id: string
          rating: number | null
          review_text: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          church_id?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          review_text?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          church_id?: string | null
          created_at?: string
          id?: string
          rating?: number | null
          review_text?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "church_reviews_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      church_service_times: {
        Row: {
          church_id: string | null
          created_at: string
          day_of_week: string
          end_time: string | null
          id: string
          service_type: string | null
          start_time: string
        }
        Insert: {
          church_id?: string | null
          created_at?: string
          day_of_week: string
          end_time?: string | null
          id?: string
          service_type?: string | null
          start_time: string
        }
        Update: {
          church_id?: string | null
          created_at?: string
          day_of_week?: string
          end_time?: string | null
          id?: string
          service_type?: string | null
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_service_times_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      church_services: {
        Row: {
          church_id: string | null
          created_at: string
          day_of_week: number
          description: string | null
          end_time: string
          id: string
          is_recurring: boolean | null
          service_type: string | null
          start_time: string
          title: string
        }
        Insert: {
          church_id?: string | null
          created_at?: string
          day_of_week: number
          description?: string | null
          end_time: string
          id?: string
          is_recurring?: boolean | null
          service_type?: string | null
          start_time: string
          title: string
        }
        Update: {
          church_id?: string | null
          created_at?: string
          day_of_week?: number
          description?: string | null
          end_time?: string
          id?: string
          is_recurring?: boolean | null
          service_type?: string | null
          start_time?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "church_services_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      churches: {
        Row: {
          accessibility_features: string[] | null
          address: string
          architectural_style: string | null
          capacity: number | null
          childcare: boolean | null
          city: string
          community_services: string[] | null
          contact_persons: Json[] | null
          country: string
          created_at: string
          denomination: string | null
          description: string | null
          dress_code: string | null
          education_programs: Json | null
          email: string | null
          facilities: Json | null
          founding_year: number | null
          hearing_assistance: boolean | null
          history: string | null
          id: string
          is_verified: boolean | null
          languages: string[] | null
          latitude: number | null
          longitude: number | null
          main_leader: string | null
          ministries: Json | null
          mission_statement: string | null
          name: string
          parking_info: string | null
          phone: string | null
          photos: string[] | null
          postal_code: string
          search_vector: unknown | null
          service_times: Json[] | null
          small_groups: Json[] | null
          social_events: Json | null
          social_media: Json | null
          special_ministries: Json | null
          staff: Json[] | null
          state: string
          tags: string[] | null
          translations_available: string[] | null
          transportation_services: Json | null
          updated_at: string
          verified_owner_id: string | null
          virtual_worship_links: Json | null
          visiting_hours: Json[] | null
          website_url: string | null
          wheelchair_accessible: boolean | null
          worship_style: string[] | null
          youth_programs: Json[] | null
        }
        Insert: {
          accessibility_features?: string[] | null
          address: string
          architectural_style?: string | null
          capacity?: number | null
          childcare?: boolean | null
          city: string
          community_services?: string[] | null
          contact_persons?: Json[] | null
          country?: string
          created_at?: string
          denomination?: string | null
          description?: string | null
          dress_code?: string | null
          education_programs?: Json | null
          email?: string | null
          facilities?: Json | null
          founding_year?: number | null
          hearing_assistance?: boolean | null
          history?: string | null
          id?: string
          is_verified?: boolean | null
          languages?: string[] | null
          latitude?: number | null
          longitude?: number | null
          main_leader?: string | null
          ministries?: Json | null
          mission_statement?: string | null
          name: string
          parking_info?: string | null
          phone?: string | null
          photos?: string[] | null
          postal_code: string
          search_vector?: unknown | null
          service_times?: Json[] | null
          small_groups?: Json[] | null
          social_events?: Json | null
          social_media?: Json | null
          special_ministries?: Json | null
          staff?: Json[] | null
          state: string
          tags?: string[] | null
          translations_available?: string[] | null
          transportation_services?: Json | null
          updated_at?: string
          verified_owner_id?: string | null
          virtual_worship_links?: Json | null
          visiting_hours?: Json[] | null
          website_url?: string | null
          wheelchair_accessible?: boolean | null
          worship_style?: string[] | null
          youth_programs?: Json[] | null
        }
        Update: {
          accessibility_features?: string[] | null
          address?: string
          architectural_style?: string | null
          capacity?: number | null
          childcare?: boolean | null
          city?: string
          community_services?: string[] | null
          contact_persons?: Json[] | null
          country?: string
          created_at?: string
          denomination?: string | null
          description?: string | null
          dress_code?: string | null
          education_programs?: Json | null
          email?: string | null
          facilities?: Json | null
          founding_year?: number | null
          hearing_assistance?: boolean | null
          history?: string | null
          id?: string
          is_verified?: boolean | null
          languages?: string[] | null
          latitude?: number | null
          longitude?: number | null
          main_leader?: string | null
          ministries?: Json | null
          mission_statement?: string | null
          name?: string
          parking_info?: string | null
          phone?: string | null
          photos?: string[] | null
          postal_code?: string
          search_vector?: unknown | null
          service_times?: Json[] | null
          small_groups?: Json[] | null
          social_events?: Json | null
          social_media?: Json | null
          special_ministries?: Json | null
          staff?: Json[] | null
          state?: string
          tags?: string[] | null
          translations_available?: string[] | null
          transportation_services?: Json | null
          updated_at?: string
          verified_owner_id?: string | null
          virtual_worship_links?: Json | null
          visiting_hours?: Json[] | null
          website_url?: string | null
          wheelchair_accessible?: boolean | null
          worship_style?: string[] | null
          youth_programs?: Json[] | null
        }
        Relationships: []
      }
      client_emergency_contacts: {
        Row: {
          client_id: string | null
          contact_name: string
          created_at: string | null
          email: string | null
          id: string
          is_primary: boolean | null
          phone: string
          relationship: string
        }
        Insert: {
          client_id?: string | null
          contact_name: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          phone: string
          relationship: string
        }
        Update: {
          client_id?: string | null
          contact_name?: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          phone?: string
          relationship?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_emergency_contacts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_goals: {
        Row: {
          client_id: string | null
          created_at: string | null
          description: string | null
          id: string
          professional_id: string | null
          progress: number | null
          status: string
          target_date: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          professional_id?: string | null
          progress?: number | null
          status?: string
          target_date?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          professional_id?: string | null
          progress?: number | null
          status?: string
          target_date?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      client_insurance: {
        Row: {
          client_id: string
          coverage_details: Json | null
          created_at: string | null
          group_number: string | null
          id: string
          is_primary: boolean | null
          policy_number: string
          provider_id: string
          relationship_to_subscriber: string
          subscriber_id: string
          subscriber_name: string
          updated_at: string | null
          verification_status: string | null
        }
        Insert: {
          client_id: string
          coverage_details?: Json | null
          created_at?: string | null
          group_number?: string | null
          id?: string
          is_primary?: boolean | null
          policy_number: string
          provider_id: string
          relationship_to_subscriber: string
          subscriber_id: string
          subscriber_name: string
          updated_at?: string | null
          verification_status?: string | null
        }
        Update: {
          client_id?: string
          coverage_details?: Json | null
          created_at?: string | null
          group_number?: string | null
          id?: string
          is_primary?: boolean | null
          policy_number?: string
          provider_id?: string
          relationship_to_subscriber?: string
          subscriber_id?: string
          subscriber_name?: string
          updated_at?: string | null
          verification_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_insurance_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_insurance_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "insurance_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      client_preferences: {
        Row: {
          client_id: string | null
          communication_preferences: Json | null
          created_at: string | null
          id: string
          preferred_approaches: string[] | null
          preferred_gender: string | null
          preferred_languages: string[] | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          communication_preferences?: Json | null
          created_at?: string | null
          id?: string
          preferred_approaches?: string[] | null
          preferred_gender?: string | null
          preferred_languages?: string[] | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          communication_preferences?: Json | null
          created_at?: string | null
          id?: string
          preferred_approaches?: string[] | null
          preferred_gender?: string | null
          preferred_languages?: string[] | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      client_progress: {
        Row: {
          client_id: string
          created_at: string
          homework: string | null
          id: string
          next_steps: string | null
          notes: string | null
          professional_id: string
          progress_rating: number | null
          session_id: string
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          homework?: string | null
          id?: string
          next_steps?: string | null
          notes?: string | null
          professional_id: string
          progress_rating?: number | null
          session_id: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          homework?: string | null
          id?: string
          next_steps?: string | null
          notes?: string | null
          professional_id?: string
          progress_rating?: number | null
          session_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_progress_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "consultation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      client_progress_tracking: {
        Row: {
          client_id: string | null
          client_type: string | null
          created_at: string | null
          homework: string | null
          id: string
          milestone_achievements: string[] | null
          next_assessment_date: string | null
          next_steps: string | null
          notes: string | null
          professional_id: string | null
          progress_notes: string | null
          progress_rating: number | null
          session_id: string | null
          treatment_goals: string[] | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          client_type?: string | null
          created_at?: string | null
          homework?: string | null
          id?: string
          milestone_achievements?: string[] | null
          next_assessment_date?: string | null
          next_steps?: string | null
          notes?: string | null
          professional_id?: string | null
          progress_notes?: string | null
          progress_rating?: number | null
          session_id?: string | null
          treatment_goals?: string[] | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          client_type?: string | null
          created_at?: string | null
          homework?: string | null
          id?: string
          milestone_achievements?: string[] | null
          next_assessment_date?: string | null
          next_steps?: string | null
          notes?: string | null
          professional_id?: string | null
          progress_notes?: string | null
          progress_rating?: number | null
          session_id?: string | null
          treatment_goals?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_progress_client_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_progress_tracking_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "consultation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      coffee_brewing_guides: {
        Row: {
          brew_time: string | null
          coffee_to_water_ratio: string | null
          common_mistakes: string[] | null
          created_at: string
          difficulty_level: string | null
          equipment_needed: string[] | null
          grind_size: string | null
          id: string
          method: string
          steps: string[]
          tips: string[] | null
          updated_at: string
          water_temperature: string | null
        }
        Insert: {
          brew_time?: string | null
          coffee_to_water_ratio?: string | null
          common_mistakes?: string[] | null
          created_at?: string
          difficulty_level?: string | null
          equipment_needed?: string[] | null
          grind_size?: string | null
          id?: string
          method: string
          steps: string[]
          tips?: string[] | null
          updated_at?: string
          water_temperature?: string | null
        }
        Update: {
          brew_time?: string | null
          coffee_to_water_ratio?: string | null
          common_mistakes?: string[] | null
          created_at?: string
          difficulty_level?: string | null
          equipment_needed?: string[] | null
          grind_size?: string | null
          id?: string
          method?: string
          steps?: string[]
          tips?: string[] | null
          updated_at?: string
          water_temperature?: string | null
        }
        Relationships: []
      }
      coffee_equipment: {
        Row: {
          affiliate_link: string | null
          best_for: string[] | null
          category: string
          commission_rate: number | null
          created_at: string
          description: string
          features: string[] | null
          id: string
          image_url: string | null
          maintenance_tips: string[] | null
          name: string
          price_range: string | null
          updated_at: string
        }
        Insert: {
          affiliate_link?: string | null
          best_for?: string[] | null
          category: string
          commission_rate?: number | null
          created_at?: string
          description: string
          features?: string[] | null
          id?: string
          image_url?: string | null
          maintenance_tips?: string[] | null
          name: string
          price_range?: string | null
          updated_at?: string
        }
        Update: {
          affiliate_link?: string | null
          best_for?: string[] | null
          category?: string
          commission_rate?: number | null
          created_at?: string
          description?: string
          features?: string[] | null
          id?: string
          image_url?: string | null
          maintenance_tips?: string[] | null
          name?: string
          price_range?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      coffee_types: {
        Row: {
          brewing_methods: string[] | null
          created_at: string
          description: string
          flavor_profile: string[] | null
          id: string
          name: string
          origin: string | null
          roast_level: string | null
          updated_at: string
        }
        Insert: {
          brewing_methods?: string[] | null
          created_at?: string
          description: string
          flavor_profile?: string[] | null
          id?: string
          name: string
          origin?: string | null
          roast_level?: string | null
          updated_at?: string
        }
        Update: {
          brewing_methods?: string[] | null
          created_at?: string
          description?: string
          flavor_profile?: string[] | null
          id?: string
          name?: string
          origin?: string | null
          roast_level?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      cognitive_distortions: {
        Row: {
          description: string
          examples: string[] | null
          id: string
          name: string
        }
        Insert: {
          description: string
          examples?: string[] | null
          id?: string
          name: string
        }
        Update: {
          description?: string
          examples?: string[] | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      collection_products: {
        Row: {
          added_at: string | null
          collection_id: string
          product_id: string
        }
        Insert: {
          added_at?: string | null
          collection_id: string
          product_id: string
        }
        Update: {
          added_at?: string | null
          collection_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_products_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "collection_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      collection_verses: {
        Row: {
          book: string
          chapter: number
          collection_id: string
          created_at: string
          id: string
          verse: number
        }
        Insert: {
          book: string
          chapter: number
          collection_id: string
          created_at?: string
          id?: string
          verse: number
        }
        Update: {
          book?: string
          chapter?: number
          collection_id?: string
          created_at?: string
          id?: string
          verse?: number
        }
        Relationships: [
          {
            foreignKeyName: "collection_verses_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "verse_collections"
            referencedColumns: ["id"]
          },
        ]
      }
      collections: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          content: string
          created_at: string | null
          downvotes: number | null
          id: string
          parent_id: string | null
          product_id: string | null
          updated_at: string | null
          upvotes: number | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          downvotes?: number | null
          id?: string
          parent_id?: string | null
          product_id?: string | null
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          downvotes?: number | null
          id?: string
          parent_id?: string | null
          product_id?: string | null
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "comments_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_insights: {
        Row: {
          ai_enhanced_tags: string[] | null
          created_at: string | null
          id: string
          insight: string
          likes_count: number | null
          user_id: string
          verse_reference: string
        }
        Insert: {
          ai_enhanced_tags?: string[] | null
          created_at?: string | null
          id?: string
          insight: string
          likes_count?: number | null
          user_id: string
          verse_reference: string
        }
        Update: {
          ai_enhanced_tags?: string[] | null
          created_at?: string | null
          id?: string
          insight?: string
          likes_count?: number | null
          user_id?: string
          verse_reference?: string
        }
        Relationships: []
      }
      consultation_availability: {
        Row: {
          created_at: string
          day_of_week: number | null
          end_time: string
          id: string
          is_available: boolean | null
          professional_id: string | null
          start_time: string
        }
        Insert: {
          created_at?: string
          day_of_week?: number | null
          end_time: string
          id?: string
          is_available?: boolean | null
          professional_id?: string | null
          start_time: string
        }
        Update: {
          created_at?: string
          day_of_week?: number | null
          end_time?: string
          id?: string
          is_available?: boolean | null
          professional_id?: string | null
          start_time?: string
        }
        Relationships: []
      }
      consultation_feedback: {
        Row: {
          anonymous: boolean | null
          client_id: string | null
          created_at: string | null
          feedback_text: string | null
          id: string
          professional_id: string | null
          rating: number | null
          session_id: string | null
        }
        Insert: {
          anonymous?: boolean | null
          client_id?: string | null
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          professional_id?: string | null
          rating?: number | null
          session_id?: string | null
        }
        Update: {
          anonymous?: boolean | null
          client_id?: string | null
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          professional_id?: string | null
          rating?: number | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultation_feedback_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "consultation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_messages: {
        Row: {
          attachment_url: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message_text: string
          receiver_id: string | null
          sender_id: string | null
        }
        Insert: {
          attachment_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_text: string
          receiver_id?: string | null
          sender_id?: string | null
        }
        Update: {
          attachment_url?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_text?: string
          receiver_id?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultation_messages_sender_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_notes: {
        Row: {
          client_id: string | null
          content: string
          created_at: string
          follow_up_date: string | null
          id: string
          mood_observed: string | null
          professional_id: string | null
          progress_notes: string | null
          recommendations: Json | null
          session_id: string | null
        }
        Insert: {
          client_id?: string | null
          content: string
          created_at?: string
          follow_up_date?: string | null
          id?: string
          mood_observed?: string | null
          professional_id?: string | null
          progress_notes?: string | null
          recommendations?: Json | null
          session_id?: string | null
        }
        Update: {
          client_id?: string | null
          content?: string
          created_at?: string
          follow_up_date?: string | null
          id?: string
          mood_observed?: string | null
          professional_id?: string | null
          progress_notes?: string | null
          recommendations?: Json | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultation_notes_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "mental_health_professionals"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultation_notes_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "consultation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_notifications: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      consultation_packages: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          professional_id: string | null
          session_count: number
          updated_at: string | null
          validity_days: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          professional_id?: string | null
          session_count: number
          updated_at?: string | null
          validity_days: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          professional_id?: string | null
          session_count?: number
          updated_at?: string | null
          validity_days?: number
        }
        Relationships: [
          {
            foreignKeyName: "consultation_packages_professional_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_payments: {
        Row: {
          amount: number
          client_id: string | null
          created_at: string
          id: string
          package_id: string | null
          payment_method: string | null
          professional_id: string | null
          status: string | null
          transaction_id: string | null
        }
        Insert: {
          amount: number
          client_id?: string | null
          created_at?: string
          id?: string
          package_id?: string | null
          payment_method?: string | null
          professional_id?: string | null
          status?: string | null
          transaction_id?: string | null
        }
        Update: {
          amount?: number
          client_id?: string | null
          created_at?: string
          id?: string
          package_id?: string | null
          payment_method?: string | null
          professional_id?: string | null
          status?: string | null
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultation_payments_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "consultation_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_progress: {
        Row: {
          client_id: string | null
          created_at: string | null
          homework: string | null
          id: string
          next_steps: string | null
          notes: string | null
          professional_id: string | null
          progress_rating: number | null
          session_id: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          homework?: string | null
          id?: string
          next_steps?: string | null
          notes?: string | null
          professional_id?: string | null
          progress_rating?: number | null
          session_id?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          homework?: string | null
          id?: string
          next_steps?: string | null
          notes?: string | null
          professional_id?: string | null
          progress_rating?: number | null
          session_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultation_progress_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "consultation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_reminders: {
        Row: {
          created_at: string | null
          id: string
          recipient_id: string | null
          reminder_type: string
          scheduled_for: string
          sent_at: string | null
          session_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          recipient_id?: string | null
          reminder_type: string
          scheduled_for: string
          sent_at?: string | null
          session_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          recipient_id?: string | null
          reminder_type?: string
          scheduled_for?: string
          sent_at?: string | null
          session_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultation_reminders_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultation_reminders_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "consultation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_resources: {
        Row: {
          content: string | null
          created_at: string | null
          description: string | null
          file_url: string | null
          id: string
          is_public: boolean | null
          professional_id: string | null
          resource_type: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          is_public?: boolean | null
          professional_id?: string | null
          resource_type: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          description?: string | null
          file_url?: string | null
          id?: string
          is_public?: boolean | null
          professional_id?: string | null
          resource_type?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultation_resources_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_reviews: {
        Row: {
          client_id: string | null
          created_at: string
          id: string
          is_anonymous: boolean | null
          professional_id: string | null
          rating: number | null
          review_text: string | null
          session_id: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          id?: string
          is_anonymous?: boolean | null
          professional_id?: string | null
          rating?: number | null
          review_text?: string | null
          session_id?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string
          id?: string
          is_anonymous?: boolean | null
          professional_id?: string | null
          rating?: number | null
          review_text?: string | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultation_reviews_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "consultation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      consultation_scheduling_rules: {
        Row: {
          availability_hours: Json
          buffer_minutes: number
          created_at: string | null
          id: string
          max_daily_sessions: number
          professional_id: string | null
          session_duration_minutes: number
          updated_at: string | null
        }
        Insert: {
          availability_hours?: Json
          buffer_minutes?: number
          created_at?: string | null
          id?: string
          max_daily_sessions?: number
          professional_id?: string | null
          session_duration_minutes?: number
          updated_at?: string | null
        }
        Update: {
          availability_hours?: Json
          buffer_minutes?: number
          created_at?: string | null
          id?: string
          max_daily_sessions?: number
          professional_id?: string | null
          session_duration_minutes?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      consultation_sessions: {
        Row: {
          client_id: string | null
          created_at: string
          duration_minutes: number
          feedback_submitted: boolean | null
          id: string
          meeting_link: string | null
          notes: string | null
          professional_id: string | null
          scheduled_start: string | null
          session_date: string
          session_type: string
          status: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          duration_minutes: number
          feedback_submitted?: boolean | null
          id?: string
          meeting_link?: string | null
          notes?: string | null
          professional_id?: string | null
          scheduled_start?: string | null
          session_date: string
          session_type: string
          status?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string
          duration_minutes?: number
          feedback_submitted?: boolean | null
          id?: string
          meeting_link?: string | null
          notes?: string | null
          professional_id?: string | null
          scheduled_start?: string | null
          session_date?: string
          session_type?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consultation_sessions_client_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "consultation_sessions_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "mental_health_professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      content_connections: {
        Row: {
          accuracy_rating: number | null
          created_at: string | null
          creator: string | null
          cultural_notes: string | null
          description: string
          id: string
          media_links: string[] | null
          modern_interpretation_title: string
          modern_interpretation_type: string
          original_content_id: string
          original_content_type: string
          release_year: number | null
          title: string
        }
        Insert: {
          accuracy_rating?: number | null
          created_at?: string | null
          creator?: string | null
          cultural_notes?: string | null
          description: string
          id?: string
          media_links?: string[] | null
          modern_interpretation_title: string
          modern_interpretation_type: string
          original_content_id: string
          original_content_type: string
          release_year?: number | null
          title: string
        }
        Update: {
          accuracy_rating?: number | null
          created_at?: string | null
          creator?: string | null
          cultural_notes?: string | null
          description?: string
          id?: string
          media_links?: string[] | null
          modern_interpretation_title?: string
          modern_interpretation_type?: string
          original_content_id?: string
          original_content_type?: string
          release_year?: number | null
          title?: string
        }
        Relationships: []
      }
      coping_strategies: {
        Row: {
          category: string
          created_at: string | null
          effectiveness_rating: number
          id: string
          notes: string | null
          strategy_name: string
          used_count: number | null
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          effectiveness_rating: number
          id?: string
          notes?: string | null
          strategy_name: string
          used_count?: number | null
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          effectiveness_rating?: number
          id?: string
          notes?: string | null
          strategy_name?: string
          used_count?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      coping_strategies_library: {
        Row: {
          category: string
          contraindications: string[] | null
          created_at: string | null
          description: string
          difficulty_level: number | null
          effectiveness_data: Json | null
          energy_required: number | null
          estimated_time_minutes: number | null
          focus_required: number | null
          id: string
          instructions: string | null
          name: string
          suitable_for: string[] | null
        }
        Insert: {
          category: string
          contraindications?: string[] | null
          created_at?: string | null
          description: string
          difficulty_level?: number | null
          effectiveness_data?: Json | null
          energy_required?: number | null
          estimated_time_minutes?: number | null
          focus_required?: number | null
          id?: string
          instructions?: string | null
          name: string
          suitable_for?: string[] | null
        }
        Update: {
          category?: string
          contraindications?: string[] | null
          created_at?: string | null
          description?: string
          difficulty_level?: number | null
          effectiveness_data?: Json | null
          energy_required?: number | null
          estimated_time_minutes?: number | null
          focus_required?: number | null
          id?: string
          instructions?: string | null
          name?: string
          suitable_for?: string[] | null
        }
        Relationships: []
      }
      coupons: {
        Row: {
          active: boolean | null
          code: string
          created_at: string | null
          description: string | null
          discount_amount: number | null
          discount_percentage: number | null
          expires_at: string | null
          id: string
          product_id: string | null
          vendor_id: string | null
        }
        Insert: {
          active?: boolean | null
          code: string
          created_at?: string | null
          description?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          expires_at?: string | null
          id?: string
          product_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          active?: boolean | null
          code?: string
          created_at?: string | null
          description?: string | null
          discount_amount?: number | null
          discount_percentage?: number | null
          expires_at?: string | null
          id?: string
          product_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupons_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "coupons_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupons_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      craving_logs: {
        Row: {
          activity: string | null
          coping_strategy_used: string | null
          created_at: string | null
          emotional_state: string | null
          id: string
          intensity: number | null
          location: string | null
          notes: string | null
          success_rating: number | null
          trigger_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activity?: string | null
          coping_strategy_used?: string | null
          created_at?: string | null
          emotional_state?: string | null
          id?: string
          intensity?: number | null
          location?: string | null
          notes?: string | null
          success_rating?: number | null
          trigger_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activity?: string | null
          coping_strategy_used?: string | null
          created_at?: string | null
          emotional_state?: string | null
          id?: string
          intensity?: number | null
          location?: string | null
          notes?: string | null
          success_rating?: number | null
          trigger_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      creatine_logs: {
        Row: {
          brand: string
          consumed_at: string | null
          created_at: string | null
          dosage_grams: number
          effectiveness_rating: number | null
          form: Database["public"]["Enums"]["supplement_form"]
          id: string
          mixed_with: string | null
          notes: string | null
          side_effects: string[] | null
          timing: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          brand: string
          consumed_at?: string | null
          created_at?: string | null
          dosage_grams: number
          effectiveness_rating?: number | null
          form: Database["public"]["Enums"]["supplement_form"]
          id?: string
          mixed_with?: string | null
          notes?: string | null
          side_effects?: string[] | null
          timing: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          brand?: string
          consumed_at?: string | null
          created_at?: string | null
          dosage_grams?: number
          effectiveness_rating?: number | null
          form?: Database["public"]["Enums"]["supplement_form"]
          id?: string
          mixed_with?: string | null
          notes?: string | null
          side_effects?: string[] | null
          timing?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      creatine_products: {
        Row: {
          brand: string
          certifications: string[] | null
          created_at: string | null
          description: string
          form: Database["public"]["Enums"]["supplement_form"]
          id: string
          ingredients: string[] | null
          name: string
          price: number | null
          serving_size_grams: number
          servings_per_container: number | null
          third_party_tested: boolean | null
          updated_at: string | null
        }
        Insert: {
          brand: string
          certifications?: string[] | null
          created_at?: string | null
          description: string
          form: Database["public"]["Enums"]["supplement_form"]
          id?: string
          ingredients?: string[] | null
          name: string
          price?: number | null
          serving_size_grams: number
          servings_per_container?: number | null
          third_party_tested?: boolean | null
          updated_at?: string | null
        }
        Update: {
          brand?: string
          certifications?: string[] | null
          created_at?: string | null
          description?: string
          form?: Database["public"]["Enums"]["supplement_form"]
          id?: string
          ingredients?: string[] | null
          name?: string
          price?: number | null
          serving_size_grams?: number
          servings_per_container?: number | null
          third_party_tested?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      creatures: {
        Row: {
          characteristics: string[]
          created_at: string
          description: string
          id: string
          name: string
          realm_id: string | null
          search_rank: number | null
          search_vector: unknown | null
        }
        Insert: {
          characteristics: string[]
          created_at?: string
          description: string
          id?: string
          name: string
          realm_id?: string | null
          search_rank?: number | null
          search_vector?: unknown | null
        }
        Update: {
          characteristics?: string[]
          created_at?: string
          description?: string
          id?: string
          name?: string
          realm_id?: string | null
          search_rank?: number | null
          search_vector?: unknown | null
        }
        Relationships: [
          {
            foreignKeyName: "creatures_realm_id_fkey"
            columns: ["realm_id"]
            isOneToOne: false
            referencedRelation: "realms"
            referencedColumns: ["id"]
          },
        ]
      }
      crisis_plans: {
        Row: {
          coping_strategies: string[] | null
          created_at: string | null
          crisis_hotlines: string[] | null
          emergency_contacts: Json[] | null
          id: string
          medications: Json[] | null
          professional_contacts: Json[] | null
          safe_places: string[] | null
          support_contacts: Json[] | null
          triggers: string[] | null
          updated_at: string | null
          user_id: string
          warning_signs: string[] | null
        }
        Insert: {
          coping_strategies?: string[] | null
          created_at?: string | null
          crisis_hotlines?: string[] | null
          emergency_contacts?: Json[] | null
          id?: string
          medications?: Json[] | null
          professional_contacts?: Json[] | null
          safe_places?: string[] | null
          support_contacts?: Json[] | null
          triggers?: string[] | null
          updated_at?: string | null
          user_id: string
          warning_signs?: string[] | null
        }
        Update: {
          coping_strategies?: string[] | null
          created_at?: string | null
          crisis_hotlines?: string[] | null
          emergency_contacts?: Json[] | null
          id?: string
          medications?: Json[] | null
          professional_contacts?: Json[] | null
          safe_places?: string[] | null
          support_contacts?: Json[] | null
          triggers?: string[] | null
          updated_at?: string | null
          user_id?: string
          warning_signs?: string[] | null
        }
        Relationships: []
      }
      crisis_resources: {
        Row: {
          available_hours: string | null
          category: string
          contact_info: string
          created_at: string | null
          description: string | null
          id: string
          is_emergency: boolean | null
          name: string
        }
        Insert: {
          available_hours?: string | null
          category: string
          contact_info: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_emergency?: boolean | null
          name: string
        }
        Update: {
          available_hours?: string | null
          category?: string
          contact_info?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_emergency?: boolean | null
          name?: string
        }
        Relationships: []
      }
      cultural_gatherings: {
        Row: {
          accessibility_info: string | null
          contact_details: Json | null
          cost_details: Json | null
          created_at: string | null
          cultural_guidelines: string | null
          date_end: string | null
          date_start: string | null
          description: string
          event_name: string
          event_type: string
          id: string
          location: string | null
          max_participants: number | null
          organizer_info: Json | null
          registration_required: boolean | null
        }
        Insert: {
          accessibility_info?: string | null
          contact_details?: Json | null
          cost_details?: Json | null
          created_at?: string | null
          cultural_guidelines?: string | null
          date_end?: string | null
          date_start?: string | null
          description: string
          event_name: string
          event_type: string
          id?: string
          location?: string | null
          max_participants?: number | null
          organizer_info?: Json | null
          registration_required?: boolean | null
        }
        Update: {
          accessibility_info?: string | null
          contact_details?: Json | null
          cost_details?: Json | null
          created_at?: string | null
          cultural_guidelines?: string | null
          date_end?: string | null
          date_start?: string | null
          description?: string
          event_name?: string
          event_type?: string
          id?: string
          location?: string | null
          max_participants?: number | null
          organizer_info?: Json | null
          registration_required?: boolean | null
        }
        Relationships: []
      }
      customer_behavior: {
        Row: {
          behavior_patterns: Json | null
          created_at: string | null
          customer_segments: Json | null
          id: string
          revenue_trends: Json | null
          vendor_id: string | null
        }
        Insert: {
          behavior_patterns?: Json | null
          created_at?: string | null
          customer_segments?: Json | null
          id?: string
          revenue_trends?: Json | null
          vendor_id?: string | null
        }
        Update: {
          behavior_patterns?: Json | null
          created_at?: string | null
          customer_segments?: Json | null
          id?: string
          revenue_trends?: Json | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_behavior_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_behavior_analysis: {
        Row: {
          behavior_patterns: Json
          created_at: string | null
          customer_segments: Json
          engagement_metrics: Json | null
          id: string
          purchase_predictions: Json | null
          revenue_trends: Json
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          behavior_patterns?: Json
          created_at?: string | null
          customer_segments?: Json
          engagement_metrics?: Json | null
          id?: string
          purchase_predictions?: Json | null
          revenue_trends?: Json
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          behavior_patterns?: Json
          created_at?: string | null
          customer_segments?: Json
          engagement_metrics?: Json | null
          id?: string
          purchase_predictions?: Json | null
          revenue_trends?: Json
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_behavior_analysis_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_engagements: {
        Row: {
          created_at: string | null
          customer_id: string
          id: string
          interaction_data: Json
          interaction_type: string
          sentiment_score: number | null
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          created_at?: string | null
          customer_id: string
          id?: string
          interaction_data?: Json
          interaction_type: string
          sentiment_score?: number | null
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          created_at?: string | null
          customer_id?: string
          id?: string
          interaction_data?: Json
          interaction_type?: string
          sentiment_score?: number | null
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_engagements_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_loyalty_points: {
        Row: {
          created_at: string | null
          id: string
          points: number | null
          tier: string | null
          updated_at: string | null
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          points?: number | null
          tier?: string | null
          updated_at?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          points?: number | null
          tier?: string | null
          updated_at?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_loyalty_points_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      cycle_exercise_recommendations: {
        Row: {
          benefits: string[]
          created_at: string
          description: string
          exercise_type: string
          id: string
          intensity_level: string
          phase_type: string
          precautions: string[]
        }
        Insert: {
          benefits?: string[]
          created_at?: string
          description: string
          exercise_type: string
          id?: string
          intensity_level: string
          phase_type: string
          precautions?: string[]
        }
        Update: {
          benefits?: string[]
          created_at?: string
          description?: string
          exercise_type?: string
          id?: string
          intensity_level?: string
          phase_type?: string
          precautions?: string[]
        }
        Relationships: []
      }
      cycle_nutrition_recommendations: {
        Row: {
          benefits: string
          created_at: string
          food_category: string
          food_items: string[]
          id: string
          nutrients: string[]
          phase_type: string
        }
        Insert: {
          benefits: string
          created_at?: string
          food_category: string
          food_items?: string[]
          id?: string
          nutrients?: string[]
          phase_type: string
        }
        Update: {
          benefits?: string
          created_at?: string
          food_category?: string
          food_items?: string[]
          id?: string
          nutrients?: string[]
          phase_type?: string
        }
        Relationships: []
      }
      cycle_phase_impacts: {
        Row: {
          created_at: string | null
          date: string
          energy_impact: number | null
          focus_impact: number | null
          id: string
          mood_impact: number | null
          phase_type: string
          sleep_impact: number | null
          stress_impact: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date?: string
          energy_impact?: number | null
          focus_impact?: number | null
          id?: string
          mood_impact?: number | null
          phase_type: string
          sleep_impact?: number | null
          stress_impact?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          energy_impact?: number | null
          focus_impact?: number | null
          id?: string
          mood_impact?: number | null
          phase_type?: string
          sleep_impact?: number | null
          stress_impact?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      cycle_phase_predictions: {
        Row: {
          confidence_score: number | null
          created_at: string
          id: string
          phase_type: string
          predicted_end_date: string
          predicted_start_date: string
          updated_at: string
          user_id: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          phase_type: string
          predicted_end_date: string
          predicted_start_date: string
          updated_at?: string
          user_id: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          phase_type?: string
          predicted_end_date?: string
          predicted_start_date?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cycle_phase_recommendations: {
        Row: {
          category: string
          created_at: string | null
          description: string
          id: string
          phase_type: string
          priority: number | null
          tags: string[] | null
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          id?: string
          phase_type: string
          priority?: number | null
          tags?: string[] | null
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          phase_type?: string
          priority?: number | null
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
      cycle_sleep_correlations: {
        Row: {
          created_at: string
          date: string
          heart_rate_variability: number | null
          id: string
          phase_type: string
          resting_heart_rate: number | null
          sleep_duration: number | null
          sleep_quality: number | null
          temperature_celsius: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          date?: string
          heart_rate_variability?: number | null
          id?: string
          phase_type: string
          resting_heart_rate?: number | null
          sleep_duration?: number | null
          sleep_quality?: number | null
          temperature_celsius?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          heart_rate_variability?: number | null
          id?: string
          phase_type?: string
          resting_heart_rate?: number | null
          sleep_duration?: number | null
          sleep_quality?: number | null
          temperature_celsius?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      cycle_symptom_templates: {
        Row: {
          category: string
          created_at: string | null
          id: string
          name: string
          phase_type: string
          severity_scale: string[] | null
          suggested_remedies: string[] | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          name: string
          phase_type: string
          severity_scale?: string[] | null
          suggested_remedies?: string[] | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          name?: string
          phase_type?: string
          severity_scale?: string[] | null
          suggested_remedies?: string[] | null
        }
        Relationships: []
      }
      cycle_tracking: {
        Row: {
          created_at: string
          cycle_phase: string | null
          date: string
          energy_level: number | null
          id: string
          mood: string | null
          sleep_quality: number | null
          stress_level: number | null
          symptoms: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          cycle_phase?: string | null
          date?: string
          energy_level?: number | null
          id?: string
          mood?: string | null
          sleep_quality?: number | null
          stress_level?: number | null
          symptoms?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          cycle_phase?: string | null
          date?: string
          energy_level?: number | null
          id?: string
          mood?: string | null
          sleep_quality?: number | null
          stress_level?: number | null
          symptoms?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cycle_weather_impacts: {
        Row: {
          created_at: string
          date: string
          id: string
          notes: string | null
          phase_type: string
          symptom_intensity: number | null
          symptom_type: string
          user_id: string
          weather_data: Json
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          phase_type: string
          symptom_intensity?: number | null
          symptom_type: string
          user_id: string
          weather_data?: Json
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          notes?: string | null
          phase_type?: string
          symptom_intensity?: number | null
          symptom_type?: string
          user_id?: string
          weather_data?: Json
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_checkins: {
        Row: {
          created_at: string | null
          energy_level: number | null
          id: string
          mood_score: number | null
          notes: string | null
          sleep_quality: number | null
          stress_level: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          energy_level?: number | null
          id?: string
          mood_score?: number | null
          notes?: string | null
          sleep_quality?: number | null
          stress_level?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          energy_level?: number | null
          id?: string
          mood_score?: number | null
          notes?: string | null
          sleep_quality?: number | null
          stress_level?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      daily_facts: {
        Row: {
          active_date: string
          category: string
          content: string
          created_at: string
          id: string
          source: string | null
          title: string
        }
        Insert: {
          active_date: string
          category: string
          content: string
          created_at?: string
          id?: string
          source?: string | null
          title: string
        }
        Update: {
          active_date?: string
          category?: string
          content?: string
          created_at?: string
          id?: string
          source?: string | null
          title?: string
        }
        Relationships: []
      }
      daily_wellness_logs: {
        Row: {
          challenges_faced: string[] | null
          coping_strategies_used: string[] | null
          cravings_intensity: number | null
          created_at: string | null
          date: string
          energy_level: number | null
          exercise_minutes: number | null
          focus_level: number | null
          id: string
          medication_adherence: boolean | null
          mood_level: number | null
          notes: string | null
          side_effects: string[] | null
          sleep_quality: number | null
          stress_level: number | null
          trigger_situations: string[] | null
          user_id: string
          water_intake_ml: number | null
          wins_today: string[] | null
        }
        Insert: {
          challenges_faced?: string[] | null
          coping_strategies_used?: string[] | null
          cravings_intensity?: number | null
          created_at?: string | null
          date?: string
          energy_level?: number | null
          exercise_minutes?: number | null
          focus_level?: number | null
          id?: string
          medication_adherence?: boolean | null
          mood_level?: number | null
          notes?: string | null
          side_effects?: string[] | null
          sleep_quality?: number | null
          stress_level?: number | null
          trigger_situations?: string[] | null
          user_id: string
          water_intake_ml?: number | null
          wins_today?: string[] | null
        }
        Update: {
          challenges_faced?: string[] | null
          coping_strategies_used?: string[] | null
          cravings_intensity?: number | null
          created_at?: string | null
          date?: string
          energy_level?: number | null
          exercise_minutes?: number | null
          focus_level?: number | null
          id?: string
          medication_adherence?: boolean | null
          mood_level?: number | null
          notes?: string | null
          side_effects?: string[] | null
          sleep_quality?: number | null
          stress_level?: number | null
          trigger_situations?: string[] | null
          user_id?: string
          water_intake_ml?: number | null
          wins_today?: string[] | null
        }
        Relationships: []
      }
      dating_matches: {
        Row: {
          created_at: string | null
          id: string
          matched_at: string | null
          user_1_action: string
          user_2_action: string | null
          user_id_1: string | null
          user_id_2: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          matched_at?: string | null
          user_1_action: string
          user_2_action?: string | null
          user_id_1?: string | null
          user_id_2?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          matched_at?: string | null
          user_1_action?: string
          user_2_action?: string | null
          user_id_1?: string | null
          user_id_2?: string | null
        }
        Relationships: []
      }
      dating_profiles: {
        Row: {
          about_me: string | null
          age: number
          church_involvement: string | null
          created_at: string | null
          denomination: string | null
          faith_journey: string | null
          faith_level: Database["public"]["Enums"]["faith_level"]
          favorite_bible_verses: string[] | null
          id: string
          interests: string[] | null
          looking_for: string | null
          ministry_participation: string[] | null
          occupation: string | null
          photos: string[] | null
          prayer_life_description: string | null
          relationship_intent: Database["public"]["Enums"]["relationship_intent"]
          spiritual_gifts: string[] | null
          updated_at: string | null
          values_and_beliefs: string[] | null
        }
        Insert: {
          about_me?: string | null
          age: number
          church_involvement?: string | null
          created_at?: string | null
          denomination?: string | null
          faith_journey?: string | null
          faith_level: Database["public"]["Enums"]["faith_level"]
          favorite_bible_verses?: string[] | null
          id: string
          interests?: string[] | null
          looking_for?: string | null
          ministry_participation?: string[] | null
          occupation?: string | null
          photos?: string[] | null
          prayer_life_description?: string | null
          relationship_intent: Database["public"]["Enums"]["relationship_intent"]
          spiritual_gifts?: string[] | null
          updated_at?: string | null
          values_and_beliefs?: string[] | null
        }
        Update: {
          about_me?: string | null
          age?: number
          church_involvement?: string | null
          created_at?: string | null
          denomination?: string | null
          faith_journey?: string | null
          faith_level?: Database["public"]["Enums"]["faith_level"]
          favorite_bible_verses?: string[] | null
          id?: string
          interests?: string[] | null
          looking_for?: string | null
          ministry_participation?: string[] | null
          occupation?: string | null
          photos?: string[] | null
          prayer_life_description?: string | null
          relationship_intent?: Database["public"]["Enums"]["relationship_intent"]
          spiritual_gifts?: string[] | null
          updated_at?: string | null
          values_and_beliefs?: string[] | null
        }
        Relationships: []
      }
      delivery_tracking: {
        Row: {
          created_at: string | null
          estimated_delivery: string | null
          id: string
          order_id: string | null
          status: Database["public"]["Enums"]["delivery_status"] | null
          tracking_number: string | null
        }
        Insert: {
          created_at?: string | null
          estimated_delivery?: string | null
          id?: string
          order_id?: string | null
          status?: Database["public"]["Enums"]["delivery_status"] | null
          tracking_number?: string | null
        }
        Update: {
          created_at?: string | null
          estimated_delivery?: string | null
          id?: string
          order_id?: string | null
          status?: Database["public"]["Enums"]["delivery_status"] | null
          tracking_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_tracking_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      design_surveys: {
        Row: {
          created_at: string | null
          description: string | null
          design_url: string | null
          id: string
          questions: Json | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          design_url?: string | null
          id?: string
          questions?: Json | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          design_url?: string | null
          id?: string
          questions?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      devotional_plan_days: {
        Row: {
          content: string
          created_at: string
          day_number: number
          id: string
          plan_id: string | null
          prayer_focus: string | null
          reflection_questions: string[] | null
          scripture_reference: string
          title: string
        }
        Insert: {
          content: string
          created_at?: string
          day_number: number
          id?: string
          plan_id?: string | null
          prayer_focus?: string | null
          reflection_questions?: string[] | null
          scripture_reference: string
          title: string
        }
        Update: {
          content?: string
          created_at?: string
          day_number?: number
          id?: string
          plan_id?: string | null
          prayer_focus?: string | null
          reflection_questions?: string[] | null
          scripture_reference?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "devotional_plan_days_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "devotional_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      devotional_plans: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          duration_days: number
          id: string
          is_featured: boolean | null
          preview_content: string | null
          title: string
          topics: string[] | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration_days: number
          id?: string
          is_featured?: boolean | null
          preview_content?: string | null
          title: string
          topics?: string[] | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          duration_days?: number
          id?: string
          is_featured?: boolean | null
          preview_content?: string | null
          title?: string
          topics?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      devotional_progress: {
        Row: {
          completed_at: string | null
          completed_days: number[] | null
          current_day: number | null
          id: string
          last_completed_day: string | null
          notes: string | null
          plan_id: string | null
          started_at: string
          streak_count: number | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          completed_days?: number[] | null
          current_day?: number | null
          id?: string
          last_completed_day?: string | null
          notes?: string | null
          plan_id?: string | null
          started_at?: string
          streak_count?: number | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          completed_days?: number[] | null
          current_day?: number | null
          id?: string
          last_completed_day?: string | null
          notes?: string | null
          plan_id?: string | null
          started_at?: string
          streak_count?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devotional_progress_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "devotional_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      devotionals: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          id: string
          scheduled_for: string | null
          scripture_reference: string
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          scheduled_for?: string | null
          scripture_reference: string
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          scheduled_for?: string | null
          scripture_reference?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      discord_role_mappings: {
        Row: {
          created_at: string | null
          discord_role_id: string
          id: string
          integration_id: string | null
          product_id: string | null
        }
        Insert: {
          created_at?: string | null
          discord_role_id: string
          id?: string
          integration_id?: string | null
          product_id?: string | null
        }
        Update: {
          created_at?: string | null
          discord_role_id?: string
          id?: string
          integration_id?: string | null
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discord_role_mappings_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "platform_integrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discord_role_mappings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "discord_role_mappings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_responses: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_solution: boolean | null
          topic_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_solution?: boolean | null
          topic_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_solution?: boolean | null
          topic_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "discussion_responses_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "discussion_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      discussion_topics: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_pinned: boolean | null
          product_id: string | null
          status: Database["public"]["Enums"]["discussion_status"] | null
          title: string
          updated_at: string | null
          user_id: string | null
          view_count: number | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          product_id?: string | null
          status?: Database["public"]["Enums"]["discussion_status"] | null
          title: string
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          product_id?: string | null
          status?: Database["public"]["Enums"]["discussion_status"] | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "discussion_topics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "discussion_topics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_topics_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      distraction_block_logs: {
        Row: {
          attempt_count: number | null
          block_id: string | null
          block_type: Database["public"]["Enums"]["distraction_type"]
          blocked_at: string | null
          id: string
          target: string
          user_id: string
        }
        Insert: {
          attempt_count?: number | null
          block_id?: string | null
          block_type: Database["public"]["Enums"]["distraction_type"]
          blocked_at?: string | null
          id?: string
          target: string
          user_id: string
        }
        Update: {
          attempt_count?: number | null
          block_id?: string | null
          block_type?: Database["public"]["Enums"]["distraction_type"]
          blocked_at?: string | null
          id?: string
          target?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "distraction_block_logs_block_id_fkey"
            columns: ["block_id"]
            isOneToOne: false
            referencedRelation: "distraction_blocking"
            referencedColumns: ["id"]
          },
        ]
      }
      distraction_blocking: {
        Row: {
          block_type: Database["public"]["Enums"]["distraction_type"]
          break_duration: number | null
          created_at: string | null
          days_active: string[] | null
          id: string
          is_active: boolean | null
          last_break_at: string | null
          pattern_data: Json | null
          priority: number | null
          productivity_score: number | null
          schedule_end: string | null
          schedule_start: string | null
          schedule_type: string | null
          target: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          block_type: Database["public"]["Enums"]["distraction_type"]
          break_duration?: number | null
          created_at?: string | null
          days_active?: string[] | null
          id?: string
          is_active?: boolean | null
          last_break_at?: string | null
          pattern_data?: Json | null
          priority?: number | null
          productivity_score?: number | null
          schedule_end?: string | null
          schedule_start?: string | null
          schedule_type?: string | null
          target: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          block_type?: Database["public"]["Enums"]["distraction_type"]
          break_duration?: number | null
          created_at?: string | null
          days_active?: string[] | null
          id?: string
          is_active?: boolean | null
          last_break_at?: string | null
          pattern_data?: Json | null
          priority?: number | null
          productivity_score?: number | null
          schedule_end?: string | null
          schedule_start?: string | null
          schedule_type?: string | null
          target?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ease_tag_ratings: {
        Row: {
          created_at: string
          ease_tag_id: string | null
          id: string
          product_id: string | null
          rating: Database["public"]["Enums"]["ease_rating_type"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          ease_tag_id?: string | null
          id?: string
          product_id?: string | null
          rating: Database["public"]["Enums"]["ease_rating_type"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          ease_tag_id?: string | null
          id?: string
          product_id?: string | null
          rating?: Database["public"]["Enums"]["ease_rating_type"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ease_tag_ratings_ease_tag_id_fkey"
            columns: ["ease_tag_id"]
            isOneToOne: false
            referencedRelation: "ease_tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ease_tag_ratings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "ease_tag_ratings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      ease_tags: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      emergency_resources: {
        Row: {
          availability: string
          contact_info: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          priority: number | null
          resource_type: string
        }
        Insert: {
          availability: string
          contact_info: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          priority?: number | null
          resource_type: string
        }
        Update: {
          availability?: string
          contact_info?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          priority?: number | null
          resource_type?: string
        }
        Relationships: []
      }
      energy_focus_logs: {
        Row: {
          activity_name: string
          activity_type: string
          created_at: string | null
          duration_minutes: number | null
          energy_rating: number | null
          focus_rating: number | null
          id: string
          notes: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          activity_name: string
          activity_type: string
          created_at?: string | null
          duration_minutes?: number | null
          energy_rating?: number | null
          focus_rating?: number | null
          id?: string
          notes?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          activity_name?: string
          activity_type?: string
          created_at?: string | null
          duration_minutes?: number | null
          energy_rating?: number | null
          focus_rating?: number | null
          id?: string
          notes?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      energy_plan_components: {
        Row: {
          completion_criteria: Json | null
          component_type: string
          created_at: string
          duration_minutes: number | null
          id: string
          notes: string | null
          order_number: number
          plan_id: string
          settings: Json
          step_number: number | null
        }
        Insert: {
          completion_criteria?: Json | null
          component_type: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          order_number: number
          plan_id: string
          settings?: Json
          step_number?: number | null
        }
        Update: {
          completion_criteria?: Json | null
          component_type?: string
          created_at?: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          order_number?: number
          plan_id?: string
          settings?: Json
          step_number?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "energy_plan_components_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "energy_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      energy_plan_progress: {
        Row: {
          completed_at: string | null
          component_id: string
          created_at: string
          id: string
          plan_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          component_id: string
          created_at?: string
          id?: string
          plan_id: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          component_id?: string
          created_at?: string
          id?: string
          plan_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_component"
            columns: ["component_id"]
            isOneToOne: false
            referencedRelation: "energy_plan_components"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_plan"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "energy_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      energy_plan_reviews: {
        Row: {
          created_at: string
          id: string
          plan_id: string
          rating: number
          review_text: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          plan_id: string
          rating: number
          review_text?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          plan_id?: string
          rating?: number
          review_text?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "energy_plan_reviews_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "energy_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "energy_plan_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      energy_plan_views: {
        Row: {
          id: string
          plan_id: string | null
          session_duration: number | null
          user_id: string | null
          user_role: string | null
          viewed_at: string | null
        }
        Insert: {
          id?: string
          plan_id?: string | null
          session_duration?: number | null
          user_id?: string | null
          user_role?: string | null
          viewed_at?: string | null
        }
        Update: {
          id?: string
          plan_id?: string | null
          session_duration?: number | null
          user_id?: string | null
          user_role?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "energy_plan_views_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "energy_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      energy_plans: {
        Row: {
          category: string | null
          contraindications: string[] | null
          created_at: string
          created_by: string
          description: string | null
          energy_level_required: number | null
          estimated_duration_minutes: number | null
          expertise_level:
            | Database["public"]["Enums"]["plan_expertise_level"]
            | null
          id: string
          is_expert_plan: boolean | null
          likes_count: number | null
          plan_type: Database["public"]["Enums"]["plan_type"]
          professional_notes: string | null
          recommended_roles: string[] | null
          recommended_time_of_day: string[] | null
          requires_certification: boolean | null
          saves_count: number | null
          suitable_contexts: string[] | null
          suitable_life_situations:
            | Database["public"]["Enums"]["life_situation"][]
            | null
          tags: string[] | null
          title: string
          updated_at: string
          vendor_id: string | null
          visibility: Database["public"]["Enums"]["plan_visibility"] | null
        }
        Insert: {
          category?: string | null
          contraindications?: string[] | null
          created_at?: string
          created_by: string
          description?: string | null
          energy_level_required?: number | null
          estimated_duration_minutes?: number | null
          expertise_level?:
            | Database["public"]["Enums"]["plan_expertise_level"]
            | null
          id?: string
          is_expert_plan?: boolean | null
          likes_count?: number | null
          plan_type: Database["public"]["Enums"]["plan_type"]
          professional_notes?: string | null
          recommended_roles?: string[] | null
          recommended_time_of_day?: string[] | null
          requires_certification?: boolean | null
          saves_count?: number | null
          suitable_contexts?: string[] | null
          suitable_life_situations?:
            | Database["public"]["Enums"]["life_situation"][]
            | null
          tags?: string[] | null
          title: string
          updated_at?: string
          vendor_id?: string | null
          visibility?: Database["public"]["Enums"]["plan_visibility"] | null
        }
        Update: {
          category?: string | null
          contraindications?: string[] | null
          created_at?: string
          created_by?: string
          description?: string | null
          energy_level_required?: number | null
          estimated_duration_minutes?: number | null
          expertise_level?:
            | Database["public"]["Enums"]["plan_expertise_level"]
            | null
          id?: string
          is_expert_plan?: boolean | null
          likes_count?: number | null
          plan_type?: Database["public"]["Enums"]["plan_type"]
          professional_notes?: string | null
          recommended_roles?: string[] | null
          recommended_time_of_day?: string[] | null
          requires_certification?: boolean | null
          saves_count?: number | null
          suitable_contexts?: string[] | null
          suitable_life_situations?:
            | Database["public"]["Enums"]["life_situation"][]
            | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          vendor_id?: string | null
          visibility?: Database["public"]["Enums"]["plan_visibility"] | null
        }
        Relationships: [
          {
            foreignKeyName: "energy_plans_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "energy_plans_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      energy_products: {
        Row: {
          caffeine_content: number | null
          created_at: string
          description: string
          id: string
          ingredients: string[] | null
          name: string
          other_stimulants: string[] | null
          serving_size: string | null
          type: string
          updated_at: string
          warnings: string | null
        }
        Insert: {
          caffeine_content?: number | null
          created_at?: string
          description: string
          id?: string
          ingredients?: string[] | null
          name: string
          other_stimulants?: string[] | null
          serving_size?: string | null
          type: string
          updated_at?: string
          warnings?: string | null
        }
        Update: {
          caffeine_content?: number | null
          created_at?: string
          description?: string
          id?: string
          ingredients?: string[] | null
          name?: string
          other_stimulants?: string[] | null
          serving_size?: string | null
          type?: string
          updated_at?: string
          warnings?: string | null
        }
        Relationships: []
      }
      engagement_analytics: {
        Row: {
          created_at: string | null
          date: string
          engagement_metrics: Json
          id: string
          vendor_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          engagement_metrics?: Json
          id?: string
          vendor_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          engagement_metrics?: Json
          id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "engagement_analytics_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      event_registrations: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          status: string
          ticket_type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          status?: string
          ticket_type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          status?: string
          ticket_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_registrations_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "christian_events"
            referencedColumns: ["id"]
          },
        ]
      }
      executive_function_tools: {
        Row: {
          active_reminders: Json[] | null
          created_at: string | null
          id: string
          schedule: Json | null
          settings: Json | null
          tool_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active_reminders?: Json[] | null
          created_at?: string | null
          id?: string
          schedule?: Json | null
          settings?: Json | null
          tool_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active_reminders?: Json[] | null
          created_at?: string | null
          id?: string
          schedule?: Json | null
          settings?: Json | null
          tool_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      exercise_assets: {
        Row: {
          asset_url: string
          created_at: string | null
          exercise_name: string
          exercise_type: string
          id: string
        }
        Insert: {
          asset_url: string
          created_at?: string | null
          exercise_name: string
          exercise_type: string
          id?: string
        }
        Update: {
          asset_url?: string
          created_at?: string | null
          exercise_name?: string
          exercise_type?: string
          id?: string
        }
        Relationships: []
      }
      exercise_tracking: {
        Row: {
          average_speed: number | null
          calories_burned: number | null
          created_at: string | null
          distance_meters: number | null
          duration_seconds: number | null
          elevation_data: Json | null
          end_time: string | null
          exercise_type: Database["public"]["Enums"]["exercise_type"]
          heart_rate_data: Json | null
          id: string
          notes: string | null
          route_coordinates: Json | null
          start_time: string | null
          updated_at: string | null
          user_id: string | null
          weather_conditions: Json | null
        }
        Insert: {
          average_speed?: number | null
          calories_burned?: number | null
          created_at?: string | null
          distance_meters?: number | null
          duration_seconds?: number | null
          elevation_data?: Json | null
          end_time?: string | null
          exercise_type: Database["public"]["Enums"]["exercise_type"]
          heart_rate_data?: Json | null
          id?: string
          notes?: string | null
          route_coordinates?: Json | null
          start_time?: string | null
          updated_at?: string | null
          user_id?: string | null
          weather_conditions?: Json | null
        }
        Update: {
          average_speed?: number | null
          calories_burned?: number | null
          created_at?: string | null
          distance_meters?: number | null
          duration_seconds?: number | null
          elevation_data?: Json | null
          end_time?: string | null
          exercise_type?: Database["public"]["Enums"]["exercise_type"]
          heart_rate_data?: Json | null
          id?: string
          notes?: string | null
          route_coordinates?: Json | null
          start_time?: string | null
          updated_at?: string | null
          user_id?: string | null
          weather_conditions?: Json | null
        }
        Relationships: []
      }
      expert_profiles: {
        Row: {
          created_at: string
          credentials: string[]
          id: string
          specialties: string[]
          updated_at: string
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string
          credentials: string[]
          id: string
          specialties: string[]
          updated_at?: string
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string
          credentials?: string[]
          id?: string
          specialties?: string[]
          updated_at?: string
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expert_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      eye_exercise_achievements: {
        Row: {
          achievement_type: string
          created_at: string | null
          id: string
          streak_requirement: number | null
          total_exercises_requirement: number | null
          unlocked_at: string | null
          user_id: string | null
        }
        Insert: {
          achievement_type: string
          created_at?: string | null
          id?: string
          streak_requirement?: number | null
          total_exercises_requirement?: number | null
          unlocked_at?: string | null
          user_id?: string | null
        }
        Update: {
          achievement_type?: string
          created_at?: string | null
          id?: string
          streak_requirement?: number | null
          total_exercises_requirement?: number | null
          unlocked_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      eye_exercise_logs: {
        Row: {
          completed_at: string | null
          created_at: string | null
          duration_seconds: number
          effectiveness_rating: number | null
          exercise_type: string
          id: string
          notes: string | null
          user_id: string | null
          visual_guide_url: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          duration_seconds: number
          effectiveness_rating?: number | null
          exercise_type: string
          id?: string
          notes?: string | null
          user_id?: string | null
          visual_guide_url?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          duration_seconds?: number
          effectiveness_rating?: number | null
          exercise_type?: string
          id?: string
          notes?: string | null
          user_id?: string | null
          visual_guide_url?: string | null
        }
        Relationships: []
      }
      eye_exercise_stats: {
        Row: {
          avg_effectiveness: number | null
          created_at: string | null
          current_streak: number | null
          id: string
          last_exercise_at: string | null
          longest_streak: number | null
          total_duration_seconds: number | null
          total_exercises: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          avg_effectiveness?: number | null
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_exercise_at?: string | null
          longest_streak?: number | null
          total_duration_seconds?: number | null
          total_exercises?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          avg_effectiveness?: number | null
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_exercise_at?: string | null
          longest_streak?: number | null
          total_duration_seconds?: number | null
          total_exercises?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      family_devotionals: {
        Row: {
          activity_suggestion: string | null
          age_appropriate_notes: Json | null
          completed_by: string[] | null
          content: string
          created_at: string
          discussion_questions: Json | null
          family_id: string | null
          id: string
          scripture_reference: string
          title: string
        }
        Insert: {
          activity_suggestion?: string | null
          age_appropriate_notes?: Json | null
          completed_by?: string[] | null
          content: string
          created_at?: string
          discussion_questions?: Json | null
          family_id?: string | null
          id?: string
          scripture_reference: string
          title: string
        }
        Update: {
          activity_suggestion?: string | null
          age_appropriate_notes?: Json | null
          completed_by?: string[] | null
          content?: string
          created_at?: string
          discussion_questions?: Json | null
          family_id?: string | null
          id?: string
          scripture_reference?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_devotionals_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "family_units"
            referencedColumns: ["id"]
          },
        ]
      }
      family_members: {
        Row: {
          birth_date: string | null
          created_at: string | null
          family_id: string | null
          id: string
          member_user_id: string | null
          name: string
          role: string
          user_id: string | null
        }
        Insert: {
          birth_date?: string | null
          created_at?: string | null
          family_id?: string | null
          id?: string
          member_user_id?: string | null
          name: string
          role: string
          user_id?: string | null
        }
        Update: {
          birth_date?: string | null
          created_at?: string | null
          family_id?: string | null
          id?: string
          member_user_id?: string | null
          name?: string
          role?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "family_members_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "family_units"
            referencedColumns: ["id"]
          },
        ]
      }
      family_planning: {
        Row: {
          biblical_principles: string[] | null
          courtship_guidelines: string[] | null
          created_at: string | null
          family_worship_plans: string | null
          financial_planning_goals: string[] | null
          id: string
          marriage_prep_status: string | null
          mentorship_needs: string[] | null
          premarital_counseling_status: string | null
          spiritual_goals: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          biblical_principles?: string[] | null
          courtship_guidelines?: string[] | null
          created_at?: string | null
          family_worship_plans?: string | null
          financial_planning_goals?: string[] | null
          id?: string
          marriage_prep_status?: string | null
          mentorship_needs?: string[] | null
          premarital_counseling_status?: string | null
          spiritual_goals?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          biblical_principles?: string[] | null
          courtship_guidelines?: string[] | null
          created_at?: string | null
          family_worship_plans?: string | null
          financial_planning_goals?: string[] | null
          id?: string
          marriage_prep_status?: string | null
          mentorship_needs?: string[] | null
          premarital_counseling_status?: string | null
          spiritual_goals?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      family_prayer_requests: {
        Row: {
          answered_date: string | null
          content: string
          created_at: string
          created_by: string | null
          family_id: string | null
          id: string
          status: string | null
          title: string
        }
        Insert: {
          answered_date?: string | null
          content: string
          created_at?: string
          created_by?: string | null
          family_id?: string | null
          id?: string
          status?: string | null
          title: string
        }
        Update: {
          answered_date?: string | null
          content?: string
          created_at?: string
          created_by?: string | null
          family_id?: string | null
          id?: string
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_prayer_requests_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "family_units"
            referencedColumns: ["id"]
          },
        ]
      }
      family_relationships: {
        Row: {
          created_at: string
          from_member_id: string
          id: string
          relationship_type: string
          to_member_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          from_member_id: string
          id?: string
          relationship_type: string
          to_member_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          from_member_id?: string
          id?: string
          relationship_type?: string
          to_member_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "family_relationships_from_member_id_fkey"
            columns: ["from_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "family_relationships_to_member_id_fkey"
            columns: ["to_member_id"]
            isOneToOne: false
            referencedRelation: "family_members"
            referencedColumns: ["id"]
          },
        ]
      }
      family_units: {
        Row: {
          created_at: string
          description: string | null
          family_verse: string | null
          id: string
          name: string
          parent_id: string | null
          prayer_time: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          family_verse?: string | null
          id?: string
          name: string
          parent_id?: string | null
          prayer_time?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          family_verse?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          prayer_time?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      favorite_foods: {
        Row: {
          calories: number | null
          carbs_grams: number | null
          created_at: string | null
          fat_grams: number | null
          food_name: string
          id: string
          protein_grams: number | null
          user_id: string
        }
        Insert: {
          calories?: number | null
          carbs_grams?: number | null
          created_at?: string | null
          fat_grams?: number | null
          food_name: string
          id?: string
          protein_grams?: number | null
          user_id: string
        }
        Update: {
          calories?: number | null
          carbs_grams?: number | null
          created_at?: string | null
          fat_grams?: number | null
          food_name?: string
          id?: string
          protein_grams?: number | null
          user_id?: string
        }
        Relationships: []
      }
      feature_votes: {
        Row: {
          created_at: string | null
          feedback_id: string | null
          id: string
          user_id: string | null
          vote_type: string | null
        }
        Insert: {
          created_at?: string | null
          feedback_id?: string | null
          id?: string
          user_id?: string | null
          vote_type?: string | null
        }
        Update: {
          created_at?: string | null
          feedback_id?: string | null
          id?: string
          user_id?: string | null
          vote_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feature_votes_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "product_feedback"
            referencedColumns: ["id"]
          },
        ]
      }
      featured_content: {
        Row: {
          created_at: string | null
          description: string
          href: string
          icon_name: string
          id: string
          image_url: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          href: string
          icon_name: string
          id?: string
          image_url?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          href?: string
          icon_name?: string
          id?: string
          image_url?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      featured_products: {
        Row: {
          created_at: string | null
          feature_date: string
          feature_type: string
          id: string
          product_id: string | null
        }
        Insert: {
          created_at?: string | null
          feature_date?: string
          feature_type: string
          id?: string
          product_id?: string | null
        }
        Update: {
          created_at?: string | null
          feature_date?: string
          feature_type?: string
          id?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "featured_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "featured_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_roadmap: {
        Row: {
          assigned_team: string | null
          created_at: string | null
          dependencies: string[] | null
          development_status: string | null
          feedback_id: string | null
          id: string
          milestone: string | null
          planned_release_date: string | null
          risks: string[] | null
          sprint_number: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_team?: string | null
          created_at?: string | null
          dependencies?: string[] | null
          development_status?: string | null
          feedback_id?: string | null
          id?: string
          milestone?: string | null
          planned_release_date?: string | null
          risks?: string[] | null
          sprint_number?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_team?: string | null
          created_at?: string | null
          dependencies?: string[] | null
          development_status?: string | null
          feedback_id?: string | null
          id?: string
          milestone?: string | null
          planned_release_date?: string | null
          risks?: string[] | null
          sprint_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "feedback_roadmap_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "product_feedback"
            referencedColumns: ["id"]
          },
        ]
      }
      feedback_templates: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          product_type: string
          template_fields: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          product_type: string
          template_fields?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          product_type?: string
          template_fields?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      feeding_logs: {
        Row: {
          amount_ml: number | null
          baby_id: string | null
          created_at: string
          duration_minutes: number | null
          feeding_type: Database["public"]["Enums"]["feeding_method"] | null
          id: string
          notes: string | null
          side: string | null
          start_time: string | null
          user_id: string
        }
        Insert: {
          amount_ml?: number | null
          baby_id?: string | null
          created_at?: string
          duration_minutes?: number | null
          feeding_type?: Database["public"]["Enums"]["feeding_method"] | null
          id?: string
          notes?: string | null
          side?: string | null
          start_time?: string | null
          user_id: string
        }
        Update: {
          amount_ml?: number | null
          baby_id?: string | null
          created_at?: string
          duration_minutes?: number | null
          feeding_type?: Database["public"]["Enums"]["feeding_method"] | null
          id?: string
          notes?: string | null
          side?: string | null
          start_time?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feeding_logs_baby_id_fkey"
            columns: ["baby_id"]
            isOneToOne: false
            referencedRelation: "baby_tracking"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_tracking: {
        Row: {
          amount: number
          created_at: string | null
          date: string
          expense_type: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          date: string
          expense_type: string
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          date?: string
          expense_type?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      first_click_responses: {
        Row: {
          click_coordinates: Json
          created_at: string | null
          id: string
          is_success: boolean | null
          participant_id: string | null
          test_id: string | null
          time_to_click: number | null
        }
        Insert: {
          click_coordinates: Json
          created_at?: string | null
          id?: string
          is_success?: boolean | null
          participant_id?: string | null
          test_id?: string | null
          time_to_click?: number | null
        }
        Update: {
          click_coordinates?: Json
          created_at?: string | null
          id?: string
          is_success?: boolean | null
          participant_id?: string | null
          test_id?: string | null
          time_to_click?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "first_click_responses_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "first_click_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      first_click_tests: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          question: string
          success_zones: Json | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          question: string
          success_zones?: Json | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          question?: string
          success_zones?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      five_second_responses: {
        Row: {
          accuracy_score: number | null
          created_at: string | null
          id: string
          participant_id: string | null
          responses: Json
          test_id: string | null
        }
        Insert: {
          accuracy_score?: number | null
          created_at?: string | null
          id?: string
          participant_id?: string | null
          responses: Json
          test_id?: string | null
        }
        Update: {
          accuracy_score?: number | null
          created_at?: string | null
          id?: string
          participant_id?: string | null
          responses?: Json
          test_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "five_second_responses_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "five_second_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      five_second_tests: {
        Row: {
          created_at: string | null
          description: string | null
          display_duration: number | null
          id: string
          image_url: string
          questions: Json | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          display_duration?: number | null
          id?: string
          image_url: string
          questions?: Json | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          display_duration?: number | null
          id?: string
          image_url?: string
          questions?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      focus_achievements: {
        Row: {
          achieved_at: string | null
          achievement_type: string
          created_at: string | null
          details: Json | null
          id: string
          points_earned: number | null
          streak_count: number | null
          user_id: string
        }
        Insert: {
          achieved_at?: string | null
          achievement_type: string
          created_at?: string | null
          details?: Json | null
          id?: string
          points_earned?: number | null
          streak_count?: number | null
          user_id: string
        }
        Update: {
          achieved_at?: string | null
          achievement_type?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          points_earned?: number | null
          streak_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      focus_analytics: {
        Row: {
          context_switches: number | null
          created_at: string | null
          daily_focus_score: number | null
          date: string
          energy_levels: Json | null
          flow_state_duration: number | null
          focus_patterns: Json | null
          hyperfocus_incidents: number | null
          id: string
          interrupted_sessions: number | null
          notes: string | null
          peak_focus_periods: Json | null
          productivity_insights: string | null
          productivity_score: number | null
          recovery_time_needed: number | null
          successful_sessions: number | null
          suggested_improvements: Json | null
          task_completion_variance: number | null
          total_focus_time: number | null
          transition_difficulties: Json | null
          user_id: string
        }
        Insert: {
          context_switches?: number | null
          created_at?: string | null
          daily_focus_score?: number | null
          date?: string
          energy_levels?: Json | null
          flow_state_duration?: number | null
          focus_patterns?: Json | null
          hyperfocus_incidents?: number | null
          id?: string
          interrupted_sessions?: number | null
          notes?: string | null
          peak_focus_periods?: Json | null
          productivity_insights?: string | null
          productivity_score?: number | null
          recovery_time_needed?: number | null
          successful_sessions?: number | null
          suggested_improvements?: Json | null
          task_completion_variance?: number | null
          total_focus_time?: number | null
          transition_difficulties?: Json | null
          user_id: string
        }
        Update: {
          context_switches?: number | null
          created_at?: string | null
          daily_focus_score?: number | null
          date?: string
          energy_levels?: Json | null
          flow_state_duration?: number | null
          focus_patterns?: Json | null
          hyperfocus_incidents?: number | null
          id?: string
          interrupted_sessions?: number | null
          notes?: string | null
          peak_focus_periods?: Json | null
          productivity_insights?: string | null
          productivity_score?: number | null
          recovery_time_needed?: number | null
          successful_sessions?: number | null
          suggested_improvements?: Json | null
          task_completion_variance?: number | null
          total_focus_time?: number | null
          transition_difficulties?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      focus_celebrations: {
        Row: {
          achievement_type: string
          celebration_message: string | null
          created_at: string | null
          id: string
          milestone_reached: string
          points_earned: number | null
          reward_type: string | null
          user_id: string | null
        }
        Insert: {
          achievement_type: string
          celebration_message?: string | null
          created_at?: string | null
          id?: string
          milestone_reached: string
          points_earned?: number | null
          reward_type?: string | null
          user_id?: string | null
        }
        Update: {
          achievement_type?: string
          celebration_message?: string | null
          created_at?: string | null
          id?: string
          milestone_reached?: string
          points_earned?: number | null
          reward_type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      focus_energy_schedule: {
        Row: {
          created_at: string | null
          day_of_week: number | null
          energy_level: number | null
          id: string
          optimal_activities: string[] | null
          productivity_score: number | null
          schedule_preferences: Json | null
          time_block: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          day_of_week?: number | null
          energy_level?: number | null
          id?: string
          optimal_activities?: string[] | null
          productivity_score?: number | null
          schedule_preferences?: Json | null
          time_block?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: number | null
          energy_level?: number | null
          id?: string
          optimal_activities?: string[] | null
          productivity_score?: number | null
          schedule_preferences?: Json | null
          time_block?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      focus_environment_preferences: {
        Row: {
          background_type: string | null
          created_at: string | null
          custom_settings: Json | null
          id: string
          light_preference: string | null
          noise_type: string[] | null
          temperature_preference: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          background_type?: string | null
          created_at?: string | null
          custom_settings?: Json | null
          id?: string
          light_preference?: string | null
          noise_type?: string[] | null
          temperature_preference?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          background_type?: string | null
          created_at?: string | null
          custom_settings?: Json | null
          id?: string
          light_preference?: string | null
          noise_type?: string[] | null
          temperature_preference?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      focus_gamification: {
        Row: {
          achievements: Json | null
          activity_type: string
          created_at: string | null
          daily_challenges: Json | null
          id: string
          last_activity_at: string | null
          level: number | null
          points_earned: number | null
          streak_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achievements?: Json | null
          activity_type: string
          created_at?: string | null
          daily_challenges?: Json | null
          id?: string
          last_activity_at?: string | null
          level?: number | null
          points_earned?: number | null
          streak_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          achievements?: Json | null
          activity_type?: string
          created_at?: string | null
          daily_challenges?: Json | null
          id?: string
          last_activity_at?: string | null
          level?: number | null
          points_earned?: number | null
          streak_count?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      focus_habits: {
        Row: {
          created_at: string | null
          description: string | null
          frequency: string
          habit_name: string
          id: string
          reminder_time: string | null
          streak_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          frequency: string
          habit_name: string
          id?: string
          reminder_time?: string | null
          streak_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          frequency?: string
          habit_name?: string
          id?: string
          reminder_time?: string | null
          streak_count?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      focus_interruption_logs: {
        Row: {
          context: string | null
          coping_strategy: string | null
          created_at: string | null
          duration_seconds: number | null
          effectiveness_rating: number | null
          id: string
          interruption_type: string
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          context?: string | null
          coping_strategy?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          effectiveness_rating?: number | null
          id?: string
          interruption_type: string
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          context?: string | null
          coping_strategy?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          effectiveness_rating?: number | null
          id?: string
          interruption_type?: string
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "focus_interruption_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "focus_timer_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      focus_journal: {
        Row: {
          created_at: string | null
          energy_level: number | null
          entry_date: string | null
          focus_challenges: string[] | null
          id: string
          improvements: string[] | null
          notes: string | null
          productivity_rating: number | null
          strategies_used: string[] | null
          updated_at: string | null
          user_id: string
          wins: string[] | null
        }
        Insert: {
          created_at?: string | null
          energy_level?: number | null
          entry_date?: string | null
          focus_challenges?: string[] | null
          id?: string
          improvements?: string[] | null
          notes?: string | null
          productivity_rating?: number | null
          strategies_used?: string[] | null
          updated_at?: string | null
          user_id: string
          wins?: string[] | null
        }
        Update: {
          created_at?: string | null
          energy_level?: number | null
          entry_date?: string | null
          focus_challenges?: string[] | null
          id?: string
          improvements?: string[] | null
          notes?: string | null
          productivity_rating?: number | null
          strategies_used?: string[] | null
          updated_at?: string | null
          user_id?: string
          wins?: string[] | null
        }
        Relationships: []
      }
      focus_music: {
        Row: {
          artist: string | null
          audio_url: string
          category: string
          created_at: string | null
          duration_seconds: number
          energy_level: number | null
          id: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          artist?: string | null
          audio_url: string
          category: string
          created_at?: string | null
          duration_seconds: number
          energy_level?: number | null
          id?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          artist?: string | null
          audio_url?: string
          category?: string
          created_at?: string | null
          duration_seconds?: number
          energy_level?: number | null
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      focus_priority_queue: {
        Row: {
          completed: boolean | null
          context_tags: string[] | null
          created_at: string | null
          energy_level: number | null
          id: string
          priority_level: string | null
          reward_points: number | null
          task_name: string
          time_estimate_minutes: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          context_tags?: string[] | null
          created_at?: string | null
          energy_level?: number | null
          id?: string
          priority_level?: string | null
          reward_points?: number | null
          task_name: string
          time_estimate_minutes?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          context_tags?: string[] | null
          created_at?: string | null
          energy_level?: number | null
          id?: string
          priority_level?: string | null
          reward_points?: number | null
          task_name?: string
          time_estimate_minutes?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      focus_rewards: {
        Row: {
          adaptive_difficulty: boolean | null
          claimed_at: string | null
          completion_criteria: Json | null
          created_at: string | null
          description: string | null
          expires_at: string | null
          id: string
          is_claimed: boolean | null
          motivation_triggers: Json | null
          points_required: number
          reward_category: string | null
          reward_type: string
          streak_bonus: number | null
          title: string
          user_id: string
        }
        Insert: {
          adaptive_difficulty?: boolean | null
          claimed_at?: string | null
          completion_criteria?: Json | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_claimed?: boolean | null
          motivation_triggers?: Json | null
          points_required: number
          reward_category?: string | null
          reward_type: string
          streak_bonus?: number | null
          title: string
          user_id: string
        }
        Update: {
          adaptive_difficulty?: boolean | null
          claimed_at?: string | null
          completion_criteria?: Json | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          is_claimed?: boolean | null
          motivation_triggers?: Json | null
          points_required?: number
          reward_category?: string | null
          reward_type?: string
          streak_bonus?: number | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      focus_routines: {
        Row: {
          best_time_of_day: string[] | null
          created_at: string | null
          duration_minutes: number | null
          effectiveness_rating: number | null
          energy_required: number | null
          id: string
          name: string
          steps: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          best_time_of_day?: string[] | null
          created_at?: string | null
          duration_minutes?: number | null
          effectiveness_rating?: number | null
          energy_required?: number | null
          id?: string
          name: string
          steps: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          best_time_of_day?: string[] | null
          created_at?: string | null
          duration_minutes?: number | null
          effectiveness_rating?: number | null
          energy_required?: number | null
          id?: string
          name?: string
          steps?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      focus_skill_training: {
        Row: {
          accuracy_score: number | null
          completion_time: number | null
          created_at: string | null
          difficulty_level: number | null
          id: string
          notes: string | null
          skill_type: string
          training_date: string | null
          user_id: string
        }
        Insert: {
          accuracy_score?: number | null
          completion_time?: number | null
          created_at?: string | null
          difficulty_level?: number | null
          id?: string
          notes?: string | null
          skill_type: string
          training_date?: string | null
          user_id: string
        }
        Update: {
          accuracy_score?: number | null
          completion_time?: number | null
          created_at?: string | null
          difficulty_level?: number | null
          id?: string
          notes?: string | null
          skill_type?: string
          training_date?: string | null
          user_id?: string
        }
        Relationships: []
      }
      focus_task_breakdowns: {
        Row: {
          created_at: string | null
          energy_level_required: number | null
          id: string
          micro_steps: Json
          motivation_notes: string | null
          rewards: Json | null
          sensory_preferences: Json | null
          task_id: string | null
          time_estimates: Json | null
          updated_at: string | null
          user_id: string | null
          visual_aids: Json | null
        }
        Insert: {
          created_at?: string | null
          energy_level_required?: number | null
          id?: string
          micro_steps?: Json
          motivation_notes?: string | null
          rewards?: Json | null
          sensory_preferences?: Json | null
          task_id?: string | null
          time_estimates?: Json | null
          updated_at?: string | null
          user_id?: string | null
          visual_aids?: Json | null
        }
        Update: {
          created_at?: string | null
          energy_level_required?: number | null
          id?: string
          micro_steps?: Json
          motivation_notes?: string | null
          rewards?: Json | null
          sensory_preferences?: Json | null
          task_id?: string | null
          time_estimates?: Json | null
          updated_at?: string | null
          user_id?: string | null
          visual_aids?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "focus_task_breakdowns_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      focus_timer_sessions: {
        Row: {
          actual_duration: number | null
          break_duration: number | null
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          energy_level: number | null
          id: string
          interrupted_count: number | null
          mood_after: number | null
          mood_before: number | null
          notes: string | null
          started_at: string | null
          tags: string[] | null
          timer_type: string
          user_id: string
          work_duration: number
        }
        Insert: {
          actual_duration?: number | null
          break_duration?: number | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          energy_level?: number | null
          id?: string
          interrupted_count?: number | null
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          started_at?: string | null
          tags?: string[] | null
          timer_type: string
          user_id: string
          work_duration: number
        }
        Update: {
          actual_duration?: number | null
          break_duration?: number | null
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          energy_level?: number | null
          id?: string
          interrupted_count?: number | null
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          started_at?: string | null
          tags?: string[] | null
          timer_type?: string
          user_id?: string
          work_duration?: number
        }
        Relationships: []
      }
      focus_zones: {
        Row: {
          amenities: string[] | null
          created_at: string | null
          custom_settings: Json | null
          effectiveness_rating: number | null
          id: string
          location_type: string | null
          name: string
          notes: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amenities?: string[] | null
          created_at?: string | null
          custom_settings?: Json | null
          effectiveness_rating?: number | null
          id?: string
          location_type?: string | null
          name: string
          notes?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amenities?: string[] | null
          created_at?: string | null
          custom_settings?: Json | null
          effectiveness_rating?: number | null
          id?: string
          location_type?: string | null
          name?: string
          notes?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      food_logs: {
        Row: {
          ai_analysis: string | null
          calories: number | null
          carbs_grams: number | null
          created_at: string | null
          fat_grams: number | null
          food_name: string
          id: string
          image_url: string | null
          meal_time: string | null
          meal_type: string | null
          notes: string | null
          protein_grams: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ai_analysis?: string | null
          calories?: number | null
          carbs_grams?: number | null
          created_at?: string | null
          fat_grams?: number | null
          food_name: string
          id?: string
          image_url?: string | null
          meal_time?: string | null
          meal_type?: string | null
          notes?: string | null
          protein_grams?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ai_analysis?: string | null
          calories?: number | null
          carbs_grams?: number | null
          created_at?: string | null
          fat_grams?: number | null
          food_name?: string
          id?: string
          image_url?: string | null
          meal_time?: string | null
          meal_type?: string | null
          notes?: string | null
          protein_grams?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      free_samples: {
        Row: {
          active: boolean | null
          created_at: string | null
          description: string | null
          expires_at: string | null
          id: string
          product_id: string | null
          quantity: number
          vendor_id: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          product_id?: string | null
          quantity: number
          vendor_id?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "free_samples_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "free_samples_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "free_samples_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      goal_tracking: {
        Row: {
          created_at: string
          current_amount: number
          goal_type: string
          id: string
          initial_amount: number
          progress_notes: string | null
          start_date: string
          status: string | null
          target_amount: number
          target_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_amount: number
          goal_type: string
          id?: string
          initial_amount: number
          progress_notes?: string | null
          start_date?: string
          status?: string | null
          target_amount: number
          target_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_amount?: number
          goal_type?: string
          id?: string
          initial_amount?: number
          progress_notes?: string | null
          start_date?: string
          status?: string | null
          target_amount?: number
          target_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          achieved_date: string | null
          created_at: string | null
          description: string | null
          goal_type: string
          id: string
          progress: number | null
          reward: string | null
          target_date: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achieved_date?: string | null
          created_at?: string | null
          description?: string | null
          goal_type: string
          id?: string
          progress?: number | null
          reward?: string | null
          target_date?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          achieved_date?: string | null
          created_at?: string | null
          description?: string | null
          goal_type?: string
          id?: string
          progress?: number | null
          reward?: string | null
          target_date?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      gods: {
        Row: {
          created_at: string
          description: string
          domain: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description: string
          domain: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string
          domain?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      gratitude_journal: {
        Row: {
          category: Database["public"]["Enums"]["gratitude_category"]
          content: string
          created_at: string | null
          id: string
          mood_impact: number | null
          reflection: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["gratitude_category"]
          content: string
          created_at?: string | null
          id?: string
          mood_impact?: number | null
          reflection?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["gratitude_category"]
          content?: string
          created_at?: string | null
          id?: string
          mood_impact?: number | null
          reflection?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      group_announcements: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          group_id: string | null
          id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          group_id?: string | null
          id?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          group_id?: string | null
          id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_announcements"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_announcements_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_bible_studies: {
        Row: {
          attachments: string[] | null
          content: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          group_id: string
          id: string
          is_active: boolean | null
          schedule: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          attachments?: string[] | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          group_id: string
          id?: string
          is_active?: boolean | null
          schedule?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          attachments?: string[] | null
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          group_id?: string
          id?: string
          is_active?: boolean | null
          schedule?: Json | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_group"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_bible_studies_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_discussion_comments: {
        Row: {
          content: string
          created_at: string | null
          discussion_id: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          discussion_id?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_discussion_comments_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "group_discussions"
            referencedColumns: ["id"]
          },
        ]
      }
      group_discussions: {
        Row: {
          content: string
          created_at: string | null
          group_id: string | null
          id: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          group_id?: string | null
          id?: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          group_id?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_discussions"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_discussions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_event_attendees: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          status?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "group_events"
            referencedColumns: ["id"]
          },
        ]
      }
      group_events: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          end_time: string | null
          group_id: string | null
          id: string
          is_online: boolean | null
          location: string | null
          meeting_link: string | null
          start_time: string
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_time?: string | null
          group_id?: string | null
          id?: string
          is_online?: boolean | null
          location?: string | null
          meeting_link?: string | null
          start_time: string
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_time?: string | null
          group_id?: string | null
          id?: string
          is_online?: boolean | null
          location?: string | null
          meeting_link?: string | null
          start_time?: string
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_events"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_events_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          created_at: string | null
          group_id: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          group_id: string
          id?: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          group_id?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_memberships: {
        Row: {
          group_id: string | null
          id: string
          joined_at: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          group_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          group_id?: string | null
          id?: string
          joined_at?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_memberships_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "support_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_message_reactions: {
        Row: {
          created_at: string | null
          emoji: string
          id: string
          message_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          emoji: string
          id?: string
          message_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          emoji?: string
          id?: string
          message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_message_reactions_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "group_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_message_reactions_message_id_fkey1"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "group_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      group_message_threads: {
        Row: {
          content: string
          created_at: string | null
          id: string
          parent_message_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          parent_message_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          parent_message_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_message_threads_parent_message_id_fkey"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "group_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_message_threads_parent_message_id_fkey1"
            columns: ["parent_message_id"]
            isOneToOne: false
            referencedRelation: "group_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      group_messages: {
        Row: {
          content: string
          created_at: string | null
          group_id: string
          id: string
          parent_id: string | null
          profiles: Json | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          group_id: string
          id?: string
          parent_id?: string | null
          profiles?: Json | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          group_id?: string
          id?: string
          parent_id?: string | null
          profiles?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_messages"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_messages_group_id_fkey1"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_messages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "group_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_messages_parent_id_fkey1"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "group_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      group_prayer_requests: {
        Row: {
          content: string
          created_at: string | null
          group_id: string | null
          id: string
          is_anonymous: boolean | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          group_id?: string | null
          id?: string
          is_anonymous?: boolean | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          group_id?: string | null
          id?: string
          is_anonymous?: boolean | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_prayer_requests_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_prayer_responses: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_anonymous: boolean | null
          prayer_request_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          prayer_request_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          prayer_request_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_prayer_responses_prayer_request_id_fkey"
            columns: ["prayer_request_id"]
            isOneToOne: false
            referencedRelation: "group_prayer_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      group_resources: {
        Row: {
          created_at: string | null
          description: string | null
          group_id: string | null
          id: string
          resource_type: string
          title: string
          updated_at: string | null
          uploaded_by: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          group_id?: string | null
          id?: string
          resource_type: string
          title: string
          updated_at?: string | null
          uploaded_by?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          group_id?: string | null
          id?: string
          resource_type?: string
          title?: string
          updated_at?: string | null
          uploaded_by?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_resources"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_resources_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_session_attendees: {
        Row: {
          created_at: string | null
          feedback: string | null
          id: string
          joined_at: string | null
          session_id: string | null
          status: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          feedback?: string | null
          id?: string
          joined_at?: string | null
          session_id?: string | null
          status?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          feedback?: string | null
          id?: string
          joined_at?: string | null
          session_id?: string | null
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_session_attendees_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "support_group_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      group_study_attendance: {
        Row: {
          created_at: string | null
          id: string
          joined_at: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          joined_at?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          joined_at?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_study_attendance_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "group_study_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      group_study_progress: {
        Row: {
          completed_sessions: number | null
          created_at: string | null
          id: string
          last_session_date: string | null
          notes: string | null
          study_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_sessions?: number | null
          created_at?: string | null
          id?: string
          last_session_date?: string | null
          notes?: string | null
          study_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_sessions?: number | null
          created_at?: string | null
          id?: string
          last_session_date?: string | null
          notes?: string | null
          study_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_study_progress_study_id_fkey"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "group_bible_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      group_study_session_attendance: {
        Row: {
          created_at: string | null
          id: string
          profiles: Json | null
          session_id: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          profiles?: Json | null
          session_id: string
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          profiles?: Json | null
          session_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_profiles_attendance"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_study_session_attendance_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "group_study_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_study_session_attendance_session_id_fkey1"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "group_study_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      group_study_sessions: {
        Row: {
          created_at: string | null
          id: string
          meeting_link: string | null
          start_time: string
          study_id: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          meeting_link?: string | null
          start_time: string
          study_id?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          meeting_link?: string | null
          start_time?: string
          study_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_study_sessions_study_id_fkey"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "group_bible_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      group_volunteer_opportunities: {
        Row: {
          created_at: string | null
          description: string
          end_date: string | null
          group_id: string
          id: string
          profiles: Json | null
          start_date: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          end_date?: string | null
          group_id: string
          id?: string
          profiles?: Json | null
          start_date?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          end_date?: string | null
          group_id?: string
          id?: string
          profiles?: Json | null
          start_date?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_volunteer_opportunities_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_volunteer_opportunities_group_id_fkey1"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_volunteer_signups: {
        Row: {
          created_at: string | null
          id: string
          opportunity_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          opportunity_id: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          opportunity_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_volunteer_signups_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "group_volunteer_opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_volunteer_signups_opportunity_id_fkey1"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "group_volunteer_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_private: boolean | null
          name: string
          search_vector: unknown | null
          settings: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_private?: boolean | null
          name: string
          search_vector?: unknown | null
          settings?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_private?: boolean | null
          name?: string
          search_vector?: unknown | null
          settings?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      habit_replacements: {
        Row: {
          created_at: string
          effectiveness_rating: number | null
          id: string
          new_habit: string
          notes: string | null
          old_habit: string
          trigger_situation: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          effectiveness_rating?: number | null
          id?: string
          new_habit: string
          notes?: string | null
          old_habit: string
          trigger_situation: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          effectiveness_rating?: number | null
          id?: string
          new_habit?: string
          notes?: string | null
          old_habit?: string
          trigger_situation?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      health_data: {
        Row: {
          calories_burned: number | null
          created_at: string | null
          distance_meters: number | null
          id: string
          source: string
          steps_count: number
          sync_date: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          calories_burned?: number | null
          created_at?: string | null
          distance_meters?: number | null
          id?: string
          source: string
          steps_count?: number
          sync_date?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          calories_burned?: number | null
          created_at?: string | null
          distance_meters?: number | null
          id?: string
          source?: string
          steps_count?: number
          sync_date?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      herbal_tea_compounds: {
        Row: {
          benefits: string[] | null
          contraindications: string[] | null
          created_at: string | null
          description: string
          id: string
          name: string
          research_links: string[] | null
          scientific_name: string | null
          synergistic_compounds: string[] | null
          updated_at: string | null
        }
        Insert: {
          benefits?: string[] | null
          contraindications?: string[] | null
          created_at?: string | null
          description: string
          id?: string
          name: string
          research_links?: string[] | null
          scientific_name?: string | null
          synergistic_compounds?: string[] | null
          updated_at?: string | null
        }
        Update: {
          benefits?: string[] | null
          contraindications?: string[] | null
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          research_links?: string[] | null
          scientific_name?: string | null
          synergistic_compounds?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      herbal_tea_logs: {
        Row: {
          amount_grams: number | null
          brewing_method: Database["public"]["Enums"]["brewing_method"]
          consumed_at: string | null
          created_at: string | null
          effects: string[] | null
          id: string
          notes: string | null
          rating: number | null
          steep_time_seconds: number | null
          tea_name: string
          updated_at: string | null
          user_id: string
          water_temperature: number | null
        }
        Insert: {
          amount_grams?: number | null
          brewing_method: Database["public"]["Enums"]["brewing_method"]
          consumed_at?: string | null
          created_at?: string | null
          effects?: string[] | null
          id?: string
          notes?: string | null
          rating?: number | null
          steep_time_seconds?: number | null
          tea_name: string
          updated_at?: string | null
          user_id: string
          water_temperature?: number | null
        }
        Update: {
          amount_grams?: number | null
          brewing_method?: Database["public"]["Enums"]["brewing_method"]
          consumed_at?: string | null
          created_at?: string | null
          effects?: string[] | null
          id?: string
          notes?: string | null
          rating?: number | null
          steep_time_seconds?: number | null
          tea_name?: string
          updated_at?: string | null
          user_id?: string
          water_temperature?: number | null
        }
        Relationships: []
      }
      herbal_tea_logs_sessions: {
        Row: {
          created_at: string | null
          id: string
          log_id: string | null
          notes: string | null
          rating: number | null
          steep_number: number
          steep_time_seconds: number
          water_temperature: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          log_id?: string | null
          notes?: string | null
          rating?: number | null
          steep_number: number
          steep_time_seconds: number
          water_temperature: number
        }
        Update: {
          created_at?: string | null
          id?: string
          log_id?: string | null
          notes?: string | null
          rating?: number | null
          steep_number?: number
          steep_time_seconds?: number
          water_temperature?: number
        }
        Relationships: [
          {
            foreignKeyName: "herbal_tea_logs_sessions_log_id_fkey"
            columns: ["log_id"]
            isOneToOne: false
            referencedRelation: "herbal_tea_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      herbal_teas: {
        Row: {
          active_compounds: string[] | null
          alternative_names: string[] | null
          antioxidant_content: string | null
          aroma_notes: string[] | null
          average_rating: number | null
          benefits: string[] | null
          botanical_family: string | null
          brewing_instructions: string
          brewing_tips: string[] | null
          caffeine_content_mg: number | null
          category: string
          cautions: string[] | null
          common_combinations: string[] | null
          contraindications: string[] | null
          created_at: string | null
          cultural_significance: string | null
          description: string
          eco_certifications: string[] | null
          energy_effects: string[] | null
          fair_trade_certified: boolean | null
          flavor_profile: string[] | null
          focus_effects: string[] | null
          harvesting_season: string[] | null
          id: string
          image_gallery: string[] | null
          l_theanine_content_mg: number | null
          mineral_content: Json | null
          name: string
          optimal_steep_time_range_seconds: number[] | null
          optimal_temp_celsius: number | null
          organic_certified: boolean | null
          origin_regions: string[] | null
          preparation_methods: string[] | null
          preparation_variations: Json | null
          processing_method: string | null
          processing_methods: string[] | null
          quality_indicators: string[] | null
          research_references: string[] | null
          safety_notes: string | null
          scientific_name: string | null
          seasonal_availability: string[] | null
          shelf_life: string | null
          source_regions: string[] | null
          status: string | null
          steep_time_range_seconds: number[] | null
          steeping_vessel_recommendations: string[] | null
          storage_instructions: string | null
          sustainability_info: string | null
          theobromine_content_mg: number | null
          theophylline_content_mg: number | null
          therapeutic_claims: string[] | null
          traditional_use_regions: string[] | null
          traditional_uses: string[] | null
          updated_at: string | null
          usage_count: number | null
          vitamin_content: Json | null
          warnings_and_interactions: string[] | null
          water_quality_notes: string | null
        }
        Insert: {
          active_compounds?: string[] | null
          alternative_names?: string[] | null
          antioxidant_content?: string | null
          aroma_notes?: string[] | null
          average_rating?: number | null
          benefits?: string[] | null
          botanical_family?: string | null
          brewing_instructions: string
          brewing_tips?: string[] | null
          caffeine_content_mg?: number | null
          category: string
          cautions?: string[] | null
          common_combinations?: string[] | null
          contraindications?: string[] | null
          created_at?: string | null
          cultural_significance?: string | null
          description: string
          eco_certifications?: string[] | null
          energy_effects?: string[] | null
          fair_trade_certified?: boolean | null
          flavor_profile?: string[] | null
          focus_effects?: string[] | null
          harvesting_season?: string[] | null
          id?: string
          image_gallery?: string[] | null
          l_theanine_content_mg?: number | null
          mineral_content?: Json | null
          name: string
          optimal_steep_time_range_seconds?: number[] | null
          optimal_temp_celsius?: number | null
          organic_certified?: boolean | null
          origin_regions?: string[] | null
          preparation_methods?: string[] | null
          preparation_variations?: Json | null
          processing_method?: string | null
          processing_methods?: string[] | null
          quality_indicators?: string[] | null
          research_references?: string[] | null
          safety_notes?: string | null
          scientific_name?: string | null
          seasonal_availability?: string[] | null
          shelf_life?: string | null
          source_regions?: string[] | null
          status?: string | null
          steep_time_range_seconds?: number[] | null
          steeping_vessel_recommendations?: string[] | null
          storage_instructions?: string | null
          sustainability_info?: string | null
          theobromine_content_mg?: number | null
          theophylline_content_mg?: number | null
          therapeutic_claims?: string[] | null
          traditional_use_regions?: string[] | null
          traditional_uses?: string[] | null
          updated_at?: string | null
          usage_count?: number | null
          vitamin_content?: Json | null
          warnings_and_interactions?: string[] | null
          water_quality_notes?: string | null
        }
        Update: {
          active_compounds?: string[] | null
          alternative_names?: string[] | null
          antioxidant_content?: string | null
          aroma_notes?: string[] | null
          average_rating?: number | null
          benefits?: string[] | null
          botanical_family?: string | null
          brewing_instructions?: string
          brewing_tips?: string[] | null
          caffeine_content_mg?: number | null
          category?: string
          cautions?: string[] | null
          common_combinations?: string[] | null
          contraindications?: string[] | null
          created_at?: string | null
          cultural_significance?: string | null
          description?: string
          eco_certifications?: string[] | null
          energy_effects?: string[] | null
          fair_trade_certified?: boolean | null
          flavor_profile?: string[] | null
          focus_effects?: string[] | null
          harvesting_season?: string[] | null
          id?: string
          image_gallery?: string[] | null
          l_theanine_content_mg?: number | null
          mineral_content?: Json | null
          name?: string
          optimal_steep_time_range_seconds?: number[] | null
          optimal_temp_celsius?: number | null
          organic_certified?: boolean | null
          origin_regions?: string[] | null
          preparation_methods?: string[] | null
          preparation_variations?: Json | null
          processing_method?: string | null
          processing_methods?: string[] | null
          quality_indicators?: string[] | null
          research_references?: string[] | null
          safety_notes?: string | null
          scientific_name?: string | null
          seasonal_availability?: string[] | null
          shelf_life?: string | null
          source_regions?: string[] | null
          status?: string | null
          steep_time_range_seconds?: number[] | null
          steeping_vessel_recommendations?: string[] | null
          storage_instructions?: string | null
          sustainability_info?: string | null
          theobromine_content_mg?: number | null
          theophylline_content_mg?: number | null
          therapeutic_claims?: string[] | null
          traditional_use_regions?: string[] | null
          traditional_uses?: string[] | null
          updated_at?: string | null
          usage_count?: number | null
          vitamin_content?: Json | null
          warnings_and_interactions?: string[] | null
          water_quality_notes?: string | null
        }
        Relationships: []
      }
      heritage_site_sponsorships: {
        Row: {
          amount: number
          created_at: string | null
          cultural_alignment_notes: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          site_id: string | null
          sponsor_description: string | null
          sponsor_name: string
          sponsorship_level: string
          start_date: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          cultural_alignment_notes?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          site_id?: string | null
          sponsor_description?: string | null
          sponsor_name: string
          sponsorship_level: string
          start_date: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          cultural_alignment_notes?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          site_id?: string | null
          sponsor_description?: string | null
          sponsor_name?: string
          sponsorship_level?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "heritage_site_sponsorships_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "heritage_sites"
            referencedColumns: ["id"]
          },
        ]
      }
      heritage_sites: {
        Row: {
          admission_fee: number | null
          created_at: string
          description: string
          historical_significance: string | null
          id: string
          image_url: string | null
          location: string
          name: string
          search_rank: number | null
          search_vector: unknown | null
          slug: string | null
          visiting_hours: string | null
        }
        Insert: {
          admission_fee?: number | null
          created_at?: string
          description: string
          historical_significance?: string | null
          id?: string
          image_url?: string | null
          location: string
          name: string
          search_rank?: number | null
          search_vector?: unknown | null
          slug?: string | null
          visiting_hours?: string | null
        }
        Update: {
          admission_fee?: number | null
          created_at?: string
          description?: string
          historical_significance?: string | null
          id?: string
          image_url?: string | null
          location?: string
          name?: string
          search_rank?: number | null
          search_vector?: unknown | null
          slug?: string | null
          visiting_hours?: string | null
        }
        Relationships: []
      }
      hunts: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hunts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "hunts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_claim_attachments: {
        Row: {
          claim_id: string
          created_at: string | null
          file_name: string
          file_type: string
          file_url: string
          id: string
          uploaded_by: string
        }
        Insert: {
          claim_id: string
          created_at?: string | null
          file_name: string
          file_type: string
          file_url: string
          id?: string
          uploaded_by: string
        }
        Update: {
          claim_id?: string
          created_at?: string | null
          file_name?: string
          file_type?: string
          file_url?: string
          id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "insurance_claim_attachments_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "insurance_claims"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_claim_processing: {
        Row: {
          claim_id: string
          created_at: string | null
          id: string
          last_processed_at: string | null
          processed_at: string | null
          processing_errors: string[] | null
          processor_notes: string | null
          resubmission_count: number | null
          status: string
          updated_at: string | null
        }
        Insert: {
          claim_id: string
          created_at?: string | null
          id?: string
          last_processed_at?: string | null
          processed_at?: string | null
          processing_errors?: string[] | null
          processor_notes?: string | null
          resubmission_count?: number | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          claim_id?: string
          created_at?: string | null
          id?: string
          last_processed_at?: string | null
          processed_at?: string | null
          processing_errors?: string[] | null
          processor_notes?: string | null
          resubmission_count?: number | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_claim_processing_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "insurance_claims"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_claim_submissions: {
        Row: {
          claim_id: string | null
          created_at: string | null
          error_message: string | null
          id: string
          payer_claim_id: string | null
          response_details: Json | null
          status: string
          submission_date: string | null
          submission_method: string | null
          updated_at: string | null
        }
        Insert: {
          claim_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          payer_claim_id?: string | null
          response_details?: Json | null
          status: string
          submission_date?: string | null
          submission_method?: string | null
          updated_at?: string | null
        }
        Update: {
          claim_id?: string | null
          created_at?: string | null
          error_message?: string | null
          id?: string
          payer_claim_id?: string | null
          response_details?: Json | null
          status?: string
          submission_date?: string | null
          submission_method?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_claim_submissions_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "insurance_claims"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_claims: {
        Row: {
          billed_amount: number
          claim_number: string | null
          client_insurance_id: string
          created_at: string | null
          diagnosis_codes: string[] | null
          id: string
          notes: string | null
          priority: string | null
          procedure_codes: string[] | null
          processing_notes: string | null
          professional_id: string
          response_details: Json | null
          service_date: string
          session_id: string
          status: string | null
          submission_date: string | null
          supporting_documents: string[] | null
          tracking_number: string | null
          updated_at: string | null
        }
        Insert: {
          billed_amount: number
          claim_number?: string | null
          client_insurance_id: string
          created_at?: string | null
          diagnosis_codes?: string[] | null
          id?: string
          notes?: string | null
          priority?: string | null
          procedure_codes?: string[] | null
          processing_notes?: string | null
          professional_id: string
          response_details?: Json | null
          service_date: string
          session_id: string
          status?: string | null
          submission_date?: string | null
          supporting_documents?: string[] | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Update: {
          billed_amount?: number
          claim_number?: string | null
          client_insurance_id?: string
          created_at?: string | null
          diagnosis_codes?: string[] | null
          id?: string
          notes?: string | null
          priority?: string | null
          procedure_codes?: string[] | null
          processing_notes?: string | null
          professional_id?: string
          response_details?: Json | null
          service_date?: string
          session_id?: string
          status?: string | null
          submission_date?: string | null
          supporting_documents?: string[] | null
          tracking_number?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_claims_client_insurance_id_fkey"
            columns: ["client_insurance_id"]
            isOneToOne: false
            referencedRelation: "client_insurance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_claims_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_claims_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "consultation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_eligibility_checks: {
        Row: {
          client_insurance_id: string | null
          coinsurance_percentage: number | null
          copay_amount: number | null
          coverage_details: Json | null
          created_at: string | null
          deductible_remaining: number | null
          error_message: string | null
          id: string
          insurance_group_name: string | null
          insurance_plan_name: string | null
          policy_number: string | null
          professional_id: string
          status: string
          updated_at: string | null
          verification_date: string | null
        }
        Insert: {
          client_insurance_id?: string | null
          coinsurance_percentage?: number | null
          copay_amount?: number | null
          coverage_details?: Json | null
          created_at?: string | null
          deductible_remaining?: number | null
          error_message?: string | null
          id?: string
          insurance_group_name?: string | null
          insurance_plan_name?: string | null
          policy_number?: string | null
          professional_id: string
          status: string
          updated_at?: string | null
          verification_date?: string | null
        }
        Update: {
          client_insurance_id?: string | null
          coinsurance_percentage?: number | null
          copay_amount?: number | null
          coverage_details?: Json | null
          created_at?: string | null
          deductible_remaining?: number | null
          error_message?: string | null
          id?: string
          insurance_group_name?: string | null
          insurance_plan_name?: string | null
          policy_number?: string | null
          professional_id?: string
          status?: string
          updated_at?: string | null
          verification_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_client_insurance"
            columns: ["client_insurance_id"]
            isOneToOne: false
            referencedRelation: "client_insurance"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "insurance_eligibility_checks_client_insurance_id_fkey"
            columns: ["client_insurance_id"]
            isOneToOne: false
            referencedRelation: "client_insurance"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_eob_documents: {
        Row: {
          claim_id: string
          created_at: string | null
          document_url: string
          id: string
          issued_date: string
          patient_responsibility: number | null
          received_date: string | null
          total_allowed: number | null
          total_billed: number
          total_paid: number | null
        }
        Insert: {
          claim_id: string
          created_at?: string | null
          document_url: string
          id?: string
          issued_date: string
          patient_responsibility?: number | null
          received_date?: string | null
          total_allowed?: number | null
          total_billed: number
          total_paid?: number | null
        }
        Update: {
          claim_id?: string
          created_at?: string | null
          document_url?: string
          id?: string
          issued_date?: string
          patient_responsibility?: number | null
          received_date?: string | null
          total_allowed?: number | null
          total_billed?: number
          total_paid?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_eob_documents_claim_id_fkey"
            columns: ["claim_id"]
            isOneToOne: false
            referencedRelation: "insurance_claims"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_fee_schedules: {
        Row: {
          allowed_amount: number
          created_at: string | null
          effective_date: string
          end_date: string | null
          id: string
          insurance_provider_id: string
          service_code: string
          service_description: string
          updated_at: string | null
        }
        Insert: {
          allowed_amount: number
          created_at?: string | null
          effective_date: string
          end_date?: string | null
          id?: string
          insurance_provider_id: string
          service_code: string
          service_description: string
          updated_at?: string | null
        }
        Update: {
          allowed_amount?: number
          created_at?: string | null
          effective_date?: string
          end_date?: string | null
          id?: string
          insurance_provider_id?: string
          service_code?: string
          service_description?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_fee_schedules_insurance_provider_id_fkey"
            columns: ["insurance_provider_id"]
            isOneToOne: false
            referencedRelation: "insurance_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          metadata: Json | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          metadata?: Json | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      insurance_plans: {
        Row: {
          coverage_details: Json | null
          created_at: string | null
          id: string
          plan_name: string
          plan_type: string
          provider_id: string | null
          updated_at: string | null
        }
        Insert: {
          coverage_details?: Json | null
          created_at?: string | null
          id?: string
          plan_name: string
          plan_type: string
          provider_id?: string | null
          updated_at?: string | null
        }
        Update: {
          coverage_details?: Json | null
          created_at?: string | null
          id?: string
          plan_name?: string
          plan_type?: string
          provider_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_plans_provider_id_fkey"
            columns: ["provider_id"]
            isOneToOne: false
            referencedRelation: "insurance_providers"
            referencedColumns: ["id"]
          },
        ]
      }
      insurance_provider_networks: {
        Row: {
          coverage_area: string[]
          created_at: string | null
          id: string
          name: string
          network_type: string
          updated_at: string | null
        }
        Insert: {
          coverage_area?: string[]
          created_at?: string | null
          id?: string
          name: string
          network_type: string
          updated_at?: string | null
        }
        Update: {
          coverage_area?: string[]
          created_at?: string | null
          id?: string
          name?: string
          network_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      insurance_providers: {
        Row: {
          claims_api_endpoint: string | null
          created_at: string | null
          eligibility_api_endpoint: string | null
          id: string
          is_active: boolean | null
          name: string
          payer_id: string
          provider_network: string[] | null
          supported_claim_types: string[] | null
          updated_at: string | null
          verification_method: string | null
        }
        Insert: {
          claims_api_endpoint?: string | null
          created_at?: string | null
          eligibility_api_endpoint?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          payer_id: string
          provider_network?: string[] | null
          supported_claim_types?: string[] | null
          updated_at?: string | null
          verification_method?: string | null
        }
        Update: {
          claims_api_endpoint?: string | null
          created_at?: string | null
          eligibility_api_endpoint?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          payer_id?: string
          provider_network?: string[] | null
          supported_claim_types?: string[] | null
          updated_at?: string | null
          verification_method?: string | null
        }
        Relationships: []
      }
      insurance_verification_history: {
        Row: {
          client_insurance_id: string
          coinsurance_percentage: number | null
          copay_amount: number | null
          coverage_details: Json | null
          created_at: string | null
          deductible_remaining: number | null
          error_message: string | null
          id: string
          professional_id: string
          updated_at: string | null
          verification_status: string
          verified_at: string | null
        }
        Insert: {
          client_insurance_id: string
          coinsurance_percentage?: number | null
          copay_amount?: number | null
          coverage_details?: Json | null
          created_at?: string | null
          deductible_remaining?: number | null
          error_message?: string | null
          id?: string
          professional_id: string
          updated_at?: string | null
          verification_status?: string
          verified_at?: string | null
        }
        Update: {
          client_insurance_id?: string
          coinsurance_percentage?: number | null
          copay_amount?: number | null
          coverage_details?: Json | null
          created_at?: string | null
          deductible_remaining?: number | null
          error_message?: string | null
          id?: string
          professional_id?: string
          updated_at?: string | null
          verification_status?: string
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "insurance_verification_history_client_insurance_id_fkey"
            columns: ["client_insurance_id"]
            isOneToOne: false
            referencedRelation: "client_insurance"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_sync_logs: {
        Row: {
          completed_at: string | null
          details: Json | null
          error_message: string | null
          id: string
          integration_id: string | null
          started_at: string | null
          status: string
          sync_type: string
        }
        Insert: {
          completed_at?: string | null
          details?: Json | null
          error_message?: string | null
          id?: string
          integration_id?: string | null
          started_at?: string | null
          status: string
          sync_type: string
        }
        Update: {
          completed_at?: string | null
          details?: Json | null
          error_message?: string | null
          id?: string
          integration_id?: string | null
          started_at?: string | null
          status?: string
          sync_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_sync_logs_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "platform_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_locations: {
        Row: {
          id: string
          last_restock_at: string | null
          location_id: string | null
          low_stock_threshold: number | null
          product_id: string | null
          quantity: number | null
          reorder_point: number | null
          reorder_quantity: number | null
        }
        Insert: {
          id?: string
          last_restock_at?: string | null
          location_id?: string | null
          low_stock_threshold?: number | null
          product_id?: string | null
          quantity?: number | null
          reorder_point?: number | null
          reorder_quantity?: number | null
        }
        Update: {
          id?: string
          last_restock_at?: string | null
          location_id?: string | null
          low_stock_threshold?: number | null
          product_id?: string | null
          quantity?: number | null
          reorder_point?: number | null
          reorder_quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_locations_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "vendor_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_locations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "inventory_locations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_logs: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          product_id: string
          quantity_change: number
          reason: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          product_id: string
          quantity_change: number
          reason?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          product_id?: string
          quantity_change?: number
          reason?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_logs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "inventory_logs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_tracking: {
        Row: {
          created_at: string | null
          id: string
          last_restock_date: string | null
          location_id: string | null
          low_stock_threshold: number | null
          next_restock_date: string | null
          product_id: string | null
          quantity: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_restock_date?: string | null
          location_id?: string | null
          low_stock_threshold?: number | null
          next_restock_date?: string | null
          product_id?: string | null
          quantity?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_restock_date?: string | null
          location_id?: string | null
          low_stock_threshold?: number | null
          next_restock_date?: string | null
          product_id?: string | null
          quantity?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_tracking_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "retail_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_tracking_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "inventory_tracking_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string | null
          entry_type: string
          id: string
          mood_rating: number | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          entry_type: string
          id?: string
          mood_rating?: number | null
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          entry_type?: string
          id?: string
          mood_rating?: number | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      journal_templates: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          prompts: Json
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          prompts: Json
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          prompts?: Json
          title?: string
        }
        Relationships: []
      }
      life_situations: {
        Row: {
          created_at: string | null
          ended_at: string | null
          id: string
          metadata: Json | null
          notes: string | null
          situation: string
          started_at: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          situation: string
          started_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          situation?: string
          started_at?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      list_products: {
        Row: {
          added_at: string | null
          list_id: string
          notes: string | null
          product_id: string
        }
        Insert: {
          added_at?: string | null
          list_id: string
          notes?: string | null
          product_id: string
        }
        Update: {
          added_at?: string | null
          list_id?: string
          notes?: string | null
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "list_products_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "user_product_lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "list_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "list_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      longitudinal_studies: {
        Row: {
          created_at: string
          data_collection_methods: string[] | null
          description: string | null
          duration_days: number | null
          frequency: string
          id: string
          objectives: string[] | null
          participant_criteria: Json | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_collection_methods?: string[] | null
          description?: string | null
          duration_days?: number | null
          frequency: string
          id?: string
          objectives?: string[] | null
          participant_criteria?: Json | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_collection_methods?: string[] | null
          description?: string | null
          duration_days?: number | null
          frequency?: string
          id?: string
          objectives?: string[] | null
          participant_criteria?: Json | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      loyalty_programs: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      loyalty_rewards: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          points_cost: number
          program_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          points_cost: number
          program_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          points_cost?: number
          program_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_rewards_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "loyalty_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      loyalty_tiers: {
        Row: {
          benefits: Json | null
          created_at: string | null
          id: string
          level: Database["public"]["Enums"]["loyalty_tier_level"]
          points_required: number
          program_id: string | null
        }
        Insert: {
          benefits?: Json | null
          created_at?: string | null
          id?: string
          level: Database["public"]["Enums"]["loyalty_tier_level"]
          points_required: number
          program_id?: string | null
        }
        Update: {
          benefits?: Json | null
          created_at?: string | null
          id?: string
          level?: Database["public"]["Enums"]["loyalty_tier_level"]
          points_required?: number
          program_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loyalty_tiers_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "loyalty_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      marketplace_metrics: {
        Row: {
          active_users: number | null
          created_at: string | null
          engagement_rate: number | null
          id: string
          metrics_data: Json | null
          peak_hours: Json | null
          response_rate: number | null
          segments: Json | null
        }
        Insert: {
          active_users?: number | null
          created_at?: string | null
          engagement_rate?: number | null
          id?: string
          metrics_data?: Json | null
          peak_hours?: Json | null
          response_rate?: number | null
          segments?: Json | null
        }
        Update: {
          active_users?: number | null
          created_at?: string | null
          engagement_rate?: number | null
          id?: string
          metrics_data?: Json | null
          peak_hours?: Json | null
          response_rate?: number | null
          segments?: Json | null
        }
        Relationships: []
      }
      marketplace_platform_metrics: {
        Row: {
          created_at: string | null
          id: string
          last_sync_at: string | null
          metrics_data: Json
          platform_name: string
          sync_status: string
          vendor_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_sync_at?: string | null
          metrics_data?: Json
          platform_name: string
          sync_status?: string
          vendor_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          last_sync_at?: string | null
          metrics_data?: Json
          platform_name?: string
          sync_status?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketplace_platform_metrics_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      mead: {
        Row: {
          abv: number | null
          brewery: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          name: string
          search_rank: number | null
          search_vector: unknown | null
          style: string | null
          sweetness_level: string | null
        }
        Insert: {
          abv?: number | null
          brewery: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name: string
          search_rank?: number | null
          search_vector?: unknown | null
          style?: string | null
          sweetness_level?: string | null
        }
        Update: {
          abv?: number | null
          brewery?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string
          search_rank?: number | null
          search_vector?: unknown | null
          style?: string | null
          sweetness_level?: string | null
        }
        Relationships: []
      }
      mead_guide: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string
          id: string
          image_url: string | null
          last_updated_at: string
          search_vector: unknown | null
          title: string
        }
        Insert: {
          author: string
          category: string
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          last_updated_at?: string
          search_vector?: unknown | null
          title: string
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          last_updated_at?: string
          search_vector?: unknown | null
          title?: string
        }
        Relationships: []
      }
      mead_reviews: {
        Row: {
          acidity_rating: number | null
          aftertaste_rating: number | null
          appearance_rating: number
          aroma_notes: string[] | null
          aroma_rating: number
          author_name: string
          balance_rating: number | null
          bottle_condition: boolean | null
          carbonation_description: string | null
          clarity_description: string | null
          color_description: string | null
          complexity_rating: number | null
          created_at: string
          drinkability_rating: number | null
          fermentation_character_rating: number | null
          flavor_rating: number
          helpful_votes: number | null
          honey_character_rating: number | null
          id: string
          mead_id: string | null
          mouthfeel_rating: number
          overall_rating: number
          rating: number
          review_text: string | null
          serving_temperature_c: number | null
          serving_vessel: string | null
          sweetness_rating: number | null
          taste_notes: string[] | null
          tasting_date: string | null
          verified_purchase: boolean | null
          vintage_year: number | null
          would_buy_again: boolean | null
        }
        Insert: {
          acidity_rating?: number | null
          aftertaste_rating?: number | null
          appearance_rating?: number
          aroma_notes?: string[] | null
          aroma_rating?: number
          author_name: string
          balance_rating?: number | null
          bottle_condition?: boolean | null
          carbonation_description?: string | null
          clarity_description?: string | null
          color_description?: string | null
          complexity_rating?: number | null
          created_at?: string
          drinkability_rating?: number | null
          fermentation_character_rating?: number | null
          flavor_rating?: number
          helpful_votes?: number | null
          honey_character_rating?: number | null
          id?: string
          mead_id?: string | null
          mouthfeel_rating?: number
          overall_rating?: number
          rating: number
          review_text?: string | null
          serving_temperature_c?: number | null
          serving_vessel?: string | null
          sweetness_rating?: number | null
          taste_notes?: string[] | null
          tasting_date?: string | null
          verified_purchase?: boolean | null
          vintage_year?: number | null
          would_buy_again?: boolean | null
        }
        Update: {
          acidity_rating?: number | null
          aftertaste_rating?: number | null
          appearance_rating?: number
          aroma_notes?: string[] | null
          aroma_rating?: number
          author_name?: string
          balance_rating?: number | null
          bottle_condition?: boolean | null
          carbonation_description?: string | null
          clarity_description?: string | null
          color_description?: string | null
          complexity_rating?: number | null
          created_at?: string
          drinkability_rating?: number | null
          fermentation_character_rating?: number | null
          flavor_rating?: number
          helpful_votes?: number | null
          honey_character_rating?: number | null
          id?: string
          mead_id?: string | null
          mouthfeel_rating?: number
          overall_rating?: number
          rating?: number
          review_text?: string | null
          serving_temperature_c?: number | null
          serving_vessel?: string | null
          sweetness_rating?: number | null
          taste_notes?: string[] | null
          tasting_date?: string | null
          verified_purchase?: boolean | null
          vintage_year?: number | null
          would_buy_again?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "mead_reviews_mead_id_fkey"
            columns: ["mead_id"]
            isOneToOne: false
            referencedRelation: "mead"
            referencedColumns: ["id"]
          },
        ]
      }
      medication_logs: {
        Row: {
          created_at: string | null
          dosage: string
          effectiveness_rating: number | null
          id: string
          medication_name: string
          notes: string | null
          side_effects: string | null
          time_taken: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dosage: string
          effectiveness_rating?: number | null
          id?: string
          medication_name: string
          notes?: string | null
          side_effects?: string | null
          time_taken: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          dosage?: string
          effectiveness_rating?: number | null
          id?: string
          medication_name?: string
          notes?: string | null
          side_effects?: string | null
          time_taken?: string
          user_id?: string
        }
        Relationships: []
      }
      medication_reminders: {
        Row: {
          created_at: string | null
          days_of_week: string[] | null
          dosage: string
          end_date: string | null
          frequency: string
          id: string
          medication_name: string
          notes: string | null
          reminder_times: string[]
          start_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          days_of_week?: string[] | null
          dosage: string
          end_date?: string | null
          frequency: string
          id?: string
          medication_name: string
          notes?: string | null
          reminder_times: string[]
          start_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          days_of_week?: string[] | null
          dosage?: string
          end_date?: string | null
          frequency?: string
          id?: string
          medication_name?: string
          notes?: string | null
          reminder_times?: string[]
          start_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      meditation_audio: {
        Row: {
          audio_url: string
          category: string
          created_at: string | null
          description: string | null
          duration_seconds: number
          id: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          audio_url: string
          category: string
          created_at?: string | null
          description?: string | null
          duration_seconds: number
          id?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          audio_url?: string
          category?: string
          created_at?: string | null
          description?: string | null
          duration_seconds?: number
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      meditation_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          current_streak: number | null
          id: string
          longest_streak: number | null
          meditation_level: number | null
          preferred_frequencies: Json | null
          total_minutes: number | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          current_streak?: number | null
          id: string
          longest_streak?: number | null
          meditation_level?: number | null
          preferred_frequencies?: Json | null
          total_minutes?: number | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          current_streak?: number | null
          id?: string
          longest_streak?: number | null
          meditation_level?: number | null
          preferred_frequencies?: Json | null
          total_minutes?: number | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      meditation_progress: {
        Row: {
          completed_duration: number
          created_at: string | null
          id: string
          mood_after: number | null
          mood_before: number | null
          notes: string | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          completed_duration: number
          created_at?: string | null
          id?: string
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          completed_duration?: number
          created_at?: string | null
          id?: string
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "meditation_progress_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "meditation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      meditation_sessions: {
        Row: {
          audio_url: string | null
          background_image_url: string | null
          created_at: string | null
          description: string | null
          difficulty_level: string
          duration_minutes: number
          id: string
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          audio_url?: string | null
          background_image_url?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level: string
          duration_minutes: number
          id?: string
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          audio_url?: string | null
          background_image_url?: string | null
          created_at?: string | null
          description?: string | null
          difficulty_level?: string
          duration_minutes?: number
          id?: string
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      meditation_settings: {
        Row: {
          auto_next_session: boolean | null
          background_sounds: boolean | null
          created_at: string
          haptic_feedback: boolean | null
          id: string
          notification_preferences: Json | null
          reminder_time: string | null
          theme: string | null
          updated_at: string
        }
        Insert: {
          auto_next_session?: boolean | null
          background_sounds?: boolean | null
          created_at?: string
          haptic_feedback?: boolean | null
          id: string
          notification_preferences?: Json | null
          reminder_time?: string | null
          theme?: string | null
          updated_at?: string
        }
        Update: {
          auto_next_session?: boolean | null
          background_sounds?: boolean | null
          created_at?: string
          haptic_feedback?: boolean | null
          id?: string
          notification_preferences?: Json | null
          reminder_time?: string | null
          theme?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      member_access: {
        Row: {
          access_expires_at: string | null
          access_granted_at: string | null
          discord_member_id: string | null
          id: string
          platform_type: string
          product_id: string | null
          status: string | null
          telegram_user_id: string | null
          user_id: string | null
        }
        Insert: {
          access_expires_at?: string | null
          access_granted_at?: string | null
          discord_member_id?: string | null
          id?: string
          platform_type: string
          product_id?: string | null
          status?: string | null
          telegram_user_id?: string | null
          user_id?: string | null
        }
        Update: {
          access_expires_at?: string | null
          access_granted_at?: string | null
          discord_member_id?: string | null
          id?: string
          platform_type?: string
          product_id?: string | null
          status?: string | null
          telegram_user_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_access_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "member_access_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_tiers: {
        Row: {
          benefits: string[]
          created_at: string | null
          description: string | null
          discount_percentage: number | null
          exclusive_content_access: boolean | null
          id: string
          is_active: boolean | null
          max_bookings_per_month: number | null
          name: string
          price: number
          priority_support: boolean | null
        }
        Insert: {
          benefits?: string[]
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          exclusive_content_access?: boolean | null
          id?: string
          is_active?: boolean | null
          max_bookings_per_month?: number | null
          name: string
          price: number
          priority_support?: boolean | null
        }
        Update: {
          benefits?: string[]
          created_at?: string | null
          description?: string | null
          discount_percentage?: number | null
          exclusive_content_access?: boolean | null
          id?: string
          is_active?: boolean | null
          max_bookings_per_month?: number | null
          name?: string
          price?: number
          priority_support?: boolean | null
        }
        Relationships: []
      }
      mental_health_homework: {
        Row: {
          assignment_type: string
          client_id: string | null
          client_response: Json | null
          completion_status: string | null
          created_at: string
          description: string | null
          due_date: string | null
          feedback: string | null
          id: string
          professional_id: string | null
          title: string
        }
        Insert: {
          assignment_type: string
          client_id?: string | null
          client_response?: Json | null
          completion_status?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          feedback?: string | null
          id?: string
          professional_id?: string | null
          title: string
        }
        Update: {
          assignment_type?: string
          client_id?: string | null
          client_response?: Json | null
          completion_status?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          feedback?: string | null
          id?: string
          professional_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "mental_health_homework_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "mental_health_professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      mental_health_professionals: {
        Row: {
          approach_description: string | null
          areas_of_focus: string[] | null
          available_slots: Json | null
          avatar_url: string | null
          bio: string | null
          certifications: string[] | null
          consultation_fee: number | null
          consultation_types: string[] | null
          created_at: string
          credentials: string[]
          education: string[] | null
          expertise_areas: string[] | null
          full_name: string
          id: string
          is_available: boolean | null
          languages: string[] | null
          max_clients: number | null
          rating: number | null
          reviews_count: number | null
          session_format: string[] | null
          specialties: Database["public"]["Enums"]["expert_specialty"][]
          therapy_specialties: string[] | null
          title: string
          user_id: string | null
          verification_status: string | null
          years_experience: number | null
          years_of_experience: number | null
        }
        Insert: {
          approach_description?: string | null
          areas_of_focus?: string[] | null
          available_slots?: Json | null
          avatar_url?: string | null
          bio?: string | null
          certifications?: string[] | null
          consultation_fee?: number | null
          consultation_types?: string[] | null
          created_at?: string
          credentials: string[]
          education?: string[] | null
          expertise_areas?: string[] | null
          full_name: string
          id?: string
          is_available?: boolean | null
          languages?: string[] | null
          max_clients?: number | null
          rating?: number | null
          reviews_count?: number | null
          session_format?: string[] | null
          specialties: Database["public"]["Enums"]["expert_specialty"][]
          therapy_specialties?: string[] | null
          title: string
          user_id?: string | null
          verification_status?: string | null
          years_experience?: number | null
          years_of_experience?: number | null
        }
        Update: {
          approach_description?: string | null
          areas_of_focus?: string[] | null
          available_slots?: Json | null
          avatar_url?: string | null
          bio?: string | null
          certifications?: string[] | null
          consultation_fee?: number | null
          consultation_types?: string[] | null
          created_at?: string
          credentials?: string[]
          education?: string[] | null
          expertise_areas?: string[] | null
          full_name?: string
          id?: string
          is_available?: boolean | null
          languages?: string[] | null
          max_clients?: number | null
          rating?: number | null
          reviews_count?: number | null
          session_format?: string[] | null
          specialties?: Database["public"]["Enums"]["expert_specialty"][]
          therapy_specialties?: string[] | null
          title?: string
          user_id?: string | null
          verification_status?: string | null
          years_experience?: number | null
          years_of_experience?: number | null
        }
        Relationships: []
      }
      mental_health_progress: {
        Row: {
          client_id: string | null
          created_at: string
          date: string
          energy_level: number | null
          exercise_completion: boolean | null
          id: string
          meditation_completion: boolean | null
          mood_score: number | null
          next_steps: string | null
          notes: string | null
          nutrition_adherence: boolean | null
          professional_id: string | null
          sleep_quality: number | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          date?: string
          energy_level?: number | null
          exercise_completion?: boolean | null
          id?: string
          meditation_completion?: boolean | null
          mood_score?: number | null
          next_steps?: string | null
          notes?: string | null
          nutrition_adherence?: boolean | null
          professional_id?: string | null
          sleep_quality?: number | null
        }
        Update: {
          client_id?: string | null
          created_at?: string
          date?: string
          energy_level?: number | null
          exercise_completion?: boolean | null
          id?: string
          meditation_completion?: boolean | null
          mood_score?: number | null
          next_steps?: string | null
          notes?: string | null
          nutrition_adherence?: boolean | null
          professional_id?: string | null
          sleep_quality?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "mental_health_progress_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "mental_health_professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_journals: {
        Row: {
          activities: string[] | null
          anxiety_level: number | null
          challenges: string[] | null
          created_at: string | null
          energy_level: number | null
          entry_date: string | null
          gratitude_points: string[] | null
          id: string
          journal_entry: string | null
          mood_rating: number | null
          positive_thoughts: string[] | null
          sleep_quality: number | null
          solutions: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activities?: string[] | null
          anxiety_level?: number | null
          challenges?: string[] | null
          created_at?: string | null
          energy_level?: number | null
          entry_date?: string | null
          gratitude_points?: string[] | null
          id?: string
          journal_entry?: string | null
          mood_rating?: number | null
          positive_thoughts?: string[] | null
          sleep_quality?: number | null
          solutions?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activities?: string[] | null
          anxiety_level?: number | null
          challenges?: string[] | null
          created_at?: string | null
          energy_level?: number | null
          entry_date?: string | null
          gratitude_points?: string[] | null
          id?: string
          journal_entry?: string | null
          mood_rating?: number | null
          positive_thoughts?: string[] | null
          sleep_quality?: number | null
          solutions?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mood_logs: {
        Row: {
          activities: string[] | null
          ai_analysis: string | null
          ai_recommendations: string | null
          cognitive_state: string[] | null
          coping_strategies: string[] | null
          created_at: string | null
          emotional_state: string[] | null
          energy_level: number | null
          environmental_factors: string[] | null
          exercise_minutes: number | null
          focus_level: number | null
          id: string
          meditation_minutes: number | null
          migraine_intensity: number | null
          mood_score: number | null
          notes: string | null
          outdoor_time_minutes: number | null
          physical_symptoms: string[] | null
          screen_time_minutes: number | null
          sleep_quality: number | null
          social_interactions: string[] | null
          stress_level: number | null
          thought_patterns: string[] | null
          updated_at: string | null
          user_id: string | null
          weather_data: Json | null
          weather_impact_score: number | null
        }
        Insert: {
          activities?: string[] | null
          ai_analysis?: string | null
          ai_recommendations?: string | null
          cognitive_state?: string[] | null
          coping_strategies?: string[] | null
          created_at?: string | null
          emotional_state?: string[] | null
          energy_level?: number | null
          environmental_factors?: string[] | null
          exercise_minutes?: number | null
          focus_level?: number | null
          id?: string
          meditation_minutes?: number | null
          migraine_intensity?: number | null
          mood_score?: number | null
          notes?: string | null
          outdoor_time_minutes?: number | null
          physical_symptoms?: string[] | null
          screen_time_minutes?: number | null
          sleep_quality?: number | null
          social_interactions?: string[] | null
          stress_level?: number | null
          thought_patterns?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          weather_data?: Json | null
          weather_impact_score?: number | null
        }
        Update: {
          activities?: string[] | null
          ai_analysis?: string | null
          ai_recommendations?: string | null
          cognitive_state?: string[] | null
          coping_strategies?: string[] | null
          created_at?: string | null
          emotional_state?: string[] | null
          energy_level?: number | null
          environmental_factors?: string[] | null
          exercise_minutes?: number | null
          focus_level?: number | null
          id?: string
          meditation_minutes?: number | null
          migraine_intensity?: number | null
          mood_score?: number | null
          notes?: string | null
          outdoor_time_minutes?: number | null
          physical_symptoms?: string[] | null
          screen_time_minutes?: number | null
          sleep_quality?: number | null
          social_interactions?: string[] | null
          stress_level?: number | null
          thought_patterns?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          weather_data?: Json | null
          weather_impact_score?: number | null
        }
        Relationships: []
      }
      mood_triggers: {
        Row: {
          created_at: string | null
          frequency: string
          id: string
          impact_level: number
          notes: string | null
          trigger_category: string
          trigger_name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          frequency: string
          id?: string
          impact_level: number
          notes?: string | null
          trigger_category: string
          trigger_name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          frequency?: string
          id?: string
          impact_level?: number
          notes?: string | null
          trigger_category?: string
          trigger_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      motivation_quotes: {
        Row: {
          author: string | null
          category: string | null
          content: string
          created_at: string | null
          id: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content: string
          created_at?: string | null
          id?: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string
          created_at?: string | null
          id?: string
        }
        Relationships: []
      }
      motivation_streaks: {
        Row: {
          created_at: string | null
          current_streak: number | null
          id: string
          last_check_in: string | null
          longest_streak: number | null
          streak_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_check_in?: string | null
          longest_streak?: number | null
          streak_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_check_in?: string | null
          longest_streak?: number | null
          streak_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      motivation_tracking: {
        Row: {
          created_at: string | null
          daily_goal: string | null
          date: string | null
          energy_score: number | null
          goal_achieved: boolean | null
          id: string
          mood_score: number | null
          reflection: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          daily_goal?: string | null
          date?: string | null
          energy_score?: number | null
          goal_achieved?: boolean | null
          id?: string
          mood_score?: number | null
          reflection?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          daily_goal?: string | null
          date?: string | null
          energy_score?: number | null
          goal_achieved?: boolean | null
          id?: string
          mood_score?: number | null
          reflection?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      navigation_states: {
        Row: {
          created_at: string | null
          current_route: string
          id: string
          previous_route: string | null
          state_data: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_route: string
          id?: string
          previous_route?: string | null
          state_data?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_route?: string
          id?: string
          previous_route?: string | null
          state_data?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      noise_sensitivity_settings: {
        Row: {
          auto_adjust_enabled: boolean | null
          created_at: string | null
          focus_mode_settings: Json | null
          id: string
          preferred_sounds: string[] | null
          updated_at: string | null
          user_id: string
          volume_level: number | null
          white_noise_enabled: boolean | null
        }
        Insert: {
          auto_adjust_enabled?: boolean | null
          created_at?: string | null
          focus_mode_settings?: Json | null
          id?: string
          preferred_sounds?: string[] | null
          updated_at?: string | null
          user_id: string
          volume_level?: number | null
          white_noise_enabled?: boolean | null
        }
        Update: {
          auto_adjust_enabled?: boolean | null
          created_at?: string | null
          focus_mode_settings?: Json | null
          id?: string
          preferred_sounds?: string[] | null
          updated_at?: string | null
          user_id?: string
          volume_level?: number | null
          white_noise_enabled?: boolean | null
        }
        Relationships: []
      }
      nootropics: {
        Row: {
          category: string
          created_at: string
          description: string
          half_life: string | null
          id: string
          interactions: string | null
          mechanism_of_action: string | null
          name: string
          recommended_dosage: string
          research_links: string[] | null
          safety_considerations: string | null
          side_effects: string | null
          updated_at: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          half_life?: string | null
          id?: string
          interactions?: string | null
          mechanism_of_action?: string | null
          name: string
          recommended_dosage: string
          research_links?: string[] | null
          safety_considerations?: string | null
          side_effects?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          half_life?: string | null
          id?: string
          interactions?: string | null
          mechanism_of_action?: string | null
          name?: string
          recommended_dosage?: string
          research_links?: string[] | null
          safety_considerations?: string | null
          side_effects?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      nordic_accessories: {
        Row: {
          crafting_method: string | null
          created_at: string | null
          cultural_significance: string | null
          description: string
          dimensions: Json | null
          historical_period: string | null
          id: string
          image_urls: string[] | null
          in_stock: boolean | null
          materials: string[] | null
          name: string
          price: number
          region_of_origin: string | null
          search_vector: unknown | null
          slug: string | null
          stock_quantity: number | null
          traditional_use: string | null
          type: string
        }
        Insert: {
          crafting_method?: string | null
          created_at?: string | null
          cultural_significance?: string | null
          description: string
          dimensions?: Json | null
          historical_period?: string | null
          id?: string
          image_urls?: string[] | null
          in_stock?: boolean | null
          materials?: string[] | null
          name: string
          price: number
          region_of_origin?: string | null
          search_vector?: unknown | null
          slug?: string | null
          stock_quantity?: number | null
          traditional_use?: string | null
          type: string
        }
        Update: {
          crafting_method?: string | null
          created_at?: string | null
          cultural_significance?: string | null
          description?: string
          dimensions?: Json | null
          historical_period?: string | null
          id?: string
          image_urls?: string[] | null
          in_stock?: boolean | null
          materials?: string[] | null
          name?: string
          price?: number
          region_of_origin?: string | null
          search_vector?: unknown | null
          slug?: string | null
          stock_quantity?: number | null
          traditional_use?: string | null
          type?: string
        }
        Relationships: []
      }
      nordic_accommodations: {
        Row: {
          accessibility_features: string[] | null
          amenities: string[] | null
          bedrooms: number
          booking_lead_time: string | null
          cancellation_policy: string | null
          check_in_time: string | null
          check_out_time: string | null
          checkin_features: string[] | null
          cleaning_fee: number | null
          cleaning_protocols: string[] | null
          created_at: string
          cultural_elements: string[] | null
          description: string
          eco_certifications: string[] | null
          featured_price: number | null
          featured_until: string | null
          group_booking_rules: Json | null
          guest_requirements: string[] | null
          house_rules: string[] | null
          id: string
          image_urls: string[] | null
          is_featured: boolean | null
          languages_spoken: string[] | null
          local_experiences: string[] | null
          location: string
          max_guests: number
          maximum_stay: number | null
          minimum_stay: number | null
          name: string
          nearby_attractions: string[] | null
          payment_options: string[] | null
          price_per_night: number
          property_history: string | null
          rating: number | null
          room_configurations: Json | null
          search_rank: number | null
          search_vector: unknown | null
          seasonal_activities: string[] | null
          seasonal_pricing: Json | null
          security_deposit: number | null
          security_features: string[] | null
          slug: string | null
          special_offers: Json[] | null
          sustainability_practices: string[] | null
          total_reviews: number | null
          vendor_id: string | null
        }
        Insert: {
          accessibility_features?: string[] | null
          amenities?: string[] | null
          bedrooms: number
          booking_lead_time?: string | null
          cancellation_policy?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          checkin_features?: string[] | null
          cleaning_fee?: number | null
          cleaning_protocols?: string[] | null
          created_at?: string
          cultural_elements?: string[] | null
          description: string
          eco_certifications?: string[] | null
          featured_price?: number | null
          featured_until?: string | null
          group_booking_rules?: Json | null
          guest_requirements?: string[] | null
          house_rules?: string[] | null
          id?: string
          image_urls?: string[] | null
          is_featured?: boolean | null
          languages_spoken?: string[] | null
          local_experiences?: string[] | null
          location: string
          max_guests: number
          maximum_stay?: number | null
          minimum_stay?: number | null
          name: string
          nearby_attractions?: string[] | null
          payment_options?: string[] | null
          price_per_night: number
          property_history?: string | null
          rating?: number | null
          room_configurations?: Json | null
          search_rank?: number | null
          search_vector?: unknown | null
          seasonal_activities?: string[] | null
          seasonal_pricing?: Json | null
          security_deposit?: number | null
          security_features?: string[] | null
          slug?: string | null
          special_offers?: Json[] | null
          sustainability_practices?: string[] | null
          total_reviews?: number | null
          vendor_id?: string | null
        }
        Update: {
          accessibility_features?: string[] | null
          amenities?: string[] | null
          bedrooms?: number
          booking_lead_time?: string | null
          cancellation_policy?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          checkin_features?: string[] | null
          cleaning_fee?: number | null
          cleaning_protocols?: string[] | null
          created_at?: string
          cultural_elements?: string[] | null
          description?: string
          eco_certifications?: string[] | null
          featured_price?: number | null
          featured_until?: string | null
          group_booking_rules?: Json | null
          guest_requirements?: string[] | null
          house_rules?: string[] | null
          id?: string
          image_urls?: string[] | null
          is_featured?: boolean | null
          languages_spoken?: string[] | null
          local_experiences?: string[] | null
          location?: string
          max_guests?: number
          maximum_stay?: number | null
          minimum_stay?: number | null
          name?: string
          nearby_attractions?: string[] | null
          payment_options?: string[] | null
          price_per_night?: number
          property_history?: string | null
          rating?: number | null
          room_configurations?: Json | null
          search_rank?: number | null
          search_vector?: unknown | null
          seasonal_activities?: string[] | null
          seasonal_pricing?: Json | null
          security_deposit?: number | null
          security_features?: string[] | null
          slug?: string | null
          special_offers?: Json[] | null
          sustainability_practices?: string[] | null
          total_reviews?: number | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nordic_accommodations_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nordic_artwork: {
        Row: {
          approved: boolean | null
          artist_name: string
          artwork_type: string
          available_quantity: number | null
          category: string | null
          category_id: string | null
          comments_count: number | null
          commission_available: boolean | null
          commission_info: Json | null
          created_at: string | null
          cultural_significance: string | null
          description: string
          dimensions: Json | null
          exhibition_history: Json[] | null
          featured: boolean | null
          featured_until: string | null
          for_sale: boolean | null
          id: string
          image_url: string | null
          inspiration_source: string | null
          interpretation_notes: string | null
          is_community_submission: boolean | null
          license_type: string | null
          likes_count: number | null
          materials: string[] | null
          price: number | null
          search_vector: unknown | null
          tags: string[] | null
          technique: string | null
          title: string
          vendor_id: string | null
          views_count: number | null
        }
        Insert: {
          approved?: boolean | null
          artist_name: string
          artwork_type: string
          available_quantity?: number | null
          category?: string | null
          category_id?: string | null
          comments_count?: number | null
          commission_available?: boolean | null
          commission_info?: Json | null
          created_at?: string | null
          cultural_significance?: string | null
          description: string
          dimensions?: Json | null
          exhibition_history?: Json[] | null
          featured?: boolean | null
          featured_until?: string | null
          for_sale?: boolean | null
          id?: string
          image_url?: string | null
          inspiration_source?: string | null
          interpretation_notes?: string | null
          is_community_submission?: boolean | null
          license_type?: string | null
          likes_count?: number | null
          materials?: string[] | null
          price?: number | null
          search_vector?: unknown | null
          tags?: string[] | null
          technique?: string | null
          title: string
          vendor_id?: string | null
          views_count?: number | null
        }
        Update: {
          approved?: boolean | null
          artist_name?: string
          artwork_type?: string
          available_quantity?: number | null
          category?: string | null
          category_id?: string | null
          comments_count?: number | null
          commission_available?: boolean | null
          commission_info?: Json | null
          created_at?: string | null
          cultural_significance?: string | null
          description?: string
          dimensions?: Json | null
          exhibition_history?: Json[] | null
          featured?: boolean | null
          featured_until?: string | null
          for_sale?: boolean | null
          id?: string
          image_url?: string | null
          inspiration_source?: string | null
          interpretation_notes?: string | null
          is_community_submission?: boolean | null
          license_type?: string | null
          likes_count?: number | null
          materials?: string[] | null
          price?: number | null
          search_vector?: unknown | null
          tags?: string[] | null
          technique?: string | null
          title?: string
          vendor_id?: string | null
          views_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nordic_artwork_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "nordic_artwork_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nordic_artwork_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      nordic_artwork_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          parent_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nordic_artwork_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "nordic_artwork_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      nordic_artwork_collection_items: {
        Row: {
          added_at: string | null
          artwork_id: string
          collection_id: string
        }
        Insert: {
          added_at?: string | null
          artwork_id: string
          collection_id: string
        }
        Update: {
          added_at?: string | null
          artwork_id?: string
          collection_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nordic_artwork_collection_items_artwork_id_fkey"
            columns: ["artwork_id"]
            isOneToOne: false
            referencedRelation: "nordic_artwork"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nordic_artwork_collection_items_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "nordic_artwork_collections"
            referencedColumns: ["id"]
          },
        ]
      }
      nordic_artwork_collections: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          search_vector: unknown | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          search_vector?: unknown | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          search_vector?: unknown | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      nordic_artwork_comments: {
        Row: {
          artwork_id: string | null
          comment: string
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          artwork_id?: string | null
          comment: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          artwork_id?: string | null
          comment?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nordic_artwork_comments_artwork_id_fkey"
            columns: ["artwork_id"]
            isOneToOne: false
            referencedRelation: "nordic_artwork"
            referencedColumns: ["id"]
          },
        ]
      }
      nordic_artwork_likes: {
        Row: {
          artwork_id: string | null
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          artwork_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          artwork_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nordic_artwork_likes_artwork_id_fkey"
            columns: ["artwork_id"]
            isOneToOne: false
            referencedRelation: "nordic_artwork"
            referencedColumns: ["id"]
          },
        ]
      }
      nordic_music: {
        Row: {
          artist: string
          audio_url: string | null
          created_at: string | null
          cultural_significance: string | null
          description: string
          historical_period: string | null
          id: string
          image_url: string | null
          instruments: string[] | null
          lyrics: string | null
          region: string
          search_vector: unknown | null
          slug: string | null
          title: string
          translations: Json | null
          type: string
        }
        Insert: {
          artist: string
          audio_url?: string | null
          created_at?: string | null
          cultural_significance?: string | null
          description: string
          historical_period?: string | null
          id?: string
          image_url?: string | null
          instruments?: string[] | null
          lyrics?: string | null
          region: string
          search_vector?: unknown | null
          slug?: string | null
          title: string
          translations?: Json | null
          type: string
        }
        Update: {
          artist?: string
          audio_url?: string | null
          created_at?: string | null
          cultural_significance?: string | null
          description?: string
          historical_period?: string | null
          id?: string
          image_url?: string | null
          instruments?: string[] | null
          lyrics?: string | null
          region?: string
          search_vector?: unknown | null
          slug?: string | null
          title?: string
          translations?: Json | null
          type?: string
        }
        Relationships: []
      }
      nordic_partnerships: {
        Row: {
          business_name: string
          commission_rate: number
          created_at: string | null
          cultural_authenticity_score: number | null
          description: string | null
          id: string
          is_active: boolean | null
          partnership_type: string
          products: string[] | null
          vendor_id: string | null
          website_url: string | null
        }
        Insert: {
          business_name: string
          commission_rate?: number
          created_at?: string | null
          cultural_authenticity_score?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          partnership_type: string
          products?: string[] | null
          vendor_id?: string | null
          website_url?: string | null
        }
        Update: {
          business_name?: string
          commission_rate?: number
          created_at?: string | null
          cultural_authenticity_score?: number | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          partnership_type?: string
          products?: string[] | null
          vendor_id?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nordic_partnerships_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      norse_names: {
        Row: {
          created_at: string | null
          gender: string | null
          historical_context: string | null
          id: string
          meaning: string | null
          name_part: string
          type: string | null
        }
        Insert: {
          created_at?: string | null
          gender?: string | null
          historical_context?: string | null
          id?: string
          meaning?: string | null
          name_part: string
          type?: string | null
        }
        Update: {
          created_at?: string | null
          gender?: string | null
          historical_context?: string | null
          id?: string
          meaning?: string | null
          name_part?: string
          type?: string | null
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          break_reminder_style: Json | null
          context_aware_settings: Json | null
          created_at: string | null
          cycle_notifications: Json | null
          exercise_reminders: Json | null
          focus_check_frequency: unknown | null
          id: string
          preferences: Json
          transition_reminders: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          break_reminder_style?: Json | null
          context_aware_settings?: Json | null
          created_at?: string | null
          cycle_notifications?: Json | null
          exercise_reminders?: Json | null
          focus_check_frequency?: unknown | null
          id?: string
          preferences?: Json
          transition_reminders?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          break_reminder_style?: Json | null
          context_aware_settings?: Json | null
          created_at?: string | null
          cycle_notifications?: Json | null
          exercise_reminders?: Json | null
          focus_check_frequency?: unknown | null
          id?: string
          preferences?: Json
          transition_reminders?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notification_queue: {
        Row: {
          content: string | null
          created_at: string | null
          device_token: string
          id: string
          notification_id: string | null
          sent_at: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          device_token: string
          id?: string
          notification_id?: string | null
          sent_at?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          device_token?: string
          id?: string
          notification_id?: string | null
          sent_at?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_queue_notification_id_fkey"
            columns: ["notification_id"]
            isOneToOne: false
            referencedRelation: "notifications"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          link: string | null
          title: string
          type: string
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          title: string
          type: string
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          title?: string
          type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      nrt_guide_steps: {
        Row: {
          created_at: string | null
          description: string
          id: string
          order_number: number
          product_type: string[] | null
          recommended_duration_days: number | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          order_number: number
          product_type?: string[] | null
          recommended_duration_days?: number | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          order_number?: number
          product_type?: string[] | null
          recommended_duration_days?: number | null
          title?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: string
          order_id: string
          price_at_time: number
          product_id: string
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          order_id: string
          price_at_time: number
          product_id: string
          quantity: number
        }
        Update: {
          created_at?: string
          id?: string
          order_id?: string
          price_at_time?: number
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          notes: string | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          order_id: string
          status: Database["public"]["Enums"]["order_status"]
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          notes?: string | null
          order_id?: string
          status?: Database["public"]["Enums"]["order_status"]
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: Json
          carrier: string | null
          created_at: string
          estimated_delivery: string | null
          fulfillment_notes: string | null
          fulfillment_status: string | null
          id: string
          payment_intent_id: string | null
          payment_status: string | null
          refund_status: string | null
          shipping_address: Json
          status: string
          total_amount: number
          tracking_number: string | null
          updated_at: string
          user_id: string
          vendor_id: string
        }
        Insert: {
          billing_address: Json
          carrier?: string | null
          created_at?: string
          estimated_delivery?: string | null
          fulfillment_notes?: string | null
          fulfillment_status?: string | null
          id?: string
          payment_intent_id?: string | null
          payment_status?: string | null
          refund_status?: string | null
          shipping_address: Json
          status?: string
          total_amount: number
          tracking_number?: string | null
          updated_at?: string
          user_id: string
          vendor_id: string
        }
        Update: {
          billing_address?: Json
          carrier?: string | null
          created_at?: string
          estimated_delivery?: string | null
          fulfillment_notes?: string | null
          fulfillment_status?: string | null
          id?: string
          payment_intent_id?: string | null
          payment_status?: string | null
          refund_status?: string | null
          shipping_address?: Json
          status?: string
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string
          user_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      package_purchases: {
        Row: {
          client_id: string | null
          created_at: string
          expires_at: string
          id: string
          package_id: string | null
          professional: Json | null
          professional_id: string | null
          professional_name: string | null
          sessions_remaining: number
          status: string
          total_amount: number
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          expires_at: string
          id?: string
          package_id?: string | null
          professional?: Json | null
          professional_id?: string | null
          professional_name?: string | null
          sessions_remaining: number
          status: string
          total_amount: number
        }
        Update: {
          client_id?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          package_id?: string | null
          professional?: Json | null
          professional_id?: string | null
          professional_name?: string | null
          sessions_remaining?: number
          status?: string
          total_amount?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_professional"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_purchases_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "consultation_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "package_purchases_professional_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      package_session_usage: {
        Row: {
          client_id: string | null
          created_at: string
          id: string
          notes: string | null
          package_purchase_id: string | null
          professional_id: string | null
          session_date: string
          status: string
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          package_purchase_id?: string | null
          professional_id?: string | null
          session_date: string
          status: string
        }
        Update: {
          client_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          package_purchase_id?: string | null
          professional_id?: string | null
          session_date?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_session_usage_package_purchase_id_fkey"
            columns: ["package_purchase_id"]
            isOneToOne: false
            referencedRelation: "package_purchases"
            referencedColumns: ["id"]
          },
        ]
      }
      parenting_resources: {
        Row: {
          activities: string[] | null
          age_group: string
          bible_references: string[] | null
          category: string
          content: string
          created_at: string | null
          devotional_content: string | null
          discussion_questions: string[] | null
          id: string
          practical_tips: string[] | null
          title: string
        }
        Insert: {
          activities?: string[] | null
          age_group: string
          bible_references?: string[] | null
          category: string
          content: string
          created_at?: string | null
          devotional_content?: string | null
          discussion_questions?: string[] | null
          id?: string
          practical_tips?: string[] | null
          title: string
        }
        Update: {
          activities?: string[] | null
          age_group?: string
          bible_references?: string[] | null
          category?: string
          content?: string
          created_at?: string | null
          devotional_content?: string | null
          discussion_questions?: string[] | null
          id?: string
          practical_tips?: string[] | null
          title?: string
        }
        Relationships: []
      }
      participant_screening_criteria: {
        Row: {
          created_at: string | null
          criteria_type: string
          criteria_value: Json
          id: string
          is_required: boolean | null
          project_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          criteria_type: string
          criteria_value: Json
          id?: string
          is_required?: boolean | null
          project_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          criteria_type?: string
          criteria_value?: Json
          id?: string
          is_required?: boolean | null
          project_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "participant_screening_criteria_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "research_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      participant_screening_responses: {
        Row: {
          criteria_id: string | null
          id: string
          meets_criteria: boolean | null
          notes: string | null
          participant_id: string | null
          response_value: Json
          screened_at: string | null
        }
        Insert: {
          criteria_id?: string | null
          id?: string
          meets_criteria?: boolean | null
          notes?: string | null
          participant_id?: string | null
          response_value: Json
          screened_at?: string | null
        }
        Update: {
          criteria_id?: string | null
          id?: string
          meets_criteria?: boolean | null
          notes?: string | null
          participant_id?: string | null
          response_value?: Json
          screened_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "participant_screening_responses_criteria_id_fkey"
            columns: ["criteria_id"]
            isOneToOne: false
            referencedRelation: "participant_screening_criteria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "participant_screening_responses_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "research_participants"
            referencedColumns: ["id"]
          },
        ]
      }
      participant_sessions: {
        Row: {
          created_at: string | null
          end_time: string | null
          id: string
          participant_id: string | null
          responses: Json | null
          screen_recording_url: string | null
          session_recording_url: string | null
          start_time: string | null
          study_id: string
          study_type: string
        }
        Insert: {
          created_at?: string | null
          end_time?: string | null
          id?: string
          participant_id?: string | null
          responses?: Json | null
          screen_recording_url?: string | null
          session_recording_url?: string | null
          start_time?: string | null
          study_id: string
          study_type: string
        }
        Update: {
          created_at?: string | null
          end_time?: string | null
          id?: string
          participant_id?: string | null
          responses?: Json | null
          screen_recording_url?: string | null
          session_recording_url?: string | null
          start_time?: string | null
          study_id?: string
          study_type?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          created_at: string
          expiry_month: number | null
          expiry_year: number | null
          id: string
          is_default: boolean | null
          last_four: string | null
          metadata: Json | null
          provider: string
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          expiry_month?: number | null
          expiry_year?: number | null
          id?: string
          is_default?: boolean | null
          last_four?: string | null
          metadata?: Json | null
          provider: string
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          expiry_month?: number | null
          expiry_year?: number | null
          id?: string
          is_default?: boolean | null
          last_four?: string | null
          metadata?: Json | null
          provider?: string
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      physical_product_comparisons: {
        Row: {
          compared_with_id: string | null
          created_at: string | null
          created_by: string | null
          feature_comparison: Json | null
          id: string
          material_differences: string[] | null
          price_difference: number | null
          product_id: string | null
          size_difference: Json | null
          weight_difference: number | null
        }
        Insert: {
          compared_with_id?: string | null
          created_at?: string | null
          created_by?: string | null
          feature_comparison?: Json | null
          id?: string
          material_differences?: string[] | null
          price_difference?: number | null
          product_id?: string | null
          size_difference?: Json | null
          weight_difference?: number | null
        }
        Update: {
          compared_with_id?: string | null
          created_at?: string | null
          created_by?: string | null
          feature_comparison?: Json | null
          id?: string
          material_differences?: string[] | null
          price_difference?: number | null
          product_id?: string | null
          size_difference?: Json | null
          weight_difference?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "physical_product_comparisons_compared_with_id_fkey"
            columns: ["compared_with_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "physical_product_comparisons_compared_with_id_fkey"
            columns: ["compared_with_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "physical_product_comparisons_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "physical_product_comparisons_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_day_verses: {
        Row: {
          book: string
          chapter: number
          created_at: string
          id: string
          plan_day_id: string
          verse_end: number
          verse_start: number
        }
        Insert: {
          book: string
          chapter: number
          created_at?: string
          id?: string
          plan_day_id: string
          verse_end: number
          verse_start: number
        }
        Update: {
          book?: string
          chapter?: number
          created_at?: string
          id?: string
          plan_day_id?: string
          verse_end?: number
          verse_start?: number
        }
        Relationships: [
          {
            foreignKeyName: "plan_day_verses_plan_day_id_fkey"
            columns: ["plan_day_id"]
            isOneToOne: false
            referencedRelation: "plan_days"
            referencedColumns: ["id"]
          },
        ]
      }
      plan_days: {
        Row: {
          created_at: string
          day_number: number
          description: string | null
          id: string
          plan_id: string
          title: string | null
        }
        Insert: {
          created_at?: string
          day_number: number
          description?: string | null
          id?: string
          plan_id: string
          title?: string | null
        }
        Update: {
          created_at?: string
          day_number?: number
          description?: string | null
          id?: string
          plan_id?: string
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "plan_days_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "reading_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_integrations: {
        Row: {
          access_token: string | null
          bot_token: string | null
          chat_id: string | null
          created_at: string | null
          error_logs: Json | null
          guild_id: string | null
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          platform_type: string
          refresh_token: string | null
          settings: Json | null
          sync_status: string | null
          updated_at: string | null
          vendor_id: string | null
          verification_status:
            | Database["public"]["Enums"]["integration_status"]
            | null
          webhook_url: string | null
        }
        Insert: {
          access_token?: string | null
          bot_token?: string | null
          chat_id?: string | null
          created_at?: string | null
          error_logs?: Json | null
          guild_id?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          platform_type: string
          refresh_token?: string | null
          settings?: Json | null
          sync_status?: string | null
          updated_at?: string | null
          vendor_id?: string | null
          verification_status?:
            | Database["public"]["Enums"]["integration_status"]
            | null
          webhook_url?: string | null
        }
        Update: {
          access_token?: string | null
          bot_token?: string | null
          chat_id?: string | null
          created_at?: string | null
          error_logs?: Json | null
          guild_id?: string | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          platform_type?: string
          refresh_token?: string | null
          settings?: Json | null
          sync_status?: string | null
          updated_at?: string | null
          vendor_id?: string | null
          verification_status?:
            | Database["public"]["Enums"]["integration_status"]
            | null
          webhook_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_integrations_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "seller_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_notification_settings: {
        Row: {
          created_at: string | null
          custom_settings: Json | null
          id: string
          notify_on_message: boolean | null
          notify_on_purchase: boolean | null
          notify_on_refund: boolean | null
          notify_on_review: boolean | null
          platform_integration_id: string | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          custom_settings?: Json | null
          id?: string
          notify_on_message?: boolean | null
          notify_on_purchase?: boolean | null
          notify_on_refund?: boolean | null
          notify_on_review?: boolean | null
          platform_integration_id?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          custom_settings?: Json | null
          id?: string
          notify_on_message?: boolean | null
          notify_on_purchase?: boolean | null
          notify_on_refund?: boolean | null
          notify_on_review?: boolean | null
          platform_integration_id?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "platform_notification_settings_platform_integration_id_fkey"
            columns: ["platform_integration_id"]
            isOneToOne: false
            referencedRelation: "platform_integrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "platform_notification_settings_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "seller_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      point_redemptions: {
        Row: {
          created_at: string | null
          discount_amount: number
          id: string
          order_id: string | null
          points_used: number
          user_id: string
          vendor_id: string
        }
        Insert: {
          created_at?: string | null
          discount_amount: number
          id?: string
          order_id?: string | null
          points_used: number
          user_id: string
          vendor_id: string
        }
        Update: {
          created_at?: string | null
          discount_amount?: number
          id?: string
          order_id?: string | null
          points_used?: number
          user_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "point_redemptions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      points_multipliers: {
        Row: {
          created_at: string | null
          id: string
          multiplier: number
          subscription_tier: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          multiplier?: number
          subscription_tier: string
        }
        Update: {
          created_at?: string | null
          id?: string
          multiplier?: number
          subscription_tier?: string
        }
        Relationships: []
      }
      prayer_group_members: {
        Row: {
          created_at: string | null
          group_id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          group_id: string
          role?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          group_id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prayer_group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "prayer_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_groups: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_private: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_private?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_private?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      prayer_items: {
        Row: {
          answered: boolean | null
          answered_at: string | null
          content: string
          created_at: string
          id: string
          list_id: string
        }
        Insert: {
          answered?: boolean | null
          answered_at?: string | null
          content: string
          created_at?: string
          id?: string
          list_id: string
        }
        Update: {
          answered?: boolean | null
          answered_at?: string | null
          content?: string
          created_at?: string
          id?: string
          list_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "prayer_items_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "prayer_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      prayer_journals: {
        Row: {
          ai_insights: string | null
          content: string
          created_at: string | null
          id: string
          prayer_themes: string[] | null
          sentiment: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_insights?: string | null
          content: string
          created_at?: string | null
          id?: string
          prayer_themes?: string[] | null
          sentiment?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_insights?: string | null
          content?: string
          created_at?: string | null
          id?: string
          prayer_themes?: string[] | null
          sentiment?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      prayer_lists: {
        Row: {
          created_at: string
          id: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      prayer_partners: {
        Row: {
          created_at: string
          id: string
          status: string
          updated_at: string
          user_id_1: string | null
          user_id_2: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id_1?: string | null
          user_id_2?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          updated_at?: string
          user_id_1?: string | null
          user_id_2?: string | null
        }
        Relationships: []
      }
      prayer_requests: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_anonymous: boolean | null
          is_private: boolean | null
          prayer_group_id: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_private?: boolean | null
          prayer_group_id?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          is_private?: boolean | null
          prayer_group_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      preference_test_responses: {
        Row: {
          completion_time: number | null
          created_at: string | null
          feedback: string | null
          id: string
          participant_id: string | null
          preferences: Json
          test_id: string | null
        }
        Insert: {
          completion_time?: number | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          participant_id?: string | null
          preferences: Json
          test_id?: string | null
        }
        Update: {
          completion_time?: number | null
          created_at?: string | null
          feedback?: string | null
          id?: string
          participant_id?: string | null
          preferences?: Json
          test_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "preference_test_responses_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "preference_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      preference_tests: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          questions: Json | null
          test_type: string
          title: string
          updated_at: string | null
          user_id: string | null
          variants: Json | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          questions?: Json | null
          test_type: string
          title: string
          updated_at?: string | null
          user_id?: string | null
          variants?: Json | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          questions?: Json | null
          test_type?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
          variants?: Json | null
        }
        Relationships: []
      }
      pregnancy_logs: {
        Row: {
          activity_type: string[] | null
          blood_pressure_diastolic: number | null
          blood_pressure_systolic: number | null
          created_at: string
          date: string
          energy_level: number | null
          exercise_minutes: number | null
          focus_level: number | null
          id: string
          mood_rating: number | null
          photo_url: string | null
          sleep_quality: number | null
          stress_level: number | null
          symptoms: string[] | null
          time_of_day: string | null
          user_id: string
          water_intake_ml: number | null
          weight_kg: number | null
          wellness_notes: string | null
        }
        Insert: {
          activity_type?: string[] | null
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          created_at?: string
          date?: string
          energy_level?: number | null
          exercise_minutes?: number | null
          focus_level?: number | null
          id?: string
          mood_rating?: number | null
          photo_url?: string | null
          sleep_quality?: number | null
          stress_level?: number | null
          symptoms?: string[] | null
          time_of_day?: string | null
          user_id: string
          water_intake_ml?: number | null
          weight_kg?: number | null
          wellness_notes?: string | null
        }
        Update: {
          activity_type?: string[] | null
          blood_pressure_diastolic?: number | null
          blood_pressure_systolic?: number | null
          created_at?: string
          date?: string
          energy_level?: number | null
          exercise_minutes?: number | null
          focus_level?: number | null
          id?: string
          mood_rating?: number | null
          photo_url?: string | null
          sleep_quality?: number | null
          stress_level?: number | null
          symptoms?: string[] | null
          time_of_day?: string | null
          user_id?: string
          water_intake_ml?: number | null
          weight_kg?: number | null
          wellness_notes?: string | null
        }
        Relationships: []
      }
      pregnancy_metrics: {
        Row: {
          category: string
          created_at: string | null
          id: string
          metadata: Json | null
          metric_category:
            | Database["public"]["Enums"]["pregnancy_metric_category"]
            | null
          metric_type: string
          notes: string | null
          photo_url: string | null
          recorded_at: string | null
          updated_at: string | null
          user_id: string | null
          value: number
          week_number: number | null
        }
        Insert: {
          category?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          metric_category?:
            | Database["public"]["Enums"]["pregnancy_metric_category"]
            | null
          metric_type: string
          notes?: string | null
          photo_url?: string | null
          recorded_at?: string | null
          updated_at?: string | null
          user_id?: string | null
          value: number
          week_number?: number | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          metric_category?:
            | Database["public"]["Enums"]["pregnancy_metric_category"]
            | null
          metric_type?: string
          notes?: string | null
          photo_url?: string | null
          recorded_at?: string | null
          updated_at?: string | null
          user_id?: string | null
          value?: number
          week_number?: number | null
        }
        Relationships: []
      }
      pregnancy_milestones: {
        Row: {
          achieved_at: string | null
          category: string | null
          celebration_shared: boolean | null
          created_at: string | null
          custom_title: string | null
          description: string | null
          id: string
          media_url: string | null
          metadata: Json | null
          milestone_type: string
          notes: string | null
          photo_urls: string[] | null
          suggested_week: number | null
          user_id: string
          week_number: number | null
        }
        Insert: {
          achieved_at?: string | null
          category?: string | null
          celebration_shared?: boolean | null
          created_at?: string | null
          custom_title?: string | null
          description?: string | null
          id?: string
          media_url?: string | null
          metadata?: Json | null
          milestone_type: string
          notes?: string | null
          photo_urls?: string[] | null
          suggested_week?: number | null
          user_id: string
          week_number?: number | null
        }
        Update: {
          achieved_at?: string | null
          category?: string | null
          celebration_shared?: boolean | null
          created_at?: string | null
          custom_title?: string | null
          description?: string | null
          id?: string
          media_url?: string | null
          metadata?: Json | null
          milestone_type?: string
          notes?: string | null
          photo_urls?: string[] | null
          suggested_week?: number | null
          user_id?: string
          week_number?: number | null
        }
        Relationships: []
      }
      pregnancy_recommendations: {
        Row: {
          acted_on: boolean | null
          category: string
          created_at: string
          description: string
          id: string
          priority: number | null
          title: string
          user_id: string
          week_number: number | null
        }
        Insert: {
          acted_on?: boolean | null
          category: string
          created_at?: string
          description: string
          id?: string
          priority?: number | null
          title: string
          user_id: string
          week_number?: number | null
        }
        Update: {
          acted_on?: boolean | null
          category?: string
          created_at?: string
          description?: string
          id?: string
          priority?: number | null
          title?: string
          user_id?: string
          week_number?: number | null
        }
        Relationships: []
      }
      pregnancy_reminders: {
        Row: {
          created_at: string
          days_of_week: string[] | null
          id: string
          is_active: boolean | null
          time_of_day: string | null
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          days_of_week?: string[] | null
          id?: string
          is_active?: boolean | null
          time_of_day?: string | null
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          days_of_week?: string[] | null
          id?: string
          is_active?: boolean | null
          time_of_day?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      pregnancy_tracking: {
        Row: {
          conception_date: string | null
          created_at: string
          current_stage: Database["public"]["Enums"]["pregnancy_stage"]
          due_date: string
          energy_preferences: Json | null
          energy_support_needed: boolean | null
          focus_support_needed: boolean | null
          healthcare_provider: string | null
          id: string
          is_high_risk: boolean | null
          last_period_date: string | null
          notes: string | null
          updated_at: string
          user_id: string
          wellness_goals: string[] | null
        }
        Insert: {
          conception_date?: string | null
          created_at?: string
          current_stage: Database["public"]["Enums"]["pregnancy_stage"]
          due_date: string
          energy_preferences?: Json | null
          energy_support_needed?: boolean | null
          focus_support_needed?: boolean | null
          healthcare_provider?: string | null
          id?: string
          is_high_risk?: boolean | null
          last_period_date?: string | null
          notes?: string | null
          updated_at?: string
          user_id: string
          wellness_goals?: string[] | null
        }
        Update: {
          conception_date?: string | null
          created_at?: string
          current_stage?: Database["public"]["Enums"]["pregnancy_stage"]
          due_date?: string
          energy_preferences?: Json | null
          energy_support_needed?: boolean | null
          focus_support_needed?: boolean | null
          healthcare_provider?: string | null
          id?: string
          is_high_risk?: boolean | null
          last_period_date?: string | null
          notes?: string | null
          updated_at?: string
          user_id?: string
          wellness_goals?: string[] | null
        }
        Relationships: []
      }
      pregnancy_weekly_info: {
        Row: {
          baby_size_comparison: string | null
          common_symptoms: string[] | null
          created_at: string
          development_highlights: string[] | null
          id: string
          nutrition_tips: string[] | null
          todo_checklist: string[] | null
          week_number: number
        }
        Insert: {
          baby_size_comparison?: string | null
          common_symptoms?: string[] | null
          created_at?: string
          development_highlights?: string[] | null
          id?: string
          nutrition_tips?: string[] | null
          todo_checklist?: string[] | null
          week_number: number
        }
        Update: {
          baby_size_comparison?: string | null
          common_symptoms?: string[] | null
          created_at?: string
          development_highlights?: string[] | null
          id?: string
          nutrition_tips?: string[] | null
          todo_checklist?: string[] | null
          week_number?: number
        }
        Relationships: []
      }
      pregnancy_wellness_correlations: {
        Row: {
          activity_impact: Json | null
          created_at: string | null
          date: string | null
          energy_pattern:
            | Database["public"]["CompositeTypes"]["pattern_summary"]
            | null
          focus_pattern:
            | Database["public"]["CompositeTypes"]["pattern_summary"]
            | null
          id: string
          nutrition_impact: Json | null
          sleep_pattern:
            | Database["public"]["CompositeTypes"]["pattern_summary"]
            | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activity_impact?: Json | null
          created_at?: string | null
          date?: string | null
          energy_pattern?:
            | Database["public"]["CompositeTypes"]["pattern_summary"]
            | null
          focus_pattern?:
            | Database["public"]["CompositeTypes"]["pattern_summary"]
            | null
          id?: string
          nutrition_impact?: Json | null
          sleep_pattern?:
            | Database["public"]["CompositeTypes"]["pattern_summary"]
            | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activity_impact?: Json | null
          created_at?: string | null
          date?: string | null
          energy_pattern?:
            | Database["public"]["CompositeTypes"]["pattern_summary"]
            | null
          focus_pattern?:
            | Database["public"]["CompositeTypes"]["pattern_summary"]
            | null
          id?: string
          nutrition_impact?: Json | null
          sleep_pattern?:
            | Database["public"]["CompositeTypes"]["pattern_summary"]
            | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      premium_features: {
        Row: {
          access_level: string
          created_at: string | null
          expires_at: string | null
          feature_name: string
          granted_at: string | null
          id: string
          is_active: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          access_level: string
          created_at?: string | null
          expires_at?: string | null
          feature_name: string
          granted_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          access_level?: string
          created_at?: string | null
          expires_at?: string | null
          feature_name?: string
          granted_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      premium_nordic_content: {
        Row: {
          access_level: string
          author_id: string | null
          content_type: string
          content_url: string | null
          created_at: string | null
          cultural_tags: string[] | null
          description: string | null
          id: string
          preview_content: string | null
          price: number
          title: string
        }
        Insert: {
          access_level?: string
          author_id?: string | null
          content_type: string
          content_url?: string | null
          created_at?: string | null
          cultural_tags?: string[] | null
          description?: string | null
          id?: string
          preview_content?: string | null
          price: number
          title: string
        }
        Update: {
          access_level?: string
          author_id?: string | null
          content_type?: string
          content_url?: string | null
          created_at?: string | null
          cultural_tags?: string[] | null
          description?: string | null
          id?: string
          preview_content?: string | null
          price?: number
          title?: string
        }
        Relationships: []
      }
      premium_subscriptions: {
        Row: {
          created_at: string | null
          ends_at: string | null
          id: string
          is_active: boolean | null
          payment_id: string | null
          payment_provider: string | null
          price: number
          starts_at: string
          subscription_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          payment_id?: string | null
          payment_provider?: string | null
          price: number
          starts_at?: string
          subscription_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          ends_at?: string | null
          id?: string
          is_active?: boolean | null
          payment_id?: string | null
          payment_provider?: string | null
          price?: number
          starts_at?: string
          subscription_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      prescribed_charge_recipes: {
        Row: {
          activities: Json[]
          client_id: string | null
          created_at: string
          description: string | null
          duration_days: number | null
          id: string
          prescription_date: string | null
          professional_id: string | null
          schedule: Json
          status: string | null
          title: string
        }
        Insert: {
          activities: Json[]
          client_id?: string | null
          created_at?: string
          description?: string | null
          duration_days?: number | null
          id?: string
          prescription_date?: string | null
          professional_id?: string | null
          schedule: Json
          status?: string | null
          title: string
        }
        Update: {
          activities?: Json[]
          client_id?: string | null
          created_at?: string
          description?: string | null
          duration_days?: number | null
          id?: string
          prescription_date?: string | null
          professional_id?: string | null
          schedule?: Json
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "prescribed_charge_recipes_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "mental_health_professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      price_alerts: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          notification_sent: boolean | null
          product_id: string
          target_price: number
          triggered_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          notification_sent?: boolean | null
          product_id: string
          target_price: number
          triggered_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          notification_sent?: boolean | null
          product_id?: string
          target_price?: number
          triggered_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      price_history: {
        Row: {
          currency: string | null
          id: string
          price: number
          product_id: string | null
          recorded_at: string | null
        }
        Insert: {
          currency?: string | null
          id?: string
          price: number
          product_id?: string | null
          recorded_at?: string | null
        }
        Update: {
          currency?: string | null
          id?: string
          price?: number
          product_id?: string | null
          recorded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "price_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "price_history_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_ai_insights: {
        Row: {
          created_at: string | null
          id: string
          key_features: string[] | null
          product_id: string | null
          similar_products: string[] | null
          summary: string | null
          target_audience: string[] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          key_features?: string[] | null
          product_id?: string | null
          similar_products?: string[] | null
          summary?: string | null
          target_audience?: string[] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          key_features?: string[] | null
          product_id?: string | null
          similar_products?: string[] | null
          summary?: string | null
          target_audience?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_ai_insights_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_ai_insights_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_analytics: {
        Row: {
          created_at: string | null
          engagement_score: number | null
          id: string
          last_viewed_at: string | null
          product_id: string | null
          updated_at: string | null
          user_id: string | null
          view_count: number | null
        }
        Insert: {
          created_at?: string | null
          engagement_score?: number | null
          id?: string
          last_viewed_at?: string | null
          product_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
        }
        Update: {
          created_at?: string | null
          engagement_score?: number | null
          id?: string
          last_viewed_at?: string | null
          product_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_analytics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_analytics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_analytics_aggregated: {
        Row: {
          affiliate_clicks_count: number | null
          avg_price: number | null
          conversion_rate: number | null
          created_at: string | null
          date: string
          id: string
          price_alert_count: number | null
          product_id: string
          views_count: number | null
          wishlist_adds_count: number | null
        }
        Insert: {
          affiliate_clicks_count?: number | null
          avg_price?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          date: string
          id?: string
          price_alert_count?: number | null
          product_id: string
          views_count?: number | null
          wishlist_adds_count?: number | null
        }
        Update: {
          affiliate_clicks_count?: number | null
          avg_price?: number | null
          conversion_rate?: number | null
          created_at?: string | null
          date?: string
          id?: string
          price_alert_count?: number | null
          product_id?: string
          views_count?: number | null
          wishlist_adds_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_analytics_aggregated_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_analytics_aggregated_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_analytics_ai: {
        Row: {
          created_at: string | null
          customer_segments: Json | null
          id: string
          inventory_forecast: Json | null
          performance_prediction: Json | null
          price_optimization: Json | null
          product_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_segments?: Json | null
          id?: string
          inventory_forecast?: Json | null
          performance_prediction?: Json | null
          price_optimization?: Json | null
          product_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_segments?: Json | null
          id?: string
          inventory_forecast?: Json | null
          performance_prediction?: Json | null
          price_optimization?: Json | null
          product_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_analytics_ai_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_analytics_ai_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_availability: {
        Row: {
          commission_rate: number | null
          created_at: string | null
          id: string
          in_stock: boolean | null
          price: number
          product_id: string | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          in_stock?: boolean | null
          price: number
          product_id?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          commission_rate?: number | null
          created_at?: string | null
          id?: string
          in_stock?: boolean | null
          price?: number
          product_id?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_availability_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_availability_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_availability_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      product_badges: {
        Row: {
          awarded_at: string | null
          badge_type: string
          created_at: string | null
          expires_at: string | null
          id: string
          product_id: string | null
        }
        Insert: {
          awarded_at?: string | null
          badge_type: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          product_id?: string | null
        }
        Update: {
          awarded_at?: string | null
          badge_type?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_badges_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_badges_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon_url: string | null
          id: string
          name: string
          parent_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          name: string
          parent_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories_mapping: {
        Row: {
          category_id: string
          product_id: string
        }
        Insert: {
          category_id: string
          product_id: string
        }
        Update: {
          category_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_categories_mapping_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "vendor_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_categories_mapping_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_categories_mapping_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_category_mappings: {
        Row: {
          category_id: string
          product_id: string
        }
        Insert: {
          category_id: string
          product_id: string
        }
        Update: {
          category_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_category_mappings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_category_mappings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_category_mappings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_comparisons: {
        Row: {
          compared_with_id: string | null
          comparison_data: Json
          created_at: string | null
          created_by: string | null
          id: string
          product_id: string | null
        }
        Insert: {
          compared_with_id?: string | null
          comparison_data: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          product_id?: string | null
        }
        Update: {
          compared_with_id?: string | null
          comparison_data?: Json
          created_at?: string | null
          created_by?: string | null
          id?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_comparisons_compared_with_id_fkey"
            columns: ["compared_with_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_comparisons_compared_with_id_fkey"
            columns: ["compared_with_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_comparisons_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_comparisons_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_discussions: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_pinned: boolean | null
          product_id: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          product_id?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_pinned?: boolean | null
          product_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_discussions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_discussions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_ease_tags: {
        Row: {
          created_at: string
          ease_tag_id: string | null
          id: string
          product_id: string | null
        }
        Insert: {
          created_at?: string
          ease_tag_id?: string | null
          id?: string
          product_id?: string | null
        }
        Update: {
          created_at?: string
          ease_tag_id?: string | null
          id?: string
          product_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_ease_tags_ease_tag_id_fkey"
            columns: ["ease_tag_id"]
            isOneToOne: false
            referencedRelation: "ease_tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_ease_tags_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_ease_tags_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_engagement: {
        Row: {
          click_path: Json | null
          created_at: string | null
          engagement_type: string
          id: string
          product_id: string | null
          session_duration: number | null
          user_id: string | null
        }
        Insert: {
          click_path?: Json | null
          created_at?: string | null
          engagement_type: string
          id?: string
          product_id?: string | null
          session_duration?: number | null
          user_id?: string | null
        }
        Update: {
          click_path?: Json | null
          created_at?: string | null
          engagement_type?: string
          id?: string
          product_id?: string | null
          session_duration?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_engagement_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_engagement_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_feedback: {
        Row: {
          actual_behavior: string | null
          affected_users: string[] | null
          assigned_to: string | null
          attachments: string[] | null
          created_at: string
          description: string
          device_info: Json | null
          due_date: string | null
          expected_behavior: string | null
          id: string
          impact_area: string[] | null
          labels: string[] | null
          priority: Database["public"]["Enums"]["feedback_priority"]
          product_id: string | null
          product_version: string | null
          related_feedback: string[] | null
          reproduction_steps: string | null
          resolution_notes: string | null
          satisfaction_score: number | null
          status: Database["public"]["Enums"]["feedback_status"]
          tags: string[] | null
          title: string
          type: Database["public"]["Enums"]["feedback_type"]
          updated_at: string
          upvotes_count: number
          user_id: string | null
          user_role: string | null
          visibility: string
        }
        Insert: {
          actual_behavior?: string | null
          affected_users?: string[] | null
          assigned_to?: string | null
          attachments?: string[] | null
          created_at?: string
          description: string
          device_info?: Json | null
          due_date?: string | null
          expected_behavior?: string | null
          id?: string
          impact_area?: string[] | null
          labels?: string[] | null
          priority?: Database["public"]["Enums"]["feedback_priority"]
          product_id?: string | null
          product_version?: string | null
          related_feedback?: string[] | null
          reproduction_steps?: string | null
          resolution_notes?: string | null
          satisfaction_score?: number | null
          status?: Database["public"]["Enums"]["feedback_status"]
          tags?: string[] | null
          title: string
          type?: Database["public"]["Enums"]["feedback_type"]
          updated_at?: string
          upvotes_count?: number
          user_id?: string | null
          user_role?: string | null
          visibility?: string
        }
        Update: {
          actual_behavior?: string | null
          affected_users?: string[] | null
          assigned_to?: string | null
          attachments?: string[] | null
          created_at?: string
          description?: string
          device_info?: Json | null
          due_date?: string | null
          expected_behavior?: string | null
          id?: string
          impact_area?: string[] | null
          labels?: string[] | null
          priority?: Database["public"]["Enums"]["feedback_priority"]
          product_id?: string | null
          product_version?: string | null
          related_feedback?: string[] | null
          reproduction_steps?: string | null
          resolution_notes?: string | null
          satisfaction_score?: number | null
          status?: Database["public"]["Enums"]["feedback_status"]
          tags?: string[] | null
          title?: string
          type?: Database["public"]["Enums"]["feedback_type"]
          updated_at?: string
          upvotes_count?: number
          user_id?: string | null
          user_role?: string | null
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_feedback_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_feedback_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_feedback_analytics: {
        Row: {
          average_resolution_time_hours: number | null
          created_at: string
          id: string
          open_issues_count: number
          product_id: string | null
          resolved_issues_count: number
          top_requested_features: string[] | null
          total_feedback_count: number
          updated_at: string
        }
        Insert: {
          average_resolution_time_hours?: number | null
          created_at?: string
          id?: string
          open_issues_count?: number
          product_id?: string | null
          resolved_issues_count?: number
          top_requested_features?: string[] | null
          total_feedback_count?: number
          updated_at?: string
        }
        Update: {
          average_resolution_time_hours?: number | null
          created_at?: string
          id?: string
          open_issues_count?: number
          product_id?: string | null
          resolved_issues_count?: number
          top_requested_features?: string[] | null
          total_feedback_count?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_feedback_analytics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_feedback_analytics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_feedback_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          parent_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_feedback_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "product_feedback_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      product_feedback_category_assignments: {
        Row: {
          category_id: string
          created_at: string | null
          feedback_id: string
        }
        Insert: {
          category_id: string
          created_at?: string | null
          feedback_id: string
        }
        Update: {
          category_id?: string
          created_at?: string | null
          feedback_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_feedback_category_assignments_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "product_feedback_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_feedback_category_assignments_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "product_feedback"
            referencedColumns: ["id"]
          },
        ]
      }
      product_feedback_changelog: {
        Row: {
          created_at: string | null
          feedback_id: string | null
          field_name: string
          id: string
          new_value: string | null
          old_value: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          feedback_id?: string | null
          field_name: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          feedback_id?: string | null
          field_name?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_feedback_changelog_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "product_feedback"
            referencedColumns: ["id"]
          },
        ]
      }
      product_feedback_comments: {
        Row: {
          content: string
          created_at: string
          feedback_id: string | null
          id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          feedback_id?: string | null
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          feedback_id?: string | null
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_feedback_comments_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "product_feedback"
            referencedColumns: ["id"]
          },
        ]
      }
      product_feedback_custom_field_values: {
        Row: {
          created_at: string | null
          feedback_id: string | null
          field_id: string | null
          id: string
          value: string | null
        }
        Insert: {
          created_at?: string | null
          feedback_id?: string | null
          field_id?: string | null
          id?: string
          value?: string | null
        }
        Update: {
          created_at?: string | null
          feedback_id?: string | null
          field_id?: string | null
          id?: string
          value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_feedback_custom_field_values_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "product_feedback"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_feedback_custom_field_values_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "product_feedback_custom_fields"
            referencedColumns: ["id"]
          },
        ]
      }
      product_feedback_custom_fields: {
        Row: {
          created_at: string | null
          field_name: string
          field_type: string
          id: string
          options: Json | null
          product_id: string | null
          required: boolean | null
        }
        Insert: {
          created_at?: string | null
          field_name: string
          field_type: string
          id?: string
          options?: Json | null
          product_id?: string | null
          required?: boolean | null
        }
        Update: {
          created_at?: string | null
          field_name?: string
          field_type?: string
          id?: string
          options?: Json | null
          product_id?: string | null
          required?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "product_feedback_custom_fields_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_feedback_custom_fields_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_feedback_subscriptions: {
        Row: {
          created_at: string | null
          feedback_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          feedback_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          feedback_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_feedback_subscriptions_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "product_feedback"
            referencedColumns: ["id"]
          },
        ]
      }
      product_feedback_upvotes: {
        Row: {
          created_at: string
          feedback_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          feedback_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          feedback_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_feedback_upvotes_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "product_feedback"
            referencedColumns: ["id"]
          },
        ]
      }
      product_feedback_vote_history: {
        Row: {
          created_at: string | null
          feedback_id: string | null
          id: string
          user_id: string | null
          vote_type: string
        }
        Insert: {
          created_at?: string | null
          feedback_id?: string | null
          id?: string
          user_id?: string | null
          vote_type: string
        }
        Update: {
          created_at?: string | null
          feedback_id?: string | null
          id?: string
          user_id?: string | null
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_feedback_vote_history_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "product_feedback"
            referencedColumns: ["id"]
          },
        ]
      }
      product_measurements: {
        Row: {
          created_at: string | null
          id: string
          measurement_type: string
          notes: string | null
          product_id: string | null
          unit: string
          value: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          measurement_type: string
          notes?: string | null
          product_id?: string | null
          unit: string
          value: number
        }
        Update: {
          created_at?: string | null
          id?: string
          measurement_type?: string
          notes?: string | null
          product_id?: string | null
          unit?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_measurements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_measurements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_retail_availability: {
        Row: {
          id: string
          in_stock: boolean | null
          last_updated: string | null
          location_id: string | null
          price: number
          product_id: string | null
          stock_quantity: number | null
        }
        Insert: {
          id?: string
          in_stock?: boolean | null
          last_updated?: string | null
          location_id?: string | null
          price: number
          product_id?: string | null
          stock_quantity?: number | null
        }
        Update: {
          id?: string
          in_stock?: boolean | null
          last_updated?: string | null
          location_id?: string | null
          price?: number
          product_id?: string | null
          stock_quantity?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_retail_availability_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "retail_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_retail_availability_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_retail_availability_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          cons: string[] | null
          content: string | null
          created_at: string | null
          helpful_count: number | null
          id: string
          not_helpful_count: number | null
          product_id: string | null
          pros: string[] | null
          rating: number
          review_type: Database["public"]["Enums"]["review_type"] | null
          title: string
          updated_at: string | null
          usage_period: string | null
          user_id: string | null
          verified_purchase: boolean | null
          would_recommend: boolean | null
        }
        Insert: {
          cons?: string[] | null
          content?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          not_helpful_count?: number | null
          product_id?: string | null
          pros?: string[] | null
          rating: number
          review_type?: Database["public"]["Enums"]["review_type"] | null
          title: string
          updated_at?: string | null
          usage_period?: string | null
          user_id?: string | null
          verified_purchase?: boolean | null
          would_recommend?: boolean | null
        }
        Update: {
          cons?: string[] | null
          content?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          not_helpful_count?: number | null
          product_id?: string | null
          pros?: string[] | null
          rating?: number
          review_type?: Database["public"]["Enums"]["review_type"] | null
          title?: string
          updated_at?: string | null
          usage_period?: string | null
          user_id?: string | null
          verified_purchase?: boolean | null
          would_recommend?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_sales: {
        Row: {
          amount: number
          buyer_id: string | null
          created_at: string | null
          id: string
          payment_status: string | null
          platform_fee: number
          product_id: string | null
          refund_status: string | null
          sale_type: string
          seller_id: string | null
          seller_payout: number
        }
        Insert: {
          amount: number
          buyer_id?: string | null
          created_at?: string | null
          id?: string
          payment_status?: string | null
          platform_fee: number
          product_id?: string | null
          refund_status?: string | null
          sale_type: string
          seller_id?: string | null
          seller_payout: number
        }
        Update: {
          amount?: number
          buyer_id?: string | null
          created_at?: string | null
          id?: string
          payment_status?: string | null
          platform_fee?: number
          product_id?: string | null
          refund_status?: string | null
          sale_type?: string
          seller_id?: string | null
          seller_payout?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_sales_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_subscriptions: {
        Row: {
          created_at: string | null
          ends_at: string | null
          id: string
          last_billing_date: string | null
          next_billing_date: string | null
          payment_method: Json | null
          product_id: string | null
          renewal_price: number
          started_at: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          ends_at?: string | null
          id?: string
          last_billing_date?: string | null
          next_billing_date?: string | null
          payment_method?: Json | null
          product_id?: string | null
          renewal_price: number
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          ends_at?: string | null
          id?: string
          last_billing_date?: string | null
          next_billing_date?: string | null
          payment_method?: Json | null
          product_id?: string | null
          renewal_price?: number
          started_at?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_subscriptions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_subscriptions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_topics: {
        Row: {
          product_id: string
          topic_id: string
        }
        Insert: {
          product_id: string
          topic_id: string
        }
        Update: {
          product_id?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_topics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_topics_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_topics_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      product_updates: {
        Row: {
          content: string
          created_at: string | null
          id: string
          product_id: string | null
          title: string
          update_type: string | null
          updated_at: string | null
          version: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          product_id?: string | null
          title: string
          update_type?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          product_id?: string | null
          title?: string
          update_type?: string | null
          updated_at?: string | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_updates_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_updates_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_verifications: {
        Row: {
          created_at: string | null
          evidence_urls: string[] | null
          id: string
          product_id: string | null
          verification_details: Json | null
          verification_type: string
          verified_by: string | null
        }
        Insert: {
          created_at?: string | null
          evidence_urls?: string[] | null
          id?: string
          product_id?: string | null
          verification_details?: Json | null
          verification_type: string
          verified_by?: string | null
        }
        Update: {
          created_at?: string | null
          evidence_urls?: string[] | null
          id?: string
          product_id?: string | null
          verification_details?: Json | null
          verification_type?: string
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_verifications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "product_verifications_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      productivity_metrics: {
        Row: {
          created_at: string | null
          date: string
          distractions_blocked: number | null
          focus_duration: number | null
          focus_sessions: number | null
          id: string
          productivity_score: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date?: string
          distractions_blocked?: number | null
          focus_duration?: number | null
          focus_sessions?: number | null
          id?: string
          productivity_score?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          distractions_blocked?: number | null
          focus_duration?: number | null
          focus_sessions?: number | null
          id?: string
          productivity_score?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          access_instructions: string | null
          amazon_link: string | null
          amazon_price: number | null
          assembly_required: boolean | null
          assembly_time_minutes: number | null
          authenticity_verified: boolean | null
          brand: string
          care_instructions: string[] | null
          category: string | null
          certifications: string[] | null
          chemicals: string[] | null
          comments_count: number | null
          condition: string | null
          contraindications: string[] | null
          cost_price: number | null
          country_of_origin: string | null
          created_at: string | null
          demo_url: string | null
          description: string | null
          digital_category:
            | Database["public"]["Enums"]["digital_product_category"]
            | null
          dimensions: Json | null
          eco_friendly_packaging: boolean | null
          featured_date: string | null
          featured_score: number | null
          features: Json | null
          flavor: string
          health_warnings: string[] | null
          id: string
          image_url: string | null
          images: string[] | null
          is_featured: boolean | null
          is_launched: boolean | null
          is_nicotine_product: boolean | null
          is_nrt_certified: boolean
          is_published: boolean | null
          launch_date: string | null
          maker_id: string | null
          materials: string[] | null
          media_gallery: Json[] | null
          min_subscription_period: string | null
          name: string
          nicotine_content: number | null
          one_time_price: number | null
          package_dimensions: Json | null
          price: number | null
          product_type: string
          recurring_revenue: number | null
          refund_policy: string | null
          release_date: string | null
          requires_age_verification: boolean | null
          retail_availability: Json | null
          risk_level: Database["public"]["Enums"]["risk_level"]
          sales_count: number | null
          search_vector: unknown | null
          searchable_text: unknown | null
          shipping_restrictions: string[] | null
          shipping_weight_grams: number | null
          size_reference: Json | null
          stock: number | null
          strength: Database["public"]["Enums"]["strength_level"]
          subscription_price: number | null
          support_email: string | null
          tags: string[] | null
          technical_requirements: Json | null
          updated_at: string | null
          upvotes_count: number | null
          vendor_id: string | null
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
          version: string | null
          warranty_info: Json | null
          weight_grams: number | null
          wholesale_price: number | null
        }
        Insert: {
          access_instructions?: string | null
          amazon_link?: string | null
          amazon_price?: number | null
          assembly_required?: boolean | null
          assembly_time_minutes?: number | null
          authenticity_verified?: boolean | null
          brand?: string
          care_instructions?: string[] | null
          category?: string | null
          certifications?: string[] | null
          chemicals?: string[] | null
          comments_count?: number | null
          condition?: string | null
          contraindications?: string[] | null
          cost_price?: number | null
          country_of_origin?: string | null
          created_at?: string | null
          demo_url?: string | null
          description?: string | null
          digital_category?:
            | Database["public"]["Enums"]["digital_product_category"]
            | null
          dimensions?: Json | null
          eco_friendly_packaging?: boolean | null
          featured_date?: string | null
          featured_score?: number | null
          features?: Json | null
          flavor: string
          health_warnings?: string[] | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          is_featured?: boolean | null
          is_launched?: boolean | null
          is_nicotine_product?: boolean | null
          is_nrt_certified?: boolean
          is_published?: boolean | null
          launch_date?: string | null
          maker_id?: string | null
          materials?: string[] | null
          media_gallery?: Json[] | null
          min_subscription_period?: string | null
          name: string
          nicotine_content?: number | null
          one_time_price?: number | null
          package_dimensions?: Json | null
          price?: number | null
          product_type?: string
          recurring_revenue?: number | null
          refund_policy?: string | null
          release_date?: string | null
          requires_age_verification?: boolean | null
          retail_availability?: Json | null
          risk_level: Database["public"]["Enums"]["risk_level"]
          sales_count?: number | null
          search_vector?: unknown | null
          searchable_text?: unknown | null
          shipping_restrictions?: string[] | null
          shipping_weight_grams?: number | null
          size_reference?: Json | null
          stock?: number | null
          strength: Database["public"]["Enums"]["strength_level"]
          subscription_price?: number | null
          support_email?: string | null
          tags?: string[] | null
          technical_requirements?: Json | null
          updated_at?: string | null
          upvotes_count?: number | null
          vendor_id?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          version?: string | null
          warranty_info?: Json | null
          weight_grams?: number | null
          wholesale_price?: number | null
        }
        Update: {
          access_instructions?: string | null
          amazon_link?: string | null
          amazon_price?: number | null
          assembly_required?: boolean | null
          assembly_time_minutes?: number | null
          authenticity_verified?: boolean | null
          brand?: string
          care_instructions?: string[] | null
          category?: string | null
          certifications?: string[] | null
          chemicals?: string[] | null
          comments_count?: number | null
          condition?: string | null
          contraindications?: string[] | null
          cost_price?: number | null
          country_of_origin?: string | null
          created_at?: string | null
          demo_url?: string | null
          description?: string | null
          digital_category?:
            | Database["public"]["Enums"]["digital_product_category"]
            | null
          dimensions?: Json | null
          eco_friendly_packaging?: boolean | null
          featured_date?: string | null
          featured_score?: number | null
          features?: Json | null
          flavor?: string
          health_warnings?: string[] | null
          id?: string
          image_url?: string | null
          images?: string[] | null
          is_featured?: boolean | null
          is_launched?: boolean | null
          is_nicotine_product?: boolean | null
          is_nrt_certified?: boolean
          is_published?: boolean | null
          launch_date?: string | null
          maker_id?: string | null
          materials?: string[] | null
          media_gallery?: Json[] | null
          min_subscription_period?: string | null
          name?: string
          nicotine_content?: number | null
          one_time_price?: number | null
          package_dimensions?: Json | null
          price?: number | null
          product_type?: string
          recurring_revenue?: number | null
          refund_policy?: string | null
          release_date?: string | null
          requires_age_verification?: boolean | null
          retail_availability?: Json | null
          risk_level?: Database["public"]["Enums"]["risk_level"]
          sales_count?: number | null
          search_vector?: unknown | null
          searchable_text?: unknown | null
          shipping_restrictions?: string[] | null
          shipping_weight_grams?: number | null
          size_reference?: Json | null
          stock?: number | null
          strength?: Database["public"]["Enums"]["strength_level"]
          subscription_price?: number | null
          support_email?: string | null
          tags?: string[] | null
          technical_requirements?: Json | null
          updated_at?: string | null
          upvotes_count?: number | null
          vendor_id?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          version?: string | null
          warranty_info?: Json | null
          weight_grams?: number | null
          wholesale_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_maker_id_fkey"
            columns: ["maker_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_analytics: {
        Row: {
          average_rating: number | null
          completed_sessions: number | null
          id: string
          professional_id: string | null
          total_clients: number | null
          total_revenue: number | null
          total_sessions: number | null
          updated_at: string | null
        }
        Insert: {
          average_rating?: number | null
          completed_sessions?: number | null
          id?: string
          professional_id?: string | null
          total_clients?: number | null
          total_revenue?: number | null
          total_sessions?: number | null
          updated_at?: string | null
        }
        Update: {
          average_rating?: number | null
          completed_sessions?: number | null
          id?: string
          professional_id?: string | null
          total_clients?: number | null
          total_revenue?: number | null
          total_sessions?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      professional_availability: {
        Row: {
          created_at: string | null
          day_of_week: number | null
          end_time: string
          id: string
          is_available: boolean | null
          professional_id: string | null
          start_time: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          day_of_week?: number | null
          end_time: string
          id?: string
          is_available?: boolean | null
          professional_id?: string | null
          start_time: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          day_of_week?: number | null
          end_time?: string
          id?: string
          is_available?: boolean | null
          professional_id?: string | null
          start_time?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      professional_certifications: {
        Row: {
          certification_type: string
          created_at: string | null
          expiry_date: string | null
          id: string
          issued_date: string
          issuing_authority: string
          user_id: string | null
          verification_url: string | null
        }
        Insert: {
          certification_type: string
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          issued_date: string
          issuing_authority: string
          user_id?: string | null
          verification_url?: string | null
        }
        Update: {
          certification_type?: string
          created_at?: string | null
          expiry_date?: string | null
          id?: string
          issued_date?: string
          issuing_authority?: string
          user_id?: string | null
          verification_url?: string | null
        }
        Relationships: []
      }
      professional_resources: {
        Row: {
          category: string
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          is_public: boolean | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_public?: boolean | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          is_public?: boolean | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      professional_scheduling_rules: {
        Row: {
          buffer_minutes: number
          created_at: string | null
          id: string
          max_daily_sessions: number
          notification_preferences: Json | null
          professional_id: string | null
          session_duration_minutes: number
          updated_at: string | null
        }
        Insert: {
          buffer_minutes?: number
          created_at?: string | null
          id?: string
          max_daily_sessions?: number
          notification_preferences?: Json | null
          professional_id?: string | null
          session_duration_minutes?: number
          updated_at?: string | null
        }
        Update: {
          buffer_minutes?: number
          created_at?: string | null
          id?: string
          max_daily_sessions?: number
          notification_preferences?: Json | null
          professional_id?: string | null
          session_duration_minutes?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "professional_scheduling_rules_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      professional_specialties: {
        Row: {
          certifications: string[] | null
          created_at: string | null
          expertise_level: string
          id: string
          professional_id: string | null
          specialty: string
          years_experience: number | null
        }
        Insert: {
          certifications?: string[] | null
          created_at?: string | null
          expertise_level: string
          id?: string
          professional_id?: string | null
          specialty: string
          years_experience?: number | null
        }
        Update: {
          certifications?: string[] | null
          created_at?: string | null
          expertise_level?: string
          id?: string
          professional_id?: string | null
          specialty?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          business_name: string | null
          consultation_fee: number | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          is_verified: boolean | null
          notification_settings: Json | null
          push_token: string | null
          role: string | null
          specialties: string[] | null
          title: string | null
          updated_at: string | null
          username: string | null
          verified: boolean | null
          years_experience: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          business_name?: string | null
          consultation_fee?: number | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          is_verified?: boolean | null
          notification_settings?: Json | null
          push_token?: string | null
          role?: string | null
          specialties?: string[] | null
          title?: string | null
          updated_at?: string | null
          username?: string | null
          verified?: boolean | null
          years_experience?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          business_name?: string | null
          consultation_fee?: number | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          is_verified?: boolean | null
          notification_settings?: Json | null
          push_token?: string | null
          role?: string | null
          specialties?: string[] | null
          title?: string | null
          updated_at?: string | null
          username?: string | null
          verified?: boolean | null
          years_experience?: number | null
        }
        Relationships: []
      }
      pronunciation_guides: {
        Row: {
          audio_url: string | null
          created_at: string
          description: string | null
          id: string
          pronunciation: string
          term: string
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          pronunciation: string
          term: string
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          pronunciation?: string
          term?: string
        }
        Relationships: []
      }
      quit_attempts: {
        Row: {
          challenges_faced: string[] | null
          coping_strategies: string[] | null
          created_at: string | null
          end_date: string | null
          id: string
          notes: string | null
          start_date: string
          substance_type: Database["public"]["Enums"]["substance_type"]
          success_rating: number | null
          support_received: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          challenges_faced?: string[] | null
          coping_strategies?: string[] | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          start_date?: string
          substance_type: Database["public"]["Enums"]["substance_type"]
          success_rating?: number | null
          support_received?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          challenges_faced?: string[] | null
          coping_strategies?: string[] | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          notes?: string | null
          start_date?: string
          substance_type?: Database["public"]["Enums"]["substance_type"]
          success_rating?: number | null
          support_received?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      quit_journey_settings: {
        Row: {
          created_at: string | null
          focus_preferences: Json | null
          id: string
          initial_daily_usage: number
          is_shift_worker: boolean | null
          mood_triggers: string[] | null
          peak_energy_times: string[] | null
          quit_date: string | null
          quit_type: string
          support_needs: Json | null
          taper_schedule: Json | null
          target_daily_usage: number | null
          target_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          focus_preferences?: Json | null
          id?: string
          initial_daily_usage: number
          is_shift_worker?: boolean | null
          mood_triggers?: string[] | null
          peak_energy_times?: string[] | null
          quit_date?: string | null
          quit_type: string
          support_needs?: Json | null
          taper_schedule?: Json | null
          target_daily_usage?: number | null
          target_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          focus_preferences?: Json | null
          id?: string
          initial_daily_usage?: number
          is_shift_worker?: boolean | null
          mood_triggers?: string[] | null
          peak_energy_times?: string[] | null
          quit_date?: string | null
          quit_type?: string
          support_needs?: Json | null
          taper_schedule?: Json | null
          target_daily_usage?: number | null
          target_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      quit_plans: {
        Row: {
          alternative_product_id: string | null
          created_at: string | null
          current_daily_usage: number | null
          daily_routines: Json | null
          id: string
          initial_daily_usage: number
          is_shift_worker: boolean | null
          product_type: string
          replacement_activities: string[] | null
          shift_pattern: string | null
          start_date: string | null
          strategy_type: Database["public"]["Enums"]["quit_strategy_type"]
          support_resources: string[] | null
          target_daily_usage: number | null
          target_date: string | null
          trigger_management_strategies: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          alternative_product_id?: string | null
          created_at?: string | null
          current_daily_usage?: number | null
          daily_routines?: Json | null
          id?: string
          initial_daily_usage: number
          is_shift_worker?: boolean | null
          product_type: string
          replacement_activities?: string[] | null
          shift_pattern?: string | null
          start_date?: string | null
          strategy_type: Database["public"]["Enums"]["quit_strategy_type"]
          support_resources?: string[] | null
          target_daily_usage?: number | null
          target_date?: string | null
          trigger_management_strategies?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          alternative_product_id?: string | null
          created_at?: string | null
          current_daily_usage?: number | null
          daily_routines?: Json | null
          id?: string
          initial_daily_usage?: number
          is_shift_worker?: boolean | null
          product_type?: string
          replacement_activities?: string[] | null
          shift_pattern?: string | null
          start_date?: string | null
          strategy_type?: Database["public"]["Enums"]["quit_strategy_type"]
          support_resources?: string[] | null
          target_daily_usage?: number | null
          target_date?: string | null
          trigger_management_strategies?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quit_plans_alternative_product_id_fkey"
            columns: ["alternative_product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "quit_plans_alternative_product_id_fkey"
            columns: ["alternative_product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      quit_strategies: {
        Row: {
          created_at: string
          description: string
          difficulty_level: number | null
          id: string
          name: string
          recommended_duration_days: number | null
          success_rate: number | null
        }
        Insert: {
          created_at?: string
          description: string
          difficulty_level?: number | null
          id?: string
          name: string
          recommended_duration_days?: number | null
          success_rate?: number | null
        }
        Update: {
          created_at?: string
          description?: string
          difficulty_level?: number | null
          id?: string
          name?: string
          recommended_duration_days?: number | null
          success_rate?: number | null
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          correct_answer: string
          created_at: string
          explanation: string | null
          id: string
          question: string
          quiz_id: string | null
          wrong_answers: string[]
        }
        Insert: {
          correct_answer: string
          created_at?: string
          explanation?: string | null
          id?: string
          question: string
          quiz_id?: string | null
          wrong_answers: string[]
        }
        Update: {
          correct_answer?: string
          created_at?: string
          explanation?: string | null
          id?: string
          question?: string
          quiz_id?: string | null
          wrong_answers?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_results: {
        Row: {
          category: string
          created_at: string | null
          difficulty: string
          id: string
          questions_answered: number
          score: number
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          difficulty: string
          id?: string
          questions_answered: number
          score: number
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          difficulty?: string
          id?: string
          questions_answered?: number
          score?: number
          user_id?: string
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          category: string
          created_at: string
          description: string
          difficulty_level: string
          id: string
          title: string
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          difficulty_level: string
          id?: string
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          difficulty_level?: string
          id?: string
          title?: string
        }
        Relationships: []
      }
      reading_plans: {
        Row: {
          created_at: string
          description: string | null
          duration_days: number | null
          id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_days?: number | null
          id?: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_days?: number | null
          id?: string
          title?: string
        }
        Relationships: []
      }
      realm_locations: {
        Row: {
          connection_points: Json[] | null
          coordinates: Json
          created_at: string
          description: string | null
          id: string
          realm_id: string | null
        }
        Insert: {
          connection_points?: Json[] | null
          coordinates: Json
          created_at?: string
          description?: string | null
          id?: string
          realm_id?: string | null
        }
        Update: {
          connection_points?: Json[] | null
          coordinates?: Json
          created_at?: string
          description?: string | null
          id?: string
          realm_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "realm_locations_realm_id_fkey"
            columns: ["realm_id"]
            isOneToOne: false
            referencedRelation: "realms"
            referencedColumns: ["id"]
          },
        ]
      }
      realms: {
        Row: {
          access_points: string[] | null
          characteristic_features: string[]
          climate: string | null
          connected_realms: string[] | null
          created_at: string
          cultural_significance: string | null
          description: string
          governing_forces: string[] | null
          historical_significance: string | null
          id: string
          image_url: string | null
          inhabitants: string[] | null
          magical_properties: string[] | null
          mythology_era: string | null
          myths_and_legends: string[] | null
          name: string
          notable_locations: string[] | null
          search_rank: number | null
          search_vector: unknown | null
          seasonal_changes: string | null
        }
        Insert: {
          access_points?: string[] | null
          characteristic_features: string[]
          climate?: string | null
          connected_realms?: string[] | null
          created_at?: string
          cultural_significance?: string | null
          description: string
          governing_forces?: string[] | null
          historical_significance?: string | null
          id?: string
          image_url?: string | null
          inhabitants?: string[] | null
          magical_properties?: string[] | null
          mythology_era?: string | null
          myths_and_legends?: string[] | null
          name: string
          notable_locations?: string[] | null
          search_rank?: number | null
          search_vector?: unknown | null
          seasonal_changes?: string | null
        }
        Update: {
          access_points?: string[] | null
          characteristic_features?: string[]
          climate?: string | null
          connected_realms?: string[] | null
          created_at?: string
          cultural_significance?: string | null
          description?: string
          governing_forces?: string[] | null
          historical_significance?: string | null
          id?: string
          image_url?: string | null
          inhabitants?: string[] | null
          magical_properties?: string[] | null
          mythology_era?: string | null
          myths_and_legends?: string[] | null
          name?: string
          notable_locations?: string[] | null
          search_rank?: number | null
          search_vector?: unknown | null
          seasonal_changes?: string | null
        }
        Relationships: []
      }
      recovery_milestones: {
        Row: {
          achieved_at: string
          celebration_notes: string | null
          created_at: string | null
          days_sober: number | null
          health_improvements: string[] | null
          id: string
          lifestyle_changes: string[] | null
          mental_improvements: string[] | null
          milestone_type: string
          money_saved: number | null
          physical_improvements: string[] | null
          substance_type: Database["public"]["Enums"]["substance_type"]
          user_id: string
        }
        Insert: {
          achieved_at?: string
          celebration_notes?: string | null
          created_at?: string | null
          days_sober?: number | null
          health_improvements?: string[] | null
          id?: string
          lifestyle_changes?: string[] | null
          mental_improvements?: string[] | null
          milestone_type: string
          money_saved?: number | null
          physical_improvements?: string[] | null
          substance_type: Database["public"]["Enums"]["substance_type"]
          user_id: string
        }
        Update: {
          achieved_at?: string
          celebration_notes?: string | null
          created_at?: string | null
          days_sober?: number | null
          health_improvements?: string[] | null
          id?: string
          lifestyle_changes?: string[] | null
          mental_improvements?: string[] | null
          milestone_type?: string
          money_saved?: number | null
          physical_improvements?: string[] | null
          substance_type?: Database["public"]["Enums"]["substance_type"]
          user_id?: string
        }
        Relationships: []
      }
      remote_trials: {
        Row: {
          created_at: string
          description: string | null
          id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      replacement_activities: {
        Row: {
          activity_name: string
          category: string
          cost: number | null
          created_at: string | null
          duration_minutes: number | null
          effectiveness_rating: number | null
          id: string
          mood_impact: number | null
          notes: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activity_name: string
          category: string
          cost?: number | null
          created_at?: string | null
          duration_minutes?: number | null
          effectiveness_rating?: number | null
          id?: string
          mood_impact?: number | null
          notes?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activity_name?: string
          category?: string
          cost?: number | null
          created_at?: string | null
          duration_minutes?: number | null
          effectiveness_rating?: number | null
          id?: string
          mood_impact?: number | null
          notes?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      reproductive_health_exercises: {
        Row: {
          created_at: string
          description: string
          difficulty_level: number
          duration_seconds: number
          exercise_type: Database["public"]["Enums"]["reproductive_exercise_type"]
          hold_duration_seconds: number | null
          id: string
          name: string
          repetitions: number | null
          rest_duration_seconds: number | null
          sets: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description: string
          difficulty_level?: number
          duration_seconds: number
          exercise_type: Database["public"]["Enums"]["reproductive_exercise_type"]
          hold_duration_seconds?: number | null
          id?: string
          name: string
          repetitions?: number | null
          rest_duration_seconds?: number | null
          sets?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          difficulty_level?: number
          duration_seconds?: number
          exercise_type?: Database["public"]["Enums"]["reproductive_exercise_type"]
          hold_duration_seconds?: number | null
          id?: string
          name?: string
          repetitions?: number | null
          rest_duration_seconds?: number | null
          sets?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      reproductive_health_progress: {
        Row: {
          completed_at: string
          created_at: string
          difficulty_level: number
          exercise_id: string
          id: string
          notes: string | null
          perceived_effort: number | null
          sets_completed: number | null
          total_duration_seconds: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          difficulty_level: number
          exercise_id: string
          id?: string
          notes?: string | null
          perceived_effort?: number | null
          sets_completed?: number | null
          total_duration_seconds?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          difficulty_level?: number
          exercise_id?: string
          id?: string
          notes?: string | null
          perceived_effort?: number | null
          sets_completed?: number | null
          total_duration_seconds?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reproductive_health_progress_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "reproductive_health_exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      research_artifacts: {
        Row: {
          artifact_type: string
          created_at: string | null
          description: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          id: string
          project_id: string
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          artifact_type: string
          created_at?: string | null
          description?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          project_id: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          artifact_type?: string
          created_at?: string | null
          description?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          project_id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "research_artifacts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "research_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      research_data_points: {
        Row: {
          collected_at: string
          created_at: string
          data_type: string
          data_value: Json
          id: string
          participant_id: string
          project_id: string
        }
        Insert: {
          collected_at?: string
          created_at?: string
          data_type: string
          data_value: Json
          id?: string
          participant_id: string
          project_id: string
        }
        Update: {
          collected_at?: string
          created_at?: string
          data_type?: string
          data_value?: Json
          id?: string
          participant_id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_data_points_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "research_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "research_data_points_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "research_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      research_feedback: {
        Row: {
          created_at: string | null
          feedback_text: string | null
          id: string
          participant_id: string
          project_id: string
          rating: number | null
          sentiment_score: number | null
          tags: string[] | null
        }
        Insert: {
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          participant_id: string
          project_id: string
          rating?: number | null
          sentiment_score?: number | null
          tags?: string[] | null
        }
        Update: {
          created_at?: string | null
          feedback_text?: string | null
          id?: string
          participant_id?: string
          project_id?: string
          rating?: number | null
          sentiment_score?: number | null
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "research_feedback_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "research_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "research_feedback_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "research_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      research_guides: {
        Row: {
          created_at: string | null
          deliverables: string[] | null
          description: string | null
          expected_duration: string
          id: string
          order_number: number
          phase: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deliverables?: string[] | null
          description?: string | null
          expected_duration: string
          id?: string
          order_number: number
          phase: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deliverables?: string[] | null
          description?: string | null
          expected_duration?: string
          id?: string
          order_number?: number
          phase?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      research_interviews: {
        Row: {
          created_at: string | null
          duration_minutes: number | null
          id: string
          notes: string | null
          participant_id: string
          project_id: string
          recording_url: string | null
          scheduled_at: string
          status: string | null
          transcript: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          participant_id: string
          project_id: string
          recording_url?: string | null
          scheduled_at: string
          status?: string | null
          transcript?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          participant_id?: string
          project_id?: string
          recording_url?: string | null
          scheduled_at?: string
          status?: string | null
          transcript?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "research_interviews_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "research_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "research_interviews_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "research_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      research_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          project_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          project_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          project_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "research_notes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "research_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      research_observations: {
        Row: {
          content: string
          context_data: Json | null
          created_at: string | null
          id: string
          observation_type: string
          participant_id: string
          project_id: string
          tags: string[] | null
        }
        Insert: {
          content: string
          context_data?: Json | null
          created_at?: string | null
          id?: string
          observation_type: string
          participant_id: string
          project_id: string
          tags?: string[] | null
        }
        Update: {
          content?: string
          context_data?: Json | null
          created_at?: string | null
          id?: string
          observation_type?: string
          participant_id?: string
          project_id?: string
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "research_observations_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "research_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "research_observations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "research_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      research_participants: {
        Row: {
          created_at: string
          enrollment_date: string | null
          id: string
          project_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          enrollment_date?: string | null
          id?: string
          project_id: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          enrollment_date?: string | null
          id?: string
          project_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_research_participants_profiles"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "research_participants_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "research_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      research_projects: {
        Row: {
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          research_type: Database["public"]["Enums"]["research_type"]
          start_date: string | null
          status: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          research_type: Database["public"]["Enums"]["research_type"]
          start_date?: string | null
          status?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          research_type?: Database["public"]["Enums"]["research_type"]
          start_date?: string | null
          status?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      retail_locations: {
        Row: {
          address: string
          available_services: string[] | null
          contact_info: Json | null
          coordinates: unknown | null
          created_at: string | null
          delivery_radius_km: number | null
          has_delivery: boolean | null
          has_pickup: boolean | null
          id: string
          name: string
          operating_hours: Json | null
          parking_info: string | null
          store_hours: Json | null
          store_type: string | null
          updated_at: string | null
        }
        Insert: {
          address: string
          available_services?: string[] | null
          contact_info?: Json | null
          coordinates?: unknown | null
          created_at?: string | null
          delivery_radius_km?: number | null
          has_delivery?: boolean | null
          has_pickup?: boolean | null
          id?: string
          name: string
          operating_hours?: Json | null
          parking_info?: string | null
          store_hours?: Json | null
          store_type?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          available_services?: string[] | null
          contact_info?: Json | null
          coordinates?: unknown | null
          created_at?: string | null
          delivery_radius_km?: number | null
          has_delivery?: boolean | null
          has_pickup?: boolean | null
          id?: string
          name?: string
          operating_hours?: Json | null
          parking_info?: string | null
          store_hours?: Json | null
          store_type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      retail_partnerships: {
        Row: {
          commission_rate: number | null
          created_at: string | null
          ends_at: string | null
          id: string
          partnership_level: string
          retailer_id: string
          starts_at: string | null
          terms: string | null
        }
        Insert: {
          commission_rate?: number | null
          created_at?: string | null
          ends_at?: string | null
          id?: string
          partnership_level: string
          retailer_id: string
          starts_at?: string | null
          terms?: string | null
        }
        Update: {
          commission_rate?: number | null
          created_at?: string | null
          ends_at?: string | null
          id?: string
          partnership_level?: string
          retailer_id?: string
          starts_at?: string | null
          terms?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          appearance_rating: number | null
          comfort_rating: number | null
          comment: string | null
          created_at: string | null
          flavor_rating: number | null
          id: string
          mouthfeel_rating: number | null
          overall_rating: number | null
          product_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          appearance_rating?: number | null
          comfort_rating?: number | null
          comment?: string | null
          created_at?: string | null
          flavor_rating?: number | null
          id?: string
          mouthfeel_rating?: number | null
          overall_rating?: number | null
          product_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          appearance_rating?: number | null
          comfort_rating?: number | null
          comment?: string | null
          created_at?: string | null
          flavor_rating?: number | null
          id?: string
          mouthfeel_rating?: number | null
          overall_rating?: number | null
          product_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      reward_thresholds: {
        Row: {
          created_at: string | null
          discount_percentage: number
          id: string
          is_active: boolean | null
          max_discount_amount: number | null
          points_required: number
          terms_conditions: string | null
          valid_from: string | null
          valid_until: string | null
          vendor_id: string
        }
        Insert: {
          created_at?: string | null
          discount_percentage: number
          id?: string
          is_active?: boolean | null
          max_discount_amount?: number | null
          points_required: number
          terms_conditions?: string | null
          valid_from?: string | null
          valid_until?: string | null
          vendor_id: string
        }
        Update: {
          created_at?: string | null
          discount_percentage?: number
          id?: string
          is_active?: boolean | null
          max_discount_amount?: number | null
          points_required?: number
          terms_conditions?: string | null
          valid_from?: string | null
          valid_until?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reward_thresholds_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      ruins: {
        Row: {
          archaeological_features: string[] | null
          conservation_status: string | null
          created_at: string
          description: string
          historical_period: string | null
          historical_significance: string | null
          id: string
          image_urls: string[] | null
          location: string
          name: string
          search_rank: number | null
          search_vector: unknown | null
          slug: string | null
          visiting_info: string | null
        }
        Insert: {
          archaeological_features?: string[] | null
          conservation_status?: string | null
          created_at?: string
          description: string
          historical_period?: string | null
          historical_significance?: string | null
          id?: string
          image_urls?: string[] | null
          location: string
          name: string
          search_rank?: number | null
          search_vector?: unknown | null
          slug?: string | null
          visiting_info?: string | null
        }
        Update: {
          archaeological_features?: string[] | null
          conservation_status?: string | null
          created_at?: string
          description?: string
          historical_period?: string | null
          historical_significance?: string | null
          id?: string
          image_urls?: string[] | null
          location?: string
          name?: string
          search_rank?: number | null
          search_vector?: unknown | null
          slug?: string | null
          visiting_info?: string | null
        }
        Relationships: []
      }
      runes: {
        Row: {
          created_at: string
          historical_context: string | null
          id: string
          interpretation: string
          meaning: string
          name: string
          phonetic_value: string | null
          search_rank: number | null
          search_vector: unknown | null
          symbol: string
        }
        Insert: {
          created_at?: string
          historical_context?: string | null
          id?: string
          interpretation: string
          meaning: string
          name: string
          phonetic_value?: string | null
          search_rank?: number | null
          search_vector?: unknown | null
          symbol: string
        }
        Update: {
          created_at?: string
          historical_context?: string | null
          id?: string
          interpretation?: string
          meaning?: string
          name?: string
          phonetic_value?: string | null
          search_rank?: number | null
          search_vector?: unknown | null
          symbol?: string
        }
        Relationships: []
      }
      runic_messages: {
        Row: {
          created_at: string | null
          id: string
          is_public: boolean | null
          message_latin: string
          message_runes: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          message_latin: string
          message_runes: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          message_latin?: string
          message_runes?: string
          user_id?: string
        }
        Relationships: []
      }
      saga_narrations: {
        Row: {
          audio_url: string
          created_at: string
          duration_seconds: number | null
          id: string
          language: string
          narrator_name: string
          saga_id: string | null
        }
        Insert: {
          audio_url: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          language: string
          narrator_name: string
          saga_id?: string | null
        }
        Update: {
          audio_url?: string
          created_at?: string
          duration_seconds?: number | null
          id?: string
          language?: string
          narrator_name?: string
          saga_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saga_narrations_saga_id_fkey"
            columns: ["saga_id"]
            isOneToOne: false
            referencedRelation: "sagas"
            referencedColumns: ["id"]
          },
        ]
      }
      sagas: {
        Row: {
          annotations: Json | null
          audio_duration_seconds: number | null
          audio_url: string | null
          author: string | null
          categories: string[] | null
          content: string
          created_at: string
          cultural_significance: string | null
          description: string
          historical_period: string | null
          id: string
          image_url: string | null
          linked_elements: Json | null
          narrator_name: string | null
          reading_time_minutes: number | null
          related_sagas: string[] | null
          search_rank: number | null
          search_vector: unknown | null
          slug: string | null
          title: string
        }
        Insert: {
          annotations?: Json | null
          audio_duration_seconds?: number | null
          audio_url?: string | null
          author?: string | null
          categories?: string[] | null
          content: string
          created_at?: string
          cultural_significance?: string | null
          description: string
          historical_period?: string | null
          id?: string
          image_url?: string | null
          linked_elements?: Json | null
          narrator_name?: string | null
          reading_time_minutes?: number | null
          related_sagas?: string[] | null
          search_rank?: number | null
          search_vector?: unknown | null
          slug?: string | null
          title: string
        }
        Update: {
          annotations?: Json | null
          audio_duration_seconds?: number | null
          audio_url?: string | null
          author?: string | null
          categories?: string[] | null
          content?: string
          created_at?: string
          cultural_significance?: string | null
          description?: string
          historical_period?: string | null
          id?: string
          image_url?: string | null
          linked_elements?: Json | null
          narrator_name?: string | null
          reading_time_minutes?: number | null
          related_sagas?: string[] | null
          search_rank?: number | null
          search_vector?: unknown | null
          slug?: string | null
          title?: string
        }
        Relationships: []
      }
      scheduling_rules: {
        Row: {
          availability_hours: Json
          buffer_minutes: number
          created_at: string | null
          id: string
          max_daily_sessions: number
          professional_id: string | null
          session_duration_minutes: number
          updated_at: string | null
        }
        Insert: {
          availability_hours?: Json
          buffer_minutes?: number
          created_at?: string | null
          id?: string
          max_daily_sessions?: number
          professional_id?: string | null
          session_duration_minutes?: number
          updated_at?: string | null
        }
        Update: {
          availability_hours?: Json
          buffer_minutes?: number
          created_at?: string | null
          id?: string
          max_daily_sessions?: number
          professional_id?: string | null
          session_duration_minutes?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scheduling_rules_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      scripture_meditations: {
        Row: {
          background_audio_url: string | null
          created_at: string | null
          duration_minutes: number | null
          id: string
          meditation_prompt: string
          verse_reference: string
        }
        Insert: {
          background_audio_url?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          meditation_prompt: string
          verse_reference: string
        }
        Update: {
          background_audio_url?: string | null
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          meditation_prompt?: string
          verse_reference?: string
        }
        Relationships: []
      }
      scripture_wellness_prompts: {
        Row: {
          category: string
          created_at: string | null
          emotional_tags: string[] | null
          id: string
          prompt: string
          recommended_time_of_day: string | null
          verse_reference: string
        }
        Insert: {
          category: string
          created_at?: string | null
          emotional_tags?: string[] | null
          id?: string
          prompt: string
          recommended_time_of_day?: string | null
          verse_reference: string
        }
        Update: {
          category?: string
          created_at?: string | null
          emotional_tags?: string[] | null
          id?: string
          prompt?: string
          recommended_time_of_day?: string | null
          verse_reference?: string
        }
        Relationships: []
      }
      search_logs: {
        Row: {
          created_at: string | null
          filter_type: string | null
          id: string
          location: string | null
          query: string
          results_count: number | null
        }
        Insert: {
          created_at?: string | null
          filter_type?: string | null
          id?: string
          location?: string | null
          query: string
          results_count?: number | null
        }
        Update: {
          created_at?: string | null
          filter_type?: string | null
          id?: string
          location?: string | null
          query?: string
          results_count?: number | null
        }
        Relationships: []
      }
      search_rankings: {
        Row: {
          click_count: number | null
          content_id: string
          content_type: string
          id: string
          last_clicked: string | null
          search_weight: number | null
        }
        Insert: {
          click_count?: number | null
          content_id: string
          content_type: string
          id?: string
          last_clicked?: string | null
          search_weight?: number | null
        }
        Update: {
          click_count?: number | null
          content_id?: string
          content_type?: string
          id?: string
          last_clicked?: string | null
          search_weight?: number | null
        }
        Relationships: []
      }
      seller_analytics: {
        Row: {
          churned_subscribers: number | null
          date: string | null
          id: string
          new_subscribers: number | null
          one_time_revenue: number | null
          refund_amount: number | null
          refund_count: number | null
          revenue: number | null
          sales_count: number | null
          seller_id: string | null
          subscription_revenue: number | null
          views_count: number | null
        }
        Insert: {
          churned_subscribers?: number | null
          date?: string | null
          id?: string
          new_subscribers?: number | null
          one_time_revenue?: number | null
          refund_amount?: number | null
          refund_count?: number | null
          revenue?: number | null
          sales_count?: number | null
          seller_id?: string | null
          subscription_revenue?: number | null
          views_count?: number | null
        }
        Update: {
          churned_subscribers?: number | null
          date?: string | null
          id?: string
          new_subscribers?: number | null
          one_time_revenue?: number | null
          refund_amount?: number | null
          refund_count?: number | null
          revenue?: number | null
          sales_count?: number | null
          seller_id?: string | null
          subscription_revenue?: number | null
          views_count?: number | null
        }
        Relationships: []
      }
      seller_profiles: {
        Row: {
          business_documents: Json | null
          business_type: string | null
          commission_rate: number | null
          created_at: string | null
          description: string | null
          id: string
          logo_url: string | null
          minimum_payout: number | null
          payment_details: Json | null
          payout_schedule: string | null
          rating: number | null
          review_count: number | null
          social_links: Json | null
          store_name: string
          stripe_connected_account_id: string | null
          support_email: string | null
          support_response_time: number | null
          tax_id: string | null
          total_revenue: number | null
          total_sales: number | null
          updated_at: string | null
          verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
          website_url: string | null
        }
        Insert: {
          business_documents?: Json | null
          business_type?: string | null
          commission_rate?: number | null
          created_at?: string | null
          description?: string | null
          id: string
          logo_url?: string | null
          minimum_payout?: number | null
          payment_details?: Json | null
          payout_schedule?: string | null
          rating?: number | null
          review_count?: number | null
          social_links?: Json | null
          store_name: string
          stripe_connected_account_id?: string | null
          support_email?: string | null
          support_response_time?: number | null
          tax_id?: string | null
          total_revenue?: number | null
          total_sales?: number | null
          updated_at?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          website_url?: string | null
        }
        Update: {
          business_documents?: Json | null
          business_type?: string | null
          commission_rate?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          logo_url?: string | null
          minimum_payout?: number | null
          payment_details?: Json | null
          payout_schedule?: string | null
          rating?: number | null
          review_count?: number | null
          social_links?: Json | null
          store_name?: string
          stripe_connected_account_id?: string | null
          support_email?: string | null
          support_response_time?: number | null
          tax_id?: string | null
          total_revenue?: number | null
          total_sales?: number | null
          updated_at?: string | null
          verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
          website_url?: string | null
        }
        Relationships: []
      }
      seller_verification_requests: {
        Row: {
          admin_notes: string | null
          business_name: string | null
          business_type: string | null
          documents_url: string[] | null
          id: string
          reviewed_at: string | null
          reviewer_id: string | null
          seller_id: string | null
          status: Database["public"]["Enums"]["verification_status"] | null
          submitted_at: string | null
          tax_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          business_name?: string | null
          business_type?: string | null
          documents_url?: string[] | null
          id?: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          seller_id?: string | null
          status?: Database["public"]["Enums"]["verification_status"] | null
          submitted_at?: string | null
          tax_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          business_name?: string | null
          business_type?: string | null
          documents_url?: string[] | null
          id?: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          seller_id?: string | null
          status?: Database["public"]["Enums"]["verification_status"] | null
          submitted_at?: string | null
          tax_id?: string | null
        }
        Relationships: []
      }
      sermon_notes: {
        Row: {
          content: string | null
          created_at: string
          id: string
          media_urls: string[] | null
          scripture_references: string[] | null
          tags: string[] | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          media_urls?: string[] | null
          scripture_references?: string[] | null
          tags?: string[] | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          media_urls?: string[] | null
          scripture_references?: string[] | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sermons: {
        Row: {
          audio_url: string | null
          church_id: string | null
          created_at: string
          description: string | null
          id: string
          recorded_date: string | null
          scripture_references: string[] | null
          speaker: string | null
          title: string
          video_url: string | null
        }
        Insert: {
          audio_url?: string | null
          church_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          recorded_date?: string | null
          scripture_references?: string[] | null
          speaker?: string | null
          title: string
          video_url?: string | null
        }
        Update: {
          audio_url?: string | null
          church_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          recorded_date?: string | null
          scripture_references?: string[] | null
          speaker?: string | null
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sermons_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      session_feedback: {
        Row: {
          created_at: string | null
          created_by: string | null
          feedback_text: string | null
          feedback_type: Database["public"]["Enums"]["session_feedback_type"]
          id: string
          rating: number | null
          session_id: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          feedback_text?: string | null
          feedback_type: Database["public"]["Enums"]["session_feedback_type"]
          id?: string
          rating?: number | null
          session_id?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          feedback_text?: string | null
          feedback_type?: Database["public"]["Enums"]["session_feedback_type"]
          id?: string
          rating?: number | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_feedback_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "consultation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_participants: {
        Row: {
          id: string
          joined_at: string | null
          session_id: string
          status: string
          user_id: string
        }
        Insert: {
          id?: string
          joined_at?: string | null
          session_id: string
          status: string
          user_id: string
        }
        Update: {
          id?: string
          joined_at?: string | null
          session_id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_participants_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "support_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_recordings: {
        Row: {
          consent_given_at: string | null
          created_at: string | null
          duration_seconds: number | null
          id: string
          recording_url: string
          retention_days: number | null
          session_id: string | null
        }
        Insert: {
          consent_given_at?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          recording_url: string
          retention_days?: number | null
          session_id?: string | null
        }
        Update: {
          consent_given_at?: string | null
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          recording_url?: string
          retention_days?: number | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_recordings_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "consultation_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_bathing_routines: {
        Row: {
          created_at: string
          id: string
          routine_id: string | null
          shared_by: string | null
          shared_with: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          routine_id?: string | null
          shared_by?: string | null
          shared_with?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          routine_id?: string | null
          shared_by?: string | null
          shared_with?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shared_bathing_routines_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "bathing_routines"
            referencedColumns: ["id"]
          },
        ]
      }
      shared_consultation_resources: {
        Row: {
          client_id: string | null
          created_at: string | null
          id: string
          resource_id: string | null
          shared_by: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          resource_id?: string | null
          shared_by?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          id?: string
          resource_id?: string | null
          shared_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shared_consultation_resources_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_consultation_resources_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "consultation_resources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_consultation_resources_shared_by_fkey"
            columns: ["shared_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          country: string
          created_at: string
          full_name: string
          id: string
          is_default: boolean | null
          phone: string | null
          postal_code: string
          state: string
          updated_at: string
          user_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          country?: string
          created_at?: string
          full_name: string
          id?: string
          is_default?: boolean | null
          phone?: string | null
          postal_code: string
          state: string
          updated_at?: string
          user_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          country?: string
          created_at?: string
          full_name?: string
          id?: string
          is_default?: boolean | null
          phone?: string | null
          postal_code?: string
          state?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      shipping_zones: {
        Row: {
          created_at: string
          id: string
          name: string
          rates: Json
          updated_at: string
          vendor_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          rates?: Json
          updated_at?: string
          vendor_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          rates?: Json
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipping_zones_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_zones_countries: {
        Row: {
          country_code: string
          created_at: string | null
          id: string
          zone_id: string | null
        }
        Insert: {
          country_code: string
          created_at?: string | null
          id?: string
          zone_id?: string | null
        }
        Update: {
          country_code?: string
          created_at?: string | null
          id?: string
          zone_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shipping_zones_countries_zone_id_fkey"
            columns: ["zone_id"]
            isOneToOne: false
            referencedRelation: "shipping_zones"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "shopping_cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      shoutouts: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          product_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          product_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          product_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shoutouts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "shoutouts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      sleep_alarms: {
        Row: {
          created_at: string
          days_active: string[] | null
          id: string
          is_active: boolean | null
          smart_wake_window_minutes: number | null
          sound_profile: string | null
          updated_at: string
          user_id: string | null
          vibration_pattern: string | null
          wake_time: string
        }
        Insert: {
          created_at?: string
          days_active?: string[] | null
          id?: string
          is_active?: boolean | null
          smart_wake_window_minutes?: number | null
          sound_profile?: string | null
          updated_at?: string
          user_id?: string | null
          vibration_pattern?: string | null
          wake_time: string
        }
        Update: {
          created_at?: string
          days_active?: string[] | null
          id?: string
          is_active?: boolean | null
          smart_wake_window_minutes?: number | null
          sound_profile?: string | null
          updated_at?: string
          user_id?: string | null
          vibration_pattern?: string | null
          wake_time?: string
        }
        Relationships: []
      }
      sleep_analytics_summaries: {
        Row: {
          average_quality: number | null
          consistency_score: number | null
          created_at: string
          date: string
          environment_score: number | null
          id: string
          sleep_debt_hours: number | null
          sleep_efficiency: number | null
          total_sleep_hours: number | null
          user_id: string | null
        }
        Insert: {
          average_quality?: number | null
          consistency_score?: number | null
          created_at?: string
          date?: string
          environment_score?: number | null
          id?: string
          sleep_debt_hours?: number | null
          sleep_efficiency?: number | null
          total_sleep_hours?: number | null
          user_id?: string | null
        }
        Update: {
          average_quality?: number | null
          consistency_score?: number | null
          created_at?: string
          date?: string
          environment_score?: number | null
          id?: string
          sleep_debt_hours?: number | null
          sleep_efficiency?: number | null
          total_sleep_hours?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      sleep_combined_data: {
        Row: {
          bedtime: string | null
          comfort_rating: number | null
          created_at: string
          date: string
          humidity: number | null
          id: string
          light_level: number | null
          noise_level: number | null
          sleep_quality: number | null
          target_bedtime: string | null
          target_sleep_duration: number | null
          target_wake_time: string | null
          temperature: number | null
          user_id: string | null
          ventilation_rating: number | null
          wake_time: string | null
        }
        Insert: {
          bedtime?: string | null
          comfort_rating?: number | null
          created_at?: string
          date?: string
          humidity?: number | null
          id?: string
          light_level?: number | null
          noise_level?: number | null
          sleep_quality?: number | null
          target_bedtime?: string | null
          target_sleep_duration?: number | null
          target_wake_time?: string | null
          temperature?: number | null
          user_id?: string | null
          ventilation_rating?: number | null
          wake_time?: string | null
        }
        Update: {
          bedtime?: string | null
          comfort_rating?: number | null
          created_at?: string
          date?: string
          humidity?: number | null
          id?: string
          light_level?: number | null
          noise_level?: number | null
          sleep_quality?: number | null
          target_bedtime?: string | null
          target_sleep_duration?: number | null
          target_wake_time?: string | null
          temperature?: number | null
          user_id?: string | null
          ventilation_rating?: number | null
          wake_time?: string | null
        }
        Relationships: []
      }
      sleep_diary_entries: {
        Row: {
          bedtime: string
          caffeine_consumed: boolean | null
          created_at: string
          date: string
          exercise_done: boolean | null
          id: string
          mood_on_waking: number | null
          notes: string | null
          screen_time_before_bed: boolean | null
          sleep_quality: number | null
          user_id: string | null
          wake_time: string
        }
        Insert: {
          bedtime: string
          caffeine_consumed?: boolean | null
          created_at?: string
          date?: string
          exercise_done?: boolean | null
          id?: string
          mood_on_waking?: number | null
          notes?: string | null
          screen_time_before_bed?: boolean | null
          sleep_quality?: number | null
          user_id?: string | null
          wake_time: string
        }
        Update: {
          bedtime?: string
          caffeine_consumed?: boolean | null
          created_at?: string
          date?: string
          exercise_done?: boolean | null
          id?: string
          mood_on_waking?: number | null
          notes?: string | null
          screen_time_before_bed?: boolean | null
          sleep_quality?: number | null
          user_id?: string | null
          wake_time?: string
        }
        Relationships: []
      }
      sleep_disorders: {
        Row: {
          causes: string[] | null
          created_at: string | null
          description: string
          id: string
          name: string
          prevention_tips: string[] | null
          symptoms: string[] | null
          treatments: string[] | null
          updated_at: string | null
        }
        Insert: {
          causes?: string[] | null
          created_at?: string | null
          description: string
          id?: string
          name: string
          prevention_tips?: string[] | null
          symptoms?: string[] | null
          treatments?: string[] | null
          updated_at?: string | null
        }
        Update: {
          causes?: string[] | null
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          prevention_tips?: string[] | null
          symptoms?: string[] | null
          treatments?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sleep_environment_logs: {
        Row: {
          comfort_rating: number | null
          created_at: string
          date: string
          humidity: number | null
          id: string
          light_level: number | null
          noise_level: number | null
          notes: string | null
          temperature: number | null
          updated_at: string
          user_id: string
          ventilation_rating: number | null
        }
        Insert: {
          comfort_rating?: number | null
          created_at?: string
          date?: string
          humidity?: number | null
          id?: string
          light_level?: number | null
          noise_level?: number | null
          notes?: string | null
          temperature?: number | null
          updated_at?: string
          user_id: string
          ventilation_rating?: number | null
        }
        Update: {
          comfort_rating?: number | null
          created_at?: string
          date?: string
          humidity?: number | null
          id?: string
          light_level?: number | null
          noise_level?: number | null
          notes?: string | null
          temperature?: number | null
          updated_at?: string
          user_id?: string
          ventilation_rating?: number | null
        }
        Relationships: []
      }
      sleep_goals: {
        Row: {
          created_at: string
          id: string
          target_bedtime: string
          target_sleep_duration: number
          target_wake_time: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          target_bedtime: string
          target_sleep_duration: number
          target_wake_time: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          target_bedtime?: string
          target_sleep_duration?: number
          target_wake_time?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sleep_guides: {
        Row: {
          author_id: string | null
          category: string
          content: string
          content_type: Database["public"]["Enums"]["sleep_content_type"]
          created_at: string | null
          featured_image: string | null
          id: string
          meta_description: string | null
          published: boolean | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          category: string
          content: string
          content_type: Database["public"]["Enums"]["sleep_content_type"]
          created_at?: string | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          published?: boolean | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          category?: string
          content?: string
          content_type?: Database["public"]["Enums"]["sleep_content_type"]
          created_at?: string | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          published?: boolean | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      sleep_guides_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      sleep_hygiene_checklist: {
        Row: {
          bedroom_temperature_optimal: boolean | null
          created_at: string | null
          dark_room: boolean | null
          date: string
          exercise_completed: boolean | null
          id: string
          no_caffeine_after_2pm: boolean | null
          no_screens_before_bed: boolean | null
          quiet_environment: boolean | null
          relaxation_routine_completed: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bedroom_temperature_optimal?: boolean | null
          created_at?: string | null
          dark_room?: boolean | null
          date: string
          exercise_completed?: boolean | null
          id?: string
          no_caffeine_after_2pm?: boolean | null
          no_screens_before_bed?: boolean | null
          quiet_environment?: boolean | null
          relaxation_routine_completed?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bedroom_temperature_optimal?: boolean | null
          created_at?: string | null
          dark_room?: boolean | null
          date?: string
          exercise_completed?: boolean | null
          id?: string
          no_caffeine_after_2pm?: boolean | null
          no_screens_before_bed?: boolean | null
          quiet_environment?: boolean | null
          relaxation_routine_completed?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      sleep_noise_profiles: {
        Row: {
          binaural_beats_enabled: boolean | null
          binaural_frequency: number | null
          created_at: string
          id: string
          name: string
          nature_sounds_volume: number | null
          user_id: string | null
          white_noise_volume: number | null
        }
        Insert: {
          binaural_beats_enabled?: boolean | null
          binaural_frequency?: number | null
          created_at?: string
          id?: string
          name: string
          nature_sounds_volume?: number | null
          user_id?: string | null
          white_noise_volume?: number | null
        }
        Update: {
          binaural_beats_enabled?: boolean | null
          binaural_frequency?: number | null
          created_at?: string
          id?: string
          name?: string
          nature_sounds_volume?: number | null
          user_id?: string | null
          white_noise_volume?: number | null
        }
        Relationships: []
      }
      sleep_product_reviews: {
        Row: {
          cons: string[] | null
          created_at: string | null
          helpful_votes: number | null
          id: string
          product_id: string | null
          pros: string[] | null
          rating: number | null
          review_text: string | null
          updated_at: string | null
          user_id: string | null
          verified_purchase: boolean | null
        }
        Insert: {
          cons?: string[] | null
          created_at?: string | null
          helpful_votes?: number | null
          id?: string
          product_id?: string | null
          pros?: string[] | null
          rating?: number | null
          review_text?: string | null
          updated_at?: string | null
          user_id?: string | null
          verified_purchase?: boolean | null
        }
        Update: {
          cons?: string[] | null
          created_at?: string | null
          helpful_votes?: number | null
          id?: string
          product_id?: string | null
          pros?: string[] | null
          rating?: number | null
          review_text?: string | null
          updated_at?: string | null
          user_id?: string | null
          verified_purchase?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "sleep_product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "sleep_products"
            referencedColumns: ["id"]
          },
        ]
      }
      sleep_products: {
        Row: {
          affiliate_link: string | null
          category: Database["public"]["Enums"]["sleep_gear_category"]
          cons: string[] | null
          created_at: string | null
          description: string
          features: string[] | null
          id: string
          image_url: string | null
          name: string
          price_range: string | null
          pros: string[] | null
          rating: number | null
          review_count: number | null
          updated_at: string | null
        }
        Insert: {
          affiliate_link?: string | null
          category: Database["public"]["Enums"]["sleep_gear_category"]
          cons?: string[] | null
          created_at?: string | null
          description: string
          features?: string[] | null
          id?: string
          image_url?: string | null
          name: string
          price_range?: string | null
          pros?: string[] | null
          rating?: number | null
          review_count?: number | null
          updated_at?: string | null
        }
        Update: {
          affiliate_link?: string | null
          category?: Database["public"]["Enums"]["sleep_gear_category"]
          cons?: string[] | null
          created_at?: string | null
          description?: string
          features?: string[] | null
          id?: string
          image_url?: string | null
          name?: string
          price_range?: string | null
          pros?: string[] | null
          rating?: number | null
          review_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sleep_recommendation_settings: {
        Row: {
          bedtime_reminder_enabled: boolean | null
          created_at: string
          id: string
          light_level_preference: string | null
          noise_level_preference: string | null
          smart_alarm_enabled: boolean | null
          temperature_range_max: number | null
          temperature_range_min: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          bedtime_reminder_enabled?: boolean | null
          created_at?: string
          id?: string
          light_level_preference?: string | null
          noise_level_preference?: string | null
          smart_alarm_enabled?: boolean | null
          temperature_range_max?: number | null
          temperature_range_min?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          bedtime_reminder_enabled?: boolean | null
          created_at?: string
          id?: string
          light_level_preference?: string | null
          noise_level_preference?: string | null
          smart_alarm_enabled?: boolean | null
          temperature_range_max?: number | null
          temperature_range_min?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      sleep_research: {
        Row: {
          created_at: string | null
          full_content: string | null
          id: string
          key_findings: string[] | null
          methodology: string | null
          publication_date: string | null
          source_name: string | null
          source_url: string | null
          summary: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          full_content?: string | null
          id?: string
          key_findings?: string[] | null
          methodology?: string | null
          publication_date?: string | null
          source_name?: string | null
          source_url?: string | null
          summary: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          full_content?: string | null
          id?: string
          key_findings?: string[] | null
          methodology?: string | null
          publication_date?: string | null
          source_name?: string | null
          source_url?: string | null
          summary?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sleep_sounds: {
        Row: {
          audio_url: string
          category: string
          created_at: string
          duration_seconds: number
          id: string
          is_premium: boolean | null
          name: string
        }
        Insert: {
          audio_url: string
          category: string
          created_at?: string
          duration_seconds: number
          id?: string
          is_premium?: boolean | null
          name: string
        }
        Update: {
          audio_url?: string
          category?: string
          created_at?: string
          duration_seconds?: number
          id?: string
          is_premium?: boolean | null
          name?: string
        }
        Relationships: []
      }
      sleep_tracking: {
        Row: {
          bedtime: string
          created_at: string | null
          date: string
          id: string
          sleep_quality: number | null
          updated_at: string | null
          user_id: string
          wake_time: string
        }
        Insert: {
          bedtime: string
          created_at?: string | null
          date: string
          id?: string
          sleep_quality?: number | null
          updated_at?: string | null
          user_id: string
          wake_time: string
        }
        Update: {
          bedtime?: string
          created_at?: string | null
          date?: string
          id?: string
          sleep_quality?: number | null
          updated_at?: string | null
          user_id?: string
          wake_time?: string
        }
        Relationships: []
      }
      smart_notifications: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          metadata: Json | null
          notification_type: string
          priority: Database["public"]["Enums"]["notification_priority"] | null
          scheduled_for: string | null
          title: string
          trigger_conditions: Json | null
          vendor_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          metadata?: Json | null
          notification_type: string
          priority?: Database["public"]["Enums"]["notification_priority"] | null
          scheduled_for?: string | null
          title: string
          trigger_conditions?: Json | null
          vendor_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          metadata?: Json | null
          notification_type?: string
          priority?: Database["public"]["Enums"]["notification_priority"] | null
          scheduled_for?: string | null
          title?: string
          trigger_conditions?: Json | null
          vendor_id?: string
        }
        Relationships: []
      }
      smoking_logs: {
        Row: {
          created_at: string | null
          id: string
          log_type: Database["public"]["Enums"]["smoking_log_type"]
          notes: string | null
          quantity: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          log_type: Database["public"]["Enums"]["smoking_log_type"]
          notes?: string | null
          quantity?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          log_type?: Database["public"]["Enums"]["smoking_log_type"]
          notes?: string | null
          quantity?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      social_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          likes_count: number | null
          parent_id: string | null
          post_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          likes_count?: number | null
          parent_id?: string | null
          post_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          likes_count?: number | null
          parent_id?: string | null
          post_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "social_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "social_users"
            referencedColumns: ["id"]
          },
        ]
      }
      social_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_follows_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "social_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "social_users"
            referencedColumns: ["id"]
          },
        ]
      }
      social_likes: {
        Row: {
          comment_id: string | null
          created_at: string
          id: string
          post_id: string | null
          user_id: string
        }
        Insert: {
          comment_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          user_id: string
        }
        Update: {
          comment_id?: string | null
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "social_comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "social_users"
            referencedColumns: ["id"]
          },
        ]
      }
      social_posts: {
        Row: {
          comments_count: number | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          likes_count: number | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comments_count?: number | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number | null
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comments_count?: number | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "social_users"
            referencedColumns: ["id"]
          },
        ]
      }
      social_questions: {
        Row: {
          created_at: string
          id: string
          post_id: string
          selected_answer_id: string | null
          tags: string[] | null
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          selected_answer_id?: string | null
          tags?: string[] | null
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          selected_answer_id?: string | null
          tags?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "social_questions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "social_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_questions_selected_answer_id_fkey"
            columns: ["selected_answer_id"]
            isOneToOne: false
            referencedRelation: "social_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      social_relationships: {
        Row: {
          created_at: string
          id: string
          status: string | null
          updated_at: string
          user_id_1: string
          user_id_2: string
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string | null
          updated_at?: string
          user_id_1: string
          user_id_2: string
        }
        Update: {
          created_at?: string
          id?: string
          status?: string | null
          updated_at?: string
          user_id_1?: string
          user_id_2?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_relationships_user_id_1_fkey"
            columns: ["user_id_1"]
            isOneToOne: false
            referencedRelation: "social_users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "social_relationships_user_id_2_fkey"
            columns: ["user_id_2"]
            isOneToOne: false
            referencedRelation: "social_users"
            referencedColumns: ["id"]
          },
        ]
      }
      social_users: {
        Row: {
          avatar_url: string | null
          bio: string | null
          birth_date: string | null
          created_at: string
          dating_preferences: Json | null
          gender: string | null
          id: string
          interests: string[] | null
          last_active: string
          looking_for_relationship: boolean | null
          photos: string[] | null
          relationship_preferences: string[] | null
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string
          dating_preferences?: Json | null
          gender?: string | null
          id: string
          interests?: string[] | null
          last_active?: string
          looking_for_relationship?: boolean | null
          photos?: string[] | null
          relationship_preferences?: string[] | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          birth_date?: string | null
          created_at?: string
          dating_preferences?: Json | null
          gender?: string | null
          id?: string
          interests?: string[] | null
          last_active?: string
          looking_for_relationship?: boolean | null
          photos?: string[] | null
          relationship_preferences?: string[] | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      spiritual_practices: {
        Row: {
          associated_elements: string[] | null
          category: string
          created_at: string | null
          cultural_context: string | null
          description: string
          historical_basis: string | null
          id: string
          modern_adaptation: string | null
          practice_name: string
          recommended_resources: string[] | null
          respectful_guidelines: string | null
          safety_notes: string | null
          seasonal_timing: string | null
        }
        Insert: {
          associated_elements?: string[] | null
          category: string
          created_at?: string | null
          cultural_context?: string | null
          description: string
          historical_basis?: string | null
          id?: string
          modern_adaptation?: string | null
          practice_name: string
          recommended_resources?: string[] | null
          respectful_guidelines?: string | null
          safety_notes?: string | null
          seasonal_timing?: string | null
        }
        Update: {
          associated_elements?: string[] | null
          category?: string
          created_at?: string | null
          cultural_context?: string | null
          description?: string
          historical_basis?: string | null
          id?: string
          modern_adaptation?: string | null
          practice_name?: string
          recommended_resources?: string[] | null
          respectful_guidelines?: string | null
          safety_notes?: string | null
          seasonal_timing?: string | null
        }
        Relationships: []
      }
      sponsored_products: {
        Row: {
          budget: number
          cpc: number
          created_at: string | null
          ends_at: string
          id: string
          placement_type: string
          product_id: string
          spent: number | null
          sponsor_id: string
          starts_at: string
          status: string | null
          tier: string | null
        }
        Insert: {
          budget: number
          cpc: number
          created_at?: string | null
          ends_at: string
          id?: string
          placement_type: string
          product_id: string
          spent?: number | null
          sponsor_id: string
          starts_at?: string
          status?: string | null
          tier?: string | null
        }
        Update: {
          budget?: number
          cpc?: number
          created_at?: string | null
          ends_at?: string
          id?: string
          placement_type?: string
          product_id?: string
          spent?: number | null
          sponsor_id?: string
          starts_at?: string
          status?: string | null
          tier?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sponsored_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "sponsored_products_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      strongs_concordance: {
        Row: {
          created_at: string
          definition: string
          greek_word: string | null
          hebrew_aramaic_word: string | null
          id: string
          strongs_number: string
          transliteration: string | null
          usage_examples: Json | null
        }
        Insert: {
          created_at?: string
          definition: string
          greek_word?: string | null
          hebrew_aramaic_word?: string | null
          id?: string
          strongs_number: string
          transliteration?: string | null
          usage_examples?: Json | null
        }
        Update: {
          created_at?: string
          definition?: string
          greek_word?: string | null
          hebrew_aramaic_word?: string | null
          id?: string
          strongs_number?: string
          transliteration?: string | null
          usage_examples?: Json | null
        }
        Relationships: []
      }
      study_data_points: {
        Row: {
          collected_at: string | null
          created_at: string | null
          data_type: string
          data_value: Json
          id: string
          participant_id: string | null
          study_id: string | null
        }
        Insert: {
          collected_at?: string | null
          created_at?: string | null
          data_type: string
          data_value: Json
          id?: string
          participant_id?: string | null
          study_id?: string | null
        }
        Update: {
          collected_at?: string | null
          created_at?: string | null
          data_type?: string
          data_value?: Json
          id?: string
          participant_id?: string | null
          study_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "study_data_points_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "study_participants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_data_points_study_id_fkey"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "longitudinal_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      study_notes: {
        Row: {
          book: string
          chapter: number
          color: string | null
          created_at: string
          id: string
          note_text: string
          updated_at: string
          user_id: string
          verse: number
        }
        Insert: {
          book: string
          chapter: number
          color?: string | null
          created_at?: string
          id?: string
          note_text: string
          updated_at?: string
          user_id: string
          verse: number
        }
        Update: {
          book?: string
          chapter?: number
          color?: string | null
          created_at?: string
          id?: string
          note_text?: string
          updated_at?: string
          user_id?: string
          verse?: number
        }
        Relationships: []
      }
      study_participants: {
        Row: {
          enrolled_at: string | null
          id: string
          status: string | null
          study_id: string | null
          user_id: string | null
        }
        Insert: {
          enrolled_at?: string | null
          id?: string
          status?: string | null
          study_id?: string | null
          user_id?: string | null
        }
        Update: {
          enrolled_at?: string | null
          id?: string
          status?: string | null
          study_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "study_participants_study_id_fkey"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "longitudinal_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      substance_logs: {
        Row: {
          cost: number | null
          craving_intensity: number | null
          created_at: string | null
          environmental_factors: string[] | null
          id: string
          location: string | null
          mood_after: number | null
          mood_before: number | null
          notes: string | null
          physical_symptoms: string[] | null
          quantity: number
          social_context: string | null
          substance_type: Database["public"]["Enums"]["substance_type"]
          success_in_refusing: boolean | null
          trigger_factors: string[] | null
          unit_of_measure: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cost?: number | null
          craving_intensity?: number | null
          created_at?: string | null
          environmental_factors?: string[] | null
          id?: string
          location?: string | null
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          physical_symptoms?: string[] | null
          quantity: number
          social_context?: string | null
          substance_type: Database["public"]["Enums"]["substance_type"]
          success_in_refusing?: boolean | null
          trigger_factors?: string[] | null
          unit_of_measure: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cost?: number | null
          craving_intensity?: number | null
          created_at?: string | null
          environmental_factors?: string[] | null
          id?: string
          location?: string | null
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          physical_symptoms?: string[] | null
          quantity?: number
          social_context?: string | null
          substance_type?: Database["public"]["Enums"]["substance_type"]
          success_in_refusing?: boolean | null
          trigger_factors?: string[] | null
          unit_of_measure?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      supplement_ai_analysis: {
        Row: {
          created_at: string | null
          effectiveness_patterns: Json | null
          id: string
          interaction_warnings: string[] | null
          last_analyzed_at: string | null
          optimal_timing_suggestion: string | null
          research_summary: string | null
          supplement_name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          effectiveness_patterns?: Json | null
          id?: string
          interaction_warnings?: string[] | null
          last_analyzed_at?: string | null
          optimal_timing_suggestion?: string | null
          research_summary?: string | null
          supplement_name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          effectiveness_patterns?: Json | null
          id?: string
          interaction_warnings?: string[] | null
          last_analyzed_at?: string | null
          optimal_timing_suggestion?: string | null
          research_summary?: string | null
          supplement_name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      supplement_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      supplement_category_mappings: {
        Row: {
          category_id: string
          created_at: string | null
          supplement_name: string
          user_id: string
        }
        Insert: {
          category_id: string
          created_at?: string | null
          supplement_name: string
          user_id: string
        }
        Update: {
          category_id?: string
          created_at?: string | null
          supplement_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplement_category_mappings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "supplement_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      supplement_community_insights: {
        Row: {
          content: string
          created_at: string | null
          downvotes: number | null
          id: string
          insight_type: string
          is_expert: boolean | null
          research_url: string | null
          supplement_name: string
          updated_at: string | null
          upvotes: number | null
        }
        Insert: {
          content: string
          created_at?: string | null
          downvotes?: number | null
          id?: string
          insight_type: string
          is_expert?: boolean | null
          research_url?: string | null
          supplement_name: string
          updated_at?: string | null
          upvotes?: number | null
        }
        Update: {
          content?: string
          created_at?: string | null
          downvotes?: number | null
          id?: string
          insight_type?: string
          is_expert?: boolean | null
          research_url?: string | null
          supplement_name?: string
          updated_at?: string | null
          upvotes?: number | null
        }
        Relationships: []
      }
      supplement_correlations: {
        Row: {
          analysis_period_days: number | null
          correlation_score: number | null
          correlation_type: string
          created_at: string | null
          id: string
          supplement_name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          analysis_period_days?: number | null
          correlation_score?: number | null
          correlation_type: string
          created_at?: string | null
          id?: string
          supplement_name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          analysis_period_days?: number | null
          correlation_score?: number | null
          correlation_type?: string
          created_at?: string | null
          id?: string
          supplement_name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      supplement_inventory: {
        Row: {
          created_at: string | null
          id: string
          quantity: number
          reorder_threshold: number | null
          supplement_name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          quantity?: number
          reorder_threshold?: number | null
          supplement_name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          quantity?: number
          reorder_threshold?: number | null
          supplement_name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      supplement_logs: {
        Row: {
          barcode: string | null
          batch_number: string | null
          brand: string | null
          contraindications: string | null
          cost: number | null
          created_at: string | null
          dosage: string
          effectiveness_rating: number | null
          energy_impact: number | null
          expiration_date: string | null
          focus_impact: number | null
          form: string | null
          id: string
          interaction_notes: string | null
          lab_results: Json | null
          mood_impact: number | null
          notes: string | null
          photo_url: string | null
          purchase_location: string | null
          recommended_timing: string[] | null
          reminder_enabled: boolean | null
          reminder_time: string | null
          side_effects: string | null
          sleep_impact: number | null
          source: string | null
          storage_conditions: string | null
          stress_impact: number | null
          supplement_name: string
          time_taken: string
          timing_notes: string | null
          user_id: string | null
          verified_purchase: boolean | null
        }
        Insert: {
          barcode?: string | null
          batch_number?: string | null
          brand?: string | null
          contraindications?: string | null
          cost?: number | null
          created_at?: string | null
          dosage: string
          effectiveness_rating?: number | null
          energy_impact?: number | null
          expiration_date?: string | null
          focus_impact?: number | null
          form?: string | null
          id?: string
          interaction_notes?: string | null
          lab_results?: Json | null
          mood_impact?: number | null
          notes?: string | null
          photo_url?: string | null
          purchase_location?: string | null
          recommended_timing?: string[] | null
          reminder_enabled?: boolean | null
          reminder_time?: string | null
          side_effects?: string | null
          sleep_impact?: number | null
          source?: string | null
          storage_conditions?: string | null
          stress_impact?: number | null
          supplement_name: string
          time_taken: string
          timing_notes?: string | null
          user_id?: string | null
          verified_purchase?: boolean | null
        }
        Update: {
          barcode?: string | null
          batch_number?: string | null
          brand?: string | null
          contraindications?: string | null
          cost?: number | null
          created_at?: string | null
          dosage?: string
          effectiveness_rating?: number | null
          energy_impact?: number | null
          expiration_date?: string | null
          focus_impact?: number | null
          form?: string | null
          id?: string
          interaction_notes?: string | null
          lab_results?: Json | null
          mood_impact?: number | null
          notes?: string | null
          photo_url?: string | null
          purchase_location?: string | null
          recommended_timing?: string[] | null
          reminder_enabled?: boolean | null
          reminder_time?: string | null
          side_effects?: string | null
          sleep_impact?: number | null
          source?: string | null
          storage_conditions?: string | null
          stress_impact?: number | null
          supplement_name?: string
          time_taken?: string
          timing_notes?: string | null
          user_id?: string | null
          verified_purchase?: boolean | null
        }
        Relationships: []
      }
      supplement_stacks: {
        Row: {
          created_at: string | null
          id: string
          name: string
          supplements: string[]
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          supplements: string[]
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          supplements?: string[]
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      support_group_sessions: {
        Row: {
          created_at: string | null
          description: string | null
          duration_minutes: number
          facilitator_id: string | null
          group_id: string | null
          id: string
          max_participants: number | null
          meeting_link: string | null
          session_date: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          facilitator_id?: string | null
          group_id?: string | null
          id?: string
          max_participants?: number | null
          meeting_link?: string | null
          session_date: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number
          facilitator_id?: string | null
          group_id?: string | null
          id?: string
          max_participants?: number | null
          meeting_link?: string | null
          session_date?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_group_sessions_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "support_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      support_groups: {
        Row: {
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          facilitator_id: string | null
          id: string
          is_private: boolean | null
          max_participants: number | null
          meeting_day: string | null
          meeting_frequency: string | null
          meeting_time: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          facilitator_id?: string | null
          id?: string
          is_private?: boolean | null
          max_participants?: number | null
          meeting_day?: string | null
          meeting_frequency?: string | null
          meeting_time?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          facilitator_id?: string | null
          id?: string
          is_private?: boolean | null
          max_participants?: number | null
          meeting_day?: string | null
          meeting_frequency?: string | null
          meeting_time?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_groups_facilitator_fkey"
            columns: ["facilitator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      support_network: {
        Row: {
          contact_info: string | null
          created_at: string | null
          id: string
          is_emergency_contact: boolean | null
          relationship: string
          supporter_name: string
          user_id: string
        }
        Insert: {
          contact_info?: string | null
          created_at?: string | null
          id?: string
          is_emergency_contact?: boolean | null
          relationship: string
          supporter_name: string
          user_id: string
        }
        Update: {
          contact_info?: string | null
          created_at?: string | null
          id?: string
          is_emergency_contact?: boolean | null
          relationship?: string
          supporter_name?: string
          user_id?: string
        }
        Relationships: []
      }
      support_resources: {
        Row: {
          content_url: string | null
          created_at: string
          description: string
          id: string
          resource_type: string | null
          tags: string[] | null
          title: string
        }
        Insert: {
          content_url?: string | null
          created_at?: string
          description: string
          id?: string
          resource_type?: string | null
          tags?: string[] | null
          title: string
        }
        Update: {
          content_url?: string | null
          created_at?: string
          description?: string
          id?: string
          resource_type?: string | null
          tags?: string[] | null
          title?: string
        }
        Relationships: []
      }
      support_sessions: {
        Row: {
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          host_id: string | null
          id: string
          is_private: boolean | null
          max_participants: number | null
          meeting_link: string | null
          session_date: string
          session_type: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          host_id?: string | null
          id?: string
          is_private?: boolean | null
          max_participants?: number | null
          meeting_link?: string | null
          session_date: string
          session_type: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          host_id?: string | null
          id?: string
          is_private?: boolean | null
          max_participants?: number | null
          meeting_link?: string | null
          session_date?: string
          session_type?: string
          title?: string
        }
        Relationships: []
      }
      survey_responses: {
        Row: {
          completed_at: string | null
          completion_time: number | null
          created_at: string | null
          device_info: Json | null
          id: string
          page_sequence: Json | null
          page_times: Json | null
          participant_id: string
          response_metadata: Json | null
          responses: Json
          survey_id: string
        }
        Insert: {
          completed_at?: string | null
          completion_time?: number | null
          created_at?: string | null
          device_info?: Json | null
          id?: string
          page_sequence?: Json | null
          page_times?: Json | null
          participant_id: string
          response_metadata?: Json | null
          responses: Json
          survey_id: string
        }
        Update: {
          completed_at?: string | null
          completion_time?: number | null
          created_at?: string | null
          device_info?: Json | null
          id?: string
          page_sequence?: Json | null
          page_times?: Json | null
          participant_id?: string
          response_metadata?: Json | null
          responses?: Json
          survey_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "survey_responses_survey_id_fkey"
            columns: ["survey_id"]
            isOneToOne: false
            referencedRelation: "surveys"
            referencedColumns: ["id"]
          },
        ]
      }
      survey_templates: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          questions: Json
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          questions?: Json
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          questions?: Json
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      surveys: {
        Row: {
          allow_save_continue: boolean | null
          branching_logic: Json | null
          completion_message: string | null
          created_at: string | null
          custom_styles: Json | null
          description: string | null
          end_date: string | null
          frequency: string | null
          id: string
          is_active: boolean | null
          layout_theme: string | null
          progress_bar: boolean | null
          question_numbering: boolean | null
          questions: Json
          randomize_questions: boolean | null
          required_login: boolean | null
          schedule_type: string
          start_date: string | null
          survey_logic: Json | null
          survey_theme: Json | null
          title: string
          updated_at: string | null
          user_id: string
          welcome_message: string | null
        }
        Insert: {
          allow_save_continue?: boolean | null
          branching_logic?: Json | null
          completion_message?: string | null
          created_at?: string | null
          custom_styles?: Json | null
          description?: string | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          layout_theme?: string | null
          progress_bar?: boolean | null
          question_numbering?: boolean | null
          questions?: Json
          randomize_questions?: boolean | null
          required_login?: boolean | null
          schedule_type?: string
          start_date?: string | null
          survey_logic?: Json | null
          survey_theme?: Json | null
          title: string
          updated_at?: string | null
          user_id: string
          welcome_message?: string | null
        }
        Update: {
          allow_save_continue?: boolean | null
          branching_logic?: Json | null
          completion_message?: string | null
          created_at?: string | null
          custom_styles?: Json | null
          description?: string | null
          end_date?: string | null
          frequency?: string | null
          id?: string
          is_active?: boolean | null
          layout_theme?: string | null
          progress_bar?: boolean | null
          question_numbering?: boolean | null
          questions?: Json
          randomize_questions?: boolean | null
          required_login?: boolean | null
          schedule_type?: string
          start_date?: string | null
          survey_logic?: Json | null
          survey_theme?: Json | null
          title?: string
          updated_at?: string | null
          user_id?: string
          welcome_message?: string | null
        }
        Relationships: []
      }
      tailored_recommendations: {
        Row: {
          category: string
          condition: Database["public"]["Enums"]["health_condition"]
          created_at: string | null
          description: string
          id: string
          priority: number | null
          title: string
        }
        Insert: {
          category: string
          condition: Database["public"]["Enums"]["health_condition"]
          created_at?: string | null
          description: string
          id?: string
          priority?: number | null
          title: string
        }
        Update: {
          category?: string
          condition?: Database["public"]["Enums"]["health_condition"]
          created_at?: string | null
          description?: string
          id?: string
          priority?: number | null
          title?: string
        }
        Relationships: []
      }
      target_personas: {
        Row: {
          created_at: string
          description: string
          headline: string
          id: string
          key_benefits: string[]
          persona_type: string
          recommended_tools: string[]
        }
        Insert: {
          created_at?: string
          description: string
          headline: string
          id?: string
          key_benefits: string[]
          persona_type: string
          recommended_tools: string[]
        }
        Update: {
          created_at?: string
          description?: string
          headline?: string
          id?: string
          key_benefits?: string[]
          persona_type?: string
          recommended_tools?: string[]
        }
        Relationships: []
      }
      task_completion_patterns: {
        Row: {
          coping_strategies: Json | null
          created_at: string | null
          difficulty_patterns: Json | null
          distraction_triggers: Json | null
          environment_factors: Json | null
          id: string
          success_rate: number | null
          time_of_day: string[] | null
          user_id: string | null
        }
        Insert: {
          coping_strategies?: Json | null
          created_at?: string | null
          difficulty_patterns?: Json | null
          distraction_triggers?: Json | null
          environment_factors?: Json | null
          id?: string
          success_rate?: number | null
          time_of_day?: string[] | null
          user_id?: string | null
        }
        Update: {
          coping_strategies?: Json | null
          created_at?: string | null
          difficulty_patterns?: Json | null
          distraction_triggers?: Json | null
          environment_factors?: Json | null
          id?: string
          success_rate?: number | null
          time_of_day?: string[] | null
          user_id?: string | null
        }
        Relationships: []
      }
      task_prioritization: {
        Row: {
          created_at: string | null
          energy_required: number | null
          id: string
          importance_level: number
          quadrant: number
          task_id: string
          updated_at: string | null
          urgency_level: number
        }
        Insert: {
          created_at?: string | null
          energy_required?: number | null
          id?: string
          importance_level: number
          quadrant: number
          task_id: string
          updated_at?: string | null
          urgency_level: number
        }
        Update: {
          created_at?: string | null
          energy_required?: number | null
          id?: string
          importance_level?: number
          quadrant?: number
          task_id?: string
          updated_at?: string | null
          urgency_level?: number
        }
        Relationships: [
          {
            foreignKeyName: "task_prioritization_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_switching_strategies: {
        Row: {
          context_tags: string[] | null
          created_at: string | null
          description: string | null
          effectiveness_rating: number | null
          environmental_adjustments: Json | null
          id: string
          mindfulness_elements: Json | null
          physical_elements: Json | null
          strategy_name: string
          strategy_type: string
          success_metrics: Json | null
          trigger_patterns: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          context_tags?: string[] | null
          created_at?: string | null
          description?: string | null
          effectiveness_rating?: number | null
          environmental_adjustments?: Json | null
          id?: string
          mindfulness_elements?: Json | null
          physical_elements?: Json | null
          strategy_name: string
          strategy_type: string
          success_metrics?: Json | null
          trigger_patterns?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          context_tags?: string[] | null
          created_at?: string | null
          description?: string | null
          effectiveness_rating?: number | null
          environmental_adjustments?: Json | null
          id?: string
          mindfulness_elements?: Json | null
          physical_elements?: Json | null
          strategy_name?: string
          strategy_type?: string
          success_metrics?: Json | null
          trigger_patterns?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      task_time_estimates: {
        Row: {
          accuracy_score: number | null
          actual_time: number | null
          context_factors: Json | null
          created_at: string | null
          estimated_time: number | null
          id: string
          task_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          accuracy_score?: number | null
          actual_time?: number | null
          context_factors?: Json | null
          created_at?: string | null
          estimated_time?: number | null
          id?: string
          task_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          accuracy_score?: number | null
          actual_time?: number | null
          context_factors?: Json | null
          created_at?: string | null
          estimated_time?: number | null
          id?: string
          task_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_time_estimates_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_transitions: {
        Row: {
          created_at: string | null
          difficulty_rating: number | null
          from_task_id: string | null
          id: string
          strategies_used: Json | null
          success_factors: Json | null
          to_task_id: string | null
          transition_duration: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          difficulty_rating?: number | null
          from_task_id?: string | null
          id?: string
          strategies_used?: Json | null
          success_factors?: Json | null
          to_task_id?: string | null
          transition_duration?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          difficulty_rating?: number | null
          from_task_id?: string | null
          id?: string
          strategies_used?: Json | null
          success_factors?: Json | null
          to_task_id?: string | null
          transition_duration?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "task_transitions_from_task_id_fkey"
            columns: ["from_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_transitions_to_task_id_fkey"
            columns: ["to_task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          status: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tea_articles: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          featured_image: string | null
          id: string
          meta_description: string | null
          meta_keywords: string[] | null
          published: boolean | null
          published_at: string | null
          slug: string
          tea_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          meta_keywords?: string[] | null
          published?: boolean | null
          published_at?: string | null
          slug: string
          tea_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          featured_image?: string | null
          id?: string
          meta_description?: string | null
          meta_keywords?: string[] | null
          published?: boolean | null
          published_at?: string | null
          slug?: string
          tea_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tea_articles_tea_id_fkey"
            columns: ["tea_id"]
            isOneToOne: false
            referencedRelation: "herbal_teas"
            referencedColumns: ["id"]
          },
        ]
      }
      tea_brewing_guides: {
        Row: {
          common_mistakes: string[] | null
          created_at: string | null
          equipment_recommendations: string[] | null
          id: string
          leaf_to_water_ratio: string | null
          multiple_infusions_guide: Json | null
          steep_time_range_seconds: number[] | null
          tea_type: string
          tips_and_tricks: string[] | null
          updated_at: string | null
          water_quality_notes: string | null
          water_temperature_celsius: number | null
        }
        Insert: {
          common_mistakes?: string[] | null
          created_at?: string | null
          equipment_recommendations?: string[] | null
          id?: string
          leaf_to_water_ratio?: string | null
          multiple_infusions_guide?: Json | null
          steep_time_range_seconds?: number[] | null
          tea_type: string
          tips_and_tricks?: string[] | null
          updated_at?: string | null
          water_quality_notes?: string | null
          water_temperature_celsius?: number | null
        }
        Update: {
          common_mistakes?: string[] | null
          created_at?: string | null
          equipment_recommendations?: string[] | null
          id?: string
          leaf_to_water_ratio?: string | null
          multiple_infusions_guide?: Json | null
          steep_time_range_seconds?: number[] | null
          tea_type?: string
          tips_and_tricks?: string[] | null
          updated_at?: string | null
          water_quality_notes?: string | null
          water_temperature_celsius?: number | null
        }
        Relationships: []
      }
      tea_compounds: {
        Row: {
          benefits: string[] | null
          created_at: string | null
          description: string
          id: string
          name: string
          research_links: string[] | null
          scientific_name: string | null
          updated_at: string | null
        }
        Insert: {
          benefits?: string[] | null
          created_at?: string | null
          description: string
          id?: string
          name: string
          research_links?: string[] | null
          scientific_name?: string | null
          updated_at?: string | null
        }
        Update: {
          benefits?: string[] | null
          created_at?: string | null
          description?: string
          id?: string
          name?: string
          research_links?: string[] | null
          scientific_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tea_equipment: {
        Row: {
          best_for: string[] | null
          capacity: string | null
          care_instructions: string[] | null
          category: string
          cons: string[] | null
          created_at: string | null
          description: string
          id: string
          image_url: string | null
          material: string | null
          name: string
          price_range: string | null
          pros: string[] | null
          specifications: Json | null
          updated_at: string | null
        }
        Insert: {
          best_for?: string[] | null
          capacity?: string | null
          care_instructions?: string[] | null
          category: string
          cons?: string[] | null
          created_at?: string | null
          description: string
          id?: string
          image_url?: string | null
          material?: string | null
          name: string
          price_range?: string | null
          pros?: string[] | null
          specifications?: Json | null
          updated_at?: string | null
        }
        Update: {
          best_for?: string[] | null
          capacity?: string | null
          care_instructions?: string[] | null
          category?: string
          cons?: string[] | null
          created_at?: string | null
          description?: string
          id?: string
          image_url?: string | null
          material?: string | null
          name?: string
          price_range?: string | null
          pros?: string[] | null
          specifications?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tea_metrics: {
        Row: {
          consumed_at: string | null
          created_at: string | null
          dosage_grams: number | null
          effects: string[] | null
          energy_after: number | null
          energy_before: number | null
          focus_after: number | null
          focus_before: number | null
          id: string
          mood_after: number | null
          mood_before: number | null
          notes: string | null
          side_effects: string[] | null
          steep_time_seconds: number | null
          tea_id: string | null
          updated_at: string | null
          user_id: string | null
          water_temperature_celsius: number | null
        }
        Insert: {
          consumed_at?: string | null
          created_at?: string | null
          dosage_grams?: number | null
          effects?: string[] | null
          energy_after?: number | null
          energy_before?: number | null
          focus_after?: number | null
          focus_before?: number | null
          id?: string
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          side_effects?: string[] | null
          steep_time_seconds?: number | null
          tea_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          water_temperature_celsius?: number | null
        }
        Update: {
          consumed_at?: string | null
          created_at?: string | null
          dosage_grams?: number | null
          effects?: string[] | null
          energy_after?: number | null
          energy_before?: number | null
          focus_after?: number | null
          focus_before?: number | null
          id?: string
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          side_effects?: string[] | null
          steep_time_seconds?: number | null
          tea_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          water_temperature_celsius?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tea_metrics_tea_id_fkey"
            columns: ["tea_id"]
            isOneToOne: false
            referencedRelation: "herbal_teas"
            referencedColumns: ["id"]
          },
        ]
      }
      tea_nutrition_facts: {
        Row: {
          amino_acids: Json | null
          antioxidant_content_mg: number | null
          caffeine_content_mg: number | null
          calories: number | null
          created_at: string | null
          id: string
          minerals: Json | null
          serving_size_grams: number
          tea_id: string | null
          total_polyphenols_mg: number | null
          updated_at: string | null
          vitamins: Json | null
        }
        Insert: {
          amino_acids?: Json | null
          antioxidant_content_mg?: number | null
          caffeine_content_mg?: number | null
          calories?: number | null
          created_at?: string | null
          id?: string
          minerals?: Json | null
          serving_size_grams: number
          tea_id?: string | null
          total_polyphenols_mg?: number | null
          updated_at?: string | null
          vitamins?: Json | null
        }
        Update: {
          amino_acids?: Json | null
          antioxidant_content_mg?: number | null
          caffeine_content_mg?: number | null
          calories?: number | null
          created_at?: string | null
          id?: string
          minerals?: Json | null
          serving_size_grams?: number
          tea_id?: string | null
          total_polyphenols_mg?: number | null
          updated_at?: string | null
          vitamins?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "tea_nutrition_facts_tea_id_fkey"
            columns: ["tea_id"]
            isOneToOne: false
            referencedRelation: "herbal_teas"
            referencedColumns: ["id"]
          },
        ]
      }
      tea_price_alerts: {
        Row: {
          alert_active: boolean | null
          alert_triggered: boolean | null
          created_at: string | null
          current_price: number | null
          id: string
          target_price: number
          tea_id: string | null
          updated_at: string | null
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          alert_active?: boolean | null
          alert_triggered?: boolean | null
          created_at?: string | null
          current_price?: number | null
          id?: string
          target_price: number
          tea_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          alert_active?: boolean | null
          alert_triggered?: boolean | null
          created_at?: string | null
          current_price?: number | null
          id?: string
          target_price?: number
          tea_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tea_price_alerts_tea_id_fkey"
            columns: ["tea_id"]
            isOneToOne: false
            referencedRelation: "herbal_teas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tea_price_alerts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "tea_vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      tea_recommendations: {
        Row: {
          contraindications: string[] | null
          created_at: string | null
          effectiveness_score: number | null
          goal_type: string
          id: string
          optimal_time_of_day: string[] | null
          scientific_evidence: string[] | null
          tea_id: string | null
          updated_at: string | null
        }
        Insert: {
          contraindications?: string[] | null
          created_at?: string | null
          effectiveness_score?: number | null
          goal_type: string
          id?: string
          optimal_time_of_day?: string[] | null
          scientific_evidence?: string[] | null
          tea_id?: string | null
          updated_at?: string | null
        }
        Update: {
          contraindications?: string[] | null
          created_at?: string | null
          effectiveness_score?: number | null
          goal_type?: string
          id?: string
          optimal_time_of_day?: string[] | null
          scientific_evidence?: string[] | null
          tea_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tea_recommendations_tea_id_fkey"
            columns: ["tea_id"]
            isOneToOne: false
            referencedRelation: "herbal_teas"
            referencedColumns: ["id"]
          },
        ]
      }
      tea_reviews: {
        Row: {
          aroma_rating: number | null
          created_at: string | null
          effects_rating: number | null
          id: string
          rating: number | null
          review_text: string | null
          taste_rating: number | null
          tea_id: string | null
          updated_at: string | null
          user_id: string | null
          value_rating: number | null
          vendor_id: string | null
          verified_purchase: boolean | null
        }
        Insert: {
          aroma_rating?: number | null
          created_at?: string | null
          effects_rating?: number | null
          id?: string
          rating?: number | null
          review_text?: string | null
          taste_rating?: number | null
          tea_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          value_rating?: number | null
          vendor_id?: string | null
          verified_purchase?: boolean | null
        }
        Update: {
          aroma_rating?: number | null
          created_at?: string | null
          effects_rating?: number | null
          id?: string
          rating?: number | null
          review_text?: string | null
          taste_rating?: number | null
          tea_id?: string | null
          updated_at?: string | null
          user_id?: string | null
          value_rating?: number | null
          vendor_id?: string | null
          verified_purchase?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "tea_reviews_tea_id_fkey"
            columns: ["tea_id"]
            isOneToOne: false
            referencedRelation: "herbal_teas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tea_reviews_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "tea_vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      tea_vendor_products: {
        Row: {
          created_at: string | null
          id: string
          price: number
          tea_id: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          price: number
          tea_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          price?: number
          tea_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tea_vendor_products_tea_id_fkey"
            columns: ["tea_id"]
            isOneToOne: false
            referencedRelation: "herbal_teas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tea_vendor_products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "tea_vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      tea_vendors: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          rating: number | null
          review_count: number | null
          shipping_regions: string[] | null
          updated_at: string | null
          verification_status: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          rating?: number | null
          review_count?: number | null
          shipping_regions?: string[] | null
          updated_at?: string | null
          verification_status?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          rating?: number | null
          review_count?: number | null
          shipping_regions?: string[] | null
          updated_at?: string | null
          verification_status?: string | null
          website?: string | null
        }
        Relationships: []
      }
      teas: {
        Row: {
          brewing_instructions: string | null
          caffeine_content: string | null
          compounds: string[] | null
          created_at: string
          description: string
          health_benefits: string[] | null
          id: string
          name: string
          origin: string | null
          type: string
          updated_at: string
        }
        Insert: {
          brewing_instructions?: string | null
          caffeine_content?: string | null
          compounds?: string[] | null
          created_at?: string
          description: string
          health_benefits?: string[] | null
          id?: string
          name: string
          origin?: string | null
          type: string
          updated_at?: string
        }
        Update: {
          brewing_instructions?: string | null
          caffeine_content?: string | null
          compounds?: string[] | null
          created_at?: string
          description?: string
          health_benefits?: string[] | null
          id?: string
          name?: string
          origin?: string | null
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      thought_records: {
        Row: {
          automatic_thoughts: string[] | null
          cognitive_distortions: string[] | null
          created_at: string | null
          emotion_intensities: number[] | null
          emotions: string[] | null
          entry_date: string | null
          id: string
          outcome: string | null
          rational_responses: string[] | null
          situation: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          automatic_thoughts?: string[] | null
          cognitive_distortions?: string[] | null
          created_at?: string | null
          emotion_intensities?: number[] | null
          emotions?: string[] | null
          entry_date?: string | null
          id?: string
          outcome?: string | null
          rational_responses?: string[] | null
          situation: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          automatic_thoughts?: string[] | null
          cognitive_distortions?: string[] | null
          created_at?: string | null
          emotion_intensities?: number[] | null
          emotions?: string[] | null
          entry_date?: string | null
          id?: string
          outcome?: string | null
          rational_responses?: string[] | null
          situation?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      timeline_events: {
        Row: {
          created_at: string
          date_label: string
          description: string
          id: string
          importance_level: number | null
          related_characters: string[] | null
          related_realms: string[] | null
          title: string
        }
        Insert: {
          created_at?: string
          date_label: string
          description: string
          id?: string
          importance_level?: number | null
          related_characters?: string[] | null
          related_realms?: string[] | null
          title: string
        }
        Update: {
          created_at?: string
          date_label?: string
          description?: string
          id?: string
          importance_level?: number | null
          related_characters?: string[] | null
          related_realms?: string[] | null
          title?: string
        }
        Relationships: []
      }
      tool_analytics: {
        Row: {
          completed_actions: number | null
          created_at: string
          feedback: string | null
          id: string
          rating: number | null
          session_duration: number | null
          tool_name: string
          user_id: string | null
        }
        Insert: {
          completed_actions?: number | null
          created_at?: string
          feedback?: string | null
          id?: string
          rating?: number | null
          session_duration?: number | null
          tool_name: string
          user_id?: string | null
        }
        Update: {
          completed_actions?: number | null
          created_at?: string
          feedback?: string | null
          id?: string
          rating?: number | null
          session_duration?: number | null
          tool_name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      tool_reviews: {
        Row: {
          created_at: string | null
          helpful_count: number | null
          id: string
          rating: number
          review_text: string | null
          tool_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          rating: number
          review_text?: string | null
          tool_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          rating?: number
          review_text?: string | null
          tool_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tool_reviews_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "web_tools"
            referencedColumns: ["id"]
          },
        ]
      }
      tool_types: {
        Row: {
          category: Database["public"]["Enums"]["tool_category"]
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["tool_category"]
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["tool_category"]
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      tool_usage_logs: {
        Row: {
          audio_settings: Json | null
          created_at: string | null
          device_type: string | null
          id: string
          session_duration: number | null
          settings: Json | null
          tool_name: string
          tool_type: string
          user_id: string | null
        }
        Insert: {
          audio_settings?: Json | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          session_duration?: number | null
          settings?: Json | null
          tool_name: string
          tool_type: string
          user_id?: string | null
        }
        Update: {
          audio_settings?: Json | null
          created_at?: string | null
          device_type?: string | null
          id?: string
          session_duration?: number | null
          settings?: Json | null
          tool_name?: string
          tool_type?: string
          user_id?: string | null
        }
        Relationships: []
      }
      topics: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      transaction_fees: {
        Row: {
          created_at: string | null
          description: string | null
          fee_fixed: number
          fee_percentage: number
          id: string
          max_fee: number | null
          min_fee: number | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          fee_fixed?: number
          fee_percentage: number
          id?: string
          max_fee?: number | null
          min_fee?: number | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          fee_fixed?: number
          fee_percentage?: number
          id?: string
          max_fee?: number | null
          min_fee?: number | null
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          commission_amount: number
          created_at: string | null
          customer_id: string | null
          id: string
          status: string
          stripe_payment_intent_id: string | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          amount: number
          commission_amount: number
          created_at?: string | null
          customer_id?: string | null
          id?: string
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          amount?: number
          commission_amount?: number
          created_at?: string | null
          customer_id?: string | null
          id?: string
          status?: string
          stripe_payment_intent_id?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      treatment_plans: {
        Row: {
          client_id: string | null
          created_at: string | null
          description: string | null
          end_date: string | null
          goals: Json | null
          id: string
          interventions: Json | null
          professional_id: string | null
          start_date: string | null
          status: string
          title: string
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          goals?: Json | null
          id?: string
          interventions?: Json | null
          professional_id?: string | null
          start_date?: string | null
          status?: string
          title: string
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          goals?: Json | null
          id?: string
          interventions?: Json | null
          professional_id?: string | null
          start_date?: string | null
          status?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tree_testing_responses: {
        Row: {
          completion_time: number | null
          created_at: string | null
          id: string
          participant_id: string | null
          study_id: string | null
          success_rate: number | null
          task_responses: Json
        }
        Insert: {
          completion_time?: number | null
          created_at?: string | null
          id?: string
          participant_id?: string | null
          study_id?: string | null
          success_rate?: number | null
          task_responses: Json
        }
        Update: {
          completion_time?: number | null
          created_at?: string | null
          id?: string
          participant_id?: string | null
          study_id?: string | null
          success_rate?: number | null
          task_responses?: Json
        }
        Relationships: [
          {
            foreignKeyName: "tree_testing_responses_study_id_fkey"
            columns: ["study_id"]
            isOneToOne: false
            referencedRelation: "tree_testing_studies"
            referencedColumns: ["id"]
          },
        ]
      }
      tree_testing_studies: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          instructions: string | null
          tasks: Json | null
          title: string
          tree_structure: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          instructions?: string | null
          tasks?: Json | null
          title: string
          tree_structure?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          instructions?: string | null
          tasks?: Json | null
          title?: string
          tree_structure?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      trigger_patterns: {
        Row: {
          coping_strategies: string[] | null
          created_at: string | null
          emotional_state: string[] | null
          frequency: number | null
          id: string
          location_patterns: string[] | null
          social_context: string[] | null
          success_rate: number | null
          time_patterns: Json | null
          trigger_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          coping_strategies?: string[] | null
          created_at?: string | null
          emotional_state?: string[] | null
          frequency?: number | null
          id?: string
          location_patterns?: string[] | null
          social_context?: string[] | null
          success_rate?: number | null
          time_patterns?: Json | null
          trigger_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          coping_strategies?: string[] | null
          created_at?: string | null
          emotional_state?: string[] | null
          frequency?: number | null
          id?: string
          location_patterns?: string[] | null
          social_context?: string[] | null
          success_rate?: number | null
          time_patterns?: Json | null
          trigger_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      usability_test_sessions: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          recording_enabled: boolean | null
          scenario: string | null
          screen_recording_enabled: boolean | null
          tasks: Json | null
          test_type: string
          think_aloud_enabled: boolean | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          recording_enabled?: boolean | null
          scenario?: string | null
          screen_recording_enabled?: boolean | null
          tasks?: Json | null
          test_type: string
          think_aloud_enabled?: boolean | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          recording_enabled?: boolean | null
          scenario?: string | null
          screen_recording_enabled?: boolean | null
          tasks?: Json | null
          test_type?: string
          think_aloud_enabled?: boolean | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_data: Json | null
          achievement_type: string
          created_at: string
          id: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          achievement_data?: Json | null
          achievement_type: string
          created_at?: string
          id?: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          achievement_data?: Json | null
          achievement_type?: string
          created_at?: string
          id?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_bathing_logs: {
        Row: {
          created_at: string
          duration_minutes: number | null
          energy_level_after: number | null
          energy_level_before: number | null
          id: string
          mood_after: number | null
          mood_before: number | null
          notes: string | null
          routine_id: string | null
          sleep_quality_impact: number | null
          stress_level_after: number | null
          stress_level_before: number | null
          user_id: string
          water_temperature: string | null
          weather_comfort_rating: number | null
          weather_data: Json | null
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          energy_level_after?: number | null
          energy_level_before?: number | null
          id?: string
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          routine_id?: string | null
          sleep_quality_impact?: number | null
          stress_level_after?: number | null
          stress_level_before?: number | null
          user_id: string
          water_temperature?: string | null
          weather_comfort_rating?: number | null
          weather_data?: Json | null
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          energy_level_after?: number | null
          energy_level_before?: number | null
          id?: string
          mood_after?: number | null
          mood_before?: number | null
          notes?: string | null
          routine_id?: string | null
          sleep_quality_impact?: number | null
          stress_level_after?: number | null
          stress_level_before?: number | null
          user_id?: string
          water_temperature?: string | null
          weather_comfort_rating?: number | null
          weather_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "user_bathing_logs_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "bathing_routines"
            referencedColumns: ["id"]
          },
        ]
      }
      user_blocking_preferences: {
        Row: {
          created_at: string | null
          custom_settings: Json | null
          enable_ai_suggestions: boolean | null
          enable_analytics: boolean | null
          strict_mode: boolean | null
          updated_at: string | null
          user_id: string
          whitelist: string[] | null
        }
        Insert: {
          created_at?: string | null
          custom_settings?: Json | null
          enable_ai_suggestions?: boolean | null
          enable_analytics?: boolean | null
          strict_mode?: boolean | null
          updated_at?: string | null
          user_id: string
          whitelist?: string[] | null
        }
        Update: {
          created_at?: string | null
          custom_settings?: Json | null
          enable_ai_suggestions?: boolean | null
          enable_analytics?: boolean | null
          strict_mode?: boolean | null
          updated_at?: string | null
          user_id?: string
          whitelist?: string[] | null
        }
        Relationships: []
      }
      user_bookmarks: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_caffeine_logs: {
        Row: {
          amount: number
          consumed_at: string
          created_at: string
          energy_level: number | null
          id: string
          mood_impact: number | null
          notes: string | null
          product_id: string | null
          side_effects: string[] | null
          user_id: string
        }
        Insert: {
          amount: number
          consumed_at?: string
          created_at?: string
          energy_level?: number | null
          id?: string
          mood_impact?: number | null
          notes?: string | null
          product_id?: string | null
          side_effects?: string[] | null
          user_id: string
        }
        Update: {
          amount?: number
          consumed_at?: string
          created_at?: string
          energy_level?: number | null
          id?: string
          mood_impact?: number | null
          notes?: string | null
          product_id?: string | null
          side_effects?: string[] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_caffeine_logs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "caffeine_products"
            referencedColumns: ["id"]
          },
        ]
      }
      user_content_preferences: {
        Row: {
          age_verified: boolean | null
          age_verified_at: string | null
          created_at: string | null
          hide_nicotine_warnings: boolean | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          age_verified?: boolean | null
          age_verified_at?: string | null
          created_at?: string | null
          hide_nicotine_warnings?: boolean | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          age_verified?: boolean | null
          age_verified_at?: string | null
          created_at?: string | null
          hide_nicotine_warnings?: boolean | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_devices: {
        Row: {
          created_at: string | null
          device_token: string
          id: string
          last_seen: string | null
          platform: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          device_token: string
          id?: string
          last_seen?: string | null
          platform: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          device_token?: string
          id?: string
          last_seen?: string | null
          platform?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_favorite_routines: {
        Row: {
          created_at: string
          id: string
          routine_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          routine_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          routine_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_favorite_routines_routine_id_fkey"
            columns: ["routine_id"]
            isOneToOne: false
            referencedRelation: "bathing_routines"
            referencedColumns: ["id"]
          },
        ]
      }
      user_filter_subscriptions: {
        Row: {
          created_at: string | null
          filter_list_id: string | null
          id: string
          is_enabled: boolean | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          filter_list_id?: string | null
          id?: string
          is_enabled?: boolean | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          filter_list_id?: string | null
          id?: string
          is_enabled?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_filter_subscriptions_filter_list_id_fkey"
            columns: ["filter_list_id"]
            isOneToOne: false
            referencedRelation: "ad_blocking_filter_lists"
            referencedColumns: ["id"]
          },
        ]
      }
      user_follows: {
        Row: {
          created_at: string | null
          follower_id: string | null
          following_id: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string | null
          following_id?: string | null
          id?: string
        }
        Relationships: []
      }
      user_health_conditions: {
        Row: {
          conditions: Database["public"]["Enums"]["health_condition"][]
          created_at: string | null
          id: string
          needs_energy_support: boolean | null
          needs_focus_support: boolean | null
          updated_at: string | null
          user_id: string
          weather_sensitive: boolean | null
          weather_triggers: Json | null
        }
        Insert: {
          conditions?: Database["public"]["Enums"]["health_condition"][]
          created_at?: string | null
          id?: string
          needs_energy_support?: boolean | null
          needs_focus_support?: boolean | null
          updated_at?: string | null
          user_id: string
          weather_sensitive?: boolean | null
          weather_triggers?: Json | null
        }
        Update: {
          conditions?: Database["public"]["Enums"]["health_condition"][]
          created_at?: string | null
          id?: string
          needs_energy_support?: boolean | null
          needs_focus_support?: boolean | null
          updated_at?: string | null
          user_id?: string
          weather_sensitive?: boolean | null
          weather_triggers?: Json | null
        }
        Relationships: []
      }
      user_highlights: {
        Row: {
          book: string
          chapter: number
          color: string
          created_at: string
          id: string
          user_id: string
          verse: number
        }
        Insert: {
          book: string
          chapter: number
          color?: string
          created_at?: string
          id?: string
          user_id: string
          verse: number
        }
        Update: {
          book?: string
          chapter?: number
          color?: string
          created_at?: string
          id?: string
          user_id?: string
          verse?: number
        }
        Relationships: []
      }
      user_life_situations: {
        Row: {
          id: string
          notes: string | null
          situation: Database["public"]["Enums"]["life_situation"]
          started_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          notes?: string | null
          situation?: Database["public"]["Enums"]["life_situation"]
          started_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          notes?: string | null
          situation?: Database["public"]["Enums"]["life_situation"]
          started_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_memberships: {
        Row: {
          auto_renew: boolean | null
          created_at: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          payment_status: string | null
          start_date: string
          tier_id: string | null
          user_id: string | null
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          payment_status?: string | null
          start_date?: string
          tier_id?: string | null
          user_id?: string | null
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          payment_status?: string | null
          start_date?: string
          tier_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_memberships_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "membership_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notes: {
        Row: {
          book: string
          chapter: number
          created_at: string
          id: string
          note_text: string
          updated_at: string
          user_id: string
          verse: number
        }
        Insert: {
          book: string
          chapter: number
          created_at?: string
          id?: string
          note_text: string
          updated_at?: string
          user_id: string
          verse: number
        }
        Update: {
          book?: string
          chapter?: number
          created_at?: string
          id?: string
          note_text?: string
          updated_at?: string
          user_id?: string
          verse?: number
        }
        Relationships: []
      }
      user_nrt_progress: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          notes: string | null
          started_at: string | null
          step_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          started_at?: string | null
          step_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          started_at?: string | null
          step_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_nrt_progress_step_id_fkey"
            columns: ["step_id"]
            isOneToOne: false
            referencedRelation: "nrt_guide_steps"
            referencedColumns: ["id"]
          },
        ]
      }
      user_points: {
        Row: {
          id: string
          lifetime_points: number | null
          points: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          lifetime_points?: number | null
          points?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          lifetime_points?: number | null
          points?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string | null
          id: string
          interaction_history: Json | null
          preferred_categories: string[] | null
          preferred_product_types: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          interaction_history?: Json | null
          preferred_categories?: string[] | null
          preferred_product_types?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          interaction_history?: Json | null
          preferred_categories?: string[] | null
          preferred_product_types?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_product_lists: {
        Row: {
          created_at: string | null
          id: string
          is_public: boolean | null
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          id: string
          preferred_version: string | null
          theme_preference: string | null
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          id: string
          preferred_version?: string | null
          theme_preference?: string | null
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          preferred_version?: string | null
          theme_preference?: string | null
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      user_quiz_results: {
        Row: {
          answers_data: Json | null
          completed_at: string
          id: string
          quiz_id: string | null
          score: number
          user_id: string
        }
        Insert: {
          answers_data?: Json | null
          completed_at?: string
          id?: string
          quiz_id?: string | null
          score: number
          user_id: string
        }
        Update: {
          answers_data?: Json | null
          completed_at?: string
          id?: string
          quiz_id?: string | null
          score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_quiz_results_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_reading_progress: {
        Row: {
          completed_readings: Json | null
          created_at: string
          current_day: number | null
          id: string
          last_read_at: string | null
          plan_id: string | null
          streak_count: number | null
          user_id: string
        }
        Insert: {
          completed_readings?: Json | null
          created_at?: string
          current_day?: number | null
          id?: string
          last_read_at?: string | null
          plan_id?: string | null
          streak_count?: number | null
          user_id: string
        }
        Update: {
          completed_readings?: Json | null
          created_at?: string
          current_day?: number | null
          id?: string
          last_read_at?: string | null
          plan_id?: string | null
          streak_count?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_reading_progress_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "reading_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_rewards: {
        Row: {
          claimed_at: string | null
          id: string
          reward_id: string | null
          user_id: string | null
        }
        Insert: {
          claimed_at?: string | null
          id?: string
          reward_id?: string | null
          user_id?: string | null
        }
        Update: {
          claimed_at?: string | null
          id?: string
          reward_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_rewards_reward_id_fkey"
            columns: ["reward_id"]
            isOneToOne: false
            referencedRelation: "wellness_rewards"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_saved_plans: {
        Row: {
          customizations: Json | null
          id: string
          is_active: boolean | null
          plan_id: string
          saved_at: string
          user_id: string
        }
        Insert: {
          customizations?: Json | null
          id?: string
          is_active?: boolean | null
          plan_id: string
          saved_at?: string
          user_id: string
        }
        Update: {
          customizations?: Json | null
          id?: string
          is_active?: boolean | null
          plan_id?: string
          saved_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_saved_plans_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "energy_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_saved_plans_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_settings: {
        Row: {
          created_at: string | null
          feature_preferences: Json | null
          id: string
          layout_preference: Json | null
          notification_settings: Json | null
          theme_preference: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          feature_preferences?: Json | null
          id?: string
          layout_preference?: Json | null
          notification_settings?: Json | null
          theme_preference?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          feature_preferences?: Json | null
          id?: string
          layout_preference?: Json | null
          notification_settings?: Json | null
          theme_preference?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_sleep_profiles: {
        Row: {
          created_at: string | null
          id: string
          light_preference: string | null
          mattress_preference: string | null
          noise_preference: string | null
          pillow_preference: string | null
          preferred_sleep_time: string | null
          preferred_wake_time: string | null
          room_temperature_preference: number | null
          sleep_challenges: string[] | null
          sleep_goals: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          light_preference?: string | null
          mattress_preference?: string | null
          noise_preference?: string | null
          pillow_preference?: string | null
          preferred_sleep_time?: string | null
          preferred_wake_time?: string | null
          room_temperature_preference?: number | null
          sleep_challenges?: string[] | null
          sleep_goals?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          light_preference?: string | null
          mattress_preference?: string | null
          noise_preference?: string | null
          pillow_preference?: string | null
          preferred_sleep_time?: string | null
          preferred_wake_time?: string | null
          room_temperature_preference?: number | null
          sleep_challenges?: string[] | null
          sleep_goals?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          created_at: string | null
          ends_at: string | null
          id: string
          starts_at: string
          tier: Database["public"]["Enums"]["subscription_tier"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          ends_at?: string | null
          id?: string
          starts_at?: string
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          ends_at?: string | null
          id?: string
          starts_at?: string
          tier?: Database["public"]["Enums"]["subscription_tier"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_substance_logs: {
        Row: {
          created_at: string
          dosage: string
          effects: string | null
          id: string
          notes: string | null
          side_effects: string | null
          substance_id: string
          substance_type: string
          taken_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          dosage: string
          effects?: string | null
          id?: string
          notes?: string | null
          side_effects?: string | null
          substance_id: string
          substance_type: string
          taken_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          dosage?: string
          effects?: string | null
          id?: string
          notes?: string | null
          side_effects?: string | null
          substance_id?: string
          substance_type?: string
          taken_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_wearable_devices: {
        Row: {
          auth_token: string | null
          created_at: string
          device_id: string
          device_type: string
          id: string
          is_active: boolean | null
          last_synced_at: string | null
          user_id: string
        }
        Insert: {
          auth_token?: string | null
          created_at?: string
          device_id: string
          device_type: string
          id?: string
          is_active?: boolean | null
          last_synced_at?: string | null
          user_id: string
        }
        Update: {
          auth_token?: string | null
          created_at?: string
          device_id?: string
          device_type?: string
          id?: string
          is_active?: boolean | null
          last_synced_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_id"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_analytics: {
        Row: {
          created_at: string | null
          customer_satisfaction: number | null
          date: string
          id: string
          new_customers: number | null
          payout_amount: number | null
          platform_fees: number | null
          recurring_revenue: number | null
          refund_rate: number | null
          total_revenue: number | null
          total_sales: number | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          customer_satisfaction?: number | null
          date: string
          id?: string
          new_customers?: number | null
          payout_amount?: number | null
          platform_fees?: number | null
          recurring_revenue?: number | null
          refund_rate?: number | null
          total_revenue?: number | null
          total_sales?: number | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          customer_satisfaction?: number | null
          date?: string
          id?: string
          new_customers?: number | null
          payout_amount?: number | null
          platform_fees?: number | null
          recurring_revenue?: number | null
          refund_rate?: number | null
          total_revenue?: number | null
          total_sales?: number | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_analytics_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "seller_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          parent_id: string | null
          vendor_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          vendor_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "vendor_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_categories_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_chat_sessions: {
        Row: {
          ended_at: string | null
          id: string
          rating: number | null
          started_at: string | null
          status: string | null
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          ended_at?: string | null
          id?: string
          rating?: number | null
          started_at?: string | null
          status?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          ended_at?: string | null
          id?: string
          rating?: number | null
          started_at?: string | null
          status?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_chat_sessions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_customer_messages: {
        Row: {
          created_at: string | null
          id: string
          is_from_vendor: boolean | null
          message: string
          read_at: string | null
          user_id: string
          vendor_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_from_vendor?: boolean | null
          message: string
          read_at?: string | null
          user_id: string
          vendor_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_from_vendor?: boolean | null
          message?: string
          read_at?: string | null
          user_id?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_customer_messages_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_daily_metrics: {
        Row: {
          average_order_value: number | null
          created_at: string | null
          date: string
          id: string
          total_customers: number | null
          total_orders: number | null
          total_revenue: number | null
          vendor_id: string
        }
        Insert: {
          average_order_value?: number | null
          created_at?: string | null
          date?: string
          id?: string
          total_customers?: number | null
          total_orders?: number | null
          total_revenue?: number | null
          vendor_id: string
        }
        Update: {
          average_order_value?: number | null
          created_at?: string | null
          date?: string
          id?: string
          total_customers?: number | null
          total_orders?: number | null
          total_revenue?: number | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_daily_metrics_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_locations: {
        Row: {
          address: string | null
          coordinates: unknown | null
          created_at: string | null
          id: string
          is_active: boolean | null
          location_name: string
          vendor_id: string | null
        }
        Insert: {
          address?: string | null
          coordinates?: unknown | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          location_name: string
          vendor_id?: string | null
        }
        Update: {
          address?: string | null
          coordinates?: unknown | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          location_name?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_locations_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_loyalty_programs: {
        Row: {
          created_at: string | null
          id: string
          points_ratio: number
          program_name: string
          rewards: Json
          tiers: Json
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          points_ratio: number
          program_name: string
          rewards?: Json
          tiers?: Json
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          points_ratio?: number
          program_name?: string
          rewards?: Json
          tiers?: Json
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_loyalty_programs_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_marketplace_listings: {
        Row: {
          created_at: string | null
          external_id: string | null
          id: string
          last_sync_at: string | null
          platform: string
          product_id: string | null
          status: string | null
          sync_status: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          external_id?: string | null
          id?: string
          last_sync_at?: string | null
          platform: string
          product_id?: string | null
          status?: string | null
          sync_status?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          external_id?: string | null
          id?: string
          last_sync_at?: string | null
          platform?: string
          product_id?: string | null
          status?: string | null
          sync_status?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_marketplace_listings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "vendor_marketplace_listings_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendor_marketplace_listings_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_messages: {
        Row: {
          created_at: string | null
          id: string
          is_from_vendor: boolean | null
          message: string
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_from_vendor?: boolean | null
          message: string
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_from_vendor?: boolean | null
          message?: string
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_messages_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_notification_preferences: {
        Row: {
          created_at: string | null
          id: string
          inventory_alerts: boolean | null
          low_stock_threshold: number | null
          order_notifications: boolean | null
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          inventory_alerts?: boolean | null
          low_stock_threshold?: number | null
          order_notifications?: boolean | null
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          inventory_alerts?: boolean | null
          low_stock_threshold?: number | null
          order_notifications?: boolean | null
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_notification_preferences_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_notification_rules: {
        Row: {
          channels: Json | null
          conditions: Json | null
          created_at: string | null
          event_type: string
          id: string
          is_active: boolean | null
          priority: number | null
          rule_name: string
          vendor_id: string | null
        }
        Insert: {
          channels?: Json | null
          conditions?: Json | null
          created_at?: string | null
          event_type: string
          id?: string
          is_active?: boolean | null
          priority?: number | null
          rule_name: string
          vendor_id?: string | null
        }
        Update: {
          channels?: Json | null
          conditions?: Json | null
          created_at?: string | null
          event_type?: string
          id?: string
          is_active?: boolean | null
          priority?: number | null
          rule_name?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_notification_rules_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_payment_methods: {
        Row: {
          account_details: Json | null
          created_at: string | null
          id: string
          is_default: boolean | null
          type: string
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          account_details?: Json | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          type: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          account_details?: Json | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          type?: string
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_payment_methods_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_payouts: {
        Row: {
          amount: number
          id: string
          note: string | null
          payout_details: Json | null
          payout_method: string
          processed_at: string | null
          reference_id: string | null
          requested_at: string | null
          status: string | null
          vendor_id: string | null
        }
        Insert: {
          amount: number
          id?: string
          note?: string | null
          payout_details?: Json | null
          payout_method: string
          processed_at?: string | null
          reference_id?: string | null
          requested_at?: string | null
          status?: string | null
          vendor_id?: string | null
        }
        Update: {
          amount?: number
          id?: string
          note?: string | null
          payout_details?: Json | null
          payout_method?: string
          processed_at?: string | null
          reference_id?: string | null
          requested_at?: string | null
          status?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_payouts_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "seller_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_profiles: {
        Row: {
          address: string | null
          average_rating: number | null
          booking_acceptance_rate: number | null
          business_license: string | null
          business_name: string
          contact_email: string
          created_at: string | null
          cultural_expertise: string[] | null
          emergency_contact: Json | null
          host_qualities: string[] | null
          hosting_experience_years: number | null
          id: string
          insurance_verified: boolean | null
          local_guide: boolean | null
          payout_info: Json | null
          phone_number: string | null
          preferred_communication_method: string | null
          property_management_style: string | null
          response_rate: number | null
          response_time: string | null
          stripe_account_id: string | null
          superhost_status: boolean | null
          tax_id: string | null
          total_properties: number | null
          user_id: string
          vendor_languages: string[] | null
          verification_status: string | null
          verified: boolean | null
        }
        Insert: {
          address?: string | null
          average_rating?: number | null
          booking_acceptance_rate?: number | null
          business_license?: string | null
          business_name: string
          contact_email: string
          created_at?: string | null
          cultural_expertise?: string[] | null
          emergency_contact?: Json | null
          host_qualities?: string[] | null
          hosting_experience_years?: number | null
          id?: string
          insurance_verified?: boolean | null
          local_guide?: boolean | null
          payout_info?: Json | null
          phone_number?: string | null
          preferred_communication_method?: string | null
          property_management_style?: string | null
          response_rate?: number | null
          response_time?: string | null
          stripe_account_id?: string | null
          superhost_status?: boolean | null
          tax_id?: string | null
          total_properties?: number | null
          user_id: string
          vendor_languages?: string[] | null
          verification_status?: string | null
          verified?: boolean | null
        }
        Update: {
          address?: string | null
          average_rating?: number | null
          booking_acceptance_rate?: number | null
          business_license?: string | null
          business_name?: string
          contact_email?: string
          created_at?: string | null
          cultural_expertise?: string[] | null
          emergency_contact?: Json | null
          host_qualities?: string[] | null
          hosting_experience_years?: number | null
          id?: string
          insurance_verified?: boolean | null
          local_guide?: boolean | null
          payout_info?: Json | null
          phone_number?: string | null
          preferred_communication_method?: string | null
          property_management_style?: string | null
          response_rate?: number | null
          response_time?: string | null
          stripe_account_id?: string | null
          superhost_status?: boolean | null
          tax_id?: string | null
          total_properties?: number | null
          user_id?: string
          vendor_languages?: string[] | null
          verification_status?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      vendor_ratings: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          rating: number | null
          updated_at: string | null
          user_id: string | null
          vendor_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          updated_at?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          updated_at?: string | null
          user_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_ratings_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_smart_notifications: {
        Row: {
          content: string
          created_at: string | null
          id: string
          is_read: boolean | null
          metadata: Json
          notification_type: string
          priority: string
          scheduled_for: string | null
          title: string
          trigger_conditions: Json
          vendor_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          metadata?: Json
          notification_type: string
          priority?: string
          scheduled_for?: string | null
          title: string
          trigger_conditions?: Json
          vendor_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          metadata?: Json
          notification_type?: string
          priority?: string
          scheduled_for?: string | null
          title?: string
          trigger_conditions?: Json
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_smart_notifications_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_social_integrations: {
        Row: {
          created_at: string | null
          credentials: Json | null
          id: string
          is_active: boolean | null
          last_sync_at: string | null
          platform: string
          settings: Json | null
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          credentials?: Json | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          platform: string
          settings?: Json | null
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          credentials?: Json | null
          id?: string
          is_active?: boolean | null
          last_sync_at?: string | null
          platform?: string
          settings?: Json | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_social_integrations_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_store_settings: {
        Row: {
          banner_url: string | null
          created_at: string | null
          description: string | null
          display_name: string | null
          id: string
          logo_url: string | null
          social_links: Json | null
          store_theme: Json | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          banner_url?: string | null
          created_at?: string | null
          description?: string | null
          display_name?: string | null
          id?: string
          logo_url?: string | null
          social_links?: Json | null
          store_theme?: Json | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          banner_url?: string | null
          created_at?: string | null
          description?: string | null
          display_name?: string | null
          id?: string
          logo_url?: string | null
          social_links?: Json | null
          store_theme?: Json | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_store_settings_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: true
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendor_verification_requirements: {
        Row: {
          created_at: string | null
          document_type: string
          document_url: string | null
          id: string
          notes: string | null
          status: string | null
          submitted_at: string | null
          vendor_id: string | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          document_type: string
          document_url?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          submitted_at?: string | null
          vendor_id?: string | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          document_type?: string
          document_url?: string | null
          id?: string
          notes?: string | null
          status?: string | null
          submitted_at?: string | null
          vendor_id?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendor_verification_requirements_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          ai_analysis: string | null
          ai_analysis_updated_at: string | null
          brand_description: string | null
          business_registration: string | null
          claimed_by: string | null
          contact_email: string | null
          created_at: string | null
          customer_service_email: string | null
          customer_service_phone: string | null
          id: string
          inventory_value: number | null
          location: string | null
          minimum_order_amount: number | null
          name: string
          phone: string | null
          product_varieties: string[] | null
          return_policy: string | null
          rules_accepted: boolean | null
          rules_accepted_at: string | null
          shipping_policy: string | null
          ships_from: string[] | null
          ships_to: string[] | null
          shop_announcement: string | null
          shop_enabled: boolean | null
          shop_featured_products: string[] | null
          store_type: string
          tax_id: string | null
          verified: boolean | null
          website: string | null
        }
        Insert: {
          ai_analysis?: string | null
          ai_analysis_updated_at?: string | null
          brand_description?: string | null
          business_registration?: string | null
          claimed_by?: string | null
          contact_email?: string | null
          created_at?: string | null
          customer_service_email?: string | null
          customer_service_phone?: string | null
          id?: string
          inventory_value?: number | null
          location?: string | null
          minimum_order_amount?: number | null
          name: string
          phone?: string | null
          product_varieties?: string[] | null
          return_policy?: string | null
          rules_accepted?: boolean | null
          rules_accepted_at?: string | null
          shipping_policy?: string | null
          ships_from?: string[] | null
          ships_to?: string[] | null
          shop_announcement?: string | null
          shop_enabled?: boolean | null
          shop_featured_products?: string[] | null
          store_type?: string
          tax_id?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          ai_analysis?: string | null
          ai_analysis_updated_at?: string | null
          brand_description?: string | null
          business_registration?: string | null
          claimed_by?: string | null
          contact_email?: string | null
          created_at?: string | null
          customer_service_email?: string | null
          customer_service_phone?: string | null
          id?: string
          inventory_value?: number | null
          location?: string | null
          minimum_order_amount?: number | null
          name?: string
          phone?: string | null
          product_varieties?: string[] | null
          return_policy?: string | null
          rules_accepted?: boolean | null
          rules_accepted_at?: string | null
          shipping_policy?: string | null
          ships_from?: string[] | null
          ships_to?: string[] | null
          shop_announcement?: string | null
          shop_enabled?: boolean | null
          shop_featured_products?: string[] | null
          store_type?: string
          tax_id?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Relationships: []
      }
      verification_requests: {
        Row: {
          created_at: string | null
          id: string
          reason: string
          reviewed_at: string | null
          reviewer_notes: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          reason: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          reason?: string
          reviewed_at?: string | null
          reviewer_notes?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      verse_audio_narrations: {
        Row: {
          audio_url: string
          created_at: string | null
          duration_seconds: number | null
          id: string
          language: string | null
          verse_reference: string
          voice_style: string | null
        }
        Insert: {
          audio_url: string
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          language?: string | null
          verse_reference: string
          voice_style?: string | null
        }
        Update: {
          audio_url?: string
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          language?: string | null
          verse_reference?: string
          voice_style?: string | null
        }
        Relationships: []
      }
      verse_collections: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_public: boolean | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      verse_cross_references: {
        Row: {
          created_at: string
          id: string
          source_book: string
          source_chapter: number
          source_verse: number
          target_book: string
          target_chapter: number
          target_verse: number
        }
        Insert: {
          created_at?: string
          id?: string
          source_book: string
          source_chapter: number
          source_verse: number
          target_book: string
          target_chapter: number
          target_verse: number
        }
        Update: {
          created_at?: string
          id?: string
          source_book?: string
          source_chapter?: number
          source_verse?: number
          target_book?: string
          target_chapter?: number
          target_verse?: number
        }
        Relationships: []
      }
      verse_insights: {
        Row: {
          generated_at: string | null
          id: string
          insight_text: string
          likes_count: number | null
          model_used: string
          tags: string[] | null
          user_id: string | null
          verse_reference: string
        }
        Insert: {
          generated_at?: string | null
          id?: string
          insight_text: string
          likes_count?: number | null
          model_used: string
          tags?: string[] | null
          user_id?: string | null
          verse_reference: string
        }
        Update: {
          generated_at?: string | null
          id?: string
          insight_text?: string
          likes_count?: number | null
          model_used?: string
          tags?: string[] | null
          user_id?: string | null
          verse_reference?: string
        }
        Relationships: []
      }
      verse_memorization: {
        Row: {
          book: string
          chapter: number
          confidence_level: number | null
          created_at: string
          id: string
          last_reviewed: string | null
          next_review: string | null
          user_id: string
          verse: number
        }
        Insert: {
          book: string
          chapter: number
          confidence_level?: number | null
          created_at?: string
          id?: string
          last_reviewed?: string | null
          next_review?: string | null
          user_id: string
          verse: number
        }
        Update: {
          book?: string
          chapter?: number
          confidence_level?: number | null
          created_at?: string
          id?: string
          last_reviewed?: string | null
          next_review?: string | null
          user_id?: string
          verse?: number
        }
        Relationships: []
      }
      verse_recommendations: {
        Row: {
          context: string
          created_at: string | null
          id: string
          is_favorite: boolean | null
          reasoning: string
          user_id: string | null
          verse_reference: string
        }
        Insert: {
          context: string
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          reasoning: string
          user_id?: string | null
          verse_reference: string
        }
        Update: {
          context?: string
          created_at?: string | null
          id?: string
          is_favorite?: boolean | null
          reasoning?: string
          user_id?: string | null
          verse_reference?: string
        }
        Relationships: []
      }
      verse_tag_assignments: {
        Row: {
          book: string
          chapter: number
          created_at: string
          id: string
          tag_id: string
          verse: number
        }
        Insert: {
          book: string
          chapter: number
          created_at?: string
          id?: string
          tag_id: string
          verse: number
        }
        Update: {
          book?: string
          chapter?: number
          created_at?: string
          id?: string
          tag_id?: string
          verse?: number
        }
        Relationships: [
          {
            foreignKeyName: "verse_tag_assignments_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "verse_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      verse_tags: {
        Row: {
          color: string | null
          created_at: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      verse_word_mappings: {
        Row: {
          book: string
          chapter: number
          created_at: string
          id: string
          strongs_number: string | null
          verse: number
          word: string
          word_position: number
        }
        Insert: {
          book: string
          chapter: number
          created_at?: string
          id?: string
          strongs_number?: string | null
          verse: number
          word: string
          word_position: number
        }
        Update: {
          book?: string
          chapter?: number
          created_at?: string
          id?: string
          strongs_number?: string | null
          verse?: number
          word?: string
          word_position?: number
        }
        Relationships: [
          {
            foreignKeyName: "verse_word_mappings_strongs_number_fkey"
            columns: ["strongs_number"]
            isOneToOne: false
            referencedRelation: "strongs_concordance"
            referencedColumns: ["strongs_number"]
          },
        ]
      }
      virtual_experiences: {
        Row: {
          created_at: string | null
          cultural_focus: string[] | null
          description: string
          duration_minutes: number
          experience_type: string
          host_id: string | null
          id: string
          is_active: boolean | null
          max_participants: number | null
          price: number
          requirements: string[] | null
          scheduled_for: string | null
          title: string
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          cultural_focus?: string[] | null
          description: string
          duration_minutes: number
          experience_type: string
          host_id?: string | null
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          price: number
          requirements?: string[] | null
          scheduled_for?: string | null
          title: string
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          cultural_focus?: string[] | null
          description?: string
          duration_minutes?: number
          experience_type?: string
          host_id?: string | null
          id?: string
          is_active?: boolean | null
          max_participants?: number | null
          price?: number
          requirements?: string[] | null
          scheduled_for?: string | null
          title?: string
          video_url?: string | null
        }
        Relationships: []
      }
      visual_organization_tools: {
        Row: {
          color_scheme: string[] | null
          content: Json | null
          created_at: string | null
          id: string
          layout_preferences: Json | null
          tool_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color_scheme?: string[] | null
          content?: Json | null
          created_at?: string | null
          id?: string
          layout_preferences?: Json | null
          tool_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color_scheme?: string[] | null
          content?: Json | null
          created_at?: string | null
          id?: string
          layout_preferences?: Json | null
          tool_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      visual_schedules: {
        Row: {
          break_reminders: Json | null
          color_coding: Json | null
          created_at: string | null
          flexibility_rules: Json | null
          id: string
          schedule_type: string
          time_blocks: Json[] | null
          updated_at: string | null
          user_id: string | null
          visual_format: Json
        }
        Insert: {
          break_reminders?: Json | null
          color_coding?: Json | null
          created_at?: string | null
          flexibility_rules?: Json | null
          id?: string
          schedule_type: string
          time_blocks?: Json[] | null
          updated_at?: string | null
          user_id?: string | null
          visual_format: Json
        }
        Update: {
          break_reminders?: Json | null
          color_coding?: Json | null
          created_at?: string | null
          flexibility_rules?: Json | null
          id?: string
          schedule_type?: string
          time_blocks?: Json[] | null
          updated_at?: string | null
          user_id?: string | null
          visual_format?: Json
        }
        Relationships: []
      }
      voice_reading_sessions: {
        Row: {
          content_reference: string
          content_type: string
          created_at: string | null
          duration: number | null
          id: string
          is_completed: boolean | null
          user_id: string | null
          voice_id: string
        }
        Insert: {
          content_reference: string
          content_type: string
          created_at?: string | null
          duration?: number | null
          id?: string
          is_completed?: boolean | null
          user_id?: string | null
          voice_id: string
        }
        Update: {
          content_reference?: string
          content_type?: string
          created_at?: string | null
          duration?: number | null
          id?: string
          is_completed?: boolean | null
          user_id?: string | null
          voice_id?: string
        }
        Relationships: []
      }
      volunteer_opportunities: {
        Row: {
          church_id: string | null
          contact_info: Json | null
          created_at: string | null
          description: string
          end_date: string | null
          id: string
          requirements: string[] | null
          start_date: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          church_id?: string | null
          contact_info?: Json | null
          created_at?: string | null
          description: string
          end_date?: string | null
          id?: string
          requirements?: string[] | null
          start_date?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          church_id?: string | null
          contact_info?: Json | null
          created_at?: string | null
          description?: string
          end_date?: string | null
          id?: string
          requirements?: string[] | null
          start_date?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_opportunities_church_id_fkey"
            columns: ["church_id"]
            isOneToOne: false
            referencedRelation: "churches"
            referencedColumns: ["id"]
          },
        ]
      }
      volunteer_signups: {
        Row: {
          created_at: string | null
          id: string
          opportunity_id: string | null
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          opportunity_id?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          opportunity_id?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "volunteer_signups_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "volunteer_opportunities"
            referencedColumns: ["id"]
          },
        ]
      }
      water_intake: {
        Row: {
          amount_ml: number
          created_at: string | null
          id: string
          intake_type: string | null
          notes: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          amount_ml: number
          created_at?: string | null
          id?: string
          intake_type?: string | null
          notes?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          amount_ml?: number
          created_at?: string | null
          id?: string
          intake_type?: string | null
          notes?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      web_tool_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          tool_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          tool_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          tool_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "web_tool_comments_tool_id_fkey"
            columns: ["tool_id"]
            isOneToOne: false
            referencedRelation: "web_tools"
            referencedColumns: ["id"]
          },
        ]
      }
      web_tools: {
        Row: {
          ad_placement_zones: Json | null
          affiliate_links: Json | null
          avg_time_spent: number | null
          category: string | null
          completion_rate: number | null
          content: string
          created_at: string
          description: string
          featured_product: string | null
          id: string
          is_premium: boolean | null
          ispremium: boolean | null
          meta_description: string | null
          meta_keywords: string[] | null
          monetization_enabled: boolean | null
          path: string | null
          published: boolean | null
          related_products: string[] | null
          related_tools: string[] | null
          seo_description: string | null
          seo_title: string | null
          share_count: number | null
          slug: string
          tags: string[]
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          ad_placement_zones?: Json | null
          affiliate_links?: Json | null
          avg_time_spent?: number | null
          category?: string | null
          completion_rate?: number | null
          content: string
          created_at?: string
          description: string
          featured_product?: string | null
          id?: string
          is_premium?: boolean | null
          ispremium?: boolean | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          monetization_enabled?: boolean | null
          path?: string | null
          published?: boolean | null
          related_products?: string[] | null
          related_tools?: string[] | null
          seo_description?: string | null
          seo_title?: string | null
          share_count?: number | null
          slug: string
          tags?: string[]
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          ad_placement_zones?: Json | null
          affiliate_links?: Json | null
          avg_time_spent?: number | null
          category?: string | null
          completion_rate?: number | null
          content?: string
          created_at?: string
          description?: string
          featured_product?: string | null
          id?: string
          is_premium?: boolean | null
          ispremium?: boolean | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          monetization_enabled?: boolean | null
          path?: string | null
          published?: boolean | null
          related_products?: string[] | null
          related_tools?: string[] | null
          seo_description?: string | null
          seo_title?: string | null
          share_count?: number | null
          slug?: string
          tags?: string[]
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      webhook_delivery_logs: {
        Row: {
          created_at: string | null
          error_message: string | null
          event_type: string
          id: string
          payload: Json
          response_body: string | null
          response_status: number | null
          subscription_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          event_type: string
          id?: string
          payload: Json
          response_body?: string | null
          response_status?: number | null
          subscription_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          event_type?: string
          id?: string
          payload?: Json
          response_body?: string | null
          response_status?: number | null
          subscription_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webhook_delivery_logs_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "webhook_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_events: {
        Row: {
          created_at: string | null
          error_message: string | null
          event_type: string
          id: string
          integration_id: string | null
          payload: Json
          processed_at: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          event_type: string
          id?: string
          integration_id?: string | null
          payload: Json
          processed_at?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          event_type?: string
          id?: string
          integration_id?: string | null
          payload?: Json
          processed_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "webhook_events_integration_id_fkey"
            columns: ["integration_id"]
            isOneToOne: false
            referencedRelation: "platform_integrations"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_subscriptions: {
        Row: {
          created_at: string | null
          events: string[]
          id: string
          last_triggered_at: string | null
          platform_integration_id: string | null
          secret_key: string | null
          updated_at: string | null
          vendor_id: string | null
          webhook_url: string
        }
        Insert: {
          created_at?: string | null
          events?: string[]
          id?: string
          last_triggered_at?: string | null
          platform_integration_id?: string | null
          secret_key?: string | null
          updated_at?: string | null
          vendor_id?: string | null
          webhook_url: string
        }
        Update: {
          created_at?: string | null
          events?: string[]
          id?: string
          last_triggered_at?: string | null
          platform_integration_id?: string | null
          secret_key?: string | null
          updated_at?: string | null
          vendor_id?: string | null
          webhook_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_subscriptions_platform_integration_id_fkey"
            columns: ["platform_integration_id"]
            isOneToOne: false
            referencedRelation: "platform_integrations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "webhook_subscriptions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "seller_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wellness_goals: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          progress: number | null
          status: string
          target_date: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          progress?: number | null
          status?: string
          target_date?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          progress?: number | null
          status?: string
          target_date?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      wellness_metrics: {
        Row: {
          coping_strategies_used: string[] | null
          energy_level: number | null
          focus_level: number | null
          id: string
          logged_at: string
          mood_level: number | null
          notes: string | null
          sleep_quality: number | null
          stress_level: number | null
          triggers: string[] | null
          user_id: string
        }
        Insert: {
          coping_strategies_used?: string[] | null
          energy_level?: number | null
          focus_level?: number | null
          id?: string
          logged_at?: string
          mood_level?: number | null
          notes?: string | null
          sleep_quality?: number | null
          stress_level?: number | null
          triggers?: string[] | null
          user_id: string
        }
        Update: {
          coping_strategies_used?: string[] | null
          energy_level?: number | null
          focus_level?: number | null
          id?: string
          logged_at?: string
          mood_level?: number | null
          notes?: string | null
          sleep_quality?: number | null
          stress_level?: number | null
          triggers?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      wellness_rewards: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          points_required: number
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          points_required: number
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          points_required?: number
          title?: string
        }
        Relationships: []
      }
      wellness_streaks: {
        Row: {
          activity_type: string
          created_at: string | null
          current_streak: number | null
          id: string
          last_check_in: string | null
          longest_streak: number | null
          user_id: string | null
        }
        Insert: {
          activity_type: string
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_check_in?: string | null
          longest_streak?: number | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string
          created_at?: string | null
          current_streak?: number | null
          id?: string
          last_check_in?: string | null
          longest_streak?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string
          folder: string | null
          id: string
          is_private: boolean | null
          last_price_check: string | null
          notes: string | null
          notification_price: number | null
          price_history: Json | null
          priority: number | null
          product_id: string
          quantity_desired: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          folder?: string | null
          id?: string
          is_private?: boolean | null
          last_price_check?: string | null
          notes?: string | null
          notification_price?: number | null
          price_history?: Json | null
          priority?: number | null
          product_id: string
          quantity_desired?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          folder?: string | null
          id?: string
          is_private?: boolean | null
          last_price_check?: string | null
          notes?: string | null
          notification_price?: number | null
          price_history?: Json | null
          priority?: number | null
          product_id?: string
          quantity_desired?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "affiliate_analytics"
            referencedColumns: ["product_id"]
          },
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawal_symptoms: {
        Row: {
          coping_methods: string[] | null
          created_at: string | null
          duration_hours: number | null
          id: string
          intensity: number
          notes: string | null
          symptom_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          coping_methods?: string[] | null
          created_at?: string | null
          duration_hours?: number | null
          id?: string
          intensity: number
          notes?: string | null
          symptom_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          coping_methods?: string[] | null
          created_at?: string | null
          duration_hours?: number | null
          id?: string
          intensity?: number
          notes?: string | null
          symptom_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      affiliate_analytics: {
        Row: {
          conversions: number | null
          date: string | null
          product_id: string | null
          product_name: string | null
          total_clicks: number | null
          total_commission: number | null
          unique_clicks: number | null
        }
        Relationships: []
      }
      tool_analytics_summary: {
        Row: {
          avg_session_duration: number | null
          category: Database["public"]["Enums"]["tool_category"] | null
          tool_name: string | null
          total_sessions: number | null
          unique_users: number | null
        }
        Relationships: []
      }
      tool_popularity: {
        Row: {
          avg_rating: number | null
          avg_session_duration: number | null
          tool_name: string | null
          unique_users: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      calculate_available_discount: {
        Args: {
          _user_id: string
          _vendor_id: string
        }
        Returns: {
          available_points: number
          max_discount_percentage: number
          max_discount_amount: number
        }[]
      }
      calculate_commission: {
        Args: {
          product_id: string
          click_time: string
        }
        Returns: number
      }
      calculate_daily_caffeine_intake: {
        Args: {
          user_uuid: string
          date_to_check: string
        }
        Returns: number
      }
      check_insurance_eligibility: {
        Args: {
          _insurance_id: string
          _professional_id: string
          _service_type: string
        }
        Returns: Json
      }
      create_types_bible_file: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cube:
        | {
            Args: {
              "": number[]
            }
            Returns: unknown
          }
        | {
            Args: {
              "": number
            }
            Returns: unknown
          }
      cube_dim: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      cube_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      cube_is_point: {
        Args: {
          "": unknown
        }
        Returns: boolean
      }
      cube_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      cube_recv: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      cube_send: {
        Args: {
          "": unknown
        }
        Returns: string
      }
      cube_size: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      earth: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      ensure_script_tag: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      gc_to_sec: {
        Args: {
          "": number
        }
        Returns: number
      }
      get_similar_products: {
        Args: {
          product_id: string
        }
        Returns: {
          similar_product_id: string
          similarity_score: number
        }[]
      }
      gtrgm_compress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_in: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      gtrgm_options: {
        Args: {
          "": unknown
        }
        Returns: undefined
      }
      gtrgm_out: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      has_premium_ad_blocking: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      increment_ad_block_stats: {
        Args: {
          user_id: string
          block_date: string
          ads_inc?: number
          bandwidth_inc?: number
          time_inc?: number
        }
        Returns: undefined
      }
      increment_comment_downvotes: {
        Args: {
          comment_id: string
        }
        Returns: undefined
      }
      increment_comment_upvotes: {
        Args: {
          comment_id: string
        }
        Returns: undefined
      }
      latitude: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      longitude: {
        Args: {
          "": unknown
        }
        Returns: number
      }
      products_to_tsvector: {
        Args: {
          name: string
          description: string
          brand: string
          materials: string[]
        }
        Returns: unknown
      }
      sec_to_gc: {
        Args: {
          "": number
        }
        Returns: number
      }
      set_limit: {
        Args: {
          "": number
        }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: {
          "": string
        }
        Returns: string[]
      }
      submit_insurance_claim: {
        Args: {
          _claim_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      achievement_category:
        | "quit_milestone"
        | "health_improvement"
        | "money_saved"
        | "lifestyle_change"
        | "coping_skill"
        | "support_network"
      activity_impact: "positive" | "negative" | "neutral"
      activity_type: "steps" | "app_usage" | "subscription_boost" | "purchase"
      app_role: "admin" | "user" | "product_manager"
      bathing_tag:
        | "energizing"
        | "relaxing"
        | "sleep_improvement"
        | "muscle_recovery"
        | "stress_relief"
        | "focus_enhancement"
      bible_testament: "old" | "new"
      bible_tradition: "catholic" | "protestant" | "orthodox"
      biohacking_activity_type:
        | "red_light_therapy"
        | "cold_therapy"
        | "grounding"
        | "emf_protection"
        | "blue_light_blocking"
        | "mouth_taping"
        | "breath_work"
        | "nootropics"
        | "infrared_sauna"
        | "pemf_therapy"
        | "hyperbaric_oxygen"
        | "neurofeedback"
        | "light_therapy"
        | "sleep_optimization"
        | "hrv_training"
        | "mindfulness_tech"
        | "sound_therapy"
        | "air_quality"
        | "frequency_therapy"
        | "peptide_therapy"
        | "sleep_tracking"
        | "glucose_monitoring"
        | "hydration_tracking"
        | "meditation_tech"
        | "sensory_deprivation"
        | "microcurrent_therapy"
        | "vagus_nerve_stim"
        | "red_light_panels"
        | "compression_therapy"
        | "sleep_environment"
        | "muscle_stim"
        | "bone_conducting"
        | "biocharging"
        | "dna_optimization"
        | "stem_cell_therapy"
        | "xenon_therapy"
        | "ozone_therapy"
        | "quantum_biofeedback"
        | "bioelectric_therapy"
        | "magnetic_therapy"
        | "light_sound_mind"
        | "float_tanks"
        | "blood_optimization"
        | "brain_entrainment"
        | "electromagnetic_therapy"
        | "mitochondrial_optimization"
        | "telomere_hacking"
        | "vibroacoustic_therapy"
        | "photobiomodulation"
        | "electroporation"
        | "microbiome_optimization"
        | "chronobiology_tracking"
        | "biofilm_disruption"
        | "cellular_regeneration"
        | "brain_spect_imaging"
        | "metabolic_analysis"
        | "genetic_expression"
        | "bioavailability_tech"
        | "ketone_monitoring"
        | "cgm_analysis"
        | "brain_wave_tracking"
        | "hormone_optimization"
        | "circadian_tracking"
        | "toxin_analysis"
        | "nutrient_absorption"
        | "cellular_voltage"
        | "quantum_health"
        | "longevity_markers"
      blocking_type: "ad" | "distraction" | "combined"
      brewing_method: "hot_steep" | "cold_brew" | "gongfu" | "western"
      cbt_exercise_type:
        | "thought_record"
        | "behavioral_activation"
        | "cognitive_restructuring"
        | "problem_solving"
        | "relaxation"
      consultation_status:
        | "scheduled"
        | "in_progress"
        | "completed"
        | "cancelled"
      content_connection_type: "film" | "book" | "music" | "game" | "art"
      delivery_status: "pending" | "in_transit" | "delivered" | "failed"
      digital_product_category:
        | "discord_servers"
        | "tools_software"
        | "courses_education"
        | "content_media"
        | "trading_investing"
        | "memberships"
        | "ai_machine_learning"
        | "alpha_groups"
        | "developer_resources"
      discussion_status: "open" | "closed" | "archived"
      distraction_type: "app" | "website" | "notification" | "social_media"
      ease_rating_type: "agree" | "disagree" | "not_sure"
      energy_plan_type:
        | "recharge"
        | "energize"
        | "recovery"
        | "sleep"
        | "focus"
        | "destress"
      exercise_type:
        | "walking"
        | "running"
        | "cycling"
        | "hiking"
        | "yoga"
        | "stretching"
        | "desk_exercise"
        | "eye_exercise"
      expert_specialty:
        | "mental_health"
        | "nutrition"
        | "supplements"
        | "fatigue"
        | "adhd"
        | "memory"
        | "brain_exercise"
        | "dementia"
        | "sleep"
        | "anxiety"
        | "depression"
        | "stress"
        | "cognitive_health"
        | "mindfulness"
        | "holistic_health"
        | "behavioral_therapy"
        | "energy_management"
        | "focus_training"
        | "cognitive_rehabilitation"
        | "neuroplasticity"
      faith_level: "new_believer" | "growing" | "mature" | "mentor"
      feedback_priority: "low" | "medium" | "high" | "critical"
      feedback_status: "open" | "in_progress" | "completed" | "declined"
      feedback_type:
        | "feature_request"
        | "bug_report"
        | "improvement"
        | "general"
      feeding_method: "breastfeeding" | "formula" | "mixed" | "solid_transition"
      game_type:
        | "chess"
        | "go"
        | "checkers"
        | "reversi"
        | "xiangqi"
        | "shogi"
        | "gomoku"
        | "connect_four"
        | "tic_tac_toe"
        | "pattern_recognition"
        | "brain_match"
        | "n_back"
        | "stroop_test"
        | "digit_span"
        | "mental_rotation"
        | "word_pairs"
        | "reaction_time"
        | "dual_n_back"
      gratitude_category:
        | "people"
        | "experiences"
        | "things"
        | "personal_growth"
        | "nature"
        | "other"
      health_condition:
        | "adhd"
        | "chronic_fatigue"
        | "multiple_sclerosis"
        | "other_fatigue"
        | "other_focus_issue"
        | "short_term_memory"
        | "long_term_memory"
        | "migraine"
      integration_status: "pending" | "active" | "failed" | "revoked"
      life_situation: "regular" | "pregnancy" | "postpartum" | "breastfeeding"
      loyalty_tier_level: "bronze" | "silver" | "gold" | "platinum"
      mood_category: "positive" | "negative" | "neutral"
      notification_priority: "low" | "medium" | "high"
      notification_type:
        | "session_reminder"
        | "achievement"
        | "streak"
        | "custom"
      order_status:
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled"
        | "refunded"
      plan_expertise_level:
        | "beginner"
        | "intermediate"
        | "advanced"
        | "professional"
      plan_type:
        | "energizing_boost"
        | "sustained_focus"
        | "mental_clarity"
        | "physical_vitality"
        | "deep_relaxation"
        | "stress_relief"
        | "evening_winddown"
        | "sleep_preparation"
        | "meditation"
      plan_visibility: "private" | "public" | "shared"
      pregnancy_metric_category:
        | "weight"
        | "blood_pressure"
        | "nutrition"
        | "exercise"
        | "sleep"
        | "mood"
        | "general"
      pregnancy_stage:
        | "preconception"
        | "first_trimester"
        | "second_trimester"
        | "third_trimester"
        | "postpartum"
        | "preconception_planning"
      quit_strategy_type:
        | "cold_turkey"
        | "taper_down"
        | "nrt_assisted"
        | "harm_reduction"
      relationship_intent: "marriage" | "friendship" | "mentorship"
      reproductive_exercise_type:
        | "kegel_basic"
        | "kegel_advanced"
        | "pelvic_floor"
        | "core_strength"
        | "hip_mobility"
        | "breathing"
        | "relaxation"
      research_type:
        | "survey"
        | "clinical_trial"
        | "remote_trial"
        | "experience_sampling"
        | "longitudinal"
        | "ema"
        | "mhealth"
        | "remote_monitoring"
        | "digital_therapeutics"
        | "market_research"
        | "behavioral"
        | "biomedical"
      review_type: "product" | "alternative" | "experience"
      risk_level: "low" | "medium" | "high"
      rule_pattern: "domain" | "element" | "keyword" | "ai_suggested"
      session_feedback_type: "client_to_professional" | "professional_to_client"
      sleep_content_type:
        | "guide"
        | "article"
        | "research"
        | "product_review"
        | "sleep_disorder"
        | "lifestyle"
        | "tips"
      sleep_gear_category:
        | "mattresses"
        | "pillows"
        | "bedding"
        | "sleep_tech"
        | "sleep_accessories"
        | "white_noise"
        | "blackout_solutions"
        | "temperature_control"
      smoking_log_type: "cigarette" | "cigar" | "vape" | "pouch" | "gum"
      strength_level: "light" | "medium" | "strong" | "extra_strong"
      subscription_tier: "free" | "premium"
      substance_type: "alcohol" | "tobacco" | "other"
      supplement_form:
        | "powder"
        | "capsule"
        | "liquid"
        | "tablet"
        | "tea_bag"
        | "loose_leaf"
      tool_category: "health" | "focus" | "relaxation" | "games" | "meditation"
      verification_status: "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      behavior_pattern: {
        active_users: number | null
        engagement_rate: number | null
        response_rate: number | null
        segments: Json | null
      }
      behavior_pattern_type: {
        active_users: number | null
        engagement_rate: number | null
        response_rate: number | null
        segments: string[] | null
      }
      customer_segments_type: {
        new_customers: number | null
        inactive_customers: number | null
        returning_customers: number | null
      }
      pattern_summary: {
        summary: string | null
        confidence: number | null
        last_updated: string | null
      }
      patternsummary: {
        summary: string | null
        confidence: number | null
        last_updated: string | null
      }
      revenue_trends_type: {
        daily_revenue: number[] | null
        weekly_revenue: number[] | null
        monthly_revenue: number[] | null
      }
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
