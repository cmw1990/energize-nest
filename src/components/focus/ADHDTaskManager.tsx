import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { CheckCircle, GripVertical, Loader2, Plus, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Task } from "@/types/database";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PRIORITIES = [
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

const URGENCY_LEVELS = [
  { value: "urgent", label: "Urgent" },
  { value: "normal", label: "Normal" },
  { value: "low", label: "Low" },
];

const INITIAL_TASK_STATE = {
  title: "",
  description: "",
  priority: "medium",
  urgency: "normal",
  due_date: null,
  estimated_minutes: 30,
};

export const ADHDTaskManager = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<Partial<Task>>(INITIAL_TASK_STATE);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (session?.user?.id) {
      fetchTasks();
    }
  }, [session?.user?.id]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching tasks",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async () => {
    if (!newTask.title) {
      toast({
        title: "Error",
        description: "Task title is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("tasks").insert({
        ...newTask,
        user_id: session.user.id,
        status: "todo",
        due_date: selectedDate ? selectedDate.toISOString() : null,
      });

      if (error) throw error;
      toast({
        title: "Task added",
        description: "Task added successfully",
      });
      closeDialog();
      fetchTasks();
    } catch (error: any) {
      toast({
        title: "Error adding task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
      toast({
        title: "Task updated",
        description: "Task updated successfully",
      });
      fetchTasks();
    } catch (error: any) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast({
        title: "Task deleted",
        description: "Task deleted successfully",
      });
      fetchTasks();
    } catch (error: any) {
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const openDialog = () => {
    setIsDialogOpen(true);
    setNewTask(INITIAL_TASK_STATE);
    setSelectedDate(undefined);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setNewTask(INITIAL_TASK_STATE);
    setSelectedDate(undefined);
    setEditingTask(null);
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId !== destination.droppableId) {
      const newStatus = destination.droppableId;
      await updateTask(draggableId, { status: newStatus });
    }
  };

  const formatDate = (date: Date | undefined) => {
    return date ? format(date, "PPP") : "No Due Date";
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description,
      priority: task.priority,
      urgency: task.urgency,
      estimated_minutes: task.estimated_minutes,
      due_date: task.due_date,
    });
    setSelectedDate(task.due_date ? parseISO(task.due_date) : undefined);
    setIsDialogOpen(true);
  };

  const handleUpdateTask = async () => {
    if (!editingTask) return;

    try {
      const { error } = await supabase
        .from("tasks")
        .update({
          ...newTask,
          due_date: selectedDate ? selectedDate.toISOString() : null,
        })
        .eq("id", editingTask.id);

      if (error) throw error;
      toast({
        title: "Task updated",
        description: "Task updated successfully",
      });
      closeDialog();
      fetchTasks();
    } catch (error: any) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="p-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold">Task Manager</CardTitle>
          <Button onClick={openDialog}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {isLoading ? (
              <div className="text-center">
                <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                Loading tasks...
              </div>
            ) : (
              <>
                <TaskList
                  status="todo"
                  tasks={tasks.filter((task) => task.status === "todo")}
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                  onEdit={handleEditTask}
                />
                <TaskList
                  status="in_progress"
                  tasks={tasks.filter((task) => task.status === "in_progress")}
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                  onEdit={handleEditTask}
                />
                <TaskList
                  status="done"
                  tasks={tasks.filter((task) => task.status === "done")}
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                  onEdit={handleEditTask}
                />
              </>
            )}
          </div>
        </DragDropContext>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingTask ? "Edit Task" : "Add Task"}
            </DialogTitle>
            <DialogDescription>
              {editingTask
                ? "Make changes to your task here. Click save when you're done."
                : "Create a new task to add to your list."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                type="text"
                id="title"
                name="title"
                value={newTask.title || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                value={newTask.description || ""}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Priority
              </Label>
              <Select
                value={newTask.priority || "medium"}
                onValueChange={(value) => handleSelectChange("priority", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="urgency" className="text-right">
                Urgency
              </Label>
              <Select
                value={newTask.urgency || "normal"}
                onValueChange={(value) => handleSelectChange("urgency", value)}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select urgency" />
                </SelectTrigger>
                <SelectContent>
                  {URGENCY_LEVELS.map((urgency) => (
                    <SelectItem key={urgency.value} value={urgency.value}>
                      {urgency.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="estimated_minutes" className="text-right">
                Estimated Time (mins)
              </Label>
              <Input
                type="number"
                id="estimated_minutes"
                name="estimated_minutes"
                value={newTask.estimated_minutes?.toString() || "30"}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="due_date" className="text-right">
                Due Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] pl-3 text-left font-normal",
                      !selectedDate && "text-muted-foreground"
                    )}
                  >
                    {selectedDate ? (
                      format(selectedDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={editingTask ? handleUpdateTask : addTask}
            >
              {editingTask ? "Update Task" : "Create Task"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

interface TaskListProps {
  status: string;
  tasks: Task[];
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  onEdit: (task: Task) => void;
}

const TaskList = ({ status, tasks, updateTask, deleteTask, onEdit }: TaskListProps) => {
  const getTitle = (status: string) => {
    switch (status) {
      case "todo":
        return "To Do";
      case "in_progress":
        return "In Progress";
      case "done":
        return "Done";
      default:
        return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="capitalize">{getTitle(status)}</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <Droppable droppableId={status}>
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2"
            >
              {tasks.map((task, index) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  index={index}
                  updateTask={updateTask}
                  deleteTask={deleteTask}
                  onEdit={onEdit}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  );
};

interface TaskItemProps {
  task: Task;
  index: number;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  onEdit: (task: Task) => void;
}

const TaskItem = ({ task, index, updateTask, deleteTask, onEdit }: TaskItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="bg-secondary/50 rounded-md p-3 shadow-sm hover:bg-secondary transition-colors"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <span
                className="cursor-grab mr-2"
                {...provided.dragHandleProps}
              >
                <GripVertical className="h-4 w-4 text-muted-foreground opacity-70" />
              </span>
              <div>
                <h4 className="font-medium">{task.title}</h4>
                <div className="text-sm text-muted-foreground">
                  {task.description || "No description"}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => updateTask(task.id, { status: "done" })}
              >
                <CheckCircle className="h-4 w-4 text-green-500" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(task)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTask(task.id)}
              >
                <XCircle className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
};
