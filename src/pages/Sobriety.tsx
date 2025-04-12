
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Calendar, Trophy, Activity, Users, Clock, Heart, Sparkles, Plus, Calendar as CalendarIcon, CheckCircle2 } from "lucide-react";
import { CravingTracker } from "@/components/sobriety/CravingTracker";
import { WithdrawalTracker } from "@/components/sobriety/WithdrawalTracker";
import { TriggerPatternAnalysis } from "@/components/sobriety/TriggerPatternAnalysis";
import { MoneySaved } from "@/components/sobriety/MoneySaved";
import { HealthImprovements } from "@/components/sobriety/HealthImprovements";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { useState } from "react";
import { format, addDays, differenceInDays } from "date-fns";

interface QuitAttempt {
  id: string;
  user_id: string;
  substance: string;
  start_date: string;
  end_date?: string;
  goal?: string;
  method: string;
  is_active: boolean;
  created_at: string;
}

interface Milestone {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  days_sober: number;
  achieved_at: string;
  health_improvements?: string[];
  money_saved?: number;
  created_at: string;
}

export default function Sobriety() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [quitDialogOpen, setQuitDialogOpen] = useState(false);
  const [milestoneDialogOpen, setMilestoneDialogOpen] = useState(false);
  
  const [newQuitAttempt, setNewQuitAttempt] = useState({
    substance: "alcohol",
    start_date: new Date().toISOString().split("T")[0],
    goal: "",
    method: "cold_turkey",
  });
  
  const [newMilestone, setNewMilestone] = useState({
    title: "",
    description: "",
    health_improvements: "",
    money_saved: "",
  });
  
  const { data: quitAttempts, isLoading: isLoadingQuitAttempts } = useQuery({
    queryKey: ['quitAttempts', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('quit_attempts')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as QuitAttempt[];
    },
    enabled: !!session?.user?.id,
  });

  const { data: milestones, isLoading: isLoadingMilestones } = useQuery({
    queryKey: ['milestones', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('recovery_milestones')
        .select('*')
        .eq('user_id', session.user.id)
        .order('achieved_at', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      return data as Milestone[];
    },
    enabled: !!session?.user?.id,
  });
  
  const createQuitAttemptMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) throw new Error('User not authenticated');
      
      // Check if there's an active quit attempt
      const { data: existingAttempts, error: checkError } = await supabase
        .from('quit_attempts')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('is_active', true);
        
      if (checkError) throw checkError;
      
      // If active attempt exists, update it to inactive
      if (existingAttempts && existingAttempts.length > 0) {
        const { error: updateError } = await supabase
          .from('quit_attempts')
          .update({ is_active: false, end_date: new Date().toISOString() })
          .eq('id', existingAttempts[0].id);
          
        if (updateError) throw updateError;
      }
      
      // Create new quit attempt
      const { error } = await supabase
        .from('quit_attempts')
        .insert({
          user_id: session.user.id,
          substance: newQuitAttempt.substance,
          start_date: newQuitAttempt.start_date,
          goal: newQuitAttempt.goal || null,
          method: newQuitAttempt.method,
          is_active: true,
        });
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quitAttempts'] });
      toast({
        title: "Quit attempt started",
        description: "Your sobriety journey has been recorded. You've got this!",
      });
      setQuitDialogOpen(false);
    },
    onError: (error) => {
      console.error('Error creating quit attempt:', error);
      toast({
        title: "Error",
        description: "Failed to start quit attempt. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const createMilestoneMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) throw new Error('User not authenticated');
      
      // Calculate days sober from active quit attempt
      const activeAttempt = quitAttempts?.find(attempt => attempt.is_active);
      if (!activeAttempt) throw new Error('No active quit attempt found');
      
      const daysSober = differenceInDays(
        new Date(),
        new Date(activeAttempt.start_date)
      );
      
      // Process health improvements from comma-separated string to array
      const healthImprovements = newMilestone.health_improvements
        ? newMilestone.health_improvements.split(',').map(s => s.trim()).filter(Boolean)
        : [];
      
      const { error } = await supabase
        .from('recovery_milestones')
        .insert({
          user_id: session.user.id,
          title: newMilestone.title,
          description: newMilestone.description || null,
          days_sober: daysSober,
          achieved_at: new Date().toISOString(),
          health_improvements: healthImprovements.length > 0 ? healthImprovements : null,
          money_saved: newMilestone.money_saved ? parseFloat(newMilestone.money_saved) : null,
        });
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['milestones'] });
      toast({
        title: "Milestone created",
        description: "Congratulations on your achievement!",
      });
      setMilestoneDialogOpen(false);
      setNewMilestone({
        title: "",
        description: "",
        health_improvements: "",
        money_saved: "",
      });
    },
    onError: (error) => {
      console.error('Error creating milestone:', error);
      toast({
        title: "Error",
        description: "Failed to create milestone. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const relapseMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) throw new Error('User not authenticated');
      
      const activeAttempt = quitAttempts?.find(attempt => attempt.is_active);
      if (!activeAttempt) throw new Error('No active quit attempt found');
      
      // End current attempt
      const { error } = await supabase
        .from('quit_attempts')
        .update({ 
          is_active: false, 
          end_date: new Date().toISOString() 
        })
        .eq('id', activeAttempt.id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quitAttempts'] });
      toast({
        title: "Relapse recorded",
        description: "Don't worry, setbacks are part of the journey. You can start again when you're ready.",
      });
      
      // Open the quit dialog to let them start again if they want
      setQuitDialogOpen(true);
    },
    onError: (error) => {
      console.error('Error recording relapse:', error);
      toast({
        title: "Error",
        description: "Failed to record relapse. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const getCurrentStreak = () => {
    const activeAttempt = quitAttempts?.find(attempt => attempt.is_active);
    if (!activeAttempt) return 0;
    
    const startDate = new Date(activeAttempt.start_date);
    const today = new Date();
    
    return differenceInDays(today, startDate);
  };
  
  const getUpcomingMilestone = () => {
    const streak = getCurrentStreak();
    
    // Common sobriety milestones in days
    const standardMilestones = [1, 3, 7, 14, 30, 60, 90, 180, 365];
    
    // Find the next milestone
    const nextMilestone = standardMilestones.find(days => days > streak);
    
    if (!nextMilestone) return null;
    
    const activeAttempt = quitAttempts?.find(attempt => attempt.is_active);
    if (!activeAttempt) return null;
    
    const startDate = new Date(activeAttempt.start_date);
    const milestoneDate = addDays(startDate, nextMilestone);
    
    return {
      days: nextMilestone,
      date: milestoneDate,
      daysRemaining: nextMilestone - streak
    };
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'PPP');
  };
  
  const getMethodLabel = (method: string) => {
    switch (method) {
      case "cold_turkey": return "Cold Turkey";
      case "taper": return "Tapering";
      case "nrt": return "Nicotine Replacement";
      case "medication": return "Medication";
      case "therapy": return "Therapy";
      case "support_group": return "Support Group";
      default: return method;
    }
  };
  
  const getSubstanceLabel = (substance: string) => {
    switch (substance) {
      case "alcohol": return "Alcohol";
      case "tobacco": return "Tobacco";
      case "cannabis": return "Cannabis";
      case "opioids": return "Opioids";
      case "other": return "Other";
      default: return substance;
    }
  };

  const activeAttempt = quitAttempts?.find(attempt => attempt.is_active);
  const streak = getCurrentStreak();
  const nextMilestone = getUpcomingMilestone();

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Sobriety Journey</h1>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={!activeAttempt ? "default" : "outline"} 
            onClick={() => setQuitDialogOpen(true)}
          >
            {!activeAttempt ? "Start Sobriety Journey" : "Restart Journey"}
          </Button>
          {activeAttempt && (
            <>
              <Button
                variant="outline"
                onClick={() => navigate('/sobriety/log')}
              >
                Log Substance Use
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  if (confirm("Are you sure you want to record a relapse? This will end your current sobriety streak.")) {
                    relapseMutation.mutate();
                  }
                }}
              >
                Record Relapse
              </Button>
            </>
          )}
        </div>
      </div>

      {activeAttempt ? (
        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle className="text-2xl">Current Streak</CardTitle>
                <CardDescription>
                  Staying {getSubstanceLabel(activeAttempt.substance)}-free since {formatDate(activeAttempt.start_date)}
                </CardDescription>
              </div>
              <div className="flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full">
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-4xl font-bold">{streak} days</div>
              <p className="text-sm text-muted-foreground">Method: {getMethodLabel(activeAttempt.method)}</p>
            </div>
            
            <Progress value={(streak / (nextMilestone?.days || 30)) * 100} />
            
            {nextMilestone && (
              <div className="flex justify-between text-sm">
                <span>Current: {streak} days</span>
                <span>Next: {nextMilestone.days} days ({nextMilestone.daysRemaining} remaining)</span>
              </div>
            )}
            
            {activeAttempt.goal && (
              <div className="mt-4 p-4 bg-background rounded-md">
                <h3 className="font-medium">Your Goal</h3>
                <p className="text-muted-foreground">{activeAttempt.goal}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-between border-t pt-4">
            <Button variant="outline" onClick={() => navigate('/sobriety/recovery')}>
              View Journey
            </Button>
            <Button onClick={() => setMilestoneDialogOpen(true)}>
              <Trophy className="mr-2 h-4 w-4" />
              Add Milestone
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center">
            <Sparkles className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Begin Your Journey</h2>
            <p className="text-muted-foreground mb-6">
              Start tracking your sobriety journey and see the positive changes in your life.
            </p>
            <Button size="lg" onClick={() => setQuitDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Start Sobriety Journey
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CravingTracker />
        <WithdrawalTracker />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TriggerPatternAnalysis />
        <MoneySaved />
      </div>

      {activeAttempt && milestones && milestones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Recent Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {milestones.slice(0, 3).map((milestone) => (
                <div key={milestone.id} className="flex items-start gap-4 p-3 border rounded-lg">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{milestone.title}</h3>
                      <Badge variant="outline">{milestone.days_sober} Days</Badge>
                    </div>
                    {milestone.description && (
                      <p className="text-sm text-muted-foreground mt-1">{milestone.description}</p>
                    )}
                    <div className="text-xs text-muted-foreground mt-2">
                      Achieved on {formatDate(milestone.achieved_at)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {milestones.length > 3 && (
              <Button
                variant="link"
                className="mt-4 w-full"
                onClick={() => navigate('/sobriety/recovery')}
              >
                View All Milestones
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Track Progress
            </CardTitle>
            <CardDescription>Log and monitor your substance use</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/sobriety/log')}
            >
              View Logs
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Milestones
            </CardTitle>
            <CardDescription>Celebrate your achievements</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/sobriety/recovery')}
            >
              View Milestones
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Quit Plan
            </CardTitle>
            <CardDescription>Create and manage your quit plan</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/sobriety/quit-plan')}
            >
              View Plan
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Support Network
            </CardTitle>
            <CardDescription>Connect with your support system</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/sobriety/support')}
            >
              Get Support
            </Button>
          </CardContent>
        </Card>

        <HealthImprovements />

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Holistic Approach
            </CardTitle>
            <CardDescription>Comprehensive wellness integration</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Explore how our integrated approach supports your sobriety journey with mood tracking, 
              energy management, and stress reduction tools.
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/app')}
            >
              Explore Wellness Tools
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Start Sobriety Dialog */}
      <Dialog open={quitDialogOpen} onOpenChange={setQuitDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Start Your Sobriety Journey</DialogTitle>
            <DialogDescription>
              Set up your sobriety tracking to monitor your progress and celebrate achievements.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="substance">Substance</Label>
              <Select
                value={newQuitAttempt.substance}
                onValueChange={(value) => setNewQuitAttempt({ ...newQuitAttempt, substance: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select substance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alcohol">Alcohol</SelectItem>
                  <SelectItem value="tobacco">Tobacco</SelectItem>
                  <SelectItem value="cannabis">Cannabis</SelectItem>
                  <SelectItem value="opioids">Opioids</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={newQuitAttempt.start_date}
                onChange={(e) => setNewQuitAttempt({ ...newQuitAttempt, start_date: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="method">Method</Label>
              <Select
                value={newQuitAttempt.method}
                onValueChange={(value) => setNewQuitAttempt({ ...newQuitAttempt, method: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cold_turkey">Cold Turkey</SelectItem>
                  <SelectItem value="taper">Tapering</SelectItem>
                  <SelectItem value="nrt">Nicotine Replacement</SelectItem>
                  <SelectItem value="medication">Medication</SelectItem>
                  <SelectItem value="therapy">Therapy</SelectItem>
                  <SelectItem value="support_group">Support Group</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="goal">Your Goal (Optional)</Label>
              <Textarea
                id="goal"
                placeholder="What's your motivation for quitting?"
                value={newQuitAttempt.goal}
                onChange={(e) => setNewQuitAttempt({ ...newQuitAttempt, goal: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQuitDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => createQuitAttemptMutation.mutate()} 
              disabled={createQuitAttemptMutation.isPending}
            >
              {createQuitAttemptMutation.isPending ? "Starting..." : "Start Journey"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Milestone Dialog */}
      <Dialog open={milestoneDialogOpen} onOpenChange={setMilestoneDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add a Milestone</DialogTitle>
            <DialogDescription>
              Celebrate and document significant achievements in your sobriety journey.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="milestone_title">Title</Label>
              <Input
                id="milestone_title"
                placeholder="e.g., One month sober"
                value={newMilestone.title}
                onChange={(e) => setNewMilestone({ ...newMilestone, title: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="milestone_description">Description (Optional)</Label>
              <Textarea
                id="milestone_description"
                placeholder="How do you feel about this achievement?"
                value={newMilestone.description}
                onChange={(e) => setNewMilestone({ ...newMilestone, description: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="health_improvements">Health Improvements (Optional)</Label>
              <Input
                id="health_improvements"
                placeholder="e.g., Better sleep, reduced anxiety (comma separated)"
                value={newMilestone.health_improvements}
                onChange={(e) => setNewMilestone({ ...newMilestone, health_improvements: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="money_saved">Money Saved (Optional)</Label>
              <Input
                id="money_saved"
                type="number"
                placeholder="e.g., 100"
                value={newMilestone.money_saved}
                onChange={(e) => setNewMilestone({ ...newMilestone, money_saved: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMilestoneDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => createMilestoneMutation.mutate()} 
              disabled={createMilestoneMutation.isPending || !newMilestone.title}
            >
              {createMilestoneMutation.isPending ? "Adding..." : "Add Milestone"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
