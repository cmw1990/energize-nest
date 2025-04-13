import React, { useState } from "react";
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
import { BarChart3, LineChart as LineChartIcon, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

interface CaffeineChartProps {
  data: {
    date: string;
    amount: number;
    energy: number;
  }[];
  isLoading: boolean;
}

export function CaffeineChart({ data, isLoading }: CaffeineChartProps) {
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [dataPoint, setDataPoint] = useState<"all" | "caffeine" | "energy">("all");

  if (isLoading) {
    return <div className="h-64 flex items-center justify-center">Loading chart data...</div>;
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center">
        <p className="text-muted-foreground">Not enough data to display chart.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Log your caffeine intake to see trends over time.
        </p>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM dd, yyyy');
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateStr;
    }
  };

  const getLabel = () => {
    if (dataPoint === "caffeine") return "mg";
    if (dataPoint === "energy") return "";
    return "mg";
  };

  return (
    <div className="h-[400px]">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <Select 
            value={dataPoint} 
            onValueChange={(value) => setDataPoint(value as "all" | "caffeine" | "energy")}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select data" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Data Points</SelectItem>
              <SelectItem value="caffeine">Caffeine Only</SelectItem>
              <SelectItem value="energy">Energy Impact</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={chartType === "line" ? "default" : "outline"}
            size="icon"
            onClick={() => setChartType("line")}
            title="Line Chart"
          >
            <LineChartIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={chartType === "bar" ? "default" : "outline"}
            size="icon"
            onClick={() => setChartType("bar")}
            title="Bar Chart"
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height="90%">
        {chartType === "line" ? (
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" orientation="left" />
            <YAxis yAxisId="right" orientation="right" domain={[0, 10]} />
            <Tooltip 
              content={
                <div className="p-2 bg-white border rounded shadow-md">
                  {data.length > 0 && data[0].date && (
                    <>
                      <p className="font-semibold">{formatDate(data[0]?.date)}</p>
                      {dataPoint === "all" || dataPoint === "caffeine" ? (
                        <p>Amount: {data[0]?.amount} {getLabel()}</p>
                      ) : null}
                      {dataPoint === "all" || dataPoint === "energy" ? (
                        <p>Energy: {data[0]?.energy}</p>
                      ) : null}
                    </>
                  )}
                </div>
              }
            />
            <Legend />
            {(dataPoint === "all" || dataPoint === "caffeine") && (
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="amount"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
                name="Caffeine (mg)"
              />
            )}
            {(dataPoint === "all" || dataPoint === "energy") && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="energy"
                stroke="#82ca9d"
                name="Energy Impact (1-10)"
              />
            )}
          </LineChart>
        ) : (
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" orientation="left" />
            <YAxis yAxisId="right" orientation="right" domain={[0, 10]} />
            <Tooltip 
              content={
                <div className="p-2 bg-white border rounded shadow-md">
                  {data.length > 0 && data[0].date && (
                    <>
                      <p className="font-semibold">{formatDate(data[0]?.date)}</p>
                      {dataPoint === "all" || dataPoint === "caffeine" ? (
                        <p>Amount: {data[0]?.amount} {getLabel()}</p>
                      ) : null}
                      {dataPoint === "all" || dataPoint === "energy" ? (
                        <p>Energy: {data[0]?.energy}</p>
                      ) : null}
                    </>
                  )}
                </div>
              }
            />
            <Legend />
            {(dataPoint === "all" || dataPoint === "caffeine") && (
              <Bar
                yAxisId="left"
                dataKey="amount"
                fill="#8884d8"
                name="Caffeine (mg)"
              />
            )}
            {(dataPoint === "all" || dataPoint === "energy") && (
              <Bar
                yAxisId="right"
                dataKey="energy"
                fill="#82ca9d"
                name="Energy Impact (1-10)"
              />
            )}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
