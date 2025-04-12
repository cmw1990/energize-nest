
import { Plan, ProgressRecord } from "@/types/energyPlans"
import { PlanList } from "./PlanList"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/components/AuthProvider"
import { Card, CardContent } from "@/components/ui/card"
import { assertType, wrapQueryResult } from "@/utils/typeUtils"
import { adaptDbPlanToAppPlan } from "@/types/energyPlans"

interface SavedPlansProps {
  progress?: ProgressRecord[]
}

export const SavedPlans = ({ progress }: SavedPlansProps) => {
  const { session } = useAuth()

  const { data: savedPlans, isLoading: isLoadingSaved } = useQuery<Plan[]>({
    queryKey: ['energy-plans', 'saved', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return []
      
      // Use wrapQueryResult to prevent "excessively deep" type errors
      const result = await wrapQueryResult(async () => {
        return supabase
          .from('user_saved_plans')
          .select(`
            plan_id,
            energy_plans (
              *,
              energy_plan_components (*)
            )
          `)
          .eq('user_id', session.user.id);
      });
      
      const { data, error } = result;
      if (error) throw error;
      
      if (!data || data.length === 0) return [];
      
      // Transform database models to application models
      const plans = data
        .filter(item => item.energy_plans)
        .map(item => assertType<Plan>(adaptDbPlanToAppPlan(item.energy_plans)));
      
      return plans;
    },
    enabled: !!session?.user?.id
  })

  if (!session?.user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Please sign in to view saved plans</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <PlanList
      plans={savedPlans}
      progress={progress}
      isLoading={isLoadingSaved}
    />
  )
}
