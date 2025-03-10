import { Session } from '@supabase/supabase-js';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import * as apiClient from '../../../api/apiClient';

interface TestCreateGroupProps {
  session: Session | null;
}

export const TestCreateGroup: React.FC<TestCreateGroupProps> = ({ session }) => {
  const [name, setName] = useState('Test Group');
  const [description, setDescription] = useState('This is a test group created via API client');
  const [isPublic, setIsPublic] = useState(true);
  const [isLoadingRest, setIsLoadingRest] = useState(false);
  const { toast } = useToast();

  // Create group using the standardized apiClient
  const createGroupRest = async () => {
    if (!session) {
      toast({ title: "Please sign in", variant: "destructive" });
      return;
    }
    
    if (!name.trim()) {
      toast({ title: "Please enter a name", variant: "destructive" });
      return;
    }
    
    setIsLoadingRest(true);
    
    try {
      console.log("Creating group using standardized apiClient");
      
      // Create group using the standardized API client instead of direct REST calls
      const { data, error } = await apiClient.groups.createGroup(
        name,
        description,
        isPublic
      );
      
      if (error) {
        console.error("Error creating group:", error);
        toast({
          title: "Error (API Client)",
          description: error.message || "Failed to create group",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Success (API Client)",
        description: "Group created successfully using API client"
      });
      
      console.log("Group created successfully:", data);
    } catch (error) {
      console.error("Error in createGroupRest:", error);
      toast({
        title: "Error (API Client)",
        description: `Error creating group: ${error instanceof Error ? error.message : String(error)}`,
        variant: "destructive"
      });
    } finally {
      setIsLoadingRest(false);
    }
  };

  return (
    <div className="p-4 border rounded-md">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Group Name</label>
        <Input 
          type="text"
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="Enter group name"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <Textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Enter description"
          rows={3}
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1 flex items-center">
          <Checkbox 
            checked={isPublic} 
            onCheckedChange={setIsPublic}
            className="mr-2"
          />
          Make this group public
        </label>
      </div>
      
      <div className="flex flex-col space-y-2">
        <Button 
          onClick={createGroupRest}
          disabled={isLoadingRest}
          variant="default"
        >
          {isLoadingRest ? "Creating..." : "Create Group via API Client"}
        </Button>
      </div>
    </div>
  );
}; 