
export interface DemographicData {
  id: string;
  age_range: string;  // Keep this to match database field
  age_group?: string; // For backward compatibility
  gender?: string;
  location?: string;
  count?: number;
  impression_id?: string;
  created_at: string;
}

export interface CampaignStat {
  id: string;
  campaign_id: string;
  impressions: number;
  clicks: number;
  conversion_count?: number; // Database field name
  conversions?: number;      // For backward compatibility
  date: string;
  created_at: string;
  spend: number;
}

export interface AdImpression {
  id: string;
  sponsored_product_id?: string;
  ad_id?: string;
  user_id?: string;
  timestamp?: string;
  impressed_at?: string;
  clicked_at?: string;
  location?: string;
  cost?: number;
  sponsored_products?: any;
}

export interface DisplayZone {
  id: string;
  zone_type?: string;      // Added to match database field
  name?: string;
  location?: string;
  size?: string;
  price_per_day?: number;
  price_multiplier?: number; // Added to match database field
  created_at?: string;
}

export interface CustomerBehavior {
  id: string;
  vendor_id?: string;
  behavior_patterns: {
    active_users: number;
    engagement_rate: number;
    response_rate: number;
    peak_hours: string[];
    segments: Array<{name: string, value: number}>;
  };
  customer_segments: {
    new: number;
    returning: number;
    inactive: number;
  };
  revenue_trends: {
    daily: any[];
    weekly: any[];
    monthly: any[];
  };
  created_at: string;
}
