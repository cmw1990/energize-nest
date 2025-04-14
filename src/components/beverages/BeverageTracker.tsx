import React, { useState, useEffect } from 'react';
import { SupabaseClient } from '@supabase/supabase-js';
import { BeverageLog, BeverageType, BeverageAnalytics as BeverageAnalyticsType, WeeklyData } from '@/types/beverages';
import { BeverageLogForm } from './BeverageLogForm';
import { BeverageAnalytics } from './BeverageAnalytics';
import { Card } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';

interface Props {
  supabase: SupabaseClient;
}

export const BeverageTracker = ({ supabase }: Props) => {
  const [beverageTypes, setBeverageTypes] = useState<BeverageType[]>([]);
  const [analytics, setAnalytics] = useState<BeverageAnalyticsType>({
    totalWater: 0,
    totalCaffeine: 0,
    totalAlcohol: 0,
    totalCalories: 0,
    weeklyData: [],
    recentLogs: []
  });

  const fetchBeverageTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('beverage_types')
        .select('*')
        .order('name');

      if (error) throw error;
      setBeverageTypes(data || []);
    } catch (error) {
      console.error('Error fetching beverage types:', error);
      toast({
        title: 'Error',
        description: 'Failed to load beverage types. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const fetchAnalytics = async () => {
    try {
      // Get today's date at start of day
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get date 7 days ago
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);

      // Fetch logs for the past 7 days
      const { data: logs, error: logsError } = await supabase
        .from('beverage_logs')
        .select(`
          *,
          beverage_type:beverage_types (*)
        `)
        .gte('timestamp', weekAgo.toISOString())
        .order('timestamp', { ascending: false });

      if (logsError) throw logsError;

      const convertedLogs = (logs || []).map(log => ({
        ...log,
        beverage_type: log.beverage_type || null,
        timestamp: new Date(log.timestamp)
      }));

      // Calculate totals for today
      const todayLogs = convertedLogs.filter(log => log.timestamp >= today);

      const totals = todayLogs.reduce((acc, log) => {
        const beverageType = log.beverage_type;
        const amount = log.amount_ml / 100; // Convert to 100ml units for calculations

        // Calculate water content
        const waterContent = beverageType 
          ? beverageType.water_content * log.amount_ml 
          : log.amount_ml * 0.9; // Assume 90% water content for custom beverages

        // Calculate caffeine content
        const caffeineContent = log.custom_caffeine_content
          ? log.custom_caffeine_content * amount
          : beverageType?.caffeine_content 
            ? beverageType.caffeine_content * amount
            : 0;

        // Calculate alcohol content
        const alcoholContent = log.custom_alcohol_content
          ? (log.custom_alcohol_content / 100) * amount * 0.789 * 1000 // Convert percentage to grams (density of ethanol = 0.789 g/ml)
          : beverageType?.alcohol_content 
            ? (beverageType.alcohol_content / 100) * amount * 0.789 * 1000
            : 0;

        // Calculate calories
        const calories = log.custom_calories
          ? log.custom_calories * amount
          : beverageType?.calories
            ? beverageType.calories * amount
            : 0;

        return {
          water: acc.water + waterContent,
          caffeine: acc.caffeine + caffeineContent,
          alcohol: acc.alcohol + alcoholContent,
          calories: acc.calories + calories,
        };
      }, { water: 0, caffeine: 0, alcohol: 0, calories: 0 });

      // Calculate weekly data
      const weeklyData: WeeklyData[] = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const dayLogs = convertedLogs.filter(log => {
          return log.timestamp >= startOfDay && log.timestamp <= endOfDay;
        });

        const dayTotals = dayLogs.reduce((acc, log) => {
          const beverageType = log.beverage_type;
          const amount = log.amount_ml / 100;

          return {
            water: acc.water + (beverageType ? beverageType.water_content * log.amount_ml : log.amount_ml * 0.9),
            caffeine: acc.caffeine + (log.custom_caffeine_content || (beverageType?.caffeine_content || 0) * amount),
            alcohol: acc.alcohol + (log.custom_alcohol_content ? (log.custom_alcohol_content / 100) * amount * 0.789 * 1000 : beverageType?.alcohol_content ? (beverageType.alcohol_content / 100) * amount * 0.789 * 1000 : 0),
            calories: acc.calories + (log.custom_calories || (beverageType?.calories || 0) * amount),
          };
        }, { water: 0, caffeine: 0, alcohol: 0, calories: 0 });

        return {
          date: date.toISOString().split('T')[0],
          ...dayTotals
        };
      }).reverse();

      setAnalytics({
        totalWater: totals.water,
        totalCaffeine: totals.caffeine,
        totalAlcohol: totals.alcohol,
        totalCalories: totals.calories,
        weeklyData,
        recentLogs: todayLogs
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: 'Error',
        description: 'Failed to load analytics. Please try again.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchBeverageTypes();
    fetchAnalytics();
  }, []);

  const handleLogAdded = (log: BeverageLog) => {
    fetchAnalytics();
  };

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <BeverageLogForm 
          supabase={supabase}
          beverageTypes={beverageTypes}
          onLogAdded={handleLogAdded}
        />
      </Card>

      <BeverageAnalytics analytics={analytics} />
    </div>
  );
};