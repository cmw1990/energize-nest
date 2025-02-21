
export interface PregnancyWellnessCorrelationsRow {
  id: string;
  user_id: string;
  date: string;
  wellness_score: number;
  correlation_factors: {
    activity_impact: any;
    sleep_quality: {
      quality: number;
      duration: number;
      disruptions: string[];
      summary: string;
    };
    energy_pattern: {
      summary: string;
      confidence: number;
      last_updated: string;
    };
    focus_pattern: {
      summary: string;
      confidence: number;
      last_updated: string;
    };
  };
  created_at: string;
}

