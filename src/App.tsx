import { useState, useEffect } from 'react';
import { Calendar, MessageCircle, GraduationCap, Settings as SettingsIcon, Menu, X, Home as HomeIcon, Search, BookOpen, Grid3x3, User } from 'lucide-react';
import Sidebar, { Page } from './components/Sidebar';
import RightPanel from './components/RightPanel';
import InAppNotification from './components/InAppNotification';
import LoadingScreen from './components/LoadingScreen';
import Home from './pages/Home';
import Explore from './pages/Explore';
import MyLearning from './pages/MyLearning';
import CourseDetail from './pages/CourseDetail';
import SearchPage from './pages/Search';
import Certificates from './pages/Certificates';
import CareerPaths from './pages/CareerPaths';
import Categories from './pages/Categories';
import Profile from './pages/Profile';
import Community from './pages/Community';
import Degrees from './pages/Degrees';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import CalendarPage from './pages/Calendar';
import Settings from './pages/Settings';
import Placeholder from './pages/Placeholder';
import { OfflineProvider } from './contexts/OfflineContext';
import { StreakProvider } from './contexts/StreakContext';
import { ReminderProvider, useReminder } from './contexts/ReminderContext';
import { BookmarkProvider } from './contexts/BookmarkContext';

const PAGES_WITHOUT_RIGHT_PANEL: Page[] = ['course-detail', 'messages', 'settings'];

function AppContent() {
  const [activePage, setActivePage] = useState<Page>('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { dueReminderNotification, clearDueReminder } = useReminder();

  const handleNavigate = (page: Page, query?: string) => {
    setActivePage(page);
    if (page !== 'course-detail') setSelectedCourseId(null);
    if (page === 'search' && query !== undefined) {
      setSearchQuery(query);
    } else if (page !== 'search') {
      setSearchQuery('');
    }
    
    // Close mobile menu when navigating
    setMobileMenuOpen(false);
    
    // Scroll to top whenever navigating to a new page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCourseClick = (courseId: string) => {
    setSelectedCourseId(courseId);
    setActivePage('course-detail');
    
    // Scroll to top when opening a course
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showRightPanel = !PAGES_WITHOUT_RIGHT_PANEL.includes(activePage);

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <Home onNavigate={handleNavigate} onCourseClick={handleCourseClick} />;
      case 'explore':
        return <Explore onCourseClick={handleCourseClick} />;
      case 'categories':
        return <Categories onNavigate={handleNavigate} />;
      case 'my-learning':
        return <MyLearning onCourseClick={handleCourseClick} />;
      case 'course-detail':
        return (
          <CourseDetail
            courseId={selectedCourseId}
            onBack={() => setActivePage('explore')}
            onNavigate={handleNavigate}
          />
        );
      case 'search':
        return <SearchPage onCourseClick={handleCourseClick} initialQuery={searchQuery} />;
      case 'certificates':
        return <Certificates />;
      case 'career-paths':
        return <CareerPaths />;
      case 'profile':
        return <Profile />;
      case 'community':
        return <Community />;
      case 'messages':
        return <Messages />;
      case 'notifications':
        return <Notifications onCourseClick={handleCourseClick} />;
      case 'calendar':
        return <CalendarPage />;
      case 'degrees':
        return <Degrees onNavigate={handleNavigate} />;
      case 'settings':
        return <Settings />;
      default:
        return <Home onNavigate={handleNavigate} onCourseClick={handleCourseClick} />;
    }
  };

  return (
    <div
      className="min-h-screen flex overflow-visible"
      style={{ background: '#F6F6F8' }}
    >
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar activePage={activePage} onNavigate={handleNavigate} />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <img src="/logo.png" alt="Coursera" className="h-7" />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="absolute top-[57px] left-0 right-0 bg-white shadow-lg max-h-[calc(100vh-57px)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar activePage={activePage} onNavigate={handleNavigate} mobile />
          </div>
        </div>
      )}

      {/* Main Workspace */}
      <main className="flex-1 flex min-h-screen lg:pt-0 pt-[57px] pb-[65px] lg:pb-0">
        {renderPage()}

        {/* Desktop Right Panel */}
        {showRightPanel && (
          <div className="hidden xl:block">
            <RightPanel />
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          <button
            onClick={() => handleNavigate('home')}
            className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors min-w-[60px]"
            style={{
              color: activePage === 'home' ? '#111' : '#888',
              background: activePage === 'home' ? '#D7FF54' : 'transparent',
            }}
          >
            <HomeIcon size={20} strokeWidth={2.5} />
            <span className="text-[10px] font-semibold">Home</span>
          </button>
          
          <button
            onClick={() => handleNavigate('explore')}
            className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors min-w-[60px]"
            style={{
              color: activePage === 'explore' ? '#111' : '#888',
              background: activePage === 'explore' ? '#D7FF54' : 'transparent',
            }}
          >
            <Search size={20} strokeWidth={2.5} />
            <span className="text-[10px] font-semibold">Explore</span>
          </button>
          
          <button
            onClick={() => handleNavigate('my-learning')}
            className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors min-w-[60px]"
            style={{
              color: activePage === 'my-learning' ? '#111' : '#888',
              background: activePage === 'my-learning' ? '#D7FF54' : 'transparent',
            }}
          >
            <BookOpen size={20} strokeWidth={2.5} />
            <span className="text-[10px] font-semibold">Learning</span>
          </button>
          
          <button
            onClick={() => handleNavigate('categories')}
            className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors min-w-[60px]"
            style={{
              color: activePage === 'categories' ? '#111' : '#888',
              background: activePage === 'categories' ? '#D7FF54' : 'transparent',
            }}
          >
            <Grid3x3 size={20} strokeWidth={2.5} />
            <span className="text-[10px] font-semibold">More</span>
          </button>
          
          <button
            onClick={() => handleNavigate('profile')}
            className="flex flex-col items-center justify-center gap-1 p-2 rounded-lg transition-colors min-w-[60px]"
            style={{
              color: activePage === 'profile' ? '#111' : '#888',
              background: activePage === 'profile' ? '#D7FF54' : 'transparent',
            }}
          >
            <User size={20} strokeWidth={2.5} />
            <span className="text-[10px] font-semibold">Profile</span>
          </button>
        </div>
      </div>

      {/* In-App Reminder Notification */}
      {dueReminderNotification && (
        <InAppNotification
          courseName={dueReminderNotification.courseName}
          onViewCourse={() => {
            handleCourseClick(dueReminderNotification.courseId);
            clearDueReminder();
          }}
          onClose={clearDueReminder}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <OfflineProvider>
      <StreakProvider>
        <ReminderProvider>
          <BookmarkProvider>
            <AppContent />
          </BookmarkProvider>
        </ReminderProvider>
      </StreakProvider>
    </OfflineProvider>
  );
}
