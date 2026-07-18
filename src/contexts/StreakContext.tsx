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
import { addStreakNotification } from '../utils/streakNotificationStorage';
import StreakNotification from '../components/StreakNotification';

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
  const [showStreakNotification, setShowStreakNotification] = useState(false);
  const [notificationStreak, setNotificationStreak] = useState(0);

  // Initialize and track login on mount
  useEffect(() => {
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
        saveStreakData(checkedData);
        setStreakData(checkedData);
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkInterval);
  }, []);

  // Track course activity
  const trackCourseActivity = useCallback((): Badge[] => {
    const previousStreak = streakData.currentStreak;
    const { data, newBadges: badges } = trackCourseActivityUtil();
    setStreakData(data);
    
    // Show streak notification if streak increased
    if (data.currentStreak > previousStreak && data.currentStreak > 0) {
      setNotificationStreak(data.currentStreak);
      setShowStreakNotification(true);
      
      // Save streak notification to history
      addStreakNotification(data.currentStreak);
    }
    
    if (badges.length > 0) {
      setNewBadges(badges);
    }
    
    return badges;
  }, [streakData.currentStreak]);

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
      
      {/* Streak Notification */}
      {showStreakNotification && (
        <StreakNotification
          streakCount={notificationStreak}
          onClose={() => setShowStreakNotification(false)}
        />
      )}
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
