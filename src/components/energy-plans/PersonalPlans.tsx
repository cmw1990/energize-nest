
import { Plan, ProgressRecord } from "@/types/energyPlans"
import { PlanList } from "./PlanList"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/components/AuthProvider"
import { Card, CardContent } from "@/components/ui/card"
import { assertType, wrapQueryResult } from "@/utils/typeUtils"
import { adaptDbPlanToAppPlan } from "@/types/energyPlans"

interface PersonalPlansProps {
  onSharePlan: (plan: Plan) => void
  progress?: ProgressRecord[]
}

export const PersonalPlans = ({ onSharePlan, progress }: PersonalPlansProps) => {
  const { session } = useAuth()

  const { data: myPlans, isLoading: isLoadingMyPlans } = useQuery<Plan[]>({
    queryKey: ['energy-plans', 'my-plans', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return []
      
      // Use wrapQueryResult to prevent "excessively deep" type errors
      const result = await wrapQueryResult(async () => {
        return supabase
          .from('energy_plans')
          .select(`
            *,
            energy_plan_components (*)
          `)
          .eq('created_by', session.user.id)
          .order('created_at', { ascending: false });
      });
      
      const { data, error } = result;
      if (error) throw error;
      
      // Transform database models to application models
      return Array.isArray(data) 
        ? data.map(plan => assertType<Plan>(adaptDbPlanToAppPlan(plan)))
        : [];
    },
    enabled: !!session?.user?.id
  })

  if (!session?.user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p>Please sign in to view your plans</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <PlanList
      plans={myPlans}
      progress={progress}
      isLoading={isLoadingMyPlans}
      onSharePlan={onSharePlan}
    />
  )
}
