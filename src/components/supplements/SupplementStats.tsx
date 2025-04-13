
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Pill, Brain, Zap, Heart, ArrowUp, ArrowDown, Clock } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';
import { assertType } from '@/utils/typeSafeUtils';
import { formatValue, ValueType } from '@/utils/formatUtils';

type SupplementData = {
  id: string;
  name: string;
  category: string;
  dosage: number;
  dosage_unit: string;
  frequency: string;
  start_date: string;
  end_date: string | null;
  notes: string | null;
  user_id: string;
};

type SupplementLog = {
  id: string;
  supplement_id: string;
  taken_at: string;
  actual_dosage: number;
  mood_impact: number | null;
  energy_impact: number | null;
  focus_impact: number | null;
  side_effects: string[] | null;
  notes: string | null;
  user_id: string;
};

export const SupplementStats = () => {
  const { session } = useAuth();
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [metricView, setMetricView] = useState<'energy' | 'mood' | 'focus'>('energy');
  
  const { data: supplements, isLoading: loadingSupplements } = useQuery({
    queryKey: ['supplements', session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const { data, error } = await supabase
        .from('supplements')
        .select('*')
        .eq('user_id', session.user.id);
      
      if (error) {
        console.error('Error fetching supplements:', error);
        return [];
      }
      
      return assertType<SupplementData[]>(data || []);
    },
    enabled: !!session?.user?.id,
  });
  
  const { data: supplementLogs, isLoading: loadingLogs } = useQuery({
    queryKey: ['supplement_logs', session?.user?.id, period],
    queryFn: async () => {
      if (!session?.user?.id) return [];
      
      const pastDate = new Date();
      switch (period) {
        case 'week':
          pastDate.setDate(pastDate.getDate() - 7);
          break;
        case 'month':
          pastDate.setDate(pastDate.getDate() - 30);
          break;
        case 'year':
          pastDate.setDate(pastDate.getDate() - 365);
          break;
      }
      
      const { data, error } = await supabase
        .from('supplement_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .gte('taken_at', pastDate.toISOString())
        .order('taken_at', { ascending: true });
      
      if (error) {
        console.error('Error fetching supplement logs:', error);
        return [];
      }
      
      return assertType<SupplementLog[]>(data || []);
    },
    enabled: !!session?.user?.id,
  });
  
  const getSupplementName = (id: string) => {
    if (!supplements) return 'Unknown';
    const supplement = supplements.find(s => s.id === id);
    return supplement ? supplement.name : 'Unknown';
  };
  
  const getTopSupplements = (metric: 'energy' | 'mood' | 'focus') => {
    if (!supplementLogs || !supplements) return [];
    
    // Group logs by supplement_id
    const supplementGroups: { [key: string]: SupplementLog[] } = {};
    supplementLogs.forEach(log => {
      if (!supplementGroups[log.supplement_id]) {
        supplementGroups[log.supplement_id] = [];
      }
      supplementGroups[log.supplement_id].push(log);
    });
    
    // Calculate average impact for each supplement
    const supplementImpacts = Object.keys(supplementGroups).map(id => {
      const logs = supplementGroups[id];
      let totalImpact = 0;
      let count = 0;
      
      logs.forEach(log => {
        if (metric === 'energy' && log.energy_impact !== null) {
          totalImpact += log.energy_impact;
          count++;
        } else if (metric === 'mood' && log.mood_impact !== null) {
          totalImpact += log.mood_impact;
          count++;
        } else if (metric === 'focus' && log.focus_impact !== null) {
          totalImpact += log.focus_impact;
          count++;
        }
      });
      
      const avgImpact = count > 0 ? totalImpact / count : 0;
      
      return {
        id,
        name: getSupplementName(id),
        avgImpact,
        count
      };
    });
    
    // Sort by average impact and return top 5
    return supplementImpacts
      .filter(s => s.count > 0)
      .sort((a, b) => b.avgImpact - a.avgImpact)
      .slice(0, 5);
  };
  
  const getMetricAverages = () => {
    if (!supplementLogs) return { energy: 0, mood: 0, focus: 0 };
    
    let energyTotal = 0;
    let energyCount = 0;
    let moodTotal = 0;
    let moodCount = 0;
    let focusTotal = 0;
    let focusCount = 0;
    
    supplementLogs.forEach(log => {
      if (log.energy_impact !== null) {
        energyTotal += log.energy_impact;
        energyCount++;
      }
      if (log.mood_impact !== null) {
        moodTotal += log.mood_impact;
        moodCount++;
      }
      if (log.focus_impact !== null) {
        focusTotal += log.focus_impact;
        focusCount++;
      }
    });
    
    return {
      energy: energyCount > 0 ? energyTotal / energyCount : 0,
      mood: moodCount > 0 ? moodTotal / moodCount : 0,
      focus: focusCount > 0 ? focusTotal / focusCount : 0
    };
  };
  
  const getCommonSideEffects = () => {
    if (!supplementLogs) return [];
    
    const sideEffectCounts: { [key: string]: number } = {};
    
    supplementLogs.forEach(log => {
      if (log.side_effects) {
        log.side_effects.forEach(effect => {
          sideEffectCounts[effect] = (sideEffectCounts[effect] || 0) + 1;
        });
      }
    });
    
    return Object.entries(sideEffectCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([effect, count]) => ({ effect, count }));
  };
  
  const getSupplementCategories = () => {
    if (!supplements) return [];
    
    const categories: { [key: string]: number } = {};
    
    supplements.forEach(supp => {
      categories[supp.category] = (categories[supp.category] || 0) + 1;
    });
    
    return Object.entries(categories)
      .sort((a, b) => b[1] - a[1])
      .map(([category, count]) => ({ category, count }));
  };
  
  const metricAverages = getMetricAverages();
  const topSupplements = getTopSupplements(metricView);
  const commonSideEffects = getCommonSideEffects();
  const supplementCategories = getSupplementCategories();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold tracking-tight">Supplement Analytics</h2>
          <p className="text-sm text-muted-foreground">
            Track the effectiveness of your supplements
          </p>
        </div>
        
        <div className="flex items-center">
          <Tabs value={period} onValueChange={(v) => setPeriod(v as 'week' | 'month' | 'year')}>
            <TabsList>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Energy Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Zap className="h-5 w-5 text-yellow-500 mr-2" />
              <span className="text-2xl font-bold">
                {formatValue(metricAverages.energy, 1)}/10
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Mood Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Heart className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-2xl font-bold">
                {formatValue(metricAverages.mood, 1)}/10
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Focus Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Brain className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">
                {formatValue(metricAverages.focus, 1)}/10
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Top Performing Supplements</CardTitle>
              <Tabs value={metricView} onValueChange={(v) => setMetricView(v as 'energy' | 'mood' | 'focus')}>
                <TabsList>
                  <TabsTrigger value="energy">Energy</TabsTrigger>
                  <TabsTrigger value="mood">Mood</TabsTrigger>
                  <TabsTrigger value="focus">Focus</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <CardDescription>
              Supplements with the highest impact on {metricView}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingLogs || loadingSupplements ? (
              <p>Loading supplement data...</p>
            ) : topSupplements.length > 0 ? (
              <div className="space-y-4">
                {topSupplements.map((supp, index) => (
                  <div key={supp.id} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {index + 1}
                      </div>
                      <span>{supp.name}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="font-medium">{formatValue(supp.avgImpact, 1)}/10</span>
                      {supp.avgImpact > 7 ? (
                        <ArrowUp className="h-4 w-4 text-green-500 ml-2" />
                      ) : supp.avgImpact < 4 ? (
                        <ArrowDown className="h-4 w-4 text-red-500 ml-2" />
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No supplement data available</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Side Effects</CardTitle>
            <CardDescription>
              Most commonly reported side effects
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingLogs ? (
              <p>Loading side effect data...</p>
            ) : commonSideEffects.length > 0 ? (
              <div className="space-y-4">
                {commonSideEffects.map((effect) => (
                  <div key={effect.effect} className="flex justify-between items-center">
                    <span>{effect.effect}</span>
                    <span className="text-sm text-muted-foreground">{effect.count} occurrences</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No side effects reported</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Supplement Categories</CardTitle>
            <CardDescription>
              Breakdown of your supplement types
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingSupplements ? (
              <p>Loading categories...</p>
            ) : supplementCategories.length > 0 ? (
              <div className="space-y-4">
                {supplementCategories.map((cat) => (
                  <div key={cat.category} className="space-y-2">
                    <div className="flex justify-between">
                      <span>{cat.category}</span>
                      <span className="text-sm text-muted-foreground">{cat.count} supplements</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ 
                          width: `${(cat.count / supplements!.length) * 100}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No supplements added yet</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Supplement Schedule</CardTitle>
            <CardDescription>
              Your supplement timing throughout the day
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingLogs || loadingSupplements ? (
              <p>Loading schedule data...</p>
            ) : supplementLogs && supplementLogs.length > 0 ? (
              <div className="space-y-4">
                {/* Morning */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-500" />
                    <span className="font-medium">Morning</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {supplements
                      ?.filter(s => s.frequency.includes('morning'))
                      .map(s => (
                        <div 
                          key={s.id}
                          className="px-2 py-1 bg-primary/10 text-sm rounded-full"
                        >
                          {s.name}
                        </div>
                      ))
                    }
                  </div>
                </div>
                
                {/* Afternoon */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Afternoon</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {supplements
                      ?.filter(s => s.frequency.includes('afternoon'))
                      .map(s => (
                        <div 
                          key={s.id}
                          className="px-2 py-1 bg-primary/10 text-sm rounded-full"
                        >
                          {s.name}
                        </div>
                      ))
                    }
                  </div>
                </div>
                
                {/* Evening */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-indigo-500" />
                    <span className="font-medium">Evening</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {supplements
                      ?.filter(s => s.frequency.includes('evening'))
                      .map(s => (
                        <div 
                          key={s.id}
                          className="px-2 py-1 bg-primary/10 text-sm rounded-full"
                        >
                          {s.name}
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No schedule data available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
