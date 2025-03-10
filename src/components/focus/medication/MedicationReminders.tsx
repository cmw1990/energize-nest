import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/AuthProvider";
import { Pill, Clock, Plus, X } from "lucide-react";
import { focusDb } from "@/lib/focus-db";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const MedicationReminders = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newReminder, setNewReminder] = useState({
    medication_name: "",
    dosage: "",
    frequency: "daily",
    reminder_time: "",
  });

  const { data: reminders = [] } = useQuery({
    queryKey: ['medication-reminders'],
    queryFn: () => focusDb.getMedicationReminders(),
    enabled: !!session?.user
  });

  const addReminderMutation = useMutation({
    mutationFn: () => {
      if (!newReminder.medication_name || !newReminder.dosage || !newReminder.reminder_time) {
        throw new Error("Missing required fields");
      }
      return focusDb.addMedicationReminder(newReminder);
    },
    onSuccess: () => {
      toast({
        title: "Reminder added",
        description: "Your medication reminder has been created"
      });

      setNewReminder({
        medication_name: "",
        dosage: "",
        frequency: "daily",
        reminder_time: ""
      });
      
      queryClient.invalidateQueries({ queryKey: ['medication-reminders'] });
    },
    onError: (error) => {
      console.error('Error adding reminder:', error);
      toast({
        title: "Error adding reminder",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  });

  const deleteReminderMutation = useMutation({
    mutationFn: (id: string) => focusDb.deleteMedicationReminder(id),
    onSuccess: () => {
      toast({
        title: "Reminder deleted",
        description: "The medication reminder has been removed"
      });
      
      queryClient.invalidateQueries({ queryKey: ['medication-reminders'] });
    },
    onError: (error) => {
      console.error('Error deleting reminder:', error);
      toast({
        title: "Error deleting reminder",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  });

  const addReminder = () => {
    addReminderMutation.mutate();
  };

  const deleteReminder = (id: string) => {
    deleteReminderMutation.mutate(id);
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Pill className="h-5 w-5 text-blue-500" />
          Medication Reminders
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Medication Name</Label>
            <Input
              placeholder="Enter medication name"
              value={newReminder.medication_name}
              onChange={(e) => setNewReminder({ ...newReminder, medication_name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label>Dosage</Label>
            <Input
              placeholder="Enter dosage"
              value={newReminder.dosage}
              onChange={(e) => setNewReminder({ ...newReminder, dosage: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label>Reminder Time</Label>
            <Input
              type="time"
              value={newReminder.reminder_time}
              onChange={(e) => setNewReminder({ ...newReminder, reminder_time: e.target.value })}
            />
          </div>
          <Button onClick={addReminder} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Reminder
          </Button>
        </div>

        <div className="space-y-2">
          {reminders.map((reminder) => (
            <Card key={reminder.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">{reminder.medication_name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {reminder.dosage} • {reminder.frequency}
                  </p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    {Array.isArray(reminder.reminder_time) && reminder.reminder_time[0]}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteReminder(reminder.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
