
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";

const teaTypes = [
  { value: "black", label: "Black Tea" },
  { value: "green", label: "Green Tea" },
  { value: "white", label: "White Tea" },
  { value: "oolong", label: "Oolong Tea" },
  { value: "yellow", label: "Yellow Tea" },
  { value: "puerh", label: "Pu-erh Tea" },
  { value: "herbal", label: "Herbal Tea" },
  { value: "rooibos", label: "Rooibos" },
  { value: "mate", label: "Yerba Mate" },
  { value: "chai", label: "Chai" },
  { value: "blend", label: "Tea Blend" },
  { value: "other", label: "Other" },
];

const brewingMethods = [
  { value: "western", label: "Western Style" },
  { value: "gongfu", label: "Gongfu" },
  { value: "grandpa", label: "Grandpa Style" },
  { value: "cold_brew", label: "Cold Brew" },
  { value: "flash", label: "Flash Brew" },
  { value: "other", label: "Other" },
];

const teaFormSchema = z.object({
  tea_name: z.string().min(1, "Tea name is required"),
  tea_type: z.string().min(1, "Tea type is required"),
  brewing_method: z.string().min(1, "Brewing method is required"),
  steep_time: z.number().min(0),
  steep_temperature: z.number().min(0),
  amount: z.string().optional(),
  notes: z.string().optional(),
  rating: z.number().min(1).max(5),
  country_of_origin: z.string().optional(),
  vendor: z.string().optional(),
});

type TeaFormValues = z.infer<typeof teaFormSchema>;

export function TeaIntakeForm() {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<TeaFormValues>({
    resolver: zodResolver(teaFormSchema),
    defaultValues: {
      tea_name: "",
      tea_type: "black",
      brewing_method: "western",
      steep_time: 3,
      steep_temperature: 95,
      amount: "",
      notes: "",
      rating: 3,
      country_of_origin: "",
      vendor: "",
    },
  });

  const onSubmit = async (values: TeaFormValues) => {
    if (!session?.user?.id) {
      toast({
        title: "Authentication required",
        description: "Please sign in to log your tea.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("tea_logs").insert({
        user_id: session.user.id,
        tea_name: values.tea_name,
        tea_type: values.tea_type,
        brewing_method: values.brewing_method,
        steep_time: values.steep_time,
        steep_temperature: values.steep_temperature,
        amount: values.amount,
        notes: values.notes,
        rating: values.rating,
        country_of_origin: values.country_of_origin,
        vendor: values.vendor,
      });

      if (error) throw error;

      toast({
        title: "Tea logged successfully",
        description: "Your tea session has been recorded.",
      });

      form.reset({
        tea_name: "",
        tea_type: "black",
        brewing_method: "western",
        steep_time: 3,
        steep_temperature: 95,
        amount: "",
        notes: "",
        rating: 3,
        country_of_origin: "",
        vendor: "",
      });

      // Invalidate tea history queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["tea-history"] });
      queryClient.invalidateQueries({ queryKey: ["tea-stats"] });
    } catch (error) {
      console.error("Error logging tea:", error);
      toast({
        title: "Error logging tea",
        description: "There was a problem recording your tea session.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Log Your Tea</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tea_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tea Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Dragon Well, Earl Grey, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tea_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tea Type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select tea type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {teaTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="brewing_method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brewing Method</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select brewing method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brewingMethods.map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            {method.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount Used</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 3g, 1 tsp" {...field} />
                    </FormControl>
                    <FormDescription>Optional - Specify how much tea you used</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="steep_time"
                render={({ field: { onChange, value, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Steep Time (Minutes)</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Slider
                          min={0}
                          max={10}
                          step={0.5}
                          defaultValue={[value]}
                          onValueChange={(vals) => onChange(vals[0])}
                          {...fieldProps}
                        />
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">0 min</span>
                          <span className="text-sm font-medium">{value} min</span>
                          <span className="text-sm text-muted-foreground">10 min</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="steep_temperature"
                render={({ field: { onChange, value, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Temperature (°C)</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Slider
                          min={50}
                          max={100}
                          step={1}
                          defaultValue={[value]}
                          onValueChange={(vals) => onChange(vals[0])}
                          {...fieldProps}
                        />
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">50°C</span>
                          <span className="text-sm font-medium">{value}°C</span>
                          <span className="text-sm text-muted-foreground">100°C</span>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="country_of_origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country of Origin</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., China, India, etc." {...field} />
                    </FormControl>
                    <FormDescription>Optional - Where was the tea grown?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vendor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendor/Brand</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Yunnan Sourcing, Twinings" {...field} />
                    </FormControl>
                    <FormDescription>Optional - Where did you purchase it?</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="rating"
              render={({ field: { onChange, value, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      <Slider
                        min={1}
                        max={5}
                        step={0.5}
                        defaultValue={[value]}
                        onValueChange={(vals) => onChange(vals[0])}
                        {...fieldProps}
                      />
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Poor</span>
                        <span className="text-sm font-medium">{value} stars</span>
                        <span className="text-sm text-muted-foreground">Excellent</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tasting Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your tasting notes, flavor profile, etc."
                      className="min-h-[80px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Optional - Record your experience with this tea</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Log Tea Session</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
