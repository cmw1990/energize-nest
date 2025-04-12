
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Edit, 
  Trash2, 
  Star, 
  Plus, 
  Minus, 
  ThermometerSun, 
  AlertTriangle, 
  Calendar, 
  MoreHorizontal,
  ChevronDown,
  ChevronUp 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { format } from "date-fns";

export function SupplementHistory({ logs = [] }: { logs: any[] }) {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingLog, setEditingLog] = useState<any | null>(null);
  const [editedNotes, setEditedNotes] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [logToDelete, setLogToDelete] = useState<string | null>(null);
  const [expandedLogs, setExpandedLogs] = useState<Record<string, boolean>>({});

  const updateNotesMutation = useMutation({
    mutationFn: async ({ logId, notes }: { logId: string; notes: string }) => {
      const { error } = await supabase
        .from('supplement_logs')
        .update({ notes })
        .eq('id', logId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplementLogs'] });
      toast({
        title: "Notes Updated",
        description: "Your supplement notes have been updated.",
      });
      setEditingLog(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update notes. Please try again.",
        variant: "destructive",
      });
      console.error("Error updating notes:", error);
    },
  });

  const deleteLogMutation = useMutation({
    mutationFn: async (logId: string) => {
      const { error } = await supabase
        .from('supplement_logs')
        .delete()
        .eq('id', logId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplementLogs'] });
      toast({
        title: "Log Deleted",
        description: "Your supplement log has been deleted.",
      });
      setIsDeleteDialogOpen(false);
      setLogToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete log. Please try again.",
        variant: "destructive",
      });
      console.error("Error deleting log:", error);
    },
  });

  const handleSaveNotes = () => {
    if (editingLog) {
      updateNotesMutation.mutate({
        logId: editingLog.id,
        notes: editedNotes,
      });
    }
  };

  const handleEditNotes = (log: any) => {
    setEditingLog(log);
    setEditedNotes(log.notes || "");
  };

  const handleDeleteConfirm = () => {
    if (logToDelete) {
      deleteLogMutation.mutate(logToDelete);
    }
  };

  const handleDeleteClick = (logId: string) => {
    setLogToDelete(logId);
    setIsDeleteDialogOpen(true);
  };

  const toggleExpand = (logId: string) => {
    setExpandedLogs(prev => ({
      ...prev,
      [logId]: !prev[logId]
    }));
  };

  const renderEffectivenessStars = (rating: number) => {
    const starCount = 5;
    return (
      <div className="flex items-center">
        {Array.from({ length: starCount }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating / 2 ? "text-amber-500 fill-amber-500" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-2 text-sm text-muted-foreground">
          {rating}/10
        </span>
      </div>
    );
  };

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
        <ThermometerSun className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
        <h3 className="font-medium mb-1">No supplement intake logged yet</h3>
        <p className="text-sm max-w-md">
          Start logging your supplements to track effectiveness, side effects, and patterns over time.
        </p>
      </div>
    );
  }

  // Group logs by date
  const groupedLogs = logs.reduce<Record<string, any[]>>((acc, log) => {
    const date = new Date(log.time_taken).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(log);
    return acc;
  }, {});

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedLogs).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-6">
      {sortedDates.map(date => (
        <div key={date} className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-sm">{format(new Date(date), "EEEE, MMMM d, yyyy")}</h3>
          </div>

          <div className="space-y-3">
            {groupedLogs[date].map((log) => (
              <Collapsible
                key={log.id}
                open={expandedLogs[log.id]}
                onOpenChange={() => toggleExpand(log.id)}
                className="rounded-lg overflow-hidden transition-all"
              >
                <Card className={`p-4 border ${expandedLogs[log.id] ? 'border-primary/20' : 'hover:border-primary/20'} transition-all duration-200`}>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-primary">{log.supplement_name}</h4>
                        {log.side_effects && (
                          <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800">
                            <AlertTriangle className="mr-1 h-3 w-3" />
                            Side effects
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Dosage: {log.dosage}</span>
                        <span>
                          {new Date(log.time_taken).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="mt-1">
                        {renderEffectivenessStars(log.effectiveness_rating)}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          {expandedLogs[log.id] ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditNotes(log)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Notes
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleDeleteClick(log.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Log
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <CollapsibleContent className="pt-4 space-y-3">
                    {log.side_effects && (
                      <div>
                        <h5 className="text-sm font-medium mb-1">Side Effects:</h5>
                        <p className="text-sm text-muted-foreground">{log.side_effects}</p>
                      </div>
                    )}

                    {log.notes && (
                      <div>
                        <h5 className="text-sm font-medium mb-1">Notes:</h5>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{log.notes}</p>
                      </div>
                    )}

                    {log.mood_impact !== undefined && (
                      <div>
                        <h5 className="text-sm font-medium mb-1">Effects:</h5>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {log.energy_impact !== undefined && (
                            <div className="flex items-center">
                              <span className="text-muted-foreground mr-2">Energy:</span>
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Plus
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < log.energy_impact / 2 ? "text-green-500" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          {log.mood_impact !== undefined && (
                            <div className="flex items-center">
                              <span className="text-muted-foreground mr-2">Mood:</span>
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Plus
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < log.mood_impact / 2 ? "text-blue-500" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          {log.focus_impact !== undefined && (
                            <div className="flex items-center">
                              <span className="text-muted-foreground mr-2">Focus:</span>
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Plus
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < log.focus_impact / 2 ? "text-purple-500" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                          {log.sleep_impact !== undefined && (
                            <div className="flex items-center">
                              <span className="text-muted-foreground mr-2">Sleep:</span>
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Plus
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < log.sleep_impact / 2 ? "text-indigo-500" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </div>
      ))}

      {/* Edit Notes Dialog */}
      <Dialog open={!!editingLog} onOpenChange={(open) => !open && setEditingLog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Notes</DialogTitle>
            <DialogDescription>
              Update your notes for {editingLog?.supplement_name}
            </DialogDescription>
          </DialogHeader>
          
          <Textarea
            value={editedNotes}
            onChange={(e) => setEditedNotes(e.target.value)}
            placeholder="Add your notes about effects, timing, or other observations..."
            className="min-h-[150px]"
          />
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingLog(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNotes} disabled={updateNotesMutation.isPending}>
              {updateNotesMutation.isPending ? "Saving..." : "Save Notes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this supplement log? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
              disabled={deleteLogMutation.isPending}
            >
              {deleteLogMutation.isPending ? "Deleting..." : "Delete Log"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
