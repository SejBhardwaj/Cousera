import { useState, useEffect } from 'react';
import { Play, Star, Clock, Users, Award, ChevronDown, ChevronUp, Check, BookOpen, Globe, Briefcase, ArrowLeft, Bookmark, Download, Trash2, Bell } from 'lucide-react';
import CompletionCelebration from '../components/CompletionCelebration';
import { useOffline } from '../contexts/OfflineContext';
import { useStreak } from '../contexts/StreakContext';
import { useReminder } from '../contexts/ReminderContext';
import StreakCelebration from '../components/StreakCelebration';
import ReminderModal from '../components/ReminderModal';
import NotificationPermissionBanner from '../components/NotificationPermissionBanner';
import VideoModal from '../components/VideoModal';
import ResumeWatchingButton from '../components/ResumeWatchingButton';
import { formatReminderTime } from '../utils/reminderStorage';
import { getCourseProgress, VideoProgress, getVideoProgress } from '../utils/videoProgressStorage';
import { 
  downloadCourseForOffline, 
  isOfflineAvailable, 
  deleteCourseOffline,
  formatBytes 
} from '../utils/offlineStorage';

const CURRICULUM = [
  { section: 'Week 1–2: Foundations', lessons: ['Introduction to ML', 'Supervised Learning Overview', 'Linear Regression', 'Gradient Descent', 'Quiz: Week 1'], duration: '4h 20m', open: true },
  { section: 'Week 3–4: Classification', lessons: ['Logistic Regression', 'Decision Trees', 'Random Forests', 'SVMs', 'Lab: Build a Classifier'], duration: '5h 45m', open: false },
  { section: 'Week 5–6: Neural Networks', lessons: ['Perceptrons', 'Backpropagation', 'Activation Functions', 'Deep Networks', 'Project: Neural Net'], duration: '6h 15m', open: false },
  { section: 'Week 7–8: Advanced Topics', lessons: ['Unsupervised Learning', 'Clustering', 'Dimensionality Reduction', 'Recommender Systems'], duration: '4h 50m', open: false },
];

const REVIEWS = [
  { name: 'Priya Sharma', rating: 5, date: '2 weeks ago', text: 'Absolutely brilliant course. Andrew Ng is the best instructor I have ever had. The pace is perfect and every concept is crystal clear.', avatar: 'https://i.pravatar.cc/150?img=32' },
  { name: 'Marcus Lee', rating: 5, date: '1 month ago', text: 'This course changed my life. I went from zero ML knowledge to getting a data science job. Highly recommend to anyone.', avatar: 'https://i.pravatar.cc/150?img=33' },
  { name: 'Sofia R.', rating: 4, date: '3 weeks ago', text: 'Great content overall. The hands-on labs are especially valuable. Would love more Python exercises.', avatar: 'https://i.pravatar.cc/150?img=47' },
];

interface CourseDetailProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export default function CourseDetail({ onBack, onNavigate }: CourseDetailProps) {
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]));
  const [bookmarked, setBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState('About');
  const [progress, setProgress] = useState(68); // Current progress
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationClosed, setCelebrationClosed] = useState(false); // Track if celebration was manually closed
  
  // Offline functionality
  const { isOnline, offlineCourses, refreshOfflineCourses } = useOffline();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [courseOffline, setCourseOffline] = useState(false);
  
  // Offline data state
  const [offlineData, setOfflineData] = useState<any>(null);
  const [isLoadingOffline, setIsLoadingOffline] = useState(false);

  // Streak tracking
  const { trackCourseActivity, newBadges, clearNewBadges } = useStreak();
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);

  // Reminder functionality
  const { getReminderByCourse } = useReminder();
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [courseReminder, setCourseReminder] = useState<any>(null);

  // Video functionality
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<{
    id: string;
    title: string;
    url: string;
    lesson?: string;
  } | null>(null);
  const [courseVideoProgress, setCourseVideoProgress] = useState<VideoProgress | null>(null);

  useEffect(() => {
    console.log('🎭 showCelebration state:', showCelebration);
    console.log('🎯 Current progress:', progress);
    console.log('🚪 Celebration closed:', celebrationClosed);
  }, [showCelebration, progress, celebrationClosed]);

  const courseId = 'ml-specialization';
  const courseName = 'Machine Learning Specialization';

  // Track course activity on mount (viewing course = activity)
  useEffect(() => {
    console.log('📚 Course viewed - tracking activity');
    const badges = trackCourseActivity();
    if (badges.length > 0) {
      setShowStreakCelebration(true);
    }
  }, [trackCourseActivity]);

  // Show streak celebration when new badges unlocked
  useEffect(() => {
    if (newBadges.length > 0) {
      setShowStreakCelebration(true);
    }
  }, [newBadges]);

  // Load course reminder
  useEffect(() => {
    const reminder = getReminderByCourse(courseId);
    setCourseReminder(reminder);
  }, [courseId, getReminderByCourse, showReminderModal]); // Refresh when modal closes

  // Load course video progress
  useEffect(() => {
    const progress = getCourseProgress(courseId);
    if (progress && progress.mostRecentVideo) {
      setCourseVideoProgress(progress.mostRecentVideo);
    }
  }, [courseId, showVideoModal]); // Refresh when video modal closes

  // Check if course is available offline
  useEffect(() => {
    const checkOffline = async () => {
      const available = await isOfflineAvailable(courseId);
      setCourseOffline(available);
    };
    checkOffline();
  }, [courseId]);

  // Load offline data when offline
  useEffect(() => {
    const loadOfflineData = async () => {
      if (!isOnline && courseOffline) {
        console.log('📵 OFFLINE MODE: Loading from IndexedDB...');
        setIsLoadingOffline(true);
        const { getCourseOfflineData } = await import('../utils/offlineStorage');
        const data = await getCourseOfflineData(courseId);
        if (data) {
          console.log('✅ Loaded offline data:', data);
          setOfflineData(data);
        } else {
          console.error('❌ No offline data found');
        }
        setIsLoadingOffline(false);
      } else if (isOnline) {
        // Clear offline data when back online
        setOfflineData(null);
      }
    };
    loadOfflineData();
  }, [isOnline, courseOffline, courseId]);

  // Check if course is already completed
  useEffect(() => {
    const completionKey = `course-${courseId}-completed`;
    const isAlreadyCompleted = localStorage.getItem(completionKey);
    
    console.log('🎯 Progress changed to:', progress);
    console.log('📦 Already completed:', isAlreadyCompleted);
    console.log('📦 Celebration closed flag:', celebrationClosed);
    
    // Simulate course completion when progress reaches 100%
    if (progress === 100 && !isAlreadyCompleted && !showCelebration) {
      console.log('🎉 Progress reached 100%! Waiting 1 second...');
      
      // Wait 1 second before showing celebration
      const timer = setTimeout(() => {
        console.log('🎊 TRIGGERING CELEBRATION NOW!');
        setShowCelebration(true);
        localStorage.setItem(completionKey, 'true');
        localStorage.setItem(`${completionKey}-date`, new Date().toISOString());
      }, 1000);

      // Cleanup timer if component unmounts
      return () => clearTimeout(timer);
    }
  }, [progress, courseId, showCelebration, celebrationClosed]);

  // Function to simulate course completion (for testing)
  const handleCompleteCourse = () => {
    console.log('🚀 COMPLETE COURSE BUTTON CLICKED!');
    setProgress(100);
    console.log('✅ Progress set to 100');
  };

  // Reset celebration for testing
  const handleResetCelebration = () => {
    const completionKey = `course-${courseId}-completed`;
    localStorage.removeItem(completionKey);
    localStorage.removeItem(`${completionKey}-date`);
    setProgress(68);
    setShowCelebration(false);
    setCelebrationClosed(false); // Reset the closed flag
    console.log('🔄 Reset complete - you can test again!');
  };

  const handleViewCertificate = () => {
    setShowCelebration(false);
    setActiveTab('Certificate');
  };

  const handleContinueLearning = () => {
    setShowCelebration(false);
    onNavigate('explore');
  };

  const handleCloseCelebration = () => {
    console.log('🚪 Modal closed manually');
    setShowCelebration(false);
    setCelebrationClosed(true); // Mark that celebration was closed
  };

  // Download course for offline
  const handleDownloadOffline = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);

    const courseData = {
      title: courseName,
      description: 'Master the fundamentals of machine learning and build practical ML models using the latest techniques from Stanford University and DeepLearning.AI.',
      provider: 'Stanford University, DeepLearning.AI',
      instructor: 'Andrew Ng',
      category: 'AI / ML',
      categoryColor: '#A98BFF',
      rating: 4.9,
      reviews: 128400,
      learners: '2.1M learners',
      duration: '11 weeks · ~10h/week',
      language: 'English · 20 languages subtitled',
      curriculum: CURRICULUM,
      whatYouLearn: [
        'Build ML models with NumPy & scikit-learn',
        'Train neural networks with TensorFlow',
        'Apply best practices for ML development',
        'Implement decision trees, random forests, SVMs',
        'Use unsupervised learning algorithms',
        'Build recommender systems from scratch',
        'Deploy ML models to production',
        'Understand the math behind ML algorithms',
      ],
      stats: [
        { label: 'Total Lessons', value: '86' },
        { label: 'Projects', value: '12' },
        { label: 'Certificate', value: 'Yes' },
        { label: 'Skill Level', value: 'All' },
      ],
      careerOutcomes: [
        { role: 'ML Engineer', salary: '$148K', growth: '+23%' },
        { role: 'Data Scientist', salary: '$136K', growth: '+18%' },
        { role: 'AI Researcher', salary: '$162K', growth: '+31%' },
      ],
      reviewsList: REVIEWS,
      projects: [
        { title: 'House Price Predictor', desc: 'Build a regression model to predict housing prices using real data.', difficulty: 'Medium' },
        { title: 'Email Spam Classifier', desc: 'Train a classification algorithm to detect spam emails.', difficulty: 'Easy' },
        { title: 'Collaborative Filtering', desc: 'Build a movie recommendation engine using matrix factorization.', difficulty: 'Hard' },
        { title: 'Anomaly Detection System', desc: 'Detect anomalies in network traffic using unsupervised learning.', difficulty: 'Hard' },
      ],
      progress,
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
      instructorImg: 'https://i.pravatar.cc/150?img=12',
      difficulty: 'All Levels',
    };

    const success = await downloadCourseForOffline(courseData, setDownloadProgress);
    
    if (success) {
      setCourseOffline(true);
      await refreshOfflineCourses();
      alert('✅ Course downloaded successfully! You can now access it offline.');
    } else {
      alert('❌ Failed to download course. Please try again.');
    }

    setIsDownloading(false);
    setDownloadProgress(0);
  };

  // Delete offline course
  const handleDeleteOffline = async () => {
    if (!confirm('Are you sure you want to delete offline data for this course?')) {
      return;
    }

    const success = await deleteCourseOffline(courseId);
    if (success) {
      setCourseOffline(false);
      await refreshOfflineCourses();
      alert('✅ Offline data deleted successfully.');
    } else {
      alert('❌ Failed to delete offline data.');
    }
  };

  // Open video modal
  const handleOpenVideo = (videoId: string, videoTitle: string, lessonTitle?: string) => {
    setCurrentVideo({
      id: videoId,
      title: videoTitle,
      url: `https://www.w3schools.com/html/mov_bbb.mp4`, // Demo video URL
      lesson: lessonTitle,
    });
    setShowVideoModal(true);
  };

  // Handle video complete
  const handleVideoComplete = () => {
    console.log('✅ Video completed!');
    // Could trigger confetti or show next video suggestion here
  };

  // Handle video progress update
  const handleVideoProgressUpdate = (progress: VideoProgress) => {
    // Update UI if needed
    console.log('📹 Video progress:', progress.percentComplete + '%');
  };

  const tabs = ['About', 'Curriculum', 'Projects', 'Reviews', 'Certificate'];

  return (
    <div className="flex-1 py-4 pr-4 pl-2 overflow-y-auto no-scrollbar space-y-5 animate-in">

      {/* Notification Permission Banner */}
      <NotificationPermissionBanner />

      {/* Offline Warning */}
      {!isOnline && !courseOffline && (
        <div className="p-5 rounded-3xl" style={{ background: '#FEF3C7', border: '2px solid #F59E0B' }}>
          <div className="flex items-center gap-3">
            <div className="text-2xl">📵</div>
            <div>
              <p className="font-bold text-sm" style={{ color: '#D97706' }}>Course Not Available Offline</p>
              <p className="text-xs" style={{ color: '#92400E' }}>
                This course hasn't been downloaded. Please go online and click "Download Offline" to access this course without internet.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading offline data */}
      {isLoadingOffline && (
        <div className="p-5 rounded-3xl bg-white text-center">
          <p className="text-sm font-bold text-text">Loading offline content...</p>
        </div>
      )}

      {/* Back + Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-border text-sm font-semibold text-text hover:bg-bg transition-colors"
        >
          <ArrowLeft size={15} />
          Back
        </button>
        <button
          onClick={() => setBookmarked(!bookmarked)}
          className="w-9 h-9 rounded-2xl flex items-center justify-center border border-border bg-white hover:bg-bg transition-colors"
        >
          <Bookmark size={15} fill={bookmarked ? '#0F0F0F' : 'none'} color="#0F0F0F" />
        </button>

        {/* Reminder button */}
        <button
          onClick={() => setShowReminderModal(true)}
          className="w-9 h-9 rounded-2xl flex items-center justify-center border border-border bg-white hover:bg-bg transition-colors relative"
          title={courseReminder ? `Reminder: ${formatReminderTime(courseReminder.reminderTime)}` : 'Set reminder'}
        >
          <Bell size={15} color={courseReminder ? '#A98BFF' : '#0F0F0F'} fill={courseReminder ? '#A98BFF' : 'none'} />
          {courseReminder && (
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full" style={{ background: '#D7FF54' }} />
          )}
        </button>

        {/* Offline Status & Actions */}
        <div className="ml-auto flex items-center gap-3">
          {courseOffline && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold text-white" style={{ background: '#059669' }}>
              <Download size={14} />
              Available Offline
            </div>
          )}
          
          {!isOnline && (
            <div className="px-4 py-2 rounded-2xl text-xs font-bold" style={{ background: '#FEF3C7', color: '#D97706' }}>
              📵 Offline Mode
            </div>
          )}

          {isDownloading ? (
            <div className="px-5 py-3 rounded-2xl bg-white border-2 border-border">
              <div className="text-xs font-bold text-text mb-2">
                {downloadProgress === 100 ? '✓ Download Complete!' : `Downloading... ${downloadProgress}%`}
              </div>
              <div className="w-40 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500 ease-out" 
                  style={{ 
                    width: `${downloadProgress}%`, 
                    background: downloadProgress === 100 
                      ? 'linear-gradient(90deg, #059669 0%, #7DEBA3 100%)' 
                      : 'linear-gradient(90deg, #A98BFF 0%, #D7FF54 100%)'
                  }}
                />
              </div>
            </div>
          ) : courseOffline ? (
            <button
              onClick={handleDeleteOffline}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-border text-sm font-semibold hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors"
              style={{ color: '#DC2626' }}
            >
              <Trash2 size={14} />
              Delete Offline
            </button>
          ) : (
            <button
              onClick={handleDownloadOffline}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-bold text-white transition-all duration-200 hover:opacity-90"
              style={{ background: '#059669' }}
            >
              <Download size={14} />
              Download Offline
            </button>
          )}
        </div>
      </div>

      {/* Hero Card */}
      <div
        className="relative rounded-4xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0F0F0F 0%, #1a1a2e 100%)' }}
      >
        <div className="absolute inset-0">
          <img
            src={offlineData ? offlineData.images.thumbnail : 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80'}
            alt="Course"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 p-8">
          <div className="flex gap-2 mb-4">
            <span className="tag px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#A98BFF', color: 'white' }}>AI / ML</span>
            <span className="tag px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(215,255,84,0.2)', color: '#D7FF54' }}>Certificate</span>
          </div>
          <h1 className="text-section text-white mb-3 max-w-2xl leading-tight">Machine Learning Specialization</h1>
          <p className="text-white/60 text-sm mb-6 max-w-xl leading-relaxed">
            Master the fundamentals of machine learning and build practical ML models using the latest techniques from Stanford University and DeepLearning.AI.
          </p>

          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Star size={15} fill="#F59E0B" color="#F59E0B" />
              <span className="text-white font-bold text-sm">4.9</span>
              <span className="text-white/50 text-xs">(128,400 ratings)</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Users size={14} />
              <span>2.1M learners</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Clock size={14} />
              <span>11 weeks · ~10h/week</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Globe size={14} />
              <span>English · 20 languages subtitled</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ background: '#D7FF54', color: '#111' }}
            >
              <Play size={15} fill="#111" color="#111" />
              Continue Learning
            </button>
            <button className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors">
              Preview Course
            </button>
          </div>
        </div>

        {/* Instructor floating card */}
        <div className="absolute right-8 bottom-8 bg-white/10 backdrop-blur border border-white/10 rounded-3xl p-4 flex items-center gap-3">
          <img
            src={offlineData ? offlineData.images.instructor : 'https://i.pravatar.cc/150?img=12'}
            alt="Andrew Ng"
            className="w-12 h-12 rounded-full object-cover border-2 border-white/30"
          />
          <div>
            <p className="text-white font-bold text-sm">Andrew Ng</p>
            <p className="text-white/50 text-xs">Stanford University</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Star size={10} fill="#D7FF54" color="#D7FF54" />
              <span className="text-xs text-white/70">4.9 · 10M+ students</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="card-static p-5 rounded-3xl">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-bold text-text text-sm">Your Progress</p>
            <p className="text-xs text-muted">
              {progress === 100 && !showCelebration ? 'Course Completed! 🎉' : progress === 100 ? 'Course Completed! 🎉' : `Week ${Math.ceil(progress / 12.5)} of 11 · ${progress < 62 ? 'Neural Networks' : 'Advanced Topics'}`}
            </p>
          </div>
          <span className="text-2xl font-black text-text">{progress}%</span>
        </div>
        
        {/* Progress bar - GREEN when completed, RED only after modal manually closed */}
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{ 
              width: `${progress}%`, 
              background: progress === 100 && celebrationClosed
                ? 'linear-gradient(90deg, #DC2626 0%, #FF6D70 100%)' // RED only after celebration closed
                : progress === 100 
                ? 'linear-gradient(90deg, #059669 0%, #7DEBA3 100%)' // GREEN when completed
                : 'linear-gradient(90deg, #A98BFF 0%, #D7FF54 100%)' // Normal gradient
            }}
          />
        </div>
        
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted">Started Mar 2024</span>
          {progress === 100 ? (
            <span className="text-xs font-bold" style={{ color: celebrationClosed ? '#DC2626' : '#059669' }}>
              ✓ Completed!
            </span>
          ) : (
            <span className="text-xs text-muted">Est. completion: Aug 2024</span>
          )}
        </div>
        
        {/* Complete button */}
        {progress < 100 && (
          <button
            onClick={handleCompleteCourse}
            className="w-full mt-3 px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-200 hover:opacity-90"
            style={{ background: '#D7FF54', color: '#111' }}
          >
            ✓ Complete the Course (Mark as Complete)
          </button>
        )}
        
        {/* Reset button - Only shown after modal is closed */}
        {progress === 100 && celebrationClosed && (
          <button
            onClick={handleResetCelebration}
            className="w-full mt-3 px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-200 hover:opacity-90"
            style={{ background: '#FF6D70', color: 'white' }}
          >
            🔄 Reset & Test Again
          </button>
        )}
      </div>

      {/* Resume Watching Button */}
      {courseVideoProgress && !courseVideoProgress.completed && (
        <ResumeWatchingButton
          video={courseVideoProgress}
          onClick={() => handleOpenVideo(
            courseVideoProgress.videoId,
            courseVideoProgress.videoTitle,
            courseVideoProgress.lessonTitle
          )}
        />
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-2xl" style={{ background: '#F0F0F5' }}>
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            style={{
              background: activeTab === t ? 'white' : 'transparent',
              color: activeTab === t ? '#0F0F0F' : '#6B6B7B',
              boxShadow: activeTab === t ? '0 2px 12px rgba(0,0,0,0.08)' : 'none',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'About' && (
        <div className="space-y-4">
          {/* What you'll learn */}
          <div className="card-static p-6 rounded-4xl">
            <h2 className="text-card-title text-text mb-5">What you'll learn</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                'Build ML models with NumPy & scikit-learn',
                'Train neural networks with TensorFlow',
                'Apply best practices for ML development',
                'Implement decision trees, random forests, SVMs',
                'Use unsupervised learning algorithms',
                'Build recommender systems from scratch',
                'Deploy ML models to production',
                'Understand the math behind ML algorithms',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: '#ECFDF5' }}>
                    <Check size={11} color="#059669" />
                  </div>
                  <span className="text-sm text-text">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total Lessons', value: '86', icon: <BookOpen size={16} color="#A98BFF" />, bg: '#EDE9FF' },
              { label: 'Projects', value: '12', icon: <Briefcase size={16} color="#83D6FF" />, bg: '#E0F5FF' },
              { label: 'Certificate', value: 'Yes', icon: <Award size={16} color="#F59E0B" />, bg: '#FFF7ED' },
              { label: 'Skill Level', value: 'All', icon: <Users size={16} color="#7DEBA3" />, bg: '#ECFDF5' },
            ].map((s) => (
              <div key={s.label} className="card-static p-4 rounded-3xl text-center">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center mx-auto mb-2" style={{ background: s.bg }}>
                  {s.icon}
                </div>
                <div className="font-black text-xl text-text">{s.value}</div>
                <div className="text-xs text-muted">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Career Outcomes */}
          <div
            className="p-6 rounded-4xl"
            style={{ background: 'linear-gradient(135deg, #EDE9FF 0%, #E0F5FF 100%)' }}
          >
            <h2 className="text-card-title text-text mb-4">Career Outcomes</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { role: 'ML Engineer', salary: '$148K', growth: '+23%' },
                { role: 'Data Scientist', salary: '$136K', growth: '+18%' },
                { role: 'AI Researcher', salary: '$162K', growth: '+31%' },
              ].map((c) => (
                <div key={c.role} className="bg-white/70 rounded-3xl p-4">
                  <p className="font-bold text-text text-sm mb-1">{c.role}</p>
                  <p className="text-2xl font-black text-text">{c.salary}</p>
                  <p className="text-xs font-semibold mt-1" style={{ color: '#059669' }}>avg salary · {c.growth} demand</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Curriculum' && (
        <div className="space-y-3">
          <div className="card-static p-5 rounded-3xl flex items-center justify-between">
            <div>
              <p className="font-bold text-text">86 lessons</p>
              <p className="text-xs text-muted">Total: 21h 10m of content</p>
            </div>
            <button className="text-xs font-semibold text-muted hover:text-text transition-colors">
              Expand All
            </button>
          </div>
          {CURRICULUM.map((section, i) => {
            const isOpen = openSections.has(i);
            const isCompleted = progress === 100;
            return (
              <div key={i} className="card-static rounded-3xl overflow-hidden p-0">
                <button
                  className="w-full flex items-center justify-between p-5 hover:bg-bg transition-colors"
                  onClick={() => {
                    const next = new Set(openSections);
                    if (isOpen) next.delete(i); else next.add(i);
                    setOpenSections(next);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-300" 
                      style={{ 
                        background: isCompleted ? '#ECFDF5' : '#EDE9FF' 
                      }}
                    >
                      {isCompleted ? (
                        <Check size={14} color="#059669" strokeWidth={3} />
                      ) : (
                        <span className="text-xs font-black" style={{ color: '#A98BFF' }}>{i + 1}</span>
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm text-text">{section.section}</p>
                      <p className="text-xs text-muted">{section.lessons.length} lessons · {section.duration}</p>
                    </div>
                  </div>
                  {isOpen ? <ChevronUp size={16} color="#6B6B7B" /> : <ChevronDown size={16} color="#6B6B7B" />}
                </button>
                {isOpen && (
                  <div className="border-t border-border">
                    {section.lessons.map((lesson, j) => {
                      // Generate unique video ID for each lesson
                      const videoId = `${courseId}-week${i + 1}-lesson${j + 1}`;
                      const lessonProgress = getVideoProgress(videoId);
                      
                      return (
                        <div
                          key={j}
                          className="flex items-center gap-3 px-5 py-3 hover:bg-bg transition-colors cursor-pointer group"
                          onClick={() => handleOpenVideo(videoId, lesson, section.section)}
                        >
                          {isCompleted || (lessonProgress && lessonProgress.completed) ? (
                            <div 
                              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300" 
                              style={{ background: '#ECFDF5' }}
                            >
                              <Check size={14} color="#059669" strokeWidth={3} />
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-purple-100 transition-colors" style={{ background: '#F6F6F8' }}>
                              <Play size={11} color="#6B6B7B" fill="#6B6B7B" />
                            </div>
                          )}
                          <div className="flex-1">
                            <span className="text-sm text-text">{lesson}</span>
                            {lessonProgress && !lessonProgress.completed && lessonProgress.percentComplete > 0 && (
                              <div className="mt-1 flex items-center gap-2">
                                <div className="flex-1 h-1 bg-gray-100 rounded-full overflow-hidden max-w-[200px]">
                                  <div
                                    className="h-full rounded-full"
                                    style={{
                                      width: `${lessonProgress.percentComplete}%`,
                                      background: 'linear-gradient(90deg, #A98BFF 0%, #D7FF54 100%)',
                                    }}
                                  />
                                </div>
                                <span className="text-xs font-semibold" style={{ color: '#A98BFF' }}>
                                  {lessonProgress.percentComplete}%
                                </span>
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-muted">~15 min</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'Reviews' && (
        <div className="space-y-4">
          <div className="card-static p-6 rounded-4xl">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-6xl font-black text-text">4.9</div>
                <div className="flex gap-0.5 justify-center mt-1">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />)}
                </div>
                <div className="text-xs text-muted mt-1">128,400 ratings</div>
              </div>
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const pct = stars === 5 ? 78 : stars === 4 ? 16 : stars === 3 ? 4 : stars === 2 ? 1 : 1;
                  return (
                    <div key={stars} className="flex items-center gap-3">
                      <div className="flex gap-0.5">
                        {Array.from({ length: stars }).map((_, i) => <Star key={i} size={10} fill="#F59E0B" color="#F59E0B" />)}
                      </div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: '#F59E0B' }} />
                      </div>
                      <span className="text-xs text-muted w-8">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {REVIEWS.map((r, idx) => (
            <div key={r.name} className="card-static p-5 rounded-3xl">
              <div className="flex items-start gap-3 mb-3">
                <img 
                  src={offlineData && offlineData.images.reviewers[idx] ? offlineData.images.reviewers[idx] : r.avatar} 
                  alt={r.name} 
                  className="w-9 h-9 rounded-full object-cover" 
                />
                <div className="flex-1">
                  <p className="font-bold text-sm text-text">{r.name}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      {Array.from({ length: r.rating }).map((_, i) => <Star key={i} size={11} fill="#F59E0B" color="#F59E0B" />)}
                    </div>
                    <span className="text-xs text-muted">{r.date}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-text leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Certificate' && (
        <div className="space-y-4">
          <div
            className="p-8 rounded-4xl text-center"
            style={{ background: 'linear-gradient(135deg, #111 0%, #1a1a2e 100%)' }}
          >
            <div 
              className="w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-5" 
              style={{ 
                background: progress === 100 ? '#D7FF54' : 'rgba(215,255,84,0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              <Award size={28} color="#111" />
            </div>
            <h2 className="text-section text-white mb-3">
              {progress === 100 ? 'Certificate Earned! 🎉' : 'Professional Certificate'}
            </h2>
            <p className="text-white/60 text-sm mb-6 max-w-md mx-auto">
              {progress === 100 
                ? 'Congratulations! Your certificate is now available to download and share on LinkedIn.'
                : 'Earn a shareable certificate from Stanford University and DeepLearning.AI upon completion.'
              }
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              <div 
                className="px-4 py-2 rounded-2xl text-xs font-bold" 
                style={{ 
                  background: progress === 100 ? 'rgba(215,255,84,0.25)' : 'rgba(215,255,84,0.15)', 
                  color: '#D7FF54' 
                }}
              >
                LinkedIn Ready
              </div>
              <div 
                className="px-4 py-2 rounded-2xl text-xs font-bold" 
                style={{ 
                  background: progress === 100 ? 'rgba(131,214,255,0.25)' : 'rgba(131,214,255,0.15)', 
                  color: '#83D6FF' 
                }}
              >
                Resume Worthy
              </div>
              <div 
                className="px-4 py-2 rounded-2xl text-xs font-bold" 
                style={{ 
                  background: progress === 100 ? 'rgba(255,109,112,0.25)' : 'rgba(255,109,112,0.15)', 
                  color: '#FF6D70' 
                }}
              >
                Industry Recognized
              </div>
            </div>
            
            {progress === 100 && (
              <button
                className="mt-6 px-8 py-3 rounded-2xl font-bold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ background: '#D7FF54', color: '#111' }}
              >
                Download Certificate
              </button>
            )}
          </div>
          <div className="card-static p-6 rounded-4xl text-center">
            <p className="text-sm text-muted mb-2">Your current progress</p>
            <p className="text-4xl font-black text-text mb-4">{progress}%</p>
            <div className="h-3 bg-gray-100 rounded-full mb-3">
              <div 
                className="h-full rounded-full transition-all duration-1000" 
                style={{ 
                  width: `${progress}%`, 
                  background: progress === 100 
                    ? 'linear-gradient(90deg, #7DEBA3, #D7FF54)' 
                    : 'linear-gradient(90deg, #A98BFF, #D7FF54)' 
                }} 
              />
            </div>
            {progress === 100 ? (
              <p className="text-xs font-bold" style={{ color: '#7DEBA3' }}>✓ Course completed!</p>
            ) : (
              <p className="text-xs text-muted">Complete {100 - progress}% more to earn your certificate</p>
            )}
          </div>
        </div>
      )}

      {(activeTab === 'Projects') && (
        <div className="grid grid-cols-2 gap-4">
          {[
            { title: 'House Price Predictor', desc: 'Build a regression model to predict housing prices using real data.', difficulty: 'Medium', accent: '#D7FF54' },
            { title: 'Email Spam Classifier', desc: 'Train a classification algorithm to detect spam emails.', difficulty: 'Easy', accent: '#7DEBA3' },
            { title: 'Collaborative Filtering', desc: 'Build a movie recommendation engine using matrix factorization.', difficulty: 'Hard', accent: '#FF6D70' },
            { title: 'Anomaly Detection System', desc: 'Detect anomalies in network traffic using unsupervised learning.', difficulty: 'Hard', accent: '#A98BFF' },
          ].map((p) => (
            <div key={p.title} className="card-static p-6 rounded-3xl">
              <div className="w-10 h-10 rounded-2xl mb-4" style={{ background: p.accent }} />
              <h3 className="font-bold text-text mb-2">{p.title}</h3>
              <p className="text-sm text-muted leading-relaxed mb-4">{p.desc}</p>
              <span className="tag text-xs" style={{ background: p.accent + '30', color: '#0F0F0F' }}>{p.difficulty}</span>
            </div>
          ))}
        </div>
      )}

      <div className="h-4" />

      {/* Streak Celebration Modal */}
      {showStreakCelebration && newBadges.length > 0 && (
        <StreakCelebration
          badges={newBadges}
          onClose={() => {
            setShowStreakCelebration(false);
            clearNewBadges();
          }}
        />
      )}

      {/* Completion Celebration Modal */}
      {showCelebration && (
        <>
          {console.log('🎊🎊🎊 RENDERING CELEBRATION MODAL NOW!!!')}
          <CompletionCelebration
            courseName={courseName}
            duration="21h 10m"
            lessonsCompleted={86}
            projectsCompleted={12}
            onViewCertificate={handleViewCertificate}
            onContinueLearning={handleContinueLearning}
            onClose={handleCloseCelebration}
          />
        </>
      )}

      {/* Reminder Modal */}
      <ReminderModal
        isOpen={showReminderModal}
        onClose={() => setShowReminderModal(false)}
        courseId={courseId}
        courseName={courseName}
      />

      {/* Video Modal */}
      {currentVideo && (
        <VideoModal
          isOpen={showVideoModal}
          onClose={() => setShowVideoModal(false)}
          videoId={currentVideo.id}
          videoUrl={currentVideo.url}
          courseId={courseId}
          videoTitle={currentVideo.title}
          lessonTitle={currentVideo.lesson}
          thumbnailUrl="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80"
          onComplete={handleVideoComplete}
          onProgressUpdate={handleVideoProgressUpdate}
        />
      )}
    </div>
  );
}
