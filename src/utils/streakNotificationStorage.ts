// Streak Notification Storage - Keep record of streak milestones

export interface StreakNotificationRecord {
  id: string;
  streakCount: number;
  message: string;
  timestamp: number;
  read: boolean;
}

const STORAGE_KEY = 'coursera-streak-notifications';
const MAX_NOTIFICATIONS = 50; // Keep last 50 streak notifications

// Load all streak notifications
export const loadStreakNotifications = (): StreakNotificationRecord[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading streak notifications:', error);
  }
  return [];
};

// Save streak notifications
export const saveStreakNotifications = (notifications: StreakNotificationRecord[]): void => {
  try {
    // Keep only the most recent notifications
    const limited = notifications.slice(0, MAX_NOTIFICATIONS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limited));
  } catch (error) {
    console.error('Error saving streak notifications:', error);
  }
};

// Add a new streak notification
export const addStreakNotification = (streakCount: number): StreakNotificationRecord => {
  const notifications = loadStreakNotifications();
  
  // Generate message based on streak count
  let message = '';
  if (streakCount === 1) {
    message = "Great start! You've begun your learning streak!";
  } else if (streakCount <= 3) {
    message = `${streakCount} days in a row! Keep the momentum going!`;
  } else if (streakCount <= 7) {
    message = `${streakCount} day streak! You're building a strong habit!`;
  } else if (streakCount <= 14) {
    message = `${streakCount} days strong! Your dedication is inspiring!`;
  } else if (streakCount <= 30) {
    message = `${streakCount} day streak! You're on fire! 🔥`;
  } else if (streakCount <= 60) {
    message = `${streakCount} days of learning! Absolutely incredible!`;
  } else {
    message = `${streakCount} day streak! You're a learning champion!`;
  }
  
  const newNotification: StreakNotificationRecord = {
    id: `streak-${Date.now()}-${streakCount}`,
    streakCount,
    message,
    timestamp: Date.now(),
    read: false,
  };
  
  // Add to beginning (most recent first)
  notifications.unshift(newNotification);
  
  // Save
  saveStreakNotifications(notifications);
  
  return newNotification;
};

// Mark notification as read
export const markStreakNotificationAsRead = (id: string): void => {
  const notifications = loadStreakNotifications();
  const updated = notifications.map(n => 
    n.id === id ? { ...n, read: true } : n
  );
  saveStreakNotifications(updated);
};

// Mark all as read
export const markAllStreakNotificationsAsRead = (): void => {
  const notifications = loadStreakNotifications();
  const updated = notifications.map(n => ({ ...n, read: true }));
  saveStreakNotifications(updated);
};

// Delete a notification
export const deleteStreakNotification = (id: string): void => {
  const notifications = loadStreakNotifications();
  const filtered = notifications.filter(n => n.id !== id);
  saveStreakNotifications(filtered);
};

// Get unread count
export const getUnreadStreakNotificationsCount = (): number => {
  const notifications = loadStreakNotifications();
  return notifications.filter(n => !n.read).length;
};
