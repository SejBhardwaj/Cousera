// IndexedDB utility for offline course storage

const DB_NAME = 'courseraOfflineDB';
const DB_VERSION = 1;
const STORE_NAME = 'courses';

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
  size: number; // in bytes
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
  onProgress?: (progress: number) => void
): Promise<boolean> => {
  try {
    const db = await initDB();
    
    // Download images with progress tracking - with delays for smooth animation
    onProgress?.(0);
    await delay(300);
    
    onProgress?.(5);
    await delay(300);
    
    onProgress?.(10);
    await delay(400);
    
    console.log('📥 Downloading thumbnail...');
    const thumbnail = await urlToBase64(courseData.thumbnail);
    onProgress?.(25);
    await delay(400);
    
    onProgress?.(35);
    await delay(300);
    
    console.log('📥 Downloading instructor image...');
    const instructor = await urlToBase64(courseData.instructorImg);
    onProgress?.(50);
    await delay(500);
    
    onProgress?.(60);
    await delay(400);
    
    console.log('📥 Downloading reviewer images...');
    const reviewers: string[] = [];
    if (courseData.reviewsList && courseData.reviewsList.length > 0) {
      for (let i = 0; i < courseData.reviewsList.length; i++) {
        const reviewer = await urlToBase64(courseData.reviewsList[i].avatar || '');
        reviewers.push(reviewer);
        const progressIncrement = 60 + (i + 1) * (20 / courseData.reviewsList.length);
        onProgress?.(Math.floor(progressIncrement));
        await delay(300);
      }
    } else {
      onProgress?.(80);
      await delay(400);
    }
    
    onProgress?.(85);
    await delay(400);
    
    onProgress?.(90);
    await delay(300);

    // Calculate approximate size
    console.log('💾 Saving to IndexedDB...');
    const dataSize = JSON.stringify(courseData).length;
    const imagesSize = thumbnail.length + instructor.length + reviewers.join('').length;
    const totalSize = dataSize + imagesSize;

    const offlineData: OfflineCourseData = {
      courseId: courseData.title.toLowerCase().replace(/\s+/g, '-'),
      downloadedAt: new Date().toISOString(),
      courseData,
      images: {
        thumbnail,
        instructor,
        reviewers,
      },
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

    onProgress?.(95);
    await delay(400);
    
    onProgress?.(100);
    await delay(500); // Hold at 100% for a moment before completing
    
    console.log('✅ Course downloaded for offline access:', offlineData.courseId);
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
