
import * as React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface MetricCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  value?: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string | number;
  isLoading?: boolean;
}

export const MetricCard = React.forwardRef<
  HTMLDivElement,
  MetricCardProps
>(({ className, title, value, description, icon, trend, trendValue, isLoading, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn("overflow-hidden p-4 sm:p-6 h-full flex flex-col", className)}
    {...props}
  >
    {isLoading ? (
      <div className="space-y-2 w-full">
        <div className="h-4 w-1/3 animate-pulse rounded bg-muted"></div>
        <div className="h-8 w-1/2 animate-pulse rounded bg-muted"></div>
        <div className="h-3 w-2/3 animate-pulse rounded bg-muted"></div>
      </div>
    ) : (
      <>
        {(title || icon) && (
          <div className="flex items-center justify-between mb-2">
            {title && <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>}
            {icon && <div className="text-muted-foreground">{icon}</div>}
          </div>
        )}
        {value !== undefined && (
          <div className="text-xl sm:text-2xl font-bold">{value}</div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{description}</p>
        )}
        {trend && trendValue && (
          <div className={cn(
            "flex items-center mt-auto pt-2 text-xs", 
            trend === 'up' ? "text-green-500" : trend === 'down' ? "text-red-500" : "text-muted-foreground"
          )}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </div>
        )}
      </>
    )}
  </Card>
));

MetricCard.displayName = "MetricCard";
