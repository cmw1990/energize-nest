
import { Plan, PlanCategory, ProgressRecord, LifeSituation } from "@/types/energyPlans";
import { PlanList } from "./PlanList";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { adaptDbPlanToAppPlan } from "@/types/energyPlans";
import { typeSafeQueryFn, safeCast } from "@/utils/supabaseTypeUtils";

interface PlanDiscoveryProps {
  selectedCategory: PlanCategory | string; // Changed to accept string to fix EnergyPlans.tsx
  progress?: ProgressRecord[];
  onSavePlan: (id: string) => void;
  savedPlans?: Plan[];
  currentLifeSituation?: LifeSituation;
  currentCyclePhase?: string;
  biometricData?: {
    energyLevel?: number;
    stressLevel?: number;
    sleepQuality?: number;
    mood?: string;
  };
}

export const PlanDiscovery = ({ 
  selectedCategory, 
  progress,
  onSavePlan,
  savedPlans,
  currentLifeSituation,
  currentCyclePhase,
  biometricData
}: PlanDiscoveryProps) => {
  const { session } = useAuth();

  // Fetch public plans
  const { data: publicPlans, isLoading: isLoadingPublic } = useQuery<Plan[]>({
    queryKey: ['energy-plans', 'public', selectedCategory, currentCyclePhase],
    queryFn: async () => {
      return typeSafeQueryFn<any>(async () => {
        let query = supabase
          .from('energy_plans')
          .select(`
            *,
            energy_plan_components (*)
          `)
          .eq('visibility', 'public')
          .order('likes_count', { ascending: false });
        
        if (selectedCategory && selectedCategory !== 'all') {
          query = query.eq('category', selectedCategory);
        }

        // Filter by life situation if specified
        if (currentLifeSituation) {
          query = query.contains('suitable_life_situations', [currentLifeSituation]);
        }

        // Apply biometric-based filters if available
        if (biometricData?.energyLevel !== undefined) {
          query = query.lte('energy_level_required', biometricData.energyLevel);
        }

        return query;
      }).then(data => 
        // Transform database models to application models
        data.map((plan: any) => adaptDbPlanToAppPlan(safeCast(plan)))
      );
    },
    enabled: !!session?.user?.id
  });

  if (!session?.user) {
    return (
      <div className="text-center p-8">
        <h3 className="text-lg font-semibold mb-2">Sign in to discover plans</h3>
        <p className="text-muted-foreground">
          Create an account to access personalized energy plans and track your progress.
        </p>
      </div>
    );
  }

  // Function to handle saving a plan
  const handleSavePlan = (plan: Plan) => {
    onSavePlan(plan.id);
  };

  return (
    <div className="space-y-6">
      {isLoadingPublic && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-lg border space-y-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[80%]" />
              </div>
            </div>
          ))}
        </div>
      )}

      <PlanList
        plans={publicPlans}
        progress={progress}
        isLoading={isLoadingPublic}
        onSavePlan={onSavePlan}
        savedPlans={savedPlans}
      />
    </div>
  );
};
