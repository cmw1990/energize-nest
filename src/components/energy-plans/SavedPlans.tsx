
import { Plan, ProgressRecord } from "@/types/energyPlans"
import { PlanList } from "./PlanList"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/components/AuthProvider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { adaptDbPlanToAppPlan } from "@/types/energyPlans"
import { typeSafeQueryFn, safeCast } from "@/utils/supabaseTypeUtils"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { RefreshCw, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SavedPlansProps {
  progress?: ProgressRecord[]
}

export const SavedPlans = ({ progress }: SavedPlansProps) => {
  const { session } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { 
    data: savedPlans, 
    isLoading: isLoadingSaved, 
    error,
    refetch 
  } = useQuery<Plan[]>({
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

  const unsavePlanMutation = useMutation({
    mutationFn: async (planId: string) => {
      const { error } = await supabase
        .from('user_saved_plans')
        .delete()
        .eq('user_id', session?.user?.id)
        .eq('plan_id', planId);
      
      if (error) throw error;
      return planId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['energy-plans', 'saved'] });
      toast({
        title: "Plan removed",
        description: "The plan has been removed from your saved plans.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error removing plan",
        description: "There was an issue removing this plan. Please try again.",
        variant: "destructive"
      });
      console.error("Error removing saved plan:", error);
    }
  });

  // Duplicate plan to user's personal plans
  const duplicateToPlansMutation = useMutation({
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
        title: "Plan copied to your plans",
        description: "You can now customize this plan in your personal collection.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error copying plan",
        description: "There was an issue copying this plan. Please try again.",
        variant: "destructive"
      });
      console.error("Error copying plan:", error);
    }
  });

  if (error) {
    return (
      <Card className="border-primary/10 shadow-md">
        <CardContent className="pt-6">
          <div className="text-center text-red-500">
            <p>Unable to load your saved plans. Please try again later.</p>
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
          <CardTitle>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-amber-500" />
              <span>Saved Plans</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Please sign in to view saved plans</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-primary/10 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-amber-500" />
            <span>Saved Plans</span>
            <Badge variant="outline" className="ml-2">
              {savedPlans?.length || 0} Saved
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <PlanList
          plans={savedPlans}
          progress={progress}
          isLoading={isLoadingSaved}
          onUnsavePlan={(planId) => unsavePlanMutation.mutate(planId)}
          onDuplicatePlan={(planId) => duplicateToPlansMutation.mutate(planId)}
          isSavedList
        />
      </CardContent>
    </Card>
  )
}
