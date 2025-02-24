import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SleepQualityCard } from '@/components/cards/SleepQualityCard';
import { Moon, Sun, Clock, Thermometer, Wind, Cloud, Bed } from 'lucide-react';

export const WebappSleep: React.FC = () => {
  const sleepEnvironment = [
    {
      icon: Thermometer,
      title: "Temperature",
      value: "18°C",
      recommendation: "Optimal sleep temperature: 16-19°C"
    },
    {
      icon: Wind,
      title: "Air Quality",
      value: "Good",
      recommendation: "Keep room well-ventilated"
    },
    {
      icon: Cloud,
      title: "Light Level",
      value: "Low",
      recommendation: "Maintain dark environment"
    },
    {
      icon: Bed,
      title: "Comfort",
      value: "Optimal",
      recommendation: "Replace bedding every 6-8 months"
    }
  ];

  const sleepSchedule = [
    {
      day: "Monday",
      bedtime: "22:30",
      wakeTime: "06:30",
      quality: 92
    },
    {
      day: "Tuesday",
      bedtime: "22:45",
      wakeTime: "06:30",
      quality: 88
    },
    {
      day: "Wednesday",
      bedtime: "22:30",
      wakeTime: "06:30",
      quality: 95
    }
  ];

  const sleepTips = [
    {
      title: "Evening Routine",
      tips: [
        "Dim lights 2 hours before bed",
        "Avoid blue light exposure",
        "Light stretching or yoga",
        "Relaxation techniques"
      ]
    },
    {
      title: "Environment",
      tips: [
        "Keep room cool and dark",
        "Use white noise if needed",
        "Invest in quality bedding",
        "Minimize distractions"
      ]
    },
    {
      title: "Habits",
      tips: [
        "Consistent sleep schedule",
        "No caffeine after 2 PM",
        "Regular exercise (not late)",
        "Mindful evening eating"
      ]
    }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Sleep Optimization</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sleep Quality Card */}
        <SleepQualityCard />

        {/* Sleep Environment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-primary" />
              Sleep Environment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {sleepEnvironment.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <h3 className="font-medium">{item.title}</h3>
                    </div>
                    <div className="text-2xl font-bold">{item.value}</div>
                    <p className="text-sm text-muted-foreground">{item.recommendation}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sleep Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            Sleep Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sleepSchedule.map((day, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">{day.day}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4 text-primary" />
                        <span className="text-sm text-muted-foreground">{day.bedtime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-primary" />
                        <span className="text-sm text-muted-foreground">{day.wakeTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-lg font-bold">{day.quality}</div>
                      <span className="text-sm text-muted-foreground">Quality Score</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Sleep Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Sleep Optimization Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sleepTips.map((section, index) => (
              <div key={index} className="space-y-2">
                <h3 className="font-medium">{section.title}</h3>
                <ul className="space-y-1">
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="text-sm text-muted-foreground flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-primary" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
