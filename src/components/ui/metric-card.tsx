
import * as React from "react";
import { Card, CardProps } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface MetricCardProps extends CardProps {}

export const MetricCard = React.forwardRef<
  HTMLDivElement,
  MetricCardProps
>(({ className, ...props }, ref) => (
  <Card
    ref={ref}
    className={cn("overflow-hidden", className)}
    {...props}
  />
));

MetricCard.displayName = "MetricCard";
