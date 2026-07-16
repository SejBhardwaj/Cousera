import {
  Home,
  Compass,
  LayoutGrid,
  BookOpen,
  Award,
  TrendingUp,
  GraduationCap,
  Building2,
  Users,
  MessageCircle,
  Calendar,
  Settings,
  User,
  Bell,
  Zap,
} from 'lucide-react';
import StreakDisplay from './StreakDisplay';

type Page =
  | 'home'
  | 'explore'
  | 'categories'
  | 'my-learning'
  | 'certificates'
  | 'career-paths'
  | 'degrees'
  | 'community'
  | 'messages'
  | 'calendar'
  | 'notifications'
  | 'settings'
  | 'profile'
  | 'search'
  | 'course-detail';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  page: Page;
}

interface SidebarProps {
  activePage: Page;
  onNavigate: (page: Page) => void;
}

const navItems: NavItem[] = [
  { icon: <Home size={18} />, label: 'Home', page: 'home' },
  { icon: <Compass size={18} />, label: 'Explore', page: 'explore' },
  { icon: <LayoutGrid size={18} />, label: 'Categories', page: 'categories' },
  { icon: <BookOpen size={18} />, label: 'My Learning', page: 'my-learning' },
  { icon: <Award size={18} />, label: 'Certificates', page: 'certificates' },
  { icon: <TrendingUp size={18} />, label: 'Career Paths', page: 'career-paths' },
  { icon: <GraduationCap size={18} />, label: 'Degrees', page: 'degrees' },
  { icon: <Building2 size={18} />, label: 'For Business', page: 'explore' },
];

const bottomItems: NavItem[] = [
  { icon: <Users size={18} />, label: 'Community', page: 'community' },
  { icon: <MessageCircle size={18} />, label: 'Messages', page: 'messages' },
  { icon: <Calendar size={18} />, label: 'Calendar', page: 'calendar' },
  { icon: <Bell size={18} />, label: 'Notifications', page: 'notifications' },
  { icon: <Settings size={18} />, label: 'Settings', page: 'settings' },
];

export default function Sidebar({ activePage, onNavigate }: SidebarProps) {
  return (
    <aside
      className="flex flex-col items-center gap-1 py-5 px-3 m-3 sticky top-3 overflow-visible"
      style={{
        background: '#111111',
        borderRadius: '28px',
        width: '68px',
        minWidth: '68px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
        zIndex: 10000,
        maxHeight: 'calc(100vh - 24px)',
      }}
    >
      {/* Logo */}
      <div className="mb-4 flex items-center justify-center">
        <div
          className="w-10 h-10 flex items-center justify-center rounded-2xl"
          style={{ background: '#D7FF54' }}
        >
          <Zap size={20} fill="#111111" color="#111111" />
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex flex-col gap-1 flex-1 w-full overflow-visible">
        {navItems.map((item) => {
          const isActive = activePage === item.page;
          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.page)}
              title={item.label}
              className="relative group w-full flex items-center justify-center"
            >
              <div
                className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200"
                style={{
                  background: isActive ? '#D7FF54' : 'transparent',
                  color: isActive ? '#111111' : '#888888',
                  transform: isActive ? 'scale(1.05)' : undefined,
                  boxShadow: isActive ? '0 0 16px rgba(215,255,84,0.4)' : undefined,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.1)';
                    (e.currentTarget as HTMLDivElement).style.color = '#ffffff';
                    (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.08)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                    (e.currentTarget as HTMLDivElement).style.color = '#888888';
                    (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
                  }
                }}
              >
                {item.icon}
              </div>
              {/* Tooltip */}
              <div className="absolute left-full ml-3 px-4 py-2 text-xs font-semibold rounded-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 translate-x-1 group-hover:translate-x-0" style={{ zIndex: 9999, background: 'rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', border: '2px solid rgba(255, 255, 255, 0.5)', borderTop: '2px solid rgba(255, 255, 255, 0.7)', borderLeft: '2px solid rgba(255, 255, 255, 0.7)', color: '#000000', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 1px 0 rgba(255, 255, 255, 0.2)' }}>
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="w-8 h-px bg-white/10 my-2" />

      {/* Bottom Nav */}
      <nav className="flex flex-col gap-1 w-full overflow-visible">
        {bottomItems.map((item) => {
          const isActive = activePage === item.page && item.page !== 'home';
          return (
            <button
              key={item.label}
              onClick={() => onNavigate(item.page)}
              title={item.label}
              className="relative group w-full flex items-center justify-center"
            >
              <div
                className="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200"
                style={{
                  background: isActive ? '#D7FF54' : 'transparent',
                  color: isActive ? '#111111' : '#888888',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.1)';
                    (e.currentTarget as HTMLDivElement).style.color = '#ffffff';
                    (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.08)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    (e.currentTarget as HTMLDivElement).style.background = 'transparent';
                    (e.currentTarget as HTMLDivElement).style.color = '#888888';
                    (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
                  }
                }}
              >
                {item.icon}
              </div>
              <div className="absolute left-full ml-3 px-4 py-2 text-xs font-semibold rounded-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 translate-x-1 group-hover:translate-x-0" style={{ zIndex: 9999, background: 'rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', border: '2px solid rgba(255, 255, 255, 0.5)', borderTop: '2px solid rgba(255, 255, 255, 0.7)', borderLeft: '2px solid rgba(255, 255, 255, 0.7)', color: '#000000', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 1px 0 rgba(255, 255, 255, 0.2)' }}>
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Streak Indicator */}
      <div className="my-2 relative group">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,109,112,0.15)' }}
        >
          <StreakDisplay compact />
        </div>
        <div className="absolute left-full ml-3 px-4 py-2 text-xs font-semibold rounded-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 translate-x-1 group-hover:translate-x-0" style={{ zIndex: 9999, background: 'rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', border: '2px solid rgba(255, 255, 255, 0.5)', borderTop: '2px solid rgba(255, 255, 255, 0.7)', borderLeft: '2px solid rgba(255, 255, 255, 0.7)', color: '#000000', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 1px 0 rgba(255, 255, 255, 0.2)' }}>
          Learning Streak
        </div>
      </div>

      {/* Profile */}
      <button
        onClick={() => onNavigate('profile')}
        title="Profile"
        className="mt-3 group relative"
      >
        <img
          src="https://i.pravatar.cc/150?img=45"
          alt="Profile"
          className="w-9 h-9 rounded-full object-cover border-2 transition-all duration-200"
          style={{
            borderColor: activePage === 'profile' ? '#D7FF54' : 'rgba(255,255,255,0.2)',
          }}
        />
        <div className="w-2.5 h-2.5 bg-green rounded-full border-2 border-sidebar absolute bottom-0 right-0" />
        <div className="absolute left-full ml-3 px-4 py-2 text-xs font-semibold rounded-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-150 translate-x-1 group-hover:translate-x-0" style={{ zIndex: 9999, background: 'rgba(255, 255, 255, 0.3)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', border: '2px solid rgba(255, 255, 255, 0.5)', borderTop: '2px solid rgba(255, 255, 255, 0.7)', borderLeft: '2px solid rgba(255, 255, 255, 0.7)', color: '#000000', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 1px 0 rgba(255, 255, 255, 0.2)' }}>
          Profile
        </div>
      </button>
    </aside>
  );
}

export type { Page };
