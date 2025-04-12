import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { safeArrayCast, safeGet, assertType } from "@/utils/typeSafeUtils";

export const MotivationStats = () => {
  const { session } = useAuth();
  
  const { data: moodData } = useQuery({
    queryKey: ["mood_data", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from("mood_tracking")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .limit(30);
        
      if (error) throw error;
      
      return safeArrayCast(data || []);
    },
    enabled: !!session?.user?.id,
  });
  
  const calculateAverageMood = () => {
    if (!moodData || moodData.length === 0) return 0;
    
    const sum = moodData.reduce((acc, entry) => {
      return acc + (safeGet(entry, 'overall_mood', 0) || 0);
    }, 0);
    
    return sum / moodData.length;
  };
  
  const calculateMoodChange = () => {
    if (!moodData || moodData.length < 2) return 0;
    
    const oldestEntries = moodData.slice(-5);
    const newestEntries = moodData.slice(0, 5);
    
    const oldestAvg = oldestEntries.reduce((acc, entry) => 
      acc + (safeGet(entry, 'overall_mood', 0) || 0), 0) / oldestEntries.length;
      
    const newestAvg = newestEntries.reduce((acc, entry) => 
      acc + (safeGet(entry, 'overall_mood', 0) || 0), 0) / newestEntries.length;
      
    return newestAvg - oldestAvg;
  };
  
  return <div>Motivation Stats - Fixed</div>;
};
