import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LandingHeader } from "@/components/layout/LandingHeader" // Changed import
import { Timer, Play, Pause, RotateCcw } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { ToolAnalyticsWrapper } from "@/components/tools/ToolAnalyticsWrapper"; // Added import

export default function FocusTimer() {
  const [minutes, setMinutes] = useState(25)
  const [seconds, setSeconds] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [preset, setPreset] = useState("pomodoro")
  const { toast } = useToast()

  const presets = {
    pomodoro: 25,
    short: 5,
    long: 15,
    custom: 0
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            if(interval) clearInterval(interval) // Clear interval before showing toast
            setIsActive(false)
            toast({
              title: "Timer Complete!",
              description: "Take a break and start another session when you're ready.",
            })
            // Optionally reset timer here based on Pomodoro logic (e.g., switch to break)
            // For now, just stops.
            return
          }
          setMinutes(minutes - 1)
          setSeconds(59)
        } else {
          setSeconds(seconds - 1)
        }
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, minutes, seconds, toast]) // Added toast to dependency array

  const toggleTimer = () => {
    setIsActive(!isActive)
  }

  const resetTimer = () => {
    setIsActive(false)
    if (preset === "custom") {
        // Keep custom time but reset seconds
        setSeconds(0)
    } else {
        setMinutes(presets[preset as keyof typeof presets])
        setSeconds(0)
    }
  }

  const handlePresetChange = (value: string) => {
    setPreset(value)
    setIsActive(false); // Stop timer on preset change
    if (value !== "custom") {
      setMinutes(presets[value as keyof typeof presets])
      setSeconds(0)
    } else {
        // Optionally set a default custom time or keep the last one
        setSeconds(0)
    }
  }

  return (
    <ToolAnalyticsWrapper toolName="focus-timer" toolType="productivity">
        <div className="min-h-screen bg-background">
        <LandingHeader /> {/* Changed component */}
        <div className="container mx-auto p-4 space-y-6">
            <Card>
            <CardHeader>
                <div className="flex items-center gap-2">
                <Timer className="h-6 w-6 text-primary" />
                <CardTitle>Focus Timer</CardTitle>
                </div>
                <CardDescription>
                Use the Pomodoro Technique or set custom intervals to maintain focus and take regular breaks.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                <div className="space-y-2">
                    <Label>Timer Preset</Label>
                    <Select value={preset} onValueChange={handlePresetChange}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a preset" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="pomodoro">Pomodoro (25min)</SelectItem>
                        <SelectItem value="short">Short Break (5min)</SelectItem>
                        <SelectItem value="long">Long Break (15min)</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                    </Select>
                </div>

                {preset === "custom" && (
                    <div className="space-y-2">
                    <Label htmlFor="custom-minutes">Custom Duration (minutes)</Label>
                    <Input
                        id="custom-minutes"
                        type="number"
                        value={minutes}
                        onChange={(e) => {
                        const value = parseInt(e.target.value)
                        if (!isNaN(value) && value >= 0 && value <= 120) { // Added max value
                            setMinutes(value)
                            setSeconds(0) // Reset seconds when changing custom time
                            setIsActive(false) // Stop timer if running
                        }
                        }}
                        min="1"
                        max="120"
                    />
                    </div>
                )}

                <div className="text-center py-8">
                    <span className="text-6xl font-bold tabular-nums"> {/* Added tabular-nums */}
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </span>
                </div>

                <div className="flex justify-center gap-4">
                    <Button onClick={toggleTimer} className="w-32">
                    {isActive ? (
                        <>
                        <Pause className="mr-2 h-4 w-4" /> Pause
                        </>
                    ) : (
                        <>
                        <Play className="mr-2 h-4 w-4" /> Start
                        </>
                    )}
                    </Button>
                    <Button onClick={resetTimer} variant="outline" className="w-32">
                    <RotateCcw className="mr-2 h-4 w-4" /> Reset
                    </Button>
                </div>
                </div>
            </CardContent>
            </Card>
        </div>
        </div>
    </ToolAnalyticsWrapper>
  )
}
