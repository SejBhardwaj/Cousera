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
import BadgeEarnedNotification from '../components/BadgeEarnedNotification';
import { Sparkles, Flame, Zap } from 'lucide-react';

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
  const [showBadgeNotification, setShowBadgeNotification] = useState(false);
  const [earnedBadge, setEarnedBadge] = useState<Badge | null>(null);

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
      
      // If a badge was earned, show badge notification after streak notification
      if (badges.length > 0) {
        setTimeout(() => {
          setEarnedBadge(badges[0]); // Show first earned badge
          setShowBadgeNotification(true);
        }, 5500); // Show 0.5s after streak notification closes
      }
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

  // Get icon for badge
  const getBadgeIcon = (streakRequired: number) => {
    if (streakRequired === 3) return Sparkles;
    if (streakRequired === 7) return Flame;
    if (streakRequired === 14) return Zap;
    return Sparkles; // Default
  };

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

      {/* Badge Earned Notification - Shows after streak notification */}
      {showBadgeNotification && earnedBadge && (
        <BadgeEarnedNotification
          badgeName={earnedBadge.name}
          badgeIcon={getBadgeIcon(earnedBadge.streakRequired)}
          streakDays={earnedBadge.streakRequired}
          onClose={() => {
            setShowBadgeNotification(false);
            setEarnedBadge(null);
          }}
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
