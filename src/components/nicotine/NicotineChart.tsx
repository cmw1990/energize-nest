
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Button } from "@/components/ui/button";
import { ChartType } from "lucide-react";

interface NicotineChartProps {
  data: {
    date: string;
    amount: number;
    energy: number;
    mood: number;
  }[];
  isLoading: boolean;
}

export function NicotineChart({ data, isLoading }: NicotineChartProps) {
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [activeSeries, setActiveSeries] = useState<"all" | "amount" | "impact">("all");

  if (isLoading) {
    return <div className="h-full flex items-center justify-center">Loading chart data...</div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <p className="text-muted-foreground">Not enough data to display chart.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Log your nicotine intake regularly to see usage trends.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <Button
            variant={activeSeries === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveSeries("all")}
          >
            All
          </Button>
          <Button
            variant={activeSeries === "amount" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveSeries("amount")}
          >
            Usage
          </Button>
          <Button
            variant={activeSeries === "impact" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveSeries("impact")}
          >
            Impact
          </Button>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setChartType(chartType === "line" ? "bar" : "line")}
        >
          <ChartType className="h-4 w-4" />
        </Button>
      </div>

      <ResponsiveContainer width="100%" height="85%">
        {chartType === "line" ? (
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" orientation="left" domain={[0, 'auto']} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 10]} />
            <Tooltip />
            <Legend />
            
            {(activeSeries === "all" || activeSeries === "amount") && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="amount"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                name="Nicotine Amount"
              />
            )}
            
            {(activeSeries === "all" || activeSeries === "impact") && (
              <>
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="energy"
                  stroke="#82ca9d"
                  name="Energy Impact"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="mood"
                  stroke="#ffc658"
                  name="Mood Impact"
                />
              </>
            )}
          </LineChart>
        ) : (
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" orientation="left" domain={[0, 'auto']} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 10]} />
            <Tooltip />
            <Legend />
            
            {(activeSeries === "all" || activeSeries === "amount") && (
              <Bar
                yAxisId="left"
                dataKey="amount"
                fill="#8884d8"
                name="Nicotine Amount"
              />
            )}
            
            {(activeSeries === "all" || activeSeries === "impact") && (
              <>
                <Bar
                  yAxisId="right"
                  dataKey="energy"
                  fill="#82ca9d"
                  name="Energy Impact"
                />
                <Bar
                  yAxisId="right"
                  dataKey="mood"
                  fill="#ffc658"
                  name="Mood Impact"
                />
              </>
            )}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
