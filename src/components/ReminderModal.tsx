import { useState, useEffect } from 'react';
import { X, Bell, Clock, Calendar, Trash2, CheckCircle } from 'lucide-react';
import { useReminder } from '../contexts/ReminderContext';
import { 
  generateReminderId, 
  calculateReminderTime, 
  formatReminderTime,
  CourseReminder,
  getAllReminders,
  getDueReminders
} from '../utils/reminderStorage';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string;
  courseName: string;
}

export default function ReminderModal({ isOpen, onClose, courseId, courseName }: ReminderModalProps) {
  const { 
    setReminder, 
    cancelReminder, 
    getReminderByCourse, 
    notificationPermission,
    requestPermission 
  } = useReminder();

  const [selectedType, setSelectedType] = useState<'1hour' | 'tomorrow' | '1week' | 'custom' | null>(null);
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('09:00');
  const [existingReminder, setExistingReminder] = useState<CourseReminder | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load existing reminder
  useEffect(() => {
    if (isOpen) {
      const reminder = getReminderByCourse(courseId);
      setExistingReminder(reminder);
      setShowSuccess(false);
    }
  }, [isOpen, courseId, getReminderByCourse]);

  // Get minimum date for custom picker (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Handle quick reminder selection
  const handleQuickReminder = async (type: '1hour' | 'tomorrow' | '1week') => {
    setSelectedType(type);
    const reminderTime = calculateReminderTime(type);

    const newReminder: CourseReminder = {
      id: generateReminderId(),
      courseId,
      courseName,
      reminderTime,
      reminderType: type,
      createdAt: Date.now(),
      notified: false,
    };

    // SAVE REMINDER FIRST
    const success = setReminder(newReminder);
    console.log('💾 Reminder save result:', success);
    console.log('📅 Reminder time:', new Date(reminderTime).toLocaleString());
    console.log('⏰ Current time:', new Date().toLocaleString());
    
    if (success) {
      // THEN check notification permission
      if (notificationPermission !== 'granted') {
        const permission = await requestPermission();
        if (permission !== 'granted') {
          alert('⚠️ Reminder saved! But please enable notifications to receive alerts.');
        }
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      alert('❌ Failed to save reminder. Please try again.');
    }
  };

  // Handle custom reminder
  const handleCustomReminder = async () => {
    if (!customDate) {
      alert('Please select a date');
      return;
    }

    const dateTime = new Date(`${customDate}T${customTime}`);
    const reminderTime = dateTime.getTime();

    // Validate future time
    if (reminderTime <= Date.now()) {
      alert('Please select a future date and time');
      return;
    }

    const newReminder: CourseReminder = {
      id: generateReminderId(),
      courseId,
      courseName,
      reminderTime,
      reminderType: 'custom',
      createdAt: Date.now(),
      notified: false,
    };

    // SAVE REMINDER FIRST
    const success = setReminder(newReminder);
    console.log('💾 Custom reminder save result:', success);
    console.log('📅 Reminder time:', new Date(reminderTime).toLocaleString());
    console.log('⏰ Current time:', new Date().toLocaleString());
    
    if (success) {
      // THEN check notification permission
      if (notificationPermission !== 'granted') {
        const permission = await requestPermission();
        if (permission !== 'granted') {
          alert('⚠️ Reminder saved! But please enable notifications to receive alerts.');
        }
      }
      
      setShowSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      alert('❌ Failed to save reminder. Please try again.');
    }
  };

  // Handle cancel reminder
  const handleCancelReminder = () => {
    const success = cancelReminder(courseId);
    if (success) {
      setExistingReminder(null);
      alert('✅ Reminder cancelled successfully!');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" 
      style={{ 
        background: 'rgba(0,0,0,0.5)', 
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg rounded-3xl p-8 my-8 animate-in"
        style={{ 
          background: 'white',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
          animation: 'slideIn 0.3s ease-out',
          maxHeight: 'calc(100vh - 64px)',
          overflowY: 'auto'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <X size={16} color="#6B6B7B" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: '#EDE9FF' }}>
            <Bell size={20} color="#A98BFF" />
          </div>
          <div>
            <h2 className="text-xl font-black text-text">Set Reminder</h2>
            <p className="text-xs text-muted">Stay on track with your learning</p>
          </div>
        </div>

        {/* Course name */}
        <div className="mb-6 p-4 rounded-2xl" style={{ background: '#F6F6F8' }}>
          <p className="text-xs text-muted mb-1">Course</p>
          <p className="text-sm font-bold text-text">{courseName}</p>
        </div>

        {/* Existing reminder */}
        {existingReminder && !showSuccess && (
          <div className="mb-6 p-4 rounded-2xl border-2" style={{ borderColor: '#D7FF54', background: '#FAFFF0' }}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-bold mb-1" style={{ color: '#059669' }}>✓ Active Reminder</p>
                <p className="text-sm text-text font-semibold">
                  {formatReminderTime(existingReminder.reminderTime)}
                </p>
              </div>
              <button
                onClick={handleCancelReminder}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors"
                style={{ background: '#FEE2E2', color: '#DC2626' }}
              >
                <Trash2 size={12} />
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Success message */}
        {showSuccess && (
          <div className="mb-6 p-4 rounded-2xl" style={{ background: '#ECFDF5', border: '2px solid #059669' }}>
            <div className="flex items-center gap-3">
              <CheckCircle size={20} color="#059669" />
              <p className="text-sm font-bold" style={{ color: '#059669' }}>
                ✓ Reminder set successfully!
              </p>
            </div>
          </div>
        )}

        {/* Quick options */}
        {!showSuccess && (
          <>
            <p className="text-xs font-bold text-muted mb-3 uppercase tracking-wide">Quick Options</p>
            <div className="space-y-2 mb-6">
              <button
                onClick={() => handleQuickReminder('1hour')}
                className="w-full flex items-center gap-3 p-4 rounded-2xl transition-all duration-200 hover:scale-[1.02]"
                style={{ background: '#F6F6F8', border: '2px solid transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#A98BFF'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#FFF7ED' }}>
                  <Clock size={18} color="#F59E0B" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-text">Remind me in 1 hour</p>
                  <p className="text-xs text-muted">Perfect for a quick study session</p>
                </div>
              </button>

              <button
                onClick={() => handleQuickReminder('tomorrow')}
                className="w-full flex items-center gap-3 p-4 rounded-2xl transition-all duration-200 hover:scale-[1.02]"
                style={{ background: '#F6F6F8', border: '2px solid transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#A98BFF'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#E0F5FF' }}>
                  <Calendar size={18} color="#0EA5E9" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-text">Remind me tomorrow</p>
                  <p className="text-xs text-muted">Tomorrow at 9:00 AM</p>
                </div>
              </button>

              <button
                onClick={() => handleQuickReminder('1week')}
                className="w-full flex items-center gap-3 p-4 rounded-2xl transition-all duration-200 hover:scale-[1.02]"
                style={{ background: '#F6F6F8', border: '2px solid transparent' }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#A98BFF'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#ECFDF5' }}>
                  <Calendar size={18} color="#059669" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-text">Remind me in 1 week</p>
                  <p className="text-xs text-muted">Same time next week</p>
                </div>
              </button>
            </div>

            {/* Custom date/time */}
            <div className="pt-6 border-t border-border">
              <p className="text-xs font-bold text-muted mb-3 uppercase tracking-wide">Custom Time</p>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-text block mb-1">Date</label>
                  <input
                    type="date"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                    min={getMinDate()}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border text-sm font-semibold text-text focus:border-primary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-text block mb-1">Time</label>
                  <input
                    type="time"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-border text-sm font-semibold text-text focus:border-primary focus:outline-none"
                  />
                </div>
                <button
                  onClick={handleCustomReminder}
                  className="w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90"
                  style={{ background: '#A98BFF', color: 'white' }}
                >
                  Set Custom Reminder
                </button>
              </div>
            </div>

            {/* No reminders option */}
            <button
              onClick={onClose}
              className="w-full mt-4 py-3 rounded-xl font-bold text-sm text-muted hover:bg-gray-50 transition-colors"
            >
              No reminders for now
            </button>

            {/* DEBUG: Manual check button */}
            <button
              onClick={() => {
                const allReminders = getAllReminders();
                const dueReminders = getDueReminders();
                const now = Date.now();
                
                console.log('=== MANUAL REMINDER CHECK ===');
                console.log('Current time:', new Date(now).toLocaleString());
                console.log('All reminders:', allReminders);
                console.log('Due reminders:', dueReminders);
                
                alert(`Total reminders: ${allReminders.length}\nDue reminders: ${dueReminders.length}\n\nCheck console for details!`);
              }}
              className="w-full mt-2 py-2 rounded-xl font-bold text-xs transition-colors"
              style={{ background: '#FEE2E2', color: '#DC2626' }}
            >
              🐛 DEBUG: Check Reminders Now
            </button>
          </>
        )}

        {/* Notification permission warning */}
        {notificationPermission !== 'granted' && notificationPermission !== 'unsupported' && (
          <div className="mt-4 p-3 rounded-xl" style={{ background: '#FFF7ED', border: '1px solid #F59E0B' }}>
            <p className="text-xs text-center" style={{ color: '#92400E' }}>
              💡 You'll be asked to allow notifications when you set a reminder
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
