
export interface LoyaltyProgram {
  id: string;
  description: string;
  active: boolean;
  tiers: LoyaltyTier[];
  rewards: LoyaltyReward[];
  created_at: string;
  points_ratio: number;
  program_name: string;
  updated_at: string;
  vendor_id: string;
}

