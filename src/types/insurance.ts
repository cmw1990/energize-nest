
import { Json } from "./supabase";

export interface InsuranceClaim {
  id: string;
  client_insurance_id: string;
  professional_id: string;
  session_id: string;
  claim_number: string;
  service_date: string;
  submission_date: string;
  status: string;
  billed_amount: number;
  diagnosis_codes: string[];
  procedure_codes: string[];
  notes: string;
  created_at: string;
  updated_at: string;
  tracking_number?: string; // Added to support Dashboard.tsx usage
}

export interface InsuranceProvider {
  id: string;
  name: string;
  type?: string;
  contact_info?: {
    phone: string;
    email: string;
    website: string;
  };
  // Add fields that are used in the actual code
  payer_id?: string;
  provider_network?: string[];
  verification_method?: string;
  claims_api_endpoint?: string;
  eligibility_api_endpoint?: string;
  is_active?: boolean;
  supported_claim_types?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface InsuranceEligibilityCheck {
  id: string;
  client_insurance_id: string;
  professional_id: string;
  verification_date: string;
  status: string;
  coverage_details: Json;
  coinsurance_percentage: number;
  copay_amount: number;
  deductible_remaining: number;
  error_message?: string;
  created_at: string;
  updated_at: string;
}

export interface InsuranceClaimSubmission {
  id: string;
  claim_id: string;
  status: string;
  submission_date: string;
  errors?: string[];
  created_at: string;
  updated_at: string;
}

export interface LoyaltyProgram {
  id: string;
  program_name: string;
  description?: string;
  active?: boolean;
  points_ratio: number;
  tiers: LoyaltyTier[];
  rewards: LoyaltyReward[];
  vendor_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface LoyaltyTier {
  id: string;
  program_id: string;
  name: string;
  minimum_points: number;
  points_required: number;
  benefits: string[];
}

export interface LoyaltyReward {
  id: string;
  tier_id: string;
  name: string;
  description: string;
  points_required?: number;
  points_cost?: number; // Added to match LoyaltyProgram.tsx
}

export interface MarketplaceMetrics {
  id: string;
  metrics_data: {
    total_sales: number;
    total_revenue?: number; // Added to match MarketplaceIntegration.tsx
    total_orders?: number;  // Added to match MarketplaceIntegration.tsx
    conversion_rate?: number; // Added to match MarketplaceIntegration.tsx
    active_vendors: number;
    customer_satisfaction: number;
    active_users: number;
    engagement_rate: number;
    response_rate: number;
    peak_hours: string[];
    segments: {
      new: number;
      returning: number;
      inactive: number;
    };
    frequency: {
      daily: number;
      weekly: number;
      monthly: number;
    };
  };
}

