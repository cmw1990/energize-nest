
import React from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { formatValue, formatPercentage } from '@/utils/formatUtils';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Activity, Zap, Clock, ArrowUp, ArrowDown } from "lucide-react";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface SleepData {
  date: string;
  sleepDuration: number;
  deepSleepPercentage: number;
  remSleepPercentage: number;
  lightSleepPercentage: number;
  sleepScore: number;
  sleepOnset: number;
  wakeups: number;
  efficiency: number;
}

export const SleepMetrics: React.FC = () => {
  // Sample data - in a real app, this would come from the database
  const weekData: SleepData[] = [
    {
      date: 'Mon',
      sleepDuration: 7.5,
      deepSleepPercentage: 22,
      remSleepPercentage: 18,
      lightSleepPercentage: 60,
      sleepScore: 83,
      sleepOnset: 12,
      wakeups: 2,
      efficiency: 93
    },
    {
      date: 'Tue',
      sleepDuration: 6.8,
      deepSleepPercentage: 20,
      remSleepPercentage: 17,
      lightSleepPercentage: 63,
      sleepScore: 76,
      sleepOnset: 18,
      wakeups: 3,
      efficiency: 89
    },
    {
      date: 'Wed',
      sleepDuration: 7.2,
      deepSleepPercentage: 23,
      remSleepPercentage: 19,
      lightSleepPercentage: 58,
      sleepScore: 80,
      sleepOnset: 14,
      wakeups: 1,
      efficiency: 92
    },
    {
      date: 'Thu',
      sleepDuration: 8.1,
      deepSleepPercentage: 25,
      remSleepPercentage: 22,
      lightSleepPercentage: 53,
      sleepScore: 89,
      sleepOnset: 10,
      wakeups: 1,
      efficiency: 96
    },
    {
      date: 'Fri',
      sleepDuration: 6.5,
      deepSleepPercentage: 18,
      remSleepPercentage: 15,
      lightSleepPercentage: 67,
      sleepScore: 72,
      sleepOnset: 25,
      wakeups: 4,
      efficiency: 85
    },
    {
      date: 'Sat',
      sleepDuration: 8.5,
      deepSleepPercentage: 26,
      remSleepPercentage: 23,
      lightSleepPercentage: 51,
      sleepScore: 92,
      sleepOnset: 8,
      wakeups: 0,
      efficiency: 97
    },
    {
      date: 'Sun',
      sleepDuration: 7.8,
      deepSleepPercentage: 24,
      remSleepPercentage: 21,
      lightSleepPercentage: 55,
      sleepScore: 86,
      sleepOnset: 11,
      wakeups: 1,
      efficiency: 94
    }
  ];

  // Calculate weekly averages
  const avgSleepDuration = weekData.reduce((sum, day) => sum + day.sleepDuration, 0) / weekData.length;
  const avgDeepSleep = weekData.reduce((sum, day) => sum + day.deepSleepPercentage, 0) / weekData.length;
  const avgRemSleep = weekData.reduce((sum, day) => sum + day.remSleepPercentage, 0) / weekData.length;
  const avgLightSleep = weekData.reduce((sum, day) => sum + day.lightSleepPercentage, 0) / weekData.length;
  const avgSleepScore = weekData.reduce((sum, day) => sum + day.sleepScore, 0) / weekData.length;
  const avgSleepOnset = weekData.reduce((sum, day) => sum + day.sleepOnset, 0) / weekData.length;
  const avgWakeups = weekData.reduce((sum, day) => sum + day.wakeups, 0) / weekData.length;
  const avgEfficiency = weekData.reduce((sum, day) => sum + day.efficiency, 0) / weekData.length;

  // Sleep duration chart data
  const sleepDurationData = {
    labels: weekData.map(d => d.date),
    datasets: [
      {
        label: 'Sleep Duration (hours)',
        data: weekData.map(d => d.sleepDuration),
        backgroundColor: 'rgba(147, 51, 234, 0.5)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 2,
        borderRadius: 5,
      }
    ]
  };

  // Sleep stages chart data
  const sleepStagesData = {
    labels: weekData.map(d => d.date),
    datasets: [
      {
        label: 'Deep Sleep',
        data: weekData.map(d => d.deepSleepPercentage),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
      {
        label: 'REM Sleep',
        data: weekData.map(d => d.remSleepPercentage),
        backgroundColor: 'rgba(147, 51, 234, 0.7)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 1,
      },
      {
        label: 'Light Sleep',
        data: weekData.map(d => d.lightSleepPercentage),
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      }
    ]
  };

  // Sleep score chart data
  const sleepScoreData = {
    labels: weekData.map(d => d.date),
    datasets: [
      {
        label: 'Sleep Score',
        data: weekData.map(d => d.sleepScore),
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  // Chart options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const stackedBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        stacked: true,
        beginAtZero: true,
        max: 100,
        grid: {
          display: true,
          drawBorder: false,
        },
      },
      x: {
        stacked: true,
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
    },
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: false,
        min: 50,
        max: 100,
        grid: {
          display: true,
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // Find the best day
  const bestDaySleep = [...weekData].sort((a, b) => b.sleepScore - a.sleepScore)[0];

  // Trend metrics (simplified)
  const sleepDurationTrend = weekData[6].sleepDuration - weekData[0].sleepDuration;
  const sleepScoreTrend = weekData[6].sleepScore - weekData[0].sleepScore;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Key metrics cards */}
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg. Sleep Duration</p>
                <p className="text-2xl font-bold">{formatValue(avgSleepDuration, 1)}h</p>
              </div>
              <Clock className="h-9 w-9 text-primary/60" />
            </div>
            <div className="flex items-center mt-2 text-xs">
              {sleepDurationTrend >= 0 ? (
                <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={sleepDurationTrend >= 0 ? "text-green-500" : "text-red-500"}>
                {formatValue(Math.abs(sleepDurationTrend), 1)}h
              </span>
              <span className="text-muted-foreground ml-1">vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg. Sleep Score</p>
                <p className="text-2xl font-bold">{formatValue(avgSleepScore, 0)}</p>
              </div>
              <Activity className="h-9 w-9 text-primary/60" />
            </div>
            <div className="flex items-center mt-2 text-xs">
              {sleepScoreTrend >= 0 ? (
                <ArrowUp className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={sleepScoreTrend >= 0 ? "text-green-500" : "text-red-500"}>
                {formatValue(Math.abs(sleepScoreTrend), 0)} pts
              </span>
              <span className="text-muted-foreground ml-1">vs last week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg. Deep Sleep</p>
                <p className="text-2xl font-bold">{formatPercentage(avgDeepSleep, 0)}</p>
              </div>
              <Moon className="h-9 w-9 text-primary/60" />
            </div>
            <div className="flex items-center mt-2 text-xs">
              <span className="text-muted-foreground">Target: 20-25%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Sleep Efficiency</p>
                <p className="text-2xl font-bold">{formatPercentage(avgEfficiency, 0)}</p>
              </div>
              <Zap className="h-9 w-9 text-primary/60" />
            </div>
            <div className="flex items-center mt-2 text-xs">
              <span className="text-muted-foreground">Target: &gt;90%</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sleep Duration Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Weekly Sleep Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <Bar data={sleepDurationData} options={barOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Sleep Score Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Weekly Sleep Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px]">
              <Line data={sleepScoreData} options={lineOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sleep Stages Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Sleep Stage Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[260px]">
            <Bar data={sleepStagesData} options={stackedBarOptions} />
          </div>
        </CardContent>
      </Card>

      {/* Sleep Insights */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Sleep Insights</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <Moon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">Your best night</h4>
              <p className="text-sm text-muted-foreground">
                {bestDaySleep.date} - {formatValue(bestDaySleep.sleepDuration, 1)} hours with a sleep score of {bestDaySleep.sleepScore}
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">Fall Asleep Time</h4>
              <p className="text-sm text-muted-foreground">
                It takes you an average of {formatValue(avgSleepOnset, 0)} minutes to fall asleep
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-primary/10 p-2 rounded-full">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h4 className="font-medium">Sleep Continuity</h4>
              <p className="text-sm text-muted-foreground">
                You wake up {formatValue(avgWakeups, 1)} times per night on average
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button className="w-full sm:w-auto">View Detailed Sleep Analysis</Button>
      </div>
    </div>
  );
};
