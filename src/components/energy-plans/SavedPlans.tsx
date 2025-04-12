
import { Plan, ProgressRecord } from "@/types/energyPlans"
import { PlanList } from "./PlanList"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/components/AuthProvider"
import { Card, CardContent } from "@/components/ui/card"
import { adaptDbPlanToAppPlan } from "@/types/energyPlans"
import { typeSafeQueryFn, safeCast } from "@/utils/supabaseTypeUtils"
import { useToast } from "@/hooks/use-toast"

interface SavedPlansProps {
  progress?: ProgressRecord[]
}

export const SavedPlans = ({ progress }: SavedPlansProps) => {
  const { session } = useAuth()
  const { toast } = useToast()

  const { data: savedPlans, isLoading: isLoadingSaved, error } = useQuery<Plan[]>({
    queryKey: ['energy-plans', 'saved', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return []
      
      const result = await typeSafeQueryFn<{ plan_id: string; energy_plans: any }>(async () => {
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
      }, (err) => {
        toast({
          title: "Error loading saved plans",
          description: "There was an issue loading your saved plans. Please try again.",
          variant: "destructive"
        });
      });
      
      if (!result || result.length === 0) return [];
      
      // Transform database models to application models
      const plans = result
        .filter(item => item.energy_plans)
        .map(item => adaptDbPlanToAppPlan(safeCast(item.energy_plans)));
      
      return plans;
    },
    enabled: !!session?.user?.id
  })

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-500">
            Unable to load your saved plans. Please try again later.
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!session?.user) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Please sign in to view saved plans</p>
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
