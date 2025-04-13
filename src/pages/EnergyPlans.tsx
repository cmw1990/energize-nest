
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlanList } from '@/components/energy-plans/PlanList';
import { PlanDiscovery } from '@/components/energy-plans/PlanDiscovery';
import { NewPlanDialog } from '@/components/energy-plans/NewPlanDialog';
import { CelebrityPlanGallery } from '@/components/energy-plans/CelebrityPlanGallery';
import { TopNav } from '@/components/layout/TopNav';
import { PlanFilters } from '@/components/energy-plans/PlanFilters';
import { SavedPlans } from '@/components/energy-plans/SavedPlans';
import { PersonalPlans } from '@/components/energy-plans/PersonalPlans';
import { LifeSituationDialog } from '@/components/energy-plans/LifeSituationDialog';
import { Plan, LifeSituation, PersonalPlansProps, PlanFiltersProps, PlanDiscoveryProps } from '@/types/games';
import { safeArrayCast } from '@/utils/typeSafeUtils';
import { Battery, Zap, Flame, BookOpen } from 'lucide-react';

// Use proper typing for React.FC
const EnergyPlans: React.FC = () => {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [lifeSituation, setLifeSituation] = useState<LifeSituation>("regular");
  const [showLifeSituationDialog, setShowLifeSituationDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch user's personal plans
  const { data: personalPlans, refetch: refetchPersonalPlans } = useQuery({
    queryKey: ['energy_plans', 'personal', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('energy_plans')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Use the safer type cast to avoid deep instantiation errors
      return safeArrayCast<Plan>(data || []);
    },
    enabled: !!session?.user?.id,
  });

  // Fetch expert plans
  const { data: expertPlans } = useQuery({
    queryKey: ['energy_plans', 'expert'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('energy_plans')
        .select('*')
        .eq('plan_type', 'expert')
        .eq('is_expert_plan', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Use the safer type cast to avoid deep instantiation errors
      return safeArrayCast<Plan>(data || []);
    },
  });

  // Function to handle plan creation
  const handlePlanCreated = () => {
    refetchPersonalPlans();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSavePlan = (plan: Plan) => {
    // Implement save plan functionality
    console.log('Saving plan:', plan);
    // You could add API call here to save the plan
  };

  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Battery className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Energy Plans</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowLifeSituationDialog(true)}
            >
              Life Situation: {lifeSituation.charAt(0).toUpperCase() + lifeSituation.slice(1)}
            </Button>
            <NewPlanDialog onPlanCreated={handlePlanCreated} />
          </div>
        </div>

        <Card className="border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Your Energy Management Center
            </CardTitle>
            <CardDescription>
              Create, discover and manage personalized energy plans
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="personal">Personal Plans</TabsTrigger>
                <TabsTrigger value="explore">Explore Plans</TabsTrigger>
                <TabsTrigger value="saved">Saved Plans</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal">
                <PersonalPlans 
                  plans={personalPlans || []} 
                  onPlanCreated={handlePlanCreated}
                />
              </TabsContent>
              
              <TabsContent value="explore">
                <div className="space-y-6">
                  <PlanFilters 
                    selectedCategory={selectedCategory}
                    onCategoryChange={handleCategoryChange}
                  />
                  
                  <div className="grid gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Flame className="h-4 w-4 text-orange-500" />
                          Featured Expert Plans
                        </CardTitle>
                        <CardDescription>
                          Professionally crafted plans for optimal energy management
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <PlanList plans={expertPlans || []} />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-blue-500" />
                          Discover Energy Plans
                        </CardTitle>
                        <CardDescription>
                          Browse community-created energy management strategies
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <PlanDiscovery 
                          selectedCategory={selectedCategory}
                          onSavePlan={handleSavePlan}
                        />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg">Celebrity Energy Plans</CardTitle>
                        <CardDescription>
                          Explore how successful people manage their energy
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <CelebrityPlanGallery />
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="saved">
                <SavedPlans />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h2 className="text-xl font-medium">Need professional guidance?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our expert consultation service provides personalized energy management 
                strategies tailored to your specific needs and circumstances.
              </p>
              <Link to="/expert-consultancy">
                <Button>Book an Expert Consultation</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <LifeSituationDialog 
        open={showLifeSituationDialog}
        onOpenChange={setShowLifeSituationDialog}
        lifeSituation={lifeSituation}
        onSelect={(situation) => setLifeSituation(situation as LifeSituation)}
      />
    </div>
  );
};

export default EnergyPlans;
