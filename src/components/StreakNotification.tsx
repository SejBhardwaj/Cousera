import { useEffect, useState } from 'react';
import { X, Flame } from 'lucide-react';
import Lottie from 'lottie-react';

interface StreakNotificationProps {
  streakCount: number;
  onClose: () => void;
}

export default function StreakNotification({ streakCount, onClose }: StreakNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [fireAnimation, setFireAnimation] = useState<any>(null);

  useEffect(() => {
    // Load fire animation
    fetch('/Fire Streak Orange.json')
      .then(res => res.json())
      .then(data => setFireAnimation(data))
      .catch(err => console.error('Failed to load fire animation:', err));

    // Play sound effect
    const audio = new Audio('/universfield-new-notification-040-493469.mp3');
    audio.volume = 0.5;
    audio.play().catch(err => console.error('Failed to play sound:', err));

    // Animate in
    setTimeout(() => setIsVisible(true), 100);

    // Auto close after 5 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const getMessage = () => {
    if (streakCount === 1) {
      return "Great start! You've begun your learning streak!";
    } else if (streakCount <= 3) {
      return `${streakCount} days in a row! Keep the momentum going!`;
    } else if (streakCount <= 7) {
      return `${streakCount} day streak! You're building a strong habit!`;
    } else if (streakCount <= 14) {
      return `${streakCount} days strong! Your dedication is inspiring!`;
    } else if (streakCount <= 30) {
      return `${streakCount} day streak! You're on fire! 🔥`;
    } else if (streakCount <= 60) {
      return `${streakCount} days of learning! Absolutely incredible!`;
    } else {
      return `${streakCount} day streak! You're a learning champion!`;
    }
  };

  return (
    <div
      className="fixed top-4 left-1/2 z-[100000] transition-all duration-300"
      style={{
        transform: isVisible
          ? 'translate(-50%, 0)'
          : 'translate(-50%, -120%)',
        opacity: isVisible ? 1 : 0,
      }}
    >
      <div
        className="rounded-[24px] shadow-2xl overflow-hidden backdrop-blur-xl relative"
        style={{
          background: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          minWidth: '400px',
          maxWidth: '600px',
        }}
      >
        {/* Animated glow */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background:
              'radial-gradient(circle at 50% 0%, rgba(251, 191, 36, 0.4), transparent 70%)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex items-center gap-4 p-4 pr-12">
          {/* Fire Animation */}
          <div className="w-16 h-16 flex-shrink-0 flex items-center justify-center">
            {fireAnimation ? (
              <Lottie
                animationData={fireAnimation}
                loop={true}
                style={{ width: 64, height: 64 }}
              />
            ) : (
              <Flame size={40} color="white" fill="white" className="animate-bounce" />
            )}
          </div>

          {/* Text Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-black text-white">
                🔥 {streakCount} Day Streak!
              </h3>
            </div>
            <p className="text-sm font-semibold text-white/90 leading-relaxed">
              {getMessage()}
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <X size={16} color="white" strokeWidth={3} />
          </button>
        </div>

        {/* Progress bar for auto-close */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div
            className="h-full bg-white/50"
            style={{
              animation: 'shrink 5s linear forwards',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
}
