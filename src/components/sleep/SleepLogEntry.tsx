// Update the import to use a proper icon from lucide-react
import { 
  Moon as Sleep,
  Sun,
  Star,
  Waves,
  BedDouble,
  AlertTriangle,
  Clock,
} from "lucide-react";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface SleepLogEntryProps {
  sleepData: {
    sleep_duration: number;
    sleep_quality: number;
    deep_percentage: number;
    interruptions: number;
    notes: string;
    created_at: string;
  };
}

const SleepLogEntry: React.FC<SleepLogEntryProps> = ({ sleepData }) => {
  return (
    <Card className="border-primary/10 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Sleep Log</span>
          <Badge variant="secondary">
            {new Date(sleepData.created_at).toLocaleDateString()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Sleep className="h-4 w-4 flex-shrink-0" />
            <span>{sleepData.sleep_duration} hours</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 flex-shrink-0" />
            <span>Quality: {sleepData.sleep_quality}/10</span>
          </div>
          <div className="flex items-center gap-1">
            <Waves className="h-4 w-4 flex-shrink-0" />
            <span>Deep Sleep: {sleepData.deep_percentage}%</span>
          </div>
          <div className="flex items-center gap-1">
            <BedDouble className="h-4 w-4 flex-shrink-0" />
            <span>Interruptions: {sleepData.interruptions}</span>
          </div>
        </div>
        {sleepData.notes && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Notes</div>
            <ScrollArea className="h-24">
              <p className="text-sm">{sleepData.notes}</p>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SleepLogEntry;
