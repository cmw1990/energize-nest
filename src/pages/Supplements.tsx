
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SupplementForm } from "@/components/supplements/SupplementForm";
import { SupplementHistory } from "@/components/supplements/SupplementHistory";
import { SupplementCorrelations } from "@/components/supplements/SupplementCorrelations";
import { SupplementInteractions } from "@/components/supplements/SupplementInteractions";
import { SupplementCategories } from "@/components/supplements/SupplementCategories";
import { SupplementStats } from "@/components/supplements/SupplementStats";
import { SupplementInventory } from "@/components/supplements/SupplementInventory";
import { SupplementChart } from "@/components/supplements/SupplementChart";
import { SupplementStacks } from "@/components/supplements/SupplementStacks";
import { PlusCircle, Database, Activity, LineChart, AlarmClock, ListChecks, Pill } from "lucide-react";
import { motion } from "framer-motion";

const Supplements = () => {
  const { session } = useAuth();

  const { data: logs, isLoading } = useQuery({
    queryKey: ['supplementLogs', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplement_logs')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  // Fetch frequently used supplements for quick entry
  const { data: frequentSupplements } = useQuery({
    queryKey: ['frequentSupplements', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplement_logs')
        .select('supplement_name, count(*)')
        .eq('user_id', session?.user?.id)
        .group('supplement_name')
        .order('count', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Supplements Tracker</h1>
          <p className="text-muted-foreground">Track your supplements and see how they affect your energy, focus, and mood</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {frequentSupplements?.map((supplement: any) => (
            <Button 
              key={supplement.supplement_name} 
              variant="outline" 
              size="sm"
              className="flex items-center gap-1"
            >
              <Pill className="h-4 w-4" />
              {supplement.supplement_name}
            </Button>
          ))}
        </div>
      </div>

      <Tabs defaultValue="log" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-4">
          <TabsTrigger value="log">
            <PlusCircle className="h-4 w-4 mr-2" />
            Log
          </TabsTrigger>
          <TabsTrigger value="history">
            <Database className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <Activity className="h-4 w-4 mr-2" />
            Analysis
          </TabsTrigger>
          <TabsTrigger value="stacks">
            <ListChecks className="h-4 w-4 mr-2" />
            Stacks
          </TabsTrigger>
          <TabsTrigger value="interactions">
            <AlarmClock className="h-4 w-4 mr-2" />
            Interactions
          </TabsTrigger>
          <TabsTrigger value="stats">
            <LineChart className="h-4 w-4 mr-2" />
            Stats
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="log" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Log Supplement Intake</CardTitle>
                  <CardDescription>
                    Record your supplement intake and track their effectiveness
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SupplementForm />
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Management</CardTitle>
                  <CardDescription>
                    Keep track of your supplement inventory
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SupplementInventory />
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Supplement Categories</CardTitle>
                <CardDescription>
                  Organize your supplements into categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SupplementCategories />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Supplement History</CardTitle>
              <CardDescription>
                View your supplement intake history
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SupplementHistory logs={logs || []} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analysis">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Supplement Impact Analysis</CardTitle>
                <CardDescription>
                  See how supplements affect various aspects of your wellbeing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SupplementChart data={logs || []} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Correlations with Health Metrics</CardTitle>
                <CardDescription>
                  Discover correlations between supplements and your health
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SupplementCorrelations />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="stacks">
          <Card>
            <CardHeader>
              <CardTitle>Supplement Stacks</CardTitle>
              <CardDescription>
                Create and manage your supplement stacks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SupplementStacks />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="interactions">
          <Card>
            <CardHeader>
              <CardTitle>Supplement Interactions</CardTitle>
              <CardDescription>
                Check for potential supplement interactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SupplementInteractions />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Supplement Statistics</CardTitle>
              <CardDescription>
                View statistics about your supplement usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SupplementStats />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Supplements;
