
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { CheckCircle, Circle, Plus } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export const TaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Complete morning energy ritual', completed: false },
    { id: '2', title: 'Meditate for 10 minutes', completed: true },
    { id: '3', title: 'Take supplements', completed: false },
    { id: '4', title: 'Focus session at 2pm', completed: false },
  ]);
  
  const [newTask, setNewTask] = useState('');
  
  const handleAddTask = () => {
    if (!newTask.trim()) return;
    
    setTasks([...tasks, {
      id: Date.now().toString(),
      title: newTask,
      completed: false
    }]);
    
    setNewTask('');
  };
  
  const handleToggleTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Today's Tasks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Input 
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            onKeyDown={handleKeyDown}
          />
          <Button onClick={handleAddTask}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          {tasks.map(task => (
            <div 
              key={task.id}
              className={`flex items-center p-2 rounded-lg border ${task.completed ? 'opacity-70 bg-muted/50' : 'bg-card'}`}
              onClick={() => handleToggleTask(task.id)}
            >
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => handleToggleTask(task.id)}
                className="mr-2"
              />
              <span className={task.completed ? 'line-through text-muted-foreground' : ''}>
                {task.title}
              </span>
            </div>
          ))}
        </div>
        
        {tasks.some(task => task.completed) && (
          <div className="text-sm text-muted-foreground pt-2">
            {tasks.filter(task => task.completed).length} of {tasks.length} completed
          </div>
        )}
      </CardContent>
    </Card>
  );
};
