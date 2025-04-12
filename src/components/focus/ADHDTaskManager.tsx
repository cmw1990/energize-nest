
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
import { Task } from "@/types/energyPlans";

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
      return data as Task[] || [];
    },
    enabled: !!session?.user?.id,
  });

  // Add task mutation
  const addTaskMutation = useMutation({
    mutationFn: async (taskData: TaskFormData) => {
      const { data, error } = await supabase
        .from("tasks")
        .insert({
          title: taskData.title,
          description: taskData.description || "",
          status: "todo",
          priority: taskData.priority,
          due_date: taskData.due_date,
          user_id: session?.user?.id,
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
        .update({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          due_date: task.due_date,
        })
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
    if (editingTask) {
      updateTaskMutation.mutate(editingTask);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTaskMutation.mutate(taskId);
  };

  const handleStartEditing = (task: Task) => {
    setEditingTask(task);
  };

  const handleCancelEditing = () => {
    setEditingTask(null);
  };

  // Helper function to get priority badge color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "low":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const renderTaskList = (statusFilter: string) => {
    if (!tasks || tasks.length === 0) {
      return (
        <div className="text-center p-4 text-muted-foreground">
          No tasks found. Add a new task to get started.
        </div>
      );
    }

    const filteredTasks = tasks.filter((task) => task.status === statusFilter);

    if (filteredTasks.length === 0) {
      return (
        <div className="text-center p-4 text-muted-foreground">
          No {statusFilter === "todo" ? "active" : "completed"} tasks.
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="overflow-hidden">
            {editingTask && editingTask.id === task.id ? (
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <Label htmlFor={`edit-title-${task.id}`}>Title</Label>
                    <Input
                      id={`edit-title-${task.id}`}
                      value={editingTask.title}
                      onChange={(e) =>
                        setEditingTask({ ...editingTask, title: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`edit-description-${task.id}`}>
                      Description
                    </Label>
                    <Textarea
                      id={`edit-description-${task.id}`}
                      value={editingTask.description || ""}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor={`edit-due-date-${task.id}`}>Due Date</Label>
                    <Input
                      id={`edit-due-date-${task.id}`}
                      type="date"
                      value={editingTask.due_date || ""}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          due_date: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <div className="flex space-x-2 mt-1">
                      <Button
                        type="button"
                        size="sm"
                        variant={
                          editingTask.priority === "low" ? "default" : "outline"
                        }
                        onClick={() =>
                          setEditingTask({ ...editingTask, priority: "low" })
                        }
                      >
                        Low
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={
                          editingTask.priority === "medium"
                            ? "default"
                            : "outline"
                        }
                        onClick={() =>
                          setEditingTask({ ...editingTask, priority: "medium" })
                        }
                      >
                        Medium
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant={
                          editingTask.priority === "high" ? "default" : "outline"
                        }
                        onClick={() =>
                          setEditingTask({ ...editingTask, priority: "high" })
                        }
                      >
                        High
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleCancelEditing}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                    <Button size="sm" onClick={handleUpdateTask}>
                      <Save className="h-4 w-4 mr-1" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            ) : (
              <div className="flex items-start p-4">
                <Checkbox
                  checked={task.status === "done"}
                  onCheckedChange={() => handleToggleStatus(task)}
                  className="mt-1"
                />
                <div className="ml-3 flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3
                        className={`font-medium ${
                          task.status === "done" ? "line-through" : ""
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p
                          className={`text-sm text-muted-foreground mt-1 ${
                            task.status === "done" ? "line-through" : ""
                          }`}
                        >
                          {task.description}
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleStartEditing(task)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {task.priority}
                    </span>
                    {task.due_date && (
                      <span className="flex items-center text-xs text-muted-foreground">
                        <CalendarDays className="h-3 w-3 mr-1" />
                        {new Date(task.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ListTodo className="h-5 w-5 mr-2" />
          ADHD Task Manager
        </CardTitle>
        <CardDescription>
          Break down complex tasks into manageable steps with ADHD-friendly strategies
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isAddingTask ? (
          <Card>
            <CardContent className="p-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    placeholder="What do you need to do?"
                    value={newTask.title}
                    onChange={(e) =>
                      setNewTask({ ...newTask, title: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Add more details about this task..."
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask({ ...newTask, description: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="due-date">Due Date (Optional)</Label>
                  <Input
                    id="due-date"
                    type="date"
                    value={newTask.due_date || ""}
                    onChange={(e) =>
                      setNewTask({ ...newTask, due_date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Priority</Label>
                  <div className="flex space-x-2 mt-1">
                    <Button
                      type="button"
                      size="sm"
                      variant={
                        newTask.priority === "low" ? "default" : "outline"
                      }
                      onClick={() => setNewTask({ ...newTask, priority: "low" })}
                    >
                      Low
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={
                        newTask.priority === "medium" ? "default" : "outline"
                      }
                      onClick={() =>
                        setNewTask({ ...newTask, priority: "medium" })
                      }
                    >
                      Medium
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={
                        newTask.priority === "high" ? "default" : "outline"
                      }
                      onClick={() =>
                        setNewTask({ ...newTask, priority: "high" })
                      }
                    >
                      High
                    </Button>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddingTask(false)}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-1" />
                    Save Task
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Button
            onClick={() => setIsAddingTask(true)}
            className="w-full"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add New Task
          </Button>
        )}

        <Tabs defaultValue="todo">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="todo" className="flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Active Tasks
            </TabsTrigger>
            <TabsTrigger value="done" className="flex items-center">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Completed
            </TabsTrigger>
          </TabsList>
          <TabsContent value="todo" className="mt-4">
            {isLoading ? (
              <div className="py-8 text-center text-muted-foreground">
                Loading tasks...
              </div>
            ) : (
              renderTaskList("todo")
            )}
          </TabsContent>
          <TabsContent value="done" className="mt-4">
            {isLoading ? (
              <div className="py-8 text-center text-muted-foreground">
                Loading tasks...
              </div>
            ) : (
              renderTaskList("done")
            )}
          </TabsContent>
        </Tabs>

        <Card className="bg-primary/5 border-0">
          <CardContent className="p-4">
            <h3 className="font-medium flex items-center">
              <MessageSquarePlus className="h-4 w-4 mr-2" />
              ADHD Task Management Tips
            </h3>
            <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
              <li>• Break large tasks into smaller, manageable steps</li>
              <li>• Use time blocking for focused work periods</li>
              <li>• Set specific deadlines to create urgency</li>
              <li>• Minimize distractions during work time</li>
              <li>• Celebrate completing each task</li>
            </ul>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
