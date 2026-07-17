import { useState } from 'react';
import { Bell, X } from 'lucide-react';
import { useReminder } from '../contexts/ReminderContext';

interface NotificationPermissionBannerProps {
  onEnableClick?: () => void; // Callback when Enable is clicked
}

export default function NotificationPermissionBanner({ onEnableClick }: NotificationPermissionBannerProps) {
  const { notificationPermission, requestPermission } = useReminder();
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show if already granted, denied, unsupported, or dismissed
  if (
    notificationPermission === 'granted' || 
    notificationPermission === 'denied' ||
    notificationPermission === 'unsupported' ||
    isDismissed
  ) {
    return null;
  }

  const handleEnable = async () => {
    const permission = await requestPermission();
    if (permission === 'granted') {
      // Permission granted, now open reminder modal if callback provided
      if (onEnableClick) {
        onEnableClick();
      }
    } else if (permission === 'denied') {
      alert('⚠️ Notifications blocked. Please enable them in your browser settings.');
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
  };

  return (
    <div 
      className="p-4 rounded-3xl border-2 flex items-center gap-4"
      style={{ background: '#EDE9FF', borderColor: '#A98BFF' }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#A98BFF' }}>
        <Bell size={18} color="white" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-text mb-1">Enable Course Reminders</p>
        <p className="text-xs text-muted">
          Get notified about your unfinished courses and stay consistent with your learning goals
        </p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={handleEnable}
          className="px-4 py-2 rounded-xl text-xs font-bold text-white transition-all duration-200 hover:opacity-90"
          style={{ background: '#A98BFF' }}
        >
          Enable
        </button>
        <button
          onClick={handleDismiss}
          className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/50 transition-colors"
        >
          <X size={14} color="#6B6B7B" />
        </button>
      </div>
    </div>
  );
}
