import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { getFocusHabits, addFocusHabit } from "@/lib/focus";
import { PlusCircle, CheckCircle2, Clock } from "lucide-react";

export const FocusHabitTracker = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [habits, setHabits] = useState<any[]>([]);
  const [newHabit, setNewHabit] = useState({
    habit_name: "",
    frequency: "daily",
    reminder_time: ""
  });

  useEffect(() => {
    if (session?.user) {
      loadHabits();
    }
  }, [session?.user]);

  const loadHabits = async () => {
    try {
      const data = await getFocusHabits(session?.user);
      setHabits(data || []);
    } catch (error) {
      console.error('Error loading habits:', error);
      toast({
        title: "Error loading habits",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const handleAddHabit = async () => {
    if (!newHabit.habit_name) return;

    try {
      await addFocusHabit(session?.user, {
        habit_name: newHabit.habit_name,
        frequency: newHabit.frequency,
        reminder_time: newHabit.reminder_time || undefined
      });

      toast({
        title: "Habit added",
        description: "Your new focus habit has been created"
      });

      setNewHabit({
        habit_name: "",
        frequency: "daily",
        reminder_time: ""
      });
      loadHabits();
    } catch (error) {
      console.error('Error adding habit:', error);
      toast({
        title: "Error adding habit",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Focus Habits
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <Label>New Habit</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter new habit..."
              value={newHabit.habit_name}
              onChange={(e) => setNewHabit({ ...newHabit, habit_name: e.target.value })}
            />
            <Button onClick={handleAddHabit}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          {habits.map((habit) => (
            <Card key={habit.id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">{habit.habit_name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {habit.frequency} • Streak: {habit.streak_count || 0} days
                  </p>
                </div>
                {habit.reminder_time && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {habit.reminder_time}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
