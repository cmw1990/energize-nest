
export interface AdImpression {
  id: string;
  ad_id: string;
  user_id: string;
  timestamp: string;
  location: string;
  cost: number;
  sponsored_product_id: string;
  impressed_at: string;
  clicked_at: string;
  sponsored_products: {
    id: string;
    placement_type: string;
    budget: number;
    spent: number;
    tier: string;
  };
}

