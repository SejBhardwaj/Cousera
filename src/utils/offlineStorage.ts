// IndexedDB utility for offline course storage

const DB_NAME = 'courseraOfflineDB';
const DB_VERSION = 2; // Increment version for video storage
const STORE_NAME = 'courses';
const VIDEO_STORE_NAME = 'videos';

export interface OfflineCourseData {
  courseId: string;
  downloadedAt: string;
  courseData: {
    title: string;
    description: string;
    provider: string;
    instructor: string;
    category: string;
    categoryColor: string;
    rating: number;
    reviews: number;
    learners: string;
    duration: string;
    language: string;
    curriculum: any[];
    whatYouLearn: string[];
    stats: any[];
    careerOutcomes: any[];
    reviewsList: any[];
    projects: any[];
    progress?: number;
    thumbnail: string;
    instructorImg: string;
    difficulty: string;
  };
  images: {
    thumbnail: string; // base64
    instructor: string; // base64
    reviewers: string[]; // base64 array
  };
  videoIds: string[]; // List of downloaded video IDs
  size: number; // in bytes
}

export interface OfflineVideoData {
  videoId: string;
  courseId: string;
  videoBlob: Blob;
  downloadedAt: string;
  size: number;
}

// Initialize IndexedDB
export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'courseId' });
        objectStore.createIndex('downloadedAt', 'downloadedAt', { unique: false });
      }

      // Create video store if it doesn't exist
      if (!db.objectStoreNames.contains(VIDEO_STORE_NAME)) {
        const videoStore = db.createObjectStore(VIDEO_STORE_NAME, { keyPath: 'videoId' });
        videoStore.createIndex('courseId', 'courseId', { unique: false });
        videoStore.createIndex('downloadedAt', 'downloadedAt', { unique: false });
      }
    };
  });
};

// Convert image URL to base64
const urlToBase64 = async (url: string): Promise<string> => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Failed to convert image:', url, error);
    return ''; // Return empty string on failure
  }
};

// Helper function to add delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Download course for offline access
export const downloadCourseForOffline = async (
  courseData: OfflineCourseData['courseData'],
  videoUrls: string[], // Array of video URLs to download
  onProgress?: (progress: number, status: string) => void
): Promise<boolean> => {
  try {
    const db = await initDB();
    
    // Download images with progress tracking
    onProgress?.(0, 'Starting download...');
    await delay(300);
    
    onProgress?.(5, 'Downloading images...');
    await delay(300);
    
    console.log('📥 Downloading thumbnail...');
    const thumbnail = await urlToBase64(courseData.thumbnail);
    onProgress?.(15, 'Downloading thumbnail...');
    await delay(400);
    
    console.log('📥 Downloading instructor image...');
    const instructor = await urlToBase64(courseData.instructorImg);
    onProgress?.(25, 'Downloading instructor image...');
    await delay(500);
    
    console.log('📥 Downloading reviewer images...');
    const reviewers: string[] = [];
    if (courseData.reviewsList && courseData.reviewsList.length > 0) {
      for (let i = 0; i < courseData.reviewsList.length; i++) {
        const reviewer = await urlToBase64(courseData.reviewsList[i].avatar || '');
        reviewers.push(reviewer);
        const progressIncrement = 25 + (i + 1) * (10 / courseData.reviewsList.length);
        onProgress?.(Math.floor(progressIncrement), `Downloading reviewer ${i + 1}...`);
        await delay(200);
      }
    } else {
      onProgress?.(35, 'Processing images...');
      await delay(300);
    }

    // Download videos
    const courseId = courseData.title.toLowerCase().replace(/\s+/g, '-');
    const downloadedVideoIds: string[] = [];
    
    if (videoUrls.length > 0) {
      onProgress?.(40, 'Downloading videos...');
      
      for (let i = 0; i < videoUrls.length; i++) {
        const videoUrl = videoUrls[i];
        const videoId = `${courseId}-video-${i + 1}`;
        
        onProgress?.(40 + (i * 40 / videoUrls.length), `Downloading video ${i + 1}/${videoUrls.length}...`);
        
        try {
          const success = await downloadVideoForOffline(videoId, courseId, videoUrl);
          if (success) {
            downloadedVideoIds.push(videoId);
          }
        } catch (error) {
          console.error(`Failed to download video ${i + 1}:`, error);
        }
        
        await delay(500);
      }
    }
    
    onProgress?.(85, 'Saving course data...');
    await delay(400);

    // Calculate approximate size
    console.log('💾 Saving to IndexedDB...');
    const dataSize = JSON.stringify(courseData).length;
    const imagesSize = thumbnail.length + instructor.length + reviewers.join('').length;
    const totalSize = dataSize + imagesSize;

    const offlineData: OfflineCourseData = {
      courseId,
      downloadedAt: new Date().toISOString(),
      courseData,
      images: {
        thumbnail,
        instructor,
        reviewers,
      },
      videoIds: downloadedVideoIds,
      size: totalSize,
    };

    // Store in IndexedDB
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    await new Promise<void>((resolve, reject) => {
      const request = store.put(offlineData);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    onProgress?.(95, 'Finalizing...');
    await delay(400);
    
    onProgress?.(100, 'Download complete!');
    await delay(500);
    
    console.log('✅ Course downloaded for offline access:', offlineData.courseId);
    console.log(`✅ Downloaded ${downloadedVideoIds.length} videos`);
    return true;
  } catch (error) {
    console.error('❌ Failed to download course:', error);
    return false;
  }
};

// Check if course is available offline
export const isOfflineAvailable = async (courseId: string): Promise<boolean> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve) => {
      const request = store.get(courseId);
      request.onsuccess = () => resolve(!!request.result);
      request.onerror = () => resolve(false);
    });
  } catch (error) {
    console.error('Error checking offline availability:', error);
    return false;
  }
};

// Get offline course data
export const getCourseOfflineData = async (
  courseId: string
): Promise<OfflineCourseData | null> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve) => {
      const request = store.get(courseId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
  } catch (error) {
    console.error('Error getting offline course:', error);
    return null;
  }
};

// Get all offline courses
export const getAllOfflineCourses = async (): Promise<OfflineCourseData[]> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => resolve([]);
    });
  } catch (error) {
    console.error('Error getting all offline courses:', error);
    return [];
  }
};

// Delete offline course
export const deleteCourseOffline = async (courseId: string): Promise<boolean> => {
  try {
    // Delete course videos first
    await deleteCourseVideos(courseId);
    
    // Then delete course data
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    return new Promise((resolve) => {
      const request = store.delete(courseId);
      request.onsuccess = () => {
        console.log('✅ Course deleted from offline storage:', courseId);
        resolve(true);
      };
      request.onerror = () => resolve(false);
    });
  } catch (error) {
    console.error('Error deleting offline course:', error);
    return false;
  }
};

// Get total storage used
export const getStorageInfo = async (): Promise<{ totalSize: number; courseCount: number }> => {
  try {
    const courses = await getAllOfflineCourses();
    const totalSize = courses.reduce((sum, course) => sum + course.size, 0);
    return {
      totalSize,
      courseCount: courses.length,
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return { totalSize: 0, courseCount: 0 };
  }
};

// Format bytes to human-readable size
export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Download single video for offline
export const downloadVideoForOffline = async (
  videoId: string,
  courseId: string,
  videoUrl: string
): Promise<boolean> => {
  try {
    console.log('📹 Downloading video:', videoId, 'from:', videoUrl);
    
    // Fetch video as blob - handle relative URLs from public folder
    const fullUrl = videoUrl.startsWith('/') ? window.location.origin + videoUrl : videoUrl;
    const response = await fetch(fullUrl);
    if (!response.ok) {
      console.error('Video fetch failed:', response.status, response.statusText);
      throw new Error('Video download failed');
    }
    
    const videoBlob = await response.blob();
    console.log('✅ Video blob created:', videoBlob.size, 'bytes');
    
    const videoData: OfflineVideoData = {
      videoId,
      courseId,
      videoBlob,
      downloadedAt: new Date().toISOString(),
      size: videoBlob.size,
    };
    
    // Store in IndexedDB
    const db = await initDB();
    const transaction = db.transaction([VIDEO_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(VIDEO_STORE_NAME);
    
    await new Promise<void>((resolve, reject) => {
      const request = store.put(videoData);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
    
    console.log('✅ Video stored in IndexedDB:', videoId);
    return true;
  } catch (error) {
    console.error('❌ Failed to download video:', videoId, error);
    return false;
  }
};

// Get offline video blob URL
export const getOfflineVideoUrl = async (videoId: string): Promise<string | null> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([VIDEO_STORE_NAME], 'readonly');
    const store = transaction.objectStore(VIDEO_STORE_NAME);
    
    const videoData: OfflineVideoData | null = await new Promise((resolve) => {
      const request = store.get(videoId);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => resolve(null);
    });
    
    if (videoData && videoData.videoBlob) {
      // Create blob URL from stored blob
      const blobUrl = URL.createObjectURL(videoData.videoBlob);
      console.log('✅ Loaded offline video:', videoId);
      return blobUrl;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting offline video:', error);
    return null;
  }
};

// Check if video is available offline
export const isVideoOfflineAvailable = async (videoId: string): Promise<boolean> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([VIDEO_STORE_NAME], 'readonly');
    const store = transaction.objectStore(VIDEO_STORE_NAME);
    
    return new Promise((resolve) => {
      const request = store.get(videoId);
      request.onsuccess = () => resolve(!!request.result);
      request.onerror = () => resolve(false);
    });
  } catch (error) {
    console.error('Error checking video offline availability:', error);
    return false;
  }
};

// Delete all videos for a course
export const deleteCourseVideos = async (courseId: string): Promise<boolean> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([VIDEO_STORE_NAME], 'readwrite');
    const store = transaction.objectStore(VIDEO_STORE_NAME);
    const index = store.index('courseId');
    
    const videoIds: string[] = await new Promise((resolve) => {
      const request = index.getAllKeys(courseId);
      request.onsuccess = () => resolve(request.result as string[]);
      request.onerror = () => resolve([]);
    });
    
    for (const videoId of videoIds) {
      await new Promise<void>((resolve) => {
        const request = store.delete(videoId);
        request.onsuccess = () => resolve();
        request.onerror = () => resolve();
      });
    }
    
    console.log(`✅ Deleted ${videoIds.length} videos for course:`, courseId);
    return true;
  } catch (error) {
    console.error('Error deleting course videos:', error);
    return false;
  }
};
