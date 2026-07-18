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

      {/* Streak Badges Showcase - Professional & Elegant */}
      <div className="card-static p-8 rounded-4xl relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: 'radial-gradient(circle, #FF6D70, transparent 60%)' }} />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px]" style={{ background: 'radial-gradient(circle, #FFB259, transparent 60%)' }} />
        </div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-[18px] flex items-center justify-center relative overflow-hidden shadow-xl" style={{ background: 'linear-gradient(135deg, #FF6D70 0%, #FF9A9C 100%)' }}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent" />
                <Trophy size={28} color="white" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="text-xl font-black text-text mb-1">Achievement Badges</h2>
                <p className="text-sm text-muted">Keep your streak alive to unlock exclusive badges</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 rounded-[18px] shadow-lg" style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)', border: '2px solid #FB923C' }}>
              <Flame size={18} color="#EA580C" fill="#EA580C" className="animate-pulse" />
              <span className="text-sm font-black text-orange-800">23 Day Streak</span>
            </div>
          </div>

          {/* Badges Grid - Professional Design */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {[
              { 
                icon: Sparkles,
                name: 'Getting Started', 
                days: 3, 
                unlocked: true,
                primaryColor: '#10B981',
                secondaryColor: '#34D399',
                bgColor: '#ECFDF5',
                unlockedDate: 'Nov 28'
              },
              { 
                icon: Flame,
                name: 'Week Warrior', 
                days: 7, 
                unlocked: true,
                primaryColor: '#F59E0B',
                secondaryColor: '#FBBF24',
                bgColor: '#FFF7ED',
                unlockedDate: 'Dec 2'
              },
              { 
                icon: Zap,
                name: 'Two Week Champion', 
                days: 14, 
                unlocked: true,
                primaryColor: '#8B5CF6',
                secondaryColor: '#A78BFA',
                bgColor: '#F5F3FF',
                unlockedDate: 'Dec 9'
              },
              { 
                icon: Award,
                name: 'Monthly Master', 
                days: 30, 
                unlocked: false,
                primaryColor: '#EF4444',
                secondaryColor: '#F87171',
                bgColor: '#FEF2F2',
                unlockedDate: null
              },
              { 
                icon: Gem,
                name: 'Learning Legend', 
                days: 60, 
                unlocked: false,
                primaryColor: '#3B82F6',
                secondaryColor: '#60A5FA',
                bgColor: '#EFF6FF',
                unlockedDate: null
              },
              { 
                icon: Crown,
                name: 'Century Scholar', 
                days: 100, 
                unlocked: false,
                primaryColor: '#EC4899',
                secondaryColor: '#F472B6',
                bgColor: '#FDF2F8',
                unlockedDate: null
              },
            ].map((badge, index) => {
              const IconComponent = badge.icon;
              return (
                <div
                  key={badge.name}
                  className={`group relative rounded-[24px] overflow-hidden transition-all duration-300 ${
                    badge.unlocked 
                      ? 'hover:-translate-y-3 hover:shadow-2xl cursor-pointer' 
                      : 'cursor-not-allowed'
                  }`}
                  style={{
                    background: badge.unlocked ? 'white' : '#FAFAFA',
                    border: badge.unlocked 
                      ? `2px solid ${badge.primaryColor}20` 
                      : '2px solid #E5E5E5',
                    boxShadow: badge.unlocked 
                      ? `0 4px 20px ${badge.primaryColor}15` 
                      : '0 2px 8px rgba(0,0,0,0.04)',
                    animation: badge.unlocked ? `fadeIn 0.6s ease-out ${index * 0.15}s backwards` : 'none',
                  }}
                >
                  {/* Top gradient bar */}
                  {badge.unlocked && (
                    <div className="absolute top-0 left-0 right-0 h-1" style={{ background: `linear-gradient(90deg, ${badge.primaryColor} 0%, ${badge.secondaryColor} 100%)` }} />
                  )}

                  {/* Content */}
                  <div className="p-5">
                    {/* Badge Icon - Premium Design */}
                    <div className="relative mb-4">
                      <div 
                        className={`w-20 h-20 mx-auto rounded-[20px] flex items-center justify-center relative overflow-hidden transition-all duration-300 ${
                          badge.unlocked ? 'group-hover:scale-110' : ''
                        }`}
                        style={{
                          background: badge.unlocked 
                            ? `linear-gradient(135deg, ${badge.primaryColor} 0%, ${badge.secondaryColor} 100%)`
                            : 'linear-gradient(135deg, #E5E5E5 0%, #D4D4D8 100%)',
                          boxShadow: badge.unlocked 
                            ? `0 8px 24px ${badge.primaryColor}40, inset 0 1px 2px rgba(255,255,255,0.3)` 
                            : 'inset 0 2px 4px rgba(0,0,0,0.1)',
                        }}
                      >
                        {/* Glossy overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/10" />
                        
                        {/* Icon */}
                        <IconComponent 
                          size={36} 
                          color="white" 
                          strokeWidth={2.5}
                          fill={badge.icon === Flame || badge.icon === Crown ? 'white' : 'none'}
                          className="relative z-10"
                        />
                        
                        {/* Lock overlay for locked badges */}
                        {!badge.unlocked && (
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-20">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                              <rect x="6" y="11" width="12" height="9" rx="2" fill="white" fillOpacity="0.9"/>
                              <path d="M8 11V7C8 5.34315 9.34315 4 11 4H13C14.6569 4 16 5.34315 16 7V11" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
                              <circle cx="12" cy="15.5" r="1.5" fill="#666"/>
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Sparkle indicator for unlocked */}
                      {badge.unlocked && (
                        <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center shadow-lg" style={{ background: badge.primaryColor }}>
                          <Star size={14} fill="white" color="white" />
                        </div>
                      )}
                    </div>

                    {/* Badge Info */}
                    <div className="text-center">
                      <h3 className={`font-black text-sm mb-1 ${badge.unlocked ? 'text-text' : 'text-muted'}`}>
                        {badge.name}
                      </h3>
                      <div className="flex items-center justify-center gap-1 mb-3">
                        <div 
                          className="w-1.5 h-1.5 rounded-full" 
                          style={{ background: badge.unlocked ? badge.primaryColor : '#D4D4D8' }}
                        />
                        <p className="text-xs font-bold text-muted">{badge.days} Days</p>
                        <div 
                          className="w-1.5 h-1.5 rounded-full" 
                          style={{ background: badge.unlocked ? badge.primaryColor : '#D4D4D8' }}
                        />
                      </div>
                      
                      {badge.unlocked && badge.unlockedDate ? (
                        <div 
                          className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide"
                          style={{ 
                            background: `${badge.primaryColor}15`,
                            color: badge.primaryColor 
                          }}
                        >
                          Unlocked {badge.unlockedDate}
                        </div>
                      ) : (
                        <div className="px-3 py-1.5 rounded-xl text-[10px] font-bold bg-gray-100 text-muted">
                          {badge.days - 23} days remaining
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hover glow effect */}
                  {badge.unlocked && (
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-[24px]"
                      style={{ 
                        boxShadow: `0 0 40px ${badge.primaryColor}40, inset 0 0 20px ${badge.primaryColor}10` 
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Progress Bar to Next Badge - Elegant Design */}
          <div className="mt-8 p-6 rounded-[24px] relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)', border: '2px solid #FCD34D' }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20" style={{ background: '#F59E0B' }} />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[14px] flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #EF4444 0%, #F87171 100%)', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}>
                    <Award size={20} color="white" strokeWidth={2.5} />
                  </div>
                  <span className="text-base font-black text-text">Next: Monthly Master Badge</span>
                </div>
                <span className="text-sm font-black text-orange-700">23 / 30 days</span>
              </div>
              
              <div className="h-4 bg-white rounded-full overflow-hidden shadow-inner relative">
                <div 
                  className="h-full rounded-full transition-all duration-1000 relative overflow-hidden"
                  style={{ 
                    width: '77%',
                    background: 'linear-gradient(90deg, #F59E0B 0%, #EF4444 100%)',
                    boxShadow: '0 2px 8px rgba(245, 158, 11, 0.4)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
                </div>
              </div>
              
              <p className="text-xs font-semibold text-center mt-3" style={{ color: '#92400E' }}>
                Only 7 more days to unlock your Monthly Master badge! Keep the momentum going! 💪
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


