import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import {
  StreakData,
  Badge,
  loadStreakData,
  trackLogin,
  trackCourseActivity as trackCourseActivityUtil,
  checkStreakStatus,
  saveStreakData,
} from '../utils/streakTracking';

interface StreakContextType {
  streakData: StreakData;
  trackCourseActivity: () => Badge[];
  refreshStreakData: () => void;
  newBadges: Badge[];
  clearNewBadges: () => void;
}

const StreakContext = createContext<StreakContextType | undefined>(undefined);

export const StreakProvider = ({ children }: { children: ReactNode }) => {
  const [streakData, setStreakData] = useState<StreakData>(loadStreakData());
  const [newBadges, setNewBadges] = useState<Badge[]>([]);

  // Initialize and track login on mount
  useEffect(() => {
    console.log('🚀 StreakProvider initialized');
    const updatedData = trackLogin();
    setStreakData(updatedData);
  }, []);

  // Check streak status periodically
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const data = loadStreakData();
      const checkedData = checkStreakStatus(data);
      
      if (checkedData.currentStreak !== data.currentStreak) {
        // Streak was reset
        console.log('⏰ Streak check: Streak reset due to inactivity');
        saveStreakData(checkedData);
        setStreakData(checkedData);
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, []);

  // Track course activity
  const trackCourseActivity = useCallback((): Badge[] => {
    const { data, newBadges: badges } = trackCourseActivityUtil();
    setStreakData(data);
    
    if (badges.length > 0) {
      setNewBadges(badges);
    }
    
    return badges;
  }, []);

  // Refresh streak data from storage
  const refreshStreakData = useCallback(() => {
    const data = loadStreakData();
    setStreakData(data);
  }, []);

  // Clear new badges after showing celebration
  const clearNewBadges = useCallback(() => {
    setNewBadges([]);
  }, []);

  return (
    <StreakContext.Provider
      value={{
        streakData,
        trackCourseActivity,
        refreshStreakData,
        newBadges,
        clearNewBadges,
      }}
    >
      {children}
    </StreakContext.Provider>
  );
};

export const useStreak = () => {
  const context = useContext(StreakContext);
  if (context === undefined) {
    throw new Error('useStreak must be used within a StreakProvider');
  }
  return context;
};
