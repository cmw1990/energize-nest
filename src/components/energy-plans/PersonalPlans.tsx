
import { Plan, ProgressRecord } from "@/types/energyPlans"
import { PlanList } from "./PlanList"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/components/AuthProvider"
import { Card, CardContent } from "@/components/ui/card"
import { adaptDbPlanToAppPlan } from "@/types/energyPlans"
import { typeSafeQueryFn, safeCast } from "@/utils/supabaseTypeUtils"
import { useToast } from "@/hooks/use-toast"

interface PersonalPlansProps {
  onSharePlan?: (plan: Plan) => void
  progress?: ProgressRecord[]
}

export const PersonalPlans = ({ onSharePlan, progress }: PersonalPlansProps) => {
  const { session } = useAuth()
  const { toast } = useToast()

  const { data: myPlans, isLoading: isLoadingMyPlans, error } = useQuery<Plan[]>({
    queryKey: ['energy-plans', 'my-plans', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return []
      
      return typeSafeQueryFn<Plan>(async () => {
        return supabase
          .from('energy_plans')
          .select(`
            *,
            energy_plan_components (*)
          `)
          .eq('created_by', session.user.id)
          .order('created_at', { ascending: false });
      }, (err) => {
        toast({
          title: "Error loading plans",
          description: "There was an issue loading your personal plans. Please try again.",
          variant: "destructive"
        });
      }).then(data => 
        // Transform database models to application models
        data.map(plan => adaptDbPlanToAppPlan(safeCast(plan)))
      );
    },
    enabled: !!session?.user?.id
  })

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-500">
            Unable to load your plans. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!session?.user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Please sign in to view your plans</p>
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
