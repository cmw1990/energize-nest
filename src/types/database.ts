
// Define types for the task table missing in the default Supabase types
export interface TasksTable {
  Row: {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    due_date?: string;
    priority: string; // 'urgent', 'important', 'regular', 'low'
    status: string; // 'todo', 'in-progress', 'done'
    created_at: string;
    updated_at?: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    title: string;
    description?: string;
    due_date?: string;
    priority?: string;
    status?: string;
    created_at?: string;
    updated_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    title?: string;
    description?: string;
    due_date?: string;
    priority?: string;
    status?: string;
    created_at?: string;
    updated_at?: string;
  };
}

// Export a type that can be used to extend the Database interface
export interface CustomTables {
  tasks: TasksTable;
}

// Add a Task type for easier consumption
export type Task = {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  due_date?: string;
  priority: string; // 'urgent', 'important', 'regular', 'low'
  status: string; // 'todo', 'in-progress', 'done'
  created_at: string;
  updated_at?: string;
};
