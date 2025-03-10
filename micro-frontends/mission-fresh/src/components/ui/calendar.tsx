import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CalendarProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: Date;
  onSelect?: (date: Date) => void;
  disabled?: boolean;
}

export const Calendar = React.forwardRef<HTMLDivElement, CalendarProps>(
  ({ className, value = new Date(), onSelect, disabled = false, ...props }, ref) => {
    // State for current month and year
    const [month, setMonth] = React.useState(value?.getMonth() || new Date().getMonth());
    const [year, setYear] = React.useState(value?.getFullYear() || new Date().getFullYear());
    
    // Update month/year when value changes
    React.useEffect(() => {
      if (value) {
        setMonth(value.getMonth());
        setYear(value.getFullYear());
      }
    }, [value]);
    
    // Helper functions for calendar rendering
    const getDaysInMonth = (month: number, year: number) => {
      return new Date(year, month + 1, 0).getDate();
    };
    
    const getFirstDayOfMonth = (month: number, year: number) => {
      return new Date(year, month, 1).getDay();
    };
    
    const isCurrentDate = (day: number) => {
      const today = new Date();
      return day === today.getDate() && 
             month === today.getMonth() && 
             year === today.getFullYear();
    };
    
    const isSelectedDate = (day: number) => {
      return value?.getDate() === day && 
             value?.getMonth() === month && 
             value?.getFullYear() === year;
    };
    
    // Render calendar days
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
        const isSelected = isSelectedDate(i);
        const isCurrent = isCurrentDate(i);
        
        days.push(
          <button
            key={i}
            type="button"
            disabled={disabled}
            className={cn(
              "w-9 h-9 rounded-md flex items-center justify-center text-sm",
              isSelected ? "bg-primary text-primary-foreground font-semibold" : 
                         isCurrent ? "border border-primary text-primary font-semibold" : 
                                   "hover:bg-accent",
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
    
    // Navigation to previous month
    const goToPreviousMonth = () => {
      if (month === 0) {
        setMonth(11);
        setYear(year - 1);
      } else {
        setMonth(month - 1);
      }
    };
    
    // Navigation to next month
    const goToNextMonth = () => {
      if (month === 11) {
        setMonth(0);
        setYear(year + 1);
      } else {
        setMonth(month + 1);
      }
    };
    
    // Array of month names
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    // Day names for header
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    
    return (
      <div
        ref={ref}
        className={cn("p-3 space-y-4 bg-white dark:bg-gray-800 rounded-md shadow-sm", className)}
        {...props}
      >
        {/* Calendar header with navigation */}
        <div className="flex justify-between items-center">
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={goToPreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="font-semibold text-sm">
            {months[month]} {year}
          </div>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={goToNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        
        {/* Day names header */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {dayNames.map((day) => (
            <div key={day} className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>
      </div>
    );
  }
); 