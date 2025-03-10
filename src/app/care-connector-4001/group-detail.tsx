import React, { useEffect } from 'react';
import { GroupDetail } from './components/GroupDetail';
import { CareConnectorLayout } from './components/CareConnectorLayout';
import { useAuth } from '@/components/AuthProvider';
import { useParams } from 'react-router-dom';

// This is a direct access component that forces the group detail page to render
export default function DirectGroupDetailPage() {
  const { session } = useAuth();
  const { groupId } = useParams();
  
  useEffect(() => {
    console.log(`Direct group detail access for group ${groupId} - bypassing all redirects`);
    // Set the document title
    document.title = "Care Connector Group Details";
  }, [groupId]);
  
  return (
    <div className="min-h-screen bg-background">
      <CareConnectorLayout session={session}>
        <GroupDetail session={session} />
      </CareConnectorLayout>
    </div>
  );
} 