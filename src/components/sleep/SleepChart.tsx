
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from 'recharts';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';
import { BarChart2, LineChart as LineChartIcon } from 'lucide-react';

interface SleepLog {
  id: string;
  date: string;
  sleep_quality: number;
  duration_minutes: number;
  bedtime: string;
  wake_time: string;
  [key: string]: any;
}

interface SleepChartProps {
  data: SleepLog[];
}

const minutesToHours = (minutes: number) => {
  return (minutes / 60).toFixed(1);
};

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const dateStr = payload[0]?.payload?.date;
    const date = dateStr ? format(parseISO(dateStr), 'MMM d, yyyy') : '';
    
    return (
      <div className="bg-background border border-border p-3 rounded-lg shadow-sm">
        <p className="font-medium mb-1">{date}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.name === 'Duration' 
              ? `${minutesToHours(entry.value as number)}h` 
              : entry.value}
            {entry.name === 'Quality' ? '/5' : ''}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

export function SleepChart({ data }: SleepChartProps) {
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  const formattedData = data.map(log => ({
    ...log,
    formattedDate: format(parseISO(log.date), 'MM/dd'),
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="h-full">
      <div className="flex justify-end mb-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
          className="h-8 w-8"
        >
          {chartType === 'line' ? (
            <BarChart2 className="h-4 w-4" />
          ) : (
            <LineChartIcon className="h-4 w-4" />
          )}
        </Button>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        {chartType === 'line' ? (
          <LineChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="formattedDate" 
              tick={{ fontSize: 12 }}
              tickMargin={5}
            />
            <YAxis 
              yAxisId="left"
              domain={[0, 600]} 
              label={{ 
                value: 'Duration (min)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: 12, fill: '#888' },
              }}
              tick={{ fontSize: 12 }}
              tickFormatter={(val) => minutesToHours(val)}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              domain={[1, 5]}
              label={{ 
                value: 'Quality', 
                angle: 90, 
                position: 'insideRight',
                style: { textAnchor: 'middle', fontSize: 12, fill: '#888' },
              }}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="duration_minutes" 
              name="Duration"
              stroke="#8884d8" 
              activeDot={{ r: 6 }} 
              strokeWidth={2}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="sleep_quality" 
              name="Quality"
              stroke="#82ca9d" 
              activeDot={{ r: 6 }} 
              strokeWidth={2}
            />
          </LineChart>
        ) : (
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis 
              dataKey="formattedDate" 
              tick={{ fontSize: 12 }}
              tickMargin={5}
            />
            <YAxis 
              yAxisId="left"
              domain={[0, 600]} 
              tick={{ fontSize: 12 }}
              tickFormatter={(val) => minutesToHours(val)}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              domain={[1, 5]}
              tick={{ fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              yAxisId="left"
              dataKey="duration_minutes" 
              name="Duration"
              fill="#8884d8" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              yAxisId="right"
              dataKey="sleep_quality" 
              name="Quality"
              fill="#82ca9d" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
