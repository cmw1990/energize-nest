import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Brain, CheckCircle2, Plus, Trash } from "lucide-react";

interface TreatmentTask {
  id: string;
  title: string;
  completed: boolean;
  description?: string;
  due_date?: string;
}

interface TreatmentPlan {
  id: string;
  title: string;
  description: string;
  start_date: string;
  end_date?: string;
  provider?: string;
  status: "active" | "completed" | "draft";
  tasks: TreatmentTask[];
  user_id: string;
}

export const TreatmentPlanManager = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedPlan, setSelectedPlan] = useState<TreatmentPlan | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<TreatmentTask | null>(null);
  
  const [newPlan, setNewPlan] = useState({
    title: "",
    description: "",
    provider: "",
    start_date: new Date().toISOString().split("T")[0],
  });
  
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    due_date: "",
  });

  useEffect(() => {
    // Reset task form when dialog opens/closes
    if (!taskDialogOpen) {
      setNewTask({
        title: "",
        description: "",
        due_date: "",
      });
    }
  }, [taskDialogOpen]);

  const { data: treatmentPlans, isLoading } = useQuery({
    queryKey: ['treatment-plans', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data: plans, error } = await supabase
        .from('treatment_plans')
        .select('*')
        .eq('user_id', session.user.id)
        .order('start_date', { ascending: false });
      
      if (error) throw error;
      
      // Fetch tasks for each plan
      const plansWithTasks = await Promise.all(plans.map(async (plan) => {
        const { data: tasks, error: tasksError } = await supabase
          .from('treatment_plan_tasks')
          .select('*')
          .eq('plan_id', plan.id)
          .order('created_at', { ascending: true });
        
        if (tasksError) throw tasksError;
        
        return {
          ...plan,
          tasks: tasks || [],
        };
      }));
      
      return plansWithTasks as TreatmentPlan[];
    },
    enabled: !!session?.user?.id,
  });

  const createPlanMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) throw new Error("User not authenticated");
      
      const { data, error } = await supabase
        .from('treatment_plans')
        .insert({
          user_id: session.user.id,
          title: newPlan.title,
          description: newPlan.description,
          provider: newPlan.provider || null,
          start_date: newPlan.start_date,
          status: "active",
        })
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatment-plans'] });
      toast({
        title: "Treatment plan created",
        description: "Your treatment plan has been created successfully.",
      });
      setCreateDialogOpen(false);
      setNewPlan({
        title: "",
        description: "",
        provider: "",
        start_date: new Date().toISOString().split("T")[0],
      });
    },
    onError: (error) => {
      console.error("Error creating treatment plan:", error);
      toast({
        title: "Error",
        description: "Failed to create treatment plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const addTaskMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id || !selectedPlan) throw new Error("Invalid operation");
      
      const { data, error } = await supabase
        .from('treatment_plan_tasks')
        .insert({
          plan_id: selectedPlan.id,
          title: newTask.title,
          description: newTask.description || null,
          due_date: newTask.due_date || null,
          completed: false,
        })
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatment-plans'] });
      toast({
        title: "Task added",
        description: "The task has been added to your treatment plan.",
      });
      setTaskDialogOpen(false);
      setNewTask({
        title: "",
        description: "",
        due_date: "",
      });
    },
    onError: (error) => {
      console.error("Error adding task:", error);
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleTaskCompletionMutation = useMutation({
    mutationFn: async ({ taskId, isCompleted }: { taskId: string; isCompleted: boolean }) => {
      const { error } = await supabase
        .from('treatment_plan_tasks')
        .update({ completed: isCompleted })
        .eq('id', taskId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatment-plans'] });
    },
    onError: (error) => {
      console.error("Error updating task completion:", error);
      toast({
        title: "Error",
        description: "Failed to update task status. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from('treatment_plan_tasks')
        .delete()
        .eq('id', taskId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['treatment-plans'] });
      toast({
        title: "Task deleted",
        description: "The task has been removed from your treatment plan.",
      });
      setDeleteDialogOpen(false);
      setDeletingTask(null);
    },
    onError: (error) => {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreatePlan = () => {
    if (!newPlan.title) {
      toast({
        title: "Missing information",
        description: "Please provide a title for your treatment plan.",
        variant: "destructive",
      });
      return;
    }
    
    createPlanMutation.mutate();
  };

  const handleAddTask = () => {
    if (!newTask.title) {
      toast({
        title: "Missing information",
        description: "Please provide a title for the task.",
        variant: "destructive",
      });
      return;
    }
    
    addTaskMutation.mutate();
  };

  const handleCompletionChange = (taskId: string, isCompleted: boolean) => {
    toggleTaskCompletionMutation.mutate({ taskId, isCompleted });
    
    if (selectedPlan) {
      const updatedTasks = selectedPlan.tasks.map(task => {
        if (task.id === taskId) {
          return { ...task, completed: isCompleted };
        }
        return task;
      });
      
      setSelectedPlan({ ...selectedPlan, tasks: updatedTasks });
    }
  };

  const handleDeleteTask = () => {
    if (deletingTask) {
      deleteTaskMutation.mutate(deletingTask.id);
    }
  };

  const calculateProgress = (plan: TreatmentPlan) => {
    if (!plan.tasks.length) return 0;
    const completedTasks = plan.tasks.filter(task => task.completed).length;
    return Math.round((completedTasks / plan.tasks.length) * 100);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-semibold">Treatment Plans</h2>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Plan
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading treatment plans...</div>
      ) : treatmentPlans && treatmentPlans.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {treatmentPlans.map(plan => (
            <Card key={plan.id} className="relative overflow-hidden">
              {plan.status === "completed" && (
                <div className="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 text-xs">
                  Completed
                </div>
              )}
              
              <CardHeader>
                <CardTitle>{plan.title}</CardTitle>
                <CardDescription>
                  {plan.provider && <div>Provider: {plan.provider}</div>}
                  <div>Started: {formatDate(plan.start_date)}</div>
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Progress</h3>
                    <span className="text-sm text-muted-foreground">
                      {plan.tasks.filter(task => task.completed).length} of {plan.tasks.length} tasks
                    </span>
                  </div>
                  <Progress value={calculateProgress(plan)} />
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">Tasks</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedPlan(plan);
                        setTaskDialogOpen(true);
                      }}
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Add Task
                    </Button>
                  </div>
                  
                  {plan.tasks.length > 0 ? (
                    <div className="space-y-2">
                      {plan.tasks.map(task => (
                        <div 
                          key={task.id} 
                          className="flex items-start justify-between p-2 border rounded-md"
                        >
                          <div className="flex items-start gap-2">
                            <Checkbox 
                              id={`task-${task.id}`}
                              checked={task.completed}
                              onCheckedChange={(checked) => 
                                handleCompletionChange(task.id, !!checked)
                              }
                              className="mt-1"
                            />
                            <div>
                              <Label
                                htmlFor={`task-${task.id}`}
                                className={task.completed ? "line-through text-muted-foreground" : ""}
                              >
                                {task.title}
                              </Label>
                              {task.description && (
                                <p className="text-sm text-muted-foreground">
                                  {task.description}
                                </p>
                              )}
                              {task.due_date && (
                                <p className="text-xs text-muted-foreground">
                                  Due: {formatDate(task.due_date)}
                                </p>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setDeletingTask(task);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 border rounded-md bg-muted/20">
                      <p className="text-muted-foreground">No tasks added yet</p>
                      <Button 
                        variant="link" 
                        onClick={() => {
                          setSelectedPlan(plan);
                          setTaskDialogOpen(true);
                        }}
                      >
                        Add your first task
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between border-t pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedPlan(plan.status === "active" ? plan : null);
                  }}
                >
                  {plan === selectedPlan ? "Close" : "Manage Plan"}
                </Button>
                
                {plan.status === "active" && calculateProgress(plan) === 100 && (
                  <Button
                    variant="default"
                    className="bg-green-600 hover:bg-green-700"
                    onClick={async () => {
                      try {
                        await supabase
                          .from('treatment_plans')
                          .update({ status: "completed", end_date: new Date().toISOString() })
                          .eq('id', plan.id);
                        
                        queryClient.invalidateQueries({ queryKey: ['treatment-plans'] });
                        
                        toast({
                          title: "Treatment plan completed",
                          description: "Congratulations on completing your treatment plan!",
                        });
                      } catch (error) {
                        console.error("Error completing plan:", error);
                        toast({
                          title: "Error",
                          description: "Failed to mark plan as completed.",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark as Completed
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">You don't have any treatment plans yet.</p>
            <Button onClick={() => setCreateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Plan
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Plan Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Treatment Plan</DialogTitle>
            <DialogDescription>
              Create a new treatment plan to track your therapy or treatment progress.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newPlan.title}
                onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                placeholder="e.g., CBT Treatment Plan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newPlan.description}
                onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                placeholder="Brief description of the treatment plan"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider">Provider (Optional)</Label>
              <Input
                id="provider"
                value={newPlan.provider}
                onChange={(e) => setNewPlan({ ...newPlan, provider: e.target.value })}
                placeholder="e.g., Dr. Jane Smith"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={newPlan.start_date}
                onChange={(e) => setNewPlan({ ...newPlan, start_date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreatePlan} disabled={createPlanMutation.isPending}>
              {createPlanMutation.isPending ? "Creating..." : "Create Plan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Task Dialog */}
      <Dialog open={taskDialogOpen} onOpenChange={setTaskDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Task</DialogTitle>
            <DialogDescription>
              Add a new task to your treatment plan.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="task_title">Task</Label>
              <Input
                id="task_title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                placeholder="e.g., Practice deep breathing for 10 minutes"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task_description">Description (Optional)</Label>
              <Textarea
                id="task_description"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                placeholder="Any additional details about the task"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="task_due_date">Due Date (Optional)</Label>
              <Input
                id="task_due_date"
                type="date"
                value={newTask.due_date}
                onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTask} disabled={addTaskMutation.isPending}>
              {addTaskMutation.isPending ? "Adding..." : "Add Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Task Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-2 p-4 border rounded-md">
            <p className="font-medium">{deletingTask?.title}</p>
            {deletingTask?.description && (
              <p className="text-sm text-muted-foreground mt-1">{deletingTask.description}</p>
            )}
          </div>
          <DialogFooter className="flex justify-between sm:justify-between">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteTask}
              disabled={deleteTaskMutation.isPending}
            >
              {deleteTaskMutation.isPending ? "Deleting..." : "Delete Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
