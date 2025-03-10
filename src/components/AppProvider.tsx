import { createContext, useContext } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { UserPreference, Activity, EnergyMetric } from "@/types";

interface AppContextType {
  userPreferences: UserPreference | null;
  recentActivities: Activity[];
  energyMetrics: EnergyMetric[];
}

const AppContext = createContext<AppContextType>({
  userPreferences: null,
  recentActivities: [],
  energyMetrics: [],
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { session } = useAuth();
  const userId = session?.user?.id;

  // Fetch user preferences
  const { data: userPreferences } = useQuery<UserPreference>({
    queryKey: ["user-preferences", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");

      const { data, error } = await supabase
        .from("user_preferences")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) {
        console.error("Failed to load user preferences:", error);
        throw error;
      }

      return {
        ...data,
        theme: data.theme_preference || 'system',
        notifications_enabled: data.notification_settings?.enabled || false,
        email_notifications: data.notification_settings?.email || false
      } as UserPreference;
    },
    enabled: !!userId,
  });

  // Fetch recent activities
  const { data: recentActivities = [] } = useQuery<Activity[]>({
    queryKey: ["recent-activities", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("activities")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Failed to load recent activities:", error);
        return [];
      }

      return data || [];
    },
    enabled: !!userId,
  });

  // Fetch energy metrics
  const { data: energyMetrics = [] } = useQuery<EnergyMetric[]>({
    queryKey: ["energy-metrics", userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from("energy_metrics")
        .select("*")
        .eq("user_id", userId)
        .order("timestamp", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Failed to load energy metrics:", error);
        return [];
      }

      return data || [];
    },
    enabled: !!userId,
  });

  return (
    <AppContext.Provider
      value={{
        userPreferences: userPreferences || null,
        recentActivities,
        energyMetrics,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Export the context hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
