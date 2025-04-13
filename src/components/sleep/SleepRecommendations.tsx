import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

interface SleepRecommendation {
  id: string;
  recommendation_text: string;
  priority: number;
}

const SleepRecommendations = () => {
  const { data: recommendationsData } = useQuery({
    queryKey: ['sleep-recommendations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sleep_recommendations')
        .select('*')
        .order('priority', { ascending: false })
        .limit(10);
    
      if (error) throw error;
      return data;
    }
  });

  const recommendations = React.useMemo(() => {
    if (!recommendationsData) return [];
    
    // Place the manipulation logic here that was previously in onSuccess
    return recommendationsData;
  }, [recommendationsData]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Sleep Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 space-y-2">
          {recommendations?.map((recommendation) => (
            <li key={recommendation.id}>{recommendation.recommendation_text}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default SleepRecommendations;
