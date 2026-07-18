import { useEffect, useState } from 'react';
import { X, Award, Sparkles, Star } from 'lucide-react';

interface BadgeEarnedNotificationProps {
  badgeName: string;
  badgeIcon: React.ComponentType<any>;
  streakDays: number;
  onClose: () => void;
}

export default function BadgeEarnedNotification({ 
  badgeName, 
  badgeIcon: BadgeIcon, 
  streakDays, 
  onClose 
}: BadgeEarnedNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Play sound effect
    const audio = new Audio('/universfield-new-notification-040-493469.mp3');
    audio.volume = 0.6;
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

  return (
    <div
      className="fixed top-4 left-1/2 z-[100001] transition-all duration-300"
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
          background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 50%, #7DD3FC 100%)',
          border: '2px solid rgba(255, 255, 255, 0.4)',
          minWidth: '450px',
          maxWidth: '600px',
        }}
      >
        {/* Animated sparkles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-2 left-4 animate-ping">
            <Sparkles size={16} color="white" fill="white" opacity={0.6} />
          </div>
          <div className="absolute top-4 right-8 animate-pulse" style={{ animationDelay: '0.5s' }}>
            <Star size={14} color="white" fill="white" opacity={0.5} />
          </div>
          <div className="absolute bottom-3 left-12 animate-pulse" style={{ animationDelay: '1s' }}>
            <Star size={12} color="white" fill="white" opacity={0.7} />
          </div>
          <div className="absolute bottom-4 right-6 animate-ping" style={{ animationDelay: '0.3s' }}>
            <Sparkles size={14} color="white" fill="white" opacity={0.5} />
          </div>
        </div>

        {/* Animated glow */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.5), transparent 70%)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex items-center gap-5 p-5 pr-14">
          {/* Badge Icon with glow */}
          <div className="relative flex-shrink-0">
            <div 
              className="w-20 h-20 rounded-[22px] flex items-center justify-center shadow-2xl relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)',
                boxShadow: '0 12px 32px rgba(14, 165, 233, 0.5), inset 0 2px 4px rgba(255,255,255,1)'
              }}
            >
              {/* Glossy effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-black/10" />
              
              {/* Badge icon */}
              <BadgeIcon 
                size={42} 
                color="#0EA5E9" 
                strokeWidth={2.5}
                fill="none"
                className="relative z-10"
              />
              
              {/* Rotating glow */}
              <div 
                className="absolute inset-0 rounded-[22px] blur-xl opacity-60"
                style={{
                  background: 'linear-gradient(135deg, #0EA5E9 0%, #38BDF8 100%)',
                  animation: 'spin 3s linear infinite'
                }}
              />
            </div>

            {/* Star badge */}
            <div className="absolute -top-2 -right-2 w-9 h-9 rounded-full bg-yellow-400 flex items-center justify-center shadow-xl animate-bounce">
              <Star size={18} fill="white" color="white" strokeWidth={2.5} />
            </div>
          </div>

          {/* Text Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1.5">
              <Award size={20} color="white" strokeWidth={2.5} />
              <p className="text-xs font-black text-white uppercase tracking-wider">
                Badge Earned!
              </p>
            </div>
            <h3 className="text-xl font-black text-white mb-1 leading-tight">
              {badgeName}
            </h3>
            <p className="text-sm font-semibold text-white/95 leading-relaxed">
              Congratulations! You've unlocked the {badgeName} badge for maintaining a {streakDays}-day streak! 🎉
            </p>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            style={{
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <X size={18} color="white" strokeWidth={3} />
          </button>
        </div>

        {/* Progress bar for auto-close */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30">
          <div
            className="h-full bg-white/60"
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
        @keyframes spin {
          from {
            transform: rotate(0deg) scale(1.2);
          }
          to {
            transform: rotate(360deg) scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}
