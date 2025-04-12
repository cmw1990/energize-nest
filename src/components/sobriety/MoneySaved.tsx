
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { typeSafeQueryFn } from "@/utils/supabaseTypeUtils";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, BadgeDollarSign, Calendar, Calculator } from "lucide-react";
import { useState } from "react";
import { format, parseISO, differenceInDays } from "date-fns";

interface QuitAttempt {
  id: string;
  user_id: string;
  start_date: string;
  goal: string;
  status: string;
  daily_cost_estimate: number;
}

interface SubstanceLog {
  id: string;
  user_id: string;
  substance_type: string;
  quantity: number;
  cost: number;
  created_at: string;
}

export function MoneySaved() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: quitAttempt, isLoading: isLoadingQuitAttempt } = useQuery<QuitAttempt | null>({
    queryKey: ['current-quit-attempt'],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      try {
        const data = await typeSafeQueryFn<QuitAttempt>(async () => 
          supabase
            .from('quit_attempts')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('status', 'active')
            .order('start_date', { ascending: false })
            .limit(1)
        );
        
        return data.length > 0 ? data[0] : null;
      } catch (error) {
        console.error('Error fetching quit attempt:', error);
        toast({
          title: "Error",
          description: "Failed to load your quit attempt data.",
          variant: "destructive"
        });
        return null;
      }
    },
    enabled: !!session?.user?.id,
  });

  const { data: logs } = useQuery<SubstanceLog[]>({
    queryKey: ['substance-logs', quitAttempt?.id],
    queryFn: async () => {
      if (!session?.user?.id || !quitAttempt) return [];
      
      try {
        return await typeSafeQueryFn<SubstanceLog>(async () => 
          supabase
            .from('substance_logs')
            .select('*')
            .eq('user_id', session.user.id)
            .gte('created_at', quitAttempt.start_date)
            .order('created_at', { ascending: false })
        );
      } catch (error) {
        console.error('Error fetching substance logs:', error);
        toast({
          title: "Error",
          description: "Failed to load your usage logs.",
          variant: "destructive"
        });
        return [];
      }
    },
    enabled: !!session?.user?.id && !!quitAttempt,
  });

  // Calculate money saved
  const calculateSavings = () => {
    if (!quitAttempt) return { amount: 0, dailySavings: 0, daysQuit: 0 };
    
    const dailyCost = quitAttempt.daily_cost_estimate || 0;
    const startDate = parseISO(quitAttempt.start_date);
    const daysQuit = differenceInDays(new Date(), startDate) || 0;
    
    // Total that would have been spent if not quit
    const totalPotentialCost = dailyCost * daysQuit;
    
    // Sum up any logged costs during the quit period
    const totalActualCost = logs?.reduce((sum, log) => sum + (log.cost || 0), 0) || 0;
    
    // Savings = potential cost minus actual cost
    const savings = totalPotentialCost - totalActualCost;
    
    return {
      amount: savings > 0 ? savings : 0,
      dailySavings: dailyCost,
      daysQuit
    };
  };

  const { amount, dailySavings, daysQuit } = calculateSavings();
  
  // Calculate targets/milestones for visualization
  const getMilestones = () => {
    if (amount <= 0 || !dailySavings) return [];
    
    const milestones = [
      { name: "Coffee for a month", amount: dailySavings * 10 },
      { name: "Nice dinner", amount: dailySavings * 15 },
      { name: "New outfit", amount: dailySavings * 30 },
      { name: "Weekend getaway", amount: dailySavings * 60 },
      { name: "New smartphone", amount: dailySavings * 100 },
      { name: "Vacation", amount: dailySavings * 200 }
    ];
    
    // Filter to show only relevant milestones
    return milestones
      .filter(m => m.amount > 0)
      .sort((a, b) => a.amount - b.amount);
  };
  
  const milestones = getMilestones();
  const nextMilestone = milestones.find(m => m.amount > amount);

  if (isLoadingQuitAttempt) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Money Saved</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-32">
          <DollarSign className="h-8 w-8 animate-pulse text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!quitAttempt) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Money Saved</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <BadgeDollarSign className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">
              Start a quit attempt to track your savings
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden transition-all duration-300" 
      style={{ maxHeight: isExpanded ? '1000px' : '350px' }}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center gap-2">
            <BadgeDollarSign className="h-5 w-5 text-green-500" />
            Money Saved
          </CardTitle>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-primary hover:underline focus:outline-none"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        </div>
        <CardDescription>
          Quit date: {format(parseISO(quitAttempt.start_date), 'MMMM d, yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-3xl font-bold flex items-center gap-2 text-green-500">
          ${amount.toFixed(2)}
          <span className="text-sm font-normal text-muted-foreground">
            (${dailySavings.toFixed(2)}/day)
          </span>
        </div>

        {nextMilestone && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to: {nextMilestone.name}</span>
              <span>${nextMilestone.amount.toFixed(2)}</span>
            </div>
            <Progress value={(amount / nextMilestone.amount) * 100} className="h-2" />
          </div>
        )}

        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {daysQuit} {daysQuit === 1 ? 'day' : 'days'} smoke-free
          </span>
        </div>
        
        {isExpanded && (
          <div className="pt-4 space-y-4 border-t">
            <h4 className="font-medium flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              What You Could Buy With Your Savings
            </h4>
            
            <div className="space-y-3">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className={amount >= milestone.amount ? 'line-through text-muted-foreground' : ''}>
                    {milestone.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">${milestone.amount.toFixed(2)}</span>
                    {amount >= milestone.amount && (
                      <span className="text-green-500 text-sm">Achieved!</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-muted rounded-lg mt-4">
              <h4 className="font-medium mb-2">Your Annual Savings Projection</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">3 Months</p>
                  <p className="font-medium">${(dailySavings * 90).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">6 Months</p>
                  <p className="font-medium">${(dailySavings * 180).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">1 Year</p>
                  <p className="font-medium">${(dailySavings * 365).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">5 Years</p>
                  <p className="font-medium">${(dailySavings * 365 * 5).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
