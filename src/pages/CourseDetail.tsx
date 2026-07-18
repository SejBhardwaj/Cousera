import { useState, useEffect } from 'react';
import { Play, Star, Clock, Users, Award, ChevronDown, ChevronUp, Check, BookOpen, Globe, Briefcase, ArrowLeft, Bookmark, Download, Trash2, Bell } from 'lucide-react';
import CompletionCelebration from '../components/CompletionCelebration';
import CertificateViewerModal from '../components/CertificateViewerModal';
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
  courseId: string | null;
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export default function CourseDetail({ courseId: propCourseId, onBack, onNavigate }: CourseDetailProps) {
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]));
  const [bookmarked, setBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState('About');
  const [progress, setProgress] = useState(68); // Current progress
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationClosed, setCelebrationClosed] = useState(false); // Track if celebration was manually closed
  const [showCertificateViewer, setShowCertificateViewer] = useState(false);
  const [currentCertificateUrl, setCurrentCertificateUrl] = useState('');
  
  // Offline functionality
  const { isOnline, offlineCourses, refreshOfflineCourses } = useOffline();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState('');
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

  const courseId = propCourseId || 's1'; // Default to ML course if no ID

  // Course database - different content for each course
  const COURSE_DATABASE: any = {
    // ========== DATA SCIENCE COURSES ==========
    'ml-specialization': {
      title: 'Machine Learning Specialization',
      provider: 'Stanford University, DeepLearning.AI',
      instructor: 'Andrew Ng',
      instructorImg: 'https://i.pravatar.cc/150?img=12',
      description: 'Master the fundamentals of machine learning and build practical ML models using the latest techniques from Stanford University and DeepLearning.AI.',
      category: 'Data Science',
      categoryColor: '#A98BFF',
      rating: 4.9,
      reviews: 128400,
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
      duration: '11 weeks',
      difficulty: 'Intermediate',
      learners: '2.1M learners',
      language: 'English · 20 languages subtitled',
      curriculum: [
        { section: 'Week 1–2: Foundations', lessons: ['Introduction to ML', 'Supervised Learning Overview', 'Linear Regression', 'Gradient Descent', 'Quiz: Week 1'], duration: '4h 20m', open: true },
        { section: 'Week 3–4: Classification', lessons: ['Logistic Regression', 'Decision Trees', 'Random Forests', 'SVMs', 'Lab: Build a Classifier'], duration: '5h 45m', open: false },
        { section: 'Week 5–6: Neural Networks', lessons: ['Perceptrons', 'Backpropagation', 'Activation Functions', 'Deep Networks', 'Project: Neural Net'], duration: '6h 15m', open: false },
        { section: 'Week 7–8: Advanced Topics', lessons: ['Unsupervised Learning', 'Clustering', 'Dimensionality Reduction', 'Recommender Systems'], duration: '4h 50m', open: false },
      ],
      whatYouLearn: [
        'Build ML models with NumPy & scikit-learn',
        'Train neural networks with TensorFlow',
        'Apply best practices for ML development',
        'Implement decision trees, random forests, SVMs',
        'Use unsupervised learning algorithms',
        'Build recommender systems from scratch',
      ],
      careerOutcomes: [
        { role: 'ML Engineer', salary: '$148K', growth: '+23%' },
        { role: 'Data Scientist', salary: '$136K', growth: '+18%' },
        { role: 'AI Researcher', salary: '$162K', growth: '+31%' },
      ],
    },
    's2': {
      title: 'Applied Machine Learning in Python',
      provider: 'University of Michigan',
      instructor: 'Kevin Collins',
      instructorImg: 'https://i.pravatar.cc/150?img=33',
      description: 'Build practical ML models using scikit-learn and Python. Focus on real-world applications, model evaluation, and deployment strategies.',
      category: 'Data Science',
      categoryColor: '#A98BFF',
      rating: 4.7,
      reviews: 48200,
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=1200&q=80',
      duration: '8 weeks',
      difficulty: 'Intermediate',
      learners: '850K learners',
      language: 'English · 15 languages subtitled',
      curriculum: [
        { section: 'Week 1: Python for ML', lessons: ['NumPy Essentials', 'Pandas DataFrames', 'Data Preprocessing', 'Feature Engineering', 'Quiz: Python Basics'], duration: '3h 30m', open: true },
        { section: 'Week 2–3: Supervised Learning', lessons: ['Classification Models', 'Regression Models', 'Model Evaluation', 'Cross-Validation', 'Lab: Predict Housing Prices'], duration: '6h 00m', open: false },
        { section: 'Week 4–5: Advanced Models', lessons: ['Ensemble Methods', 'Gradient Boosting', 'XGBoost', 'Model Tuning', 'Project: Real-World Dataset'], duration: '5h 45m', open: false },
        { section: 'Week 6–8: Deployment', lessons: ['Model Serialization', 'Flask API', 'Docker Containers', 'Cloud Deployment', 'Final Project'], duration: '7h 15m', open: false },
      ],
      whatYouLearn: [
        'Master scikit-learn for ML modeling',
        'Perform feature engineering & selection',
        'Evaluate models with cross-validation',
        'Deploy ML models to production',
        'Build end-to-end ML pipelines',
        'Use advanced ensemble techniques',
      ],
      careerOutcomes: [
        { role: 'Python Developer', salary: '$118K', growth: '+15%' },
        { role: 'ML Engineer', salary: '$142K', growth: '+23%' },
        { role: 'Data Analyst', salary: '$95K', growth: '+12%' },
      ],
    },
    's7': {
      title: 'UI/UX Design Bootcamp',
      provider: 'Design Academy',
      instructor: 'Sarah Mitchell',
      instructorImg: 'https://i.pravatar.cc/150?img=45',
      description: 'Master user-centered design principles. Learn Figma, prototyping, user research, and create stunning portfolio-ready designs.',
      category: 'Design',
      categoryColor: '#FF6D70',
      rating: 4.8,
      reviews: 34000,
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80',
      duration: '10 weeks',
      difficulty: 'Beginner',
      learners: '620K learners',
      language: 'English · 18 languages subtitled',
      curriculum: [
        { section: 'Week 1–2: Design Fundamentals', lessons: ['Design Principles', 'Color Theory', 'Typography', 'Layout Basics', 'Quiz: Design Theory'], duration: '4h 00m', open: true },
        { section: 'Week 3–4: User Research', lessons: ['User Interviews', 'Personas', 'Journey Mapping', 'Competitive Analysis', 'Lab: Research Project'], duration: '5h 30m', open: false },
        { section: 'Week 5–7: Figma Mastery', lessons: ['Figma Basics', 'Components & Variants', 'Auto Layout', 'Prototyping', 'Design Systems', 'Project: Mobile App'], duration: '8h 15m', open: false },
        { section: 'Week 8–10: Portfolio', lessons: ['Case Studies', 'Presentation Skills', 'Portfolio Website', 'Job Prep', 'Final Portfolio Review'], duration: '6h 45m', open: false },
      ],
      whatYouLearn: [
        'Master Figma from beginner to advanced',
        'Conduct user research & usability testing',
        'Create wireframes and high-fidelity mockups',
        'Build interactive prototypes',
        'Develop a professional design portfolio',
        'Apply design thinking methodology',
      ],
      careerOutcomes: [
        { role: 'UI/UX Designer', salary: '$95K', growth: '+20%' },
        { role: 'Product Designer', salary: '$112K', growth: '+25%' },
        { role: 'UX Researcher', salary: '$105K', growth: '+18%' },
      ],
    },
    's8': {
      title: 'Digital Marketing Mastery',
      provider: 'Marketing Pro',
      instructor: 'Alex Turner',
      instructorImg: 'https://i.pravatar.cc/150?img=51',
      description: 'Become a digital marketing expert. Learn SEO, social media strategy, content marketing, and analytics to grow any business online.',
      category: 'Marketing',
      categoryColor: '#FFB259',
      rating: 4.6,
      reviews: 28000,
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
      duration: '8 weeks',
      difficulty: 'Beginner',
      learners: '1.2M learners',
      language: 'English · 22 languages subtitled',
      curriculum: [
        { section: 'Week 1–2: Marketing Foundations', lessons: ['Digital Marketing Overview', 'Customer Journey', 'Marketing Funnels', 'Brand Positioning', 'Quiz: Marketing Basics'], duration: '3h 45m', open: true },
        { section: 'Week 3–4: SEO & Content', lessons: ['SEO Fundamentals', 'Keyword Research', 'Content Strategy', 'Blogging for Business', 'Lab: SEO Optimization'], duration: '5h 20m', open: false },
        { section: 'Week 5–6: Social Media', lessons: ['Platform Strategies', 'Content Creation', 'Community Management', 'Paid Advertising', 'Project: Campaign Launch'], duration: '6h 00m', open: false },
        { section: 'Week 7–8: Analytics & Growth', lessons: ['Google Analytics', 'Conversion Optimization', 'Email Marketing', 'Marketing Automation', 'Final Project'], duration: '5h 15m', open: false },
      ],
      whatYouLearn: [
        'Master SEO and content marketing',
        'Create effective social media campaigns',
        'Use Google Analytics for insights',
        'Build email marketing funnels',
        'Optimize conversion rates',
        'Develop comprehensive marketing strategies',
      ],
      careerOutcomes: [
        { role: 'Digital Marketer', salary: '$68K', growth: '+18%' },
        { role: 'SEO Specialist', salary: '$72K', growth: '+22%' },
        { role: 'Marketing Manager', salary: '$95K', growth: '+15%' },
      ],
    },
    's9': {
      title: 'Full-Stack Web Development',
      provider: 'Web Dev Institute',
      instructor: 'Michael Chen',
      instructorImg: 'https://i.pravatar.cc/150?img=62',
      description: 'Build modern web applications from scratch. Master React, Node.js, databases, and deploy production-ready applications.',
      category: 'Technology',
      categoryColor: '#83D6FF',
      rating: 4.7,
      reviews: 42000,
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80',
      duration: '16 weeks',
      difficulty: 'Intermediate',
      learners: '980K learners',
      language: 'English · 16 languages subtitled',
      curriculum: [
        { section: 'Week 1–3: Frontend Basics', lessons: ['HTML5 & CSS3', 'JavaScript ES6+', 'Responsive Design', 'Git & GitHub', 'Quiz: Frontend Fundamentals'], duration: '8h 30m', open: true },
        { section: 'Week 4–7: React', lessons: ['React Components', 'Hooks & State', 'React Router', 'Context API', 'Project: E-commerce Site'], duration: '12h 00m', open: false },
        { section: 'Week 8–11: Backend', lessons: ['Node.js & Express', 'REST APIs', 'MongoDB', 'Authentication', 'Lab: Build API'], duration: '14h 30m', open: false },
        { section: 'Week 12–16: Full-Stack', lessons: ['Frontend + Backend Integration', 'Testing', 'Deployment', 'DevOps Basics', 'Capstone Project'], duration: '16h 45m', open: false },
      ],
      whatYouLearn: [
        'Build responsive frontends with React',
        'Create RESTful APIs with Node.js',
        'Work with MongoDB databases',
        'Implement user authentication',
        'Deploy apps to cloud platforms',
        'Follow full-stack best practices',
      ],
      careerOutcomes: [
        { role: 'Full-Stack Developer', salary: '$115K', growth: '+20%' },
        { role: 'Frontend Developer', salary: '$105K', growth: '+18%' },
        { role: 'Backend Developer', salary: '$118K', growth: '+17%' },
      ],
    },
    's10': {
      title: 'iOS App Development with Swift',
      provider: 'Apple Developer Academy',
      instructor: 'Emma Rodriguez',
      instructorImg: 'https://i.pravatar.cc/150?img=48',
      description: 'Create beautiful iOS apps for iPhone and iPad. Learn Swift, SwiftUI, and publish apps to the App Store.',
      category: 'Technology',
      categoryColor: '#FFB3C6',
      rating: 4.8,
      reviews: 31000,
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80',
      duration: '12 weeks',
      difficulty: 'Intermediate',
      learners: '450K learners',
      language: 'English · 12 languages subtitled',
      curriculum: [
        { section: 'Week 1–3: Swift Fundamentals', lessons: ['Swift Syntax', 'Optionals', 'Collections', 'Functions & Closures', 'Quiz: Swift Basics'], duration: '7h 30m', open: true },
        { section: 'Week 4–6: SwiftUI', lessons: ['Views & Modifiers', 'State Management', 'Navigation', 'Lists & Forms', 'Lab: Weather App'], duration: '9h 15m', open: false },
        { section: 'Week 7–9: Advanced iOS', lessons: ['Core Data', 'Networking', 'MapKit', 'Notifications', 'Project: Social App'], duration: '11h 00m', open: false },
        { section: 'Week 10–12: Publishing', lessons: ['App Testing', 'UI Polish', 'App Store Guidelines', 'Submission Process', 'Final App Project'], duration: '8h 45m', open: false },
      ],
      whatYouLearn: [
        'Master Swift programming language',
        'Build apps with SwiftUI',
        'Work with Core Data for persistence',
        'Integrate APIs and networking',
        'Design beautiful iOS interfaces',
        'Publish apps to the App Store',
      ],
      careerOutcomes: [
        { role: 'iOS Developer', salary: '$125K', growth: '+22%' },
        { role: 'Mobile Engineer', salary: '$132K', growth: '+24%' },
        { role: 'App Developer', salary: '$108K', growth: '+19%' },
      ],
    },
    's11': {
      title: 'Business Strategy Essentials',
      provider: 'Business School Online',
      instructor: 'David Williams',
      instructorImg: 'https://i.pravatar.cc/150?img=71',
      description: 'Learn strategic thinking and business planning. Analyze markets, develop competitive strategies, and drive business growth.',
      category: 'Business',
      categoryColor: '#A98BFF',
      rating: 4.5,
      reviews: 19000,
      thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&q=80',
      duration: '6 weeks',
      difficulty: 'Beginner',
      learners: '540K learners',
      language: 'English · 20 languages subtitled',
      curriculum: [
        { section: 'Week 1–2: Strategy Foundations', lessons: ['Business Strategy Overview', 'Competitive Advantage', 'SWOT Analysis', 'Porter\'s Five Forces', 'Quiz: Strategy Basics'], duration: '4h 15m', open: true },
        { section: 'Week 3–4: Market Analysis', lessons: ['Market Research', 'Customer Segmentation', 'Value Proposition', 'Business Models', 'Lab: Market Analysis'], duration: '5h 30m', open: false },
        { section: 'Week 5–6: Growth Strategy', lessons: ['Growth Planning', 'Innovation Strategy', 'Strategic Execution', 'Performance Metrics', 'Final Strategy Project'], duration: '5h 00m', open: false },
      ],
      whatYouLearn: [
        'Develop comprehensive business strategies',
        'Analyze competitive landscapes',
        'Create effective business plans',
        'Understand strategic frameworks',
        'Make data-driven decisions',
        'Lead strategic initiatives',
      ],
      careerOutcomes: [
        { role: 'Business Analyst', salary: '$82K', growth: '+14%' },
        { role: 'Strategy Consultant', salary: '$125K', growth: '+18%' },
        { role: 'Product Manager', salary: '$118K', growth: '+22%' },
      ],
    },
    's12': {
      title: 'AWS Solutions Architect',
      provider: 'Amazon Web Services',
      instructor: 'James Wilson',
      instructorImg: 'https://i.pravatar.cc/150?img=68',
      description: 'Design and deploy scalable cloud infrastructure on AWS. Master EC2, S3, Lambda, and earn your AWS certification.',
      category: 'Technology',
      categoryColor: '#83D6FF',
      rating: 4.7,
      reviews: 52000,
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80',
      duration: '12 weeks',
      difficulty: 'Advanced',
      learners: '780K learners',
      language: 'English · 14 languages subtitled',
      curriculum: [
        { section: 'Week 1–3: AWS Fundamentals', lessons: ['AWS Overview', 'IAM & Security', 'EC2 Instances', 'VPC Networking', 'Quiz: AWS Basics'], duration: '8h 00m', open: true },
        { section: 'Week 4–6: Storage & Databases', lessons: ['S3 Storage', 'RDS Databases', 'DynamoDB', 'ElastiCache', 'Lab: Data Architecture'], duration: '9h 30m', open: false },
        { section: 'Week 7–9: Advanced Services', lessons: ['Lambda Functions', 'API Gateway', 'CloudFormation', 'Auto Scaling', 'Project: Serverless App'], duration: '10h 45m', open: false },
        { section: 'Week 10–12: Architecture', lessons: ['High Availability', 'Disaster Recovery', 'Cost Optimization', 'Certification Prep', 'Final Exam'], duration: '11h 15m', open: false },
      ],
      whatYouLearn: [
        'Design scalable AWS architectures',
        'Master core AWS services',
        'Implement security best practices',
        'Build serverless applications',
        'Optimize costs and performance',
        'Pass AWS certification exam',
      ],
      careerOutcomes: [
        { role: 'Cloud Architect', salary: '$145K', growth: '+28%' },
        { role: 'DevOps Engineer', salary: '$128K', growth: '+24%' },
        { role: 'Solutions Architect', salary: '$155K', growth: '+26%' },
      ],
    },
    'fullstack-web-dev': {
      title: 'Full-Stack Web Development',
      provider: 'Web Dev Institute',
      instructor: 'Michael Chen',
      instructorImg: 'https://i.pravatar.cc/150?img=62',
      description: 'Build modern web applications from scratch. Master React, Node.js, databases, and deploy production-ready applications.',
      category: 'Technology',
      categoryColor: '#83D6FF',
      rating: 4.7,
      reviews: 42000,
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200&q=80',
      duration: '16 weeks',
      difficulty: 'Intermediate',
      learners: '980K learners',
      language: 'English · 16 languages subtitled',
      curriculum: [
        { section: 'Week 1–3: Frontend Basics', lessons: ['HTML5 & CSS3', 'JavaScript ES6+', 'Responsive Design', 'Git & GitHub', 'Quiz: Frontend Fundamentals'], duration: '8h 30m', open: true },
        { section: 'Week 4–7: React', lessons: ['React Components', 'Hooks & State', 'React Router', 'Context API', 'Project: E-commerce Site'], duration: '12h 00m', open: false },
        { section: 'Week 8–11: Backend', lessons: ['Node.js & Express', 'REST APIs', 'MongoDB', 'Authentication', 'Lab: Build API'], duration: '14h 30m', open: false },
        { section: 'Week 12–16: Full-Stack', lessons: ['Frontend + Backend Integration', 'Testing', 'Deployment', 'DevOps Basics', 'Capstone Project'], duration: '16h 45m', open: false },
      ],
      whatYouLearn: [
        'Build responsive frontends with React',
        'Create RESTful APIs with Node.js',
        'Work with MongoDB databases',
        'Implement user authentication',
        'Deploy apps to cloud platforms',
        'Follow full-stack best practices',
      ],
      careerOutcomes: [
        { role: 'Full-Stack Developer', salary: '$115K', growth: '+20%' },
        { role: 'Frontend Developer', salary: '$105K', growth: '+18%' },
        { role: 'Backend Developer', salary: '$118K', growth: '+17%' },
      ],
    },
    'digital-marketing': {
      title: 'Digital Marketing Mastery',
      provider: 'Marketing Pro',
      instructor: 'Alex Turner',
      instructorImg: 'https://i.pravatar.cc/150?img=51',
      description: 'Become a digital marketing expert. Learn SEO, social media strategy, content marketing, and analytics to grow any business online.',
      category: 'Marketing',
      categoryColor: '#FFB259',
      rating: 4.6,
      reviews: 28000,
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
      duration: '8 weeks',
      difficulty: 'Beginner',
      learners: '1.2M learners',
      language: 'English · 22 languages subtitled',
      curriculum: [
        { section: 'Week 1–2: Marketing Foundations', lessons: ['Digital Marketing Overview', 'Customer Journey', 'Marketing Funnels', 'Brand Positioning', 'Quiz: Marketing Basics'], duration: '3h 45m', open: true },
        { section: 'Week 3–4: SEO & Content', lessons: ['SEO Fundamentals', 'Keyword Research', 'Content Strategy', 'Blogging for Business', 'Lab: SEO Optimization'], duration: '5h 20m', open: false },
        { section: 'Week 5–6: Social Media', lessons: ['Platform Strategies', 'Content Creation', 'Community Management', 'Paid Advertising', 'Project: Campaign Launch'], duration: '6h 00m', open: false },
        { section: 'Week 7–8: Analytics & Growth', lessons: ['Google Analytics', 'Conversion Optimization', 'Email Marketing', 'Marketing Automation', 'Final Project'], duration: '5h 15m', open: false },
      ],
      whatYouLearn: [
        'Master SEO and content marketing',
        'Create effective social media campaigns',
        'Use Google Analytics for insights',
        'Build email marketing funnels',
        'Optimize conversion rates',
        'Develop comprehensive marketing strategies',
      ],
      careerOutcomes: [
        { role: 'Digital Marketer', salary: '$68K', growth: '+18%' },
        { role: 'SEO Specialist', salary: '$72K', growth: '+22%' },
        { role: 'Marketing Manager', salary: '$95K', growth: '+15%' },
      ],
    },
    'ui-ux-bootcamp': {
      title: 'UI/UX Design Bootcamp',
      provider: 'Design Academy',
      instructor: 'Sarah Mitchell',
      instructorImg: 'https://i.pravatar.cc/150?img=45',
      description: 'Master user-centered design principles. Learn Figma, prototyping, user research, and create stunning portfolio-ready designs.',
      category: 'Design',
      categoryColor: '#FF6D70',
      rating: 4.8,
      reviews: 34000,
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80',
      duration: '10 weeks',
      difficulty: 'Beginner',
      learners: '620K learners',
      language: 'English · 18 languages subtitled',
      curriculum: [
        { section: 'Week 1–2: Design Fundamentals', lessons: ['Design Principles', 'Color Theory', 'Typography', 'Layout Basics', 'Quiz: Design Theory'], duration: '4h 00m', open: true },
        { section: 'Week 3–4: User Research', lessons: ['User Interviews', 'Personas', 'Journey Mapping', 'Competitive Analysis', 'Lab: Research Project'], duration: '5h 30m', open: false },
        { section: 'Week 5–7: Figma Mastery', lessons: ['Figma Basics', 'Components & Variants', 'Auto Layout', 'Prototyping', 'Design Systems', 'Project: Mobile App'], duration: '8h 15m', open: false },
        { section: 'Week 8–10: Portfolio', lessons: ['Case Studies', 'Presentation Skills', 'Portfolio Website', 'Job Prep', 'Final Portfolio Review'], duration: '6h 45m', open: false },
      ],
      whatYouLearn: [
        'Master Figma from beginner to advanced',
        'Conduct user research & usability testing',
        'Create wireframes and high-fidelity mockups',
        'Build interactive prototypes',
        'Develop a professional design portfolio',
        'Apply design thinking methodology',
      ],
      careerOutcomes: [
        { role: 'UI/UX Designer', salary: '$95K', growth: '+20%' },
        { role: 'Product Designer', salary: '$112K', growth: '+25%' },
        { role: 'UX Researcher', salary: '$105K', growth: '+18%' },
      ],
    },
    // ========== ADDITIONAL DATA SCIENCE COURSES ==========
    's1': {
      title: 'Machine Learning Specialization',
      provider: 'Stanford University, DeepLearning.AI',
      instructor: 'Andrew Ng',
      instructorImg: 'https://i.pravatar.cc/150?img=12',
      description: 'Master the fundamentals of machine learning and build practical ML models using the latest techniques from Stanford University and DeepLearning.AI.',
      category: 'Data Science',
      categoryColor: '#A98BFF',
      rating: 4.9,
      reviews: 128400,
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80',
      duration: '11 weeks',
      difficulty: 'Intermediate',
      learners: '2.1M learners',
      language: 'English · 20 languages subtitled',
      curriculum: [
        { section: 'Week 1–2: Foundations', lessons: ['Introduction to ML', 'Supervised Learning Overview', 'Linear Regression', 'Gradient Descent', 'Quiz: Week 1'], duration: '4h 20m', open: true },
        { section: 'Week 3–4: Classification', lessons: ['Logistic Regression', 'Decision Trees', 'Random Forests', 'SVMs', 'Lab: Build a Classifier'], duration: '5h 45m', open: false },
        { section: 'Week 5–6: Neural Networks', lessons: ['Perceptrons', 'Backpropagation', 'Activation Functions', 'Deep Networks', 'Project: Neural Net'], duration: '6h 15m', open: false },
        { section: 'Week 7–8: Advanced Topics', lessons: ['Unsupervised Learning', 'Clustering', 'Dimensionality Reduction', 'Recommender Systems'], duration: '4h 50m', open: false },
      ],
      whatYouLearn: [
        'Build ML models with NumPy & scikit-learn',
        'Train neural networks with TensorFlow',
        'Apply best practices for ML development',
        'Implement decision trees, random forests, SVMs',
        'Use unsupervised learning algorithms',
        'Build recommender systems from scratch',
      ],
      careerOutcomes: [
        { role: 'ML Engineer', salary: '$148K', growth: '+23%' },
        { role: 'Data Scientist', salary: '$136K', growth: '+18%' },
        { role: 'AI Researcher', salary: '$162K', growth: '+31%' },
      ],
    },
    's3': {
      title: 'Machine Learning with TensorFlow on Google Cloud',
      provider: 'Google Cloud',
      instructor: 'Google Instructors',
      instructorImg: 'https://i.pravatar.cc/150?img=23',
      description: 'Deploy scalable ML models on Google Cloud Platform. Learn TensorFlow, Vertex AI, and production ML engineering best practices.',
      category: 'Data Science',
      categoryColor: '#A98BFF',
      rating: 4.6,
      reviews: 38000,
      thumbnail: 'https://images.unsplash.com/photo-1667372335962-5fd503a8ae5b?w=1200&q=80',
      duration: '10 weeks',
      difficulty: 'Advanced',
      learners: '520K learners',
      language: 'English · 16 languages subtitled',
      curriculum: [
        { section: 'Week 1–2: TensorFlow Basics', lessons: ['TensorFlow Core', 'Tensors & Operations', 'Training Pipelines', 'Model Optimization', 'Quiz: TensorFlow'], duration: '5h 00m', open: true },
        { section: 'Week 3–5: Google Cloud ML', lessons: ['Vertex AI Platform', 'BigQuery ML', 'AutoML', 'Model Deployment', 'Lab: Deploy Model'], duration: '7h 30m', open: false },
        { section: 'Week 6–8: Production ML', lessons: ['ML Pipelines', 'Model Monitoring', 'A/B Testing', 'Feature Store', 'Project: End-to-End ML'], duration: '9h 15m', open: false },
        { section: 'Week 9–10: Advanced Topics', lessons: ['Distributed Training', 'TPUs', 'ML Ops', 'Cost Optimization', 'Final Project'], duration: '6h 45m', open: false },
      ],
      whatYouLearn: [
        'Build production ML models with TensorFlow',
        'Deploy models on Google Cloud Platform',
        'Use Vertex AI for ML operations',
        'Implement distributed training at scale',
        'Monitor and maintain ML systems',
        'Optimize cloud ML costs',
      ],
      careerOutcomes: [
        { role: 'ML Engineer', salary: '$155K', growth: '+26%' },
        { role: 'Cloud ML Specialist', salary: '$162K', growth: '+29%' },
        { role: 'ML Ops Engineer', salary: '$148K', growth: '+24%' },
      ],
    },
    's4': {
      title: 'Intro to Machine Learning',
      provider: 'DataCamp',
      instructor: 'Rachel Thompson',
      instructorImg: 'https://i.pravatar.cc/150?img=44',
      description: 'Perfect for beginners! Learn ML fundamentals, algorithms, and data preprocessing. Build your first predictive models with hands-on projects.',
      category: 'Data Science',
      categoryColor: '#A98BFF',
      rating: 4.7,
      reviews: 72000,
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80',
      duration: '6 weeks',
      difficulty: 'Beginner',
      learners: '980K learners',
      language: 'English · 22 languages subtitled',
      curriculum: [
        { section: 'Week 1: ML Basics', lessons: ['What is ML?', 'Types of Learning', 'Data Preprocessing', 'Python for ML', 'Quiz: Fundamentals'], duration: '3h 30m', open: true },
        { section: 'Week 2–3: Supervised Learning', lessons: ['Linear Regression', 'Logistic Regression', 'KNN Algorithm', 'Model Evaluation', 'Lab: First Model'], duration: '6h 00m', open: false },
        { section: 'Week 4–5: Trees & Ensembles', lessons: ['Decision Trees', 'Random Forests', 'Gradient Boosting', 'Feature Importance', 'Project: Prediction Task'], duration: '5h 45m', open: false },
        { section: 'Week 6: Next Steps', lessons: ['Unsupervised Learning Intro', 'Neural Networks Preview', 'Career Paths', 'Final Quiz', 'Capstone Project'], duration: '4h 15m', open: false },
      ],
      whatYouLearn: [
        'Understand machine learning fundamentals',
        'Build classification and regression models',
        'Preprocess and clean data effectively',
        'Evaluate model performance',
        'Use scikit-learn for ML tasks',
        'Create your first ML project portfolio',
      ],
      careerOutcomes: [
        { role: 'Junior Data Analyst', salary: '$72K', growth: '+16%' },
        { role: 'Data Scientist', salary: '$115K', growth: '+21%' },
        { role: 'ML Engineer', salary: '$128K', growth: '+23%' },
      ],
    },
    's5': {
      title: 'ML Engineering for Production (MLOps)',
      provider: 'DeepLearning.AI',
      instructor: 'Andrew Ng, Robert Crowe',
      instructorImg: 'https://i.pravatar.cc/150?img=15',
      description: 'Take ML models to production at scale. Master MLOps, CI/CD for ML, model monitoring, and deployment infrastructure.',
      category: 'Data Science',
      categoryColor: '#A98BFF',
      rating: 4.8,
      reviews: 45000,
      thumbnail: 'https://images.unsplash.com/photo-1518432031352-d6fc5c10da5a?w=1200&q=80',
      duration: '14 weeks',
      difficulty: 'Advanced',
      learners: '380K learners',
      language: 'English · 14 languages subtitled',
      curriculum: [
        { section: 'Week 1–3: Production ML Systems', lessons: ['ML Project Lifecycle', 'Data Pipelines', 'Model Serving', 'Monitoring', 'Quiz: MLOps Basics'], duration: '7h 20m', open: true },
        { section: 'Week 4–7: Model Deployment', lessons: ['Containerization', 'Kubernetes for ML', 'API Development', 'Load Balancing', 'Lab: Deploy Model API'], duration: '10h 30m', open: false },
        { section: 'Week 8–11: ML Pipelines', lessons: ['TFX Pipelines', 'Airflow for ML', 'Feature Stores', 'Model Versioning', 'Project: Full Pipeline'], duration: '12h 00m', open: false },
        { section: 'Week 12–14: Advanced MLOps', lessons: ['A/B Testing', 'Model Drift Detection', 'Automated Retraining', 'Cost Optimization', 'Final Capstone'], duration: '9h 45m', open: false },
      ],
      whatYouLearn: [
        'Deploy ML models to production',
        'Build automated ML pipelines',
        'Monitor models in production',
        'Implement CI/CD for ML',
        'Handle model drift and retraining',
        'Scale ML systems efficiently',
      ],
      careerOutcomes: [
        { role: 'MLOps Engineer', salary: '$152K', growth: '+28%' },
        { role: 'ML Platform Engineer', salary: '$165K', growth: '+32%' },
        { role: 'Senior ML Engineer', salary: '$172K', growth: '+25%' },
      ],
    },
    's6': {
      title: 'Practical Deep Learning',
      provider: 'fast.ai',
      instructor: 'Jeremy Howard',
      instructorImg: 'https://i.pravatar.cc/150?img=67',
      description: 'Build real-world deep learning applications. Learn CNNs, RNNs, and transformers through hands-on projects and practical implementations.',
      category: 'Data Science',
      categoryColor: '#A98BFF',
      rating: 4.9,
      reviews: 95000,
      thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80',
      duration: '12 weeks',
      difficulty: 'Intermediate',
      learners: '750K learners',
      language: 'English · 18 languages subtitled',
      curriculum: [
        { section: 'Week 1–3: Deep Learning Foundations', lessons: ['Neural Networks Deep Dive', 'Backpropagation', 'Optimization Techniques', 'PyTorch Basics', 'Quiz: DL Fundamentals'], duration: '8h 00m', open: true },
        { section: 'Week 4–6: Computer Vision', lessons: ['CNNs', 'Image Classification', 'Object Detection', 'Transfer Learning', 'Lab: Build Image Classifier'], duration: '10h 30m', open: false },
        { section: 'Week 7–9: NLP & Sequences', lessons: ['RNNs & LSTMs', 'Attention Mechanisms', 'Transformers', 'BERT & GPT', 'Project: Text Generation'], duration: '12h 15m', open: false },
        { section: 'Week 10–12: Advanced Topics', lessons: ['GANs', 'Reinforcement Learning', 'Model Deployment', 'Ethics in AI', 'Final Project'], duration: '10h 45m', open: false },
      ],
      whatYouLearn: [
        'Master deep learning with PyTorch',
        'Build CNNs for computer vision',
        'Create NLP models with transformers',
        'Implement state-of-the-art architectures',
        'Deploy deep learning models',
        'Apply transfer learning techniques',
      ],
      careerOutcomes: [
        { role: 'Deep Learning Engineer', salary: '$158K', growth: '+29%' },
        { role: 'Computer Vision Engineer', salary: '$162K', growth: '+27%' },
        { role: 'NLP Engineer', salary: '$155K', growth: '+31%' },
      ],
    },
    // ========== GENERATIVE AI & MODERN ML (s13+) ==========
    's13': { title: 'Generative AI with Large Language Models', provider: 'DeepLearning.AI', instructor: 'Andrew Ng', instructorImg: 'https://i.pravatar.cc/150?img=19', description: 'Master LLMs and Gen AI', category: 'Data Science', categoryColor: '#A98BFF', rating: 4.9, reviews: 28000, thumbnail: 'https://images.unsplash.com/photo-1676277791608-ac52caa57133?w=1200&q=80', duration: '10 weeks', difficulty: 'Advanced', learners: '420K learners', language: 'English · 12 languages subtitled', curriculum: [{ section: 'Week 1–2: LLMs', lessons: ['Transformers', 'GPT', 'Attention', 'Tokenization', 'Quiz'], duration: '6h 30m', open: true }, { section: 'Week 3–5: Fine-Tuning', lessons: ['PEFT', 'LoRA', 'RLHF', 'Instruction Tuning', 'Lab'], duration: '9h', open: false }, { section: 'Week 6–8: RAG & Embeddings', lessons: ['Vector Databases', 'Semantic Search', 'RAG Architecture', 'LangChain Integration', 'Project: RAG System'], duration: '8h 30m', open: false }, { section: 'Week 9–10: Production & Ethics', lessons: ['Model Deployment', 'API Design', 'Safety & Bias', 'Scaling Strategies', 'Final Capstone'], duration: '7h 15m', open: false }], whatYouLearn: ['Fine-tune LLMs', 'Build RAG apps', 'Prompt engineering', 'Deploy Gen AI'], careerOutcomes: [{ role: 'LLM Engineer', salary: '$175K', growth: '+45%' }] },
    's14': { title: 'Product Design & User Research', provider: 'IDEO U', instructor: 'Jessica Park', instructorImg: 'https://i.pravatar.cc/150?img=48', description: 'Design thinking and user research', category: 'Design', categoryColor: '#FF6D70', rating: 4.7, reviews: 31000, thumbnail: 'https://images.unsplash.com/photo-1561070791-36c11767b26a?w=1200&q=80', duration: '9 weeks', difficulty: 'Intermediate', learners: '485K learners', language: 'English · 16 languages subtitled', curriculum: [{ section: 'Week 1–2: Design Thinking', lessons: ['Empathize', 'Define', 'Ideate', 'Sprint', 'Quiz'], duration: '5h', open: true }, { section: 'Week 3–4: User Research Methods', lessons: ['User Interviews', 'Surveys & Analytics', 'Persona Development', 'Journey Mapping', 'Lab: Research Project'], duration: '6h 15m', open: false }, { section: 'Week 5–7: Prototyping & Testing', lessons: ['Wireframing', 'Low-Fidelity Prototypes', 'Usability Testing', 'Iteration Cycles', 'Project: Interactive Prototype'], duration: '7h 30m', open: false }, { section: 'Week 8–9: Advanced UX', lessons: ['Information Architecture', 'Accessibility Design', 'Design Systems', 'Portfolio Case Studies', 'Final Presentation'], duration: '5h 45m', open: false }], whatYouLearn: ['Design thinking', 'User research', 'Prototyping'], careerOutcomes: [{ role: 'Product Designer', salary: '$118K', growth: '+24%' }] },
    's15': { title: 'Motion Graphics & Animation', provider: 'School of Motion', instructor: 'Joey Korenman', instructorImg: 'https://i.pravatar.cc/150?img=52', description: 'After Effects and motion design', category: 'Design', categoryColor: '#FF6D70', rating: 4.8, reviews: 22000, thumbnail: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=1200&q=80', duration: '12 weeks', difficulty: 'Intermediate', learners: '310K learners', language: 'English', curriculum: [{ section: 'Week 1–3: After Effects', lessons: ['Interface', 'Keyframing', 'Animation', 'Text', 'Quiz'], duration: '6h 30m', open: true }, { section: 'Week 4–6: Advanced Animation', lessons: ['Easing & Timing', 'Shape Layers', 'Masks & Mattes', 'Expression Basics', 'Lab: Logo Animation'], duration: '7h 45m', open: false }, { section: 'Week 7–9: 3D & Effects', lessons: ['3D Layers', 'Camera Animation', 'Particles', 'Color Grading', 'Project: Title Sequence'], duration: '8h 15m', open: false }, { section: 'Week 10–12: Professional Work', lessons: ['Character Animation', 'Motion Graphics Templates', 'Client Work Workflow', 'Portfolio Reel', 'Final Project'], duration: '7h', open: false }], whatYouLearn: ['After Effects', 'Animation principles', 'Motion graphics'], careerOutcomes: [{ role: 'Motion Designer', salary: '$78K', growth: '+22%' }] },
    's16': { title: '3D Design & Modeling with Blender', provider: 'CG Cookie', instructor: 'Jonathan Lampel', instructorImg: 'https://i.pravatar.cc/150?img=61', description: '3D modeling and rendering', category: 'Design', categoryColor: '#FF6D70', rating: 4.6, reviews: 18000, thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80', duration: '14 weeks', difficulty: 'Beginner', learners: '425K learners', language: 'English', curriculum: [{ section: 'Week 1–3: Blender Basics', lessons: ['Navigation', 'Modeling', 'Modifiers', 'Shapes', 'Quiz'], duration: '7h', open: true }, { section: 'Week 4–7: Texturing & Materials', lessons: ['UV Unwrapping', 'Shader Editor', 'PBR Materials', 'Procedural Textures', 'Lab: Product Model'], duration: '8h 30m', open: false }, { section: 'Week 8–11: Lighting & Rendering', lessons: ['Lighting Techniques', 'Render Engines', 'Camera Setup', 'Post-Processing', 'Project: Scene Rendering'], duration: '9h 15m', open: false }, { section: 'Week 12–14: Animation & Rigging', lessons: ['Keyframe Animation', 'Rigging Basics', 'Character Setup', 'Physics Simulation', 'Final Animation'], duration: '8h 45m', open: false }], whatYouLearn: ['Blender mastery', '3D modeling', 'Texturing'], careerOutcomes: [{ role: '3D Artist', salary: '$72K', growth: '+24%' }] },
    's17': { title: 'Brand Identity & Logo Design', provider: 'The Futur', instructor: 'Chris Do', instructorImg: 'https://i.pravatar.cc/150?img=70', description: 'Branding and logo design', category: 'Design', categoryColor: '#FF6D70', rating: 4.9, reviews: 35000, thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&q=80', duration: '8 weeks', difficulty: 'Beginner', learners: '580K learners', language: 'English', curriculum: [{ section: 'Week 1–2: Brand Strategy', lessons: ['Positioning', 'Audience', 'Personality', 'Analysis', 'Quiz'], duration: '4h 30m', open: true }, { section: 'Week 3–4: Logo Design', lessons: ['Logo Types', 'Sketching Ideas', 'Digital Refinement', 'Color Psychology', 'Lab: Logo Concepts'], duration: '5h 45m', open: false }, { section: 'Week 5–6: Brand Systems', lessons: ['Typography Systems', 'Color Palettes', 'Visual Guidelines', 'Brand Applications', 'Project: Style Guide'], duration: '6h', open: false }, { section: 'Week 7–8: Client Presentation', lessons: ['Case Study Creation', 'Presentation Design', 'Client Feedback', 'Iteration Process', 'Final Brand Package'], duration: '5h 15m', open: false }], whatYouLearn: ['Logo design', 'Brand systems', 'Typography'], careerOutcomes: [{ role: 'Brand Designer', salary: '$75K', growth: '+17%' }] },
    's18': { title: 'Design Systems & Component Libraries', provider: 'InVision', instructor: 'Brad Frost', instructorImg: 'https://i.pravatar.cc/150?img=55', description: 'Scalable design systems', category: 'Design', categoryColor: '#FF6D70', rating: 4.7, reviews: 19000, thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=1200&q=80', duration: '7 weeks', difficulty: 'Advanced', learners: '240K learners', language: 'English', curriculum: [{ section: 'Week 1–2: Design Systems', lessons: ['Atomic Design', 'Tokens', 'Components', 'Docs', 'Quiz'], duration: '5h', open: true }, { section: 'Week 3–4: Component Library', lessons: ['Component Architecture', 'Variants & States', 'Props & Controls', 'Accessibility Patterns', 'Lab: Button System'], duration: '6h 30m', open: false }, { section: 'Week 5–6: Documentation & Governance', lessons: ['Documentation Tools', 'Usage Guidelines', 'Contribution Model', 'Version Control', 'Project: Component Docs'], duration: '5h 45m', open: false }, { section: 'Week 7: Implementation', lessons: ['Handoff to Developers', 'Design Tokens in Code', 'Testing Components', 'Maintenance Strategy', 'Final System Review'], duration: '4h 30m', open: false }], whatYouLearn: ['Design systems', 'Component libraries', 'Accessibility'], careerOutcomes: [{ role: 'Design Systems Designer', salary: '$128K', growth: '+26%' }] },
    's19': { title: 'Growth Marketing & Growth Hacking', provider: 'Growth Tribe', instructor: 'Sean Ellis', instructorImg: 'https://i.pravatar.cc/150?img=24', description: 'Growth strategies and tactics', category: 'Marketing', categoryColor: '#FFB259', rating: 4.8, reviews: 41000, thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80', duration: '10 weeks', difficulty: 'Intermediate', learners: '720K learners', language: 'English', curriculum: [{ section: 'Week 1–2: Growth Fundamentals', lessons: ['Growth Mindset', 'AARRR', 'North Star', 'Loops', 'Quiz'], duration: '5h', open: true }, { section: 'Week 3–5: Acquisition Tactics', lessons: ['Channel Testing', 'Viral Mechanics', 'Paid Acquisition', 'Content Distribution', 'Lab: Growth Experiment'], duration: '7h 30m', open: false }, { section: 'Week 6–8: Retention & Activation', lessons: ['Onboarding Optimization', 'Email Sequences', 'Engagement Loops', 'Referral Programs', 'Project: Retention Strategy'], duration: '6h 45m', open: false }, { section: 'Week 9–10: Analytics & Scaling', lessons: ['Growth Metrics', 'Cohort Analysis', 'Experiment Design', 'Scaling Channels', 'Final Growth Plan'], duration: '5h 30m', open: false }], whatYouLearn: ['Growth experiments', 'Viral loops', 'A/B testing'], careerOutcomes: [{ role: 'Growth Marketer', salary: '$95K', growth: '+32%' }] },
    's20': { title: 'Social Media Marketing & Content Creation', provider: 'Hootsuite', instructor: 'Gary Vaynerchuk', instructorImg: 'https://i.pravatar.cc/150?img=31', description: 'Social media mastery', category: 'Marketing', categoryColor: '#FFB259', rating: 4.6, reviews: 38000, thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1200&q=80', duration: '8 weeks', difficulty: 'Beginner', learners: '890K learners', language: 'English', curriculum: [{ section: 'Week 1–2: Platform Strategy', lessons: ['Platform Selection', 'Algorithms', 'Planning', 'Schedule', 'Quiz'], duration: '4h 30m', open: true }, { section: 'Week 3–4: Content Creation', lessons: ['Content Types', 'Visual Design', 'Video Production', 'Copywriting', 'Lab: Content Series'], duration: '5h 45m', open: false }, { section: 'Week 5–6: Community Growth', lessons: ['Engagement Tactics', 'Influencer Outreach', 'Paid Amplification', 'Community Management', 'Project: Campaign Launch'], duration: '6h', open: false }, { section: 'Week 7–8: Analytics & Optimization', lessons: ['Social Analytics', 'Performance Reporting', 'Crisis Management', 'Strategy Refinement', 'Final Portfolio'], duration: '4h 45m', open: false }], whatYouLearn: ['Content creation', 'Social strategy', 'Community growth'], careerOutcomes: [{ role: 'Social Media Manager', salary: '$58K', growth: '+20%' }] },
    's21': { title: 'E-Commerce & Shopify Mastery', provider: 'Shopify Academy', instructor: 'Ezra Firestone', instructorImg: 'https://i.pravatar.cc/150?img=39', description: 'Launch e-commerce stores', category: 'Marketing', categoryColor: '#FFB259', rating: 4.7, reviews: 52000, thumbnail: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&q=80', duration: '9 weeks', difficulty: 'Beginner', learners: '1.1M learners', language: 'English', curriculum: [{ section: 'Week 1–2: Store Setup', lessons: ['Shopify Basics', 'Products', 'Design', 'Payments', 'Quiz'], duration: '5h', open: true }, { section: 'Week 3–4: Product Sourcing', lessons: ['Dropshipping', 'Suppliers', 'Inventory Management', 'Product Photography', 'Lab: Product Catalog'], duration: '6h 15m', open: false }, { section: 'Week 5–7: Marketing & Sales', lessons: ['SEO for E-commerce', 'Email Marketing', 'Facebook Ads', 'Cart Optimization', 'Project: Marketing Campaign'], duration: '7h 30m', open: false }, { section: 'Week 8–9: Scaling & Optimization', lessons: ['Customer Service', 'Fulfillment', 'Analytics', 'Growth Strategies', 'Final Store Launch'], duration: '5h 45m', open: false }], whatYouLearn: ['Shopify stores', 'Product sourcing', 'Conversion optimization'], careerOutcomes: [{ role: 'E-commerce Manager', salary: '$72K', growth: '+24%' }] },
    's22': { title: 'Product Management & Strategy', provider: 'Product School', instructor: 'Marty Cagan', instructorImg: 'https://i.pravatar.cc/150?img=43', description: 'Become a product manager', category: 'Business', categoryColor: '#A98BFF', rating: 4.8, reviews: 28000, thumbnail: 'https://images.unsplash.com/photo-1542626991-cbc4e32524cc?w=1200&q=80', duration: '11 weeks', difficulty: 'Intermediate', learners: '520K learners', language: 'English', curriculum: [{ section: 'Week 1–3: PM Fundamentals', lessons: ['PM Role', 'Vision', 'Discovery', 'Prioritization', 'Quiz'], duration: '6h 30m', open: true }, { section: 'Week 4–6: Product Development', lessons: ['User Stories', 'Wireframes', 'Agile Methodology', 'Sprint Planning', 'Lab: Feature Roadmap'], duration: '7h 45m', open: false }, { section: 'Week 7–9: Metrics & Analytics', lessons: ['Product Metrics', 'A/B Testing', 'User Research', 'Data Analysis', 'Project: Analytics Dashboard'], duration: '8h', open: false }, { section: 'Week 10–11: Strategy & Launch', lessons: ['Go-to-Market', 'Stakeholder Management', 'Product Launch', 'Iteration', 'Final Product Strategy'], duration: '6h 15m', open: false }], whatYouLearn: ['Product strategy', 'Roadmapping', 'Agile'], careerOutcomes: [{ role: 'Product Manager', salary: '$125K', growth: '+28%' }] },
    's23': { title: 'Data-Driven Marketing Analytics', provider: 'Google & CXL', instructor: 'Avinash Kaushik', instructorImg: 'https://i.pravatar.cc/150?img=58', description: 'Marketing analytics mastery', category: 'Marketing', categoryColor: '#FFB259', rating: 4.6, reviews: 33000, thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80', duration: '10 weeks', difficulty: 'Intermediate', learners: '610K learners', language: 'English', curriculum: [{ section: 'Week 1–2: Analytics', lessons: ['GA4', 'Tracking', 'Reports', 'Dashboards', 'Quiz'], duration: '5h 30m', open: true }, { section: 'Week 3–5: Attribution Models', lessons: ['Multi-Touch Attribution', 'Marketing Mix', 'Customer Journey', 'Attribution Tools', 'Lab: Attribution Setup'], duration: '7h', open: false }, { section: 'Week 6–8: Advanced Analytics', lessons: ['Predictive Analytics', 'Segmentation', 'LTV Calculation', 'Cohort Analysis', 'Project: Analytics Strategy'], duration: '8h 15m', open: false }, { section: 'Week 9–10: ROI & Optimization', lessons: ['ROI Measurement', 'Budget Allocation', 'Performance Optimization', 'Reporting Best Practices', 'Final Analytics Plan'], duration: '6h 45m', open: false }], whatYouLearn: ['Google Analytics', 'Attribution', 'ROI analysis'], careerOutcomes: [{ role: 'Marketing Analyst', salary: '$75K', growth: '+22%' }] },
    // ========== TECHNOLOGY (WEB & MOBILE) s24-s32 ==========
    's24': { title: 'React & Next.js - The Complete Guide', provider: 'Maximilian Schwarzmüller', instructor: 'Maximilian', instructorImg: 'https://i.pravatar.cc/150?img=14', description: 'Modern React and Next.js 14', category: 'Technology', categoryColor: '#83D6FF', rating: 4.8, reviews: 78000, thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&q=80', duration: '16 weeks', difficulty: 'Intermediate', learners: '1.2M learners', language: 'English', curriculum: [{ section: 'Week 1–4: React', lessons: ['Components', 'Hooks', 'State', 'Router', 'Quiz'], duration: '12h', open: true }, { section: 'Week 5–8: Advanced React', lessons: ['Context API', 'Custom Hooks', 'Performance Optimization', 'Testing with Jest', 'Lab: React App'], duration: '14h 30m', open: false }, { section: 'Week 9–13: Next.js', lessons: ['App Router', 'Server Components', 'API Routes', 'Authentication', 'Project: Full-Stack App'], duration: '16h 45m', open: false }, { section: 'Week 14–16: Production', lessons: ['Deployment', 'SEO Optimization', 'Analytics Integration', 'Performance Tuning', 'Final Capstone'], duration: '12h 15m', open: false }], whatYouLearn: ['React mastery', 'Next.js 14', 'Server components'], careerOutcomes: [{ role: 'React Developer', salary: '$115K', growth: '+24%' }] },
    's25': { title: 'Web3 & Blockchain Development', provider: 'Alchemy University', instructor: 'Vitalik Buterin', instructorImg: 'https://i.pravatar.cc/150?img=27', description: 'Build dApps and smart contracts', category: 'Technology', categoryColor: '#83D6FF', rating: 4.7, reviews: 42000, thumbnail: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1200&q=80', duration: '14 weeks', difficulty: 'Advanced', learners: '380K learners', language: 'English', curriculum: [{ section: 'Week 1–3: Blockchain', lessons: ['Blockchain Basics', 'Ethereum', 'Solidity', 'Smart Contracts', 'Quiz'], duration: '8h', open: true }, { section: 'Week 4–7: Smart Contract Development', lessons: ['Contract Patterns', 'Security Best Practices', 'Testing & Debugging', 'Gas Optimization', 'Lab: Token Contract'], duration: '10h 30m', open: false }, { section: 'Week 8–11: dApp Development', lessons: ['Web3.js', 'Ethers.js', 'IPFS', 'Frontend Integration', 'Project: NFT Marketplace'], duration: '12h 15m', open: false }, { section: 'Week 12–14: Advanced Topics', lessons: ['DeFi Protocols', 'Layer 2 Solutions', 'DAO Development', 'Production Deployment', 'Final dApp'], duration: '9h 45m', open: false }], whatYouLearn: ['Solidity', 'Smart contracts', 'dApp development'], careerOutcomes: [{ role: 'Blockchain Developer', salary: '$145K', growth: '+42%' }] },
    's26': { title: 'Frontend Performance Optimization', provider: 'Google Chrome Team', instructor: 'Addy Osmani', instructorImg: 'https://i.pravatar.cc/150?img=36', description: 'Make blazing-fast websites', category: 'Technology', categoryColor: '#83D6FF', rating: 4.6, reviews: 25000, thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80', duration: '6 weeks', difficulty: 'Advanced', learners: '290K learners', language: 'English', curriculum: [{ section: 'Week 1–2: Performance', lessons: ['Core Web Vitals', 'Lazy Loading', 'Code Splitting', 'Caching', 'Quiz'], duration: '5h', open: true }, { section: 'Week 3–4: Optimization Techniques', lessons: ['Image Optimization', 'Bundle Analysis', 'Tree Shaking', 'Critical CSS', 'Lab: Performance Audit'], duration: '6h 30m', open: false }, { section: 'Week 5: Advanced Patterns', lessons: ['Service Workers', 'PWA Features', 'Prefetching', 'HTTP/2 & HTTP/3', 'Project: Optimized Site'], duration: '5h 45m', open: false }, { section: 'Week 6: Monitoring', lessons: ['Performance Monitoring', 'Real User Metrics', 'Synthetic Testing', 'Performance Budget', 'Final Analysis'], duration: '4h 30m', open: false }], whatYouLearn: ['Performance optimization', 'Core Web Vitals', 'Caching strategies'], careerOutcomes: [{ role: 'Performance Engineer', salary: '$132K', growth: '+18%' }] },
    's27': { title: 'API Design & Backend Development', provider: 'Postman', instructor: 'Kin Lane', instructorImg: 'https://i.pravatar.cc/150?img=41', description: 'Build scalable REST and GraphQL APIs', category: 'Technology', categoryColor: '#83D6FF', rating: 4.7, reviews: 31000, thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80', duration: '10 weeks', difficulty: 'Intermediate', learners: '420K learners', language: 'English', curriculum: [{ section: 'Week 1–3: API Design', lessons: ['REST principles', 'GraphQL', 'Authentication', 'Documentation', 'Quiz'], duration: '7h', open: true }, { section: 'Week 4–6: Backend Development', lessons: ['Node.js & Express', 'Database Integration', 'Error Handling', 'Middleware', 'Lab: RESTful API'], duration: '8h 45m', open: false }, { section: 'Week 7–8: Advanced API Features', lessons: ['Rate Limiting', 'Versioning', 'WebSockets', 'API Gateway', 'Project: GraphQL API'], duration: '7h 30m', open: false }, { section: 'Week 9–10: Security & Scaling', lessons: ['API Security', 'OAuth 2.0', 'Load Balancing', 'Microservices', 'Final API Project'], duration: '6h 15m', open: false }], whatYouLearn: ['REST APIs', 'GraphQL', 'API security'], careerOutcomes: [{ role: 'Backend Developer', salary: '$122K', growth: '+21%' }] },
    's28': { title: 'Accessibility & Inclusive Design', provider: 'Deque University', instructor: 'Marcy Sutton', instructorImg: 'https://i.pravatar.cc/150?img=50', description: 'Build for everyone with WCAG', category: 'Technology', categoryColor: '#83D6FF', rating: 4.8, reviews: 18000, thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=1200&q=80', duration: '5 weeks', difficulty: 'Intermediate', learners: '210K learners', language: 'English', curriculum: [{ section: 'Week 1–2: Accessibility', lessons: ['WCAG Standards', 'Screen Readers', 'ARIA', 'Testing', 'Quiz'], duration: '4h', open: true }, { section: 'Week 3: Semantic HTML', lessons: ['Semantic Elements', 'Forms Accessibility', 'Navigation Patterns', 'Focus Management', 'Lab: Accessible Form'], duration: '4h 30m', open: false }, { section: 'Week 4: Component Accessibility', lessons: ['Modal Dialogs', 'Dropdown Menus', 'Tabs & Accordions', 'Keyboard Navigation', 'Project: Component Library'], duration: '5h', open: false }, { section: 'Week 5: Testing & Compliance', lessons: ['Automated Testing', 'Manual Testing', 'Audit Reports', 'Remediation', 'Final Accessibility Review'], duration: '4h 15m', open: false }], whatYouLearn: ['WCAG compliance', 'Screen reader testing', 'Accessible components'], careerOutcomes: [{ role: 'Accessibility Engineer', salary: '$118K', growth: '+26%' }] },
    's29': { title: 'Android App Development with Kotlin', provider: 'Google Developers', instructor: 'Chet Haase', instructorImg: 'https://i.pravatar.cc/150?img=59', description: 'Build modern Android apps', category: 'Technology', categoryColor: '#FFB3C6', rating: 4.7, reviews: 52000, thumbnail: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?w=1200&q=80', duration: '13 weeks', difficulty: 'Intermediate', learners: '780K learners', language: 'English', curriculum: [{ section: 'Week 1–3: Kotlin', lessons: ['Kotlin Basics', 'OOP', 'Coroutines', 'Collections', 'Quiz'], duration: '8h', open: true }, { section: 'Week 4–7: Jetpack Compose', lessons: ['Compose Basics', 'State Management', 'Layouts', 'Navigation', 'Lab: UI Components'], duration: '10h 30m', open: false }, { section: 'Week 8–11: Android Architecture', lessons: ['MVVM Pattern', 'Room Database', 'ViewModel', 'Repository Pattern', 'Project: News App'], duration: '12h 15m', open: false }, { section: 'Week 12–13: Production', lessons: ['Testing', 'Material Design 3', 'Performance', 'Publishing', 'Final App'], duration: '8h 45m', open: false }], whatYouLearn: ['Kotlin programming', 'Jetpack Compose', 'Material Design'], careerOutcomes: [{ role: 'Android Developer', salary: '$118K', growth: '+19%' }] },
    's30': { title: 'React Native - Cross-Platform Apps', provider: 'Expo', instructor: 'William Candillon', instructorImg: 'https://i.pravatar.cc/150?img=64', description: 'Build iOS and Android with one codebase', category: 'Technology', categoryColor: '#FFB3C6', rating: 4.6, reviews: 38000, thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80', duration: '12 weeks', difficulty: 'Intermediate', learners: '620K learners', language: 'English', curriculum: [{ section: 'Week 1–3: React Native', lessons: ['Setup', 'Components', 'Navigation', 'State', 'Quiz'], duration: '9h', open: true }, { section: 'Week 4–6: Native Features', lessons: ['Camera & Media', 'Geolocation', 'Push Notifications', 'Local Storage', 'Lab: Feature Integration'], duration: '10h 30m', open: false }, { section: 'Week 7–9: Advanced Topics', lessons: ['Animations', 'Performance', 'Native Modules', 'Offline Support', 'Project: Full App'], duration: '11h 45m', open: false }, { section: 'Week 10–12: Deployment', lessons: ['Testing', 'App Store Setup', 'Google Play Setup', 'OTA Updates', 'Final Launch'], duration: '8h 15m', open: false }], whatYouLearn: ['React Native', 'Cross-platform apps', 'Native modules'], careerOutcomes: [{ role: 'Mobile Developer', salary: '$125K', growth: '+22%' }] },
    's31': { title: 'Flutter & Dart - Mobile UI Development', provider: 'Google Flutter Team', instructor: 'Emily Fortuna', instructorImg: 'https://i.pravatar.cc/150?img=49', description: 'Beautiful native apps with Flutter', category: 'Technology', categoryColor: '#FFB3C6', rating: 4.8, reviews: 45000, thumbnail: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=1200&q=80', duration: '11 weeks', difficulty: 'Beginner', learners: '890K learners', language: 'English', curriculum: [{ section: 'Week 1–3: Dart & Flutter', lessons: ['Dart Basics', 'Widgets', 'State Management', 'Animations', 'Quiz'], duration: '9h', open: true }, { section: 'Week 4–6: Advanced Flutter', lessons: ['Custom Widgets', 'Provider & Riverpod', 'Networking', 'Local Database', 'Lab: Shopping App'], duration: '10h 45m', open: false }, { section: 'Week 7–9: UI/UX Mastery', lessons: ['Material Design', 'Cupertino Widgets', 'Responsive Design', 'Theming', 'Project: Portfolio App'], duration: '9h 30m', open: false }, { section: 'Week 10–11: Production Ready', lessons: ['Testing', 'Deployment', 'App Store Optimization', 'Firebase Integration', 'Final App Release'], duration: '7h 15m', open: false }], whatYouLearn: ['Flutter development', 'Dart language', 'UI animations'], careerOutcomes: [{ role: 'Flutter Developer', salary: '$112K', growth: '+28%' }] },
    's32': { title: 'Mobile DevOps & CI/CD', provider: 'Bitrise', instructor: 'Daniel Biegler', instructorImg: 'https://i.pravatar.cc/150?img=73', description: 'Automate mobile deployment', category: 'Technology', categoryColor: '#FFB3C6', rating: 4.5, reviews: 15000, thumbnail: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=1200&q=80', duration: '6 weeks', difficulty: 'Advanced', learners: '180K learners', language: 'English', curriculum: [{ section: 'Week 1–2: CI/CD', lessons: ['Fastlane', 'GitHub Actions', 'Testing', 'Deployment', 'Quiz'], duration: '5h', open: true }, { section: 'Week 3–4: Automation', lessons: ['Build Automation', 'Code Signing', 'Beta Distribution', 'Release Management', 'Lab: CI Pipeline'], duration: '6h 30m', open: false }, { section: 'Week 5: Monitoring', lessons: ['Crash Reporting', 'Analytics Integration', 'Performance Monitoring', 'User Feedback', 'Project: Dashboard'], duration: '5h 45m', open: false }, { section: 'Week 6: Enterprise Practices', lessons: ['App Security', 'Code Quality', 'Compliance', 'Team Workflows', 'Final Pipeline'], duration: '4h 30m', open: false }], whatYouLearn: ['Mobile CI/CD', 'Fastlane', 'Automated testing'], careerOutcomes: [{ role: 'Mobile DevOps', salary: '$135K', growth: '+24%' }] },
    // ========== CLOUD & DEVOPS s33-s36 ==========
    's33': { title: 'DevOps Engineering & Kubernetes', provider: 'Linux Foundation', instructor: 'Kelsey Hightower', instructorImg: 'https://i.pravatar.cc/150?img=18', description: 'Master DevOps and K8s', category: 'Technology', categoryColor: '#83D6FF', rating: 4.8, reviews: 62000, thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1200&q=80', duration: '14 weeks', difficulty: 'Advanced', learners: '580K learners', language: 'English', curriculum: [{ section: 'Week 1–4: DevOps', lessons: ['CI/CD', 'Docker', 'Jenkins', 'Terraform', 'Quiz'], duration: '12h', open: true }], whatYouLearn: ['Kubernetes', 'Docker', 'Terraform'], careerOutcomes: [{ role: 'DevOps Engineer', salary: '$132K', growth: '+27%' }] },
    's34': { title: 'Microsoft Azure Cloud Solutions', provider: 'Microsoft', instructor: 'Scott Hanselman', instructorImg: 'https://i.pravatar.cc/150?img=29', description: 'Build on Azure', category: 'Technology', categoryColor: '#83D6FF', rating: 4.6, reviews: 48000, thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=80', duration: '11 weeks', difficulty: 'Intermediate', learners: '640K learners', language: 'English', curriculum: [{ section: 'Week 1–3: Azure Basics', lessons: ['Azure Portal', 'VMs', 'App Service', 'Storage', 'Quiz'], duration: '8h', open: true }], whatYouLearn: ['Azure services', 'Cloud architecture', 'Azure certifications'], careerOutcomes: [{ role: 'Azure Engineer', salary: '$138K', growth: '+25%' }] },
    's35': { title: 'Serverless Architecture & Lambda', provider: 'AWS', instructor: 'Ben Kehoe', instructorImg: 'https://i.pravatar.cc/150?img=35', description: 'Go serverless', category: 'Technology', categoryColor: '#83D6FF', rating: 4.7, reviews: 33000, thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80', duration: '8 weeks', difficulty: 'Advanced', learners: '320K learners', language: 'English', curriculum: [{ section: 'Week 1–2: Serverless', lessons: ['Lambda', 'API Gateway', 'DynamoDB', 'Event-driven', 'Quiz'], duration: '6h', open: true }], whatYouLearn: ['AWS Lambda', 'Serverless patterns', 'Event-driven architecture'], careerOutcomes: [{ role: 'Cloud Architect', salary: '$152K', growth: '+29%' }] },
    's36': { title: 'Cloud Security & Infrastructure Protection', provider: 'Cloud Security Alliance', instructor: 'Jim Manico', instructorImg: 'https://i.pravatar.cc/150?img=42', description: 'Secure cloud environments', category: 'Technology', categoryColor: '#83D6FF', rating: 4.8, reviews: 27000, thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80', duration: '9 weeks', difficulty: 'Advanced', learners: '270K learners', language: 'English', curriculum: [{ section: 'Week 1–3: Cloud Security', lessons: ['IAM', 'Encryption', 'Network Security', 'Compliance', 'Quiz'], duration: '7h', open: true }], whatYouLearn: ['Cloud security', 'IAM', 'Compliance'], careerOutcomes: [{ role: 'Cloud Security Engineer', salary: '$158K', growth: '+32%' }] },
    // ========== MORE DATA SCIENCE s37-s42 ==========
    's37': { title: 'Data Analysis with Pandas & NumPy', provider: 'DataCamp', instructor: 'Wes McKinney', instructorImg: 'https://i.pravatar.cc/150?img=21', description: 'Master data manipulation', category: 'Data Science', categoryColor: '#A98BFF', rating: 4.7, reviews: 55000, thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80', duration: '7 weeks', difficulty: 'Beginner', learners: '920K learners', language: 'English', curriculum: [{ section: 'Week 1–3: Pandas', lessons: ['DataFrames', 'Indexing', 'Grouping', 'Merging', 'Quiz'], duration: '6h', open: true }], whatYouLearn: ['Pandas mastery', 'NumPy arrays', 'Data cleaning'], careerOutcomes: [{ role: 'Data Analyst', salary: '$78K', growth: '+18%' }] },
    's38': { title: 'SQL for Data Science', provider: 'Mode Analytics', instructor: 'Benn Stancil', instructorImg: 'https://i.pravatar.cc/150?img=32', description: 'Master SQL queries', category: 'Data Science', categoryColor: '#A98BFF', rating: 4.8, reviews: 72000, thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200&q=80', duration: '6 weeks', difficulty: 'Beginner', learners: '1.3M learners', language: 'English', curriculum: [{ section: 'Week 1–2: SQL Basics', lessons: ['SELECT', 'WHERE', 'JOINs', 'GROUP BY', 'Quiz'], duration: '5h', open: true }], whatYouLearn: ['SQL queries', 'Database design', 'Data extraction'], careerOutcomes: [{ role: 'Data Analyst', salary: '$75K', growth: '+19%' }] },
    's39': { title: 'Data Visualization with Tableau', provider: 'Tableau', instructor: 'Andy Kriebel', instructorImg: 'https://i.pravatar.cc/150?img=46', description: 'Create stunning dashboards', category: 'Data Science', categoryColor: '#A98BFF', rating: 4.6, reviews: 48000, thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80', duration: '8 weeks', difficulty: 'Intermediate', learners: '680K learners', language: 'English', curriculum: [{ section: 'Week 1–2: Tableau Basics', lessons: ['Interface', 'Charts', 'Filters', 'Dashboards', 'Quiz'], duration: '5h 30m', open: true }], whatYouLearn: ['Tableau dashboards', 'Data visualization', 'Business intelligence'], careerOutcomes: [{ role: 'BI Analyst', salary: '$85K', growth: '+21%' }] },
    's40': { title: 'Big Data & Spark Fundamentals', provider: 'Databricks', instructor: 'Matei Zaharia', instructorImg: 'https://i.pravatar.cc/150?img=54', description: 'Process massive datasets', category: 'Data Science', categoryColor: '#A98BFF', rating: 4.7, reviews: 32000, thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80', duration: '10 weeks', difficulty: 'Advanced', learners: '380K learners', language: 'English', curriculum: [{ section: 'Week 1–3: Spark', lessons: ['RDDs', 'DataFrames', 'Spark SQL', 'MLlib', 'Quiz'], duration: '8h', open: true }], whatYouLearn: ['Apache Spark', 'Big Data processing', 'Distributed computing'], careerOutcomes: [{ role: 'Big Data Engineer', salary: '$142K', growth: '+26%' }] },
    's41': { title: 'Statistics & Probability for Data Science', provider: 'MIT', instructor: 'Gilbert Strang', instructorImg: 'https://i.pravatar.cc/150?img=63', description: 'Statistical foundation', category: 'Data Science', categoryColor: '#A98BFF', rating: 4.9, reviews: 68000, thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&q=80', duration: '9 weeks', difficulty: 'Intermediate', learners: '750K learners', language: 'English', curriculum: [{ section: 'Week 1–3: Statistics', lessons: ['Descriptive Stats', 'Probability', 'Distributions', 'Hypothesis Testing', 'Quiz'], duration: '7h', open: true }], whatYouLearn: ['Statistics', 'Probability theory', 'Hypothesis testing'], careerOutcomes: [{ role: 'Data Scientist', salary: '$125K', growth: '+22%' }] },
    's42': { title: 'Time Series Analysis & Forecasting', provider: 'Duke University', instructor: 'Rob Hyndman', instructorImg: 'https://i.pravatar.cc/150?img=72', description: 'Predict future trends', category: 'Data Science', categoryColor: '#A98BFF', rating: 4.6, reviews: 28000, thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=80', duration: '8 weeks', difficulty: 'Advanced', learners: '320K learners', language: 'English', curriculum: [{ section: 'Week 1–2: Time Series', lessons: ['ARIMA', 'Prophet', 'Seasonality', 'Forecasting', 'Quiz'], duration: '6h', open: true }], whatYouLearn: ['Time series modeling', 'Forecasting', 'ARIMA models'], careerOutcomes: [{ role: 'Forecasting Analyst', salary: '$95K', growth: '+17%' }] },
    // ========== MORE DESIGN s43-s48 ==========
    's43': { title: 'Mobile App Design with Figma', provider: 'Figma', instructor: 'Thomas Moeller', instructorImg: 'https://i.pravatar.cc/150?img=25', description: 'Design mobile interfaces', category: 'Design', categoryColor: '#FF6D70', rating: 4.8, reviews: 42000, thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&q=80', duration: '6 weeks', difficulty: 'Intermediate', learners: '580K learners', language: 'English', curriculum: [{ section: 'Week 1–2: Mobile Design', lessons: ['iOS Guidelines', 'Android Material', 'Responsive', 'Prototyping', 'Quiz'], duration: '5h', open: true }], whatYouLearn: ['Mobile UI design', 'iOS & Android patterns', 'Figma prototyping'], careerOutcomes: [{ role: 'Mobile Designer', salary: '$98K', growth: '+21%' }] },
    's44': { title: 'Graphic Design Fundamentals', provider: 'CalArts', instructor: 'Michael Worthington', instructorImg: 'https://i.pravatar.cc/150?img=37', description: 'Design principles', category: 'Design', categoryColor: '#FF6D70', rating: 4.7, reviews: 55000, thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1200&q=80', duration: '8 weeks', difficulty: 'Beginner', learners: '820K learners', language: 'English', curriculum: [{ section: 'Week 1–2: Design Basics', lessons: ['Composition', 'Color', 'Typography', 'Hierarchy', 'Quiz'], duration: '5h', open: true }], whatYouLearn: ['Design principles', 'Typography', 'Color theory'], careerOutcomes: [{ role: 'Graphic Designer', salary: '$52K', growth: '+14%' }] },
    's45': { title: 'Interaction Design & Microinteractions', provider: 'Copenhagen Institute', instructor: 'Dan Saffer', instructorImg: 'https://i.pravatar.cc/150?img=51', description: 'Delightful interactions', category: 'Design', categoryColor: '#FF6D70', rating: 4.9, reviews: 24000, thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&q=80', duration: '7 weeks', difficulty: 'Advanced', learners: '280K learners', language: 'English', curriculum: [{ section: 'Week 1–2: Interactions', lessons: ['Microinteractions', 'Animations', 'Transitions', 'Feedback', 'Quiz'], duration: '5h 30m', open: true }], whatYouLearn: ['Interaction design', 'Animations', 'Microinteractions'], careerOutcomes: [{ role: 'Interaction Designer', salary: '$108K', growth: '+23%' }] },
    's46': { title: 'Illustration for Digital Products', provider: 'Skillshare', instructor: 'Alice Lee', instructorImg: 'https://i.pravatar.cc/150?img=47', description: 'Create custom illustrations', category: 'Design', categoryColor: '#FF6D70', rating: 4.6, reviews: 19000, thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=80', duration: '6 weeks', difficulty: 'Beginner', learners: '420K learners', language: 'English', curriculum: [{ section: 'Week 1–2: Illustration', lessons: ['Drawing Basics', 'Digital Tools', 'Style Development', 'Portfolio', 'Quiz'], duration: '5h', open: true }], whatYouLearn: ['Digital illustration', 'Drawing techniques', 'Style development'], careerOutcomes: [{ role: 'Illustrator', salary: '$58K', growth: '+16%' }] },
    // ========== CYBERSECURITY s47-s52 ==========
    's47': { title: 'Ethical Hacking & Penetration Testing', provider: 'EC-Council', instructor: 'Kevin Mitnick', instructorImg: 'https://i.pravatar.cc/150?img=22', description: 'Learn ethical hacking and pen testing', category: 'Technology', categoryColor: '#FF6D70', rating: 4.8, reviews: 52000, thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&q=80', duration: '12 weeks', difficulty: 'Advanced', learners: '420K learners', language: 'English', curriculum: [{ section: 'Week 1–3: Hacking Basics', lessons: ['Reconnaissance', 'Scanning', 'Enumeration', 'Vulnerability Analysis', 'Quiz'], duration: '9h', open: true }, { section: 'Week 4–7: Exploitation', lessons: ['System Hacking', 'Web App Hacking', 'SQL Injection', 'XSS Attacks', 'Lab'], duration: '12h', open: false }], whatYouLearn: ['Ethical hacking', 'Penetration testing', 'Vulnerability assessment', 'Security tools'], careerOutcomes: [{ role: 'Penetration Tester', salary: '$105K', growth: '+31%' }, { role: 'Security Analyst', salary: '$95K', growth: '+28%' }] },
    's48': { title: 'Cybersecurity Fundamentals', provider: 'CompTIA', instructor: 'Troy Hunt', instructorImg: 'https://i.pravatar.cc/150?img=34', description: 'Master cybersecurity basics', category: 'Technology', categoryColor: '#FF6D70', rating: 4.7, reviews: 68000, thumbnail: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80', duration: '10 weeks', difficulty: 'Beginner', learners: '890K learners', language: 'English', curriculum: [{ section: 'Week 1–3: Security Basics', lessons: ['CIA Triad', 'Threats', 'Cryptography', 'Network Security', 'Quiz'], duration: '7h', open: true }, { section: 'Week 4–6: Defense', lessons: ['Firewalls', 'IDS/IPS', 'Security Policies', 'Incident Response', 'Lab'], duration: '8h 30m', open: false }], whatYouLearn: ['Security fundamentals', 'Network security', 'Cryptography basics', 'Risk management'], careerOutcomes: [{ role: 'Security Analyst', salary: '$88K', growth: '+27%' }] },
    's49': { title: 'Network Security & Firewall Management', provider: 'Cisco', instructor: 'Omar Santos', instructorImg: 'https://i.pravatar.cc/150?img=45', description: 'Secure networks and firewalls', category: 'Technology', categoryColor: '#FF6D70', rating: 4.6, reviews: 42000, thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&q=80', duration: '9 weeks', difficulty: 'Intermediate', learners: '520K learners', language: 'English', curriculum: [{ section: 'Week 1–3: Network Security', lessons: ['Network Protocols', 'VPN', 'Firewall Basics', 'DMZ Setup', 'Quiz'], duration: '7h 30m', open: true }], whatYouLearn: ['Network security', 'Firewall configuration', 'VPN setup'], careerOutcomes: [{ role: 'Network Security Engineer', salary: '$98K', growth: '+24%' }] },
    's50': { title: 'Application Security (AppSec)', provider: 'OWASP', instructor: 'Jim Manico', instructorImg: 'https://i.pravatar.cc/150?img=56', description: 'Secure web applications', category: 'Technology', categoryColor: '#FF6D70', rating: 4.8, reviews: 35000, thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&q=80', duration: '11 weeks', difficulty: 'Advanced', learners: '380K learners', language: 'English', curriculum: [{ section: 'Week 1–3: OWASP Top 10', lessons: ['Injection', 'Broken Auth', 'XSS', 'CSRF', 'Quiz'], duration: '8h', open: true }], whatYouLearn: ['Application security', 'OWASP Top 10', 'Secure coding'], careerOutcomes: [{ role: 'AppSec Engineer', salary: '$125K', growth: '+29%' }] },
    's51': { title: 'Security Operations Center (SOC) Analyst', provider: 'SANS Institute', instructor: 'John Strand', instructorImg: 'https://i.pravatar.cc/150?img=65', description: 'SOC operations and monitoring', category: 'Technology', categoryColor: '#FF6D70', rating: 4.7, reviews: 38000, thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&q=80', duration: '10 weeks', difficulty: 'Intermediate', learners: '450K learners', language: 'English', curriculum: [{ section: 'Week 1–3: SOC Basics', lessons: ['SIEM', 'Log Analysis', 'Threat Hunting', 'Incident Response', 'Quiz'], duration: '8h 30m', open: true }], whatYouLearn: ['SOC operations', 'SIEM tools', 'Threat detection'], careerOutcomes: [{ role: 'SOC Analyst', salary: '$82K', growth: '+26%' }] },
    's52': { title: 'Incident Response & Digital Forensics', provider: 'DFIR', instructor: 'Brett Shavers', instructorImg: 'https://i.pravatar.cc/150?img=74', description: 'Investigate security incidents', category: 'Technology', categoryColor: '#FF6D70', rating: 4.9, reviews: 28000, thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80', duration: '13 weeks', difficulty: 'Advanced', learners: '290K learners', language: 'English', curriculum: [{ section: 'Week 1–4: Digital Forensics', lessons: ['Evidence Collection', 'Disk Forensics', 'Memory Forensics', 'Network Forensics', 'Quiz'], duration: '10h', open: true }], whatYouLearn: ['Digital forensics', 'Incident response', 'Evidence analysis'], careerOutcomes: [{ role: 'Forensics Analyst', salary: '$115K', growth: '+27%' }] },
    // ========== GAME DEVELOPMENT s53-s58 ==========
    's53': { title: 'Unity Game Development', provider: 'Unity Learn', instructor: 'Rick Davidson', instructorImg: 'https://i.pravatar.cc/150?img=28', description: 'Create games with Unity', category: 'Technology', categoryColor: '#FFB3C6', rating: 4.8, reviews: 95000, thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&q=80', duration: '15 weeks', difficulty: 'Intermediate', learners: '1.2M learners', language: 'English', curriculum: [{ section: 'Week 1–4: Unity Basics', lessons: ['Unity Interface', 'C# Scripting', 'Game Objects', 'Physics', 'Quiz'], duration: '10h', open: true }, { section: 'Week 5–10: Game Dev', lessons: ['2D Games', '3D Games', 'Animations', 'AI', 'Project'], duration: '16h', open: false }], whatYouLearn: ['Unity engine', 'C# programming', 'Game mechanics', '2D/3D development'], careerOutcomes: [{ role: 'Unity Developer', salary: '$92K', growth: '+23%' }] },
    's54': { title: 'Unreal Engine 5 for Games', provider: 'Epic Games', instructor: 'Tim Sweeney', instructorImg: 'https://i.pravatar.cc/150?img=40', description: 'AAA game development', category: 'Technology', categoryColor: '#FFB3C6', rating: 4.9, reviews: 72000, thumbnail: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=1200&q=80', duration: '16 weeks', difficulty: 'Advanced', learners: '620K learners', language: 'English', curriculum: [{ section: 'Week 1–4: Unreal Basics', lessons: ['Blueprints', 'C++', 'Materials', 'Lighting', 'Quiz'], duration: '12h', open: true }], whatYouLearn: ['Unreal Engine 5', 'Blueprint scripting', 'C++ for games'], careerOutcomes: [{ role: 'Unreal Developer', salary: '$108K', growth: '+26%' }] },
    's55': { title: 'Game Design Theory & Mechanics', provider: 'Game Design Workshop', instructor: 'Jesse Schell', instructorImg: 'https://i.pravatar.cc/150?img=53', description: 'Design engaging games', category: 'Design', categoryColor: '#FFB3C6', rating: 4.7, reviews: 48000, thumbnail: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&q=80', duration: '10 weeks', difficulty: 'Beginner', learners: '580K learners', language: 'English', curriculum: [{ section: 'Week 1–3: Game Design', lessons: ['Core Loops', 'Player Psychology', 'Balance', 'Progression', 'Quiz'], duration: '7h', open: true }], whatYouLearn: ['Game design principles', 'Game mechanics', 'Player engagement'], careerOutcomes: [{ role: 'Game Designer', salary: '$78K', growth: '+21%' }] },
    's56': { title: 'Mobile Game Development', provider: 'GameDev.tv', instructor: 'Ben Tristem', instructorImg: 'https://i.pravatar.cc/150?img=62', description: 'Build mobile games', category: 'Technology', categoryColor: '#FFB3C6', rating: 4.6, reviews: 58000, thumbnail: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=1200&q=80', duration: '12 weeks', difficulty: 'Intermediate', learners: '720K learners', language: 'English', curriculum: [{ section: 'Week 1–3: Mobile Basics', lessons: ['Touch Controls', 'Mobile Optimization', 'Monetization', 'Publishing', 'Quiz'], duration: '8h', open: true }], whatYouLearn: ['Mobile game dev', 'Touch controls', 'Game monetization'], careerOutcomes: [{ role: 'Mobile Game Developer', salary: '$88K', growth: '+24%' }] },
    's57': { title: 'VR/AR Game Development', provider: 'Meta', instructor: 'John Carmack', instructorImg: 'https://i.pravatar.cc/150?img=69', description: 'Create immersive VR/AR games', category: 'Technology', categoryColor: '#FFB3C6', rating: 4.8, reviews: 35000, thumbnail: 'https://images.unsplash.com/photo-1617802690992-15d93263d3a9?w=1200&q=80', duration: '14 weeks', difficulty: 'Advanced', learners: '320K learners', language: 'English', curriculum: [{ section: 'Week 1–4: VR Basics', lessons: ['VR Setup', 'Spatial Audio', 'Locomotion', 'Hand Tracking', 'Quiz'], duration: '10h', open: true }], whatYouLearn: ['VR development', 'AR development', 'Spatial computing'], careerOutcomes: [{ role: 'VR Developer', salary: '$115K', growth: '+38%' }] },
    's58': { title: 'Multiplayer & Networking for Games', provider: 'Photon Engine', instructor: 'Christof Wegmann', instructorImg: 'https://i.pravatar.cc/150?img=75', description: 'Build multiplayer games', category: 'Technology', categoryColor: '#FFB3C6', rating: 4.7, reviews: 28000, thumbnail: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=1200&q=80', duration: '11 weeks', difficulty: 'Advanced', learners: '280K learners', language: 'English', curriculum: [{ section: 'Week 1–3: Networking', lessons: ['Client-Server', 'Peer-to-Peer', 'State Sync', 'Lag Compensation', 'Quiz'], duration: '9h', open: true }], whatYouLearn: ['Game networking', 'Multiplayer systems', 'Server architecture'], careerOutcomes: [{ role: 'Network Programmer', salary: '$125K', growth: '+23%' }] },
    // ========== SPECIALIZED TECH s59-s66 ==========
    's59': { title: 'Artificial Intelligence & Robotics', provider: 'MIT', instructor: 'Rodney Brooks', instructorImg: 'https://i.pravatar.cc/150?img=20', description: 'AI and robotics systems', category: 'Technology', categoryColor: '#A98BFF', rating: 4.9, reviews: 42000, thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1200&q=80', duration: '16 weeks', difficulty: 'Advanced', learners: '380K learners', language: 'English', curriculum: [{ section: 'Week 1–4: AI Basics', lessons: ['Search Algorithms', 'Planning', 'Machine Learning', 'Vision', 'Quiz'], duration: '12h', open: true }], whatYouLearn: ['AI algorithms', 'Robotics', 'Computer vision'], careerOutcomes: [{ role: 'Robotics Engineer', salary: '$112K', growth: '+29%' }] },
    's60': { title: 'Internet of Things (IoT)', provider: 'IBM', instructor: 'Shawn Wallace', instructorImg: 'https://i.pravatar.cc/150?img=30', description: 'Build IoT systems', category: 'Technology', categoryColor: '#83D6FF', rating: 4.6, reviews: 38000, thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80', duration: '10 weeks', difficulty: 'Intermediate', learners: '520K learners', language: 'English', curriculum: [{ section: 'Week 1–3: IoT Basics', lessons: ['Sensors', 'MQTT', 'Cloud Integration', 'Security', 'Quiz'], duration: '7h', open: true }], whatYouLearn: ['IoT systems', 'Sensor networks', 'Edge computing'], careerOutcomes: [{ role: 'IoT Engineer', salary: '$105K', growth: '+31%' }] },
    's61': { title: 'Quantum Computing Fundamentals', provider: 'IBM Quantum', instructor: 'Scott Aaronson', instructorImg: 'https://i.pravatar.cc/150?img=38', description: 'Introduction to quantum computing', category: 'Technology', categoryColor: '#A98BFF', rating: 4.8, reviews: 18000, thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1200&q=80', duration: '8 weeks', difficulty: 'Advanced', learners: '180K learners', language: 'English', curriculum: [{ section: 'Week 1–3: Quantum Basics', lessons: ['Qubits', 'Superposition', 'Entanglement', 'Quantum Gates', 'Quiz'], duration: '6h', open: true }], whatYouLearn: ['Quantum computing', 'Quantum algorithms', 'Qiskit'], careerOutcomes: [{ role: 'Quantum Scientist', salary: '$145K', growth: '+42%' }] },
    's62': { title: 'Computer Vision & Image Processing', provider: 'OpenCV', instructor: 'Adrian Rosebrock', instructorImg: 'https://i.pravatar.cc/150?img=44', description: 'Master computer vision', category: 'Data Science', categoryColor: '#A98BFF', rating: 4.7, reviews: 48000, thumbnail: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=1200&q=80', duration: '12 weeks', difficulty: 'Intermediate', learners: '620K learners', language: 'English', curriculum: [{ section: 'Week 1–3: Image Processing', lessons: ['Filtering', 'Edge Detection', 'Feature Extraction', 'Object Detection', 'Quiz'], duration: '8h', open: true }], whatYouLearn: ['Computer vision', 'OpenCV', 'Image processing'], careerOutcomes: [{ role: 'Computer Vision Engineer', salary: '$135K', growth: '+33%' }] },
    's63': { title: 'Natural Language Processing (NLP)', provider: 'fast.ai', instructor: 'Rachel Thomas', instructorImg: 'https://i.pravatar.cc/150?img=57', description: 'NLP and text analytics', category: 'Data Science', categoryColor: '#A98BFF', rating: 4.8, reviews: 52000, thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&q=80', duration: '11 weeks', difficulty: 'Advanced', learners: '480K learners', language: 'English', curriculum: [{ section: 'Week 1–3: NLP Basics', lessons: ['Tokenization', 'Word Embeddings', 'Text Classification', 'Sentiment Analysis', 'Quiz'], duration: '8h 30m', open: true }], whatYouLearn: ['NLP techniques', 'Transformers', 'Language models'], careerOutcomes: [{ role: 'NLP Engineer', salary: '$142K', growth: '+36%' }] },
    's64': { title: 'Reinforcement Learning', provider: 'DeepMind', instructor: 'David Silver', instructorImg: 'https://i.pravatar.cc/150?img=66', description: 'Master RL algorithms', category: 'Data Science', categoryColor: '#A98BFF', rating: 4.9, reviews: 32000, thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1200&q=80', duration: '13 weeks', difficulty: 'Advanced', learners: '280K learners', language: 'English', curriculum: [{ section: 'Week 1–4: RL Basics', lessons: ['Markov Decision Process', 'Q-Learning', 'Policy Gradients', 'Actor-Critic', 'Quiz'], duration: '10h', open: true }], whatYouLearn: ['Reinforcement learning', 'Deep RL', 'Game AI'], careerOutcomes: [{ role: 'RL Researcher', salary: '$168K', growth: '+41%' }] },
    's65': { title: 'MLOps & Model Deployment', provider: 'Google Cloud', instructor: 'Lak Lakshmanan', instructorImg: 'https://i.pravatar.cc/150?img=71', description: 'Deploy ML at scale', category: 'Data Science', categoryColor: '#A98BFF', rating: 4.7, reviews: 38000, thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=1200&q=80', duration: '10 weeks', difficulty: 'Advanced', learners: '420K learners', language: 'English', curriculum: [{ section: 'Week 1–3: MLOps', lessons: ['CI/CD for ML', 'Model Monitoring', 'Feature Stores', 'A/B Testing', 'Quiz'], duration: '8h', open: true }], whatYouLearn: ['MLOps practices', 'Model deployment', 'Production ML'], careerOutcomes: [{ role: 'MLOps Engineer', salary: '$148K', growth: '+34%' }] },
    's66': { title: 'Edge AI & TinyML', provider: 'Edge Impulse', instructor: 'Jan Jongboom', instructorImg: 'https://i.pravatar.cc/150?img=76', description: 'AI on edge devices', category: 'Technology', categoryColor: '#A98BFF', rating: 4.6, reviews: 22000, thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80', duration: '9 weeks', difficulty: 'Advanced', learners: '240K learners', language: 'English', curriculum: [{ section: 'Week 1–3: TinyML', lessons: ['Model Optimization', 'Quantization', 'Edge Deployment', 'Low-Power AI', 'Quiz'], duration: '7h', open: true }], whatYouLearn: ['Edge AI', 'TinyML', 'Model optimization'], careerOutcomes: [{ role: 'Edge AI Engineer', salary: '$128K', growth: '+38%' }] },
  };

  const courseData = COURSE_DATABASE[courseId] || COURSE_DATABASE['ml-specialization'];
  const courseName = courseData.title;
  
  // Use course-specific curriculum or fallback to default
  const courseCurriculum = courseData.curriculum || CURRICULUM;

  // Reset celebration state when navigating to a new course AND scroll to top
  useEffect(() => {
    console.log('🆕 Course loaded:', courseId);
    setShowCelebration(false);
    setCelebrationClosed(false);
    setShowCertificateViewer(false);
    
    // Scroll to top of the page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    return () => {
      console.log('🚪 Leaving course:', courseId);
    };
  }, [courseId]);

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
    console.log('🎯 Progress changed to:', progress);
    console.log('📦 Celebration closed flag:', celebrationClosed);
    console.log('📦 showCelebration:', showCelebration);
    
    // Only trigger celebration if progress is 100 AND celebration is not already showing AND not manually closed
    if (progress === 100 && !showCelebration && !celebrationClosed) {
      console.log('🎉 Progress reached 100%! Waiting 500ms...');
      
      // Wait 500ms before showing celebration
      const timer = setTimeout(() => {
        console.log('🎊 TRIGGERING CELEBRATION NOW!');
        setShowCelebration(true);
      }, 500);

      // Cleanup timer if component unmounts
      return () => clearTimeout(timer);
    }
  }, [progress, showCelebration, celebrationClosed]);

  // Function to simulate course completion
  const handleCompleteCourse = () => {
    console.log('🚀 COMPLETE COURSE BUTTON CLICKED!');
    
    // First reset progress to allow re-completion
    setProgress(68);
    
    // Reset celebration flags
    setShowCelebration(false);
    setCelebrationClosed(false);
    setShowCertificateViewer(false);
    
    // Then set progress to 100 after a tiny delay (this triggers the celebration)
    setTimeout(() => {
      setProgress(100);
      console.log('✅ Progress set to 100 - celebration will trigger in 500ms');
    }, 100);
  };

  // Reset celebration for testing
  const handleResetCelebration = () => {
    setProgress(68);
    setShowCelebration(false);
    setCelebrationClosed(false);
    console.log('🔄 Reset complete - you can test again!');
  };

  const handleViewCertificate = (certificateUrl: string) => {
    setShowCelebration(false);
    setCurrentCertificateUrl(certificateUrl);
    setShowCertificateViewer(true);
  };

  const handleContinueLearning = () => {
    setShowCelebration(false);
    onNavigate('explore');
  };

  const handleCloseCelebration = () => {
    console.log('🚪 Modal closed manually');
    setShowCelebration(false);
    setCelebrationClosed(true); // Mark as closed to prevent reopening
  };

  // Download course for offline
  const handleDownloadOffline = async () => {
    setIsDownloading(true);
    setDownloadProgress(0);
    setDownloadStatus('Preparing download...');

    // Generate all video URLs for the course
    const videoUrls: string[] = [];
    CURRICULUM.forEach((section, sectionIdx) => {
      section.lessons.forEach((lesson, lessonIdx) => {
        const videoId = `${courseId}-week${sectionIdx + 1}-lesson${lessonIdx + 1}`;
        // Use the video URL from videoMapping (these are the actual video files)
        const videoUrl = getVideoUrl(videoId);
        videoUrls.push(videoUrl);
      });
    });

    console.log(`📹 Downloading ${videoUrls.length} videos for offline access...`);

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

    const success = await downloadCourseForOffline(
      courseData, 
      videoUrls,
      (progress, status) => {
        setDownloadProgress(progress);
        setDownloadStatus(status);
      }
    );
    
    if (success) {
      setCourseOffline(true);
      await refreshOfflineCourses();
      alert(`✅ Course downloaded successfully! ${videoUrls.length} videos are now available offline.`);
    } else {
      alert('❌ Failed to download course. Please try again.');
    }

    setIsDownloading(false);
    setDownloadProgress(0);
    setDownloadStatus('');
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

  // Reading materials database (demo content related to topics)
  const READING_MATERIALS: { [key: string]: any } = {
    // ========== MACHINE LEARNING MATERIALS ==========
    'Introduction to ML': {
      summary: 'Machine Learning is a subset of artificial intelligence that enables computers to learn and improve from experience without being explicitly programmed. This lesson introduces the fundamental concepts, types of ML (supervised, unsupervised, reinforcement), and real-world applications.',
      keyPoints: [
        'Machine Learning allows computers to learn patterns from data automatically',
        'Supervised learning uses labeled data to train models for prediction tasks',
        'Unsupervised learning finds hidden patterns in unlabeled data',
        'ML is used in recommendation systems, image recognition, and natural language processing'
      ],
      codeExample: `# Simple Linear Regression Example
import numpy as np
from sklearn.linear_model import LinearRegression

# Training data
X = np.array([[1], [2], [3], [4], [5]])
y = np.array([2, 4, 6, 8, 10])

# Create and train model
model = LinearRegression()
model.fit(X, y)

# Make prediction
prediction = model.predict([[6]])
print(f"Prediction: {prediction}")  # Output: 12`,
      additionalResources: [
        'Andrew Ng - Machine Learning Course (Stanford)',
        'Python Machine Learning by Sebastian Raschka',
        'scikit-learn Documentation'
      ]
    },
    'Supervised Learning Overview': {
      summary: 'Supervised learning is the most common type of machine learning where models learn from labeled training data. The algorithm learns a mapping function from input variables to output variables, enabling predictions on new, unseen data.',
      keyPoints: [
        'Requires labeled training data with input-output pairs',
        'Classification predicts discrete categories (spam/not spam)',
        'Regression predicts continuous values (house prices)',
        'Model performance is measured using metrics like accuracy, precision, and recall'
      ],
      codeExample: `# Classification Example
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier

# Load dataset
iris = load_iris()
X_train, X_test, y_train, y_test = train_test_split(
    iris.data, iris.target, test_size=0.2
)

# Train classifier
clf = DecisionTreeClassifier()
clf.fit(X_train, y_train)

# Evaluate
accuracy = clf.score(X_test, y_test)
print(f"Accuracy: {accuracy:.2f}")`,
      additionalResources: [
        'Hands-On Machine Learning with Scikit-Learn',
        'Pattern Recognition and Machine Learning by Bishop',
        'Kaggle - Supervised Learning Competitions'
      ]
    },
    'Linear Regression': {
      summary: 'Linear Regression is a fundamental supervised learning algorithm that models the relationship between a dependent variable and one or more independent variables using a linear equation. It\'s widely used for prediction and forecasting.',
      keyPoints: [
        'Models relationship as y = mx + b (simple) or y = b0 + b1x1 + b2x2 + ... (multiple)',
        'Uses least squares method to minimize prediction errors',
        'Assumes linear relationship between variables',
        'Sensitive to outliers and requires feature scaling'
      ],
      codeExample: `# Multiple Linear Regression
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score

# Sample data - house prices
data = {
    'size': [1400, 1600, 1700, 1875, 1100],
    'bedrooms': [3, 3, 2, 4, 2],
    'age': [10, 15, 12, 8, 20],
    'price': [245000, 312000, 279000, 308000, 199000]
}
df = pd.DataFrame(data)

# Features and target
X = df[['size', 'bedrooms', 'age']]
y = df['price']

# Train model
model = LinearRegression()
model.fit(X, y)

# Model performance
r2 = r2_score(y, model.predict(X))
print(f"R² Score: {r2:.3f}")
print(f"Coefficients: {model.coef_}")`,
      additionalResources: [
        'Introduction to Statistical Learning',
        'Linear Regression Analysis by Seber',
        'statsmodels Python Library Documentation'
      ]
    },
    'Gradient Descent': {
      summary: 'Gradient Descent is an optimization algorithm used to minimize the cost function in machine learning models. It iteratively adjusts model parameters in the direction of steepest descent to find the optimal values that minimize prediction errors.',
      keyPoints: [
        'Iteratively updates parameters to minimize cost function',
        'Learning rate controls step size (too small = slow, too large = unstable)',
        'Batch GD uses all data, SGD uses one sample, Mini-batch GD uses subset',
        'Converges when gradient approaches zero (local/global minimum)'
      ],
      codeExample: `# Gradient Descent from Scratch
import numpy as np

def gradient_descent(X, y, learning_rate=0.01, iterations=1000):
    m, n = X.shape
    theta = np.zeros(n)  # Initialize parameters
    
    for i in range(iterations):
        # Predictions
        predictions = X.dot(theta)
        
        # Calculate gradient
        errors = predictions - y
        gradient = (1/m) * X.T.dot(errors)
        
        # Update parameters
        theta = theta - learning_rate * gradient
        
        # Calculate cost
        if i % 100 == 0:
            cost = (1/(2*m)) * np.sum(errors**2)
            print(f"Iteration {i}: Cost = {cost:.4f}")
    
    return theta

# Example usage
X = np.array([[1, 1], [1, 2], [1, 3]])  # with bias term
y = np.array([1, 2, 3])
theta = gradient_descent(X, y)`,
      additionalResources: [
        'Deep Learning by Goodfellow, Bengio, and Courville',
        'Optimization for Machine Learning by Sra',
        'PyTorch/TensorFlow Optimizer Documentation'
      ]
    },
    'Perceptrons': {
      summary: 'The Perceptron is the simplest type of artificial neural network, consisting of a single neuron that makes binary classifications. It\'s the building block for understanding modern deep learning architectures.',
      keyPoints: [
        'Binary linear classifier that outputs 0 or 1',
        'Uses activation function (step function) to make decisions',
        'Can only solve linearly separable problems',
        'Foundation for multi-layer neural networks'
      ],
      codeExample: `# Simple Perceptron Implementation
import numpy as np

class Perceptron:
    def __init__(self, learning_rate=0.01, epochs=100):
        self.lr = learning_rate
        self.epochs = epochs
        self.weights = None
        self.bias = None
    
    def activation(self, z):
        return 1 if z >= 0 else 0
    
    def fit(self, X, y):
        n_features = X.shape[1]
        self.weights = np.zeros(n_features)
        self.bias = 0
        
        for _ in range(self.epochs):
            for idx, x_i in enumerate(X):
                linear_output = np.dot(x_i, self.weights) + self.bias
                y_pred = self.activation(linear_output)
                
                # Update weights
                update = self.lr * (y[idx] - y_pred)
                self.weights += update * x_i
                self.bias += update
    
    def predict(self, X):
        return [self.activation(np.dot(x, self.weights) + self.bias) 
                for x in X]`,
      additionalResources: [
        'Neural Networks and Deep Learning by Michael Nielsen',
        'Perceptron - Original Paper by Rosenblatt (1958)',
        'Deep Learning Specialization by Andrew Ng'
      ]
    },
    // ========== DIGITAL MARKETING MATERIALS ==========
    'Digital Marketing Overview': {
      summary: 'Digital marketing encompasses all marketing efforts that use the internet or electronic devices. It includes multiple channels like search engines, social media, email, and websites to connect with current and prospective customers. Understanding the digital landscape is crucial for modern businesses.',
      keyPoints: [
        'Digital marketing reaches customers where they spend time online',
        'Cost-effective compared to traditional marketing with better ROI tracking',
        'Includes SEO, content marketing, social media, email, and paid advertising',
        'Data-driven approach allows for precise targeting and optimization'
      ],
      codeExample: `<!-- Example: Google Analytics Tracking Code -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
  
  // Track custom events
  gtag('event', 'button_click', {
    'event_category': 'engagement',
    'event_label': 'signup_button'
  });
</script>`,
      additionalResources: [
        'Google Digital Garage - Free Digital Marketing Course',
        'HubSpot Academy - Inbound Marketing Certification',
        'Neil Patel Blog - Digital Marketing Tips'
      ]
    },
    'SEO Fundamentals': {
      summary: 'Search Engine Optimization (SEO) is the practice of increasing the quantity and quality of traffic to your website through organic search engine results. It involves optimizing content, technical setup, and building authority to rank higher in search results.',
      keyPoints: [
        'On-page SEO: optimize content, titles, meta descriptions, headers, and URLs',
        'Off-page SEO: build quality backlinks and domain authority',
        'Technical SEO: improve site speed, mobile-friendliness, and crawlability',
        'Focus on user intent and create valuable, relevant content'
      ],
      codeExample: `<!-- SEO-Optimized HTML Example -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Best Coffee Makers 2024 | Complete Buying Guide</title>
  <meta name="description" content="Find the perfect coffee maker for your home. Expert reviews, comparisons, and buying tips for drip, espresso, and single-serve machines.">
  <meta name="keywords" content="coffee maker, best coffee maker, espresso machine, drip coffee">
  <link rel="canonical" href="https://example.com/coffee-makers">
  
  <!-- Open Graph for social sharing -->
  <meta property="og:title" content="Best Coffee Makers 2024">
  <meta property="og:description" content="Expert coffee maker reviews and buying guide">
  <meta property="og:image" content="https://example.com/coffee-makers.jpg">
</head>
<body>
  <h1>Best Coffee Makers of 2024</h1>
  <h2>Top Picks for Every Budget</h2>
  <!-- Quality content goes here -->
</body>
</html>`,
      additionalResources: [
        'Moz Beginner\'s Guide to SEO',
        'Google Search Central Documentation',
        'Ahrefs SEO Blog and Tools'
      ]
    },
    'Content Strategy': {
      summary: 'Content strategy involves planning, creating, and managing valuable content that attracts and engages your target audience. A strong content strategy aligns with business goals, addresses audience needs, and supports the customer journey from awareness to conversion.',
      keyPoints: [
        'Define clear goals: brand awareness, lead generation, or customer retention',
        'Research your audience: understand their pain points, questions, and interests',
        'Create a content calendar to maintain consistency',
        'Use various formats: blog posts, videos, infographics, podcasts, and ebooks'
      ],
      codeExample: `// Content Calendar Planning Template (JSON)
{
  "contentCalendar": {
    "month": "January 2024",
    "themes": ["New Year Productivity", "Goal Setting"],
    "posts": [
      {
        "date": "2024-01-05",
        "title": "10 Productivity Tools to Start Your Year Right",
        "format": "blog post",
        "keywords": ["productivity tools", "workflow"],
        "cta": "Download free productivity checklist",
        "channels": ["blog", "linkedin", "twitter"]
      },
      {
        "date": "2024-01-12",
        "title": "How to Set SMART Goals for 2024",
        "format": "video + blog",
        "keywords": ["goal setting", "SMART goals"],
        "cta": "Get goal-setting template",
        "channels": ["youtube", "blog", "email"]
      }
    ]
  }
}`,
      additionalResources: [
        'Content Marketing Institute Resources',
        'HubSpot Content Strategy Guide',
        'CoSchedule Headline Analyzer Tool'
      ]
    },
    'Social Media Strategy': {
      summary: 'An effective social media strategy defines how you\'ll use social platforms to achieve marketing goals. It includes audience research, platform selection, content planning, community management, and performance measurement to build brand awareness and drive engagement.',
      keyPoints: [
        'Choose platforms where your target audience is most active',
        'Create platform-specific content (Instagram: visuals, LinkedIn: professional, TikTok: short videos)',
        'Post consistently and engage authentically with your community',
        'Use analytics to track performance and optimize strategy'
      ],
      codeExample: `// Social Media Posting Schedule Example
const socialMediaSchedule = {
  monday: {
    instagram: {
      time: "09:00 AM",
      type: "carousel",
      topic: "Monday Motivation - Productivity Tips"
    },
    linkedin: {
      time: "12:00 PM",
      type: "article share",
      topic: "Industry Insights"
    }
  },
  wednesday: {
    instagram: {
      time: "06:00 PM",
      type: "reel",
      topic: "Behind-the-scenes"
    },
    twitter: {
      time: "10:00 AM",
      type: "thread",
      topic: "Quick tips"
    }
  },
  friday: {
    instagram: {
      time: "05:00 PM",
      type: "story + post",
      topic: "User-generated content"
    },
    linkedin: {
      time: "09:00 AM",
      type: "poll",
      topic: "Weekend question"
    }
  }
};`,
      additionalResources: [
        'Hootsuite Social Media Marketing Courses',
        'Buffer Social Media Strategy Guide',
        'Sprout Social Industry Benchmarks'
      ]
    },
    'Google Analytics': {
      summary: 'Google Analytics is a powerful web analytics tool that tracks and reports website traffic. It provides insights into user behavior, traffic sources, conversion rates, and more, enabling data-driven marketing decisions and website optimization.',
      keyPoints: [
        'Track key metrics: users, sessions, bounce rate, conversion rate, and goal completions',
        'Understand traffic sources: organic, direct, referral, social, and paid',
        'Set up goals and events to measure specific actions',
        'Use segments and filters to analyze specific user groups'
      ],
      codeExample: `// Google Analytics 4 Event Tracking Example
// Track custom events
gtag('event', 'purchase', {
  transaction_id: 'T12345',
  value: 99.99,
  currency: 'USD',
  items: [
    {
      item_id: 'SKU_12345',
      item_name: 'Premium Plan',
      price: 99.99,
      quantity: 1
    }
  ]
});

// Track user engagement
gtag('event', 'video_watched', {
  video_title: 'Product Demo',
  video_duration: 120,
  watch_percentage: 75
});

// Track outbound link clicks
document.querySelectorAll('a[href^="http"]').forEach(link => {
  link.addEventListener('click', (e) => {
    gtag('event', 'click', {
      event_category: 'outbound',
      event_label: e.target.href
    });
  });
});`,
      additionalResources: [
        'Google Analytics Academy - Free Courses',
        'GA4 Migration Guide',
        'Analytics Mania - Advanced GA4 Tutorials'
      ]
    },
    // ========== BUSINESS STRATEGY MATERIALS ==========
    'Business Strategy Overview': {
      summary: 'Business strategy defines how an organization achieves its objectives and creates competitive advantage in the marketplace. It involves analyzing the competitive environment, identifying opportunities, and making decisions about resource allocation to achieve long-term success.',
      keyPoints: [
        'Strategy aligns business goals with market opportunities and organizational capabilities',
        'Competitive advantage comes from doing things differently or better than competitors',
        'Strategic planning requires analysis of internal strengths/weaknesses and external opportunities/threats',
        'Successful strategies are clear, actionable, and adaptable to market changes'
      ],
      codeExample: `// SWOT Analysis Framework
const swotAnalysis = {
  internal: {
    strengths: [
      'Strong brand reputation',
      'Proprietary technology',
      'Experienced leadership team',
      'Efficient operations'
    ],
    weaknesses: [
      'Limited market presence',
      'High operational costs',
      'Dependence on key suppliers',
      'Outdated IT infrastructure'
    ]
  },
  external: {
    opportunities: [
      'Growing market demand',
      'Emerging technologies',
      'Strategic partnerships',
      'International expansion'
    ],
    threats: [
      'Intense competition',
      'Regulatory changes',
      'Economic downturn',
      'Technological disruption'
    ]
  }
};

// Strategy Formulation
function formulateStrategy(swot) {
  return {
    SO_strategies: 'Leverage strengths to capitalize on opportunities',
    WO_strategies: 'Overcome weaknesses to pursue opportunities',
    ST_strategies: 'Use strengths to avoid threats',
    WT_strategies: 'Minimize weaknesses and avoid threats'
  };
}`,
      additionalResources: [
        'Michael Porter - Competitive Strategy',
        'Harvard Business Review - Strategy Articles',
        'Blue Ocean Strategy by Kim & Mauborgne'
      ]
    },
    'Competitive Advantage': {
      summary: 'Competitive advantage is what makes a business superior to its rivals in the eyes of customers. It can be achieved through cost leadership (offering lower prices), differentiation (offering unique value), or focus (serving a specific niche better than anyone else).',
      keyPoints: [
        'Cost leadership: be the lowest-cost producer in your industry',
        'Differentiation: offer unique products or services that customers value',
        'Focus strategy: serve a specific market segment exceptionally well',
        'Sustainable advantage requires continuous innovation and adaptation'
      ],
      codeExample: `// Porter's Five Forces Analysis
const competitiveForces = {
  industryRivalry: {
    intensity: 'high',
    factors: ['many competitors', 'slow growth', 'high exit barriers']
  },
  threatOfNewEntrants: {
    intensity: 'medium',
    barriers: ['capital requirements', 'brand loyalty', 'regulations']
  },
  bargainingPowerOfSuppliers: {
    intensity: 'low',
    factors: ['many suppliers', 'standard inputs', 'low switching costs']
  },
  bargainingPowerOfBuyers: {
    intensity: 'high',
    factors: ['price sensitive', 'many alternatives', 'low switching costs']
  },
  threatOfSubstitutes: {
    intensity: 'medium',
    factors: ['alternative solutions', 'relative price-performance']
  }
};

// Calculate overall industry attractiveness
function assessIndustry(forces) {
  const score = Object.values(forces).reduce((sum, force) => {
    return sum + (force.intensity === 'high' ? -2 : 
                  force.intensity === 'medium' ? -1 : 0);
  }, 10);
  
  return score > 5 ? 'Attractive' : 'Unattractive';
}`,
      additionalResources: [
        'Porter\'s Five Forces Framework',
        'Competitive Advantage by Michael Porter',
        'Strategic Management Journal'
      ]
    },
    'SWOT Analysis': {
      summary: 'SWOT Analysis is a strategic planning tool that helps organizations identify their Strengths, Weaknesses, Opportunities, and Threats. It provides a structured approach to evaluate internal capabilities and external factors affecting business performance.',
      keyPoints: [
        'Strengths: internal attributes that give you an advantage',
        'Weaknesses: internal limitations that place you at a disadvantage',
        'Opportunities: external factors you can exploit for growth',
        'Threats: external challenges that could cause problems'
      ],
      codeExample: `// SWOT to Strategy Matrix
const swotMatrix = {
  companyName: 'TechStart Inc.',
  swot: {
    strengths: ['Innovative product', 'Strong tech team', 'Agile culture'],
    weaknesses: ['Limited funding', 'Small market share', 'No sales team'],
    opportunities: ['Market growth', 'Strategic partnerships', 'Remote work trend'],
    threats: ['Big competitors', 'Economic uncertainty', 'Talent shortage']
  },
  strategies: {
    SO: [
      'Use innovative product to capture growing market (S1 + O1)',
      'Leverage tech team to form partnerships (S2 + O2)'
    ],
    WO: [
      'Raise funding to hire sales team for market growth (W1 + O1)',
      'Partner with established firms to gain market share (W2 + O2)'
    ],
    ST: [
      'Differentiate with innovation against big competitors (S1 + T1)',
      'Build strong culture to retain talent (S3 + T3)'
    ],
    WT: [
      'Focus on niche market to avoid direct competition (W2 + T1)',
      'Bootstrap growth to survive economic uncertainty (W1 + T2)'
    ]
  }
};`,
      additionalResources: [
        'SWOT Analysis Template (HBS)',
        'Strategic Planning Tools & Techniques',
        'Business Model Canvas by Osterwalder'
      ]
    },
    'Market Research': {
      summary: 'Market research is the systematic gathering, recording, and analysis of data about customers, competitors, and the market. It helps businesses understand customer needs, identify opportunities, validate ideas, and make informed decisions.',
      keyPoints: [
        'Primary research: collect new data through surveys, interviews, observations',
        'Secondary research: analyze existing data from reports, studies, databases',
        'Quantitative research: measure market size, trends, customer preferences with numbers',
        'Qualitative research: understand motivations, opinions, behaviors through discussions'
      ],
      codeExample: `// Market Research Survey Design
const surveyDesign = {
  objective: 'Understand customer satisfaction with our mobile app',
  targetAudience: {
    size: 1000,
    demographics: { age: '25-45', income: '50K+', tech_savvy: true }
  },
  questions: [
    {
      id: 1,
      type: 'scale',
      question: 'How satisfied are you with our app?',
      scale: '1-10',
      category: 'overall_satisfaction'
    },
    {
      id: 2,
      type: 'multiple_choice',
      question: 'What feature do you use most?',
      options: ['Dashboard', 'Reports', 'Settings', 'Analytics'],
      category: 'feature_usage'
    },
    {
      id: 3,
      type: 'open_ended',
      question: 'What improvements would you suggest?',
      category: 'feedback'
    }
  ],
  analysis: {
    nps_score: 'Calculate promoters - detractors',
    sentiment_analysis: 'Analyze open-ended responses',
    segmentation: 'Group responses by demographics'
  }
};`,
      additionalResources: [
        'Pew Research Center Methodology',
        'SurveyMonkey Best Practices',
        'Market Research Society Guidelines'
      ]
    },
    'Value Proposition': {
      summary: 'A value proposition is a clear statement that explains how your product solves customers\' problems, delivers specific benefits, and tells the customer why they should buy from you instead of competitors. It\'s the #1 thing that determines whether people will engage with your company.',
      keyPoints: [
        'Answer: What do you do? Who do you do it for? Why should they care?',
        'Focus on customer benefits, not features',
        'Be specific and quantifiable when possible',
        'Differentiate from competitors clearly'
      ],
      codeExample: `// Value Proposition Canvas
const valueProposition = {
  customer: {
    jobs: [
      'Manage team projects efficiently',
      'Track progress in real-time',
      'Collaborate with remote team'
    ],
    pains: [
      'Too many tools to manage',
      'Lack of visibility into work',
      'Difficult to coordinate across time zones'
    ],
    gains: [
      'Save time on status meetings',
      'Better team alignment',
      'Increased productivity'
    ]
  },
  product: {
    products_services: [
      'All-in-one project management platform',
      'Real-time collaboration tools',
      'Automated reporting'
    ],
    pain_relievers: [
      'Single platform replaces 5 tools',
      'Live dashboard shows all work',
      'Async communication features'
    ],
    gain_creators: [
      'Reduce meetings by 50%',
      'Improve on-time delivery by 30%',
      'Increase team productivity by 25%'
    ]
  },
  statement: 'Help remote teams deliver projects 30% faster by replacing multiple tools with one intuitive platform that provides real-time visibility and seamless collaboration.'
};`,
      additionalResources: [
        'Value Proposition Design by Osterwalder',
        'Strategyzer Value Proposition Canvas',
        'Jobs to Be Done Framework'
      ]
    },
    // ========== UI/UX DESIGN MATERIALS ==========
    'Design Principles': {
      summary: 'Design principles are fundamental guidelines that help designers create effective, beautiful, and user-friendly interfaces. Key principles include contrast, alignment, hierarchy, balance, proximity, and consistency. These principles ensure designs are both aesthetically pleasing and functionally effective.',
      keyPoints: [
        'Contrast: make important elements stand out using color, size, or weight',
        'Alignment: create visual connections and order in your designs',
        'Hierarchy: guide users\' attention to the most important information first',
        'Consistency: maintain patterns across your interface for predictability'
      ],
      codeExample: `/* CSS Design Principles in Action */

/* Hierarchy with typography scale */
h1 { font-size: 48px; font-weight: 800; line-height: 1.2; }
h2 { font-size: 32px; font-weight: 700; line-height: 1.3; }
h3 { font-size: 24px; font-weight: 600; line-height: 1.4; }
body { font-size: 16px; font-weight: 400; line-height: 1.6; }

/* Contrast for call-to-action */
.btn-primary {
  background: #D7FF54;
  color: #111;
  font-weight: 700;
  padding: 16px 32px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(215, 255, 84, 0.3);
}

/* Proximity grouping related elements */
.card {
  display: flex;
  flex-direction: column;
  gap: 8px; /* tight spacing within card */
  padding: 24px;
  margin-bottom: 24px; /* looser spacing between cards */
}

/* Consistency in spacing system */
:root {
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 48px;
}`,
      additionalResources: [
        'The Design of Everyday Things by Don Norman',
        'Refactoring UI by Adam Wathan & Steve Schoger',
        'Laws of UX by Jon Yablonski'
      ]
    },
    'Color Theory': {
      summary: 'Color theory is the science of how colors interact and the visual effects of color combinations. Understanding color psychology, harmony, and contrast is essential for creating effective user interfaces that evoke the right emotions and guide user behavior.',
      keyPoints: [
        '60-30-10 rule: 60% dominant, 30% secondary, 10% accent color',
        'Use color psychology: blue = trust, green = growth, red = urgency',
        'Ensure sufficient contrast (WCAG AAA: 7:1, AA: 4.5:1) for accessibility',
        'Complementary colors create vibrant designs, analogous colors create harmony'
      ],
      codeExample: `/* Color System Design */

:root {
  /* Primary palette */
  --primary-50: #F5F3FF;
  --primary-100: #EDE9FF;
  --primary-500: #A98BFF;
  --primary-900: #4C1D95;
  
  /* Semantic colors */
  --success: #10B981;
  --warning: #F59E0B;
  --error: #EF4444;
  --info: #3B82F6;
  
  /* Neutral scale */
  --gray-50: #F9FAFB;
  --gray-100: #F3F4F6;
  --gray-500: #6B7280;
  --gray-900: #111827;
}

/* Accessible color contrast */
.btn-accessible {
  background: var(--primary-500);
  color: var(--gray-900); /* 7.2:1 contrast ratio */
  
  &:hover {
    background: var(--primary-900);
    color: white; /* 8.1:1 contrast ratio */
  }
}

/* Color harmony: Complementary */
.hero {
  background: linear-gradient(135deg, 
    #A98BFF 0%,  /* purple */
    #FF8B5B 100% /* orange - complementary */
  );
}`,
      additionalResources: [
        'Color Theory for Designers by Adobe',
        'Refactoring UI - Color Palettes',
        'Coolors.co - Color Palette Generator'
      ]
    },
    'Figma Basics': {
      summary: 'Figma is a collaborative interface design tool that runs in the browser. It enables designers to create, prototype, and collaborate in real-time. Key features include frames, components, auto-layout, constraints, and powerful prototyping capabilities.',
      keyPoints: [
        'Frames are containers for your designs (like artboards in other tools)',
        'Components are reusable design elements with variants and properties',
        'Auto Layout automatically adjusts spacing and sizing based on content',
        'Constraints control how elements resize and position within frames'
      ],
      codeExample: `// Figma Plugin API Example - Create Design Tokens

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'export-tokens') {
    const localStyles = figma.getLocalPaintStyles();
    
    const tokens = {
      colors: {}
    };
    
    // Export color styles as design tokens
    localStyles.forEach(style => {
      const paint = style.paints[0];
      if (paint.type === 'SOLID') {
        const rgb = paint.color;
        tokens.colors[style.name] = {
          value: rgbToHex(rgb),
          type: 'color'
        };
      }
    });
    
    // Send to UI
    figma.ui.postMessage({
      type: 'tokens-exported',
      tokens: JSON.stringify(tokens, null, 2)
    });
  }
};

function rgbToHex(rgb) {
  const r = Math.round(rgb.r * 255).toString(16).padStart(2, '0');
  const g = Math.round(rgb.g * 255).toString(16).padStart(2, '0');
  const b = Math.round(rgb.b * 255).toString(16).padStart(2, '0');
  return '#' + r + g + b;
}`,
      additionalResources: [
        'Figma Official Tutorial Series',
        'Figma Community - Free Resources',
        'Config - Figma\'s Annual Conference'
      ]
    },
    // ========== WEB DEVELOPMENT MATERIALS ==========
    'HTML5 & CSS3': {
      summary: 'HTML5 and CSS3 are the foundation of modern web development. HTML5 provides semantic elements, multimedia support, and improved forms. CSS3 offers advanced styling with flexbox, grid, animations, transitions, and responsive design capabilities.',
      keyPoints: [
        'Use semantic HTML: <header>, <nav>, <main>, <article>, <section>, <footer>',
        'CSS Grid for 2D layouts, Flexbox for 1D layouts',
        'CSS Custom Properties (variables) for maintainable styles',
        'Mobile-first responsive design with media queries'
      ],
      codeExample: `<!-- Modern HTML5 Structure -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Modern Web App</title>
  <style>
    /* CSS Custom Properties */
    :root {
      --primary: #D7FF54;
      --text: #0F0F0F;
      --spacing: 1rem;
    }
    
    /* CSS Grid Layout */
    .container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: var(--spacing);
      padding: var(--spacing);
    }
    
    /* Flexbox for card layout */
    .card {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 2rem;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
      .container {
        grid-template-columns: 1fr;
      }
    }
  </style>
</head>
<body>
  <main class="container">
    <article class="card">
      <h2>Card Title</h2>
      <p>Card content goes here</p>
    </article>
  </main>
</body>
</html>`,
      additionalResources: [
        'MDN Web Docs - HTML & CSS Guide',
        'CSS Tricks - Complete Guide to Grid/Flexbox',
        'Web.dev - Learn Responsive Design'
      ]
    },
    'React Components': {
      summary: 'React components are reusable, self-contained pieces of UI. Functional components with hooks are the modern standard. Components receive data through props, manage internal state with useState, and handle side effects with useEffect.',
      keyPoints: [
        'Components are JavaScript functions that return JSX',
        'Props pass data from parent to child (immutable)',
        'State manages dynamic data within a component (mutable)',
        'Use composition over inheritance for code reuse'
      ],
      codeExample: `// Modern React Component with Hooks
import { useState, useEffect } from 'react';

interface Course {
  id: string;
  title: string;
  enrolled: boolean;
}

interface CourseCardProps {
  course: Course;
  onEnroll: (id: string) => void;
}

export default function CourseCard({ course, onEnroll }: CourseCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Side effect: log when enrolled status changes
  useEffect(() => {
    if (course.enrolled) {
      console.log(\`Enrolled in: \${course.title}\`);
    }
  }, [course.enrolled, course.title]);
  
  return (
    <div 
      className={\`card \${isHovered ? 'hovered' : ''}\`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3>{course.title}</h3>
      <button 
        onClick={() => onEnroll(course.id)}
        disabled={course.enrolled}
      >
        {course.enrolled ? 'Enrolled' : 'Enroll Now'}
      </button>
    </div>
  );
}`,
      additionalResources: [
        'React Official Documentation',
        'React Hooks Guide',
        'Thinking in React (Official Guide)'
      ]
    },
    'Node.js & Express': {
      summary: 'Node.js enables JavaScript to run on the server. Express is a minimal web framework for Node.js that simplifies building APIs and web applications. Together they power modern backend development with JavaScript.',
      keyPoints: [
        'Express provides routing, middleware, and HTTP utilities',
        'Middleware functions have access to request, response, and next()',
        'RESTful APIs use HTTP methods: GET, POST, PUT, DELETE',
        'Environment variables store sensitive configuration'
      ],
      codeExample: `// Express REST API Example
import express from 'express';
import cors from 'cors';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database
const courses = [
  { id: '1', title: 'ML Specialization', enrolled: 150000 }
];

// Routes
app.get('/api/courses', (req, res) => {
  res.json({ success: true, data: courses });
});

app.get('/api/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === req.params.id);
  
  if (!course) {
    return res.status(404).json({ 
      success: false, 
      message: 'Course not found' 
    });
  }
  
  res.json({ success: true, data: course });
});

app.post('/api/courses', (req, res) => {
  const newCourse = {
    id: Date.now().toString(),
    ...req.body
  };
  
  courses.push(newCourse);
  res.status(201).json({ success: true, data: newCourse });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});`,
      additionalResources: [
        'Express.js Official Guide',
        'Node.js Best Practices by Goldbergyoni',
        'REST API Design Best Practices'
      ]
    },
    // ========== iOS DEVELOPMENT MATERIALS ==========
    'Swift Syntax': {
      summary: 'Swift is Apple\'s modern programming language for iOS, macOS, watchOS, and tvOS. It\'s designed to be safe, fast, and expressive. Key features include type safety, optionals, closures, protocols, and powerful error handling.',
      keyPoints: [
        'Type inference makes code cleaner while maintaining type safety',
        'Optionals represent values that might be absent (nil)',
        'Value types (struct, enum) are preferred over reference types (class)',
        'Protocol-oriented programming promotes flexible, reusable code'
      ],
      codeExample: `// Swift Fundamentals

// Structs (value types)
struct Course {
    let id: String
    let title: String
    var enrolled: Bool
    
    // Computed property
    var status: String {
        enrolled ? "Enrolled" : "Available"
    }
    
    // Method
    mutating func toggleEnrollment() {
        enrolled.toggle()
    }
}

// Optionals
func getCourse(byId id: String) -> Course? {
    // Might return nil if not found
    return courses.first { $0.id == id }
}

// Optional binding
if let course = getCourse(byId: "ml-101") {
    print("Found: \\(course.title)")
} else {
    print("Course not found")
}

// Protocol-oriented design
protocol Enrollable {
    var enrolled: Bool { get set }
    mutating func enroll()
}

extension Course: Enrollable {
    mutating func enroll() {
        enrolled = true
    }
}

// Closures
let enrolledCourses = courses.filter { $0.enrolled }
let titles = courses.map { $0.title }`,
      additionalResources: [
        'Swift Programming Language (Apple)',
        'Swift by Sundell',
        'Hacking with Swift - 100 Days of Swift'
      ]
    },
    'SwiftUI': {
      summary: 'SwiftUI is Apple\'s declarative framework for building user interfaces across all Apple platforms. Instead of imperatively describing how to update the UI, you declare what the UI should look like for any given state, and SwiftUI handles the rest.',
      keyPoints: [
        'Views are structs that conform to the View protocol',
        '@State manages view-local state, @Binding passes state between views',
        'View modifiers customize appearance and behavior',
        'Combine framework integrates seamlessly for reactive programming'
      ],
      codeExample: `// SwiftUI Course List App
import SwiftUI

struct Course: Identifiable {
    let id = UUID()
    let title: String
    let instructor: String
    var enrolled: Bool
}

struct ContentView: View {
    @State private var courses = [
        Course(title: "ML Specialization", instructor: "Andrew Ng", enrolled: true),
        Course(title: "iOS Development", instructor: "Emma Rodriguez", enrolled: false)
    ]
    
    @State private var searchText = ""
    
    var filteredCourses: [Course] {
        if searchText.isEmpty {
            return courses
        }
        return courses.filter { $0.title.localizedCaseInsensitiveContains(searchText) }
    }
    
    var body: some View {
        NavigationView {
            List(filteredCourses) { course in
                CourseRow(course: course)
            }
            .searchable(text: $searchText)
            .navigationTitle("My Courses")
        }
    }
}

struct CourseRow: View {
    let course: Course
    
    var body: some View {
        HStack {
            VStack(alignment: .leading) {
                Text(course.title)
                    .font(.headline)
                Text(course.instructor)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            if course.enrolled {
                Image(systemName: "checkmark.circle.fill")
                    .foregroundColor(.green)
            }
        }
        .padding(.vertical, 8)
    }
}`,
      additionalResources: [
        'SwiftUI by Apple - Official Tutorials',
        'SwiftUI Lab - Advanced Techniques',
        'Paul Hudson - SwiftUI by Example'
      ]
    },
    // ========== AWS CLOUD MATERIALS ==========
    'AWS Overview': {
      summary: 'Amazon Web Services (AWS) is the world\'s leading cloud platform, offering over 200 services including compute, storage, databases, networking, and machine learning. Understanding AWS fundamentals is essential for building scalable, reliable cloud applications.',
      keyPoints: [
        'Regions and Availability Zones provide global infrastructure and high availability',
        'Shared Responsibility Model: AWS secures the cloud, you secure in the cloud',
        'Pay-as-you-go pricing eliminates upfront infrastructure costs',
        'Well-Architected Framework guides building secure, resilient, efficient systems'
      ],
      codeExample: `// AWS SDK for JavaScript - S3 Upload Example
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Initialize S3 client
const s3Client = new S3Client({ 
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

// Upload file to S3
async function uploadToS3(file) {
  const params = {
    Bucket: "my-course-materials",
    Key: \`uploads/\${Date.now()}-\${file.name}\`,
    Body: file,
    ContentType: file.type,
    ServerSideEncryption: "AES256"
  };
  
  try {
    const command = new PutObjectCommand(params);
    const response = await s3Client.send(command);
    
    console.log("Upload successful:", response);
    return {
      success: true,
      url: \`https://\${params.Bucket}.s3.amazonaws.com/\${params.Key}\`
    };
  } catch (error) {
    console.error("Upload failed:", error);
    return { success: false, error: error.message };
  }
}`,
      additionalResources: [
        'AWS Getting Started Resource Center',
        'AWS Well-Architected Framework',
        'AWS Cloud Practitioner Essentials'
      ]
    },
    'EC2 Instances': {
      summary: 'Amazon EC2 (Elastic Compute Cloud) provides scalable virtual servers in the cloud. You can launch instances with different configurations, scale capacity up or down, and pay only for what you use. EC2 is fundamental for hosting applications on AWS.',
      keyPoints: [
        'Instance types optimized for compute, memory, storage, or GPU workloads',
        'Auto Scaling automatically adjusts capacity based on demand',
        'Security Groups act as virtual firewalls for your instances',
        'User Data scripts automate instance configuration at launch'
      ],
      codeExample: `// AWS CloudFormation - EC2 Instance Template
AWSTemplateFormatVersion: '2010-09-09'
Description: 'Web Server EC2 Instance'

Parameters:
  InstanceType:
    Type: String
    Default: t3.micro
    AllowedValues: [t3.micro, t3.small, t3.medium]
    Description: EC2 instance type

Resources:
  WebServerInstance:
    Type: AWS::EC2::Instance
    Properties:
      InstanceType: !Ref InstanceType
      ImageId: ami-0c55b159cbfafe1f0  # Amazon Linux 2
      SecurityGroups:
        - !Ref WebServerSecurityGroup
      UserData:
        Fn::Base64: !Sub |
          #!/bin/bash
          yum update -y
          yum install -y httpd
          systemctl start httpd
          systemctl enable httpd
          echo "<h1>Hello from EC2</h1>" > /var/www/html/index.html
      Tags:
        - Key: Name
          Value: WebServer
  
  WebServerSecurityGroup:
    Type: AWS::EC2::SecurityGroup
    Properties:
      GroupDescription: Allow HTTP and SSH
      SecurityGroupIngress:
        - IpProtocol: tcp
          FromPort: 80
          ToPort: 80
          CidrIp: 0.0.0.0/0
        - IpProtocol: tcp
          FromPort: 22
          ToPort: 22
          CidrIp: 0.0.0.0/0

Outputs:
  PublicIP:
    Description: Public IP of the instance
    Value: !GetAtt WebServerInstance.PublicIp`,
      additionalResources: [
        'AWS EC2 User Guide',
        'EC2 Instance Types Explained',
        'AWS Solutions Library - EC2 Best Practices'
      ]
    },
  };

  // Fallback reading material generator for lessons without specific content
  const generateFallbackMaterial = (lessonTitle: string, courseData: any) => {
    return {
      summary: `This lesson covers ${lessonTitle}, an important topic in ${courseData.title}. You'll learn key concepts and practical applications that are essential for mastering this subject area.`,
      keyPoints: [
        `Understand the fundamentals of ${lessonTitle}`,
        `Learn practical applications and real-world examples`,
        `Master techniques used by industry professionals`,
        `Build hands-on skills through exercises and projects`
      ],
      codeExample: `// Example code for ${lessonTitle}
// This is a sample demonstration

function example() {
  console.log("Practice and apply what you learn");
  console.log("Refer to course materials for detailed examples");
}

example();`,
      additionalResources: [
        `${courseData.title} - Official Documentation`,
        `${courseData.provider} Learning Resources`,
        `Industry Best Practices for ${lessonTitle}`
      ]
    };
  };

  // Get reading material with fallback
  const getReadingMaterial = (lessonTitle: string) => {
    return READING_MATERIALS[lessonTitle] || generateFallbackMaterial(lessonTitle, courseData);
  };

  // Open video modal
  const handleOpenVideo = (videoId: string, videoTitle: string, lessonTitle?: string) => {
    setCurrentVideo({
      id: videoId,
      title: videoTitle,
      url: '', // Leave empty - VideoPlayer will map based on courseId
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

  // Scroll to curriculum section
  const scrollToCurriculum = () => {
    // Set active tab to Curriculum first
    setActiveTab('Curriculum');
    // Wait for tab to render, then scroll
    setTimeout(() => {
      const element = document.getElementById('curriculum-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const tabs = ['About', 'Curriculum', 'Projects', 'Reviews', 'Certificate'];

  return (
    <div className="flex-1 py-4 px-4 md:pr-4 md:pl-2 overflow-y-auto no-scrollbar space-y-5 animate-in">

      {/* Notification Permission Banner */}
      <NotificationPermissionBanner onEnableClick={() => setShowReminderModal(true)} />

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

      {/* Offline Mode Info */}
      {!isOnline && courseOffline && (
        <div className="p-5 rounded-3xl" style={{ background: '#E0F5FF', border: '2px solid #0EA5E9' }}>
          <div className="flex items-start gap-3">
            <div className="text-2xl">✓</div>
            <div className="flex-1">
              <p className="font-bold text-sm mb-1" style={{ color: '#0369A1' }}>Offline Mode Active</p>
              <p className="text-xs mb-2" style={{ color: '#075985' }}>
                You can access course materials offline. However, videos require an internet connection.
              </p>
              <div className="flex items-center gap-4 text-xs" style={{ color: '#075985' }}>
                <span>✓ Text content</span>
                <span>✓ Images</span>
                <span>✓ Curriculum</span>
                <span className="opacity-50">✗ Videos</span>
              </div>
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
              <div className="text-xs font-bold text-text mb-1">
                {downloadProgress === 100 ? '✓ Download Complete!' : `${downloadProgress}%`}
              </div>
              <div className="text-xs text-muted mb-2">{downloadStatus}</div>
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
            src={offlineData ? offlineData.images.thumbnail : courseData.thumbnail}
            alt="Course"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative z-10 p-8">
          <div className="flex gap-2 mb-4">
            <span className="tag px-3 py-1 rounded-full text-xs font-bold" style={{ background: courseData.categoryColor || '#A98BFF', color: 'white' }}>{courseData.category}</span>
            <span className="tag px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'rgba(215,255,84,0.2)', color: '#D7FF54' }}>Certificate</span>
          </div>
          <h1 className="text-section text-white mb-3 max-w-2xl leading-tight">{courseData.title}</h1>
          <p className="text-white/60 text-sm mb-6 max-w-xl leading-relaxed">
            {courseData.description}
          </p>

          <div className="flex flex-wrap gap-6 mb-8">
            <div className="flex items-center gap-2">
              <Star size={15} fill="#F59E0B" color="#F59E0B" />
              <span className="text-white font-bold text-sm">{courseData.rating}</span>
              <span className="text-white/50 text-xs">({courseData.reviews.toLocaleString()} ratings)</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Users size={14} />
              <span>{courseData.learners}</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Clock size={14} />
              <span>{courseData.duration} · ~10h/week</span>
            </div>
            <div className="flex items-center gap-2 text-white/60 text-sm">
              <Globe size={14} />
              <span>{courseData.language}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={scrollToCurriculum}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ background: '#D7FF54', color: '#111' }}
            >
              <Play size={15} fill="#111" color="#111" />
              Continue Learning
            </button>
            <button 
              onClick={scrollToCurriculum}
              className="flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors"
            >
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
        
        {/* Complete button - ALWAYS VISIBLE */}
        <button
          onClick={handleCompleteCourse}
          className="w-full mt-3 px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-200 hover:opacity-90"
          style={{ background: '#D7FF54', color: '#111' }}
        >
          ✓ Mark as Complete & Get Certificate
        </button>
        
        {/* Reset button - ALWAYS VISIBLE */}
        <button
          onClick={handleResetCelebration}
          className="w-full mt-3 px-4 py-2 rounded-2xl text-sm font-bold transition-all duration-200 hover:opacity-90"
          style={{ background: '#A98BFF', color: 'white' }}
        >
          🔄 Reset Progress (Test Again)
        </button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(courseData.whatYouLearn || [
                'Build ML models with NumPy & scikit-learn',
                'Train neural networks with TensorFlow',
                'Apply best practices for ML development',
                'Implement decision trees, random forests, SVMs',
                'Use unsupervised learning algorithms',
                'Build recommender systems from scratch',
              ]).map((item: string) => (
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {(courseData.careerOutcomes || [
                { role: 'ML Engineer', salary: '$148K', growth: '+23%' },
                { role: 'Data Scientist', salary: '$136K', growth: '+18%' },
                { role: 'AI Researcher', salary: '$162K', growth: '+31%' },
              ]).map((c: any) => (
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
        <div id="curriculum-section" className="space-y-3">
          <div className="card-static p-5 rounded-3xl flex items-center justify-between">
            <div>
              <p className="font-bold text-text">86 lessons</p>
              <p className="text-xs text-muted">Total: 21h 10m of content</p>
            </div>
            <button className="text-xs font-semibold text-muted hover:text-text transition-colors">
              Expand All
            </button>
          </div>
          {courseCurriculum.map((section, i) => {
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

      {/* Certificate Viewer Modal */}
      <CertificateViewerModal
        isOpen={showCertificateViewer}
        certificateUrl={currentCertificateUrl}
        courseName={courseName}
        onClose={() => setShowCertificateViewer(false)}
      />

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
          readingMaterial={getReadingMaterial(currentVideo.title)}
          onComplete={handleVideoComplete}
          onProgressUpdate={handleVideoProgressUpdate}
        />
      )}
    </div>
  );
}


