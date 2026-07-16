import { useState } from 'react';
import { Bell, Award, TrendingUp, MessageCircle, Users, Calendar, Star, CheckCheck, Trash2, Settings, Filter } from 'lucide-react';

type NotificationType = 'achievement' | 'course' | 'social' | 'reminder' | 'system';

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionText?: string;
  actionUrl?: string;
  image?: string;
};

const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'achievement',
    title: 'Congratulations! 🎉',
    message: 'You\'ve earned the "5-Day Streak" badge! Keep up the great work.',
    timestamp: '5 minutes ago',
    read: false,
    image: 'https://i.pravatar.cc/150?img=25',
  },
  {
    id: '2',
    type: 'course',
    title: 'New lesson available',
    message: 'Week 3 of Machine Learning Specialization is now available. Continue your learning journey!',
    timestamp: '1 hour ago',
    read: false,
    actionText: 'Start Lesson',
  },
  {
    id: '3',
    type: 'social',
    title: 'New message from Dr. Andrew Ng',
    message: 'Great question about gradient descent! Let me explain...',
    timestamp: '2 hours ago',
    read: false,
    actionText: 'View Message',
  },
  {
    id: '4',
    type: 'reminder',
    title: 'Assignment due soon ⏰',
    message: 'Your Machine Learning Week 2 assignment is due in 24 hours.',
    timestamp: '3 hours ago',
    read: false,
    actionText: 'Complete Now',
  },
  {
    id: '5',
    type: 'achievement',
    title: 'Course progress milestone',
    message: 'You\'re 50% through Machine Learning Specialization. You\'re doing amazing!',
    timestamp: '5 hours ago',
    read: true,
  },
  {
    id: '6',
    type: 'social',
    title: 'Emma Rodriguez mentioned you',
    message: 'Emma mentioned you in Study Group - ML Specialization: "@You thanks for helping with NumPy!"',
    timestamp: '1 day ago',
    read: true,
    actionText: 'View Thread',
  },
  {
    id: '7',
    type: 'course',
    title: 'New course recommendation',
    message: 'Based on your interests, you might like "Deep Learning Specialization" by Andrew Ng.',
    timestamp: '1 day ago',
    read: true,
    actionText: 'Explore Course',
  },
  {
    id: '8',
    type: 'system',
    title: 'Payment confirmed',
    message: 'Your Premium Plus subscription has been renewed for $49.00. Thank you!',
    timestamp: '2 days ago',
    read: true,
    actionText: 'View Invoice',
  },
  {
    id: '9',
    type: 'social',
    title: 'New follower',
    message: 'Marcus Chen started following you. Connect and learn together!',
    timestamp: '2 days ago',
    read: true,
    actionText: 'View Profile',
  },
  {
    id: '10',
    type: 'reminder',
    title: 'Weekly learning goal reminder',
    message: 'You\'re 2 hours away from your weekly goal of 10 hours. You can do it!',
    timestamp: '3 days ago',
    read: true,
  },
  {
    id: '11',
    type: 'achievement',
    title: 'Certificate earned! 🏆',
    message: 'You\'ve completed "Python for Everybody" and earned your certificate.',
    timestamp: '1 week ago',
    read: true,
    actionText: 'Download Certificate',
  },
  {
    id: '12',
    type: 'course',
    title: 'Course update',
    message: 'Machine Learning Specialization has new practice exercises in Week 2.',
    timestamp: '1 week ago',
    read: true,
    actionText: 'Try Exercises',
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState<'all' | NotificationType>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'achievement':
        return <Award size={18} color="#D7FF54" />;
      case 'course':
        return <TrendingUp size={18} color="#A98BFF" />;
      case 'social':
        return <MessageCircle size={18} color="#83D6FF" />;
      case 'reminder':
        return <Calendar size={18} color="#FFB259" />;
      case 'system':
        return <Bell size={18} color="#6B6B7B" />;
    }
  };

  const getIconBg = (type: NotificationType) => {
    switch (type) {
      case 'achievement':
        return '#F5FFDB';
      case 'course':
        return '#EDE9FF';
      case 'social':
        return '#E0F5FF';
      case 'reminder':
        return '#FFF7ED';
      case 'system':
        return '#F6F6F8';
    }
  };

  const filteredNotifications =
    activeFilter === 'all'
      ? notifications
      : notifications.filter((n) => n.type === activeFilter);

  const filters: { id: 'all' | NotificationType; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All', icon: <Bell size={14} /> },
    { id: 'achievement', label: 'Achievements', icon: <Award size={14} /> },
    { id: 'course', label: 'Courses', icon: <TrendingUp size={14} /> },
    { id: 'social', label: 'Social', icon: <Users size={14} /> },
    { id: 'reminder', label: 'Reminders', icon: <Calendar size={14} /> },
  ];

  return (
    <div className="flex-1 py-4 pr-4 pl-2 overflow-y-auto no-scrollbar space-y-5 animate-in">
      {/* Header */}
      <div
        className="p-7 rounded-4xl relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f0f 100%)' }}
      >
        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #D7FF54, transparent 70%)', transform: 'translate(40%, -40%)' }} />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: '#D7FF54' }}>
                  <Bell size={20} color="#111" />
                </div>
                <h1 className="text-section text-white">Notifications</h1>
              </div>
              <p className="text-white/60 text-sm">
                Stay updated with your learning progress and community activity
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={markAllAsRead}
                className="px-4 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 transition-all hover:opacity-90"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
              >
                <CheckCheck size={16} />
                Mark all as read
              </button>
              <button
                className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all hover:bg-white/10"
                style={{ border: '1px solid rgba(255,255,255,0.2)' }}
              >
                <Settings size={18} color="white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Unread', value: unreadCount, icon: <Bell size={18} color="#FF6D70" />, bg: '#FFF0F0' },
          { label: 'Today', value: notifications.filter((n) => n.timestamp.includes('hour') || n.timestamp.includes('min')).length, icon: <Calendar size={18} color="#A98BFF" />, bg: '#EDE9FF' },
          { label: 'This Week', value: notifications.filter((n) => n.timestamp.includes('day')).length, icon: <TrendingUp size={18} color="#83D6FF" />, bg: '#E0F5FF' },
          { label: 'Total', value: notifications.length, icon: <Star size={18} color="#D7FF54" />, bg: '#F5FFDB' },
        ].map((stat) => (
          <div key={stat.label} className="card-static p-5 rounded-3xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: stat.bg }}>
              {stat.icon}
            </div>
            <div>
              <p className="font-black text-xl text-text">{stat.value}</p>
              <p className="text-xs text-muted">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card-static p-4 rounded-3xl">
        <div className="flex items-center gap-2">
          <Filter size={16} color="#6B6B7B" />
          <span className="text-sm font-bold text-muted mr-2">Filter:</span>
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeFilter === filter.id
                  ? 'bg-text text-white'
                  : 'bg-bg text-muted hover:bg-border hover:text-text'
              }`}
            >
              {filter.icon}
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="card-static p-12 rounded-4xl text-center">
            <div className="w-16 h-16 rounded-3xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#F6F6F8' }}>
              <Bell size={32} color="#6B6B7B" />
            </div>
            <h3 className="text-lg font-bold text-text mb-2">No notifications</h3>
            <p className="text-sm text-muted">You're all caught up! Check back later for updates.</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`card-static rounded-3xl overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg group ${
                !notification.read ? 'border-2 border-lime/30' : ''
              }`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <div className="flex gap-4 p-5">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: getIconBg(notification.type) }}
                >
                  {getIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-text">{notification.title}</h3>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-lime flex-shrink-0" />
                      )}
                    </div>
                    <span className="text-xs text-muted flex-shrink-0 ml-3">
                      {notification.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-muted mb-3 leading-relaxed">{notification.message}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {notification.actionText && (
                      <button
                        className="px-4 py-2 rounded-2xl text-xs font-bold transition-all hover:opacity-80"
                        style={{ background: '#D7FF54', color: '#111' }}
                      >
                        {notification.actionText}
                      </button>
                    )}
                    {!notification.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        className="px-3 py-2 rounded-2xl text-xs font-bold bg-bg text-text hover:bg-border transition-all"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="ml-auto w-8 h-8 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                    >
                      <Trash2 size={14} color="#EF4444" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredNotifications.length > 0 && (
        <div className="text-center">
          <button className="px-6 py-3 rounded-2xl text-sm font-bold bg-bg text-text hover:bg-border transition-all">
            Load More Notifications
          </button>
        </div>
      )}

      {/* Notification Settings CTA */}
      <div
        className="p-6 rounded-4xl"
        style={{ background: 'linear-gradient(135deg, #EDE9FF 0%, #E0F5FF 100%)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-lg text-text mb-2">Manage Notification Preferences</h3>
            <p className="text-sm text-muted">
              Choose what notifications you want to receive and how you want to receive them.
            </p>
          </div>
          <button
            className="px-6 py-3 rounded-2xl text-sm font-bold bg-text text-white hover:opacity-90 transition-all whitespace-nowrap"
          >
            Go to Settings
          </button>
        </div>
      </div>

      <div className="h-4" />
    </div>
  );
}
