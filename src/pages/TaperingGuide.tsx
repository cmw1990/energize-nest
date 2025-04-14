
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CalendarRange } from "@/components/ui/calendar";
import { 
  TrendingDown, Clock, Calendar, BarChart2, FileText, 
  ChevronRight, Activity, Brain, Heart, Lungs, ThumbsUp, 
  CheckCircle, Book, Cigarette, Rocket
} from "lucide-react";
import { format, addDays, addWeeks, differenceInDays } from 'date-fns';

const TaperingGuide = () => {
  const [productType, setProductType] = useState<string>("cigarettes");
  const [currentUsage, setCurrentUsage] = useState<string>("");
  const [targetDate, setTargetDate] = useState<Date>(addWeeks(new Date(), 8));
  const [taperingPlan, setTaperingPlan] = useState<any>(null);
  
  const generatePlan = () => {
    const today = new Date();
    const daysToTarget = differenceInDays(targetDate, today);
    const startAmount = parseInt(currentUsage, 10);
    
    if (isNaN(startAmount) || daysToTarget <= 0) {
      return;
    }
    
    // Create weekly increments
    const weeks = Math.ceil(daysToTarget / 7);
    const reductionPerWeek = startAmount / weeks;
    
    const schedule = [];
    let currentAmount = startAmount;
    
    for (let i = 0; i < weeks; i++) {
      const weekStart = addDays(today, i * 7);
      const weekEnd = addDays(weekStart, 6);
      
      // Round to nearest integer, ensuring we reach zero at the end
      let targetAmount = i === weeks - 1 ? 0 : Math.round(startAmount - (reductionPerWeek * (i + 1)));
      
      // Ensure the reduction is always moving downward
      targetAmount = Math.min(targetAmount, Math.round(currentAmount));
      
      schedule.push({
        week: i + 1,
        dateRange: `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}`,
        startAmount: Math.round(currentAmount),
        targetAmount,
        percentReduction: Math.round(((currentAmount - targetAmount) / currentAmount) * 100),
      });
      
      currentAmount = targetAmount;
    }
    
    setTaperingPlan({
      startDate: today,
      endDate: targetDate,
      startAmount,
      schedule,
      productType
    });
  };
  
  const renderHealthBenefits = () => {
    const benefits = [
      { time: "20 minutes", benefit: "Heart rate and blood pressure drop" },
      { time: "12 hours", benefit: "Carbon monoxide in blood drops to normal" },
      { time: "2-12 weeks", benefit: "Circulation improves, lung function increases" },
      { time: "1-9 months", benefit: "Coughing and shortness of breath decrease" },
      { time: "1 year", benefit: "Risk of coronary heart disease cuts in half" },
      { time: "5-15 years", benefit: "Stroke risk reduces to that of a non-smoker" },
      { time: "10 years", benefit: "Lung cancer death rate is about half that of a smoker" },
      { time: "15 years", benefit: "Risk of heart disease similar to non-smoker" },
    ];
    
    return (
      <div className="space-y-4">
        <h3 className="font-semibold">Timeline of Health Improvements</h3>
        <div className="space-y-2">
          {benefits.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <Badge variant="outline" className="mt-0.5">
                {item.time}
              </Badge>
              <p className="text-sm">{item.benefit}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const renderTaperingStrategies = () => {
    const strategies = [
      {
        title: "Gradual Reduction",
        description: "Slowly decrease the amount each day or week",
        suitable: ["cigarettes", "vape", "pouches", "chew"],
        icon: TrendingDown
      },
      {
        title: "Scheduled Usage",
        description: "Set specific times for usage and stick to the schedule",
        suitable: ["cigarettes", "vape", "pouches", "chew"],
        icon: Clock
      },
      {
        title: "Brand Switching",
        description: "Switch to lower nicotine brands over time",
        suitable: ["cigarettes", "vape", "pouches"],
        icon: Cigarette
      },
      {
        title: "Progressive Delay",
        description: "Gradually increase time between usage sessions",
        suitable: ["cigarettes", "vape", "pouches", "chew"],
        icon: Calendar
      },
      {
        title: "Combination NRT",
        description: "Use a patch for baseline and faster-acting NRT for cravings",
        suitable: ["cigarettes", "vape", "chew"],
        icon: Heart
      }
    ];
    
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {strategies.map((strategy, index) => (
          <Card key={index} className="bg-muted/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-background rounded-full">
                  <strategy.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">{strategy.title}</h4>
                  <p className="text-sm text-muted-foreground">{strategy.description}</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {strategy.suitable.map(item => (
                      <Badge key={item} variant="secondary" className="text-xs">
                        {item === "cigarettes" ? "Cigarettes" :
                         item === "vape" ? "Vaping" :
                         item === "pouches" ? "Pouches" :
                         item === "chew" ? "Chewing Tobacco" : item}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingDown className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Tapering Guide</h1>
        </div>
      </div>
      
      <Tabs defaultValue="plan" className="space-y-6">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
          <TabsTrigger value="plan" className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            <span>Create Plan</span>
          </TabsTrigger>
          <TabsTrigger value="strategies" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span>Strategies</span>
          </TabsTrigger>
          <TabsTrigger value="benefits" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span>Benefits</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="plan" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create Your Personalized Tapering Plan</CardTitle>
              <CardDescription>
                Answer a few questions to get a customized tapering schedule
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="product-type">Product Type</Label>
                  <Select value={productType} onValueChange={setProductType}>
                    <SelectTrigger id="product-type">
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cigarettes">Cigarettes</SelectItem>
                      <SelectItem value="vape">Vaping</SelectItem>
                      <SelectItem value="pouches">Nicotine Pouches</SelectItem>
                      <SelectItem value="chew">Chewing Tobacco</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="current-usage">
                    Current Daily Usage
                    {productType === "cigarettes" && " (cigarettes)"}
                    {productType === "vape" && " (ml of e-liquid)"}
                    {productType === "pouches" && " (pouches)"}
                    {productType === "chew" && " (servings)"}
                  </Label>
                  <Input
                    id="current-usage"
                    type="number"
                    min="1"
                    value={currentUsage}
                    onChange={(e) => setCurrentUsage(e.target.value)}
                    placeholder={`Enter amount`}
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="target-date">Target Quit Date</Label>
                  <div className="grid gap-2">
                    <CalendarRange
                      mode="single"
                      selected={targetDate}
                      onSelect={(date) => date && setTargetDate(date)}
                      disabled={(date) => date < new Date()}
                      className="border rounded-md p-3"
                    />
                    <p className="text-sm text-muted-foreground">
                      Recommended: 8-12 weeks for a comfortable taper
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={generatePlan} className="w-full">
                Generate Tapering Plan
              </Button>
            </CardFooter>
          </Card>
          
          {taperingPlan && (
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100">
              <CardHeader>
                <CardTitle>Your 
                  {taperingPlan.productType === "cigarettes" ? " Cigarette" : 
                  taperingPlan.productType === "vape" ? " Vaping" :
                  taperingPlan.productType === "pouches" ? " Nicotine Pouch" :
                  taperingPlan.productType === "chew" ? " Chewing Tobacco" : ""} 
                  Tapering Plan
                </CardTitle>
                <CardDescription>
                  From {format(taperingPlan.startDate, 'MMMM d, yyyy')} to {format(taperingPlan.endDate, 'MMMM d, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-100 dark:border-blue-800/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Starting amount: {taperingPlan.startAmount}</span>
                    <span className="text-sm font-medium">Target: 0</span>
                  </div>
                  <Progress value={0} max={100} className="h-2" />
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">Weekly Schedule</h3>
                  {taperingPlan.schedule.map((week, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-100 dark:border-blue-800/30">
                      <div className="flex justify-between items-center mb-2">
                        <div>
                          <h4 className="font-medium">Week {week.week}</h4>
                          <p className="text-sm text-muted-foreground">{week.dateRange}</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                          {week.percentReduction}% Reduction
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm">Reduce from {week.startAmount} to {week.targetAmount}</span>
                      </div>
                      <Progress 
                        value={100 - ((week.targetAmount / taperingPlan.startAmount) * 100)} 
                        max={100} 
                        className="h-2" 
                      />
                    </div>
                  ))}
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-blue-100 dark:border-blue-800/30">
                  <h3 className="font-semibold mb-2">Tips For Success</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm">Track your daily usage to stay accountable</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm">Use the focus and relaxation tools in the app during cravings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm">Consider combining with NRT for difficult periods</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm">Adjust your plan if needed - flexibility leads to success</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex gap-4">
                <Button className="flex-1" variant="outline">
                  <Book className="h-4 w-4 mr-2" />
                  Save Plan
                </Button>
                <Button className="flex-1">
                  <Rocket className="h-4 w-4 mr-2" />
                  Start Journey
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="strategies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Effective Tapering Strategies</CardTitle>
              <CardDescription>
                Evidence-based approaches to gradually reduce nicotine consumption
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {renderTaperingStrategies()}
              
              <div className="bg-muted p-4 rounded-lg mt-6 border">
                <h3 className="font-semibold flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Psychological Tips
                </h3>
                <ul className="space-y-2 mt-2">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-primary mt-1" />
                    <span className="text-sm">Focus on the taper, not the end goal - one day at a time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-primary mt-1" />
                    <span className="text-sm">Celebrate small victories and milestones</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-primary mt-1" />
                    <span className="text-sm">Identify and plan for trigger situations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-4 w-4 text-primary mt-1" />
                    <span className="text-sm">Use relaxation techniques when cravings hit</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="benefits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Health Benefits of Reducing Nicotine</CardTitle>
              <CardDescription>
                What happens to your body when you cut back and quit
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-background rounded-full">
                        <Heart className="h-5 w-5 text-red-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Cardiovascular</h4>
                        <p className="text-sm text-muted-foreground">
                          Heart rate and blood pressure begin normalizing almost immediately after quitting
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-background rounded-full">
                        <Lungs className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Respiratory</h4>
                        <p className="text-sm text-muted-foreground">
                          Lung function improves, coughing decreases, and breathing becomes easier
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-muted/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-background rounded-full">
                        <Brain className="h-5 w-5 text-purple-500" />
                      </div>
                      <div>
                        <h4 className="font-medium">Neurological</h4>
                        <p className="text-sm text-muted-foreground">
                          Improved concentration, better sleep, and reduced anxiety as brain chemistry rebalances
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800/30">
                {renderHealthBenefits()}
              </div>
              
              <div className="bg-muted p-4 rounded-lg border">
                <h3 className="font-semibold flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5 text-primary" />
                  Additional Benefits
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <Badge variant="secondary">Financial</Badge>
                    <p className="text-sm">Save thousands of dollars annually by reducing or eliminating nicotine product purchases</p>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary">Social</Badge>
                    <p className="text-sm">Improved relationships, no more disappearing for smoke breaks, and freedom from social stigma</p>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary">Physical</Badge>
                    <p className="text-sm">Better sense of taste and smell, improved skin appearance, and fresher breath</p>
                  </div>
                  <div className="space-y-2">
                    <Badge variant="secondary">Psychological</Badge>
                    <p className="text-sm">Increased self-esteem, sense of accomplishment, and freedom from dependency</p>
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

export default TaperingGuide;
