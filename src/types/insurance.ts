
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
  client_insurance: {
    id: string;
    client_id: string;
    insurance_id: string;
    policy_number: string;
    group_number?: string;
    coverage_start_date: string;
    coverage_end_date?: string;
  };
}

export interface InsuranceProvider {
  id: string;
  name: string;
  type: string;
  payer_id: string;
  provider_network: string[];
  verification_method: string;
  claims_api_endpoint: string;
  eligibility_api_endpoint: string;
  is_active: boolean;
  supported_claim_types: string[];
  contact_info: {
    phone: string;
    email: string;
    website: string;
  };
  created_at: string;
  updated_at: string;
}

export interface MarketplaceMetrics {
  id: string;
  metrics_data: {
    total_revenue: number;
    total_orders: number;
    conversion_rate: number;
    total_sales: number;
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
