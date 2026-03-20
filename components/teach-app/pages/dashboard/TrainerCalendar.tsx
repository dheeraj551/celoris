import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, MapPin, MoreHorizontal, User, LayoutGrid, List } from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  isToday
} from 'date-fns';

export function TrainerCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Dummy events for demonstration
  const [events] = useState([
    { id: 1, title: '1:1 Excel Mentoring', date: new Date(), time: '10:00 AM', type: 'session' },
    { id: 2, title: 'Demo Class: AI Tools', date: addDays(new Date(), 2), time: '02:30 PM', type: 'demo' },
    { id: 3, title: 'Python Workshop', date: addDays(new Date(), -1), time: '11:00 AM', type: 'workshop' },
    { id: 4, title: 'Student Onboarding', date: addDays(new Date(), 5), time: '04:00 PM', type: 'meeting' },
  ]);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.date, day));
  };

  const getEventStyle = (type: string) => {
    switch (type) {
      case 'session': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'demo': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'workshop': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-purple-100 text-purple-700 border-purple-200';
    }
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            <button 
              onClick={prevMonth}
              className="p-1.5 hover:bg-gray-50 rounded-md transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button 
              onClick={goToToday}
              className="px-3 py-1.5 text-sm font-medium hover:bg-gray-50 rounded-md border-x border-gray-100"
            >
              Today
            </button>
            <button 
              onClick={nextMonth}
              className="p-1.5 hover:bg-gray-50 rounded-md transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <span className="text-xl font-semibold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-lg p-1 flex shadow-sm">
            <button className="px-3 py-1.5 text-xs font-bold bg-emerald-50 text-emerald-700 rounded-md flex items-center gap-1.5">
              <LayoutGrid className="h-3.5 w-3.5" /> Month
            </button>
            <button className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 rounded-md flex items-center gap-1.5 transition-colors">
              <List className="h-3.5 w-3.5" /> List
            </button>
          </div>
          <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2 transition-all shadow-md shadow-emerald-200">
            <Plus className="h-4 w-4" /> Create Event
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col">
        {/* Days of week header */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="py-4 text-center text-sm font-bold text-gray-500 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 flex-1 border-l border-t border-gray-100">
          {calendarDays.map((day, idx) => {
            const dayEvents = getEventsForDay(day);
            const isTodayDay = isToday(day);
            const isCurrentMonth = isSameMonth(day, monthStart);
            
            return (
              <div 
                key={idx}
                className={`min-h-[140px] p-2 border-r border-b border-gray-100 relative group transition-colors ${!isCurrentMonth ? 'bg-gray-50/50' : 'bg-white hover:bg-emerald-50/20'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`inline-flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full transition-all ${
                    isTodayDay 
                      ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
                      : isCurrentMonth ? 'text-gray-700' : 'text-gray-300'
                  }`}>
                    {format(day, 'd')}
                  </span>
                </div>

                <div className="space-y-1">
                  {dayEvents.map(event => (
                    <div 
                      key={event.id}
                      className={`px-2 py-1.5 text-[11px] font-bold rounded-lg border-l-4 truncate cursor-pointer shadow-sm hover:brightness-95 transition-all ${getEventStyle(event.type)}`}
                      title={`${event.time} - ${event.title}`}
                    >
                      <div className="flex items-center gap-1">
                        <span className="opacity-70 whitespace-nowrap">{event.time}</span>
                        <span className="truncate">{event.title}</span>
                      </div>
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <button className="w-full text-center text-[10px] font-bold text-gray-400 hover:text-emerald-600 p-1">
                      + {dayEvents.length - 3} more
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
