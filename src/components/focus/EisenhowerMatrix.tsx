import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Task } from "@/types/database";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Clock, GripVertical, ListChecks, Plus, GripHorizontal } from "lucide-react";

interface TaskItemProps {
  task: Task;
  index: number;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, index, onUpdateTask, onDeleteTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);

  const handleSave = () => {
    onUpdateTask(task.id, { title: title });
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="flex items-center justify-between p-3 border rounded-md bg-secondary/50"
        >
          {isEditing ? (
            <div className="flex-1">
              <Input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSave();
                  }
                }}
              />
            </div>
          ) : (
            <div className="flex-1">
              {title}
            </div>
          )}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
              <Clock className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDeleteTask(task.id)}>
              <ListChecks className="h-4 w-4 text-destructive" />
            </Button>
            <div {...provided.dragHandleProps}>
              <GripVertical className="h-4 w-4 cursor-move" />
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

const EisenhowerMatrix = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchTasks();
    }
  }, [session?.user?.id]);

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        setError(error.message);
      } else {
        setTasks(data || []);
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTask.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{
          user_id: session?.user?.id,
          title: newTask,
          priority: 'medium',
          urgency: 'normal',
          status: 'todo',
          estimated_minutes: 30,
          description: '',
          due_date: null
        }])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to create task",
          variant: "destructive"
        });
      } else {
        setTasks(prevTasks => [...(prevTasks || []), ...(data || [])]);
        setNewTask('');
        toast({
          title: "Success",
          description: "Task created successfully",
        });
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId);

      if (error) {
        console.error('Supabase error:', error);
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to update task",
          variant: "destructive"
        });
      } else {
        setTasks(prevTasks =>
          prevTasks.map(task => (task.id === taskId ? { ...task, ...updates } : task))
        );
        toast({
          title: "Success",
          description: "Task updated successfully",
        });
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTask = async (taskId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) {
        console.error('Supabase error:', error);
        setError(error.message);
        toast({
          title: "Error",
          description: "Failed to delete task",
          variant: "destructive"
        });
      } else {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        toast({
          title: "Success",
          description: "Task deleted successfully",
        });
      }
    } catch (err: any) {
      console.error('Unexpected error:', err);
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId &&
      source.index === destination.index) {
      return; // No change
    }

    const newStatus = destination.droppableId;
    updateTask(draggableId, { status: newStatus });
  };

  const getTasksForStatus = (status: string) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <Card className="p-6 space-y-4">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Eisenhower Matrix
        </CardTitle>
        <CardDescription>Organize tasks based on urgency and importance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-2">
          <Input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <Button onClick={addTask} disabled={isLoading}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        {error && (
          <div className="text-red-500">Error: {error}</div>
        )}

        <DragDropContext onDragEnd={handleOnDragEnd}>
          <div className="grid grid-cols-2 gap-4">
            {/* Urgent and Important */}
            <Card className="bg-red-50 dark:bg-red-900/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Do First</CardTitle>
                <CardDescription>Urgent & Important</CardDescription>
              </CardHeader>
              <CardContent>
                <Droppable droppableId="todo">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2 min-h-[50px]"
                    >
                      {getTasksForStatus("todo").map((task, index) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          index={index}
                          onUpdateTask={updateTask}
                          onDeleteTask={deleteTask}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>

            {/* Not Urgent but Important */}
            <Card className="bg-green-50 dark:bg-green-900/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Schedule</CardTitle>
                <CardDescription>Not Urgent & Important</CardDescription>
              </CardHeader>
              <CardContent>
                <Droppable droppableId="in_progress">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2 min-h-[50px]"
                    >
                      {getTasksForStatus("in_progress").map((task, index) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          index={index}
                          onUpdateTask={updateTask}
                          onDeleteTask={deleteTask}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>

            {/* Urgent but Not Important */}
            <Card className="bg-yellow-50 dark:bg-yellow-900/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Delegate</CardTitle>
                <CardDescription>Urgent & Not Important</CardDescription>
              </CardHeader>
              <CardContent>
                <Droppable droppableId="done">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2 min-h-[50px]"
                    >
                      {getTasksForStatus("done").map((task, index) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          index={index}
                          onUpdateTask={updateTask}
                          onDeleteTask={deleteTask}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>

            {/* Not Urgent and Not Important */}
            <Card className="bg-blue-50 dark:bg-blue-900/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Eliminate</CardTitle>
                <CardDescription>Not Urgent & Not Important</CardDescription>
              </CardHeader>
              <CardContent>
                <Droppable droppableId="eliminate">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2 min-h-[50px]"
                    >
                      {getTasksForStatus("eliminate").map((task, index) => (
                        <TaskItem
                          key={task.id}
                          task={task}
                          index={index}
                          onUpdateTask={updateTask}
                          onDeleteTask={deleteTask}
                        />
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </CardContent>
            </Card>
          </div>
        </DragDropContext>
      </CardContent>
    </Card>
  );
};

export default EisenhowerMatrix;
