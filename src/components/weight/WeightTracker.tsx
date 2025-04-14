import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { WeightProgressChart } from './WeightProgressChart';

interface WeightLog {
  id: number;
  weight_kg: number;
  height_m: number | null;
  measurement_type: 'morning' | 'evening' | 'other';
  notes: string | null;
  log_date: string;
  bmi: number | null;
}

interface MeasurementAnalytics {
  morningAverage: number | null;
  eveningAverage: number | null;
  preferredTime: 'morning' | 'evening' | 'other';
  consistency: number;
  lastSevenDays: WeightLog[];
}

interface WeightTrackerProps {
  onWeightLogged?: () => void;
}

export const WeightTracker: React.FC<WeightTrackerProps> = ({ onWeightLogged }) => {
  const { session } = useAuth();
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [measurementType, setMeasurementType] = useState<'morning' | 'evening' | 'other'>('morning');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useMetric, setUseMetric] = useState(true);
  const [weightInLbs, setWeightInLbs] = useState<string>('');
  const [heightInInches, setHeightInInches] = useState<string>('');
  const [analytics, setAnalytics] = useState<MeasurementAnalytics | null>(null);
  const [lastLog, setLastLog] = useState<WeightLog | null>(null);

  const fetchAnalytics = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      // Get last 30 days of logs
      const { data: recentLogs } = await supabase
        .from('weight_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('log_date', { ascending: false })
        .limit(30);

      if (!recentLogs?.length) return;

      // Calculate morning and evening averages
      const morningLogs = recentLogs.filter(log => log.measurement_type === 'morning');
      const eveningLogs = recentLogs.filter(log => log.measurement_type === 'evening');

      const morningAverage = morningLogs.length
        ? morningLogs.reduce((sum, log) => sum + log.weight_kg, 0) / morningLogs.length
        : null;

      const eveningAverage = eveningLogs.length
        ? eveningLogs.reduce((sum, log) => sum + log.weight_kg, 0) / eveningLogs.length
        : null;

      // Calculate measurement time consistency
      const timeMap = recentLogs.reduce((acc, log) => {
        acc[log.measurement_type] = (acc[log.measurement_type] || 0) + 1;
        return acc;
      }, {} as Record<'morning' | 'evening' | 'other', number>);

      const preferredTime = (Object.entries(timeMap) as Array<['morning' | 'evening' | 'other', number]>)
        .reduce((a, b) => timeMap[a[0]] > timeMap[b[0]] ? a : b)[0];

      const consistency = (timeMap[preferredTime] / recentLogs.length) * 100;

      // Get last 7 days of logs
      const lastSevenDays = recentLogs.slice(0, 7);

      setAnalytics({
        morningAverage,
        eveningAverage,
        preferredTime,
        consistency,
        lastSevenDays
      });

      // Set last log for prepopulating form
      setLastLog(recentLogs[0]);

      // Set measurement type based on user's preferred time
      setMeasurementType(preferredTime);

    } catch (err) {
      console.error('Error fetching weight analytics:', err);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    // Convert kg to lbs when metric weight changes
    if (weight) {
      const weightInKg = parseFloat(weight);
      if (!isNaN(weightInKg)) {
        setWeightInLbs((weightInKg * 2.20462).toFixed(1));
      }
    }
  }, [weight]);

  useEffect(() => {
    // Convert lbs to kg when imperial weight changes
    if (weightInLbs) {
      const weightInPounds = parseFloat(weightInLbs);
      if (!isNaN(weightInPounds)) {
        setWeight((weightInPounds / 2.20462).toFixed(1));
      }
    }
  }, [weightInLbs]);

  useEffect(() => {
    // Convert m to inches when metric height changes
    if (height) {
      const heightInM = parseFloat(height);
      if (!isNaN(heightInM)) {
        setHeightInInches((heightInM * 39.3701).toFixed(1));
      }
    }
  }, [height]);

  useEffect(() => {
    // Convert inches to m when imperial height changes
    if (heightInInches) {
      const heightInIn = parseFloat(heightInInches);
      if (!isNaN(heightInIn)) {
        setHeight((heightInIn / 39.3701).toFixed(2));
      }
    }
  }, [heightInInches]);

  const calculateBMI = (weightKg: number, heightM: number) => {
    return (weightKg / (heightM * heightM)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || !weight) return;

    setIsSubmitting(true);
    try {
      const weightValue = parseFloat(weight);
      const heightValue = height ? parseFloat(height) : null;

      if (isNaN(weightValue) || weightValue <= 0) {
        throw new Error('Please enter a valid weight');
      }

      if (heightValue !== null && (isNaN(heightValue) || heightValue <= 0)) {
        throw new Error('Please enter a valid height');
      }

      const bmi = heightValue ? parseFloat(calculateBMI(weightValue, heightValue)) : null;

      const { error } = await supabase.from('weight_logs').insert({
        user_id: session.user.id,
        weight_kg: weightValue,
        height_m: heightValue,
        measurement_type: measurementType,
        notes: notes.trim() || null,
        log_date: format(new Date(), 'yyyy-MM-dd'),
        bmi: bmi
      });

      if (error) throw error;

      let successMessage = `Weight (${weightValue}kg) logged successfully.`;
      if (bmi) {
        successMessage += ` BMI: ${bmi} (${getBMICategory(bmi)})`;
      }

      toast({
        title: "Success",
        description: successMessage
      });

      setWeight('');
      setHeight('');
      setWeightInLbs('');
      setHeightInInches('');
      setNotes('');
      onWeightLogged?.();
    } catch (err) {
      console.error('Error logging weight:', err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to log weight"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {analytics && analytics.lastSevenDays.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Measurements</CardTitle>
            <CardDescription>
              Last 7 days of weight measurements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {analytics.morningAverage && analytics.eveningAverage && (
                  <>
                    <div className="bg-background p-4 rounded-lg border">
                      <div className="text-sm font-medium">Morning Average</div>
                      <div className="text-2xl font-bold mt-1">
                        {analytics.morningAverage.toFixed(1)} kg
                      </div>
                    </div>
                    <div className="bg-background p-4 rounded-lg border">
                      <div className="text-sm font-medium">Evening Average</div>
                      <div className="text-2xl font-bold mt-1">
                        {analytics.eveningAverage.toFixed(1)} kg
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              <div className="space-y-3">
                {analytics.lastSevenDays.map((log, index) => (
                  <div key={log.id} className="flex items-center justify-between p-2 bg-background rounded-lg border">
                    <div>
                      <div className="text-sm font-medium">
                        {format(new Date(log.log_date), 'MMM d')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {log.measurement_type}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{log.weight_kg.toFixed(1)} kg</div>
                      {log.bmi && (
                        <div className="text-xs text-muted-foreground">
                          BMI: {log.bmi.toFixed(1)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Log Weight</CardTitle>
              <CardDescription>Track your weight and body measurements</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="metric">Metric</Label>
              <Switch
                id="metric"
                checked={useMetric}
                onCheckedChange={setUseMetric}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">
                  Weight ({useMetric ? 'kg' : 'lbs'})
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  placeholder={`Enter weight in ${useMetric ? 'kg' : 'lbs'}`}
                  value={useMetric ? weight : weightInLbs}
                  onChange={(e) => useMetric ? setWeight(e.target.value) : setWeightInLbs(e.target.value)}
                  required
                  className="text-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">
                  Height ({useMetric ? 'm' : 'inches'})
                </Label>
                <Input
                  id="height"
                  type="number"
                  step={useMetric ? "0.01" : "0.1"}
                  placeholder={`Optional - Enter height in ${useMetric ? 'm' : 'inches'}`}
                  value={useMetric ? height : heightInInches}
                  onChange={(e) => useMetric ? setHeight(e.target.value) : setHeightInInches(e.target.value)}
                  className="text-lg"
                />
              </div>
            </div>

            {weight && height && (
              <div className="bg-background p-4 rounded-lg border">
                <div className="text-sm font-medium">BMI Calculation</div>
                <div className="text-2xl font-bold mt-1">
                  {calculateBMI(parseFloat(weight), parseFloat(height))}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {getBMICategory(parseFloat(calculateBMI(parseFloat(weight), parseFloat(height))))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Measurement Time</Label>
              <Select value={measurementType} onValueChange={(value: 'morning' | 'evening' | 'other') => setMeasurementType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select measurement time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">
                    Morning (Most Consistent)
                    {analytics?.morningAverage && ` • Avg: ${analytics.morningAverage.toFixed(1)} kg`}
                  </SelectItem>
                  <SelectItem value="evening">
                    Evening
                    {analytics?.eveningAverage && ` • Avg: ${analytics.eveningAverage.toFixed(1)} kg`}
                  </SelectItem>
                  <SelectItem value="other">Other Time</SelectItem>
                </SelectContent>
              </Select>
              {measurementType !== analytics?.preferredTime && analytics?.preferredTime && (
                <p className="text-xs text-muted-foreground mt-1">
                  Tip: You usually log weights in the {analytics.preferredTime}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this measurement (diet changes, exercise, etc.)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Logging...' : 'Log Weight'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <WeightProgressChart />
    </div>
  );
};