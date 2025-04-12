import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CaffeineIntakeForm } from "@/components/caffeine/CaffeineIntakeForm";
import { CaffeineHistory } from "@/components/caffeine/CaffeineHistory";
import { CaffeineChart } from "@/components/caffeine/CaffeineChart";
import { assertType } from "@/utils/typeSafeUtils";

const Caffeine = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: caffeineHistory, isLoading: isHistoryLoading } = useQuery({
    queryKey: ["caffeineHistory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("energy_focus_logs")
        .select("*")
        .eq("user_id", session?.user?.id)
        .eq("activity_type", "caffeine")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: chartData, isLoading: isChartLoading } = useQuery({
    queryKey: ["caffeineChartData"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("energy_focus_logs")
        .select("*")
        .eq("user_id", session?.user?.id)
        .eq("activity_type", "caffeine")
        .order("created_at", { ascending: true })
        .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
        .limit(50);

      if (error) throw error;

      const processedData = data.map(log => ({
        date: new Date(log.created_at).toLocaleDateString(),
        amount: parseInt(log.activity_name.split(":")[1]),
        energy: log.energy_rating
      }));

      return processedData;
    },
    enabled: !!session?.user?.id,
  });

  const logCaffeineMutation = useMutation({
    mutationFn: async (values: { amount: string; energyRating: string; consumedAt: string }) => {
      const { error } = await supabase.from("energy_focus_logs").insert({
        user_id: session?.user?.id,
        activity_type: "caffeine",
        activity_name: `Caffeine Intake: ${values.amount}mg`,
        energy_rating: parseInt(values.energyRating),
        created_at: values.consumedAt,
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["caffeineHistory"] });
      queryClient.invalidateQueries({ queryKey: ["caffeineChartData"] });
      toast({
        title: "Success",
        description: "Caffeine intake logged successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to log caffeine intake",
        variant: "destructive",
      });
      console.error("Error logging caffeine:", error);
    },
  });

  const handleSubmit = (values: { amount: string; energyRating: string; consumedAt: string }) => {
    if (!values.amount || !values.energyRating) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    logCaffeineMutation.mutate(values);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Caffeine Tracker</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Log Caffeine Intake</CardTitle>
          </CardHeader>
          <CardContent>
            <CaffeineIntakeForm onSubmit={handleSubmit} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent History</CardTitle>
          </CardHeader>
          <CardContent>
            <CaffeineHistory history={caffeineHistory || []} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Caffeine Intake Trends (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <CaffeineChart data={chartData || []} isLoading={isChartLoading} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Caffeine;
