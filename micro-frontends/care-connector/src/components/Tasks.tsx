import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  ClipboardList,
  CalendarDays,
  Plus,
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  User,
  UserCircle2,
  Calendar,
  ChevronDown,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TasksProps {
  session: Session | null;
  supabaseClient?: SupabaseClient;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  assigned_to: string | null;
  assigned_by: string;
  group_id: string | null;
  group_name?: string;
  assignee_name?: string;
  created_at: string;
}

const Tasks: React.FC<TasksProps> = ({ session, supabaseClient }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeView, setActiveView] = useState<'list' | 'calendar'>('list');
  
  // Load mock data
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      
      try {
        // Mock data for development
        const mockTasks: Task[] = [
          {
            id: '1',
            title: 'Schedule Doctor Appointment',
            description: 'Call Dr. Smith to schedule a follow-up appointment',
            due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'pending',
            priority: 'high',
            assigned_to: session?.user?.id || null,
            assigned_by: 'user123',
            group_id: 'group1',
            group_name: 'Family Care Group',
            assignee_name: 'You',
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '2',
            title: 'Pick Up Medication',
            description: 'Pick up prescription from Main Street Pharmacy',
            due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'in_progress',
            priority: 'medium',
            assigned_to: session?.user?.id || null,
            assigned_by: 'user456',
            group_id: 'group1',
            group_name: 'Family Care Group',
            assignee_name: 'You',
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '3',
            title: 'Daily Health Check',
            description: 'Monitor blood pressure, temperature, and record in the health log',
            due_date: new Date().toISOString(),
            status: 'completed',
            priority: 'medium',
            assigned_to: session?.user?.id || null,
            assigned_by: 'user789',
            group_id: 'group2',
            group_name: 'Healthcare Providers',
            assignee_name: 'You',
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '4',
            title: 'Weekly Meal Planning',
            description: 'Prepare meal plan for the upcoming week',
            due_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'pending',
            priority: 'low',
            assigned_to: 'user456',
            assigned_by: session?.user?.id || 'unknown',
            group_id: 'group1',
            group_name: 'Family Care Group',
            assignee_name: 'John Smith',
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '5',
            title: 'Exercise Session',
            description: 'Complete 30 minutes of prescribed exercises',
            due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'pending',
            priority: 'medium',
            assigned_to: session?.user?.id || null,
            assigned_by: 'user123',
            group_id: 'group2',
            group_name: 'Healthcare Providers',
            assignee_name: 'You',
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        
        setTasks(mockTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, [session]);

  // Filter tasks based on search query, status, and priority
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || task.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Sort tasks by due date and priority
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const dateA = new Date(a.due_date).getTime();
    const dateB = new Date(b.due_date).getTime();
    
    // First by due date
    if (dateA !== dateB) {
      return dateA - dateB;
    }
    
    // Then by priority
    const priorityValues = { high: 0, medium: 1, low: 2 };
    return priorityValues[a.priority] - priorityValues[b.priority];
  });

  // Group tasks by date
  const groupTasksByDate = () => {
    const grouped = sortedTasks.reduce<Record<string, Task[]>>((acc, task) => {
      const dueDate = new Date(task.due_date).toLocaleDateString();
      
      if (!acc[dueDate]) {
        acc[dueDate] = [];
      }
      
      acc[dueDate].push(task);
      return acc;
    }, {});
    
    return grouped;
  };

  // Handle task status change
  const handleStatusChange = (taskId: string, newStatus: 'pending' | 'in_progress' | 'completed' | 'cancelled') => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  // Get status badge class
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get priority badge class
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-orange-100 text-orange-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) + 
        ` at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  };

  // Is task overdue
  const isOverdue = (dateString: string) => {
    const dueDate = new Date(dateString);
    const now = new Date();
    return dueDate < now && !dateString.includes('completed');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
        <div className="flex space-x-3">
          <div className="flex rounded-md overflow-hidden">
            <button
              onClick={() => setActiveView('list')}
              className={`px-4 py-2 text-sm font-medium ${
                activeView === 'list'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <ClipboardList className="h-4 w-4 inline mr-1" />
              List
            </button>
            <button
              onClick={() => setActiveView('calendar')}
              className={`px-4 py-2 text-sm font-medium ${
                activeView === 'calendar'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <CalendarDays className="h-4 w-4 inline mr-1" />
              Calendar
            </button>
          </div>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </Button>
        </div>
      </div>
      
      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search tasks..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex">
          <div className="flex items-center mr-3">
            <Filter className="text-gray-400 mr-2" size={18} />
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="flex items-center">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* List View */}
      {activeView === 'list' && (
        <div className="space-y-6">
          {sortedTasks.length > 0 ? (
            Object.entries(groupTasksByDate()).map(([date, dateTasks]) => (
              <div key={date} className="space-y-3">
                <h2 className="text-lg font-semibold text-gray-700 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                  {date === new Date().toLocaleDateString() ? 'Today' : date}
                  <span className="text-sm font-normal text-gray-500 ml-2">
                    ({dateTasks.length} {dateTasks.length === 1 ? 'task' : 'tasks'})
                  </span>
                </h2>
                <div className="space-y-3">
                  {dateTasks.map(task => (
                    <Card key={task.id} className={`hover:shadow-md transition-shadow ${
                      isOverdue(task.due_date) && task.status !== 'completed' ? 'border-red-300' : ''
                    }`}>
                      <CardHeader className="pb-2 flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-xl flex items-center">
                            {task.title}
                            {isOverdue(task.due_date) && task.status !== 'completed' && (
                              <span className="ml-2 text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
                                Overdue
                              </span>
                            )}
                          </CardTitle>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeClass(task.status)}`}>
                              {task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.slice(1).replace('_', ' ')}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${getPriorityBadgeClass(task.priority)}`}>
                              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                            </span>
                            {task.group_id && (
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800">
                                {task.group_name}
                              </span>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {task.description && (
                          <p className="text-gray-600 text-sm mb-3">{task.description}</p>
                        )}
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>{formatDate(task.due_date)}</span>
                          </div>
                          <div className="flex items-center">
                            <UserCircle2 className="h-4 w-4 mr-1" />
                            <span>
                              {task.assigned_to === session?.user?.id ? 'Assigned to you' : `Assigned to ${task.assignee_name}`}
                            </span>
                          </div>
                        </div>
                        
                        {/* Task Actions */}
                        <div className="mt-4 flex justify-end space-x-2">
                          {task.status !== 'completed' && (
                            <Button
                              variant="outline"
                              className="text-green-600 border-green-600 hover:bg-green-50"
                              onClick={() => handleStatusChange(task.id, 'completed')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Complete
                            </Button>
                          )}
                          {task.status === 'pending' && (
                            <Button
                              variant="outline"
                              onClick={() => handleStatusChange(task.id, 'in_progress')}
                            >
                              Start
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <ClipboardList className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900">No Tasks Found</h3>
              <p className="text-gray-500 mt-1">
                {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'Try adjusting your filters to find more tasks.'
                  : 'You have no tasks assigned to you. Create a new task to get started.'}
              </p>
              <Button 
                className="mt-4" 
                onClick={() => setShowCreateModal(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </Button>
            </div>
          )}
        </div>
      )}
      
      {/* Calendar View */}
      {activeView === 'calendar' && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="text-center mb-4">
            <h2 className="text-lg font-semibold">Calendar view is under development</h2>
            <p className="text-gray-500">Please use the list view for now</p>
          </div>
          <Button
            variant="outline"
            className="mx-auto block"
            onClick={() => setActiveView('list')}
          >
            Switch to List View
          </Button>
        </div>
      )}
      
      {/* Create Task Modal would go here */}
    </div>
  );
};

export default Tasks; 
