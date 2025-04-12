
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlusCircle, ChevronRight, AlertCircle, Check, XCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@/types/database";

type TaskFormState = {
  title: string;
  priority: string;
  description?: string;
  due_date?: string;
};

export function EisenhowerMatrix() {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newTask, setNewTask] = useState<TaskFormState>({
    title: "",
    priority: "important"
  });
  const [isAddingTask, setIsAddingTask] = useState(false);

  // Fetch tasks
  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as Task[] || [];
    },
    enabled: !!session?.user?.id
  });

  // Add task mutation
  const addTaskMutation = useMutation({
    mutationFn: async (task: TaskFormState) => {
      if (!session?.user?.id) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          title: task.title,
          status: "todo",
          priority: task.priority,
          description: task.description,
          due_date: task.due_date,
          user_id: session.user.id,
        });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", session?.user?.id] });
      setNewTask({ title: "", priority: "important" });
      setIsAddingTask(false);
      toast({
        title: "Task added",
        description: "Your task has been added to the matrix."
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to add task",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  // Update task status mutation
  const updateTaskStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from("tasks")
        .update({ status })
        .eq("id", id);
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", session?.user?.id] });
    },
    onError: (error) => {
      toast({
        title: "Failed to update task",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) {
      toast({
        title: "Task title required",
        description: "Please enter a title for your task.",
        variant: "destructive"
      });
      return;
    }
    
    addTaskMutation.mutate(newTask);
  };

  const handleToggleStatus = (task: Task) => {
    const newStatus = task.status === "done" ? "todo" : "done";
    updateTaskStatusMutation.mutate({ id: task.id, status: newStatus });
  };

  // Filter tasks by quadrant
  const urgentImportant = tasks?.filter(t => t.priority === "urgent" && t.status !== "done") || [];
  const importantNotUrgent = tasks?.filter(t => t.priority === "important" && t.status !== "done") || [];
  const urgentNotImportant = tasks?.filter(t => t.priority === "regular" && t.status !== "done") || [];
  const notUrgentNotImportant = tasks?.filter(t => t.priority === "low" && t.status !== "done") || [];
  const completedTasks = tasks?.filter(t => t.status === "done") || [];

  if (isLoading) {
    return <div>Loading matrix...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Eisenhower Matrix</h2>
        <Button 
          onClick={() => setIsAddingTask(!isAddingTask)}
          variant="outline"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {isAddingTask && (
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleAddTask} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Task Title</Label>
                <Input 
                  id="title"
                  placeholder="What needs to be done?"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Priority</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    variant={newTask.priority === "urgent" ? "default" : "outline"}
                    onClick={() => setNewTask({...newTask, priority: "urgent"})}
                    className="justify-start"
                  >
                    <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                    Urgent & Important
                  </Button>
                  <Button
                    type="button"
                    variant={newTask.priority === "important" ? "default" : "outline"}
                    onClick={() => setNewTask({...newTask, priority: "important"})}
                    className="justify-start"
                  >
                    <ChevronRight className="mr-2 h-4 w-4 text-blue-500" />
                    Important, Not Urgent
                  </Button>
                  <Button
                    type="button"
                    variant={newTask.priority === "regular" ? "default" : "outline"}
                    onClick={() => setNewTask({...newTask, priority: "regular"})}
                    className="justify-start"
                  >
                    <ChevronRight className="mr-2 h-4 w-4 text-yellow-500" />
                    Urgent, Not Important
                  </Button>
                  <Button
                    type="button"
                    variant={newTask.priority === "low" ? "default" : "outline"}
                    onClick={() => setNewTask({...newTask, priority: "low"})}
                    className="justify-start"
                  >
                    <ChevronRight className="mr-2 h-4 w-4 text-gray-500" />
                    Not Urgent or Important
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddingTask(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={addTaskMutation.isPending}
                >
                  {addTaskMutation.isPending ? "Adding..." : "Add Task"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quadrant 1: Urgent & Important */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center text-red-500">
              <AlertCircle className="mr-2 h-5 w-5" />
              Do First (Urgent & Important)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {urgentImportant.length > 0 ? (
                urgentImportant.map(task => (
                  <li key={task.id} className="flex items-start gap-2 p-2 hover:bg-muted/50 rounded">
                    <Checkbox 
                      checked={task.status === "done"}
                      onCheckedChange={() => handleToggleStatus(task)}
                    />
                    <div className="flex-1 truncate">
                      {task.title}
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No urgent and important tasks.</p>
              )}
            </ul>
          </CardContent>
        </Card>
        
        {/* Quadrant 2: Important, Not Urgent */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-500">
              <ChevronRight className="mr-2 h-5 w-5" />
              Schedule (Important, Not Urgent)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {importantNotUrgent.length > 0 ? (
                importantNotUrgent.map(task => (
                  <li key={task.id} className="flex items-start gap-2 p-2 hover:bg-muted/50 rounded">
                    <Checkbox 
                      checked={task.status === "done"}
                      onCheckedChange={() => handleToggleStatus(task)}
                    />
                    <div className="flex-1 truncate">
                      {task.title}
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No important, not urgent tasks.</p>
              )}
            </ul>
          </CardContent>
        </Card>
        
        {/* Quadrant 3: Urgent, Not Important */}
        <Card className="border-l-4 border-l-yellow-500">
          <CardHeader>
            <CardTitle className="flex items-center text-yellow-500">
              <ChevronRight className="mr-2 h-5 w-5" />
              Delegate (Urgent, Not Important)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {urgentNotImportant.length > 0 ? (
                urgentNotImportant.map(task => (
                  <li key={task.id} className="flex items-start gap-2 p-2 hover:bg-muted/50 rounded">
                    <Checkbox 
                      checked={task.status === "done"}
                      onCheckedChange={() => handleToggleStatus(task)}
                    />
                    <div className="flex-1 truncate">
                      {task.title}
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No urgent, not important tasks.</p>
              )}
            </ul>
          </CardContent>
        </Card>
        
        {/* Quadrant 4: Not Urgent, Not Important */}
        <Card className="border-l-4 border-l-gray-500">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-500">
              <ChevronRight className="mr-2 h-5 w-5" />
              Eliminate (Not Urgent or Important)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {notUrgentNotImportant.length > 0 ? (
                notUrgentNotImportant.map(task => (
                  <li key={task.id} className="flex items-start gap-2 p-2 hover:bg-muted/50 rounded">
                    <Checkbox 
                      checked={task.status === "done"}
                      onCheckedChange={() => handleToggleStatus(task)}
                    />
                    <div className="flex-1 truncate">
                      {task.title}
                    </div>
                  </li>
                ))
              ) : (
                <p className="text-muted-foreground text-sm">No tasks in this category.</p>
              )}
            </ul>
          </CardContent>
        </Card>
      </div>
      
      {/* Completed Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Check className="mr-2 h-5 w-5 text-green-500" />
            Completed Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {completedTasks.length > 0 ? (
              completedTasks.map(task => (
                <li key={task.id} className="flex items-start gap-2 p-2 hover:bg-muted/50 rounded text-muted-foreground line-through">
                  <Checkbox 
                    checked={true}
                    onCheckedChange={() => handleToggleStatus(task)}
                  />
                  <div className="flex-1 truncate">
                    {task.title}
                  </div>
                </li>
              ))
            ) : (
              <p className="text-muted-foreground text-sm">No completed tasks yet.</p>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
