import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LandingHeader } from "@/components/layout/LandingHeader"; // Changed import
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Moon, Sun, Clock, Info, Check, BedDouble } from "lucide-react";
import { addMinutes, format, parse } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function SleepCalculator() {
  const [wakeUpTime, setWakeUpTime] = useState("07:00");
  const [bedTime, setBedTime] = useState("23:00");
  const [cycles, setCycles] = useState<string[]>([]);
  const [calculationMode, setCalculationMode] = useState<"wake" | "bed">("wake");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  useEffect(() => {
    // Calculate on initial load
    calculateSleepCycles(wakeUpTime, true);
  }, []);

  const calculateSleepCycles = (time: string, isWakeUp: boolean) => {
    setCalculationMode(isWakeUp ? "wake" : "bed");

    const baseDate = new Date();
    const timeDate = parse(time, "HH:mm", baseDate);
    const cycleLength = 90; // minutes per sleep cycle
    const fallAsleepTime = 15; // minutes to fall asleep
    const cycles: string[] = [];

    // Calculate 6 cycles (approximately 9 hours of sleep)
    for (let i = 0; i < 6; i++) {
      let cycleTime;

      if (isWakeUp) {
        // Work backwards from wake time (subtract time)
        cycleTime = addMinutes(timeDate, -(i + 1) * cycleLength - fallAsleepTime);
      } else {
        // Work forwards from bedtime (add time)
        cycleTime = addMinutes(timeDate, (i + 1) * cycleLength + fallAsleepTime);
      }

      cycles.push(format(cycleTime, "HH:mm"));
    }

    // For wake-up mode, reverse the array to show earliest bedtime first
    if (isWakeUp) {
      cycles.reverse();
    }

    setCycles(cycles);
    setSelectedTime(null);
  };

  const getCycleCountText = (index: number) => {
    const cycleCount = calculationMode === "wake" ? 6 - index : index + 1;
    const hoursMinutes = getCycleDuration(cycleCount);
    return `${cycleCount} sleep cycles (~${hoursMinutes})`;
  };

  const getCycleDuration = (cycles: number) => {
    const totalMinutes = cycles * 90 + 15; // Add 15 min to fall asleep
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const getQualityIndicator = (index: number) => {
    const cycleCount = calculationMode === "wake" ? 6 - index : index + 1;
    if (cycleCount <= 2) return { color: "text-red-500", label: "Not enough sleep" };
    if (cycleCount <= 3) return { color: "text-amber-500", label: "Minimum rest" };
    if (cycleCount <= 4) return { color: "text-blue-500", label: "Good rest" };
    return { color: "text-green-500", label: "Optimal rest" };
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    if (calculationMode === "wake") {
      setBedTime(time);
    } else {
      setWakeUpTime(time);
    }
  };

  return (
    <ToolAnalyticsWrapper
      toolName="sleep-calculator"
      toolType="wellness"
      toolSettings={{
        showNav: true, // This setting might be redundant now
        allowShare: true,
      }}
    >
      <div className="min-h-screen bg-background">
        <LandingHeader /> {/* Changed component */}
        <div className="container mx-auto p-4 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BedDouble className="h-6 w-6 text-indigo-500" />
                <CardTitle>Sleep Cycle Calculator</CardTitle>
              </div>
              <CardDescription>
                Calculate optimal bedtime or wake-up time based on sleep cycles. Each cycle is approximately 90 minutes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="wakeup" className="space-y-6">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                  <TabsTrigger value="wakeup" onClick={() => calculateSleepCycles(wakeUpTime, true)} className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    <span className="hidden sm:inline">Plan from Wake-Up Time</span>
                    <span className="sm:hidden">Wake-Up</span>
                  </TabsTrigger>
                  <TabsTrigger value="bedtime" onClick={() => calculateSleepCycles(bedTime, false)} className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    <span className="hidden sm:inline">Plan from Bedtime</span>
                    <span className="sm:hidden">Bedtime</span>
                  </TabsTrigger>
                </TabsList>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <TabsContent value="wakeup" className="space-y-4 mt-0">
                      <div className="space-y-2">
                        <Label>I want to wake up at:</Label>
                        <div className="flex items-center gap-2">
                          <Sun className="h-4 w-4 text-yellow-500" />
                          <Input
                            type="time"
                            value={wakeUpTime}
                            onChange={(e) => setWakeUpTime(e.target.value)}
                          />
                          <Button
                            onClick={() => calculateSleepCycles(wakeUpTime, true)}
                            className="w-32"
                          >
                            Calculate
                          </Button>
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-muted space-y-2">
                        <div className="flex items-center gap-2">
                          <Info className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">How it works</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          This calculator finds optimal bedtimes based on when you want to wake up,
                          ensuring you complete full sleep cycles to avoid waking up groggy.
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="bedtime" className="space-y-4 mt-0">
                      <div className="space-y-2">
                        <Label>I want to go to bed at:</Label>
                        <div className="flex items-center gap-2">
                          <Moon className="h-4 w-4 text-indigo-500" />
                          <Input
                            type="time"
                            value={bedTime}
                            onChange={(e) => setBedTime(e.target.value)}
                          />
                          <Button
                            onClick={() => calculateSleepCycles(bedTime, false)}
                            className="w-32"
                          >
                            Calculate
                          </Button>
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-muted space-y-2">
                        <div className="flex items-center gap-2">
                          <Info className="h-4 w-4 text-blue-500" />
                          <span className="text-sm font-medium">How it works</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          This calculator finds optimal wake-up times based on when you go to bed,
                          ensuring you complete full sleep cycles for the most refreshing rest.
                        </p>
                      </div>
                    </TabsContent>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Selected {calculationMode === "wake" ? "Bedtime" : "Wake-up Time"}</Label>
                        {selectedTime && (
                          <span className="text-sm font-medium flex items-center gap-1">
                            <Check className="h-3 w-3 text-green-500" />
                            {selectedTime}
                          </span>
                        )}
                      </div>
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                        {selectedTime ? (
                          <div className="space-y-2">
                            <div className="text-sm">
                              Going to bed at <span className="font-medium">{calculationMode === "wake" ? selectedTime : bedTime}</span> and
                              waking up at <span className="font-medium">{calculationMode === "wake" ? wakeUpTime : selectedTime}</span> gives you:
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-primary" />
                              <span className="font-medium">{getCycleDuration(calculationMode === "wake" ? 6 - cycles.indexOf(selectedTime) : cycles.indexOf(selectedTime) + 1)} of sleep</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-muted-foreground text-center">
                            Select a recommended time to see details
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Recommended Times</CardTitle>
                      <CardDescription>
                        For optimal rest, try to {calculationMode === "wake" ? "go to bed" : "wake up"} at one of these times
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {cycles.map((time, index) => {
                          const quality = getQualityIndicator(index);
                          return (
                            <div
                              key={time}
                              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors
                                ${selectedTime === time ? 'bg-primary/10 border border-primary/20' : 'bg-secondary/10 hover:bg-secondary/20'}`}
                              onClick={() => handleSelectTime(time)}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedTime === time ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                  {calculationMode === "wake" ? (
                                    <Moon className="h-4 w-4" />
                                  ) : (
                                    <Sun className="h-4 w-4" />
                                  )}
                                </div>
                                <span className="font-mono text-lg">{time}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <div className={`px-2 py-1 rounded text-xs font-medium ${quality.color}`}>
                                        {quality.label}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{getCycleCountText(index)}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </Tabs>

              <div className="mt-8 p-4 rounded-lg bg-muted space-y-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-500" />
                  About Sleep Cycles
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">What are sleep cycles?</h4>
                    <p className="text-sm text-muted-foreground">
                      Sleep follows a pattern of alternating REM (rapid eye movement) and NREM (non-rapid eye movement)
                      sleep throughout a typical night in a cycle that repeats itself about every 90 minutes.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Why do they matter?</h4>
                    <p className="text-sm text-muted-foreground">
                      Waking up in the middle of a sleep cycle, when you're in deep sleep, can cause you to feel groggy.
                      Timing your sleep in 90-minute increments helps you wake up between cycles when you're in lighter sleep.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolAnalyticsWrapper>
  );
}
