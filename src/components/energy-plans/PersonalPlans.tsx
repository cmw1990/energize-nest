
import { Plan, ProgressRecord } from "@/types/energyPlans"
import { PlanList } from "./PlanList"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/components/AuthProvider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { adaptDbPlanToAppPlan } from "@/types/energyPlans"
import { typeSafeQueryFn, safeCast } from "@/utils/supabaseTypeUtils"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Plus, RefreshCw } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface PersonalPlansProps {
  onSharePlan?: (plan: Plan) => void
  progress?: ProgressRecord[]
}

export const PersonalPlans = ({ onSharePlan, progress }: PersonalPlansProps) => {
  const { session } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { 
    data: myPlans, 
    isLoading: isLoadingMyPlans, 
    error,
    refetch 
  } = useQuery<Plan[]>({
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

  const duplicatePlanMutation = useMutation({
    mutationFn: async (planId: string) => {
      // First, get the plan details
      const { data: planData } = await supabase
        .from('energy_plans')
        .select('*')
        .eq('id', planId)
        .single();
      
      if (!planData) throw new Error("Plan not found");
      
      // Create a duplicate with a new ID
      const { data: newPlan, error: planError } = await supabase
        .from('energy_plans')
        .insert({
          ...planData,
          id: undefined, // Let the database generate a new ID
          title: `${planData.title} (Copy)`,
          created_by: session?.user?.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_public: false
        })
        .select()
        .single();
      
      if (planError) throw planError;
      
      // Get all components for the original plan
      const { data: components } = await supabase
        .from('energy_plan_components')
        .select('*')
        .eq('plan_id', planId);
      
      if (components && components.length > 0) {
        // Create duplicate components for the new plan
        const componentsToInsert = components.map(component => ({
          ...component,
          id: undefined, // Let the database generate a new ID
          plan_id: newPlan.id,
        }));
        
        const { error: componentsError } = await supabase
          .from('energy_plan_components')
          .insert(componentsToInsert);
        
        if (componentsError) throw componentsError;
      }
      
      return newPlan;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['energy-plans', 'my-plans'] });
      toast({
        title: "Plan duplicated",
        description: "The plan has been duplicated successfully.",
      });
      refetch();
    },
    onError: (error) => {
      toast({
        title: "Error duplicating plan",
        description: "There was an issue duplicating this plan. Please try again.",
        variant: "destructive"
      });
      console.error("Error duplicating plan:", error);
    }
  });

  if (error) {
    return (
      <Card className="border-primary/10 shadow-md">
        <CardContent className="pt-6">
          <div className="text-center text-red-500">
            <p>Unable to load your plans. Please try again later.</p>
            <Button 
              variant="outline" 
              onClick={() => refetch()}
              className="mt-4"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!session?.user) {
    return (
      <Card className="border-primary/10 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Your Energy Plans</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Please sign in to view your plans</p>
        </CardContent>
      </Card>
    )
  }

  const handleCreateNew = () => {
    navigate("/app/energy-plans/create");
  };

  return (
    <Card className="border-primary/10 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between">
          <span>Your Energy Plans</span>
          <Button 
            onClick={handleCreateNew}
            className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-sm transition-all"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Plan
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PlanList
          plans={myPlans}
          progress={progress}
          isLoading={isLoadingMyPlans}
          onSharePlan={onSharePlan}
          onDuplicatePlan={(planId) => duplicatePlanMutation.mutate(planId)}
        />
      </CardContent>
    </Card>
  )
}
