import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { SupabaseClient } from '@supabase/supabase-js';
import {
  ClipboardList,
  Calendar,
  CheckCircle,
  CheckSquare,
  CircleDashed,
  Clock,
  AlertCircle,
  Plus,
  Trophy,
  Filter,
  MoreVertical,
  Search,
  ChevronRight,
  ChevronDown,
  X,
  Trash2,
  Check
} from 'lucide-react';

interface TaskManagerProps {
  session: Session | null;
  supabaseClient?: SupabaseClient;
}

interface QuitTask {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  completed_date: string | null;
  status: 'pending' | 'completed' | 'skipped';
  priority: 'low' | 'medium' | 'high';
  category: 'preparation' | 'quit_day' | 'early_days' | 'maintenance' | 'custom';
  streak_related: boolean;
  points: number;
  created_at: string;
}

const TaskManager: React.FC<TaskManagerProps> = ({ session, supabaseClient }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<QuitTask[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<QuitTask[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [completedTasksCollapsed, setCompletedTasksCollapsed] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'custom',
    priority: 'medium'
  });
  const [totalPoints, setTotalPoints] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load tasks
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      
      try {
        // Mock data for development
        const mockTasks: QuitTask[] = [
          {
            id: '1',
            title: 'Set your quit date',
            description: 'Choose a date within the next two weeks to quit smoking completely.',
            due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            completed_date: null,
            status: 'pending',
            priority: 'high',
            category: 'preparation',
            streak_related: true,
            points: 50,
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '2',
            title: 'Identify your triggers',
            description: 'Make a list of situations, feelings, and activities that trigger your smoking urges.',
            due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            completed_date: null,
            status: 'pending',
            priority: 'medium',
            category: 'preparation',
            streak_related: false,
            points: 30,
            created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '3',
            title: 'Stock up on nicotine replacement products',
            description: 'Purchase gum, patches, or lozenges to help manage cravings.',
            due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
            completed_date: null,
            status: 'pending',
            priority: 'medium',
            category: 'preparation',
            streak_related: false,
            points: 20,
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '4',
            title: 'Dispose of all smoking products',
            description: 'Get rid of cigarettes, lighters, ashtrays, and anything else related to smoking.',
            due_date: new Date(Date.now()).toISOString(), // Today
            completed_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
            status: 'completed',
            priority: 'high',
            category: 'quit_day',
            streak_related: true,
            points: 100,
            created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '5',
            title: 'Inform friends and family about your quit plan',
            description: 'Let your support network know about your decision to quit smoking.',
            due_date: null,
            completed_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'completed',
            priority: 'low',
            category: 'preparation',
            streak_related: false,
            points: 20,
            created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '6',
            title: 'Practice deep breathing exercise',
            description: 'Do a 5-minute deep breathing exercise to manage cravings.',
            due_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday
            completed_date: null,
            status: 'skipped',
            priority: 'medium',
            category: 'early_days',
            streak_related: false,
            points: 15,
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '7',
            title: 'Drink plenty of water today',
            description: 'Aim for at least 8 glasses of water to help flush toxins.',
            due_date: new Date().toISOString(), // Today
            completed_date: null,
            status: 'pending',
            priority: 'medium',
            category: 'early_days',
            streak_related: false,
            points: 10,
            created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '8',
            title: 'Track cravings in journal',
            description: 'Record when cravings occur and what might have triggered them.',
            due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
            completed_date: null,
            status: 'pending',
            priority: 'low',
            category: 'maintenance',
            streak_related: true,
            points: 25,
            created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        
        setTasks(mockTasks);
        
        // Calculate total points from completed tasks
        const points = mockTasks
          .filter(task => task.status === 'completed')
          .reduce((total, task) => total + task.points, 0);
        
        setTotalPoints(points);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setErrorMessage('There was an error loading your tasks. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, [session, supabaseClient]);

  // Filter tasks whenever filters or tasks change
  useEffect(() => {
    filterTasks();
  }, [tasks, statusFilter, categoryFilter, searchQuery]);

  // Filter tasks based on current filters
  const filterTasks = () => {
    let filtered = [...tasks];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(task => task.category === categoryFilter);
    }
    
    setFilteredTasks(filtered);
  };

  // Mark task as completed
  const markTaskCompleted = (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: 'completed', 
              completed_date: new Date().toISOString() 
            } 
          : task
      )
    );
    
    // Find the task to get its points
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setTotalPoints(prev => prev + task.points);
    }
  };

  // Skip task
  const skipTask = (taskId: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: 'skipped'
            } 
          : task
      )
    );
  };

  // Undo task completion
  const undoTaskCompletion = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    setTasks(prevTasks => 
      prevTasks.map(t => 
        t.id === taskId 
          ? { 
              ...t, 
              status: 'pending', 
              completed_date: null 
            } 
          : t
      )
    );
    
    // Subtract points
    setTotalPoints(prev => prev - task.points);
  };

  // Delete task
  const deleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  // Add new task
  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      setErrorMessage('Task title is required');
      return;
    }
    
    const newTaskObj: QuitTask = {
      id: `new-${Date.now()}`, // In production this would be a proper UUID
      title: newTask.title,
      description: newTask.description || null,
      due_date: null,
      completed_date: null,
      status: 'pending',
      priority: newTask.priority as 'low' | 'medium' | 'high',
      category: newTask.category as 'preparation' | 'quit_day' | 'early_days' | 'maintenance' | 'custom',
      streak_related: false,
      points: 10, // Default points for custom tasks
      created_at: new Date().toISOString()
    };
    
    setTasks(prev => [...prev, newTaskObj]);
    setNewTask({
      title: '',
      description: '',
      category: 'custom',
      priority: 'medium'
    });
    setShowAddTask(false);
    setErrorMessage(null);
  };

  // Get priority badge class
  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get category label
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'preparation':
        return 'Preparation';
      case 'quit_day':
        return 'Quit Day';
      case 'early_days':
        return 'Early Days';
      case 'maintenance':
        return 'Maintenance';
      case 'custom':
        return 'Custom';
      default:
        return category;
    }
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  // Check if task is overdue
  const isTaskOverdue = (task: QuitTask) => {
    if (task.status === 'completed' || task.status === 'skipped' || !task.due_date) {
      return false;
    }
    
    const dueDate = new Date(task.due_date);
    const now = new Date();
    return dueDate < now;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  // Group tasks by status
  const pendingTasks = filteredTasks.filter(task => task.status === 'pending');
  const completedTasks = filteredTasks.filter(task => task.status === 'completed');
  const skippedTasks = filteredTasks.filter(task => task.status === 'skipped');

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quit Journey Tasks</h1>
        <button
          onClick={() => setShowAddTask(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Custom Task
        </button>
      </div>
      
      {/* Points summary */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-4 mb-6 text-white">
        <div className="flex items-center">
          <Trophy className="h-8 w-8 mr-3" />
          <div>
            <h2 className="text-sm font-medium">Total Points Earned</h2>
            <p className="text-2xl font-bold">{totalPoints}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-sm">
              {completedTasks.length} completed / {tasks.length} total tasks
            </p>
            <div className="w-32 bg-white bg-opacity-30 rounded-full h-2 mt-1">
              <div 
                className="bg-white rounded-full h-2" 
                style={{ width: `${(completedTasks.length / tasks.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {errorMessage && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <div className="flex">
            <AlertCircle className="h-5 w-5 mr-2" />
            <p>{errorMessage}</p>
          </div>
        </div>
      )}
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search tasks..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <div className="flex items-center">
            <Filter className="text-gray-400 mr-2" size={18} />
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="skipped">Skipped</option>
            </select>
          </div>
          <div className="flex items-center">
            <select
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="preparation">Preparation</option>
              <option value="quit_day">Quit Day</option>
              <option value="early_days">Early Days</option>
              <option value="maintenance">Maintenance</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Tasks Lists */}
      <div className="space-y-6">
        {/* Pending Tasks */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CircleDashed className="h-5 w-5 mr-2 text-yellow-500" />
            Pending Tasks
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({pendingTasks.length})
            </span>
          </h2>
          
          {pendingTasks.length > 0 ? (
            <div className="space-y-3">
              {pendingTasks.map(task => (
                <div 
                  key={task.id} 
                  className={`bg-white p-4 rounded-lg border ${
                    isTaskOverdue(task) ? 'border-red-300' : 'border-gray-200'
                  } shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className="flex items-start">
                    <button
                      onClick={() => markTaskCompleted(task.id)}
                      className="mt-1 h-5 w-5 rounded-full border-2 border-green-500 hover:bg-green-100 flex-shrink-0"
                      aria-label="Mark as completed"
                    ></button>
                    
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900">{task.title}</h3>
                        <div className="flex space-x-2">
                          {task.streak_related && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Streak
                            </span>
                          )}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(task.priority)}`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                          <div className="relative">
                            <button className="p-1 hover:bg-gray-100 rounded-full">
                              <MoreVertical className="h-4 w-4 text-gray-500" />
                            </button>
                            {/* Dropdown menu would go here */}
                          </div>
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                      )}
                      
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>
                            {task.category && (
                              <span className="mr-2">{getCategoryLabel(task.category)}</span>
                            )}
                            {task.due_date && (
                              <>
                                <span className="mx-1">•</span>
                                <span className={isTaskOverdue(task) ? 'text-red-500 font-medium' : ''}>
                                  Due: {formatDate(task.due_date)}
                                  {isTaskOverdue(task) && ' (Overdue)'}
                                </span>
                              </>
                            )}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-xs">
                          <span className="text-green-600 font-medium">+{task.points} points</span>
                          <button
                            onClick={() => skipTask(task.id)}
                            className="ml-3 text-gray-500 hover:text-gray-700"
                          >
                            Skip
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <CheckSquare className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">No pending tasks available.</p>
              {(statusFilter !== 'all' || categoryFilter !== 'all' || searchQuery) && (
                <p className="text-gray-500 mt-1">Try adjusting your filters.</p>
              )}
            </div>
          )}
        </div>
        
        {/* Completed Tasks */}
        <div>
          <button
            onClick={() => setCompletedTasksCollapsed(!completedTasksCollapsed)}
            className="flex items-center w-full text-left text-xl font-semibold mb-4"
          >
            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
            Completed Tasks
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({completedTasks.length})
            </span>
            <ChevronDown className={`ml-2 h-5 w-5 text-gray-400 transform transition-transform ${completedTasksCollapsed ? '' : 'rotate-180'}`} />
          </button>
          
          {!completedTasksCollapsed && completedTasks.length > 0 && (
            <div className="space-y-3">
              {completedTasks.map(task => (
                <div 
                  key={task.id} 
                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="flex items-start">
                    <div className="mt-1 h-5 w-5 rounded-full bg-green-500 text-white flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3" />
                    </div>
                    
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 line-through opacity-70">{task.title}</h3>
                        <div className="flex space-x-2">
                          {task.streak_related && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 opacity-70">
                              Streak
                            </span>
                          )}
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityBadgeClass(task.priority)} opacity-70`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                          <div className="relative">
                            <button className="p-1 hover:bg-gray-100 rounded-full">
                              <MoreVertical className="h-4 w-4 text-gray-500" />
                            </button>
                            {/* Dropdown menu would go here */}
                          </div>
                        </div>
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-gray-600 mt-1 opacity-70">{task.description}</p>
                      )}
                      
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center text-xs text-gray-500">
                          <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                          <span>
                            Completed {task.completed_date ? new Date(task.completed_date).toLocaleDateString() : 'recently'}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-xs">
                          <span className="text-green-600 font-medium">+{task.points} points</span>
                          <button
                            onClick={() => undoTaskCompletion(task.id)}
                            className="ml-3 text-gray-500 hover:text-gray-700"
                          >
                            Undo
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Skipped Tasks */}
        {skippedTasks.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <X className="h-5 w-5 mr-2 text-gray-500" />
              Skipped Tasks
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({skippedTasks.length})
              </span>
            </h2>
            
            <div className="space-y-3">
              {skippedTasks.map(task => (
                <div 
                  key={task.id} 
                  className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
                >
                  <div className="flex items-start">
                    <div className="mt-1 h-5 w-5 rounded-full border-2 border-gray-300 flex items-center justify-center flex-shrink-0">
                      <X className="h-3 w-3 text-gray-400" />
                    </div>
                    
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-400">{task.title}</h3>
                        <div className="flex space-x-2">
                          <div className="relative">
                            <button className="p-1 hover:bg-gray-100 rounded-full">
                              <MoreVertical className="h-4 w-4 text-gray-500" />
                            </button>
                            {/* Dropdown menu would go here */}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center text-xs text-gray-500">
                          <span>Skipped</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => markTaskCompleted(task.id)}
                            className="text-xs text-green-600 hover:text-green-800"
                          >
                            Complete anyway
                          </button>
                          <button
                            onClick={() => deleteTask(task.id)}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Add Task Modal */}
      {showAddTask && (
        <div className="fixed inset-0 z-50 overflow-y-auto" onClick={() => setShowAddTask(false)}>
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            
            <div 
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Add Custom Task</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                          Task Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="title"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                          placeholder="Enter task title"
                          value={newTask.title}
                          onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                          Description
                        </label>
                        <textarea
                          id="description"
                          rows={3}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                          placeholder="Enter task description (optional)"
                          value={newTask.description}
                          onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Category
                          </label>
                          <select
                            id="category"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                            value={newTask.category}
                            onChange={(e) => setNewTask({...newTask, category: e.target.value})}
                          >
                            <option value="custom">Custom</option>
                            <option value="preparation">Preparation</option>
                            <option value="quit_day">Quit Day</option>
                            <option value="early_days">Early Days</option>
                            <option value="maintenance">Maintenance</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                            Priority
                          </label>
                          <select
                            id="priority"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                            value={newTask.priority}
                            onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                          >
                            <option value="low">Low</option>
                            <option value="medium">Medium</option>
                            <option value="high">High</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleAddTask}
                >
                  Add Task
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                  onClick={() => {
                    setShowAddTask(false);
                    setErrorMessage(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManager; 
