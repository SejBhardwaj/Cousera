import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';
import {
  saveVideoProgress,
  markVideoComplete,
  getVideoProgress,
  shouldShowResumePrompt,
  deleteVideoProgress,
  formatVideoTime,
  VideoProgress,
} from '../utils/videoProgressStorage';

interface VideoPlayerProps {
  videoId: string;
  videoUrl: string;
  courseId: string;
  videoTitle: string;
  lessonTitle?: string;
  thumbnailUrl?: string;
  autoResume?: boolean; // Default: true
  onComplete?: () => void;
  onProgressUpdate?: (progress: VideoProgress) => void;
}

export default function VideoPlayer({
  videoId,
  videoUrl,
  courseId,
  videoTitle,
  lessonTitle,
  thumbnailUrl,
  autoResume = true,
  onComplete,
  onProgressUpdate,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [savedProgress, setSavedProgress] = useState<VideoProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load saved progress on mount
  useEffect(() => {
    const progress = getVideoProgress(videoId);
    setSavedProgress(progress);

    if (progress && shouldShowResumePrompt(videoId) && autoResume) {
      setShowResumePrompt(true);
    }
  }, [videoId, autoResume]);

  // Auto-save progress every 5 seconds while playing
  useEffect(() => {
    if (!isPlaying || !videoRef.current) return;

    const interval = setInterval(() => {
      const video = videoRef.current;
      if (!video) return;

      const progress: VideoProgress = {
        videoId,
        courseId,
        videoTitle,
        lessonTitle,
        currentTime: video.currentTime,
        duration: video.duration,
        percentComplete: 0, // Will be calculated in saveVideoProgress
        lastWatchedAt: Date.now(),
        completed: false,
        thumbnailUrl,
      };

      const saved = saveVideoProgress(progress);
      if (saved && onProgressUpdate) {
        onProgressUpdate(progress);
      }
    }, 5000); // Save every 5 seconds

    return () => clearInterval(interval);
  }, [isPlaying, videoId, courseId, videoTitle, lessonTitle, thumbnailUrl, onProgressUpdate]);

  // Save on pause
  const handlePause = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      saveVideoProgress({
        videoId,
        courseId,
        videoTitle,
        lessonTitle,
        currentTime: videoRef.current.currentTime,
        duration: videoRef.current.duration,
        percentComplete: 0,
        lastWatchedAt: Date.now(),
        completed: false,
        thumbnailUrl,
      });
    }
  };

  // Handle play
  const handlePlay = () => {
    setIsPlaying(true);
    setShowResumePrompt(false);
  };

  // Handle time update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  // Handle video end
  const handleEnded = () => {
    setIsPlaying(false);
    markVideoComplete(videoId, {
      videoId,
      courseId,
      videoTitle,
      lessonTitle,
      currentTime: duration,
      duration,
      percentComplete: 100,
      lastWatchedAt: Date.now(),
      completed: true,
      thumbnailUrl,
    });

    if (onComplete) {
      onComplete();
    }
  };

  // Handle metadata loaded
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  // Resume from saved position
  const handleResume = () => {
    if (videoRef.current && savedProgress) {
      videoRef.current.currentTime = savedProgress.currentTime;
      setShowResumePrompt(false);
      videoRef.current.play();
    }
  };

  // Start from beginning
  const handleStartOver = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setShowResumePrompt(false);
      deleteVideoProgress(videoId); // Clear saved progress
      videoRef.current.play();
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      if (newVolume === 0) {
        setIsMuted(true);
      } else if (isMuted) {
        setIsMuted(false);
      }
    }
  };

  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative w-full bg-black rounded-3xl overflow-hidden group">
      {/* Video element */}
      <video
        ref={videoRef}
        src={videoUrl}
        onPlay={handlePlay}
        onPause={handlePause}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={handleLoadedMetadata}
        className="w-full aspect-video"
        poster={thumbnailUrl}
      />

      {/* Resume prompt overlay */}
      {showResumePrompt && savedProgress && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-20">
          <div className="bg-white rounded-3xl p-8 max-w-md text-center animate-in">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#EDE9FF' }}>
              <RotateCcw size={28} color="#A98BFF" />
            </div>
            <h3 className="text-xl font-black text-text mb-2">Resume Watching?</h3>
            <p className="text-sm text-muted mb-1">
              You've watched <span className="font-bold text-text">{savedProgress.percentComplete}%</span> of this video
            </p>
            <p className="text-sm text-muted mb-6">
              Resume from <span className="font-bold" style={{ color: '#A98BFF' }}>{formatVideoTime(savedProgress.currentTime)}</span>
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleStartOver}
                className="flex-1 px-6 py-3 rounded-xl font-bold text-sm border-2 border-border text-text hover:bg-bg transition-colors"
              >
                Start Over
              </button>
              <button
                onClick={handleResume}
                className="flex-1 px-6 py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:opacity-90"
                style={{ background: '#A98BFF' }}
              >
                Resume
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="text-white text-sm font-semibold">Loading video...</div>
        </div>
      )}

      {/* Controls overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        {/* Progress bar */}
        <div className="mb-3">
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #A98BFF 0%, #A98BFF ${progressPercent}%, rgba(255,255,255,0.3) ${progressPercent}%, rgba(255,255,255,0.3) 100%)`,
            }}
          />
          <div className="flex items-center justify-between mt-1 text-xs text-white/80">
            <span>{formatVideoTime(currentTime)}</span>
            <span>{formatVideoTime(duration)}</span>
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex items-center gap-3">
          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/20"
          >
            {isPlaying ? (
              <Pause size={20} color="white" fill="white" />
            ) : (
              <Play size={20} color="white" fill="white" />
            )}
          </button>

          {/* Volume */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/20"
            >
              {isMuted ? (
                <VolumeX size={16} color="white" />
              ) : (
                <Volume2 size={16} color="white" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
            />
          </div>

          {/* Progress percentage */}
          <div className="flex-1 text-center">
            <span className="text-sm font-bold text-white">
              {Math.round(progressPercent)}% Complete
            </span>
          </div>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/20"
          >
            <Maximize size={16} color="white" />
          </button>
        </div>
      </div>
    </div>
  );
}
