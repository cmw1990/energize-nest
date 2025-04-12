
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { JournalEntry } from "@/types/database";
import { adaptArrayModel } from "@/utils/typeSafeUtils";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookHeart, Plus, Save, Edit, Trash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const MotivationJournal = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const { data: entries, refetch } = useQuery({
    queryKey: ["journal_entries", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from("journal_entries")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });
        
      if (error) throw error;
      
      return adaptArrayModel<JournalEntry>(data || [], (item) => ({
        id: item.id,
        title: item.title || "Untitled",
        content: item.content,
        mood_rating: item.mood_rating,
        energy_level: item.energy_level || 5,
        tags: item.tags || [],
        user_id: item.user_id,
        created_at: item.created_at,
        updated_at: item.updated_at,
      }));
    },
    enabled: !!session?.user?.id,
  });
  
  const createEntryMutation = useMutation({
    mutationFn: async (newEntry: { 
      title: string; 
      content: string; 
      mood_rating: number;
      energy_level: number;
      tags: string[]; 
    }) => {
      if (!session?.user?.id) {
        throw new Error("User not authenticated");
      }
      
      const { data, error } = await supabase
        .from("journal_entries")
        .insert({
          user_id: session.user.id,
          title: newEntry.title,
          content: newEntry.content,
          mood_rating: newEntry.mood_rating,
          energy_level: newEntry.energy_level,
          tags: newEntry.tags,
        })
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setTitle("");
      setContent("");
      setIsCreating(false);
      refetch();
      toast({
        title: "Entry Created",
        description: "Your journal entry has been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create journal entry: " + error.message,
        variant: "destructive",
      });
    }
  });

  const updateEntryMutation = useMutation({
    mutationFn: async (updatedEntry: JournalEntry) => {
      const { data, error } = await supabase
        .from("journal_entries")
        .update({
          title: updatedEntry.title,
          content: updatedEntry.content,
          mood_rating: updatedEntry.mood_rating,
          energy_level: updatedEntry.energy_level,
          tags: updatedEntry.tags,
          updated_at: new Date().toISOString(),
        })
        .eq("id", updatedEntry.id)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      setIsEditing(false);
      refetch();
      toast({
        title: "Entry Updated",
        description: "Your journal entry has been updated successfully.",
      });
    }
  });

  const deleteEntryMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("journal_entries")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      return id;
    },
    onSuccess: () => {
      setSelectedEntry(null);
      refetch();
      toast({
        title: "Entry Deleted",
        description: "Your journal entry has been deleted.",
      });
    }
  });

  const handleCreateEntry = () => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and content for your journal entry.",
        variant: "destructive",
      });
      return;
    }

    createEntryMutation.mutate({
      title,
      content,
      mood_rating: 5,
      energy_level: 5,
      tags: ["motivation"],
    });
  };

  const handleUpdateEntry = () => {
    if (!selectedEntry) return;
    
    updateEntryMutation.mutate(selectedEntry);
  };

  const handleDeleteEntry = () => {
    if (!selectedEntry) return;
    
    deleteEntryMutation.mutate(selectedEntry.id);
  };

  const switchTab = (value: string) => {
    const tabTrigger = document.querySelector(`[data-value="${value}"]`) as HTMLElement;
    if (tabTrigger) {
      tabTrigger.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          <BookHeart className="h-5 w-5 text-primary" />
          Motivation Journal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="entries" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="entries">My Entries</TabsTrigger>
              <TabsTrigger value="create">New Entry</TabsTrigger>
            </TabsList>
            
            {!isCreating && selectedEntry && !isEditing && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteEntry}
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>
          
          <TabsContent value="entries" className="space-y-4">
            {entries && entries.length > 0 ? (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="border rounded-md p-2 h-[300px] overflow-y-auto">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className={`p-3 cursor-pointer rounded-md mb-2 hover:bg-accent ${
                        selectedEntry?.id === entry.id ? "bg-accent" : "border"
                      }`}
                      onClick={() => {
                        setSelectedEntry(entry);
                        setIsEditing(false);
                      }}
                    >
                      <h3 className="font-medium">{entry.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {entry.content}
                      </p>
                      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                        <div className="flex gap-2">
                          <span>Mood: {entry.mood_rating}/10</span>
                          <span>Energy: {entry.energy_level}/10</span>
                        </div>
                        <span>{new Date(entry.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border rounded-md p-4 h-[300px] overflow-y-auto">
                  {selectedEntry ? (
                    isEditing ? (
                      <div className="space-y-4">
                        <Input
                          value={selectedEntry.title}
                          onChange={(e) =>
                            setSelectedEntry({
                              ...selectedEntry,
                              title: e.target.value,
                            })
                          }
                          placeholder="Title"
                        />
                        <Textarea
                          value={selectedEntry.content}
                          onChange={(e) =>
                            setSelectedEntry({
                              ...selectedEntry,
                              content: e.target.value,
                            })
                          }
                          placeholder="Content"
                          className="min-h-[150px]"
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleUpdateEntry}>
                            <Save className="h-4 w-4 mr-1" />
                            Save
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <h2 className="text-xl font-semibold mb-2">{selectedEntry.title}</h2>
                        <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                          <div>Date: {new Date(selectedEntry.created_at).toLocaleDateString()}</div>
                          <div>Mood: {selectedEntry.mood_rating}/10</div>
                          <div>Energy: {selectedEntry.energy_level}/10</div>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <p className="whitespace-pre-wrap">{selectedEntry.content}</p>
                        </div>
                      </div>
                    )
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-muted-foreground">
                      <p className="mb-2">Select an entry to view its details</p>
                      <p className="text-sm">or</p>
                      <Button
                        variant="outline"
                        className="mt-2"
                        onClick={() => switchTab("create")}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Create New Entry
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 border rounded-md">
                <p className="text-muted-foreground mb-4">No journal entries yet</p>
                <Button
                  onClick={() => switchTab("create")}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create Your First Entry
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="create" className="space-y-4">
            <div className="space-y-4">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Entry Title"
                className="text-lg"
              />
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write about your motivational insights, achievements, goals, or reflections..."
                className="min-h-[200px]"
              />
              <div className="flex justify-end">
                <Button
                  onClick={handleCreateEntry}
                  disabled={createEntryMutation.isPending}
                >
                  {createEntryMutation.isPending ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-1" />
                      Save Entry
                    </>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
