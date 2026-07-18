// Video progress tracking and storage utility

export interface VideoProgress {
  videoId: string;           // Unique identifier for the video
  courseId: string;          // Course this video belongs to
  videoTitle: string;        // Display name of the video
  lessonTitle?: string;      // Section/lesson name (optional)
  currentTime: number;       // Last watched position in seconds
  duration: number;          // Total video length in seconds
  percentComplete: number;   // Completion percentage (0-100)
  lastWatchedAt: number;     // Timestamp of last update
  completed: boolean;        // Fully watched flag (90%+)
  thumbnailUrl?: string;     // Video thumbnail (optional)
}

export interface CourseVideoProgress {
  courseId: string;
  courseName: string;
  totalVideos: number;
  watchedVideos: number;
  mostRecentVideo: VideoProgress | null;
  overallProgress: number;
}

const STORAGE_KEY = 'coursera_video_progress';
const MAX_VIDEOS = 100; // Keep only 100 most recent videos
const COMPLETION_THRESHOLD = 0.9; // 90% watched = completed
const MIN_SAVE_TIME = 3; // Don't save first 3 seconds (was 5)
const CLEANUP_DAYS = 30; // Remove videos not watched in 30 days

// Get all video progress data
export const getAllVideoProgress = (): Record<string, VideoProgress> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return {};
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Error reading video progress:', error);
    return {};
  }
};

// Get progress for a specific video
export const getVideoProgress = (videoId: string): VideoProgress | null => {
  try {
    const allProgress = getAllVideoProgress();
    return allProgress[videoId] || null;
  } catch (error) {
    console.error('❌ Error getting video progress:', error);
    return null;
  }
};

// Save or update video progress
export const saveVideoProgress = (progress: VideoProgress): boolean => {
  try {
    // Don't save if currentTime is too early (accidental starts)
    if (progress.currentTime < MIN_SAVE_TIME) {
      return false;
    }

    // Don't save if video is essentially complete (last 10 seconds)
    const timeRemaining = progress.duration - progress.currentTime;
    if (timeRemaining < 10 && progress.duration > 30) {
      // Mark as complete instead
      return markVideoComplete(progress.videoId, progress);
    }

    // Calculate percentage
    const percentComplete = Math.min(
      Math.round((progress.currentTime / progress.duration) * 100),
      100
    );

    // Check if should be marked complete
    const completed = percentComplete >= COMPLETION_THRESHOLD * 100;

    const updatedProgress: VideoProgress = {
      ...progress,
      percentComplete,
      completed,
      lastWatchedAt: Date.now(),
    };

    const allProgress = getAllVideoProgress();
    allProgress[progress.videoId] = updatedProgress;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
    console.log('💾 Video progress saved:', progress.videoId, `${percentComplete}%`);
    
    return true;
  } catch (error) {
    console.error('❌ Error saving video progress:', error);
    return false;
  }
};

// Mark video as completed
export const markVideoComplete = (videoId: string, existingProgress?: VideoProgress): boolean => {
  try {
    const allProgress = getAllVideoProgress();
    const current = existingProgress || allProgress[videoId];

    if (!current) {
      console.warn('⚠️ No existing progress found for video:', videoId);
      return false;
    }

    const completedProgress: VideoProgress = {
      ...current,
      currentTime: current.duration,
      percentComplete: 100,
      completed: true,
      lastWatchedAt: Date.now(),
    };

    allProgress[videoId] = completedProgress;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
    console.log('✅ Video marked as complete:', videoId);
    
    return true;
  } catch (error) {
    console.error('❌ Error marking video complete:', error);
    return false;
  }
};

// Delete video progress (for "Start Over" functionality)
export const deleteVideoProgress = (videoId: string): boolean => {
  try {
    const allProgress = getAllVideoProgress();
    delete allProgress[videoId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
    console.log('🗑️ Video progress deleted:', videoId);
    return true;
  } catch (error) {
    console.error('❌ Error deleting video progress:', error);
    return false;
  }
};

// Get progress for all videos in a course
export const getCourseProgress = (courseId: string): CourseVideoProgress | null => {
  try {
    const allProgress = getAllVideoProgress();
    const courseVideos = Object.values(allProgress).filter(
      (v) => v.courseId === courseId
    );

    if (courseVideos.length === 0) {
      return null;
    }

    // Find most recently watched video
    const mostRecent = courseVideos.reduce((latest, current) => {
      return current.lastWatchedAt > latest.lastWatchedAt ? current : latest;
    });

    // Calculate stats
    const watchedVideos = courseVideos.filter((v) => v.completed).length;
    const overallProgress = courseVideos.length > 0
      ? Math.round(
          courseVideos.reduce((sum, v) => sum + v.percentComplete, 0) /
            courseVideos.length
        )
      : 0;

    return {
      courseId,
      courseName: mostRecent.courseId, // In real app, would fetch from course data
      totalVideos: courseVideos.length,
      watchedVideos,
      mostRecentVideo: mostRecent,
      overallProgress,
    };
  } catch (error) {
    console.error('❌ Error getting course progress:', error);
    return null;
  }
};

// Get recently watched videos across all courses
export const getRecentlyWatchedVideos = (limit: number = 10): VideoProgress[] => {
  try {
    const allProgress = getAllVideoProgress();
    const videos = Object.values(allProgress);

    // Sort by lastWatchedAt (most recent first)
    const sorted = videos.sort((a, b) => b.lastWatchedAt - a.lastWatchedAt);

    // Filter out completed videos (user wants to continue, not rewatch)
    const inProgress = sorted.filter((v) => !v.completed && v.percentComplete > 0);

    return inProgress.slice(0, limit);
  } catch (error) {
    console.error('❌ Error getting recent videos:', error);
    return [];
  }
};

// Clean up old video progress (not watched in X days)
export const cleanupOldProgress = (): number => {
  try {
    const allProgress = getAllVideoProgress();
    const now = Date.now();
    const maxAge = CLEANUP_DAYS * 24 * 60 * 60 * 1000; // 30 days in ms

    let removedCount = 0;
    const cleanedProgress: Record<string, VideoProgress> = {};

    Object.entries(allProgress).forEach(([videoId, progress]) => {
      const age = now - progress.lastWatchedAt;
      if (age < maxAge) {
        cleanedProgress[videoId] = progress;
      } else {
        removedCount++;
      }
    });

    // Also enforce max video limit
    const entries = Object.entries(cleanedProgress);
    if (entries.length > MAX_VIDEOS) {
      // Sort by lastWatchedAt and keep only most recent
      entries.sort((a, b) => b[1].lastWatchedAt - a[1].lastWatchedAt);
      const limitedProgress = Object.fromEntries(entries.slice(0, MAX_VIDEOS));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedProgress));
      removedCount += entries.length - MAX_VIDEOS;
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanedProgress));
    }

    if (removedCount > 0) {
      console.log(`🧹 Cleaned up ${removedCount} old video progress entries`);
    }

    return removedCount;
  } catch (error) {
    console.error('❌ Error cleaning up progress:', error);
    return 0;
  }
};

// Format time (seconds) to readable format (MM:SS or HH:MM:SS)
export const formatVideoTime = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '0:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// Format time remaining
export const formatTimeRemaining = (seconds: number): string => {
  if (isNaN(seconds) || seconds < 0) return '0 min left';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.ceil((seconds % 3600) / 60);

  if (hours > 0) {
    return `${hours}h ${minutes}m left`;
  }
  if (minutes > 0) {
    return `${minutes} min left`;
  }
  return 'Less than 1 min left';
};

// Get storage statistics
export const getStorageStats = (): {
  totalVideos: number;
  inProgressVideos: number;
  completedVideos: number;
  oldestVideo: string | null;
  newestVideo: string | null;
} => {
  const allProgress = getAllVideoProgress();
  const videos = Object.values(allProgress);

  const inProgress = videos.filter((v) => !v.completed && v.percentComplete > 0);
  const completed = videos.filter((v) => v.completed);

  const sorted = [...videos].sort((a, b) => a.lastWatchedAt - b.lastWatchedAt);
  const oldest = sorted[0]?.videoId || null;
  const newest = sorted[sorted.length - 1]?.videoId || null;

  return {
    totalVideos: videos.length,
    inProgressVideos: inProgress.length,
    completedVideos: completed.length,
    oldestVideo: oldest,
    newestVideo: newest,
  };
};

// Check if video should show resume prompt (>5 seconds watched, <90% complete)
export const shouldShowResumePrompt = (videoId: string): boolean => {
  const progress = getVideoProgress(videoId);
  if (!progress) return false;
  
  return (
    progress.currentTime > MIN_SAVE_TIME &&
    progress.percentComplete < COMPLETION_THRESHOLD * 100 &&
    !progress.completed
  );
};
