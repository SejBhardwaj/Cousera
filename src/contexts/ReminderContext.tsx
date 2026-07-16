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

  // Load reminders on mount
  useEffect(() => {
    console.log('🔔 ReminderProvider initialized');
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

  // Check for due reminders periodically
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const dueReminders = getDueReminders();
      
      if (dueReminders.length > 0) {
        console.log(`🔔 ${dueReminders.length} due reminder(s) found`);
        
        dueReminders.forEach((reminder) => {
          // Show notification
          const notification = showCourseReminderNotification(
            reminder.courseName,
            reminder.courseId,
            () => {
              // When notification is clicked, navigate to course
              console.log('🖱️ User clicked reminder for:', reminder.courseName);
              // In a real app, this would navigate to the course
              // For now, we'll just open an alert
              window.focus();
            }
          );

          if (notification) {
            // Mark as notified
            markAsNotified(reminder.id);
            refreshReminders();
          }
        });
      }
    }, 60000); // Check every 60 seconds (1 minute)

    // Also check immediately on mount
    const checkImmediately = () => {
      const dueReminders = getDueReminders();
      if (dueReminders.length > 0) {
        console.log(`🔔 ${dueReminders.length} due reminder(s) found on mount`);
        dueReminders.forEach((reminder) => {
          const notification = showCourseReminderNotification(
            reminder.courseName,
            reminder.courseId,
            () => {
              window.focus();
            }
          );

          if (notification) {
            markAsNotified(reminder.id);
            refreshReminders();
          }
        });
      }
    };

    checkImmediately();

    return () => clearInterval(checkInterval);
  }, [refreshReminders]);

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
  };

  return <ReminderContext.Provider value={value}>{children}</ReminderContext.Provider>;
};
