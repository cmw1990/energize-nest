
import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/components/AuthProvider"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlanFilters } from "@/components/energy-plans/PlanFilters"
import { NewPlanDialog } from "@/components/energy-plans/NewPlanDialog"
import { CelebrityPlanGallery } from "@/components/energy-plans/CelebrityPlanGallery"
import { PlanDiscovery } from "@/components/energy-plans/PlanDiscovery"
import { PersonalPlans } from "@/components/energy-plans/PersonalPlans"
import { SavedPlans } from "@/components/energy-plans/SavedPlans"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Baby, Brain } from "lucide-react"
import type { Plan, PlanCategory, ProgressRecord } from "@/types/energyPlans"
import type { Database } from "@/types/supabase"

// Update the UserLifeSituation type to match the database structure
type UserLifeSituationRow = Database['public']['Tables']['user_life_situations']['Row']
type UserLifeSituation = UserLifeSituationRow & { 
  is_active: boolean;
  situation?: string; // Added for backward compatibility
}

const EnergyPlans = () => {
  const { session } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate() // Add this for navigation
  const [selectedTab, setSelectedTab] = useState("discover")
  const [selectedCategory, setSelectedCategory] = useState<PlanCategory | null>(null)
  const [showLifeSituationDialog, setShowLifeSituationDialog] = useState(false)
  const queryClient = useQueryClient()

  const { data: lifeSituation } = useQuery<UserLifeSituation>({
    queryKey: ['user-life-situation', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_life_situations')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('is_active', true)
        .single()
      
      if (error) {
        if (error.code !== 'PGRST116') { // No rows returned
          console.error('Error fetching life situation:', error)
        }
        return null
      }
      
      return data as unknown as UserLifeSituation
    },
    enabled: !!session?.user?.id
  })

  const { data: planProgress } = useQuery<ProgressRecord[]>({
    queryKey: ['energy-plans', 'progress', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return []
      
      const { data, error } = await supabase
        .from('energy_plan_progress')
        .select('*')
        .eq('user_id', session.user.id)
      
      if (error) throw error
      return data as ProgressRecord[]
    },
    enabled: !!session?.user?.id
  })

  const { data: celebrityPlans, isLoading: isLoadingCelebrity } = useQuery<Plan[]>({
    queryKey: ['energy-plans', 'celebrity'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('energy_plans')
        .select(`
          *,
          energy_plan_components (*)
        `)
        .eq('is_expert_plan', true)
        .limit(6)
      
      if (error) throw error
      return data as Plan[]
    }
  })

  const { data: savedPlans } = useQuery<Plan[]>({
    queryKey: ['energy-plans', 'saved', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return []
      
      const { data, error } = await supabase
        .from('user_saved_plans')
        .select(`
          plan_id,
          energy_plans (
            *,
            energy_plan_components (*)
          )
        `)
        .eq('user_id', session.user.id)
      
      if (error) throw error
      return data.map(item => item.energy_plans) as Plan[]
    },
    enabled: !!session?.user?.id
  })

  const savePlanMutation = useMutation({
    mutationFn: async (planId: string) => {
      if (!session?.user) throw new Error("Not authenticated")
      
      const { error } = await supabase
        .from('user_saved_plans')
        .insert({
          user_id: session.user.id,
          plan_id: planId
        })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['energy-plans', 'saved'] })
      toast({
        title: "Plan Saved",
        description: "The energy plan has been saved to your collection"
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save the plan",
        variant: "destructive"
      })
    }
  })

  const sharePlanMutation = useMutation({
    mutationFn: async (plan: Plan) => {
      if (!session?.user) throw new Error("Not authenticated")
      
      const { error } = await supabase
        .from('energy_plans')
        .update({ visibility: 'public' })
        .eq('id', plan.id)
        .eq('created_by', session.user.id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['energy-plans'] })
      toast({
        title: "Plan Shared",
        description: "Your plan is now visible to others"
      })
    }
  })

  const updateLifeSituationMutation = useMutation({
    mutationFn: async (situationType: string) => {
      if (!session?.user) throw new Error("Not authenticated")
      
      const { error } = await supabase
        .from('user_life_situations')
        .upsert({
          user_id: session.user.id,
          situation_type: situationType, // Use situation_type instead of situation
          start_date: new Date().toISOString(),
          is_active: true,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-life-situation'] })
      queryClient.invalidateQueries({ queryKey: ['energy-plans'] })
      toast({
        title: "Preferences Updated",
        description: "Your energy plans will be tailored to your current situation"
      })
      setShowLifeSituationDialog(false)
    }
  })

  const handleCreatePlan = async () => {
    if (!session?.user?.id) return
    
    try {
      const { data, error } = await supabase
        .from('energy_plans')
        .insert({
          user_id: session.user.id,
          plan_name: `My Plan ${Math.floor(Math.random() * 1000)}`,
          plan_type: 'custom',
          duration_minutes: 30,
          activities: {}
        })
        .select()
        .single()
      
      if (error) throw error
      
      // Use the navigate function to redirect to the editor
      navigate(`/energy-plans/${data.id}/edit`)
    } catch (error) {
      console.error('Error creating plan:', error)
      toast({
        title: "Error",
        description: "Failed to create new plan",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="container max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Energy Plans</h1>
          <p className="text-muted-foreground">
            Discover and share energy optimization plans
          </p>
        </div>
        <div className="flex gap-4">
          <Dialog open={showLifeSituationDialog} onOpenChange={setShowLifeSituationDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                {lifeSituation?.situation_type === 'pregnancy' ? <Baby className="h-4 w-4" /> : <Brain className="h-4 w-4" />}
                Update Life Situation
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Your Current Life Situation</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <RadioGroup 
                  onValueChange={(value) => updateLifeSituationMutation.mutate(value)}
                  defaultValue={lifeSituation?.situation_type || "regular"}
                  className="gap-4"
                >
                  <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent">
                    <RadioGroupItem value="regular" id="regular" />
                    <Label htmlFor="regular" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Regular Energy Management</div>
                      <div className="text-sm text-muted-foreground">Standard energy and focus optimization</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent">
                    <RadioGroupItem value="pregnancy" id="pregnancy" />
                    <Label htmlFor="pregnancy" className="flex-1 cursor-pointer">
                      <div className="font-semibold flex items-center gap-2">
                        <Baby className="h-4 w-4" />
                        Pregnancy
                      </div>
                      <div className="text-sm text-muted-foreground">Tailored energy plans for pregnancy</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent">
                    <RadioGroupItem value="postpartum" id="postpartum" />
                    <Label htmlFor="postpartum" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Postpartum Recovery</div>
                      <div className="text-sm text-muted-foreground">Support for the postpartum period</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-accent">
                    <RadioGroupItem value="breastfeeding" id="breastfeeding" />
                    <Label htmlFor="breastfeeding" className="flex-1 cursor-pointer">
                      <div className="font-semibold">Breastfeeding</div>
                      <div className="text-sm text-muted-foreground">Energy support during breastfeeding</div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </DialogContent>
          </Dialog>
          <PlanFilters 
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
          <NewPlanDialog onPlanCreated={handleCreatePlan} />
        </div>
      </div>

      <CelebrityPlanGallery
        plans={celebrityPlans}
        onSavePlan={(id) => savePlanMutation.mutate(id)}
        savedPlans={savedPlans}
      />

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-3">
          <TabsTrigger value="discover">Discover Plans</TabsTrigger>
          <TabsTrigger value="my-plans">My Plans</TabsTrigger>
          <TabsTrigger value="saved">Saved Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="discover">
          <PlanDiscovery
            selectedCategory={selectedCategory}
            progress={planProgress}
            onSavePlan={(id) => savePlanMutation.mutate(id)}
            savedPlans={savedPlans}
            currentLifeSituation={lifeSituation?.situation_type} // Use situation_type
          />
        </TabsContent>

        <TabsContent value="my-plans">
          <PersonalPlans
            progress={planProgress}
            onSharePlan={(plan) => sharePlanMutation.mutate(plan)}
          />
        </TabsContent>

        <TabsContent value="saved">
          <SavedPlans progress={planProgress} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default EnergyPlans
