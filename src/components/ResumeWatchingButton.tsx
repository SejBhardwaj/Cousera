import { Play, Clock } from 'lucide-react';
import { VideoProgress, formatVideoTime, formatTimeRemaining } from '../utils/videoProgressStorage';

interface ResumeWatchingButtonProps {
  video: VideoProgress;
  onClick: () => void;
  compact?: boolean;
}

export default function ResumeWatchingButton({ 
  video, 
  onClick,
  compact = false 
}: ResumeWatchingButtonProps) {
  const timeRemaining = video.duration - video.currentTime;

  if (compact) {
    // Compact version for course cards
    return (
      <button
        onClick={onClick}
        className="w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 hover:scale-[1.02]"
        style={{ background: 'linear-gradient(135deg, #A98BFF 0%, #7C6FD9 100%)' }}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/20">
          <Play size={18} fill="white" color="white" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-sm font-bold text-white">Resume Watching</p>
          <p className="text-xs text-white/80">
            {video.percentComplete}% • {formatTimeRemaining(timeRemaining)}
          </p>
        </div>
      </button>
    );
  }

  // Full version for course detail page
  return (
    <button
      onClick={onClick}
      className="w-full p-6 rounded-3xl transition-all duration-200 hover:scale-[1.01] group"
      style={{ background: 'linear-gradient(135deg, #A98BFF 0%, #7C6FD9 100%)' }}
    >
      <div className="flex items-center gap-4">
        {/* Play icon */}
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-white/20 group-hover:bg-white/30 transition-colors">
          <Play size={24} fill="white" color="white" />
        </div>

        {/* Content */}
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg font-black text-white">Resume Watching</span>
            <div className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white">
              {video.percentComplete}%
            </div>
          </div>
          <p className="text-sm font-semibold text-white/90 mb-2">{video.videoTitle}</p>
          <div className="flex items-center gap-4 text-xs text-white/70">
            <span className="flex items-center gap-1">
              <Clock size={12} />
              Resume from {formatVideoTime(video.currentTime)}
            </span>
            <span>•</span>
            <span>{formatTimeRemaining(timeRemaining)}</span>
          </div>
        </div>

        {/* Progress circle */}
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 transform -rotate-90">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="white"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - video.percentComplete / 100)}`}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-black text-white">{video.percentComplete}%</span>
          </div>
        </div>
      </div>
    </button>
  );
}
