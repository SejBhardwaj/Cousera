import { useState, useEffect } from 'react';
import { Target, Flame, Clock, Sparkles, Calendar, Trophy, BookMarked, TrendingUp, ChevronRight, Play, Pause } from 'lucide-react';

const GOALS = [
  { label: 'Complete Python Module', done: true },
  { label: 'Watch ML lecture', done: true },
  { label: 'Practice exercises', done: false },
  { label: 'Read course notes', done: false },
];

const DEADLINES = [
  { title: 'ML Assignment #3', course: 'Machine Learning A-Z', dueIn: '2 days', accent: '#FF6D70' },
  { title: 'Quiz: Data Structures', course: 'CS Fundamentals', dueIn: '4 days', accent: '#A98BFF' },
  { title: 'Final Project', course: 'UI/UX Design', dueIn: '1 week', accent: '#83D6FF' },
];

const CERTS = [
  { name: 'Python for Everybody', org: 'University of Michigan', date: 'Jun 2024', color: '#D7FF54' },
  { name: 'Data Science', org: 'IBM', date: 'Apr 2024', color: '#A98BFF' },
];

function ProgressRing({ percent, color, size = 80 }: { percent: number; color: string; size?: number }) {
  const r = (size - 12) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - percent / 100);
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#F0F0F5" strokeWidth={6} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
      />
    </svg>
  );
}

function StudyTimer() {
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(25 * 60);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, [running]);

  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');

  return (
    <div
      className="rounded-3xl p-5"
      style={{ background: '#111111' }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock size={15} color="#D7FF54" />
        <span className="text-sm font-bold text-white">Study Timer</span>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-4xl font-bold text-white tracking-tight">{m}:{s}</div>
          <div className="text-xs text-white/40 mt-1">Pomodoro Session</div>
        </div>
        <button
          onClick={() => setRunning(!running)}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          style={{ background: '#D7FF54' }}
        >
          {running ? <Pause size={18} fill="#111" color="#111" /> : <Play size={18} fill="#111" color="#111" />}
        </button>
      </div>
    </div>
  );
}

export default function RightPanel() {
  const weekDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const hours = [1.5, 2.8, 3.2, 0.5, 2.0, 1.8, 2.5];
  const maxH = Math.max(...hours);

  return (
    <aside
      className="flex flex-col gap-4 py-4 pr-4 pl-2 w-72 min-w-72 sticky top-3 h-[calc(100vh-24px)] overflow-y-auto no-scrollbar"
      style={{ paddingTop: '16px' }}
    >
      {/* Today's Goal */}
      <div className="card-static p-5 rounded-3xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl flex items-center justify-center" style={{ background: '#EDE9FF' }}>
              <Target size={15} color="#A98BFF" />
            </div>
            <span className="text-sm font-bold text-text">Today's Goals</span>
          </div>
          <span className="text-xs font-semibold text-muted">2/4</span>
        </div>
        <div className="space-y-2.5">
          {GOALS.map((g, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all duration-200"
                style={{
                  borderColor: g.done ? '#A98BFF' : '#E0E0E8',
                  background: g.done ? '#A98BFF' : 'transparent',
                }}
              >
                {g.done && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span className={`text-xs ${g.done ? 'line-through text-muted' : 'text-text font-medium'}`}>{g.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="card-static p-5 rounded-3xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl flex items-center justify-center" style={{ background: '#ECFDF5' }}>
              <TrendingUp size={15} color="#059669" />
            </div>
            <span className="text-sm font-bold text-text">Weekly Progress</span>
          </div>
          <div className="relative w-14 h-14">
            <ProgressRing percent={68} color="#7DEBA3" size={56} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-text">68%</span>
            </div>
          </div>
        </div>
        <div className="flex items-end gap-1.5 h-16">
          {weekDays.map((day, i) => (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <div
                className="w-full rounded-full transition-all duration-700"
                style={{
                  height: `${(hours[i] / maxH) * 52}px`,
                  background: i === 4 ? '#D7FF54' : '#F0F0F5',
                  minHeight: '6px',
                }}
              />
              <span className="text-[9px] text-muted font-medium">{day}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-2 text-center">14.3h studied this week</p>
      </div>

      {/* Learning Streak */}
      <div
        className="p-5 rounded-3xl"
        style={{ background: 'linear-gradient(135deg, #FF6D70 0%, #FF9A8B 100%)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Flame size={18} color="white" fill="white" />
          <span className="text-sm font-bold text-white">Learning Streak</span>
        </div>
        <div className="text-5xl font-black text-white mb-1">23</div>
        <div className="text-white/80 text-xs mb-3">days in a row! Keep it up.</div>
        <div className="flex gap-1.5">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-2 rounded-full"
              style={{ background: i < 5 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)' }}
            />
          ))}
        </div>
      </div>

      {/* AI Mentor */}
      <div
        className="p-5 rounded-3xl"
        style={{ background: '#D7FF54' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} color="#111111" />
          <span className="text-sm font-bold text-text">AI Mentor</span>
        </div>
        <p className="text-xs text-text/70 leading-relaxed mb-4">
          Based on your progress, I suggest reviewing <strong>Neural Networks basics</strong> before moving forward.
        </p>
        <button className="w-full py-2.5 rounded-2xl bg-text text-white text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          Get Recommendations
          <ChevronRight size={13} />
        </button>
      </div>

      {/* Upcoming Deadlines */}
      <div className="card-static p-5 rounded-3xl">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-2xl flex items-center justify-center" style={{ background: '#FFF0F0' }}>
            <Calendar size={15} color="#FF6D70" />
          </div>
          <span className="text-sm font-bold text-text">Deadlines</span>
        </div>
        <div className="space-y-3">
          {DEADLINES.map((d, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: d.accent }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-text truncate">{d.title}</p>
                <p className="text-xs text-muted truncate">{d.course}</p>
              </div>
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ background: d.accent + '20', color: d.accent }}
              >
                {d.dueIn}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Study Timer */}
      <StudyTimer />

      {/* Certificates */}
      <div className="card-static p-5 rounded-3xl">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-2xl flex items-center justify-center" style={{ background: '#FFF7ED' }}>
            <Trophy size={15} color="#F59E0B" />
          </div>
          <span className="text-sm font-bold text-text">Certificates</span>
        </div>
        <div className="space-y-3">
          {CERTS.map((c, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-2xl" style={{ background: '#F6F6F8' }}>
              <div className="w-8 h-8 rounded-xl flex-shrink-0" style={{ background: c.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-text truncate">{c.name}</p>
                <p className="text-[10px] text-muted">{c.org} · {c.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bookmarks */}
      <div className="card-static p-5 rounded-3xl">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-2xl flex items-center justify-center" style={{ background: '#EFF6FF' }}>
            <BookMarked size={15} color="#3B82F6" />
          </div>
          <span className="text-sm font-bold text-text">Bookmarks</span>
        </div>
        <div className="space-y-2">
          {['Deep Learning Specialization', 'React for Beginners', 'Product Management'].map((b, i) => (
            <div key={i} className="text-xs text-text font-medium py-2 px-3 rounded-xl hover:bg-bg transition-colors cursor-pointer">
              {b}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
