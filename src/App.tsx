import { useState } from 'react';
import { Calendar, MessageCircle, GraduationCap, Settings as SettingsIcon } from 'lucide-react';
import Sidebar, { Page } from './components/Sidebar';
import RightPanel from './components/RightPanel';
import InAppNotification from './components/InAppNotification';
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

const PAGES_WITHOUT_RIGHT_PANEL: Page[] = ['course-detail', 'messages', 'settings'];

function AppContent() {
  const [activePage, setActivePage] = useState<Page>('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { dueReminderNotification, clearDueReminder } = useReminder();

  const handleNavigate = (page: Page, query?: string) => {
    setActivePage(page);
    if (page !== 'course-detail') setSelectedCourseId(null);
    if (page === 'search' && query !== undefined) {
      setSearchQuery(query);
    } else if (page !== 'search') {
      setSearchQuery('');
    }
    
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
        return <Notifications />;
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
      {/* Sidebar */}
      <Sidebar activePage={activePage} onNavigate={handleNavigate} />

      {/* Main Workspace */}
      <main className="flex-1 flex min-h-screen">
        {renderPage()}

        {/* Right Panel */}
        {showRightPanel && <RightPanel />}
      </main>

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
          <AppContent />
        </ReminderProvider>
      </StreakProvider>
    </OfflineProvider>
  );
}
