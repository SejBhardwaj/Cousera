import { Flame, TrendingUp, Award } from 'lucide-react';
import { useStreak } from '../contexts/StreakContext';
import { getNextBadge, getProgressToNextBadge } from '../utils/streakTracking';
import './StreakDisplay.css';

interface StreakDisplayProps {
  compact?: boolean;
}

export default function StreakDisplay({ compact = false }: StreakDisplayProps) {
  const { streakData } = useStreak();
  const { currentStreak, longestStreak } = streakData;

  const nextBadge = getNextBadge(currentStreak);
  const progress = getProgressToNextBadge(currentStreak);

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
    <div className="card-static p-6 rounded-4xl">
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
      <div className="grid grid-cols-3 gap-3">
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
    </div>
  );
}
