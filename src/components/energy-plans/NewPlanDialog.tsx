
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { PlanCategory } from "@/types/energyPlans";

export function NewPlanDialog({
  onPlanCreated,
}: {
  onPlanCreated: () => void;
}) {
  const { session } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<PlanCategory>("charged");

  const createPlanMutation = useMutation({
    mutationFn: async () => {
      if (!session?.user) {
        throw new Error("User not authenticated");
      }

      const { data, error } = await supabase
        .from("energy_plans")
        .insert({
          user_id: session.user.id,
          plan_name: title,
          plan_type: "standard",
          duration_minutes: 30,
          activities: {},
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Plan Created",
        description: "Your energy plan has been created successfully.",
      });
      setOpen(false);
      setTitle("");
      onPlanCreated();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create the plan: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} />
          New Plan
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Energy Plan</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="plan-title">Plan Title</Label>
            <Input
              id="plan-title"
              placeholder="My Energy Plan"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <div className="flex space-x-2">
              <Button
                type="button"
                variant={category === "charged" ? "default" : "outline"}
                onClick={() => setCategory("charged")}
                className="flex-1"
              >
                Charged
              </Button>
              <Button
                type="button"
                variant={category === "recharged" ? "default" : "outline"}
                onClick={() => setCategory("recharged")}
                className="flex-1"
              >
                Recharged
              </Button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={() => createPlanMutation.mutate()}
            disabled={!title || createPlanMutation.isPending}
          >
            {createPlanMutation.isPending ? "Creating..." : "Create Plan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
