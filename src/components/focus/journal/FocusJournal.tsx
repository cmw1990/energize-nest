import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { BookOpen, Brain, Battery } from "lucide-react";
import { focusDb } from "@/lib/focus-db";
import { useMutation } from "@tanstack/react-query";

export const FocusJournal = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [entry, setEntry] = useState({
    productivity_rating: 5,
    energy_level: 5,
    focus_challenges: "",
    wins: "",
    improvements: "",
    notes: ""
  });

  const saveEntryMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user) throw new Error("User not authenticated");
      
      await focusDb.createJournalEntry({
        productivity_rating: entry.productivity_rating,
        energy_level: entry.energy_level,
        focus_challenges: entry.focus_challenges.split('\n').filter(Boolean),
        wins: entry.wins.split('\n').filter(Boolean),
        improvements: entry.improvements.split('\n').filter(Boolean),
        notes: entry.notes || undefined
      });
    },
    onSuccess: () => {
      toast({
        title: "Journal entry saved",
        description: "Your focus journal entry has been recorded"
      });

      setEntry({
        productivity_rating: 5,
        energy_level: 5,
        focus_challenges: "",
        wins: "",
        improvements: "",
        notes: ""
      });
    },
    onError: (error) => {
      console.error('Error saving journal entry:', error);
      toast({
        title: "Error saving entry",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  });

  const saveEntry = () => {
    saveEntryMutation.mutate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          Focus Journal
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Productivity Rating</Label>
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" />
                <span>{entry.productivity_rating}/10</span>
              </div>
            </div>
            <Slider
              value={[entry.productivity_rating]}
              onValueChange={(value) => setEntry({ ...entry, productivity_rating: value[0] })}
              min={1}
              max={10}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Energy Level</Label>
              <div className="flex items-center gap-2">
                <Battery className="h-4 w-4 text-primary" />
                <span>{entry.energy_level}/10</span>
              </div>
            </div>
            <Slider
              value={[entry.energy_level]}
              onValueChange={(value) => setEntry({ ...entry, energy_level: value[0] })}
              min={1}
              max={10}
              step={1}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Focus Challenges (one per line)</Label>
            <Textarea
              value={entry.focus_challenges}
              onChange={(e) => setEntry({ ...entry, focus_challenges: e.target.value })}
              placeholder="What challenges did you face today?"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Wins (one per line)</Label>
            <Textarea
              value={entry.wins}
              onChange={(e) => setEntry({ ...entry, wins: e.target.value })}
              placeholder="What went well today?"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Areas for Improvement (one per line)</Label>
            <Textarea
              value={entry.improvements}
              onChange={(e) => setEntry({ ...entry, improvements: e.target.value })}
              placeholder="What could be improved?"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Additional Notes</Label>
            <Textarea
              value={entry.notes}
              onChange={(e) => setEntry({ ...entry, notes: e.target.value })}
              placeholder="Any other thoughts or observations..."
              rows={3}
            />
          </div>
        </div>

        <Button onClick={saveEntry} className="w-full">
          Save Journal Entry
        </Button>
      </CardContent>
    </Card>
  );
};
