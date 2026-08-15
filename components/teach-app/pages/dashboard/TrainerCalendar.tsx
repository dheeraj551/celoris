import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, LayoutGrid, List, Loader2, Trash2, X } from 'lucide-react';
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
  isToday,
} from 'date-fns';
import { createClient } from '@/lib/supabase-client';
import { useAuth } from '@/components/providers/AuthProvider';

export function TrainerCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [newEvent, setNewEvent] = useState({ title: '', start_time: '', description: '', type: 'session' });
  const [saving, setSaving] = useState(false);

  const supabase = createClient();
  const { profile } = useAuth();

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error('Calendar fetch error:', err);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

  const getEventsForDay = (day: Date) =>
    events.filter((e) => {
      if (!e.event_date) return false;
      const eventDay = new Date(e.event_date);
      return isSameDay(eventDay, day);
    });

  const getEventStyle = (type: string) => {
    switch (type) {
      case 'session':  return 'bg-emerald-100 text-emerald-700 border-emerald-300';
      case 'demo':     return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'workshop': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'meeting':  return 'bg-purple-100 text-purple-700 border-purple-300';
      default:         return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const handleDayClick = (day: Date) => {
    setSelectedDate(day);
    setNewEvent({ title: '', start_time: '', description: '', type: 'session' });
    setShowCreateModal(true);
  };

  const handleCreateEvent = async () => {
    if (!newEvent.title.trim() || !selectedDate) return;
    try {
      setSaving(true);
      const { error } = await supabase.from('calendar_events').insert({
        title: newEvent.title,
        event_date: format(selectedDate, 'yyyy-MM-dd'),
        start_time: newEvent.start_time || null,
        description: newEvent.description || null,
        type: newEvent.type,
        user_id: profile?.id,
      });
      if (error) throw error;
      setShowCreateModal(false);
      fetchEvents();
    } catch (err) {
      console.error('Error creating event:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await supabase.from('calendar_events').delete().eq('id', id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  return (
    <div className="p-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            <button onClick={prevMonth} className="p-1.5 hover:bg-gray-50 rounded-md transition-colors">
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button onClick={goToToday} className="px-3 py-1.5 text-sm font-medium hover:bg-gray-50 rounded-md border-x border-gray-100">
              Today
            </button>
            <button onClick={nextMonth} className="p-1.5 hover:bg-gray-50 rounded-md transition-colors">
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <span className="text-xl font-semibold text-gray-900">{format(currentDate, 'MMMM yyyy')}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setSelectedDate(new Date()); setShowCreateModal(true); }}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-2 transition-all shadow-md shadow-emerald-200"
          >
            <Plus className="h-4 w-4" /> Create Event
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center gap-3 text-gray-400">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <span className="font-medium">Loading calendar...</span>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex-1 flex flex-col">
          {/* Days header */}
          <div className="grid grid-cols-7 border-b border-gray-200">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
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
                  onClick={() => handleDayClick(day)}
                  className={`min-h-[120px] p-2 border-r border-b border-gray-100 relative group cursor-pointer transition-colors ${
                    !isCurrentMonth ? 'bg-gray-50/50' : 'bg-white hover:bg-emerald-50/30'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 text-sm font-bold rounded-full transition-all ${
                        isTodayDay
                          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                          : isCurrentMonth
                          ? 'text-gray-700'
                          : 'text-gray-300'
                      }`}
                    >
                      {format(day, 'd')}
                    </span>
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className={`px-2 py-1 text-[11px] font-bold rounded-lg border-l-4 truncate shadow-sm group/event ${getEventStyle(event.type)}`}
                        title={`${event.start_time || ''} ${event.title}`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="truncate">
                            {event.start_time && (
                              <span className="opacity-60 mr-1">{event.start_time?.slice(0, 5)}</span>
                            )}
                            {event.title}
                          </span>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.id); }}
                            className="opacity-0 group-hover/event:opacity-100 shrink-0 hover:text-red-600 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-[10px] font-bold text-gray-400 px-1">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-gray-900">
                New Event — {selectedDate ? format(selectedDate, 'MMM d, yyyy') : ''}
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Title *</label>
                <input
                  type="text"
                  placeholder="e.g. 1:1 Excel Mentoring"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent((p) => ({ ...p, title: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Time</label>
                <input
                  type="time"
                  value={newEvent.start_time}
                  onChange={(e) => setNewEvent((p) => ({ ...p, start_time: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Type</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent((p) => ({ ...p, type: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm bg-white"
                >
                  <option value="session">Session</option>
                  <option value="demo">Demo</option>
                  <option value="workshop">Workshop</option>
                  <option value="meeting">Meeting</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">Notes</label>
                <textarea
                  placeholder="Add any notes or description..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent((p) => ({ ...p, description: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 text-sm resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEvent}
                disabled={saving || !newEvent.title.trim()}
                className="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700 disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Save Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
