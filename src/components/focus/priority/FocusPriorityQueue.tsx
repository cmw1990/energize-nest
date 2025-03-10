import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { ListPlus, Battery, Clock, Tags, CheckCircle2, XCircle } from "lucide-react";

type PriorityLevel = "now" | "soon" | "later";

interface Task {
  id: string;
  task_name: string;
  energy_level: number;
  time_estimate_minutes: number;
  priority_level: PriorityLevel;
  context_tags: string[];
  completed: boolean;
  reward_points: number;
}

export const FocusPriorityQueue = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({
    task_name: "",
    energy_level: 5,
    time_estimate_minutes: 30,
    priority_level: "soon" as PriorityLevel,
    context_tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (session?.user) {
      loadTasks();
    }
  }, [session?.user]);

  const loadTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('focus_priority_queue8')
        .select('*')
        .eq('user_id', session?.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Ensure the data conforms to our Task type
      const typedTasks: Task[] = data.map(task => ({
        ...task,
        priority_level: task.priority_level as PriorityLevel,
        context_tags: task.context_tags || [],
        completed: task.completed || false
      }));
      
      setTasks(typedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast({
        title: "Error loading tasks",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const addTask = async () => {
    if (!newTask.task_name) {
      toast({
        title: "Task name required",
        description: "Please enter a task name",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase.from('focus_priority_queue8').insert({
        user_id: session?.user.id,
        task_name: newTask.task_name,
        energy_level: newTask.energy_level,
        time_estimate_minutes: newTask.time_estimate_minutes,
        priority_level: newTask.priority_level,
        context_tags: newTask.context_tags,
        reward_points: Math.floor(newTask.time_estimate_minutes / 10)
      });

      if (error) throw error;

      toast({
        title: "Task added",
        description: "Your task has been added to the queue"
      });

      setNewTask({
        task_name: "",
        energy_level: 5,
        time_estimate_minutes: 30,
        priority_level: "soon",
        context_tags: [],
      });
      loadTasks();
    } catch (error) {
      console.error('Error adding task:', error);
      toast({
        title: "Error adding task",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const toggleTaskCompletion = async (taskId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('focus_priority_queue8')
        .update({ completed })
        .eq('id', taskId);

      if (error) throw error;

      toast({
        title: completed ? "Task completed!" : "Task reopened",
        description: completed ? "Great job finishing this task!" : "Task marked as not completed"
      });

      loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        title: "Error updating task",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const addTag = () => {
    if (tagInput && !newTask.context_tags.includes(tagInput)) {
      setNewTask({
        ...newTask,
        context_tags: [...newTask.context_tags, tagInput]
      });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewTask({
      ...newTask,
      context_tags: newTask.context_tags.filter(tag => tag !== tagToRemove)
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'now':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30';
      case 'soon':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30';
      case 'later':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListPlus className="h-5 w-5 text-indigo-500" />
          Energy-Based Task Queue
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Task Name</Label>
              <Input
                placeholder="Enter task name"
                value={newTask.task_name}
                onChange={(e) => setNewTask({ ...newTask, task_name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Battery className="h-4 w-4 text-indigo-500" />
                <Label>Energy Level Required (1-10)</Label>
              </div>
              <Slider
                value={[newTask.energy_level]}
                onValueChange={(value) => setNewTask({ ...newTask, energy_level: value[0] })}
                max={10}
                min={1}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-500" />
                <Label>Time Estimate (minutes)</Label>
              </div>
              <Slider
                value={[newTask.time_estimate_minutes]}
                onValueChange={(value) => setNewTask({ ...newTask, time_estimate_minutes: value[0] })}
                max={180}
                min={5}
                step={5}
              />
            </div>

            <div className="grid gap-2">
              <Label>Priority Level</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                value={newTask.priority_level}
                onChange={(e) => setNewTask({ ...newTask, priority_level: e.target.value as 'now' | 'soon' | 'later' })}
              >
                <option value="now">Do Now</option>
                <option value="soon">Do Soon</option>
                <option value="later">Do Later</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Tags className="h-4 w-4 text-indigo-500" />
                <Label>Context Tags</Label>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Add context tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTag()}
                />
                <Button onClick={addTag} variant="outline">Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {newTask.context_tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-indigo-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <Button onClick={addTask} className="w-full">
              <ListPlus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>

          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id} className={`p-4 ${task.completed ? 'opacity-50' : ''}`}>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{task.task_name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority_level)}`}>
                        {task.priority_level}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Battery className="h-4 w-4" />
                        Energy: {task.energy_level}/10
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {task.time_estimate_minutes}min
                      </span>
                    </div>
                    {task.context_tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {task.context_tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 rounded-full bg-indigo-100/50 text-indigo-700 text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleTaskCompletion(task.id, !task.completed)}
                  >
                    {task.completed ? (
                      <XCircle className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-indigo-500" />
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-indigo-100/50 dark:bg-indigo-900/20 space-y-2">
          <h3 className="font-semibold">Energy-Based Task Management Tips</h3>
          <ul className="space-y-1 text-sm">
            <li>• Match tasks to your current energy level for better focus</li>
            <li>• Break down larger tasks into smaller, manageable chunks</li>
            <li>• Use context tags to group similar tasks together</li>
            <li>• Prioritize based on both urgency and energy requirements</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
