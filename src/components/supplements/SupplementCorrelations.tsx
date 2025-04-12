
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/components/AuthProvider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Pill, Brain, Battery, Heart, Moon, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion } from "framer-motion";

interface CorrelationData {
  supplement_name: string;
  correlation_type: string;
  correlation_score: number;
  analysis_period_days: number;
  confidence_level: 'high' | 'medium' | 'low';
  primary_effect: string;
  secondary_effects?: string[];
}

export function SupplementCorrelations() {
  const { session } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<string>("30");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: correlations, isLoading } = useQuery({
    queryKey: ['supplementCorrelations', session?.user?.id, selectedPeriod],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supplement_correlations')
        .select('*')
        .eq('user_id', session?.user?.id)
        .eq('analysis_period_days', parseInt(selectedPeriod))
        .order('correlation_score', { ascending: false });
      
      if (error) throw error;
      return data as CorrelationData[];
    },
    enabled: !!session?.user?.id,
  });

  const filterCorrelations = (correlations: CorrelationData[] | undefined) => {
    if (!correlations) return [];
    
    if (selectedCategory === "all") {
      return correlations;
    } else {
      return correlations.filter(c => c.correlation_type === selectedCategory);
    }
  };

  const getCorrelationIcon = (type: string) => {
    switch (type) {
      case 'energy':
        return <Battery className="h-4 w-4 text-yellow-500" />;
      case 'focus':
        return <Brain className="h-4 w-4 text-purple-500" />;
      case 'mood':
        return <Heart className="h-4 w-4 text-pink-500" />;
      case 'sleep':
        return <Moon className="h-4 w-4 text-blue-500" />;
      default:
        return <Pill className="h-4 w-4 text-gray-500" />;
    }
  };

  const getCorrelationColor = (score: number, type: string) => {
    const absScore = Math.abs(score);
    const isPositive = score >= 0;
    
    switch (type) {
      case 'energy':
        return isPositive ? 'bg-yellow-500' : 'bg-yellow-500 opacity-60';
      case 'focus':
        return isPositive ? 'bg-purple-500' : 'bg-purple-500 opacity-60';
      case 'mood':
        return isPositive ? 'bg-pink-500' : 'bg-pink-500 opacity-60';
      case 'sleep':
        return isPositive ? 'bg-blue-500' : 'bg-blue-500 opacity-60';
      default:
        return isPositive ? 'bg-gray-500' : 'bg-gray-500 opacity-60';
    }
  };

  const getConfidenceText = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high':
        return 'High confidence';
      case 'medium':
        return 'Medium confidence';
      case 'low':
        return 'Low confidence - more data needed';
      default:
        return 'Confidence unknown';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-10 w-[150px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="w-full h-24" />
        ))}
      </div>
    );
  }

  const filteredCorrelations = filterCorrelations(correlations);

  if (!filteredCorrelations?.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
        <Pill className="h-12 w-12 text-muted-foreground mb-3 opacity-50" />
        <h3 className="font-medium mb-1">No correlation data available yet</h3>
        <p className="text-sm max-w-md">
          Continue logging your supplements consistently to see meaningful patterns and correlations. It typically takes at least 2-3 weeks of data.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filter:</span>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="energy">Energy</SelectItem>
              <SelectItem value="focus">Focus</SelectItem>
              <SelectItem value="mood">Mood</SelectItem>
              <SelectItem value="sleep">Sleep</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
            <SelectItem value="180">Last 6 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="strongest">
        <TabsList className="w-full">
          <TabsTrigger value="strongest" className="flex-1">Strongest Effects</TabsTrigger>
          <TabsTrigger value="positive" className="flex-1">Positive</TabsTrigger>
          <TabsTrigger value="negative" className="flex-1">Negative</TabsTrigger>
        </TabsList>

        <TabsContent value="strongest" className="pt-4 space-y-4">
          {filteredCorrelations
            .sort((a, b) => Math.abs(b.correlation_score) - Math.abs(a.correlation_score))
            .map((correlation, index) => (
              <motion.div
                key={`${correlation.supplement_name}-${correlation.correlation_type}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Pill className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-base">{correlation.supplement_name}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      {getCorrelationIcon(correlation.correlation_type)}
                      <span className="text-sm font-medium capitalize">
                        {correlation.correlation_type}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm text-muted-foreground">
                      {(correlation.correlation_score >= 0 ? 'Positive' : 'Negative')} impact on {correlation.correlation_type}
                    </p>
                    <p className="text-sm font-semibold">
                      {(Math.abs(correlation.correlation_score) * 100).toFixed(1)}% correlation
                    </p>
                  </div>

                  <div className="w-full bg-muted rounded-full h-2.5 mb-2">
                    <div
                      className={`h-2.5 rounded-full ${getCorrelationColor(correlation.correlation_score, correlation.correlation_type)}`}
                      style={{
                        width: `${Math.abs(correlation.correlation_score) * 100}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{correlation.primary_effect}</span>
                    <span>{getConfidenceText(correlation.confidence_level)}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
        </TabsContent>

        <TabsContent value="positive" className="pt-4 space-y-4">
          {filteredCorrelations
            .filter(c => c.correlation_score > 0)
            .sort((a, b) => b.correlation_score - a.correlation_score)
            .map((correlation, index) => (
              <motion.div
                key={`${correlation.supplement_name}-${correlation.correlation_type}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Pill className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-base">{correlation.supplement_name}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      {getCorrelationIcon(correlation.correlation_type)}
                      <span className="text-sm font-medium capitalize">
                        {correlation.correlation_type}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm text-muted-foreground">
                      Positive impact on {correlation.correlation_type}
                    </p>
                    <p className="text-sm font-semibold">
                      {(correlation.correlation_score * 100).toFixed(1)}% correlation
                    </p>
                  </div>

                  <div className="w-full bg-muted rounded-full h-2.5 mb-2">
                    <div
                      className={`h-2.5 rounded-full ${getCorrelationColor(correlation.correlation_score, correlation.correlation_type)}`}
                      style={{
                        width: `${correlation.correlation_score * 100}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{correlation.primary_effect}</span>
                    <span>{getConfidenceText(correlation.confidence_level)}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
        </TabsContent>

        <TabsContent value="negative" className="pt-4 space-y-4">
          {filteredCorrelations
            .filter(c => c.correlation_score < 0)
            .sort((a, b) => a.correlation_score - b.correlation_score)
            .map((correlation, index) => (
              <motion.div
                key={`${correlation.supplement_name}-${correlation.correlation_type}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Pill className="h-5 w-5 text-primary" />
                      <h4 className="font-medium text-base">{correlation.supplement_name}</h4>
                    </div>
                    <div className="flex items-center gap-2">
                      {getCorrelationIcon(correlation.correlation_type)}
                      <span className="text-sm font-medium capitalize">
                        {correlation.correlation_type}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-3">
                    <p className="text-sm text-muted-foreground">
                      Negative impact on {correlation.correlation_type}
                    </p>
                    <p className="text-sm font-semibold">
                      {(Math.abs(correlation.correlation_score) * 100).toFixed(1)}% correlation
                    </p>
                  </div>

                  <div className="w-full bg-muted rounded-full h-2.5 mb-2">
                    <div
                      className={`h-2.5 rounded-full ${getCorrelationColor(correlation.correlation_score, correlation.correlation_type)}`}
                      style={{
                        width: `${Math.abs(correlation.correlation_score) * 100}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{correlation.primary_effect}</span>
                    <span>{getConfidenceText(correlation.confidence_level)}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
