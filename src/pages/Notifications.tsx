import { useState, useEffect } from 'react';
import { Bell, Award, TrendingUp, MessageCircle, Users, Calendar, Star, CheckCheck, Trash2, Settings, Filter, Trophy, Library, Flame, Play, Clock, Sparkles, Check } from 'lucide-react';
import { getRecentlyWatchedVideos, formatTimeRemaining, formatVideoTime } from '../utils/videoProgressStorage';
import { loadStreakNotifications, markStreakNotificationAsRead, deleteStreakNotification, type StreakNotificationRecord } from '../utils/streakNotificationStorage';

type NotificationType = 'achievement' | 'course' | 'social' | 'reminder' | 'system' | 'video' | 'streak';

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
  courseId?: string;  // For video notifications
  videoId?: string;   // For video notifications
  streakCount?: number; // For streak notifications
};

// Helper function to format time ago
const formatTimeAgo = (timestamp: number): string => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
  return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
};

const NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'achievement',
    title: '🎉 Congratulations!',
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
    title: '⏰ Assignment due soon',
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
    title: 'Certificate earned!',
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

export default function Notifications({ onCourseClick }: { onCourseClick?: (courseId: string) => void }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeFilter, setActiveFilter] = useState<'all' | NotificationType>('all');

  // Load notifications on mount and generate video notifications
  useEffect(() => {
    const loadNotifications = () => {
      const staticNotifications = NOTIFICATIONS;
      
      // Generate video pause notifications from recent videos
      const recentVideos = getRecentlyWatchedVideos(5);
      const videoNotifications: Notification[] = recentVideos.map((video, index) => {
        const timeAgo = formatTimeAgo(video.lastWatchedAt);
        const timeLeft = formatTimeRemaining(video.duration - video.currentTime);
        
        return {
          id: `video-${video.videoId}`,
          type: 'video' as NotificationType,
          title: '🎬 Video Paused',
          message: `You left "${video.videoTitle}" at ${video.percentComplete}% complete. ${timeLeft} remaining.`,
          timestamp: timeAgo,
          read: false,
          actionText: 'Resume Watching',
          courseId: video.courseId,
          videoId: video.videoId,
        };
      });

      // Load streak notifications from localStorage
      const streakRecords = loadStreakNotifications();
      const streakNotifications: Notification[] = streakRecords.map((record) => ({
        id: record.id,
        type: 'streak' as NotificationType,
        title: `🔥 ${record.streakCount} Day Streak!`,
        message: record.message,
        timestamp: formatTimeAgo(record.timestamp),
        read: record.read,
        streakCount: record.streakCount,
      }));

      // If no streak notifications exist, show a placeholder for demo
      if (streakNotifications.length === 0) {
        // Don't add demo notifications, let the empty state show
      }

      // Combine all notifications (streak, video, then static)
      setNotifications([...streakNotifications, ...videoNotifications, ...staticNotifications]);
    };

    loadNotifications();

    // Refresh notifications every 60 seconds
    const interval = setInterval(loadNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    // Also mark in localStorage if it's a streak notification
    if (id.startsWith('streak-')) {
      markStreakNotificationAsRead(id);
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    // Also delete from localStorage if it's a streak notification
    if (id.startsWith('streak-')) {
      deleteStreakNotification(id);
    }
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
      case 'video':
        return <Play size={18} color="#A98BFF" />;
      case 'streak':
        return <Flame size={18} color="#FF6D70" fill="#FF6D70" />;
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
      case 'video':
        return '#EDE9FF';
      case 'streak':
        return '#FFE5E5';
    }
  };

  const filteredNotifications =
    activeFilter === 'all'
      ? notifications
      : notifications.filter((n) => n.type === activeFilter);

  const filters: { id: 'all' | NotificationType; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All', icon: <Bell size={16} strokeWidth={2.5} /> },
    { id: 'streak', label: 'Streaks', icon: <Flame size={16} strokeWidth={2.5} /> },
    { id: 'video', label: 'Videos', icon: <Play size={16} strokeWidth={2.5} /> },
    { id: 'achievement', label: 'Achievements', icon: <Award size={16} strokeWidth={2.5} /> },
    { id: 'course', label: 'Courses', icon: <TrendingUp size={16} strokeWidth={2.5} /> },
    { id: 'social', label: 'Social', icon: <Users size={16} strokeWidth={2.5} /> },
    { id: 'reminder', label: 'Reminders', icon: <Calendar size={16} strokeWidth={2.5} /> },
  ];

  return (
    <div className="flex-1 py-6 px-4 md:pr-6 md:pl-4 overflow-y-auto no-scrollbar space-y-6 animate-in">
      {/* Modern Header with Gradient */}
      <div
        className="p-8 rounded-[32px] relative overflow-hidden shadow-2xl"
        style={{ 
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
        }}
      >
        {/* Animated background orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #D7FF54, transparent 60%)', transform: 'translate(40%, -40%)', animation: 'pulse 4s ease-in-out infinite' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-20 blur-3xl" style={{ background: 'radial-gradient(circle, #83D6FF, transparent 60%)', transform: 'translate(-40%, 40%)', animation: 'pulse 5s ease-in-out infinite' }} />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 rounded-[20px] flex items-center justify-center shadow-xl" style={{ background: 'white', border: '2px solid rgba(255,255,255,0.3)' }}>
                  <Bell size={26} color="#6366f1" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-4xl font-black text-white mb-1">Notifications</h1>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.95)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      <Sparkles size={14} color="#6366f1" strokeWidth={2.5} />
                      <span className="text-xs font-bold" style={{ color: '#6366f1' }}>{unreadCount} New</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.85)', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                      <Clock size={14} color="#8b5cf6" strokeWidth={2.5} />
                      <span className="text-xs font-bold" style={{ color: '#8b5cf6' }}>Updated now</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-white/90 text-base max-w-2xl leading-relaxed">
                Stay in the loop with real-time updates on your learning journey, course progress, and community interactions
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={markAllAsRead}
                className="px-5 py-3 rounded-[18px] text-sm font-bold flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 shadow-lg"
                style={{ background: 'white', color: '#6366f1', border: '2px solid white' }}
              >
                <CheckCheck size={18} strokeWidth={2.5} />
                Mark all read
              </button>
              <button
                className="w-12 h-12 rounded-[18px] flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                style={{ background: 'white', border: '2px solid white' }}
              >
                <Settings size={20} color="#6366f1" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Unread', value: unreadCount, icon: Bell, gradient: 'from-rose-500 to-pink-600', bgGradient: 'from-rose-50 to-pink-50' },
          { label: 'Today', value: notifications.filter((n) => n.timestamp.includes('hour') || n.timestamp.includes('min')).length, icon: Calendar, gradient: 'from-violet-500 to-purple-600', bgGradient: 'from-violet-50 to-purple-50' },
          { label: 'This Week', value: notifications.filter((n) => n.timestamp.includes('day')).length, icon: TrendingUp, gradient: 'from-sky-500 to-blue-600', bgGradient: 'from-sky-50 to-blue-50' },
          { label: 'Total', value: notifications.length, icon: Star, gradient: 'from-amber-500 to-orange-600', bgGradient: 'from-amber-50 to-orange-50' },
        ].map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div key={stat.label} className="card-static p-6 rounded-[24px] relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl" style={{ border: '2px solid rgba(0,0,0,0.05)' }}>
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="font-black text-3xl text-text mb-1">{stat.value}</p>
                  <p className="text-sm font-bold text-muted">{stat.label}</p>
                </div>
                <div className={`w-14 h-14 rounded-[18px] flex items-center justify-center bg-gradient-to-br ${stat.gradient} shadow-xl`}>
                  <IconComponent size={24} color="white" strokeWidth={2.5} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modern Filter Chips */}
      <div className="card-static p-5 rounded-[24px] shadow-lg" style={{ border: '2px solid rgba(0,0,0,0.05)' }}>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Filter size={16} color="white" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-black text-text">Filter by:</span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-5 py-3 rounded-[18px] text-sm font-bold transition-all duration-200 flex items-center gap-2.5 ${
                  activeFilter === filter.id
                    ? 'shadow-xl scale-105'
                    : 'hover:scale-105 hover:shadow-lg'
                }`}
                style={
                  activeFilter === filter.id
                    ? {
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        color: 'white',
                        border: '2px solid rgba(99, 102, 241, 0.3)',
                      }
                    : {
                        background: 'white',
                        color: '#6B6B7B',
                        border: '2px solid #E5E5E5',
                      }
                }
              >
                <div className={`w-5 h-5 flex items-center justify-center ${activeFilter === filter.id ? 'scale-110' : ''}`}>
                  {filter.icon}
                </div>
                <span>{filter.label}</span>
                {activeFilter === filter.id && (
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                    <Check size={12} strokeWidth={3} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications List with Advanced Styling */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="card-static p-16 rounded-[32px] text-center shadow-lg" style={{ border: '2px solid rgba(0,0,0,0.05)' }}>
            <div className="w-24 h-24 rounded-[28px] mx-auto mb-6 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <Bell size={48} color="#6B6B7B" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-black text-text mb-3">All caught up!</h3>
            <p className="text-base text-muted max-w-md mx-auto">You're on top of everything. Check back later for new updates and notifications.</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`card-static rounded-[28px] overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl group relative ${
                !notification.read ? 'ring-2 ring-indigo-500/30 shadow-xl' : 'shadow-lg'
              }`}
              style={{ border: !notification.read ? '2px solid rgba(99, 102, 241, 0.2)' : '2px solid rgba(0,0,0,0.05)' }}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              {/* Gradient overlay for unread */}
              {!notification.read && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 pointer-events-none" />
              )}
              
              <div className="flex gap-5 p-6 relative z-10">
                {/* Enhanced Icon */}
                <div className="relative">
                  <div
                    className="w-16 h-16 rounded-[20px] flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300"
                    style={{ 
                      background: getIconBg(notification.type),
                      border: '2px solid rgba(0,0,0,0.05)'
                    }}
                  >
                    <div className="scale-110">{getIcon(notification.type)}</div>
                  </div>
                  {!notification.read && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg animate-pulse">
                      <div className="w-2 h-2 rounded-full bg-white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <h3 className="font-black text-base text-text">{notification.title}</h3>
                      {notification.type === 'video' && (
                        <div className="px-2.5 py-1 rounded-lg text-xs font-bold bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700">
                          VIDEO
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                      <Clock size={14} color="#9CA3AF" />
                      <span className="text-xs font-semibold text-muted">
                        {notification.timestamp}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted mb-4 leading-relaxed">{notification.message}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {notification.actionText && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (notification.type === 'video' && notification.courseId && onCourseClick) {
                            onCourseClick(notification.courseId);
                            markAsRead(notification.id);
                          }
                        }}
                        className="px-5 py-2.5 rounded-[16px] text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-xl flex items-center gap-2"
                      >
                        <Play size={14} fill="white" />
                        {notification.actionText}
                      </button>
                    )}
                    {!notification.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          markAsRead(notification.id);
                        }}
                        className="px-4 py-2.5 rounded-[16px] text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 backdrop-blur-xl"
                        style={{
                          background: 'rgba(255, 255, 255, 0.7)',
                          border: '1.5px solid rgba(255, 255, 255, 0.8)',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.9)',
                          color: '#374151'
                        }}
                      >
                        <Check size={14} strokeWidth={3} />
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="ml-auto w-10 h-10 rounded-[14px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 active:scale-95 backdrop-blur-xl"
                      style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        border: '1.5px solid rgba(255, 255, 255, 0.8)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                      }}
                    >
                      <Trash2 size={16} color="#EF4444" strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Load More with Modern Style */}
      {filteredNotifications.length > 0 && (
        <div className="text-center">
          <button className="px-8 py-4 rounded-[20px] text-sm font-bold bg-gradient-to-r from-gray-100 to-gray-200 text-text hover:from-gray-200 hover:to-gray-300 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl">
            Load More Notifications
          </button>
        </div>
      )}

      {/* Notification Settings CTA with Modern Design */}
      <div
        className="p-8 rounded-[32px] relative overflow-hidden shadow-xl"
        style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 50%, #ede9fe 100%)' }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-30 blur-3xl" style={{ background: 'radial-gradient(circle, #8b5cf6, transparent 60%)', transform: 'translate(30%, -30%)' }} />
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-xl">
              <Settings size={28} color="white" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-black text-xl text-text mb-2">Customize Your Notifications</h3>
              <p className="text-sm text-muted max-w-lg">
                Take control of what you see. Choose notification types, frequency, and delivery methods.
              </p>
            </div>
          </div>
          <button
            className="px-8 py-4 rounded-[20px] text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl whitespace-nowrap flex items-center gap-2"
          >
            <Settings size={16} />
            Notification Settings
          </button>
        </div>
      </div>

      <div className="h-6" />
    </div>
  );
}


