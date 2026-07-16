import { X } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import { VideoProgress } from '../utils/videoProgressStorage';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  videoUrl: string;
  courseId: string;
  videoTitle: string;
  lessonTitle?: string;
  thumbnailUrl?: string;
  onComplete?: () => void;
  onProgressUpdate?: (progress: VideoProgress) => void;
}

export default function VideoModal({
  isOpen,
  onClose,
  videoId,
  videoUrl,
  courseId,
  videoTitle,
  lessonTitle,
  thumbnailUrl,
  onComplete,
  onProgressUpdate,
}: VideoModalProps) {
  if (!isOpen) return null;

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in"
      style={{ background: 'rgba(0,0,0,0.9)' }}
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl animate-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors z-10"
        >
          <X size={20} color="white" />
        </button>

        {/* Video title */}
        <div className="mb-4">
          <h2 className="text-2xl font-black text-white mb-1">{videoTitle}</h2>
          {lessonTitle && (
            <p className="text-sm text-white/70">{lessonTitle}</p>
          )}
        </div>

        {/* Video player */}
        <VideoPlayer
          videoId={videoId}
          videoUrl={videoUrl}
          courseId={courseId}
          videoTitle={videoTitle}
          lessonTitle={lessonTitle}
          thumbnailUrl={thumbnailUrl}
          autoResume={true}
          onComplete={handleComplete}
          onProgressUpdate={onProgressUpdate}
        />

        {/* Helper text */}
        <div className="mt-4 text-center">
          <p className="text-xs text-white/50">
            Press ESC to close • Your progress is automatically saved
          </p>
        </div>
      </div>
    </div>
  );
}
