import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Award, Share2, ArrowRight, X, Trophy, Clock, CheckCircle, Target, GraduationCap, Download } from 'lucide-react';

interface CompletionCelebrationProps {
  courseName: string;
  duration: string;
  lessonsCompleted: number;
  projectsCompleted: number;
  onViewCertificate: (certificateUrl: string) => void;
  onContinueLearning: () => void;
  onClose: () => void;
}

// Available certificate templates
const CERTIFICATE_TEMPLATES = [
  '/4ea3d43a265ee2fe179e46725dc9d525.jpg',
  '/006b282426f45d4bc580ad68c7eed561.jpg',
  '/7a0417bf7db91b0dd4de5c541b1eb55b.jpg',
  '/68cfd7f5e403cdcbe6b4730a6a868c91.jpg',
  '/86fa61c995cd12807633df5aa7b05b5c.jpg',
  '/700ebd443a8d06589c86a00ff3f60c42.jpg',
  '/893afe31083cc162f0d4c67623d71901.jpg',
  '/6693a62807b86fb686b23c3ab6878a2d.jpg',
  '/bed4c4100fb8c44549014e58f5feb035.jpg',
];

export default function CompletionCelebration({
  courseName,
  duration,
  lessonsCompleted,
  projectsCompleted,
  onViewCertificate,
  onContinueLearning,
  onClose,
}: CompletionCelebrationProps) {
  
  // Select a random certificate template
  const [certificateTemplate] = useState(() => {
    const randomIndex = Math.floor(Math.random() * CERTIFICATE_TEMPLATES.length);
    return CERTIFICATE_TEMPLATES[randomIndex];
  });

  useEffect(() => {
    console.log('🎊 CompletionCelebration component mounted!');
    console.log('📚 Course:', courseName);
    console.log('🎓 Certificate Template:', certificateTemplate);
    // Launch confetti celebration
    launchConfetti();
    
    return () => {
      console.log('👋 CompletionCelebration component unmounted');
    };
  }, [courseName, certificateTemplate]);

  const launchConfetti = () => {
    const duration = 3500; // 3.5 seconds - balanced duration
    const animationEnd = Date.now() + duration;
    const defaults = { 
      startVelocity: 25, // Reduced from 30 for smoother fall
      spread: 360, 
      ticks: 80, // Increased from 60 for slower, smoother fall
      zIndex: 100000, // ABOVE the modal background
      gravity: 0.8, // Slightly reduced gravity for gentler fall
      decay: 0.92, // Slower decay for longer visibility
      scalar: 1.2, // Slightly larger particles
      colors: ['#D7FF54', '#A98BFF', '#FF6D70', '#83D6FF', '#7DEBA3', '#FFB259']
    };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    // Big center burst first
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      startVelocity: 35,
      colors: ['#D7FF54', '#A98BFF', '#FF6D70', '#83D6FF', '#7DEBA3'],
      zIndex: 100000, // ABOVE the modal
      gravity: 0.8,
      ticks: 80,
    });

    // Continuous side bursts with controlled timing
    const interval: NodeJS.Timeout = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 40 * (timeLeft / duration); // Reduced particle count per burst
      
      // Launch from left side
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      
      // Launch from right side
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 350); // Slightly slower interval for better pacing
  };

  const handleShare = () => {
    const text = `I just completed "${courseName}" on Coursera! 🎉`;
    const url = window.location.href;
    
    // Check if Web Share API is available
    if (navigator.share) {
      navigator.share({
        title: 'Course Completed!',
        text: text,
        url: url,
      }).catch(() => {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(`${text} ${url}`);
        alert('Link copied to clipboard!');
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${text} ${url}`);
      alert('Link copied to clipboard!');
    }
  };

  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const handleDownloadCertificate = async () => {
    try {
      // Fetch the certificate image
      const response = await fetch(certificateTemplate);
      const blob = await response.blob();
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Create filename with course name and date
      const filename = `Certificate_${courseName.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.jpg`;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      console.log('✅ Certificate downloaded:', filename);
    } catch (error) {
      console.error('❌ Error downloading certificate:', error);
      alert('Failed to download certificate. Please try again.');
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 animate-in"
      style={{ 
        background: 'rgba(0,0,0,0.3)', 
        backdropFilter: 'blur(4px)',
        zIndex: 99999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'auto'
      }}
      onClick={onClose}
    >
      <div 
        className="relative max-w-lg w-full animate-in"
        style={{ 
          animation: 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)' 
        }}
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

        {/* Main celebration card */}
        <div 
          className="rounded-4xl overflow-hidden"
          style={{ 
            background: 'linear-gradient(135deg, #0F0F0F 0%, #1a1a2e 50%, #16213e 100%)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
          }}
        >
          {/* Decorative orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #D7FF54, transparent 70%)', transform: 'translate(30%, -30%)' }} />
          <div className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #A98BFF, transparent 70%)', transform: 'translateY(40%)' }} />

          <div className="relative z-10 p-8 text-center">
            {/* Animated trophy icon */}
            <div 
              className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center"
              style={{ 
                background: 'linear-gradient(135deg, #D7FF54 0%, #A98BFF 100%)',
                animation: 'pulse 2s ease-in-out infinite',
                boxShadow: '0 8px 32px rgba(215,255,84,0.4)'
              }}
            >
              <Trophy size={36} color="#111" strokeWidth={2.5} />
            </div>

            {/* Main message */}
            <h1 
              className="text-3xl font-black text-white mb-2"
              style={{ 
                textShadow: '0 2px 20px rgba(215,255,84,0.3)',
                lineHeight: '1.2'
              }}
            >
              Great Job!
            </h1>
            <p className="text-xl font-bold text-white/90 mb-1">
              You've completed this course!
            </p>
            
            {/* Course name */}
            <div 
              className="inline-block px-4 py-2 rounded-2xl mt-4 mb-6"
              style={{ background: 'rgba(215,255,84,0.15)', border: '1px solid rgba(215,255,84,0.3)' }}
            >
              <p className="text-sm font-bold" style={{ color: '#D7FF54' }}>
                {courseName}
              </p>
            </div>

            {/* Completion date */}
            <p className="text-white/50 text-sm mb-6">
              Completed: {currentDate}
            </p>

            {/* Divider */}
            <div 
              className="h-px mx-auto mb-6"
              style={{ 
                width: '80%',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' 
              }}
            />

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div 
                className="p-4 rounded-2xl"
                style={{ background: 'rgba(131,214,255,0.1)', border: '1px solid rgba(131,214,255,0.2)' }}
              >
                <Clock size={20} color="#83D6FF" className="mx-auto mb-2" />
                <p className="text-lg font-black text-white">{duration}</p>
                <p className="text-xs text-white/50">learned</p>
              </div>
              <div 
                className="p-4 rounded-2xl"
                style={{ background: 'rgba(125,235,163,0.1)', border: '1px solid rgba(125,235,163,0.2)' }}
              >
                <CheckCircle size={20} color="#7DEBA3" className="mx-auto mb-2" />
                <p className="text-lg font-black text-white">{lessonsCompleted}</p>
                <p className="text-xs text-white/50">lessons</p>
              </div>
              <div 
                className="p-4 rounded-2xl"
                style={{ background: 'rgba(169,139,255,0.1)', border: '1px solid rgba(169,139,255,0.2)' }}
              >
                <Target size={20} color="#A98BFF" className="mx-auto mb-2" />
                <p className="text-lg font-black text-white">{projectsCompleted}</p>
                <p className="text-xs text-white/50">projects</p>
              </div>
            </div>

            {/* Achievement badges */}
            <div className="flex justify-center gap-2 mb-6 flex-wrap">
              <div 
                className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1"
                style={{ background: 'rgba(215,255,84,0.15)', color: '#D7FF54' }}
              >
                <Trophy size={14} /> Certificate Earned
              </div>
              <div 
                className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1"
                style={{ background: 'rgba(131,214,255,0.15)', color: '#83D6FF' }}
              >
                <Award size={14} /> Resume Ready
              </div>
              <div 
                className="px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1"
                style={{ background: 'rgba(255,109,112,0.15)', color: '#FF6D70' }}
              >
                <GraduationCap size={14} /> Knowledge Gained
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={() => onViewCertificate(certificateTemplate)}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ 
                  background: 'linear-gradient(135deg, #D7FF54 0%, #A98BFF 100%)',
                  color: '#111',
                  boxShadow: '0 8px 24px rgba(215,255,84,0.3)'
                }}
              >
                <Award size={18} />
                View Certificate
                <ArrowRight size={18} />
              </button>

              <button
                onClick={handleDownloadCertificate}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-sm transition-all duration-200 hover:bg-white/10 active:scale-95"
                style={{ 
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: '2px solid rgba(215,255,84,0.5)',
                  boxShadow: '0 4px 16px rgba(215,255,84,0.2)'
                }}
              >
                <Download size={18} />
                Download Certificate
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 hover:bg-white/20"
                  style={{ 
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  <Share2 size={16} />
                  Share
                </button>

                <button
                  onClick={onContinueLearning}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 hover:bg-white/20"
                  style={{ 
                    background: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                >
                  Continue Learning
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Motivational footer */}
            <p className="text-white/40 text-xs mt-6 italic">
              "Every accomplishment starts with the decision to try."
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}
