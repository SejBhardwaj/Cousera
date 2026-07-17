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

  // Clear due reminder notification
  const clearDueReminder = useCallback(() => {
    setDueReminderNotification(null);
  }, []);

  // Check for due reminders periodically
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const now = Date.now();
      const dueReminders = getDueReminders();
      
      console.log('⏰ Checking reminders at:', new Date().toLocaleTimeString());
      console.log('📋 Total reminders:', reminders.length);
      console.log('🔔 Due reminders:', dueReminders.length);
      
      if (dueReminders.length > 0) {
        console.log(`🔔 ${dueReminders.length} due reminder(s) found!`);
        
        dueReminders.forEach((reminder) => {
          console.log('⏰ Sending notification for:', reminder.courseName);
          console.log('⏰ Reminder time:', new Date(reminder.reminderTime).toLocaleString());
          console.log('⏰ Current time:', new Date(now).toLocaleString());
          
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

          console.log('✅ In-app notification shown!');
          // Mark as notified
          markAsNotified(reminder.id);
          refreshReminders();
        });
      }
    }, 10000); // Check every 10 seconds for testing

    // Also check immediately on mount
    const checkImmediately = () => {
      const dueReminders = getDueReminders();
      console.log('🚀 Initial check - Due reminders:', dueReminders.length);
      
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
  }, [refreshReminders, reminders]);

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
