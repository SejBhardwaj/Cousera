import { BookOpen, Clock, Trophy, TrendingUp, Play, ChevronRight, Star, BarChart2, Flame, Zap, Award, Crown, Gem, Sparkles } from 'lucide-react';
import { useState } from 'react';
import CourseCard, { Course } from '../components/CourseCard';
import { useOffline } from '../contexts/OfflineContext';
import NotificationPermissionBanner from '../components/NotificationPermissionBanner';
import ReminderModal from '../components/ReminderModal';

const IN_PROGRESS: Course[] = [
  {
    id: 'ml-specialization',
    title: 'Machine Learning Specialization',
    provider: 'Stanford Online',
    instructor: 'Andrew Ng',
    instructorImg: 'https://i.pravatar.cc/150?img=12',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
    category: 'AI / ML',
    categoryColor: '#A98BFF',
    rating: 4.9,
    reviews: 128400,
    duration: '11 weeks',
    difficulty: 'Intermediate',
    progress: 68,
    enrolled: true,
  },
  {
    id: 'fullstack-web-dev',
    title: 'Full-Stack Web Development',
    provider: 'Web Dev Institute',
    instructor: 'Michael Chen',
    instructorImg: 'https://i.pravatar.cc/150?img=62',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
    category: 'Technology',
    categoryColor: '#83D6FF',
    rating: 4.7,
    reviews: 42000,
    duration: '16 weeks',
    difficulty: 'Intermediate',
    progress: 34,
    enrolled: true,
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Mastery',
    provider: 'Marketing Pro',
    instructor: 'Alex Turner',
    instructorImg: 'https://i.pravatar.cc/150?img=51',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    category: 'Marketing',
    categoryColor: '#FFB259',
    rating: 4.6,
    reviews: 28000,
    duration: '8 weeks',
    difficulty: 'Beginner',
    progress: 87,
    enrolled: true,
  },
];

const COMPLETED_COURSES = [
  { title: 'Introduction to Programming', provider: 'University of Michigan', date: 'Mar 2024', color: '#D7FF54' },
  { title: 'SQL for Data Analysis', provider: 'Google', date: 'Jan 2024', color: '#83D6FF' },
  { title: 'Statistics for Data Science', provider: 'Duke University', date: 'Dec 2023', color: '#A98BFF' },
];

const WEEKLY_DATA = [
  { day: 'Mon', hours: 1.5 },
  { day: 'Tue', hours: 2.8 },
  { day: 'Wed', hours: 3.2 },
  { day: 'Thu', hours: 0.5 },
  { day: 'Fri', hours: 2.0 },
  { day: 'Sat', hours: 1.8 },
  { day: 'Sun', hours: 2.5 },
];

const SKILL_RADAR = [
  { skill: 'Python', level: 82, color: '#D7FF54' },
  { skill: 'Machine Learning', level: 68, color: '#A98BFF' },
  { skill: 'Statistics', level: 75, color: '#83D6FF' },
  { skill: 'SQL', level: 90, color: '#7DEBA3' },
  { skill: 'Deep Learning', level: 45, color: '#FF6D70' },
  { skill: 'Data Viz', level: 71, color: '#FFB259' },
];

export default function MyLearning({ onCourseClick }: { onCourseClick: (id: string) => void }) {
  const { offlineCourses } = useOffline();
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const maxHours = Math.max(...WEEKLY_DATA.map((d) => d.hours));

  return (
    <div className="flex-1 py-4 px-4 md:pr-4 md:pl-2 overflow-y-auto no-scrollbar space-y-5 animate-in">

      {/* Notification Permission Banner */}
      <NotificationPermissionBanner onEnableClick={() => {
        // Open reminder modal for the first in-progress course
        if (IN_PROGRESS.length > 0) {
          setSelectedCourse(IN_PROGRESS[0]);
          setShowReminderModal(true);
        }
      }} />

      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: 'Courses Enrolled', value: '8', icon: <BookOpen size={18} color="#A98BFF" />, bg: '#EDE9FF', accent: '#A98BFF' },
          { label: 'Hours Learned', value: '142h', icon: <Clock size={18} color="#83D6FF" />, bg: '#E0F5FF', accent: '#83D6FF' },
          { label: 'Certificates', value: '3', icon: <Trophy size={18} color="#F59E0B" />, bg: '#FFF7ED', accent: '#F59E0B' },
          { label: 'Skill Score', value: '74%', icon: <TrendingUp size={18} color="#7DEBA3" />, bg: '#ECFDF5', accent: '#7DEBA3' },
        ].map((s) => (
          <div key={s.label} className="card-static p-5 rounded-3xl">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3" style={{ background: s.bg }}>
              {s.icon}
            </div>
            <div className="text-3xl font-black text-text mb-1">{s.value}</div>
            <div className="text-xs text-muted font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Streak Badges Showcase - Ultra Modern & Cool */}
      <div className="relative rounded-[32px] overflow-hidden" style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)', border: '1px solid #E2E8F0' }}>
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-40 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[150px]" style={{ background: 'radial-gradient(circle, #FF6D70, transparent 50%)' }} />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full blur-[150px]" style={{ background: 'radial-gradient(circle, #60A5FA, transparent 50%)' }} />
        </div>

        <div className="relative z-10 p-8">
          {/* Modern Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 rounded-[20px] flex items-center justify-center relative overflow-hidden shadow-2xl" style={{ background: 'linear-gradient(135deg, #FF6D70 0%, #FF9A9C 100%)' }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/20" />
                  <Trophy size={32} color="white" strokeWidth={2.5} className="relative z-10" />
                </div>
                {/* Floating sparkles */}
                <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-400 animate-ping" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-orange-400 animate-pulse" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-text mb-1 tracking-tight">Streak Badges</h2>
                <p className="text-sm font-semibold text-muted">Keep learning daily to unlock exclusive achievements</p>
              </div>
            </div>
            
            {/* Current Streak Badge */}
            <div className="flex items-center gap-3 px-6 py-3 rounded-[20px] shadow-xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)', border: '2px solid #FB923C' }}>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-200/30 to-transparent" />
              <Flame size={22} color="#EA580C" fill="#EA580C" className="relative z-10 animate-pulse" />
              <div className="relative z-10">
                <p className="text-xs font-bold text-orange-700 uppercase tracking-wide">Current Streak</p>
                <p className="text-lg font-black text-orange-900">23 Days</p>
              </div>
            </div>
          </div>

          {/* Ultra Modern Badges Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
            {[
              { 
                icon: Sparkles,
                name: 'Getting Started', 
                days: 3, 
                unlocked: true,
                primaryColor: '#10B981',
                secondaryColor: '#34D399',
                glowColor: 'rgba(16, 185, 129, 0.3)',
                unlockedDate: 'Nov 28'
              },
              { 
                icon: Flame,
                name: 'Week Warrior', 
                days: 7, 
                unlocked: true,
                primaryColor: '#F59E0B',
                secondaryColor: '#FBBF24',
                glowColor: 'rgba(245, 158, 11, 0.3)',
                unlockedDate: 'Dec 2'
              },
              { 
                icon: Zap,
                name: 'Two Week Champion', 
                days: 14, 
                unlocked: true,
                primaryColor: '#8B5CF6',
                secondaryColor: '#A78BFA',
                glowColor: 'rgba(139, 92, 246, 0.3)',
                unlockedDate: 'Dec 9'
              },
              { 
                icon: Award,
                name: 'Monthly Master', 
                days: 30, 
                unlocked: false,
                primaryColor: '#EF4444',
                secondaryColor: '#F87171',
                glowColor: 'rgba(239, 68, 68, 0.3)',
                unlockedDate: null
              },
              { 
                icon: Gem,
                name: 'Learning Legend', 
                days: 60, 
                unlocked: false,
                primaryColor: '#3B82F6',
                secondaryColor: '#60A5FA',
                glowColor: 'rgba(59, 130, 246, 0.3)',
                unlockedDate: null
              },
              { 
                icon: Crown,
                name: 'Century Scholar', 
                days: 100, 
                unlocked: false,
                primaryColor: '#EC4899',
                secondaryColor: '#F472B6',
                glowColor: 'rgba(236, 72, 153, 0.3)',
                unlockedDate: null
              },
            ].map((badge, index) => {
              const IconComponent = badge.icon;
              return (
                <div
                  key={badge.name}
                  className={`group relative transition-all duration-500 ${
                    badge.unlocked 
                      ? 'hover:-translate-y-4 cursor-pointer' 
                      : 'cursor-not-allowed'
                  }`}
                  style={{
                    animation: badge.unlocked ? `fadeIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.1}s backwards` : 'none',
                  }}
                >
                  {/* Glow effect on hover */}
                  {badge.unlocked && (
                    <div 
                      className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"
                      style={{ background: badge.glowColor }}
                    />
                  )}

                  {/* Card */}
                  <div
                    className="relative rounded-[28px] overflow-hidden transition-all duration-300"
                    style={{
                      background: badge.unlocked ? 'white' : '#FAFAFA',
                      border: badge.unlocked 
                        ? `2px solid ${badge.primaryColor}30` 
                        : '2px dashed #E5E5E5',
                      boxShadow: badge.unlocked 
                        ? `0 10px 30px ${badge.primaryColor}20, 0 0 0 1px ${badge.primaryColor}10` 
                        : '0 4px 12px rgba(0,0,0,0.05)',
                    }}
                  >
                    {/* Top accent bar */}
                    {badge.unlocked && (
                      <div className="absolute top-0 left-0 right-0 h-1.5" style={{ background: `linear-gradient(90deg, ${badge.primaryColor} 0%, ${badge.secondaryColor} 100%)` }} />
                    )}

                    <div className="p-5">
                      {/* Badge Icon - Premium 3D Effect */}
                      <div className="relative mb-4">
                        <div 
                          className={`w-24 h-24 mx-auto rounded-[24px] flex items-center justify-center relative overflow-hidden transition-all duration-500 ${
                            badge.unlocked ? 'group-hover:scale-110 group-hover:rotate-6' : ''
                          }`}
                          style={{
                            background: badge.unlocked 
                              ? `linear-gradient(135deg, ${badge.primaryColor} 0%, ${badge.secondaryColor} 100%)`
                              : 'linear-gradient(135deg, #E5E5E5 0%, #D4D4D8 100%)',
                            boxShadow: badge.unlocked 
                              ? `0 12px 32px ${badge.primaryColor}50, inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.1)` 
                              : 'inset 0 2px 6px rgba(0,0,0,0.15)',
                          }}
                        >
                          {/* 3D light effect */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/10 to-black/20" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0 40%)' }} />
                          
                          {/* Icon */}
                          <IconComponent 
                            size={42} 
                            color="white" 
                            strokeWidth={2.5}
                            fill={badge.icon === Flame || badge.icon === Crown ? 'white' : 'none'}
                            className="relative z-10 drop-shadow-lg"
                          />
                          
                          {/* Lock overlay */}
                          {!badge.unlocked && (
                            <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/30 backdrop-blur-[1px] flex items-center justify-center z-20">
                              <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow-xl">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                  <rect x="7" y="11" width="10" height="8" rx="1.5" fill="#666" fillOpacity="0.8"/>
                                  <path d="M9 11V8C9 6.34315 10.3431 5 12 5C13.6569 5 15 6.34315 15 8V11" stroke="#666" strokeWidth="2.5" strokeLinecap="round"/>
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Star badge for unlocked */}
                        {badge.unlocked && (
                          <div 
                            className="absolute -top-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center shadow-xl animate-bounce"
                            style={{ 
                              background: `linear-gradient(135deg, ${badge.primaryColor} 0%, ${badge.secondaryColor} 100%)`,
                              animation: 'bounce 2s ease-in-out infinite'
                            }}
                          >
                            <Star size={16} fill="white" color="white" strokeWidth={2.5} />
                          </div>
                        )}
                      </div>

                      {/* Badge Info */}
                      <div className="text-center">
                        <h3 className={`font-black text-base mb-1.5 leading-tight ${badge.unlocked ? 'text-text' : 'text-gray-400'}`}>
                          {badge.name}
                        </h3>
                        
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <div 
                            className="w-2 h-2 rounded-full transition-all duration-300 group-hover:scale-150" 
                            style={{ background: badge.unlocked ? badge.primaryColor : '#D4D4D8' }}
                          />
                          <p className={`text-xs font-bold ${badge.unlocked ? 'text-muted' : 'text-gray-400'}`}>
                            {badge.days} Day Streak
                          </p>
                          <div 
                            className="w-2 h-2 rounded-full transition-all duration-300 group-hover:scale-150" 
                            style={{ background: badge.unlocked ? badge.primaryColor : '#D4D4D8' }}
                          />
                        </div>
                        
                        {badge.unlocked && badge.unlockedDate ? (
                          <div 
                            className="px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider"
                            style={{ 
                              background: `${badge.primaryColor}15`,
                              color: badge.primaryColor,
                              border: `1px solid ${badge.primaryColor}30`
                            }}
                          >
                            Unlocked {badge.unlockedDate}
                          </div>
                        ) : (
                          <div className="px-3 py-2 rounded-xl text-[11px] font-bold bg-gray-100 text-gray-500 border border-gray-200">
                            {badge.days - 23} days to unlock
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Ultra Modern Progress Bar */}
          <div className="relative p-7 rounded-[28px] overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)', border: '2px solid #FCD34D' }}>
            {/* Animated background orb */}
            <div className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-30 animate-pulse" style={{ background: '#F59E0B' }} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-[16px] flex items-center justify-center relative overflow-hidden"
                    style={{ 
                      background: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)', 
                      boxShadow: '0 8px 24px rgba(239, 68, 68, 0.4), inset 0 2px 4px rgba(255,255,255,0.3)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />
                    <Award size={24} color="white" strokeWidth={2.5} className="relative z-10" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-orange-700 uppercase tracking-wide mb-0.5">Next Milestone</p>
                    <p className="text-lg font-black text-text">Monthly Master Badge</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-orange-700">Progress</p>
                  <p className="text-2xl font-black text-orange-900">23 / 30</p>
                </div>
              </div>
              
              {/* 3D Progress Bar */}
              <div className="relative h-5 bg-white rounded-full overflow-hidden shadow-inner">
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent" />
                <div 
                  className="h-full rounded-full transition-all duration-1000 relative overflow-hidden"
                  style={{ 
                    width: '77%',
                    background: 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)',
                    boxShadow: '0 2px 12px rgba(245, 158, 11, 0.5), inset 0 1px 2px rgba(255,255,255,0.5)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/50 via-white/20 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                  {/* Animated shimmer */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                    style={{ animation: 'shimmer 2s infinite', width: '50%' }}
                  />
                </div>
              </div>
              
              <p className="text-sm font-bold text-center mt-4 leading-relaxed" style={{ color: '#92400E' }}>
                Only <span className="text-orange-600 font-black">7 more days</span> to unlock Monthly Master! Keep crushing it! 💪🔥
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* In Progress */}
      <div className="card-static p-6 rounded-4xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-card-title text-text">In Progress</h2>
          <span className="tag text-xs" style={{ background: '#EDE9FF', color: '#A98BFF' }}>3 active</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {IN_PROGRESS.map((c) => (
            <CourseCard 
              key={c.id} 
              course={c} 
              compact 
              onClick={() => onCourseClick(c.id)}
              isOfflineAvailable={offlineCourses.has(c.title.toLowerCase().replace(/\s+/g, '-'))}
            />
          ))}
        </div>
      </div>

      {/* Weekly Learning Chart + Skill Radar */}
      <div className="grid grid-cols-5 gap-4">

        {/* Weekly Chart */}
        <div className="col-span-3 card-static p-6 rounded-4xl">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-card-title text-text">Weekly Activity</h2>
            <span className="text-xs text-muted">14.3h this week</span>
          </div>
          <div className="space-y-6 py-4">
            {WEEKLY_DATA.map((d, i) => {
              const widthPercent = (d.hours / maxHours) * 100;
              return (
                <div key={d.day} className="flex items-center gap-4">
                  {/* Day label */}
                  <span className="text-sm text-muted font-medium w-12">{d.day}</span>
                  
                  {/* Horizontal capsule bar */}
                  <div className="flex-1 h-12 relative bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="absolute left-0 top-0 h-full rounded-full transition-all duration-700 ease-out"
                      style={{ 
                        width: `${widthPercent}%`,
                        minWidth: '48px',
                        background: i === 2 || i === 6 
                          ? 'linear-gradient(to right, #D7FF54 0%, #A98BFF 100%)' 
                          : 'linear-gradient(to right, #E8E8F0 0%, #D0D0E0 100%)',
                      }}
                    >
                      {/* Glossy effect */}
                      <div 
                        className="absolute inset-0 opacity-30"
                        style={{
                          background: 'linear-gradient(to bottom, rgba(255,255,255,0.9) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)'
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Hours value */}
                  <span className="text-sm font-bold text-text w-12 text-right">{d.hours}h</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: 'linear-gradient(to right, #D7FF54 0%, #A98BFF 100%)' }} />
              <span className="text-xs text-muted">Best days</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-200" />
              <span className="text-xs text-muted">Average</span>
            </div>
          </div>
        </div>

        {/* Skill Radar */}
        <div className="col-span-2 card-static p-6 rounded-4xl">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-2xl flex items-center justify-center" style={{ background: '#EDE9FF' }}>
              <BarChart2 size={15} color="#A98BFF" />
            </div>
            <h2 className="text-sm font-bold text-text">Skill Levels</h2>
          </div>
          <div className="space-y-3">
            {SKILL_RADAR.map((s) => (
              <div key={s.skill}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-semibold text-text">{s.skill}</span>
                  <span className="text-xs font-bold" style={{ color: s.color }}>{s.level}%</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${s.level}%`, background: s.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Completed */}
      <div className="card-static p-6 rounded-4xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-card-title text-text">Completed</h2>
          <button className="text-sm font-semibold text-muted hover:text-text transition-colors flex items-center gap-1">
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div className="space-y-3">
          {COMPLETED_COURSES.map((c) => (
            <div
              key={c.title}
              className="flex items-center gap-4 p-4 rounded-3xl hover:bg-bg transition-colors cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center" style={{ background: c.color }}>
                <Trophy size={18} color={c.color === '#D7FF54' ? '#111' : 'white'} />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-text text-sm">{c.title}</p>
                <p className="text-xs text-muted">{c.provider} · Completed {c.date}</p>
              </div>
              <div className="flex gap-0.5 mr-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={11} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <button className="px-4 py-2 rounded-2xl text-xs font-bold border border-border hover:bg-text hover:text-white transition-all duration-200 opacity-0 group-hover:opacity-100">
                View Cert
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Career Readiness */}
      <div
        className="p-7 rounded-4xl"
        style={{ background: 'linear-gradient(135deg, #111111 0%, #1a1a2e 100%)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-white/40 uppercase tracking-wider mb-2">Career Readiness Score</p>
            <div className="flex items-end gap-3 mb-2">
              <span className="text-6xl font-black text-white">74</span>
              <div className="mb-2">
                <span className="text-2xl font-bold" style={{ color: '#D7FF54' }}>%</span>
                <p className="text-white/50 text-xs">of goal</p>
              </div>
            </div>
            <p className="text-white/60 text-sm max-w-sm leading-relaxed">
              Complete 2 more courses and earn the AWS certification to reach 90%+ readiness for Senior Data Engineer roles.
            </p>
            <button className="mt-4 btn-lime text-sm">
              <Play size={13} fill="#111" />
              Resume Learning
            </button>
          </div>
          <div className="hidden xl:block">
            <div className="relative w-36 h-36">
              <svg width="144" height="144" viewBox="0 0 144 144" className="rotate-[-90deg]">
                <circle cx="72" cy="72" r="60" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
                <circle
                  cx="72" cy="72" r="60" fill="none" stroke="#D7FF54" strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 60}`}
                  strokeDashoffset={`${2 * Math.PI * 60 * (1 - 0.74)}`}
                  style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-black text-white">74%</div>
                  <div className="text-xs text-white/40">Ready</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-4" />

      {/* Reminder Modal */}
      {showReminderModal && selectedCourse && (
        <ReminderModal
          courseName={selectedCourse.title}
          courseId={selectedCourse.id}
          onClose={() => setShowReminderModal(false)}
        />
      )}
    </div>
  );
}


