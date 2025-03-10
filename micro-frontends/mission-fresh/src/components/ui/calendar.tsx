import React from 'react';
import { cn } from '../../lib/utils';

export interface CalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: Date;
  onSelect?: (date: Date) => void;
  disabled?: boolean;
}

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, value, onSelect, disabled = false, ...props }, ref) => {
    // Simple month/date picker implementation
    const [month, setMonth] = React.useState(value?.getMonth() || new Date().getMonth());
    const [year, setYear] = React.useState(value?.getFullYear() || new Date().getFullYear());
    
    const getDaysInMonth = (month: number, year: number) => {
      return new Date(year, month + 1, 0).getDate();
    };
    
    const getFirstDayOfMonth = (month: number, year: number) => {
      return new Date(year, month, 1).getDay();
    };
    
    const renderCalendarDays = () => {
      const daysInMonth = getDaysInMonth(month, year);
      const firstDay = getFirstDayOfMonth(month, year);
      const days = [];
      
      // Empty days for the start of the month
      for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="w-9 h-9"></div>);
      }
      
      // Actual days
      for (let i = 1; i <= daysInMonth; i++) {
        const isSelected = value?.getDate() === i && 
                          value?.getMonth() === month && 
                          value?.getFullYear() === year;
        
        days.push(
          <button
            key={i}
            type="button"
            disabled={disabled}
            className={cn(
              "w-9 h-9 rounded-md flex items-center justify-center",
              isSelected ? "bg-primary text-primary-foreground" : "hover:bg-accent",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => {
              if (!disabled && onSelect) {
                onSelect(new Date(year, month, i));
              }
            }}
          >
            {i}
          </button>
        );
      }
      
      return days;
    };
    
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return (
      <div
        ref={ref}
        className={cn("p-3 space-y-4", className)}
        {...props}
      >
        <div className="flex justify-between items-center">
          <button
            type="button"
            disabled={disabled}
            className="p-1 rounded-md hover:bg-accent"
            onClick={() => {
              if (month === 0) {
                setMonth(11);
                setYear(year - 1);
              } else {
                setMonth(month - 1);
              }
            }}
          >
            &lt;
          </button>
          <div>
            {months[month]} {year}
          </div>
          <button
            type="button"
            disabled={disabled}
            className="p-1 rounded-md hover:bg-accent"
            onClick={() => {
              if (month === 11) {
                setMonth(0);
                setYear(year + 1);
              } else {
                setMonth(month + 1);
              }
            }}
          >
            &gt;
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center">
          <div>Su</div>
          <div>Mo</div>
          <div>Tu</div>
          <div>We</div>
          <div>Th</div>
          <div>Fr</div>
          <div>Sa</div>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>
      </div>
    );
  }
); 