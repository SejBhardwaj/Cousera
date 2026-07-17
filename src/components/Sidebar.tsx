import {
  Home,
  Search,
  Grid3x3,
  BookOpen,
  Award,
  TrendingUp,
  GraduationCap,
  Users,
  MessageSquare,
  Calendar,
  Settings,
  User,
  Bell,
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
  mobile?: boolean;
}

const navItems: NavItem[] = [
  { icon: <Home size={18} strokeWidth={2} />, label: 'Home', page: 'home' },
  { icon: <Search size={18} strokeWidth={2} />, label: 'Explore', page: 'explore' },
  { icon: <Grid3x3 size={18} strokeWidth={2} />, label: 'Categories', page: 'categories' },
  { icon: <BookOpen size={18} strokeWidth={2} />, label: 'My Learning', page: 'my-learning' },
  { icon: <Award size={18} strokeWidth={2} />, label: 'Certificates', page: 'certificates' },
  { icon: <TrendingUp size={18} strokeWidth={2} />, label: 'Career Paths', page: 'career-paths' },
  { icon: <GraduationCap size={18} strokeWidth={2} />, label: 'Degrees', page: 'degrees' },
  { icon: <Users size={18} strokeWidth={2} />, label: 'Community', page: 'community' },
  { icon: <MessageSquare size={18} strokeWidth={2} />, label: 'Messages', page: 'messages' },
  { icon: <Calendar size={18} strokeWidth={2} />, label: 'Calendar', page: 'calendar' },
];

const bottomItems: NavItem[] = [
  { icon: <Bell size={18} strokeWidth={2} />, label: 'Notifications', page: 'notifications' },
  { icon: <Settings size={18} strokeWidth={2} />, label: 'Settings', page: 'settings' },
];

export default function Sidebar({ activePage, onNavigate, mobile = false }: SidebarProps) {
  // Mobile version - full menu
  if (mobile) {
    return (
      <nav className="bg-white py-4">
        <div className="px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = activePage === item.page;
            return (
              <button
                key={item.label}
                onClick={() => onNavigate(item.page)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                style={{
                  background: isActive ? '#D7FF54' : 'transparent',
                  color: isActive ? '#111111' : '#666666',
                }}
              >
                {item.icon}
                <span className="text-sm font-semibold">{item.label}</span>
              </button>
            );
          })}
        </div>
        
        <div className="h-px bg-gray-200 my-3 mx-4" />
        
        <div className="px-4 space-y-1">
          {bottomItems.map((item) => {
            const isActive = activePage === item.page;
            return (
              <button
                key={item.label}
                onClick={() => onNavigate(item.page)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
                style={{
                  background: isActive ? '#D7FF54' : 'transparent',
                  color: isActive ? '#111111' : '#666666',
                }}
              >
                {item.icon}
                <span className="text-sm font-semibold">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    );
  }

  // Desktop version - icon sidebar
  return (
    <aside
      className="flex flex-col items-center gap-0 py-3 px-2 m-3 sticky top-3"
      style={{
        background: '#111111',
        borderRadius: '28px',
        width: '60px',
        minWidth: '60px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
        zIndex: 10000,
        maxHeight: 'calc(100vh - 24px)',
      }}
    >
      {/* Main Nav */}
      <nav className="flex flex-col gap-0 flex-1 w-full overflow-visible">
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
                className="w-11 h-11 flex items-center justify-center rounded-full transition-all duration-200"
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
      <div className="w-7 h-px bg-white/10 my-1" />

      {/* Bottom Nav */}
      <nav className="flex flex-col gap-0 w-full overflow-visible">
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
                className="w-11 h-11 flex items-center justify-center rounded-full transition-all duration-200"
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
      <div className="my-1 relative group">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center"
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
        className="mt-1 group relative"
      >
        <img
          src="https://i.pravatar.cc/150?img=45"
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover border-2 transition-all duration-200"
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
