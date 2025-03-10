import { useState } from "react";
import { Session } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useToast } from "./ui/use-toast";
import { createGroup } from "../lib/careConnectorApiClient";

export const TestCreateGroup = ({ session }: { session: Session | null }) => {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      toast({
        title: "Error",
        description: "You must be logged in to create a group",
        variant: "destructive",
      });
      return;
    }
    
    if (!groupName.trim()) {
      toast({
        title: "Error",
        description: "Group name is required",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const groupData = {
        name: groupName.trim(),
        description: description.trim(),
        is_private: isPrivate,
        created_by: session.user.id
      };
      
      const createdGroup = await createGroup(groupData, session);
      
      toast({
        title: "Success",
        description: `Group "${createdGroup.name}" created successfully`,
      });
      
      // Reset form
      setGroupName("");
      setDescription("");
      setIsPrivate(true);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create group",
        variant: "destructive",
      });
      console.error("Error creating group:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create a Care Group</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Group Name</Label>
                <Input
                  id="name"
                  placeholder="Enter group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Enter group description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="private"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <Label htmlFor="private">Private Group</Label>
              </div>
            </div>
            <div className="mt-4">
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Creating..." : "Create Group"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}; 