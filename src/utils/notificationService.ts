// Browser notification service

export type NotificationPermissionStatus = 'granted' | 'denied' | 'default' | 'unsupported';

// Check if notifications are supported
export const isNotificationSupported = (): boolean => {
  return 'Notification' in window;
};

// Get current permission status
export const getNotificationPermission = (): NotificationPermissionStatus => {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }
  return Notification.permission as NotificationPermissionStatus;
};

// Request notification permission
export const requestNotificationPermission = async (): Promise<NotificationPermissionStatus> => {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }

  try {
    const permission = await Notification.requestPermission();
    return permission as NotificationPermissionStatus;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
};

// Show a notification
export const showNotification = (
  title: string,
  options?: {
    body?: string;
    icon?: string;
    badge?: string;
    tag?: string;
    data?: any;
    requireInteraction?: boolean;
  }
): Notification | null => {
  if (!isNotificationSupported()) {
    return null;
  }

  if (Notification.permission !== 'granted') {
    return null;
  }

  try {
    const notification = new Notification(title, {
      icon: options?.icon || '/vite.svg',
      badge: options?.badge || '/vite.svg',
      body: options?.body || '',
      tag: options?.tag || `notification_${Date.now()}`,
      data: options?.data || {},
      requireInteraction: options?.requireInteraction || false,
      silent: false,
    });

    return notification;
  } catch (error) {
    console.error('Error showing notification:', error);
    return null;
  }
};

// Show course reminder notification
export const showCourseReminderNotification = (
  courseName: string,
  courseId: string,
  onClickCallback?: () => void
): Notification | null => {
  const notification = showNotification(
    '📚 Course Reminder',
    {
      body: `Time to continue learning "${courseName}"! Keep your streak going! 🔥`,
      icon: '/vite.svg',
      tag: `course-reminder-${courseId}`,
      data: { courseId, courseName },
      requireInteraction: false,
    }
  );

  if (notification && onClickCallback) {
    notification.onclick = () => {
      onClickCallback();
      notification.close();
    };
  }

  return notification;
};

// Test notification (for debugging)
export const showTestNotification = (): void => {
  showNotification('Test Notification', {
    body: 'If you see this, notifications are working! 🎉',
    requireInteraction: false,
  });
};
