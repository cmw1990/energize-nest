import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { 
  CheckSquare,
  Filter,
  Plus,
  Calendar,
  Clock,
  Search,
  UserPlus,
  Check,
  MoreHorizontal,
  Trash,
  Edit
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { careConnector } from '@/api/apiClient';
import { format } from 'date-fns';

interface TaskManagerProps {
  session: Session | null;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  assigned_to: string | null;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  group_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  user_details?: {
    display_name?: string;
    avatar_url?: string;
  };
  group_details?: {
    name: string;
  };
}

interface Group {
  id: string;
  name: string;
}

interface NewTask {
  title: string;
  description: string;
  due_date: string;
  priority: 'low' | 'medium' | 'high';
  group_id: string;
  assigned_to?: string;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ session }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');
  const { toast } = useToast();
  
  // New task form state
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState<NewTask>({
    title: '',
    description: '',
    due_date: new Date().toISOString().split('T')[0],
    priority: 'medium',
    group_id: '',
  });

  // Load tasks and groups
  useEffect(() => {
    const fetchData = async () => {
      if (!session?.user?.id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch user's group memberships
        const { data: membershipData, error: membershipError } = await supabase
          .from('care8_group_members')
          .select('group_id')
          .eq('user_id', session.user.id);
        
        if (membershipError) throw membershipError;
        
        // Get group details for memberships
        const groupIds = membershipData.map(m => m.group_id);
        
        if (groupIds.length > 0) {
          const { data: groupData, error: groupError } = await supabase
            .from('care8_groups')
            .select('id, name')
            .in('id', groupIds);
            
          if (groupError) throw groupError;
          setGroups(groupData || []);
          
          // Get tasks for these groups
          const { data: tasksData, error: tasksError } = await supabase
            .from('care8_group_tasks')
            .select(`
              *,
              user_details:assigned_to(display_name, avatar_url),
              group_details:group_id(name)
            `)
            .in('group_id', groupIds)
            .order('due_date', { ascending: true });
          
          if (tasksError) throw tasksError;
          setTasks(tasksData || []);
          
          // Also get tasks assigned to the user from other groups
          const { data: assignedTasksData, error: assignedTasksError } = await supabase
            .from('care8_group_tasks')
            .select(`
              *,
              user_details:assigned_to(display_name, avatar_url),
              group_details:group_id(name)
            `)
            .eq('assigned_to', session.user.id)
            .not('group_id', 'in', `(${groupIds.join(',')})`)
            .order('due_date', { ascending: true });
            
          if (assignedTasksError) throw assignedTasksError;
          
          // Combine both task sets
          setTasks([...(tasksData || []), ...(assignedTasksData || [])]);
        } else {
          // User is not in any groups, just get tasks assigned to them
          const { data: tasksData, error: tasksError } = await supabase
            .from('care8_group_tasks')
            .select(`
              *,
              user_details:assigned_to(display_name, avatar_url),
              group_details:group_id(name)
            `)
            .eq('assigned_to', session.user.id)
            .order('due_date', { ascending: true });
          
          if (tasksError) throw tasksError;
          setTasks(tasksData || []);
        }
      } catch (err: any) {
        console.error('Error fetching tasks:', err);
        setError(err.message);
        toast({
          title: 'Error loading tasks',
          description: err.message,
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [session, toast]);
  
  // Filter tasks when filters change
  useEffect(() => {
    if (!tasks) return;
    
    let filtered = [...tasks];
    
    // Apply text search
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(term) || 
        (task.description && task.description.toLowerCase().includes(term))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }
    
    // Apply group filter
    if (groupFilter !== 'all') {
      filtered = filtered.filter(task => task.group_id === groupFilter);
    }
    
    // Apply tab filter
    if (activeTab === 'assigned') {
      filtered = filtered.filter(task => task.assigned_to === session?.user?.id);
    } else if (activeTab === 'created') {
      filtered = filtered.filter(task => task.created_by === session?.user?.id);
    } else if (activeTab === 'due-today') {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(task => task.due_date && task.due_date.startsWith(today));
    } else if (activeTab === 'upcoming') {
      const today = new Date();
      const in7Days = new Date();
      in7Days.setDate(today.getDate() + 7);
      
      filtered = filtered.filter(task => {
        if (!task.due_date) return false;
        const dueDate = new Date(task.due_date);
        return dueDate > today && dueDate <= in7Days;
      });
    }
    
    setFilteredTasks(filtered);
  }, [tasks, searchTerm, statusFilter, groupFilter, activeTab, session]);
  
  // Handle form submission
  const handleCreateTask = async () => {
    if (!session?.user?.id || !newTask.title || !newTask.group_id) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      const { data, error } = await supabase
        .from('care8_group_tasks')
        .insert({
          title: newTask.title,
          description: newTask.description,
          due_date: newTask.due_date,
          priority: newTask.priority,
          group_id: newTask.group_id,
          assigned_to: newTask.assigned_to || session.user.id,
          created_by: session.user.id,
          status: 'pending'
        })
        .select(`
          *,
          user_details:assigned_to(display_name, avatar_url),
          group_details:group_id(name)
        `);
      
      if (error) throw error;
      
      // Add new task to state
      if (data && data.length > 0) {
        setTasks(prev => [...prev, data[0]]);
      }
      
      // Reset form
      setNewTask({
        title: '',
        description: '',
        due_date: new Date().toISOString().split('T')[0],
        priority: 'medium',
        group_id: '',
      });
      
      setIsTaskDialogOpen(false);
      
      toast({
        title: 'Task created',
        description: 'Your task has been created successfully',
        variant: 'default'
      });
    } catch (err: any) {
      console.error('Error creating task:', err);
      toast({
        title: 'Error creating task',
        description: err.message,
        variant: 'destructive'
      });
    }
  };
  
  // Update task status
  const handleUpdateTaskStatus = async (taskId: string, newStatus: 'pending' | 'in_progress' | 'completed' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from('care8_group_tasks')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', taskId);
      
      if (error) throw error;
      
      // Update task in state
      setTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? { ...task, status: newStatus, updated_at: new Date().toISOString() } 
            : task
        )
      );
      
      toast({
        title: 'Task updated',
        description: `Task status changed to ${newStatus.replace('_', ' ')}`,
        variant: 'default'
      });
    } catch (err: any) {
      console.error('Error updating task:', err);
      toast({
        title: 'Error updating task',
        description: err.message,
        variant: 'destructive'
      });
    }
  };
  
  // Delete task
  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('care8_group_tasks')
        .delete()
        .eq('id', taskId);
      
      if (error) throw error;
      
      // Remove task from state
      setTasks(prev => prev.filter(task => task.id !== taskId));
      
      toast({
        title: 'Task deleted',
        description: 'The task has been deleted successfully',
        variant: 'default'
      });
    } catch (err: any) {
      console.error('Error deleting task:', err);
      toast({
        title: 'Error deleting task',
        description: err.message,
        variant: 'destructive'
      });
    }
  };
  
  // Create sample tasks if none exist
  const createSampleTasks = async () => {
    if (!session?.user?.id || groups.length === 0) {
      toast({
        title: 'Cannot create sample tasks',
        description: 'You need to be a member of at least one group',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      // Sample tasks data
      const sampleTasks = [
        {
          title: 'Schedule doctor appointment',
          description: 'Schedule a checkup with Dr. Smith for next week',
          priority: 'high',
          due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          group_id: groups[0].id
        },
        {
          title: 'Pick up medications',
          description: 'Get prescription refill from the pharmacy',
          priority: 'medium',
          due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          group_id: groups[0].id
        },
        {
          title: 'Prepare meals for the week',
          description: 'Cook and store meals according to dietary plan',
          priority: 'medium',
          due_date: new Date().toISOString().split('T')[0],
          group_id: groups[0].id
        },
        {
          title: 'Organize transportation to therapy',
          description: 'Book ride service for Wednesday therapy session',
          priority: 'high',
          due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          group_id: groups[0].id
        },
        {
          title: 'Set up video call with family',
          description: 'Schedule and send invites for Sunday family video call',
          priority: 'low',
          due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          group_id: groups[0].id
        }
      ];
      
      const insertPromises = sampleTasks.map(task => 
        supabase
          .from('care8_group_tasks')
          .insert({
            ...task,
            assigned_to: session.user.id,
            created_by: session.user.id,
            status: 'pending'
          })
      );
      
      await Promise.all(insertPromises);
      
      // Reload tasks
      window.location.reload();
      
      toast({
        title: 'Sample tasks created',
        description: 'Sample tasks have been added to your task list',
        variant: 'default'
      });
    } catch (err: any) {
      console.error('Error creating sample tasks:', err);
      toast({
        title: 'Error creating sample tasks',
        description: err.message,
        variant: 'destructive'
      });
    }
  };
  
  // Utility function to format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date';
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  // Get priority badge variant
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      default:
        return 'secondary';
    }
  };
  
  // Get status badge variant
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in_progress':
        return 'secondary';
      case 'cancelled':
        return 'outline';
      default:
        return 'secondary';
    }
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Task Manager</h1>
        
        <Button onClick={() => setIsTaskDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar/Filters */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="group">Group</Label>
                <Select value={groupFilter} onValueChange={setGroupFilter}>
                  <SelectTrigger id="group">
                    <SelectValue placeholder="Filter by group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Groups</SelectItem>
                    {groups.map(group => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="text"
                  placeholder="Search tasks..."
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Quick stats */}
          <Card>
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Total Tasks:</span>
                <span className="font-semibold">{tasks.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Pending:</span>
                <span className="font-semibold">{tasks.filter(t => t.status === 'pending').length}</span>
              </div>
              <div className="flex justify-between">
                <span>In Progress:</span>
                <span className="font-semibold">{tasks.filter(t => t.status === 'in_progress').length}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed:</span>
                <span className="font-semibold">{tasks.filter(t => t.status === 'completed').length}</span>
              </div>
              
              {tasks.length === 0 && !isLoading && !error && (
                <Button 
                  variant="outline" 
                  className="w-full mt-4"
                  onClick={createSampleTasks}
                >
                  Create Sample Tasks
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Main content */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all">All Tasks</TabsTrigger>
              <TabsTrigger value="assigned">Assigned to Me</TabsTrigger>
              <TabsTrigger value="due-today">Due Today</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : error ? (
                <div className="text-center p-6 bg-red-50 rounded-lg">
                  <p className="text-red-600">{error}</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </Button>
                </div>
              ) : filteredTasks.length === 0 ? (
                <div className="text-center p-12 bg-gray-50 rounded-lg">
                  <CheckSquare className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-500 mb-2">No tasks match your filters</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('all');
                      setGroupFilter('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTasks.map(task => (
                    <Card key={task.id}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{task.title}</CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge variant={getStatusBadge(task.status)}>
                              {task.status.replace('_', ' ')}
                            </Badge>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleUpdateTaskStatus(task.id, 'pending')}>
                                  Mark as Pending
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateTaskStatus(task.id, 'in_progress')}>
                                  Mark as In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateTaskStatus(task.id, 'completed')}>
                                  <Check className="h-4 w-4 mr-2" />
                                  Mark as Completed
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDeleteTask(task.id)} className="text-red-600">
                                  <Trash className="h-4 w-4 mr-2" />
                                  Delete Task
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        <CardDescription>
                          {task.group_details?.name && (
                            <span className="text-sm text-gray-500">Group: {task.group_details.name}</span>
                          )}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {task.description && (
                          <p className="text-gray-700 mb-4">{task.description}</p>
                        )}
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Due: {formatDate(task.due_date)}</span>
                          </div>
                          
                          <div className="flex items-center">
                            <Badge variant={getPriorityBadge(task.priority)} className="h-5">
                              {task.priority}
                            </Badge>
                          </div>
                          
                          {task.assigned_to && (
                            <div className="flex items-center">
                              <Avatar className="h-5 w-5 mr-1">
                                <AvatarImage src={task.user_details?.avatar_url || ''} />
                                <AvatarFallback>{task.user_details?.display_name?.charAt(0) || 'U'}</AvatarFallback>
                              </Avatar>
                              <span>
                                {task.assigned_to === session?.user?.id
                                  ? 'Assigned to me'
                                  : `Assigned to: ${task.user_details?.display_name || 'User'}`}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* Task Creation Dialog */}
      <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>
              Add a new task to one of your care groups.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input 
                id="title" 
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                placeholder="Task title"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="Task description"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="group">Group *</Label>
              <Select 
                value={newTask.group_id} 
                onValueChange={(val) => setNewTask({...newTask, group_id: val})}
              >
                <SelectTrigger id="group">
                  <SelectValue placeholder="Select a group" />
                </SelectTrigger>
                <SelectContent>
                  {groups.map(group => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="due-date">Due Date</Label>
                <Input 
                  id="due-date" 
                  type="date"
                  value={newTask.due_date}
                  onChange={(e) => setNewTask({...newTask, due_date: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select 
                  value={newTask.priority} 
                  onValueChange={(val: any) => setNewTask({...newTask, priority: val})}
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsTaskDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTask}>
              Create Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}; 