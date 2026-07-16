import { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { X, Share2, Trophy } from 'lucide-react';
import { Badge } from '../utils/streakTracking';

interface StreakCelebrationProps {
  badges: Badge[];
  onClose: () => void;
}

export default function StreakCelebration({ badges, onClose }: StreakCelebrationProps) {
  useEffect(() => {
    // Launch confetti
    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: badges.map((b) => b.color),
        zIndex: 10000,
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: badges.map((b) => b.color),
        zIndex: 10000,
      });
    }, 250);

    return () => clearInterval(interval);
  }, [badges]);

  const badge = badges[0]; // Show first badge (usually only one unlocked at a time)

  const handleShare = () => {
    const text = `I just unlocked the "${badge.name}" badge on Coursera! 🎉 ${badge.streakRequired} day learning streak!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Achievement Unlocked!',
        text: text,
      }).catch(() => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="relative max-w-md w-full animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-all duration-200 hover:scale-110 z-10"
          style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
        >
          <X size={18} color="#6B6B7B" />
        </button>

        {/* Main card */}
        <div
          className="rounded-4xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #0F0F0F 0%, #1a1a2e 50%, #16213e 100%)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          }}
        >
          {/* Decorative orbs */}
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-15"
            style={{
              background: `radial-gradient(circle, ${badge.color}, transparent 70%)`,
              transform: 'translate(30%, -30%)',
            }}
          />

          <div className="relative z-10 p-8 text-center">
            {/* Badge icon */}
            <div
              className="w-24 h-24 rounded-full mx-auto mb-5 flex items-center justify-center text-5xl"
              style={{
                background: `linear-gradient(135deg, ${badge.color} 0%, ${badge.color}dd 100%)`,
                animation: 'pulse 2s ease-in-out infinite',
                boxShadow: `0 8px 32px ${badge.color}66`,
              }}
            >
              {badge.icon}
            </div>

            {/* Message */}
            <h1 className="text-3xl font-black text-white mb-2">Achievement Unlocked!</h1>
            <p className="text-xl font-bold text-white/90 mb-4">{badge.name}</p>

            {/* Badge details */}
            <div
              className="inline-block px-4 py-2 rounded-2xl mb-6"
              style={{
                background: `${badge.color}20`,
                border: `1px solid ${badge.color}40`,
              }}
            >
              <p className="text-sm font-bold" style={{ color: badge.color }}>
                {badge.description}
              </p>
            </div>

            {/* Stats */}
            <div
              className="p-4 rounded-2xl mb-6"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy size={20} style={{ color: badge.color }} />
                <p className="text-2xl font-black text-white">{badge.streakRequired} Days</p>
              </div>
              <p className="text-sm text-white/60">Learning Streak Achieved</p>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <button
                onClick={handleShare}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-200 hover:opacity-90"
                style={{
                  background: `linear-gradient(135deg, ${badge.color} 0%, ${badge.color}dd 100%)`,
                  color: 'white',
                  boxShadow: `0 8px 24px ${badge.color}40`,
                }}
              >
                <Share2 size={18} />
                Share Achievement
              </button>

              <button
                onClick={onClose}
                className="w-full px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 hover:bg-white/20"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              >
                Continue Learning
              </button>
            </div>

            {/* Motivational quote */}
            <p className="text-white/40 text-xs mt-6 italic">
              "Success is the sum of small efforts repeated day in and day out."
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}
