import React, { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';

// Constants for Supabase
const SUPABASE_URL = 'https://zoubqdwxemivxrjruvam.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvdWJxZHd4ZW1pdnhyanJ1dmFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg0MjAxOTcsImV4cCI6MjA1Mzk5NjE5N30.tq2ssOiA8CbFUZc6HXWXMEev1dODzKZxzNrpvyzbbXs';

interface SimpleCreateGroupProps {
  session: Session | null;
  onSuccess?: () => void;
}

export const SimpleCreateGroup: React.FC<SimpleCreateGroupProps> = ({ 
  session, 
  onSuccess 
}) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a group",
        variant: "destructive"
      });
      return;
    }
    
    if (!name.trim()) {
      toast({
        title: "Group name required",
        description: "Please enter a name for your group",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Step 1: Create the group
      const createResponse = await fetch(`${SUPABASE_URL}/rest/v1/care_groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${session.access_token}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          is_public: isPublic,
          created_by: session.user.id
        })
      });
      
      if (!createResponse.ok) {
        const errorData = await createResponse.json();
        console.error("Error creating group:", errorData);
        throw new Error("Failed to create group");
      }
      
      const createdGroup = await createResponse.json();
      console.log("Group created successfully:", createdGroup);
      
      if (!createdGroup || !createdGroup.length || !createdGroup[0].id) {
        throw new Error("Invalid response from server");
      }
      
      const groupId = createdGroup[0].id;
      
      // Step 2: Add the creator as a member
      const memberResponse = await fetch(`${SUPABASE_URL}/rest/v1/care_group_members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          group_id: groupId,
          user_id: session.user.id,
          role: 'owner'
        })
      });
      
      if (!memberResponse.ok) {
        console.warn("Error adding creator as member:", await memberResponse.json());
        // Continue anyway, the group was created
      }
      
      // Clear form
      setName('');
      setDescription('');
      setIsPublic(false);
      
      // Show success message
      toast({
        title: "Group created!",
        description: "Your new care group has been created successfully.",
        variant: "default"
      });
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error("Error creating group:", error);
      
      toast({
        title: "Error creating group",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Create a Care Group</CardTitle>
        <CardDescription>
          Create a group to coordinate care with family, friends, and caregivers.
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Group Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter group name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the purpose of this group..."
              rows={3}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="public"
              checked={isPublic}
              onCheckedChange={setIsPublic}
            />
            <Label htmlFor="public">Make this group public</Label>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end space-x-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </>
            ) : (
              "Create Group"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default SimpleCreateGroup; 