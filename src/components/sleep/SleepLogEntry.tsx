
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Moon, Clock, Calendar } from 'lucide-react';

export interface SleepLogEntryProps {
  sleepData: {
    date?: string;
    bedTime?: string;
    wakeTime?: string;
    duration?: number;
    quality?: number;
    notes?: string;
  };
  onEdit?: () => void;
}

const SleepLogEntry: React.FC<SleepLogEntryProps> = ({ sleepData, onEdit }) => {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };
  
  const formatTime = (timeString?: string) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Moon className="h-4 w-4 text-primary" />
          Sleep Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Date</div>
                <div className="font-medium">{formatDate(sleepData.date)}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Duration</div>
                <div className="font-medium">
                  {sleepData.duration ? formatDuration(sleepData.duration) : 'N/A'}
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Bed Time</div>
              <div className="font-medium">{formatTime(sleepData.bedTime)}</div>
            </div>
            
            <div>
              <div className="text-sm text-muted-foreground">Wake Time</div>
              <div className="font-medium">{formatTime(sleepData.wakeTime)}</div>
            </div>
          </div>
          
          {sleepData.quality && (
            <div>
              <div className="text-sm text-muted-foreground">Sleep Quality</div>
              <div className="flex items-center mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Moon 
                    key={i}
                    className={`h-5 w-5 ${i < sleepData.quality! ? 'text-primary' : 'text-muted-foreground opacity-30'}`}
                  />
                ))}
              </div>
            </div>
          )}
          
          {sleepData.notes && (
            <div>
              <div className="text-sm text-muted-foreground">Notes</div>
              <div className="text-sm mt-1 p-2 bg-muted rounded">
                {sleepData.notes}
              </div>
            </div>
          )}
          
          {onEdit && (
            <Button onClick={onEdit} variant="outline" size="sm" className="w-full mt-2">
              Edit Log
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SleepLogEntry;
