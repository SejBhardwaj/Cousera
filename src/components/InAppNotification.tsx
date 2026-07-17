import { useEffect, useState } from 'react';
import { Bell, X, ArrowRight } from 'lucide-react';

interface InAppNotificationProps {
  courseName: string;
  onViewCourse: () => void;
  onClose: () => void;
}

export default function InAppNotification({ courseName, onViewCourse, onClose }: InAppNotificationProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show notification after a tiny delay for animation
    setTimeout(() => setShow(true), 100);

    // Play notification sound
    const audio = new Audio('/universfield-new-notification-040-493469.mp3');
    audio.volume = 0.5; // Set volume to 50%
    audio.play().catch(error => {
      console.log('🔇 Audio play failed (user interaction may be required):', error);
    });

    // Auto-hide after 8 seconds
    const timer = setTimeout(() => {
      handleClose();
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  return (
    <div
      className="fixed top-4 left-1/2 z-[100000] transition-all duration-300"
      style={{
        transform: show 
          ? 'translate(-50%, 0) scale(1)' 
          : 'translate(-50%, -100px) scale(0.8)',
        opacity: show ? 1 : 0,
      }}
    >
      <div
        className="rounded-full px-6 py-4 shadow-2xl flex items-center gap-4"
        style={{
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(30px) saturate(180%)',
          WebkitBackdropFilter: 'blur(30px) saturate(180%)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 12px 48px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          minWidth: '500px',
          maxWidth: '600px',
          animation: 'slideDown 0.4s ease-out',
        }}
      >
        {/* Bell Icon */}
        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#D7FF54' }}>
          <Bell size={20} color="#111" strokeWidth={2.5} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-black text-white mb-0.5">Time to Study! 🎓</h3>
          <p className="text-white/70 text-xs truncate">{courseName}</p>
        </div>

        {/* Continue Button */}
        <button
          onClick={() => {
            handleClose();
            onViewCourse();
          }}
          className="px-5 py-2 rounded-full font-bold text-sm transition-all duration-200 hover:opacity-90 active:scale-95 flex items-center gap-2 flex-shrink-0"
          style={{ background: '#D7FF54', color: '#111' }}
        >
          Continue
          <ArrowRight size={14} />
        </button>

        {/* Close button */}
        <button
          onClick={handleClose}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
        >
          <X size={14} color="white" />
        </button>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
