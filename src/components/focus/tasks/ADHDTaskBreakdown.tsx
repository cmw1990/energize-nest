import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { Brain, Plus, Save, Zap, ListChecks, CheckCircle2, Circle } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { Progress } from "@/components/ui/progress";
import { focusDb } from "@/lib/focus-db";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface MicroStep {
  id: string;
  description: string;
  isCompleted: boolean;
  estimatedMinutes: number;
}

export const ADHDTaskBreakdown = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [taskName, setTaskName] = useState("");
  const [microSteps, setMicroSteps] = useState<MicroStep[]>([]);
  const [newStep, setNewStep] = useState("");
  const [stepEstimate, setStepEstimate] = useState("5");
  const [energyLevel, setEnergyLevel] = useState(5);
  const [motivationNotes, setMotivationNotes] = useState("");
  const [reward, setReward] = useState("");

  const { data: tasks } = useQuery({
    queryKey: ['task-breakdowns'],
    queryFn: () => focusDb.getTaskBreakdowns(),
  });

  const createTask = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) throw new Error("No user ID");
      if (!taskName || microSteps.length === 0) throw new Error("Missing required fields");

      await focusDb.createTaskBreakdown({
        task_name: taskName,
        micro_steps: microSteps,
        energy_level: energyLevel,
        motivation_notes: motivationNotes || undefined,
        reward: reward || undefined,
        total_steps: microSteps.length,
      });
    },
    onSuccess: () => {
      toast({
        title: "Task created",
        description: "Your task has been broken down and saved.",
      });
      // Reset form
      setTaskName("");
      setMicroSteps([]);
      setMotivationNotes("");
      setReward("");
      setEnergyLevel(5);
      queryClient.invalidateQueries({ queryKey: ['task-breakdowns'] });
    },
  });

  const updateProgress = useMutation({
    mutationFn: async (taskId: string) => {
      const completedSteps = microSteps.filter(step => step.isCompleted).length;
      await focusDb.updateTaskProgress(taskId, completedSteps);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['task-breakdowns'] });
    },
  });

  const addMicroStep = () => {
    if (!newStep || !stepEstimate) return;
    
    setMicroSteps([
      ...microSteps,
      {
        id: Math.random().toString(36).substr(2, 9),
        description: newStep,
        isCompleted: false,
        estimatedMinutes: parseInt(stepEstimate),
      },
    ]);
    
    setNewStep("");
    setStepEstimate("5");
  };

  const toggleStep = (stepId: string) => {
    setMicroSteps(
      microSteps.map((step) =>
        step.id === stepId
          ? { ...step, isCompleted: !step.isCompleted }
          : step
      )
    );
  };

  const totalMinutes = microSteps.reduce((acc, step) => acc + step.estimatedMinutes, 0);
  const completedSteps = microSteps.filter((step) => step.isCompleted).length;
  const progress = microSteps.length > 0 ? (completedSteps / microSteps.length) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createTask.mutate();
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          ADHD Task Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Task Name</Label>
            <Input
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="What do you need to accomplish?"
            />
          </div>

          <div className="space-y-2">
            <Label>Break it down into micro-steps</Label>
            <div className="flex gap-2">
              <Input
                value={newStep}
                onChange={(e) => setNewStep(e.target.value)}
                placeholder="Small, actionable step"
                className="flex-1"
              />
              <Input
                type="number"
                value={stepEstimate}
                onChange={(e) => setStepEstimate(e.target.value)}
                placeholder="Minutes"
                className="w-24"
              />
              <Button
                type="button"
                onClick={addMicroStep}
                variant="outline"
                size="icon"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {microSteps.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Progress: {completedSteps}/{microSteps.length} steps</span>
                <span>Estimated: {totalMinutes} minutes</span>
              </div>
              <Progress value={progress} className="h-2" />
              <ul className="space-y-2">
                {microSteps.map((step) => (
                  <li
                    key={step.id}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/5 cursor-pointer"
                    onClick={() => toggleStep(step.id)}
                  >
                    {step.isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span className={step.isCompleted ? "line-through text-muted-foreground" : ""}>
                      {step.description}
                    </span>
                    <span className="ml-auto text-sm text-muted-foreground">
                      {step.estimatedMinutes}m
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="space-y-2">
            <Label>Energy Level Required (1-10)</Label>
            <Slider
              value={[energyLevel]}
              onValueChange={(value) => setEnergyLevel(value[0])}
              min={1}
              max={10}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label>Motivation Notes</Label>
            <Textarea
              value={motivationNotes}
              onChange={(e) => setMotivationNotes(e.target.value)}
              placeholder="Why is this task important? What's your motivation?"
            />
          </div>

          <div className="space-y-2">
            <Label>Reward</Label>
            <Input
              value={reward}
              onChange={(e) => setReward(e.target.value)}
              placeholder="How will you celebrate completing this task?"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!taskName || microSteps.length === 0}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Task Breakdown
          </Button>
        </form>

        {/* Task Tips */}
        <Card className="mt-6 bg-primary/5 p-4">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Zap className="h-5 w-5" />
            <p className="font-medium">Task Breakdown Tips:</p>
          </div>
          <ul className="space-y-1 text-sm">
            <li>• Break tasks into 5-15 minute chunks</li>
            <li>• Make each step concrete and actionable</li>
            <li>• Start with the easiest step</li>
            <li>• Use visual cues when possible</li>
            <li>• Set realistic time estimates</li>
          </ul>
        </Card>
      </CardContent>
    </Card>
  );
};
