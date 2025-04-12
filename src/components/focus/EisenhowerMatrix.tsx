
import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Task } from "@/types/database";
import { supabase } from "@/integrations/supabase/client";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DragDropContext, Droppable, Draggable, DropResult 
} from "react-beautiful-dnd";
import { Brain, Clipboard, Clock, Flame, Plus, Sparkles } from "lucide-react";
import { adaptTasks, prepareTaskForDb } from "./tasks/TaskTypeUtils";
import { DbTask } from "@/integrations/supabase/schema";

const EisenhowerMatrix = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
      
      const adaptedTasks = adaptTasks(data as DbTask[]);
      setTasks(adaptedTasks);
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

  const handleAddTask = async () => {
    if (!session?.user?.id) return;

    try {
      const newTasks = [
        {
          user_id: session.user.id,
          title: "Important & Urgent Task",
          priority: "high" as const,
          urgency: "urgent" as const,
          status: "todo" as const,
          estimated_minutes: 30,
          description: "This task is important and urgent",
          due_date: null,
        },
        {
          user_id: session.user.id,
          title: "Important & Not Urgent Task",
          priority: "high" as const,
          urgency: "normal" as const,
          status: "todo" as const,
          estimated_minutes: 60,
          description: "This task is important but not urgent",
          due_date: null,
        },
        {
          user_id: session.user.id,
          title: "Not Important & Urgent Task",
          priority: "low" as const,
          urgency: "urgent" as const,
          status: "todo" as const,
          estimated_minutes: 15,
          description: "This task is not important but urgent",
          due_date: null,
        },
        {
          user_id: session.user.id,
          title: "Not Important & Not Urgent Task",
          priority: "low" as const,
          urgency: "normal" as const,
          status: "todo" as const,
          estimated_minutes: 45,
          description: "This task is neither important nor urgent",
          due_date: null,
        },
      ];

      // Convert tasks to database format before inserting
      const tasksForDb = newTasks.map(task => prepareTaskForDb(task));
      const { data, error } = await supabase.from("tasks").insert(tasksForDb).select();

      if (error) throw error;

      if (data && data.length) {
        const adaptedTasks = adaptTasks(data as DbTask[]);
        setTasks(prevTasks => [...prevTasks, ...adaptedTasks]);
      }

      toast({
        title: "Demo tasks added",
        description: "Example tasks have been added to your matrix",
      });
    } catch (error: any) {
      toast({
        title: "Error adding tasks",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (destination.droppableId !== source.droppableId) {
      const [newPriority, newUrgency] = destination.droppableId.split("-") as ["high" | "low", "urgent" | "normal"];
      
      const updatedTasks = [...tasks];
      const taskIndex = updatedTasks.findIndex(task => task.id === draggableId);
      
      if (taskIndex !== -1) {
        updatedTasks[taskIndex] = {
          ...updatedTasks[taskIndex],
          priority: newPriority,
          urgency: newUrgency
        };
        setTasks(updatedTasks);
        
        try {
          const updatesForDb = prepareTaskForDb({ 
            priority: newPriority,
            urgency: newUrgency,
          });
          
          const { error } = await supabase
            .from("tasks")
            .update(updatesForDb)
            .eq("id", draggableId);
            
          if (error) throw error;
        } catch (error: any) {
          fetchTasks();
          toast({
            title: "Error updating task",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    }
  };

  const getTasksForQuadrant = (priority: string, urgency: string) => {
    return tasks.filter(
      (task) => 
        task.priority === priority && 
        task.urgency === urgency &&
        task.status !== "done"
    );
  };

  return (
    <Card className="w-full max-w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Brain className="h-5 w-5 text-primary" />
            Eisenhower Matrix
          </CardTitle>
          <Button onClick={handleAddTask} size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" /> Add Demo Tasks
          </Button>
        </div>
        <CardDescription>
          Prioritize tasks based on importance and urgency
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-2 gap-4 h-[450px]">
            <MatrixQuadrant
              title="Do"
              description="Important & Urgent"
              icon={<Flame className="h-4 w-4 text-red-500" />}
              tasks={getTasksForQuadrant("high", "urgent")}
              droppableId="high-urgent"
              isLoading={isLoading}
            />

            <MatrixQuadrant
              title="Schedule"
              description="Important & Not Urgent"
              icon={<Clock className="h-4 w-4 text-amber-500" />}
              tasks={getTasksForQuadrant("high", "normal")}
              droppableId="high-normal"
              isLoading={isLoading}
            />

            <MatrixQuadrant
              title="Delegate"
              description="Not Important & Urgent"
              icon={<Clipboard className="h-4 w-4 text-blue-500" />}
              tasks={getTasksForQuadrant("low", "urgent")}
              droppableId="low-urgent"
              isLoading={isLoading}
            />

            <MatrixQuadrant
              title="Eliminate"
              description="Not Important & Not Urgent"
              icon={<Sparkles className="h-4 w-4 text-purple-500" />}
              tasks={getTasksForQuadrant("low", "normal")}
              droppableId="low-normal"
              isLoading={isLoading}
            />
          </div>
        </DragDropContext>
      </CardContent>
    </Card>
  );
};

interface MatrixQuadrantProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  tasks: Task[];
  droppableId: string;
  isLoading: boolean;
}

const MatrixQuadrant: React.FC<MatrixQuadrantProps> = ({
  title,
  description,
  icon,
  tasks,
  droppableId,
  isLoading,
}) => (
  <Card className="flex flex-col h-full">
    <CardHeader className="py-3 border-b">
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <CardDescription className="text-xs">{description}</CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className="flex-1 p-2 overflow-y-auto">
      <Droppable droppableId={droppableId}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="h-full space-y-2"
          >
            {isLoading ? (
              <div className="text-center mt-4 text-sm text-muted-foreground">
                Loading...
              </div>
            ) : tasks.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-center text-sm text-muted-foreground">
                  Drag tasks here
                </p>
              </div>
            ) : (
              tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="p-2 rounded-md bg-background border shadow-sm"
                    >
                      <div className="font-medium text-sm mb-1">{task.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">
                        {task.description}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </CardContent>
  </Card>
);

export default EisenhowerMatrix;
