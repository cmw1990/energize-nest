import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
  className?: string;
  disabledDates?: Date[];
  minDate?: Date;
  maxDate?: Date;
}

export function Calendar({
  value,
  onChange,
  className,
  disabledDates = [],
  minDate,
  maxDate,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  
  // Get the first day of the month
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  
  // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = firstDayOfMonth.getDay();
  
  // Get the number of days in the month
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  
  // Get the days of the previous month that appear in the first week
  const daysFromPrevMonth = firstDayOfWeek;
  
  // Get the days of the next month that appear in the last week
  const daysInLastRow = Math.ceil((daysInMonth + daysFromPrevMonth) / 7) * 7 - (daysInMonth + daysFromPrevMonth);
  
  // Get the previous month's days that appear in the calendar
  const prevMonthDays = Array.from({ length: daysFromPrevMonth }, (_, i) => {
    const day = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0 - (daysFromPrevMonth - i - 1));
    return day;
  });
  
  // Get the current month's days
  const currentMonthDays = Array.from({ length: daysInMonth }, (_, i) => {
    const day = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1);
    return day;
  });
  
  // Get the next month's days that appear in the calendar
  const nextMonthDays = Array.from({ length: daysInLastRow }, (_, i) => {
    const day = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i + 1);
    return day;
  });
  
  // Combine all days
  const allDays = [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  
  // Group days into weeks
  const weeks = [];
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7));
  }
  
  // Check if a date is the selected date
  const isSelectedDate = (date: Date) => {
    return value && date.toDateString() === value.toDateString();
  };
  
  // Check if a date is in the current month
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };
  
  // Check if a date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };
  
  // Check if a date is disabled
  const isDisabled = (date: Date) => {
    // Check if the date is in the disabledDates array
    const isInDisabledDates = disabledDates.some(
      (disabledDate) => disabledDate.toDateString() === date.toDateString()
    );
    
    // Check if the date is before minDate
    const isBeforeMinDate = minDate && date < minDate;
    
    // Check if the date is after maxDate
    const isAfterMaxDate = maxDate && date > maxDate;
    
    return isInDisabledDates || isBeforeMinDate || isAfterMaxDate;
  };
  
  // Handle date selection
  const handleDateClick = (date: Date) => {
    if (isDisabled(date)) return;
    onChange?.(date);
  };
  
  // Navigate to the previous month
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  // Navigate to the next month
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  // Format the month and year for display
  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };
  
  return (
    <div className={cn('p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700', className)}>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <div className="font-medium">{formatMonthYear(currentMonth)}</div>
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Next month"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, index) => (
          <div key={index} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {weeks.flat().map((date, index) => (
          <button
            key={index}
            onClick={() => handleDateClick(date)}
            disabled={isDisabled(date)}
            className={cn(
              'h-8 w-8 rounded-md flex items-center justify-center text-sm',
              isCurrentMonth(date) ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-gray-500',
              isToday(date) && 'border border-blue-500',
              isSelectedDate(date) && 'bg-blue-500 text-white',
              !isSelectedDate(date) && 'hover:bg-gray-100 dark:hover:bg-gray-700',
              isDisabled(date) && 'opacity-50 cursor-not-allowed'
            )}
          >
            {date.getDate()}
          </button>
        ))}
      </div>
    </div>
  );
} 