
export interface LoyaltyProgram {
  id: string;
  program_name: string;
  description: string;
  active: boolean;
  points_ratio: number;
  tiers: LoyaltyTier[];
  rewards: LoyaltyReward[];
  created_at: string;
  updated_at: string;
  vendor_id: string;
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
  points_required: number;
}
