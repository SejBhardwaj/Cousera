import { BookOpen, Clock, Trophy, TrendingUp, Play, ChevronRight, Star, BarChart2 } from 'lucide-react';
import CourseCard, { Course } from '../components/CourseCard';
import { useOffline } from '../contexts/OfflineContext';

const IN_PROGRESS: Course[] = [
  {
    id: 'ml1',
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
    id: 'ml2',
    title: 'Full-Stack Web Development',
    provider: 'Meta',
    instructor: 'Sarah Johnson',
    instructorImg: 'https://i.pravatar.cc/150?img=45',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
    category: 'Development',
    categoryColor: '#83D6FF',
    rating: 4.8,
    reviews: 94200,
    duration: '9 months',
    difficulty: 'Intermediate',
    progress: 34,
    enrolled: true,
  },
  {
    id: 'ml3',
    title: 'Python for Data Science',
    provider: 'IBM',
    instructor: 'Alex Chen',
    instructorImg: 'https://i.pravatar.cc/150?img=33',
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&q=80',
    category: 'Data Science',
    categoryColor: '#D7FF54',
    rating: 4.7,
    reviews: 76500,
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
  const maxHours = Math.max(...WEEKLY_DATA.map((d) => d.hours));

  return (
    <div className="flex-1 py-4 pr-4 pl-2 overflow-y-auto no-scrollbar space-y-5 animate-in">

      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4">
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

      {/* In Progress */}
      <div className="card-static p-6 rounded-4xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-card-title text-text">In Progress</h2>
          <span className="tag text-xs" style={{ background: '#EDE9FF', color: '#A98BFF' }}>3 active</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
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
          <div className="flex items-end gap-3 h-40">
            {WEEKLY_DATA.map((d, i) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-xs font-bold text-text opacity-0 group-hover:opacity-100" style={{ height: '16px' }}>
                  {d.hours}h
                </div>
                <div className="w-full flex flex-col items-center">
                  <div
                    className="w-full rounded-2xl transition-all duration-700"
                    style={{
                      height: `${(d.hours / maxHours) * 120}px`,
                      background: i === 2 ? '#D7FF54' : i === 6 ? '#A98BFF' : '#F0F0F5',
                      minHeight: '8px',
                    }}
                  />
                </div>
                <span className="text-xs text-muted font-medium">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: '#D7FF54' }} />
              <span className="text-xs text-muted">Best day</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: '#A98BFF' }} />
              <span className="text-xs text-muted">This week avg</span>
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
    </div>
  );
}
