import { useState } from 'react';
import { Calendar, MessageCircle, GraduationCap, Settings } from 'lucide-react';
import Sidebar, { Page } from './components/Sidebar';
import RightPanel from './components/RightPanel';
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
import Placeholder from './pages/Placeholder';
import { OfflineProvider } from './contexts/OfflineContext';
import { StreakProvider } from './contexts/StreakContext';
import { ReminderProvider } from './contexts/ReminderContext';

const PAGES_WITHOUT_RIGHT_PANEL: Page[] = ['course-detail'];

export default function App() {
  const [activePage, setActivePage] = useState<Page>('home');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleNavigate = (page: Page, query?: string) => {
    setActivePage(page);
    if (page !== 'course-detail') setSelectedCourseId(null);
    if (page === 'search' && query !== undefined) {
      setSearchQuery(query);
    } else if (page !== 'search') {
      setSearchQuery('');
    }
  };

  const handleCourseClick = (courseId: string) => {
    setSelectedCourseId(courseId);
    setActivePage('course-detail');
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
        return (
          <Placeholder
            title="Messages"
            description="Chat with instructors, peers, and study groups. Real-time learning conversations."
            icon={<MessageCircle size={32} color="#111" />}
            accent="#D7FF54"
          />
        );
      case 'calendar':
        return (
          <Placeholder
            title="Learning Calendar"
            description="Schedule study sessions, track deadlines, and sync with your calendar apps."
            icon={<Calendar size={32} color="white" />}
            accent="#83D6FF"
          />
        );
      case 'degrees':
        return (
          <Placeholder
            title="Online Degrees"
            description="Earn accredited bachelor's and master's degrees from top universities, 100% online."
            icon={<GraduationCap size={32} color="#111" />}
            accent="#A98BFF"
          />
        );
      case 'settings':
        return (
          <Placeholder
            title="Settings"
            description="Manage your account, preferences, notifications, and privacy settings."
            icon={<Settings size={32} color="white" />}
            accent="#111"
          />
        );
      default:
        return <Home onNavigate={handleNavigate} onCourseClick={handleCourseClick} />;
    }
  };

  return (
    <OfflineProvider>
      <StreakProvider>
        <ReminderProvider>
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
          </div>
        </ReminderProvider>
      </StreakProvider>
    </OfflineProvider>
  );
}
