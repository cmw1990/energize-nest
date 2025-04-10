import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Copy, X, Plus, Check, Clock, AlertTriangle, BrainCircuit } from "lucide-react";

type Task = {
  id: string;
  title: string;
  is_completed: boolean;
  user_id: string;
  urgency: 'high' | 'low';
  importance: 'high' | 'low';
  created_at: string;
};

export function EisenhowerMatrix() {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { data: tasks, isLoading } = useQuery({
    queryKey: ['eisenhower-tasks', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      // Use a type cast to resolve the table name issue
      const { data, error } = await (supabase as any)
        .from('tasks')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching tasks:", error);
        return [];
      }

      return data as Task[];
    },
    enabled: !!session?.user?.id,
  });

  const [newTask, setNewTask] = useState({
    title: "",
    urgency: "high",
    importance: "high",
  });

  const addTask = useMutation({
    mutationFn: async () => {
      const { error } = await (supabase as any)
        .from('tasks')
        .insert([
          {
            title: newTask.title,
            urgency: newTask.urgency,
            importance: newTask.importance,
            user_id: session?.user?.id,
            is_completed: false,
          },
        ]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eisenhower-tasks'] });
      toast({
        title: "Task added",
        description: "Your task has been added to the matrix.",
      });
      setNewTask({ title: "", urgency: "high", importance: "high" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      });
      console.error("Error adding task:", error);
    },
  });

  const updateTask = useMutation({
    mutationFn: async (task: Task) => {
      const { error } = await supabase
        .from('tasks')
        .update({ is_completed: !task.is_completed })
        .eq('id', task.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eisenhower-tasks'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating task:", error);
    },
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['eisenhower-tasks'] });
      toast({
        title: "Task deleted",
        description: "The task has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      });
    },
  });

  const urgentAndImportantTasks = tasks?.filter(
    (task) => task.urgency === "high" && task.importance === "high"
  );
  const urgentButNotImportantTasks = tasks?.filter(
    (task) => task.urgency === "high" && task.importance === "low"
  );
  const notUrgentButImportantTasks = tasks?.filter(
    (task) => task.urgency === "low" && task.importance === "high"
  );
  const notUrgentAndNotImportantTasks = tasks?.filter(
    (task) => task.urgency === "low" && task.importance === "low"
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-primary" />
          Eisenhower Matrix
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            placeholder="Add New Task"
            value={newTask.title}
            onChange={(e) =>
              setNewTask({ ...newTask, title: e.target.value })
            }
          />
          <Button onClick={() => addTask.mutate()} disabled={addTask.isPending}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        <Tabs defaultValue="manage" className="space-y-4">
          <TabsList>
            <TabsTrigger value="manage">Manage</TabsTrigger>
            <TabsTrigger value="delegate">Delegate</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="eliminate">Eliminate</TabsTrigger>
          </TabsList>

          <TabsContent value="manage" className="space-y-2">
            <h3 className="text-lg font-medium">
              Urgent and Important (Do First)
            </h3>
            {urgentAndImportantTasks?.map((task) => (
              <Card key={task.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.is_completed}
                      onCheckedChange={() => updateTask.mutate(task)}
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
                    onClick={() => deleteTask.mutate(task.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="delegate" className="space-y-2">
            <h3 className="text-lg font-medium">
              Urgent but Not Important (Delegate)
            </h3>
            {urgentButNotImportantTasks?.map((task) => (
              <Card key={task.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.is_completed}
                      onCheckedChange={() => updateTask.mutate(task)}
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
                    onClick={() => deleteTask.mutate(task.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="schedule" className="space-y-2">
            <h3 className="text-lg font-medium">
              Not Urgent but Important (Schedule)
            </h3>
            {notUrgentButImportantTasks?.map((task) => (
              <Card key={task.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.is_completed}
                      onCheckedChange={() => updateTask.mutate(task)}
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
                    onClick={() => deleteTask.mutate(task.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="eliminate" className="space-y-2">
            <h3 className="text-lg font-medium">
              Not Urgent and Not Important (Eliminate)
            </h3>
            {notUrgentAndNotImportantTasks?.map((task) => (
              <Card key={task.id} className="p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.is_completed}
                      onCheckedChange={() => updateTask.mutate(task)}
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
                    onClick={() => deleteTask.mutate(task.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
