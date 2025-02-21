
export interface InsuranceProvider {
  id: string;
  type: string;
  contact_info: {
    phone: string;
    email: string;
  };
  name: string;
  payer_id: string;
  provider_network: string[];
  verification_method: string;
  claims_api_endpoint: string;
  eligibility_api_endpoint: string;
  is_active: boolean;
  supported_claim_types: string[];
  created_at: string;
  updated_at: string;
}

