import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { BrainCircuit, Plus, X, Clock, Loader2 } from "lucide-react";

// Task interface
type Task = {
  id: string;
  title: string;
  is_completed: boolean;
  user_id: string;
  priority: number;
  created_at: string;
};

export function ADHDTaskManager() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['adhd-tasks', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      // Use a type cast to resolve the table name issue
      const { data, error } = await (supabase as any)
        .from('tasks')
        .select('*')
        .eq('user_id', session.user.id)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching tasks:", error);
        return [];
      }

      return data as Task[];
    },
    enabled: !!session?.user?.id,
  });

  const addTask = useMutation({
    mutationFn: async () => {
      if (!session?.user?.id) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          title: newTaskTitle,
          is_completed: false,
          user_id: session.user.id,
          priority: 1,
        }])
        .select();

      if (error) {
        console.error("Error adding task:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adhd-tasks'] });
      setNewTaskTitle("");
      toast({
        title: "Task added",
        description: "New task has been added to your list.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const toggleTaskCompletion = useMutation({
    mutationFn: async (task: Task) => {
      if (!session?.user?.id) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('tasks')
        .update({ is_completed: !task.is_completed })
        .eq('id', task.id);

      if (error) {
        console.error("Error updating task:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adhd-tasks'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (task: Task) => {
      if (!session?.user?.id) throw new Error("Not authenticated");

      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', task.id);

      if (error) {
        console.error("Error deleting task:", error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adhd-tasks'] });
      toast({
        title: "Task deleted",
        description: "Task has been removed from your list.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <Card>
      <CardHeader className="flex items-center space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <BrainCircuit className="h-4 w-4" />
          ADHD Task Manager
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input
            type="text"
            placeholder="Add a new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <Button onClick={() => addTask.mutate()} disabled={!newTaskTitle || addTask.isLoading}>
            {addTask.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <Plus className="h-4 w-4 mr-2" />
            )}
            Add
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : tasks && tasks.length > 0 ? (
          <div className="space-y-2">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-2 rounded-md border">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={task.is_completed}
                    onCheckedChange={() => toggleTaskCompletion.mutate(task)}
                    id={`task-${task.id}`}
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {task.title}
                  </label>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTask.mutate(task)}
                  disabled={deleteTask.isLoading}
                >
                  {deleteTask.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            <Clock className="h-6 w-6 mx-auto mb-2" />
            No tasks yet. Add some to get started!
          </div>
        )}
      </CardContent>
    </Card>
  );
}
