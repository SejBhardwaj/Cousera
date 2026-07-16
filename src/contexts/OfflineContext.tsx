import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface OfflineContextType {
  isOnline: boolean;
  offlineCourses: Set<string>;
  refreshOfflineCourses: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider = ({ children }: { children: ReactNode }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineCourses, setOfflineCourses] = useState<Set<string>>(new Set());

  // Define refreshOfflineCourses first
  const refreshOfflineCourses = async () => {
    try {
      const { getAllOfflineCourses } = await import('../utils/offlineStorage');
      const courses = await getAllOfflineCourses();
      const courseIds = new Set(courses.map(c => c.courseId));
      setOfflineCourses(courseIds);
      console.log('📦 Loaded offline courses:', courseIds.size);
    } catch (error) {
      console.error('Error loading offline courses:', error);
    }
  };

  // Listen to online/offline events
  useEffect(() => {
    const handleOnline = () => {
      console.log('🌐 Back online');
      setIsOnline(true);
    };

    const handleOffline = () => {
      console.log('📵 Gone offline');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load offline courses on mount
  useEffect(() => {
    refreshOfflineCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <OfflineContext.Provider value={{ isOnline, offlineCourses, refreshOfflineCourses }}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
};
