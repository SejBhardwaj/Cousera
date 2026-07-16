import { Edit3, Award, BookOpen, Clock, TrendingUp, Star, MapPin, Link2, Twitter, Linkedin, Target, Trophy, Library, GraduationCap, Zap } from 'lucide-react';
import StreakDisplay from '../components/StreakDisplay';
import BadgeCollection from '../components/BadgeCollection';
import { useStreak } from '../contexts/StreakContext';
import { useEffect, useState } from 'react';
import StreakCelebration from '../components/StreakCelebration';

const SKILLS = [
  { name: 'Python', level: 82, color: '#D7FF54' },
  { name: 'Machine Learning', level: 68, color: '#A98BFF' },
  { name: 'SQL', level: 90, color: '#83D6FF' },
  { name: 'Statistics', level: 75, color: '#7DEBA3' },
  { name: 'Deep Learning', level: 45, color: '#FF6D70' },
];

const ACTIVITY = [
  { date: 'Today', action: 'Completed', item: 'Neural Networks lecture', icon: <Target size={16} /> },
  { date: 'Yesterday', action: 'Earned badge', item: 'Python Master', icon: <Trophy size={16} /> },
  { date: '2 days ago', action: 'Enrolled in', item: 'AWS Solutions Architect', icon: <Library size={16} /> },
  { date: '1 week ago', action: 'Completed', item: 'IBM Data Science Certificate', icon: <GraduationCap size={16} /> },
];

export default function Profile() {
  const { newBadges, clearNewBadges } = useStreak();
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    if (newBadges.length > 0) {
      setShowCelebration(true);
    }
  }, [newBadges]);

  const handleCloseCelebration = () => {
    setShowCelebration(false);
    clearNewBadges();
  };

  return (
    <div className="flex-1 py-4 pr-4 pl-2 overflow-y-auto no-scrollbar space-y-5 animate-in">

      {/* Profile Header */}
      <div className="card-static p-7 rounded-4xl">
        <div className="flex items-start gap-6">
          <div className="relative flex-shrink-0">
            <img
              src="https://i.pravatar.cc/150?img=45"
              alt="Profile"
              className="w-24 h-24 rounded-3xl object-cover"
            />
            <div
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl flex items-center justify-center cursor-pointer hover:opacity-80"
              style={{ background: '#D7FF54' }}
            >
              <Edit3 size={13} color="#111" />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-black text-text">Alex Rivera</h1>
                <p className="text-muted text-sm mt-0.5">Data Science & ML Enthusiast</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted">
                  <span className="flex items-center gap-1"><MapPin size={11} /> San Francisco, CA</span>
                  <span className="flex items-center gap-1"><Link2 size={11} /> alexrivera.dev</span>
                </div>
              </div>
              <button className="btn-secondary text-sm">Edit Profile</button>
            </div>

            <p className="text-sm text-muted leading-relaxed mt-3 max-w-lg">
              Aspiring ML Engineer passionate about turning data into insight. Building toward a career in production ML systems.
            </p>

            <div className="flex items-center gap-4 mt-4">
              <button className="w-8 h-8 rounded-xl flex items-center justify-center border border-border hover:bg-bg transition-colors">
                <Twitter size={14} color="#6B6B7B" />
              </button>
              <button className="w-8 h-8 rounded-xl flex items-center justify-center border border-border hover:bg-bg transition-colors">
                <Linkedin size={14} color="#6B6B7B" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Courses', value: '8', icon: <BookOpen size={16} color="#A98BFF" />, bg: '#EDE9FF' },
          { label: 'Hours', value: '142h', icon: <Clock size={16} color="#83D6FF" />, bg: '#E0F5FF' },
          { label: 'Certificates', value: '3', icon: <Award size={16} color="#F59E0B" />, bg: '#FFF7ED' },
          { label: 'Streak', value: '23d', icon: <TrendingUp size={16} color="#7DEBA3" />, bg: '#ECFDF5' },
        ].map((s) => (
          <div key={s.label} className="card-static p-5 rounded-3xl">
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center mb-3" style={{ background: s.bg }}>
              {s.icon}
            </div>
            <div className="text-2xl font-black text-text">{s.value}</div>
            <div className="text-xs text-muted">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Streak Display */}
      <StreakDisplay />

      {/* Badge Collection */}
      <BadgeCollection />

      <div className="grid grid-cols-5 gap-4">
        {/* Skills */}
        <div className="col-span-3 card-static p-6 rounded-4xl">
          <h2 className="text-card-title text-text mb-5">Skill Progress</h2>
          <div className="space-y-4">
            {SKILLS.map((s) => (
              <div key={s.name}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm font-semibold text-text">{s.name}</span>
                  <span className="text-sm font-bold" style={{ color: s.color }}>{s.level}%</span>
                </div>
                <div className="h-2.5 rounded-full bg-gray-100">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${s.level}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="col-span-2 card-static p-6 rounded-4xl">
          <h2 className="text-card-title text-text mb-5">Achievements</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <Trophy size={20} />, label: 'Streak Master', unlocked: true, color: '#D7FF54' },
              { icon: <Target size={20} />, label: 'Goal Crusher', unlocked: true, color: '#A98BFF' },
              { icon: <Library size={20} />, label: 'Bookworm', unlocked: true, color: '#83D6FF' },
              { icon: <Zap size={20} />, label: 'Speed Learner', unlocked: false, color: '#F0F0F5' },
              { icon: <Star size={20} />, label: 'Top Learner', unlocked: false, color: '#F0F0F5' },
              { icon: <GraduationCap size={20} />, label: 'Graduate', unlocked: false, color: '#F0F0F5' },
            ].map((a) => (
              <div
                key={a.label}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl text-center"
                style={{ background: a.unlocked ? a.color + '20' : '#F6F6F8', opacity: a.unlocked ? 1 : 0.5 }}
              >
                <div className="text-text">{a.icon}</div>
                <span className="text-[10px] font-semibold text-text leading-tight">{a.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card-static p-6 rounded-4xl">
        <h2 className="text-card-title text-text mb-5">Recent Activity</h2>
        <div className="space-y-3">
          {ACTIVITY.map((a, i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-3xl hover:bg-bg transition-colors">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 text-text" style={{ background: '#F6F6F8' }}>
                {a.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm text-text">
                  <span className="font-semibold">{a.action}</span> {a.item}
                </p>
                <p className="text-xs text-muted mt-0.5">{a.date}</p>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} size={10} fill={j < 5 ? '#F59E0B' : 'none'} color="#F59E0B" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="h-4" />

      {/* Streak Celebration Modal */}
      {showCelebration && newBadges.length > 0 && (
        <StreakCelebration badges={newBadges} onClose={handleCloseCelebration} />
      )}
    </div>
  );
}
