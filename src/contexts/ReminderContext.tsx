import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  getAllReminders,
  getReminderForCourse,
  saveReminder,
  deleteReminder,
  markAsNotified,
  getDueReminders,
  cleanupOldReminders,
  CourseReminder,
} from '../utils/reminderStorage';
import {
  getNotificationPermission,
  requestNotificationPermission,
  showCourseReminderNotification,
  NotificationPermissionStatus,
} from '../utils/notificationService';

interface ReminderContextType {
  reminders: CourseReminder[];
  notificationPermission: NotificationPermissionStatus;
  requestPermission: () => Promise<NotificationPermissionStatus>;
  setReminder: (reminder: CourseReminder) => boolean;
  cancelReminder: (courseId: string) => boolean;
  getReminderByCourse: (courseId: string) => CourseReminder | null;
  refreshReminders: () => void;
  dueReminderNotification: { courseName: string; courseId: string } | null;
  clearDueReminder: () => void;
}

const ReminderContext = createContext<ReminderContextType | undefined>(undefined);

export const useReminder = () => {
  const context = useContext(ReminderContext);
  if (!context) {
    throw new Error('useReminder must be used within ReminderProvider');
  }
  return context;
};

interface ReminderProviderProps {
  children: ReactNode;
}

export const ReminderProvider = ({ children }: ReminderProviderProps) => {
  const [reminders, setReminders] = useState<CourseReminder[]>([]);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermissionStatus>('default');
  const [dueReminderNotification, setDueReminderNotification] = useState<{ courseName: string; courseId: string } | null>(null);

  // Load reminders on mount
  useEffect(() => {
    const loadedReminders = getAllReminders();
    setReminders(loadedReminders);
    
    const permission = getNotificationPermission();
    setNotificationPermission(permission);
    
    // Cleanup old reminders
    cleanupOldReminders();
  }, []);

  // Refresh reminders
  const refreshReminders = useCallback(() => {
    const loadedReminders = getAllReminders();
    setReminders(loadedReminders);
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<NotificationPermissionStatus> => {
    const permission = await requestNotificationPermission();
    setNotificationPermission(permission);
    return permission;
  }, []);

  // Set a new reminder
  const setReminderFunc = useCallback((reminder: CourseReminder): boolean => {
    const success = saveReminder(reminder);
    if (success) {
      refreshReminders();
    }
    return success;
  }, [refreshReminders]);

  // Cancel a reminder
  const cancelReminderFunc = useCallback((courseId: string): boolean => {
    const success = deleteReminder(courseId);
    if (success) {
      refreshReminders();
    }
    return success;
  }, [refreshReminders]);

  // Get reminder for a specific course
  const getReminderByCourse = useCallback((courseId: string): CourseReminder | null => {
    return getReminderForCourse(courseId);
  }, []);

  // Clear due reminder notification
  const clearDueReminder = useCallback(() => {
    setDueReminderNotification(null);
  }, []);

  // Check for due reminders periodically
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const now = Date.now();
      const dueReminders = getDueReminders();
      
      if (dueReminders.length > 0) {
        dueReminders.forEach((reminder) => {
          // Show IN-APP notification (no browser permission needed!)
          setDueReminderNotification({
            courseName: reminder.courseName,
            courseId: reminder.courseId,
          });

          // Also try browser notification if permission granted
          if (notificationPermission === 'granted') {
            showCourseReminderNotification(
              reminder.courseName,
              reminder.courseId,
              () => {
                window.focus();
              }
            );
          }

          // Mark as notified
          markAsNotified(reminder.id);
          refreshReminders();
        });
      }
    }, 60000); // Check every 60 seconds (1 minute)

    // Also check immediately on mount
    const checkImmediately = () => {
      const dueReminders = getDueReminders();
      
      if (dueReminders.length > 0) {
        dueReminders.forEach((reminder) => {
          // Show IN-APP notification
          setDueReminderNotification({
            courseName: reminder.courseName,
            courseId: reminder.courseId,
          });

          // Try browser notification if permission granted
          if (notificationPermission === 'granted') {
            showCourseReminderNotification(
              reminder.courseName,
              reminder.courseId,
              () => {
                window.focus();
              }
            );
          }

          markAsNotified(reminder.id);
          refreshReminders();
        });
      }
    };

    checkImmediately();

    return () => clearInterval(checkInterval);
  }, [refreshReminders, reminders, notificationPermission]);

  // Cleanup old reminders daily
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      cleanupOldReminders();
      refreshReminders();
    }, 24 * 60 * 60 * 1000); // Once per day

    return () => clearInterval(cleanupInterval);
  }, [refreshReminders]);

  const value: ReminderContextType = {
    reminders,
    notificationPermission,
    requestPermission,
    setReminder: setReminderFunc,
    cancelReminder: cancelReminderFunc,
    getReminderByCourse,
    refreshReminders,
    dueReminderNotification,
    clearDueReminder,
  };

  return <ReminderContext.Provider value={value}>{children}</ReminderContext.Provider>;
};
