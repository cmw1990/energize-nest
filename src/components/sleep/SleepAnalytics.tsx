
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from "@/lib/utils";

export interface SleepInsight {
  id?: string;
  type: 'success' | 'warning' | 'info' | 'error';
  text: string;
  icon?: React.ReactNode;
}

interface SleepAnalyticsProps {
  insights: SleepInsight[];
}

const SleepAnalytics: React.FC<SleepAnalyticsProps> = ({ insights }) => {
  // Default icons based on insight type
  const getIcon = (type: string, providedIcon?: React.ReactNode) => {
    if (providedIcon) return providedIcon;
    
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4" />;
      case 'error':
        return <AlertCircle className="h-4 w-4" />;
      case 'info':
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  // Get variant based on insight type
  const getVariant = (type: string) => {
    switch (type) {
      case 'success':
        return 'success';
      case 'warning':
        return 'warning';
      case 'error':
        return 'destructive';
      case 'info':
      default:
        return 'default';
    }
  };

  return (
    <Card className="border border-primary/10">
      <CardContent className="pt-6 space-y-3">
        {insights.map((insight, index) => (
          <Alert
            key={insight.id || index}
            variant={getVariant(insight.type) as any}
            className={cn(
              "mb-2",
              insight.type === 'success' && "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900/30",
              insight.type === 'warning' && "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-900/30",
              insight.type === 'error' && "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-900/30",
              insight.type === 'info' && "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-900/30"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex-shrink-0",
                insight.type === 'success' && "text-green-600 dark:text-green-400",
                insight.type === 'warning' && "text-yellow-600 dark:text-yellow-400",
                insight.type === 'error' && "text-red-600 dark:text-red-400",
                insight.type === 'info' && "text-blue-600 dark:text-blue-400"
              )}>
                {getIcon(insight.type, insight.icon)}
              </div>
              <AlertDescription className="text-sm">
                {insight.text}
              </AlertDescription>
            </div>
          </Alert>
        ))}
        
        {insights.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <Info className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p>No sleep insights available yet. Start tracking your sleep for personalized analytics.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SleepAnalytics;
