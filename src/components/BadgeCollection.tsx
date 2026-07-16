import { Lock } from 'lucide-react';
import { useStreak } from '../contexts/StreakContext';
import { getAllBadgesWithStatus } from '../utils/streakTracking';

export default function BadgeCollection() {
  const { streakData } = useStreak();
  const badges = getAllBadgesWithStatus(streakData);

  return (
    <div className="card-static p-6 rounded-4xl">
      <div className="mb-5">
        <h3 className="font-bold text-text text-lg mb-1">Achievement Badges</h3>
        <p className="text-xs text-muted">
          Unlock badges by maintaining your learning streak
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="relative p-4 rounded-3xl text-center transition-all duration-300"
            style={{
              background: badge.locked
                ? '#F6F6F8'
                : `linear-gradient(135deg, ${badge.color}20 0%, ${badge.color}10 100%)`,
              border: badge.locked ? '2px dashed #E5E5EA' : `2px solid ${badge.color}40`,
              opacity: badge.locked ? 0.5 : 1,
            }}
          >
            {/* Badge icon */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl"
              style={{
                background: badge.locked ? '#E5E5EA' : badge.color + '30',
              }}
            >
              {badge.locked ? <Lock size={24} color="#6B6B7B" /> : badge.icon}
            </div>

            {/* Badge info */}
            <div>
              <p
                className="font-bold text-sm mb-1"
                style={{ color: badge.locked ? '#6B6B7B' : '#0F0F0F' }}
              >
                {badge.name}
              </p>
              <p className="text-xs text-muted mb-2">{badge.description}</p>
              
              {badge.locked ? (
                <div
                  className="px-2 py-1 rounded-full text-xs font-bold inline-block"
                  style={{ background: '#E5E5EA', color: '#6B6B7B' }}
                >
                  {badge.streakRequired} days
                </div>
              ) : (
                <div
                  className="px-2 py-1 rounded-full text-xs font-bold inline-block"
                  style={{ background: badge.color, color: 'white' }}
                >
                  Unlocked!
                </div>
              )}
            </div>

            {/* Unlock date */}
            {!badge.locked && badge.unlockedAt && (
              <p className="text-xs text-muted mt-2">
                {new Date(badge.unlockedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Progress summary */}
      <div
        className="mt-5 p-4 rounded-2xl"
        style={{ background: 'linear-gradient(135deg, #EDE9FF 0%, #E0F5FF 100%)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-sm text-text">Collection Progress</p>
            <p className="text-xs text-muted">
              {streakData.badges.length} of {badges.length} badges unlocked
            </p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-text">
              {Math.round((streakData.badges.length / badges.length) * 100)}%
            </p>
          </div>
        </div>
        <div className="h-2 bg-white/60 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${(streakData.badges.length / badges.length) * 100}%`,
              background: 'linear-gradient(90deg, #A98BFF 0%, #83D6FF 100%)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
