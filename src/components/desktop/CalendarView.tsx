
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, CalendarDays, Plus, Clock } from 'lucide-react';

export const CalendarView = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [month, setMonth] = useState<Date>(new Date());
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', time: '' });
  
  const dummyEvents = [
    { id: 1, date: new Date(), title: 'Morning energy ritual', time: '7:30 AM' },
    { id: 2, date: new Date(), title: 'Focus work session', time: '10:00 AM' },
    { id: 3, date: new Date(), title: 'Meditation break', time: '2:00 PM' },
    { id: 4, date: new Date(new Date().setDate(new Date().getDate() + 1)), title: 'Team meeting', time: '9:00 AM' },
  ];
  
  const eventsForSelectedDate = dummyEvents.filter(
    event => date && event.date.toDateString() === date.toDateString()
  );
  
  const handleAddEvent = () => {
    // In a real app, would add the event to the database
    setIsEventDialogOpen(false);
    setNewEvent({ title: '', time: '' });
  };
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          Calendar
        </CardTitle>
        <div className="flex gap-1">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            month={month}
            onMonthChange={setMonth}
            className="rounded-md border"
          />
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Events for {date?.toLocaleDateString()}</h3>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-8 gap-1"
                onClick={() => setIsEventDialogOpen(true)}
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </Button>
            </div>
            
            {eventsForSelectedDate.length > 0 ? (
              <div className="space-y-2">
                {eventsForSelectedDate.map(event => (
                  <div 
                    key={event.id} 
                    className="p-2 rounded-md border flex items-center"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-3">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{event.title}</p>
                      <p className="text-xs text-muted-foreground">{event.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No events scheduled for this day
              </p>
            )}
          </div>
        </div>
      </CardContent>
      
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Create a new event for {date?.toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Event Title</label>
              <Input 
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                placeholder="Enter event title"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time</label>
              <Input 
                value={newEvent.time}
                onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                placeholder="e.g. 3:00 PM"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddEvent}>Add Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
