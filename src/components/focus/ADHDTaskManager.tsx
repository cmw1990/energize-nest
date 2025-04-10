
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  ListTodo,
  CheckCircle2,
  Clock,
  PlusCircle,
  Trash2,
  Edit,
  CalendarDays,
  MessageSquarePlus,
  Save,
  XCircle,
} from "lucide-react";

type Task = {
  id: string;
  title: string;
  description?: string;
  due_date?: string;
  status: string;
  priority: string;
  user_id: string;
  created_at: string;
  updated_at?: string;
};

type TaskFormData = {
  title: string;
  description?: string;
  due_date?: string;
  priority: string;
};

export function ADHDTaskManager() {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newTask, setNewTask] = useState<TaskFormData>({
    title: "",
    description: "",
    priority: "medium",
  });
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  // Add task mutation
  const addTaskMutation = useMutation({
    mutationFn: async (taskData: TaskFormData) => {
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          ...taskData,
          user_id: session?.user?.id,
          status: "todo",
        });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setNewTask({
        title: "",
        description: "",
        priority: "medium",
      });
      setIsAddingTask(false);
      toast({
        title: "Task added",
        description: "Your task has been added successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error adding task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update task mutation
  const updateTaskMutation = useMutation({
    mutationFn: async (task: Task) => {
      const { error } = await supabase
        .from("tasks")
        .update(task)
        .eq("id", task.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setEditingTask(null);
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({
        title: "Task deleted",
        description: "Your task has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) {
      toast({
        title: "Title required",
        description: "Please enter a title for your task.",
        variant: "destructive",
      });
      return;
    }
    
    addTaskMutation.mutate(newTask);
  };

  const handleToggleStatus = (task: Task) => {
    const updatedTask = {
      ...task,
      status: task.status === "done" ? "todo" : "done",
    };
    updateTaskMutation.mutate(updatedTask);
  };

  const handleUpdateTask = () => {
    if (!editingTask) return;
    
    if (!editingTask.title) {
      toast({
        title: "Title required",
        description: "Please enter a title for your task.",
        variant: "destructive",
      });
      return;
    }
    
    updateTaskMutation.mutate(editingTask);
  };

  const handleDeleteTask = (taskId: string) => {
    if (confirm("Are you sure you want to delete this task?")) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  // Filter tasks
  const todoTasks = tasks?.filter((task) => task.status === "todo") || [];
  const doneTasks = tasks?.filter((task) => task.status === "done") || [];

  if (isLoading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <Button onClick={() => setIsAddingTask(true)} variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </div>

      {isAddingTask && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Task</CardTitle>
            <CardDescription>Break down your tasks into manageable chunks</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input
                  id="title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="What needs to be done?"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={newTask.description || ""}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Add details about this task..."
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="due_date">Due Date (Optional)</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={newTask.due_date || ""}
                  onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Priority</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={newTask.priority === "high" ? "default" : "outline"}
                    onClick={() => setNewTask({ ...newTask, priority: "high" })}
                    className={newTask.priority === "high" ? "bg-red-500 hover:bg-red-600" : ""}
                  >
                    High
                  </Button>
                  <Button
                    type="button"
                    variant={newTask.priority === "medium" ? "default" : "outline"}
                    onClick={() => setNewTask({ ...newTask, priority: "medium" })}
                    className={newTask.priority === "medium" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                  >
                    Medium
                  </Button>
                  <Button
                    type="button"
                    variant={newTask.priority === "low" ? "default" : "outline"}
                    onClick={() => setNewTask({ ...newTask, priority: "low" })}
                    className={newTask.priority === "low" ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    Low
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

      {editingTask && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Task</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Task Title</Label>
                <Input
                  id="edit-title"
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editingTask.description || ""}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-due-date">Due Date</Label>
                <Input
                  id="edit-due-date"
                  type="date"
                  value={editingTask.due_date || ""}
                  onChange={(e) => setEditingTask({ ...editingTask, due_date: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label>Priority</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={editingTask.priority === "high" ? "default" : "outline"}
                    onClick={() => setEditingTask({ ...editingTask, priority: "high" })}
                    className={editingTask.priority === "high" ? "bg-red-500 hover:bg-red-600" : ""}
                  >
                    High
                  </Button>
                  <Button
                    type="button"
                    variant={editingTask.priority === "medium" ? "default" : "outline"}
                    onClick={() => setEditingTask({ ...editingTask, priority: "medium" })}
                    className={editingTask.priority === "medium" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                  >
                    Medium
                  </Button>
                  <Button
                    type="button"
                    variant={editingTask.priority === "low" ? "default" : "outline"}
                    onClick={() => setEditingTask({ ...editingTask, priority: "low" })}
                    className={editingTask.priority === "low" ? "bg-green-500 hover:bg-green-600" : ""}
                  >
                    Low
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingTask(null)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateTask}
                  disabled={updateTaskMutation.isPending}
                >
                  {updateTaskMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="todo" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="todo" className="flex items-center">
            <ListTodo className="mr-2 h-4 w-4" />
            To Do ({todoTasks.length})
          </TabsTrigger>
          <TabsTrigger value="done" className="flex items-center">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Completed ({doneTasks.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="todo" className="space-y-4 mt-4">
          {todoTasks.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <p>No tasks yet. Add your first task to get started!</p>
              </CardContent>
            </Card>
          ) : (
            todoTasks.map((task) => (
              <Card key={task.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={task.status === "done"}
                      onCheckedChange={() => handleToggleStatus(task)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-medium leading-tight">{task.title}</h3>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingTask(task)}
                            className="h-8 w-8"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteTask(task.id)}
                            className="h-8 w-8 text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1 whitespace-pre-line">
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-3 mt-2">
                        {task.due_date && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <CalendarDays className="mr-1 h-3 w-3" />
                            {new Date(task.due_date).toLocaleDateString()}
                          </div>
                        )}
                        
                        <div className="flex items-center">
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              task.priority === "high"
                                ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
                                : task.priority === "medium"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300"
                                : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300"
                            }`}
                          >
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="done" className="space-y-4 mt-4">
          {doneTasks.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <p>No completed tasks yet.</p>
              </CardContent>
            </Card>
          ) : (
            doneTasks.map((task) => (
              <Card key={task.id} className="overflow-hidden opacity-70">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={true}
                      onCheckedChange={() => handleToggleStatus(task)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-medium leading-tight line-through">{task.title}</h3>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTask(task.id)}
                          className="h-8 w-8 text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-through">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
