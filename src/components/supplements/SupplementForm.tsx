
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown, Clock, Pill, Shield, Sparkles, Star, Zap, AtomIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const supplementFormSchema = z.object({
  supplement_name: z.string().min(1, "Supplement name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  time_taken: z.date(),
  effectiveness_rating: z.number().min(0).max(10),
  energy_impact: z.number().min(0).max(10).optional(),
  focus_impact: z.number().min(0).max(10).optional(),
  mood_impact: z.number().min(0).max(10).optional(),
  sleep_impact: z.number().min(0).max(10).optional(),
  stress_impact: z.number().min(0).max(10).optional(),
  category: z.string().optional(),
  side_effects: z.string().optional(),
  notes: z.string().optional(),
});

type SupplementFormValues = z.infer<typeof supplementFormSchema>;

export function SupplementForm() {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showDetails, setShowDetails] = useState(false);

  const form = useForm<SupplementFormValues>({
    resolver: zodResolver(supplementFormSchema),
    defaultValues: {
      time_taken: new Date(),
      effectiveness_rating: 5,
      energy_impact: 5,
      focus_impact: 5,
      mood_impact: 5,
      sleep_impact: 5,
      stress_impact: 5,
      notes: "",
      side_effects: "",
    },
  });

  const { data: supplements } = useQuery({
    queryKey: ['supplements-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplement_logs')
        .select('supplement_name')
        .eq('user_id', session?.user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Get unique supplement names
      const uniqueNames = new Set(data.map(item => item.supplement_name));
      return Array.from(uniqueNames);
    },
    enabled: !!session?.user?.id,
  });

  const { data: categories } = useQuery({
    queryKey: ['supplement-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplement_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    },
  });

  const logSupplementMutation = useMutation({
    mutationFn: async (values: SupplementFormValues) => {
      const { error } = await supabase.from('supplement_logs').insert({
        user_id: session?.user?.id,
        supplement_name: values.supplement_name,
        dosage: values.dosage,
        time_taken: values.time_taken.toISOString(),
        effectiveness_rating: values.effectiveness_rating,
        energy_impact: values.energy_impact,
        focus_impact: values.focus_impact,
        mood_impact: values.mood_impact,
        sleep_impact: values.sleep_impact,
        stress_impact: values.stress_impact,
        category: values.category,
        side_effects: values.side_effects,
        notes: values.notes,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['supplementLogs'] });
      queryClient.invalidateQueries({ queryKey: ['frequentSupplements'] });
      toast({
        title: "Success",
        description: "Supplement logged successfully",
      });
      form.reset({
        time_taken: new Date(),
        effectiveness_rating: 5,
        energy_impact: 5,
        focus_impact: 5,
        mood_impact: 5,
        sleep_impact: 5,
        stress_impact: 5,
        notes: "",
        side_effects: "",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to log supplement. Please try again.",
        variant: "destructive",
      });
      console.error("Error logging supplement:", error);
    },
  });

  const onSubmit = (values: SupplementFormValues) => {
    logSupplementMutation.mutate(values);
  };

  const renderRatingLabel = (value: number) => {
    if (value <= 2) return "Poor";
    if (value <= 5) return "Moderate";
    if (value <= 8) return "Good";
    return "Excellent";
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="supplement_name">Supplement Name</Label>
          <div className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" />
            <Select
              value={form.watch("supplement_name")}
              onValueChange={(value) => form.setValue("supplement_name", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select or type supplement name" />
              </SelectTrigger>
              <SelectContent>
                <Input
                  placeholder="Type new supplement name..."
                  value={form.watch("supplement_name") || ""}
                  onChange={(e) => form.setValue("supplement_name", e.target.value)}
                  className="mb-2"
                />
                {supplements?.map((name, index) => (
                  <SelectItem key={index} value={name}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {form.formState.errors.supplement_name && (
            <p className="text-sm text-red-500">{form.formState.errors.supplement_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="dosage">Dosage</Label>
          <div className="flex items-center gap-2">
            <AtomIcon className="h-5 w-5 text-primary" />
            <Input
              id="dosage"
              placeholder="e.g., 500mg, 2 tablets"
              {...form.register("dosage")}
            />
          </div>
          {form.formState.errors.dosage && (
            <p className="text-sm text-red-500">{form.formState.errors.dosage.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date Taken</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !form.watch("time_taken") && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.watch("time_taken") ? (
                    format(form.watch("time_taken"), "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={form.watch("time_taken")}
                  onSelect={(date) => date && form.setValue("time_taken", date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Time Taken</Label>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <Select
                value={format(form.watch("time_taken"), "HH:mm")}
                onValueChange={(value) => {
                  const [hours, minutes] = value.split(":").map(Number);
                  const newDate = new Date(form.watch("time_taken"));
                  newDate.setHours(hours);
                  newDate.setMinutes(minutes);
                  form.setValue("time_taken", newDate);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 24 }).map((_, hour) => (
                    Array.from({ length: 4 }).map((_, minuteIdx) => {
                      const minute = minuteIdx * 15;
                      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                      return (
                        <SelectItem key={timeString} value={timeString}>
                          {timeString}
                        </SelectItem>
                      );
                    })
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {categories?.length > 0 && (
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={form.watch("category")}
              onValueChange={(value) => form.setValue("category", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category (optional)" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              Effectiveness Rating
            </Label>
            <span className="text-sm font-medium">
              {form.watch("effectiveness_rating")}/10 - {renderRatingLabel(form.watch("effectiveness_rating"))}
            </span>
          </div>
          <Slider
            value={[form.watch("effectiveness_rating")]}
            min={0}
            max={10}
            step={1}
            onValueChange={(values) => form.setValue("effectiveness_rating", values[0])}
            className="py-2"
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-muted-foreground"
          >
            {showDetails ? "Hide" : "Show"} Advanced Details
            <ChevronDown
              className={`h-4 w-4 transition-transform ${showDetails ? "rotate-180" : ""}`}
            />
          </Button>
        </div>

        {showDetails && (
          <div className="space-y-4 animate-accordion-down">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  Energy Impact
                </Label>
                <span className="text-sm font-medium">
                  {form.watch("energy_impact")}/10
                </span>
              </div>
              <Slider
                value={[form.watch("energy_impact") || 5]}
                min={0}
                max={10}
                step={1}
                onValueChange={(values) => form.setValue("energy_impact", values[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1">
                  <Focus className="h-4 w-4 text-blue-500" />
                  Focus Impact
                </Label>
                <span className="text-sm font-medium">
                  {form.watch("focus_impact")}/10
                </span>
              </div>
              <Slider
                value={[form.watch("focus_impact") || 5]}
                min={0}
                max={10}
                step={1}
                onValueChange={(values) => form.setValue("focus_impact", values[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1">
                  <Sparkles className="h-4 w-4 text-purple-500" />
                  Mood Impact
                </Label>
                <span className="text-sm font-medium">
                  {form.watch("mood_impact")}/10
                </span>
              </div>
              <Slider
                value={[form.watch("mood_impact") || 5]}
                min={0}
                max={10}
                step={1}
                onValueChange={(values) => form.setValue("mood_impact", values[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1">
                  <Moon className="h-4 w-4 text-indigo-500" />
                  Sleep Impact
                </Label>
                <span className="text-sm font-medium">
                  {form.watch("sleep_impact")}/10
                </span>
              </div>
              <Slider
                value={[form.watch("sleep_impact") || 5]}
                min={0}
                max={10}
                step={1}
                onValueChange={(values) => form.setValue("sleep_impact", values[0])}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-1">
                  <Shield className="h-4 w-4 text-green-500" />
                  Stress Impact
                </Label>
                <span className="text-sm font-medium">
                  {form.watch("stress_impact")}/10
                </span>
              </div>
              <Slider
                value={[form.watch("stress_impact") || 5]}
                min={0}
                max={10}
                step={1}
                onValueChange={(values) => form.setValue("stress_impact", values[0])}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="side_effects">Side Effects</Label>
              <Textarea
                id="side_effects"
                placeholder="Any side effects experienced? (optional)"
                {...form.register("side_effects")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes? (optional)"
                {...form.register("notes")}
              />
            </div>
          </div>
        )}
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={logSupplementMutation.isPending}
      >
        {logSupplementMutation.isPending ? "Logging..." : "Log Supplement"}
      </Button>
    </form>
  );
}
