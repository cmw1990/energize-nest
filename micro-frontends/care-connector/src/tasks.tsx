import React, { useEffect } from 'react';
import { TaskManager } from './components/TaskManager';
import { CareConnectorLayout } from './components/CareConnectorLayout';
import { useAuth } from '@/components/AuthProvider';

// This is a direct access component that forces the task manager to render
export default function DirectTasksPage() {
  const { session } = useAuth();
  
  useEffect(() => {
    console.log("Direct tasks access - bypassing all redirects");
    // Set the document title
    document.title = "Care Connector Tasks";
  }, []);
  
  return (
    <div className="min-h-screen bg-background">
      <CareConnectorLayout session={session}>
        <TaskManager session={session} />
      </CareConnectorLayout>
    </div>
  );
} 