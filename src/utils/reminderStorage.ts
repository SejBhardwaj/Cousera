// Reminder storage utility for course reminders

export interface CourseReminder {
  id: string;
  courseId: string;
  courseName: string;
  reminderTime: number; // timestamp in milliseconds
  reminderType: '1hour' | 'tomorrow' | '1week' | 'custom' | 'none';
  createdAt: number;
  notified: boolean;
  courseUrl?: string; // For deep linking
}

const STORAGE_KEY = 'coursera_reminders';

// Get all reminders
export const getAllReminders = (): CourseReminder[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error getting reminders:', error);
    return [];
  }
};

// Get reminder for specific course
export const getReminderForCourse = (courseId: string): CourseReminder | null => {
  const reminders = getAllReminders();
  return reminders.find(r => r.courseId === courseId && !r.notified) || null;
};

// Save a new reminder
export const saveReminder = (reminder: CourseReminder): boolean => {
  try {
    const reminders = getAllReminders();
    
    // Remove any existing reminder for this course
    const filtered = reminders.filter(r => r.courseId !== reminder.courseId);
    
    // Add new reminder
    filtered.push(reminder);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error saving reminder:', error);
    return false;
  }
};

// Delete reminder for a course
export const deleteReminder = (courseId: string): boolean => {
  try {
    const reminders = getAllReminders();
    const filtered = reminders.filter(r => r.courseId !== courseId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting reminder:', error);
    return false;
  }
};

// Mark reminder as notified
export const markAsNotified = (reminderId: string): boolean => {
  try {
    const reminders = getAllReminders();
    const reminder = reminders.find(r => r.id === reminderId);
    
    if (reminder) {
      reminder.notified = true;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error marking reminder:', error);
    return false;
  }
};

// Get active (not notified) reminders
export const getActiveReminders = (): CourseReminder[] => {
  const reminders = getAllReminders();
  return reminders.filter(r => !r.notified);
};

// Get due reminders (active and time has passed)
export const getDueReminders = (): CourseReminder[] => {
  const now = Date.now();
  const active = getActiveReminders();
  return active.filter(r => r.reminderTime <= now);
};

// Clean up old notified reminders (older than 7 days)
export const cleanupOldReminders = (): void => {
  try {
    const reminders = getAllReminders();
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    
    const filtered = reminders.filter(r => {
      // Keep active reminders
      if (!r.notified) return true;
      // Keep notified reminders less than 7 days old
      return r.reminderTime > sevenDaysAgo;
    });
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error cleaning reminders:', error);
  }
};

// Calculate reminder time based on type
export const calculateReminderTime = (type: CourseReminder['reminderType']): number => {
  const now = new Date();
  
  switch (type) {
    case '1hour':
      return Date.now() + (60 * 60 * 1000); // 1 hour from now
      
    case 'tomorrow':
      // Tomorrow at 9 AM
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      return tomorrow.getTime();
      
    case '1week':
      // Same time next week
      return Date.now() + (7 * 24 * 60 * 60 * 1000);
      
    default:
      return Date.now();
  }
};

// Format reminder time for display
export const formatReminderTime = (timestamp: number): string => {
  const date = new Date(timestamp);
  const now = new Date();
  
  // Check if today
  const isToday = date.toDateString() === now.toDateString();
  
  // Check if tomorrow
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = date.toDateString() === tomorrow.toDateString();
  
  const timeStr = date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  
  if (isToday) {
    return `Today at ${timeStr}`;
  } else if (isTomorrow) {
    return `Tomorrow at ${timeStr}`;
  } else {
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }
};

// Generate unique ID for reminder
export const generateReminderId = (): string => {
  return `reminder_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};
