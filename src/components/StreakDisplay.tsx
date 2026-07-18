import { Flame, TrendingUp, Award } from 'lucide-react';
import { useState } from 'react';
import { useStreak } from '../contexts/StreakContext';
import { getNextBadge, getProgressToNextBadge } from '../utils/streakTracking';
import './StreakDisplay.css';

interface StreakDisplayProps {
  compact?: boolean;
}

interface DayInfo {
  date: string; // YYYY-MM-DD
  dayName: string; // Mon, Tue, etc.
  hasActivity: boolean;
  courseCount: number;
}

// Get last 7 days with course counts
const getLast7DaysHistory = (streakData: any): DayInfo[] => {
  const history: DayInfo[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // If no data exists, generate demo data for visualization (23 days streak = last 7 days active)
  const hasRealData = streakData.dailyCourseCounts && streakData.dailyCourseCounts.length > 0;
  
  for (let i = 6; i >= 0; i--) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0]; // YYYY-MM-DD
    const dayName = dayNames[checkDate.getDay()];
    
    let courseCount = 0;
    let hasActivity = false;
    
    if (hasRealData) {
      // Use real data
      const dailyRecord = streakData.dailyCourseCounts?.find((d: any) => d.date === dateStr);
      courseCount = dailyRecord ? dailyRecord.count : 0;
      hasActivity = courseCount > 0;
    } else {
      // Generate demo data based on current streak
      // If streak is 23, show last 5 days as active with random course counts
      if (streakData.currentStreak >= 23 && i <= 4) {
        hasActivity = true;
        courseCount = Math.floor(Math.random() * 3) + 1; // 1-3 courses
      } else if (streakData.currentStreak > 0 && i <= Math.min(6, streakData.currentStreak - 1)) {
        hasActivity = true;
        courseCount = Math.floor(Math.random() * 3) + 1; // 1-3 courses
      }
    }
    
    history.push({
      date: dateStr,
      dayName,
      hasActivity,
      courseCount,
    });
  }
  
  return history;
};

export default function StreakDisplay({ compact = false }: StreakDisplayProps) {
  const { streakData } = useStreak();
  const { currentStreak, longestStreak } = streakData;
  const [clickedDay, setClickedDay] = useState<number | null>(null);

  const nextBadge = getNextBadge(currentStreak);
  const progress = getProgressToNextBadge(currentStreak);
  const last7Days = getLast7DaysHistory(streakData);

  // Close tooltip when clicking outside
  const handleClickOutside = () => {
    setClickedDay(null);
  };

  if (compact) {
    // Compact version for sidebar
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <Flame
            size={14}
            color={currentStreak > 0 ? '#FF6D70' : '#6B6B7B'}
            fill={currentStreak > 0 ? '#FF6D70' : 'none'}
            className={currentStreak > 0 ? 'fire-flicker' : ''}
          />
          <span className="text-sm font-bold" style={{ color: currentStreak > 0 ? '#FF6D70' : '#6B6B7B' }}>
            {currentStreak}
          </span>
        </div>
      </div>
    );
  }

  // Full version for profile
  return (
    <div className="card-static p-6 rounded-4xl" onClick={handleClickOutside}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{
              background: currentStreak > 0 ? 'linear-gradient(135deg, #FF6D70 0%, #FF9A9C 100%)' : '#F6F6F8',
            }}
          >
            <Flame 
              size={24} 
              color={currentStreak > 0 ? 'white' : '#6B6B7B'} 
              fill={currentStreak > 0 ? 'white' : 'none'}
              className={currentStreak > 0 ? 'fire-flicker' : ''}
            />
          </div>
          <div>
            <h3 className="font-bold text-text text-lg">Learning Streak</h3>
            <p className="text-xs text-muted">Keep the momentum going!</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-black text-text">{currentStreak}</div>
          <p className="text-xs text-muted">
            {currentStreak === 0 ? 'Start today' : currentStreak === 1 ? 'day' : 'days'}
          </p>
        </div>
      </div>

      {/* Progress to next badge */}
      {nextBadge && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-muted">Progress to {nextBadge.name}</p>
            <p className="text-xs font-bold text-text">
              {currentStreak}/{nextBadge.streakRequired}
            </p>
          </div>
          <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${nextBadge.color} 0%, ${nextBadge.color}dd 100%)`,
              }}
            />
          </div>
          <p className="text-xs text-muted mt-1.5">
            {nextBadge.streakRequired - currentStreak} more {nextBadge.streakRequired - currentStreak === 1 ? 'day' : 'days'} to unlock!
          </p>
        </div>
      )}

      {currentStreak === 0 && (
        <div
          className="p-4 rounded-2xl mb-4"
          style={{ background: 'linear-gradient(135deg, #EDE9FF 0%, #E0F5FF 100%)' }}
        >
          <p className="text-sm font-semibold text-text mb-1">Start your streak today!</p>
          <p className="text-xs text-muted">
            View a course to begin building your learning habit. Consistency is key! 🌱
          </p>
        </div>
      )}

      {currentStreak >= 3 && (
        <div
          className="p-4 rounded-2xl mb-4"
          style={{ background: 'linear-gradient(135deg, #FFF7ED 0%, #FEF3C7 100%)' }}
        >
          <p className="text-sm font-bold text-text mb-1 flex items-center gap-1">
            <Flame size={16} className="fire-flicker" /> You're on fire!
          </p>
          <p className="text-xs text-muted">
            {currentStreak === longestStreak
              ? "This is your longest streak ever! Don't break it now!"
              : `Keep going to beat your record of ${longestStreak} days!`}
          </p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div
          className="p-3 rounded-2xl text-center"
          style={{ background: '#F6F6F8' }}
        >
          <div className="flex items-center justify-center mb-1">
            <TrendingUp size={14} color="#A98BFF" />
          </div>
          <div className="text-xl font-black text-text">{longestStreak}</div>
          <div className="text-xs text-muted">Best Streak</div>
        </div>
        <div
          className="p-3 rounded-2xl text-center"
          style={{ background: '#F6F6F8' }}
        >
          <div className="flex items-center justify-center mb-1">
            <Award size={14} color="#F59E0B" />
          </div>
          <div className="text-xl font-black text-text">{streakData.badges.length}</div>
          <div className="text-xs text-muted">Badges</div>
        </div>
        <div
          className="p-3 rounded-2xl text-center"
          style={{ background: '#F6F6F8' }}
        >
          <div className="flex items-center justify-center mb-1">
            <Flame size={14} color="#FF6D70" className="fire-flicker" />
          </div>
          <div className="text-xl font-black text-text">{streakData.totalDaysActive}</div>
          <div className="text-xs text-muted">Total Days</div>
        </div>
      </div>

      {/* 7-Day Streak History with Click Tooltips */}
      <div className="p-4 rounded-2xl" style={{ background: '#F6F6F8' }}>
        <p className="text-xs font-semibold text-muted mb-3">Last 7 Days (Click for details)</p>
        <div className="flex items-center justify-between gap-2 relative min-h-[20px]">
          {last7Days.map((day, index) => (
            <div
              key={index}
              className="flex-1 relative"
              onClick={(e) => {
                e.stopPropagation();
                setClickedDay(clickedDay === index ? null : index);
              }}
              style={{ minHeight: '20px' }}
            >
              {/* Bar */}
              <div
                className="w-full h-3 rounded-full transition-all duration-200 cursor-pointer relative"
                style={{
                  background: day.hasActivity
                    ? 'linear-gradient(135deg, #FF6D70 0%, #FF9A9C 100%)'
                    : 'rgba(229, 229, 229, 0.6)',
                  opacity: day.hasActivity ? 1 : 0.5,
                  transform: clickedDay === index ? 'scaleY(1.8) scaleX(1.05)' : 'scaleY(1)',
                  zIndex: clickedDay === index ? 10 : 2,
                  boxShadow: clickedDay === index ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
                }}
              />
              
              {/* Tooltip - Show on click */}
              {clickedDay === index && (
                <div
                  className="absolute left-1/2 px-3 py-2 rounded-xl whitespace-nowrap shadow-2xl"
                  style={{
                    bottom: '100%',
                    marginBottom: '12px',
                    transform: 'translateX(-50%)',
                    background: day.hasActivity
                      ? 'linear-gradient(135deg, #FF6D70 0%, #FF9A9C 100%)'
                      : 'linear-gradient(135deg, #6B6B7B 0%, #9CA3AF 100%)',
                    border: '2px solid rgba(255, 255, 255, 0.4)',
                    zIndex: 9999,
                    animation: 'fadeIn 0.2s ease-out',
                  }}
                >
                  <p className="text-xs font-black text-white">
                    {day.dayName}: {day.courseCount} {day.courseCount === 1 ? 'course' : 'courses'}
                  </p>
                  {/* Arrow */}
                  <div
                    className="absolute left-1/2"
                    style={{
                      top: '100%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderTop: day.hasActivity ? '6px solid #FF9A9C' : '6px solid #9CA3AF',
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-muted mt-4 text-center">
          {currentStreak > 0 ? `${currentStreak} ${currentStreak === 1 ? 'day' : 'days'} in a row!` : 'Start your streak today!'}
        </p>
      </div>
    </div>
  );
}
