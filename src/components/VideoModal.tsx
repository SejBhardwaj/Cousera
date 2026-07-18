import { X, BookOpen, FileText, Code } from 'lucide-react';
import { useState, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';
import { VideoProgress } from '../utils/videoProgressStorage';
import { getOfflineVideoUrl } from '../utils/offlineStorage';
import { useOffline } from '../contexts/OfflineContext';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  videoUrl: string;
  courseId: string;
  videoTitle: string;
  lessonTitle?: string;
  thumbnailUrl?: string;
  readingMaterial?: ReadingMaterial;
  onComplete?: () => void;
  onProgressUpdate?: (progress: VideoProgress) => void;
}

interface ReadingMaterial {
  summary: string;
  keyPoints: string[];
  codeExample?: string;
  additionalResources?: string[];
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
  readingMaterial,
  onComplete,
  onProgressUpdate,
}: VideoModalProps) {
  const [activeTab, setActiveTab] = useState<'summary' | 'notes'>('summary');
  const [actualVideoUrl, setActualVideoUrl] = useState(videoUrl);
  const { isOnline } = useOffline();
  
  // Load offline video if available and offline
  useEffect(() => {
    const loadVideo = async () => {
      if (!isOnline) {
        console.log('📵 Offline mode - checking for offline video:', videoId);
        const offlineUrl = await getOfflineVideoUrl(videoId);
        if (offlineUrl) {
          console.log('✅ Using offline video');
          setActualVideoUrl(offlineUrl);
        } else {
          console.log('❌ No offline video available');
          setActualVideoUrl(videoUrl); // Fallback to online URL
        }
      } else {
        setActualVideoUrl(videoUrl);
      }
    };
    
    if (isOpen) {
      loadVideo();
    }
  }, [isOpen, isOnline, videoId, videoUrl]);
  
  if (!isOpen) return null;

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center animate-in"
      style={{ 
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)'
      }}
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-7xl h-full flex gap-4 animate-in py-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 w-10 h-10 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 transition-colors z-10"
        >
          <X size={20} color="white" />
        </button>

        {/* Left: Video Player */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Video title */}
          <div className="mb-2">
            <h2 className="text-xl font-black text-white mb-0.5">{videoTitle}</h2>
            {lessonTitle && (
              <p className="text-xs text-white/70">{lessonTitle}</p>
            )}
          </div>

          {/* Video player - fills available space */}
          <div className="flex-1 relative min-h-0">
            <div className="absolute inset-0">
              <VideoPlayer
                videoId={videoId}
                videoUrl={actualVideoUrl}
                courseId={courseId}
                videoTitle={videoTitle}
                lessonTitle={lessonTitle}
                thumbnailUrl={thumbnailUrl}
                autoResume={true}
                onComplete={handleComplete}
                onProgressUpdate={onProgressUpdate}
              />
            </div>
          </div>

          {/* Helper text */}
          <div className="mt-2 text-center">
            <p className="text-xs text-white/50">
              Press ESC to close • Your progress is automatically saved
            </p>
          </div>
        </div>

        {/* Right: Reading Materials */}
        {readingMaterial && (
          <div 
            className="w-96 rounded-3xl flex flex-col overflow-hidden"
            style={{ background: '#FFFFFF' }}
          >
            {/* Tabs */}
            <div className="flex border-b border-border">
              <button
                onClick={() => setActiveTab('summary')}
                className="flex-1 px-4 py-3 text-sm font-bold transition-colors"
                style={{
                  color: activeTab === 'summary' ? '#0F0F0F' : '#6B6B7B',
                  borderBottom: activeTab === 'summary' ? '3px solid #D7FF54' : 'none',
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <BookOpen size={16} />
                  Summary
                </div>
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className="flex-1 px-4 py-3 text-sm font-bold transition-colors"
                style={{
                  color: activeTab === 'notes' ? '#0F0F0F' : '#6B6B7B',
                  borderBottom: activeTab === 'notes' ? '3px solid #D7FF54' : 'none',
                }}
              >
                <div className="flex items-center justify-center gap-2">
                  <FileText size={16} />
                  Key Points
                </div>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {activeTab === 'summary' ? (
                <>
                  {/* Summary */}
                  <div>
                    <h3 className="text-sm font-bold text-text mb-2 uppercase tracking-wide text-muted">Lesson Summary</h3>
                    <p className="text-sm text-text leading-relaxed">
                      {readingMaterial.summary}
                    </p>
                  </div>

                  {/* Code Example */}
                  {readingMaterial.codeExample && (
                    <div>
                      <h3 className="text-sm font-bold text-text mb-2 uppercase tracking-wide text-muted flex items-center gap-2">
                        <Code size={14} />
                        Code Example
                      </h3>
                      <pre 
                        className="text-xs p-4 rounded-2xl overflow-x-auto"
                        style={{ background: '#F6F6F8', fontFamily: 'monospace' }}
                      >
                        <code>{readingMaterial.codeExample}</code>
                      </pre>
                    </div>
                  )}

                  {/* Additional Resources */}
                  {readingMaterial.additionalResources && readingMaterial.additionalResources.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-text mb-2 uppercase tracking-wide text-muted">Additional Resources</h3>
                      <ul className="space-y-2">
                        {readingMaterial.additionalResources.map((resource, i) => (
                          <li key={i} className="text-xs text-text flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>{resource}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Key Points */}
                  <div>
                    <h3 className="text-sm font-bold text-text mb-3 uppercase tracking-wide text-muted">Key Takeaways</h3>
                    <ul className="space-y-3">
                      {readingMaterial.keyPoints.map((point, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                            style={{ background: '#D7FF54', color: '#111' }}
                          >
                            {i + 1}
                          </div>
                          <p className="text-sm text-text leading-relaxed flex-1">
                            {point}
                          </p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
