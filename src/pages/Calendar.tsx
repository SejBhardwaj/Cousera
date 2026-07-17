import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, Bell, TrendingUp, Award, BookOpen, Plus, X, Check } from 'lucide-react';
import { useReminder } from '../contexts/ReminderContext';
import { CourseReminder } from '../utils/reminderStorage';

type CalendarEvent = {
  id: string;
  title: string;
  date: Date;
  time: string;
  type: 'assignment' | 'lesson' | 'exam' | 'reminder' | 'live-session';
  course: string;
  color: string;
};

type ReminderFormData = {
  title: string;
  date: string;
  time: string;
  course: string;
  type: CalendarEvent['type'];
};

const EVENTS: CalendarEvent[] = [
  {
    id: '1',
    title: 'ML Week 3 Assignment Due',
    date: new Date(2026, 6, 18),
    time: '11:59 PM',
    type: 'assignment',
    course: 'Machine Learning',
    color: '#FF6D70',
  },
  {
    id: '2',
    title: 'Live Session: Neural Networks',
    date: new Date(2026, 6, 16),
    time: '3:00 PM',
    type: 'live-session',
    course: 'Deep Learning',
    color: '#A98BFF',
  },
  {
    id: '3',
    title: 'Study Group Meeting',
    date: new Date(2026, 6, 17),
    time: '7:00 PM',
    type: 'reminder',
    course: 'ML Study Group',
    color: '#83D6FF',
  },
  {
    id: '4',
    title: 'React Lesson: Hooks',
    date: new Date(2026, 6, 16),
    time: '10:00 AM',
    type: 'lesson',
    course: 'React Development',
    color: '#D7FF54',
  },
  {
    id: '5',
    title: 'Midterm Exam',
    date: new Date(2026, 6, 22),
    time: '2:00 PM',
    type: 'exam',
    course: 'Data Science',
    color: '#FFB259',
  },
  {
    id: '6',
    title: 'Project Presentation',
    date: new Date(2026, 6, 25),
    time: '4:00 PM',
    type: 'assignment',
    course: 'UX Design',
    color: '#7DEBA3',
  },
];

export default function Calendar() {
  const { reminders, setReminder } = useReminder();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 16)); // July 16, 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 6, 16));
  const [events, setEvents] = useState<CalendarEvent[]>(EVENTS);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminderForm, setReminderForm] = useState<ReminderFormData>({
    title: '',
    date: '',
    time: '',
    course: '',
    type: 'reminder',
  });

  // Convert course reminders to calendar events
  useEffect(() => {
    // Only include reminders that haven't been notified yet and are in the future
    const courseReminderEvents: CalendarEvent[] = reminders
      .filter((reminder) => !reminder.notified && new Date(reminder.reminderTime) > today)
      .map((reminder) => ({
        id: reminder.id,
        title: `Study: ${reminder.courseName}`,
        date: new Date(reminder.reminderTime),
        time: new Date(reminder.reminderTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        type: 'reminder' as const,
        course: reminder.courseName,
        color: '#A98BFF',
      }));

    // Merge static events with active course reminders only
    setEvents([...EVENTS, ...courseReminderEvents]);
  }, [reminders]);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => isSameDay(event.date, date));
  };

  const hasEvent = (date: Date) => {
    return events.some((event) => isSameDay(event.date, date));
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const today = new Date(2026, 6, 16);

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
  }

  const selectedEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  // Stats calculations
  const upcomingEvents = events.filter((e) => e.date >= today).length;
  const thisWeekEvents = events.filter((e) => {
    const diff = Math.floor((e.date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 7;
  }).length;
  const assignments = events.filter((e) => e.type === 'assignment').length;

  // Learning activity for the week (sample data)
  const weeklyActivity = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 4.2 },
    { day: 'Wed', hours: 1.3 },
    { day: 'Thu', hours: 5.1 },
    { day: 'Fri', hours: 3.0 },
    { day: 'Sat', hours: 4.8 },
    { day: 'Sun', hours: 1.8 },
  ];

  const maxHours = Math.max(...weeklyActivity.map((d) => d.hours));

  const handleCreateReminder = () => {
    if (!reminderForm.title || !reminderForm.date || !reminderForm.time) {
      alert('Please fill in all required fields');
      return;
    }

    const [year, month, day] = reminderForm.date.split('-').map(Number);
    const [hours, minutes] = reminderForm.time.split(':').map(Number);
    
    // Create Date object with the exact date and time
    const reminderDateTime = new Date(year, month - 1, day, hours, minutes, 0);
    
    // Create a CourseReminder object for the reminder system
    const courseReminder: CourseReminder = {
      id: `reminder-${Date.now()}`,
      courseId: reminderForm.course || 'general',
      courseName: reminderForm.course || reminderForm.title,
      reminderTime: reminderDateTime.getTime(),
      createdAt: Date.now(),
      notified: false,
    };

    // Save to the reminder system (will trigger notifications)
    const success = setReminder(courseReminder);
    
    if (success) {
      console.log('✅ Reminder created successfully:', courseReminder);
      
      // Also add to local calendar events for immediate display
      const newEvent: CalendarEvent = {
        id: courseReminder.id,
        title: reminderForm.title,
        date: reminderDateTime,
        time: reminderDateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        type: reminderForm.type,
        course: reminderForm.course || 'Personal',
        color: reminderForm.type === 'reminder' ? '#A98BFF' : '#D7FF54',
      };

      setEvents([...events, newEvent]);
      setShowReminderModal(false);
      setReminderForm({
        title: '',
        date: '',
        time: '',
        course: '',
        type: 'reminder',
      });
      
      alert(`✅ Reminder set for ${reminderDateTime.toLocaleString()}. You'll be notified at that time!`);
    } else {
      alert('❌ Failed to create reminder. Please try again.');
    }
  };

  return (
    <div className="flex-1 py-4 px-4 md:pr-4 md:pl-2 overflow-y-auto no-scrollbar space-y-5 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-section text-text mb-1">Learning Calendar</h1>
          <p className="text-sm text-muted">Track your courses, assignments, and study sessions</p>
        </div>
        <button
          onClick={() => setShowReminderModal(true)}
          className="px-4 py-3 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all hover:opacity-90"
          style={{ background: '#D7FF54', color: '#111' }}
        >
          <Plus size={16} />
          Add Reminder
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          {
            label: 'Study Hours (This Week)',
            value: '20.0h',
            change: '+12.4%',
            trend: 'up',
            icon: <Clock size={18} color="#A98BFF" />,
            bg: '#EDE9FF',
          },
          {
            label: 'Upcoming Events',
            value: upcomingEvents.toString(),
            change: '+3.1%',
            trend: 'up',
            icon: <CalendarIcon size={18} color="#83D6FF" />,
            bg: '#E0F5FF',
          },
          {
            label: 'This Week',
            value: thisWeekEvents.toString(),
            change: thisWeekEvents > 3 ? '+8.7%' : '-0.4%',
            trend: thisWeekEvents > 3 ? 'up' : 'down',
            icon: <Bell size={18} color="#FFB259" />,
            bg: '#FFF7ED',
          },
          {
            label: 'Assignments Due',
            value: assignments.toString(),
            change: '+5.2%',
            trend: 'up',
            icon: <Award size={18} color="#7DEBA3" />,
            bg: '#ECFDF5',
          },
        ].map((stat) => (
          <div key={stat.label} className="card-static p-5 rounded-3xl">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: stat.bg }}>
                {stat.icon}
              </div>
              <span
                className={`text-xs font-bold flex items-center gap-1 ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
              </span>
            </div>
            <p className="font-black text-2xl text-text mb-1">{stat.value}</p>
            <p className="text-xs text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Weekly Activity Chart */}
        <div className="card-static p-6 rounded-4xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-text mb-1">Learning Activity</h3>
              <p className="text-xs text-muted">Daily study hours, last 7 days</p>
            </div>
            <span className="text-sm font-bold flex items-center gap-1" style={{ color: '#7DEBA3' }}>
              <TrendingUp size={14} />
              +15.6%
            </span>
          </div>
          <div className="flex items-end justify-between gap-3" style={{ height: '192px' }}>
            {weeklyActivity.map((day) => {
              const heightPercentage = (day.hours / maxHours) * 100;
              
              return (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end" style={{ height: '160px' }}>
                    <div
                      className="w-full rounded-t-xl transition-all hover:opacity-80 cursor-pointer relative group"
                      style={{
                        height: `${heightPercentage}%`,
                        background: 'linear-gradient(180deg, #A98BFF 0%, #D7FF54 100%)',
                      }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-text text-white px-2 py-1 rounded-lg text-xs font-bold whitespace-nowrap z-10">
                        {day.hours}h
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-muted">{day.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Event Types Chart */}
        <div className="card-static p-6 rounded-4xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-text mb-1">Event Distribution</h3>
              <p className="text-xs text-muted">Events by type, this month</p>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { type: 'Assignments', count: 4, color: '#FF6D70', percentage: 40 },
              { type: 'Lessons', count: 3, color: '#D7FF54', percentage: 30 },
              { type: 'Live Sessions', count: 2, color: '#A98BFF', percentage: 20 },
              { type: 'Reminders', count: 1, color: '#83D6FF', percentage: 10 },
            ].map((item) => (
              <div key={item.type}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                    <span className="text-sm font-semibold text-text">{item.type}</span>
                  </div>
                  <span className="text-sm font-bold text-text">{item.count}</span>
                </div>
                <div className="h-2 bg-bg rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percentage}%`, background: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar and Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Calendar */}
        <div className="col-span-2 card-static p-6 rounded-4xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-lg text-text">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={previousMonth}
                className="w-9 h-9 rounded-2xl flex items-center justify-center hover:bg-bg transition-colors"
              >
                <ChevronLeft size={18} color="#6B6B7B" />
              </button>
              <button
                onClick={nextMonth}
                className="w-9 h-9 rounded-2xl flex items-center justify-center hover:bg-bg transition-colors"
              >
                <ChevronRight size={18} color="#6B6B7B" />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {dayNames.map((day) => (
              <div key={day} className="text-center text-xs font-bold text-muted py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const isToday = isSameDay(date, today);
              const isSelected = selectedDate && isSameDay(date, selectedDate);
              const hasEvents = hasEvent(date);
              const dayEvents = getEventsForDate(date);

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  className={`aspect-square rounded-2xl text-sm font-semibold transition-all relative ${
                    isSelected
                      ? 'bg-text text-white scale-105'
                      : isToday
                      ? 'bg-lime/20 text-text'
                      : 'hover:bg-bg text-text'
                  }`}
                >
                  {date.getDate()}
                  {hasEvents && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className="w-1 h-1 rounded-full"
                          style={{ background: isSelected ? 'white' : event.color }}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Events List */}
        <div className="card-static p-6 rounded-4xl">
          <h3 className="font-bold text-text mb-4">
            {selectedDate
              ? `Events on ${monthNames[selectedDate.getMonth()]} ${selectedDate.getDate()}`
              : 'Select a date'}
          </h3>
          <div className="space-y-3">
            {selectedEvents.length > 0 ? (
              selectedEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-2xl border-l-4 transition-all hover:shadow-md"
                  style={{ borderColor: event.color, background: '#F6F6F8' }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-bold text-sm text-text">{event.title}</h4>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                      style={{ background: event.color + '20', color: event.color }}
                    >
                      {event.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted mb-2">{event.course}</p>
                  <div className="flex items-center gap-1 text-xs font-semibold text-muted">
                    <Clock size={12} />
                    {event.time}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: '#F6F6F8' }}>
                  <CalendarIcon size={24} color="#6B6B7B" />
                </div>
                <p className="text-sm text-muted">No events on this day</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Events List */}
      <div className="card-static p-6 rounded-4xl">
        <h2 className="font-bold text-lg text-text mb-4">Upcoming Events</h2>
        <div className="grid grid-cols-2 gap-3">
          {events
            .filter((e) => e.date >= today)
            .sort((a, b) => a.date.getTime() - b.date.getTime())
            .slice(0, 6)
            .map((event) => (
              <div
                key={event.id}
                className="p-4 rounded-3xl flex items-start gap-3 hover:-translate-y-1 transition-all cursor-pointer"
                style={{ background: event.color + '15' }}
              >
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: event.color }}
                >
                  <BookOpen size={18} color="white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-text mb-1">{event.title}</h4>
                  <p className="text-xs text-muted mb-2">{event.course}</p>
                  <div className="flex items-center gap-3 text-xs font-semibold text-muted">
                    <span className="flex items-center gap-1">
                      <CalendarIcon size={11} />
                      {monthNames[event.date.getMonth()]} {event.date.getDate()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {event.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Course Reminders Section */}
      {reminders.length > 0 && (
        <div className="card-static p-6 rounded-4xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#EDE9FF' }}>
                <Bell size={18} color="#A98BFF" />
              </div>
              <div>
                <h2 className="font-bold text-lg text-text">Course Reminders</h2>
                <p className="text-xs text-muted">
                  {reminders.filter(r => !r.notified && new Date(r.reminderTime) > today).length} active · {' '}
                  {reminders.filter(r => r.notified || new Date(r.reminderTime) <= today).length} completed
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {reminders
              .sort((a, b) => {
                // Active reminders first, then sort by date
                const aActive = !a.notified && new Date(a.reminderTime) > today;
                const bActive = !b.notified && new Date(b.reminderTime) > today;
                if (aActive && !bActive) return -1;
                if (!aActive && bActive) return 1;
                return new Date(b.reminderTime).getTime() - new Date(a.reminderTime).getTime();
              })
              .map((reminder) => {
              const reminderDate = new Date(reminder.reminderTime);
              const isPast = reminderDate <= today;
              const isNotified = reminder.notified;
              const isActive = !isNotified && !isPast;
              
              return (
                <div
                  key={reminder.id}
                  className="p-4 rounded-3xl border-2 transition-all hover:shadow-md relative"
                  style={{ 
                    background: isActive ? '#EDE9FF' : '#F6F6F8',
                    borderColor: isActive ? '#A98BFF' : '#E0E0E0',
                    opacity: isActive ? 1 : 0.5
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-text mb-1">{reminder.courseName}</h4>
                      <p className="text-xs text-muted">Course ID: {reminder.courseId}</p>
                    </div>
                    <div 
                      className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: isActive ? '#A98BFF' : '#E0E0E0' }}
                    >
                      {isNotified ? (
                        <Check size={14} color="white" />
                      ) : (
                        <Bell size={14} color="white" />
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs font-semibold text-text">
                      <CalendarIcon size={12} color="#6B6B7B" />
                      <span>{reminderDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-text">
                      <Clock size={12} color="#6B6B7B" />
                      <span>{reminderDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-border">
                    {isNotified && (
                      <span className="text-xs font-bold text-green-600">✓ Reminder Sent</span>
                    )}
                    {isPast && !isNotified && (
                      <span className="text-xs font-bold text-muted">⏰ Expired</span>
                    )}
                    {isActive && (
                      <span className="text-xs font-bold" style={{ color: '#A98BFF' }}>
                        📚 Active
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full animate-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-black text-xl text-text">Create Reminder</h2>
              <button
                onClick={() => setShowReminderModal(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-bg transition-colors"
              >
                <X size={18} color="#6B6B7B" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-text mb-2">Title *</label>
                <input
                  type="text"
                  value={reminderForm.title}
                  onChange={(e) => setReminderForm({ ...reminderForm, title: e.target.value })}
                  placeholder="e.g., Study Session"
                  className="w-full px-4 py-3 rounded-2xl text-sm bg-bg border-2 border-transparent focus:border-purple focus:bg-white outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-text mb-2">Course</label>
                <input
                  type="text"
                  value={reminderForm.course}
                  onChange={(e) => setReminderForm({ ...reminderForm, course: e.target.value })}
                  placeholder="e.g., Machine Learning"
                  className="w-full px-4 py-3 rounded-2xl text-sm bg-bg border-2 border-transparent focus:border-purple focus:bg-white outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-text mb-2">Date *</label>
                  <input
                    type="date"
                    value={reminderForm.date}
                    onChange={(e) => setReminderForm({ ...reminderForm, date: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl text-sm bg-bg border-2 border-transparent focus:border-purple focus:bg-white outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text mb-2">Time *</label>
                  <input
                    type="time"
                    value={reminderForm.time}
                    onChange={(e) => setReminderForm({ ...reminderForm, time: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl text-sm bg-bg border-2 border-transparent focus:border-purple focus:bg-white outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-text mb-2">Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'reminder', label: 'Reminder' },
                    { value: 'lesson', label: 'Lesson' },
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setReminderForm({ ...reminderForm, type: type.value as CalendarEvent['type'] })}
                      className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                        reminderForm.type === type.value
                          ? 'bg-text text-white'
                          : 'bg-bg text-muted hover:bg-border'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleCreateReminder}
                className="flex-1 px-5 py-3 rounded-2xl text-sm font-bold transition-all hover:opacity-90 flex items-center justify-center gap-2"
                style={{ background: '#D7FF54', color: '#111' }}
              >
                <Check size={16} />
                Create Reminder
              </button>
              <button
                onClick={() => setShowReminderModal(false)}
                className="px-5 py-3 rounded-2xl text-sm font-bold bg-bg text-text hover:bg-border transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="h-4" />
    </div>
  );
}


