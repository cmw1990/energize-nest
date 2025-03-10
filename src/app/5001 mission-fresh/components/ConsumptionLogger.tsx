import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { Clock, CloudRain, Coffee, Cigarette, Home, MapPin, PanelTopOpen, Leaf, Zap, ThumbsUp, ThumbsDown, Trash2, Edit, Flame, Wind } from 'lucide-react';

interface ConsumptionLoggerProps {
  session: Session | null;
}

interface ConsumptionLog {
  id: string;
  user_id: string;
  consumption_date: string;
  product_type: string;
  quantity: number;
  unit: string;
  trigger: string;
  location: string;
  mood: string;
  intensity: number;
  notes: string;
  created_at: string;
}

const productTypes = [
  { value: 'cigarettes', label: 'Cigarettes', icon: <Cigarette className="h-4 w-4" /> },
  { value: 'vape', label: 'Vape/E-cigarette', icon: <Wind className="h-4 w-4" /> },
  { value: 'nicotine_pouches', label: 'Nicotine Pouches', icon: <PanelTopOpen className="h-4 w-4" /> },
  { value: 'nicotine_gum', label: 'Nicotine Gum', icon: <Leaf className="h-4 w-4" /> },
  { value: 'cigars', label: 'Cigars', icon: <Flame className="h-4 w-4" /> },
];

const unitOptions = {
  cigarettes: [{ value: 'cigarettes', label: 'Cigarettes' }],
  vape: [
    { value: 'puffs', label: 'Puffs' },
    { value: 'ml', label: 'Milliliters' },
    { value: 'pods', label: 'Pods' }
  ],
  nicotine_pouches: [
    { value: 'pouches', label: 'Pouches' }
  ],
  nicotine_gum: [
    { value: 'pieces', label: 'Pieces' }
  ],
  cigars: [
    { value: 'cigars', label: 'Cigars' }
  ]
};

const commonTriggers = [
  { value: 'stress', label: 'Stress', icon: <Zap className="h-4 w-4" /> },
  { value: 'social', label: 'Social Situation', icon: <ThumbsUp className="h-4 w-4" /> },
  { value: 'boredom', label: 'Boredom', icon: <ThumbsDown className="h-4 w-4" /> },
  { value: 'caffeine', label: 'After Coffee/Tea', icon: <Coffee className="h-4 w-4" /> },
  { value: 'morning', label: 'Morning Routine', icon: <Clock className="h-4 w-4" /> },
  { value: 'weather', label: 'Weather/Environment', icon: <CloudRain className="h-4 w-4" /> },
];

const commonLocations = [
  { value: 'home', label: 'Home', icon: <Home className="h-4 w-4" /> },
  { value: 'work', label: 'Work', icon: <MapPin className="h-4 w-4" /> },
  { value: 'car', label: 'In Car', icon: <MapPin className="h-4 w-4" /> },
  { value: 'outdoors', label: 'Outdoors', icon: <MapPin className="h-4 w-4" /> },
  { value: 'social', label: 'Social Venue', icon: <MapPin className="h-4 w-4" /> },
];

// Adding mood options
const moodOptions = [
  { value: 'very_negative', label: 'Very Low', emoji: '😭' },
  { value: 'negative', label: 'Low', emoji: '😟' },
  { value: 'neutral', label: 'Neutral', emoji: '😐' },
  { value: 'positive', label: 'Good', emoji: '😊' },
  { value: 'very_positive', label: 'Great', emoji: '😁' },
];

export const ConsumptionLogger: React.FC<ConsumptionLoggerProps> = ({ session }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('log');
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState(format(new Date(), 'HH:mm'));
  const [productType, setProductType] = useState('cigarettes');
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState('cigarettes');
  const [trigger, setTrigger] = useState('');
  const [customTrigger, setCustomTrigger] = useState('');
  const [location, setLocation] = useState('');
  const [customLocation, setCustomLocation] = useState('');
  const [mood, setMood] = useState('neutral');
  const [intensity, setIntensity] = useState(5);
  const [notes, setNotes] = useState('');
  const [logs, setLogs] = useState<ConsumptionLog[]>([]);
  const [editingLog, setEditingLog] = useState<ConsumptionLog | null>(null);
  
  // Load logs when the session changes
  useEffect(() => {
    if (session?.user) {
      loadConsumptionLogs();
    }
  }, [session]);

  const loadConsumptionLogs = async () => {
    try {
      const { data, error } = await supabase
        .from('nicotine_consumption_log')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('consumption_date', { ascending: false })
        .limit(50);

      if (error) throw error;

      if (data) {
        setLogs(data);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load consumption logs',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setDate(new Date());
    setTime(format(new Date(), 'HH:mm'));
    setProductType('cigarettes');
    setQuantity(1);
    setUnit('cigarettes');
    setTrigger('');
    setCustomTrigger('');
    setLocation('');
    setCustomLocation('');
    setMood('neutral');
    setIntensity(5);
    setNotes('');
    setEditingLog(null);
  };

  const handleProductTypeChange = (value: string) => {
    setProductType(value);
    // Set default unit for the selected product type
    if (unitOptions[value as keyof typeof unitOptions] && unitOptions[value as keyof typeof unitOptions].length > 0) {
      setUnit(unitOptions[value as keyof typeof unitOptions][0].value);
    }
  };

  const handleSubmit = async () => {
    try {
      // Combine date and time
      const dateTimeStr = `${format(date, 'yyyy-MM-dd')}T${time}:00`;
      const consumptionDateTime = new Date(dateTimeStr);
      
      // Prepare the trigger text
      const finalTrigger = trigger === 'custom' ? customTrigger : trigger;
      
      // Prepare the location text
      const finalLocation = location === 'custom' ? customLocation : location;

      if (editingLog) {
        // Update existing log
        const { error } = await supabase
          .from('nicotine_consumption_log')
          .update({
            consumption_date: consumptionDateTime.toISOString(),
            product_type: productType,
            quantity,
            unit,
            trigger: finalTrigger,
            location: finalLocation,
            mood,
            intensity,
            notes
          })
          .eq('id', editingLog.id);

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Consumption log updated successfully',
        });
      } else {
        // Insert new log
        const { error } = await supabase
          .from('nicotine_consumption_log')
          .insert({
            user_id: session?.user?.id,
            consumption_date: consumptionDateTime.toISOString(),
            product_type: productType,
            quantity,
            unit,
            trigger: finalTrigger,
            location: finalLocation,
            mood,
            intensity,
            notes
          });

        if (error) throw error;

        toast({
          title: 'Success',
          description: 'Consumption logged successfully',
        });
      }

      // Reset form and reload logs
      resetForm();
      loadConsumptionLogs();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log consumption',
        variant: 'destructive',
      });
    }
  };

  const editLog = (log: ConsumptionLog) => {
    setEditingLog(log);
    
    // Parse the date and time
    const consumptionDate = new Date(log.consumption_date);
    setDate(consumptionDate);
    setTime(format(consumptionDate, 'HH:mm'));
    
    // Set form values
    setProductType(log.product_type);
    setQuantity(log.quantity);
    setUnit(log.unit);
    
    // Handle trigger
    if (commonTriggers.some(t => t.value === log.trigger)) {
      setTrigger(log.trigger);
      setCustomTrigger('');
    } else if (log.trigger) {
      setTrigger('custom');
      setCustomTrigger(log.trigger);
    } else {
      setTrigger('');
      setCustomTrigger('');
    }
    
    // Handle location
    if (commonLocations.some(l => l.value === log.location)) {
      setLocation(log.location);
      setCustomLocation('');
    } else if (log.location) {
      setLocation('custom');
      setCustomLocation(log.location);
    } else {
      setLocation('');
      setCustomLocation('');
    }
    
    setMood(log.mood || 'neutral');
    setIntensity(log.intensity || 5);
    setNotes(log.notes || '');
    
    // Switch to log tab
    setActiveTab('log');
  };

  const deleteLog = async (id: string) => {
    try {
      const { error } = await supabase
        .from('nicotine_consumption_log')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Consumption log deleted successfully',
      });

      // Reload logs
      loadConsumptionLogs();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete consumption log',
        variant: 'destructive',
      });
    }
  };

  // Process data for charts
  const getChartData = () => {
    // Group by date and product type
    const groupedByDate = logs.reduce((acc, log) => {
      const date = format(new Date(log.consumption_date), 'yyyy-MM-dd');
      
      if (!acc[date]) {
        acc[date] = {};
      }
      
      if (!acc[date][log.product_type]) {
        acc[date][log.product_type] = 0;
      }
      
      acc[date][log.product_type] += Number(log.quantity);
      return acc;
    }, {} as Record<string, Record<string, number>>);
    
    // Convert to array for chart
    return Object.entries(groupedByDate).map(([date, products]) => {
      return {
        date,
        ...products
      };
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  // Get mood emoji based on mood text
  const getMoodEmoji = (moodValue: string) => {
    const option = moodOptions.find(option => option.value === moodValue);
    return option ? option.emoji : '😐';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Nicotine Consumption Tracker</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="log">
            <Clock className="h-4 w-4 mr-2" />
            Log Consumption
          </TabsTrigger>
          <TabsTrigger value="history">
            <Cigarette className="h-4 w-4 mr-2" />
            History & Trends
          </TabsTrigger>
        </TabsList>

        <TabsContent value="log" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{editingLog ? 'Edit Consumption Log' : 'Log Nicotine Consumption'}</CardTitle>
              <CardDescription>
                Record when and what you consume to identify patterns and triggers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date">Date</Label>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => date && setDate(date)}
                        className="rounded-md border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time">Time</Label>
                      <Input
                        id="time"
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="product-type">Product Type</Label>
                    <Select value={productType} onValueChange={handleProductTypeChange}>
                      <SelectTrigger id="product-type">
                        <SelectValue placeholder="Select product type" />
                      </SelectTrigger>
                      <SelectContent>
                        {productTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              {type.icon}
                              <span>{type.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="0.1"
                        step="0.1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseFloat(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit</Label>
                      <Select value={unit} onValueChange={setUnit}>
                        <SelectTrigger id="unit">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {unitOptions[productType as keyof typeof unitOptions]?.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="trigger">Trigger</Label>
                    <Select value={trigger} onValueChange={setTrigger}>
                      <SelectTrigger id="trigger">
                        <SelectValue placeholder="What triggered this consumption?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None specified</SelectItem>
                        {commonTriggers.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            <div className="flex items-center gap-2">
                              {t.icon}
                              <span>{t.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                        <SelectItem value="custom">Custom trigger</SelectItem>
                      </SelectContent>
                    </Select>
                    {trigger === 'custom' && (
                      <Input
                        placeholder="Custom trigger"
                        value={customTrigger}
                        onChange={(e) => setCustomTrigger(e.target.value)}
                        className="mt-2"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger id="location">
                        <SelectValue placeholder="Where did this happen?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None specified</SelectItem>
                        {commonLocations.map((loc) => (
                          <SelectItem key={loc.value} value={loc.value}>
                            <div className="flex items-center gap-2">
                              {loc.icon}
                              <span>{loc.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                        <SelectItem value="custom">Custom location</SelectItem>
                      </SelectContent>
                    </Select>
                    {location === 'custom' && (
                      <Input
                        placeholder="Custom location"
                        value={customLocation}
                        onChange={(e) => setCustomLocation(e.target.value)}
                        className="mt-2"
                      />
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="mood">Mood</Label>
                    <Select value={mood} onValueChange={setMood}>
                      <SelectTrigger id="mood">
                        <SelectValue placeholder="How were you feeling?" />
                      </SelectTrigger>
                      <SelectContent>
                        {moodOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                              <span>{option.emoji}</span>
                              <span>{option.label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="intensity">Craving Intensity</Label>
                      <span className="text-sm text-muted-foreground">{intensity}/10</span>
                    </div>
                    <Slider
                      id="intensity"
                      value={[intensity]}
                      onValueChange={(value) => setIntensity(value[0])}
                      min={1}
                      max={10}
                      step={1}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Mild</span>
                      <span>Moderate</span>
                      <span>Intense</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Additional details..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
              <Button onClick={handleSubmit}>{editingLog ? 'Update Log' : 'Save Log'}</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Consumption History</CardTitle>
              <CardDescription>
                View and manage your logged consumption
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {productTypes.map((type) => (
                        <Line
                          key={type.value}
                          type="monotone"
                          dataKey={type.value}
                          name={type.label}
                          stroke={
                            type.value === 'cigarettes' ? '#ef4444' :
                            type.value === 'vape' ? '#8b5cf6' :
                            type.value === 'nicotine_pouches' ? '#10b981' :
                            type.value === 'nicotine_gum' ? '#3b82f6' :
                            '#f59e0b'
                          }
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="rounded-md border">
                  <div className="p-4">
                    <h3 className="text-lg font-medium">Recent Logs</h3>
                  </div>
                  <div className="divide-y">
                    {logs.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No consumption logs found. Start tracking to see your data here.
                      </div>
                    ) : (
                      logs.slice(0, 10).map((log) => {
                        const productType = productTypes.find(t => t.value === log.product_type);
                        const date = new Date(log.consumption_date);
                        
                        return (
                          <div key={log.id} className="p-4 flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="flex items-center space-x-2">
                                <span className="flex items-center space-x-1">
                                  {productType?.icon}
                                  <span className="font-medium">{productType?.label || log.product_type}</span>
                                </span>
                                <span className="text-sm text-muted-foreground">
                                  {log.quantity} {log.unit}
                                </span>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {format(date, 'MMM d, yyyy h:mm a')}
                                {log.mood && <span className="ml-2">{getMoodEmoji(log.mood)}</span>}
                                {log.trigger && <span className="ml-2">• Trigger: {log.trigger}</span>}
                                {log.location && <span className="ml-2">• Location: {log.location}</span>}
                              </div>
                              {log.notes && (
                                <div className="text-sm mt-1">{log.notes}</div>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <Button variant="ghost" size="icon" onClick={() => editLog(log)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => deleteLog(log.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ConsumptionLogger; 