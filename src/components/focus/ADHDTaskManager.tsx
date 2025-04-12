
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Brain,
  Check,
  Clock,
  ListTodo,
  PlaySquare,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  body?: string;
  interestLevel: number;
  difficulty: number;
  estimatedMinutes?: number;
  isDone: boolean;
  isStarted: boolean;
  createdAt: string;
  bodyFocus?: boolean;
  brainFocus?: boolean;
}

export function ADHDTaskManager() {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [newTask, setNewTask] = useState("");
  const [interestLevel, setInterestLevel] = useState(5);
  const [difficulty, setDifficulty] = useState(5);
  const [bodyFocus, setBodyFocus] = useState(false);
  const [brainFocus, setBrainFocus] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [estimatedMinutes, setEstimatedMinutes] = useState(15);
  
  // Fetch tasks from Supabase
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['adhd-tasks'],
    queryFn: async () => {
      try {
        // In a real application, this would fetch from Supabase
        // For now, just return mock data for demonstration
        return [
          {
            id: "1",
            title: "Complete project outline",
            interestLevel: 7,
            difficulty: 6,
            estimatedMinutes: 30,
            isDone: false,
            isStarted: false,
            createdAt: new Date().toISOString(),
            bodyFocus: false,
            brainFocus: true
          },
          {
            id: "2",
            title: "Set up home office",
            interestLevel: 8,
            difficulty: 4,
            estimatedMinutes: 60,
            isDone: false,
            isStarted: true,
            createdAt: new Date().toISOString(),
            bodyFocus: true,
            brainFocus: false
          },
          {
            id: "3",
            title: "Read book chapter",
            interestLevel: 6,
            difficulty: 5,
            estimatedMinutes: 45,
            isDone: true,
            isStarted: false,
            createdAt: new Date().toISOString(),
            bodyFocus: false,
            brainFocus: true
          }
        ] as Task[];
      } catch (error) {
        console.error("Error fetching tasks:", error);
        throw error;
      }
    },
    enabled: true,
  });
  
  // Filter tasks based on active tab
  const filteredTasks = tasks.filter(task => {
    if (activeTab === "all") return true;
    if (activeTab === "active") return !task.isDone;
    if (activeTab === "done") return task.isDone;
    if (activeTab === "body") return task.bodyFocus;
    if (activeTab === "brain") return task.brainFocus;
    return true;
  });
  
  // Add a new task
  const addTask = useMutation({
    mutationFn: async () => {
      if (!newTask) return;
      
      const task: Omit<Task, "id"> = {
        title: newTask,
        interestLevel,
        difficulty,
        estimatedMinutes,
        isDone: false,
        isStarted: false,
        createdAt: new Date().toISOString(),
        bodyFocus,
        brainFocus,
      };
      
      // In a real app, you would save to Supabase here
      console.log("Adding task:", task);
      
      // For demo purposes, just simulate a success
      return { ...task, id: Date.now().toString() } as Task;
    },
    onSuccess: (newTask) => {
      // Update local cache
      queryClient.setQueryData(['adhd-tasks'], (oldData: Task[] = []) => [...oldData, newTask]);
      
      toast({
        title: "Task added",
        description: "Your task has been added successfully.",
      });
      
      // Reset form
      setNewTask("");
      setInterestLevel(5);
      setDifficulty(5);
      setEstimatedMinutes(15);
      setBodyFocus(false);
      setBrainFocus(true);
      setIsAddingTask(false);
    },
    onError: (error) => {
      toast({
        title: "Error adding task",
        description: "There was an error adding your task. Please try again.",
        variant: "destructive",
      });
      console.error("Error adding task:", error);
    },
  });
  
  // Toggle task done status
  const toggleTaskDone = useMutation({
    mutationFn: async (taskId: string) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      // In a real app, you would update Supabase here
      console.log("Toggling task done status:", taskId);
      
      // For demo purposes, just return the updated task
      return { ...task, isDone: !task.isDone };
    },
    onSuccess: (updatedTask) => {
      // Update local cache
      queryClient.setQueryData(['adhd-tasks'], (oldData: Task[] = []) => 
        oldData.map(task => task.id === updatedTask.id ? updatedTask : task)
      );
      
      toast({
        title: updatedTask.isDone ? "Task completed" : "Task reopened",
        description: updatedTask.isDone ? "Great job completing this task!" : "Task marked as not done.",
      });
    },
  });
  
  // Toggle task started status
  const toggleTaskStarted = useMutation({
    mutationFn: async (taskId: string) => {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      
      // In a real app, you would update Supabase here
      console.log("Toggling task started status:", taskId);
      
      // For demo purposes, just return the updated task
      return { ...task, isStarted: !task.isStarted };
    },
    onSuccess: (updatedTask) => {
      // Update local cache
      queryClient.setQueryData(['adhd-tasks'], (oldData: Task[] = []) => 
        oldData.map(task => task.id === updatedTask.id ? updatedTask : task)
      );
      
      toast({
        title: updatedTask.isStarted ? "Task started" : "Task paused",
        description: updatedTask.isStarted ? "You've started working on this task." : "You've paused this task.",
      });
    },
  });
  
  // Delete a task
  const deleteTask = useMutation({
    mutationFn: async (taskId: string) => {
      // In a real app, you would delete from Supabase here
      console.log("Deleting task:", taskId);
      
      // For demo purposes, just return the ID
      return taskId;
    },
    onSuccess: (taskId) => {
      // Update local cache
      queryClient.setQueryData(['adhd-tasks'], (oldData: Task[] = []) => 
        oldData.filter(task => task.id !== taskId)
      );
      
      toast({
        title: "Task deleted",
        description: "Your task has been removed successfully.",
      });
    },
  });
  
  const getTaskPriority = (task: Task) => {
    const interestFactor = task.interestLevel / 10;
    const difficultyFactor = 1 - (task.difficulty / 10);
    
    // Higher interest and lower difficulty = higher priority
    const priorityScore = (interestFactor * 0.7) + (difficultyFactor * 0.3);
    
    if (priorityScore >= 0.7) return "high";
    if (priorityScore >= 0.4) return "medium";
    return "low";
  };
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "medium": return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "low": return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };
  
  return (
    <div className="space-y-4">
      {isAddingTask ? (
        <div className="space-y-4 p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Add New Task</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsAddingTask(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Task Description</Label>
              <Input
                placeholder="What needs to be done?"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Interest Level</Label>
                  <span className="text-sm">{interestLevel}/10</span>
                </div>
                <Slider
                  value={[interestLevel]}
                  onValueChange={([value]) => setInterestLevel(value)}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Difficulty</Label>
                  <span className="text-sm">{difficulty}/10</span>
                </div>
                <Slider
                  value={[difficulty]}
                  onValueChange={([value]) => setDifficulty(value)}
                  min={1}
                  max={10}
                  step={1}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Estimated Time (minutes)</Label>
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEstimatedMinutes(Math.max(5, estimatedMinutes - 5))}
                >
                  -5
                </Button>
                <Input
                  type="number"
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(parseInt(e.target.value) || 15)}
                  className="text-center"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEstimatedMinutes(estimatedMinutes + 5)}
                >
                  +5
                </Button>
              </div>
            </div>
            
            <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="brain-focus"
                  checked={brainFocus}
                  onCheckedChange={setBrainFocus}
                />
                <Label htmlFor="brain-focus" className="flex items-center gap-2">
                  <Brain className="h-4 w-4 text-indigo-500" />
                  Brain Focus
                </Label>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch
                  id="body-focus"
                  checked={bodyFocus}
                  onCheckedChange={setBodyFocus}
                />
                <Label htmlFor="body-focus" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Body Movement
                </Label>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                variant="outline"
                onClick={() => setIsAddingTask(false)}
              >
                Cancel
              </Button>
              <Button 
                disabled={!newTask.trim()}
                onClick={() => addTask.mutate()}
              >
                Save Task
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button 
          className="flex items-center gap-2 w-full"
          onClick={() => setIsAddingTask(true)}
        >
          <Plus className="h-4 w-4" />
          Add Task
        </Button>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="done">Done</TabsTrigger>
          <TabsTrigger value="brain">Brain</TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4 mt-4">
          {isLoading ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">
                {activeTab === "all" 
                  ? "No tasks yet. Add your first task!" 
                  : `No ${activeTab} tasks found.`}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTasks.map((task) => {
                const priority = getTaskPriority(task);
                const priorityColor = getPriorityColor(priority);
                
                return (
                  <div
                    key={task.id}
                    className={cn(
                      "p-3 rounded-lg border flex items-center gap-3",
                      task.isDone ? "bg-muted/50" : "bg-background hover:bg-accent/5"
                    )}
                  >
                    <Button
                      variant={task.isDone ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={() => toggleTaskDone.mutate(task.id)}
                    >
                      {task.isDone ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Check className="h-4 w-4 opacity-50" />
                      )}
                    </Button>
                    
                    <div className="flex-1 overflow-hidden">
                      <p className={cn(
                        "font-medium truncate",
                        task.isDone && "text-muted-foreground line-through"
                      )}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {task.estimatedMinutes} min
                        </div>
                        
                        <Badge variant="outline" className={priorityColor}>
                          {priority} energy match
                        </Badge>
                        
                        {task.bodyFocus && (
                          <Badge variant="outline" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            body
                          </Badge>
                        )}
                        
                        {task.brainFocus && (
                          <Badge variant="outline" className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 text-xs">
                            <Brain className="h-3 w-3 mr-1" />
                            brain
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {!task.isDone && (
                        <Button
                          variant={task.isStarted ? "default" : "outline"}
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => toggleTaskStarted.mutate(task.id)}
                        >
                          <PlaySquare className="h-4 w-4" />
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteTask.mutate(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {filteredTasks.length > 0 && (
        <div className="text-sm text-muted-foreground text-center pt-2">
          {filteredTasks.filter(t => t.isDone).length} completed, {filteredTasks.filter(t => !t.isDone).length} remaining
        </div>
      )}
    </div>
  );
}
