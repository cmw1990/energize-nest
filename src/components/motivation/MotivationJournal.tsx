
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Book, Plus, Save, Trash, Edit, X, Check, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

type JournalEntry = {
  id?: string;
  user_id?: string;
  title: string;
  content: string;
  created_at?: string;
  is_gratitude?: boolean;
};

export function MotivationJournal() {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [entryTitle, setEntryTitle] = useState("");
  const [entryContent, setEntryContent] = useState("");
  const [isGratitude, setIsGratitude] = useState(false);
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined);

  const { data: journalEntries, isLoading } = useQuery({
    queryKey: ['journal-entries', session?.user?.id, dateFilter?.toISOString()],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      let query = supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
      
      // If date filter is applied
      if (dateFilter) {
        const dateString = format(dateFilter, 'yyyy-MM-dd');
        query = query
          .gte('created_at', `${dateString}T00:00:00`)
          .lt('created_at', `${dateString}T23:59:59`);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data as JournalEntry[];
    },
    enabled: !!session?.user?.id,
  });

  const addEntryMutation = useMutation({
    mutationFn: async (entry: JournalEntry) => {
      if (!session?.user?.id) throw new Error("Not authenticated");
      
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: session.user.id,
          title: entry.title,
          content: entry.content,
          is_gratitude: entry.is_gratitude || false
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
      resetForm();
      toast({
        title: "Entry saved",
        description: "Your journal entry has been saved successfully.",
      });
    },
    onError: (error) => {
      console.error("Error saving journal entry:", error);
      toast({
        title: "Error",
        description: "Failed to save your journal entry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateEntryMutation = useMutation({
    mutationFn: async (entry: JournalEntry) => {
      if (!entry.id) throw new Error("Entry ID is required");
      
      const { data, error } = await supabase
        .from('journal_entries')
        .update({
          title: entry.title,
          content: entry.content,
          is_gratitude: entry.is_gratitude
        })
        .eq('id', entry.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
      resetForm();
      toast({
        title: "Entry updated",
        description: "Your journal entry has been updated successfully.",
      });
    },
    onError: (error) => {
      console.error("Error updating journal entry:", error);
      toast({
        title: "Error",
        description: "Failed to update your journal entry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteEntryMutation = useMutation({
    mutationFn: async (entryId: string) => {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', entryId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal-entries'] });
      resetForm();
      toast({
        title: "Entry deleted",
        description: "Your journal entry has been deleted successfully.",
      });
    },
    onError: (error) => {
      console.error("Error deleting journal entry:", error);
      toast({
        title: "Error",
        description: "Failed to delete your journal entry. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!entryTitle.trim() || !entryContent.trim()) {
      toast({
        title: "Required fields",
        description: "Please provide both a title and content for your entry.",
        variant: "destructive",
      });
      return;
    }

    const entry: JournalEntry = {
      title: entryTitle,
      content: entryContent,
      is_gratitude: isGratitude
    };

    if (isEditing && selectedEntry?.id) {
      updateEntryMutation.mutate({ ...entry, id: selectedEntry.id });
    } else {
      addEntryMutation.mutate(entry);
    }
  };

  const handleEdit = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setEntryTitle(entry.title);
    setEntryContent(entry.content);
    setIsGratitude(entry.is_gratitude || false);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      deleteEntryMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setEntryTitle("");
    setEntryContent("");
    setIsGratitude(false);
    setSelectedEntry(null);
    setIsEditing(false);
    setShowForm(false);
  };

  const clearDateFilter = () => {
    setDateFilter(undefined);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5 text-primary" />
            Motivation Journal
          </CardTitle>
          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <Calendar className="h-4 w-4" />
                  {dateFilter ? format(dateFilter, 'MMM d, yyyy') : 'Filter'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  initialFocus
                />
                <div className="p-2 border-t border-border">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full"
                    onClick={clearDateFilter}
                  >
                    Clear Filter
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            
            <Button 
              size="sm"
              onClick={() => {
                resetForm();
                setShowForm(!showForm);
              }}
              className="h-8"
            >
              {showForm ? <X className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
              {showForm ? "Cancel" : "New Entry"}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {showForm && (
          <Card className="mb-4 shadow-sm">
            <CardContent className="pt-6 pb-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="entry-title">Title</Label>
                  <Input
                    id="entry-title"
                    placeholder="Title your entry"
                    value={entryTitle}
                    onChange={(e) => setEntryTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="entry-content">Content</Label>
                  <Textarea
                    id="entry-content"
                    placeholder="Write your thoughts, experiences, or gratitude..."
                    value={entryContent}
                    onChange={(e) => setEntryContent(e.target.value)}
                    className="min-h-[150px]"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is-gratitude"
                    checked={isGratitude}
                    onChange={(e) => setIsGratitude(e.target.checked)}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <Label htmlFor="is-gratitude" className="text-sm">
                    This is a gratitude entry
                  </Label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 py-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetForm}
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave}
                disabled={addEntryMutation.isPending || updateEntryMutation.isPending}
              >
                {(addEntryMutation.isPending || updateEntryMutation.isPending) ? (
                  <span className="flex items-center gap-1">
                    <Save className="h-4 w-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Save className="h-4 w-4" />
                    {isEditing ? "Update" : "Save"}
                  </span>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}

        {isLoading ? (
          <div className="text-center py-10">Loading journal entries...</div>
        ) : journalEntries && journalEntries.length > 0 ? (
          <ScrollArea className="h-[300px] pr-4">
            <div className="space-y-4">
              {journalEntries.map((entry) => (
                <Card key={entry.id} className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium flex items-center gap-1">
                          {entry.is_gratitude && (
                            <span className="text-green-500">❤</span>
                          )}
                          {entry.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {new Date(entry.created_at!).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(entry)}
                          className="h-7 w-7"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(entry.id!)}
                          className="h-7 w-7 text-destructive"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="mt-2 text-sm whitespace-pre-wrap">{entry.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        ) : dateFilter ? (
          <div className="text-center py-10 space-y-2">
            <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto" />
            <p>No entries found for {format(dateFilter, 'MMMM d, yyyy')}</p>
            <Button variant="outline" size="sm" onClick={clearDateFilter}>
              Clear Filter
            </Button>
          </div>
        ) : (
          <div className="text-center py-10 space-y-2">
            <Book className="w-10 h-10 text-muted-foreground mx-auto" />
            <p>No journal entries yet</p>
            <p className="text-sm text-muted-foreground">
              Start writing to track your motivation journey
            </p>
            <Button 
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              Create Your First Entry
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
