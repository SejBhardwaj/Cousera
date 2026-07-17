import { useState } from 'react';
import { Search, Sparkles, TrendingUp, Play, ArrowRight, Star, Users, Clock, Zap, ChevronRight, BookOpen, Award, GraduationCap, Flame } from 'lucide-react';
import CourseCard, { Course } from '../components/CourseCard';
import type { Page } from '../components/Sidebar';
import { useOffline } from '../contexts/OfflineContext';

const TRENDING_SKILLS = [
  { label: 'Generative AI', hot: true, color: '#D7FF54', textColor: '#111' },
  { label: 'Machine Learning', hot: false, color: '#EDE9FF', textColor: '#A98BFF' },
  { label: 'Data Science', hot: false, color: '#E0F5FF', textColor: '#0099CC' },
  { label: 'Cloud Computing', hot: false, color: '#ECFDF5', textColor: '#059669' },
  { label: 'Cybersecurity', hot: false, color: '#FFF0F0', textColor: '#FF6D70' },
  { label: 'Product Management', hot: false, color: '#FFF7ED', textColor: '#D97706' },
];

const CONTINUE_COURSES: Course[] = [
  {
    id: 'ml-specialization',
    title: 'Machine Learning Specialization',
    description: 'Master fundamental AI concepts and build intelligent systems. Learn supervised learning, neural networks, and best practices from industry leader Andrew Ng.',
    provider: 'Stanford Online',
    instructor: 'Andrew Ng',
    instructorImg: 'https://i.pravatar.cc/150?img=12',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
    category: 'Data Science',
    categoryColor: '#A98BFF',
    rating: 4.9,
    reviews: 128400,
    duration: '11 weeks',
    difficulty: 'Intermediate',
    progress: 68,
    enrolled: true,
    tags: ['AI', 'Programming', 'Python', 'Data Science'],
  },
  {
    id: 'fullstack-web-dev',
    title: 'Full-Stack Web Development',
    description: 'Build modern web applications from scratch. Master React, Node.js, databases, and deploy production-ready applications.',
    provider: 'Web Dev Institute',
    instructor: 'Michael Chen',
    instructorImg: 'https://i.pravatar.cc/150?img=62',
    thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80',
    category: 'Technology',
    categoryColor: '#83D6FF',
    rating: 4.7,
    reviews: 42000,
    duration: '16 weeks',
    difficulty: 'Intermediate',
    progress: 34,
    enrolled: true,
    tags: ['Programming', 'Web Development'],
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing Mastery',
    description: 'Become a digital marketing expert. Learn SEO, social media strategy, content marketing, and analytics to grow any business online.',
    provider: 'Marketing Pro',
    instructor: 'Alex Turner',
    instructorImg: 'https://i.pravatar.cc/150?img=51',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    category: 'Marketing',
    categoryColor: '#FFB259',
    rating: 4.6,
    reviews: 28000,
    duration: '8 weeks',
    difficulty: 'Beginner',
    progress: 87,
    enrolled: true,
    tags: ['Marketing', 'Business', 'Digital'],
  },
];

const RECOMMENDED: Course[] = [
  {
    id: 'ui-ux-bootcamp',
    title: 'UI/UX Design Bootcamp',
    description: 'Master user-centered design principles. Learn Figma, prototyping, user research, and create stunning portfolio-ready designs.',
    provider: 'Design Academy',
    instructor: 'Sarah Mitchell',
    instructorImg: 'https://i.pravatar.cc/150?img=45',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
    category: 'Design',
    categoryColor: '#FF6D70',
    rating: 4.8,
    reviews: 34000,
    duration: '10 weeks',
    difficulty: 'Beginner',
    tags: ['Design', 'Web Development'],
  },
  {
    id: 's12',
    title: 'AWS Solutions Architect',
    description: 'Design and deploy scalable cloud infrastructure on AWS. Master EC2, S3, Lambda, and earn your AWS certification.',
    provider: 'Amazon Web Services',
    instructor: 'James Wilson',
    instructorImg: 'https://i.pravatar.cc/150?img=68',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
    category: 'Technology',
    categoryColor: '#83D6FF',
    rating: 4.7,
    reviews: 52000,
    duration: '12 weeks',
    difficulty: 'Advanced',
    tags: ['Cloud Computing', 'Programming'],
  },
];

const STATS = [
  { label: 'Courses Available', value: '7,000+', accent: '#A98BFF', bg: '#EDE9FF', icon: <BookOpen size={18} color="#A98BFF" /> },
  { label: 'Learners Enrolled', value: '100M+', accent: '#D7FF54', bg: '#F5FFDB', icon: <Users size={18} color="#666" /> },
  { label: 'Certifications', value: '2,400+', accent: '#FF6D70', bg: '#FFF0F0', icon: <Award size={18} color="#FF6D70" /> },
  { label: 'Universities', value: '300+', accent: '#83D6FF', bg: '#E0F5FF', icon: <GraduationCap size={18} color="#0099CC" /> },
];

const PARTNERS = [
  { name: 'Google', logo: 'https://www.google.com/favicon.ico' },
  { name: 'IBM', logo: 'https://www.ibm.com/favicon.ico' },
  { name: 'Amazon', logo: 'https://www.amazon.com/favicon.ico' },
  { name: 'Microsoft', logo: 'https://www.microsoft.com/favicon.ico' },
  { name: 'Stanford', logo: 'https://www.stanford.edu/favicon.ico' },
  { name: 'Yale', logo: 'https://www.yale.edu/favicon.ico' },
  { name: 'Michigan', logo: 'https://umich.edu/favicon.ico' },
  { name: 'DeepLearning.AI', logo: 'https://www.deeplearning.ai/favicon.ico' }
];

interface HomeProps {
  onNavigate: (page: Page, query?: string) => void;
  onCourseClick: (courseId: string) => void;
}

export default function Home({ onNavigate, onCourseClick }: HomeProps) {
  const { offlineCourses } = useOffline();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const recentSearches = ['Python', 'Machine Learning', 'React', 'Data Science'];

  return (
    <div className="flex-1 py-4 pr-4 pl-2 px-4 md:pr-4 md:pl-2 overflow-y-auto no-scrollbar space-y-5 animate-in">

      {/* Hero Card */}
      <div
        className="relative rounded-4xl overflow-hidden p-6 md:p-8"
        style={{
          background: 'linear-gradient(135deg, #0F0F0F 0%, #1a1a2e 50%, #16213e 100%)',
          minHeight: '280px',
        }}
      >
        {/* Decorative orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #A98BFF, transparent 70%)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #D7FF54, transparent 70%)', transform: 'translateY(40%)' }} />

        <div className="relative z-10 max-w-2xl">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-xs font-bold"
            style={{ background: 'rgba(215,255,84,0.15)', color: '#D7FF54', border: '1px solid rgba(215,255,84,0.3)' }}
          >
            <Sparkles size={12} />
            Powered by AI · Over 7,000 courses
          </div>

          <h1 className="text-hero text-white mb-3">
            Learn without
            <br />
            <span style={{ color: '#D7FF54' }}>limits.</span>
          </h1>
          <p className="text-white/60 text-base mb-7 max-w-md leading-relaxed">
            Advance your career with world-class courses from top universities and companies.
          </p>

          {/* Search */}
          <div className="relative mb-6">
            <div
              className="flex items-center gap-3 rounded-2xl px-5 py-4 transition-all duration-300"
              style={{
                background: searchFocused ? 'rgba(255,255,255,1)' : 'rgba(255,255,255,0.12)',
                border: `1.5px solid ${searchFocused ? 'transparent' : 'rgba(255,255,255,0.15)'}`,
                boxShadow: searchFocused ? '0 8px 32px rgba(0,0,0,0.25)' : 'none',
              }}
            >
              <Search size={18} color={searchFocused ? '#6B6B7B' : 'rgba(255,255,255,0.6)'} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                placeholder="Search for any skill, course, or certification..."
                className="flex-1 outline-none text-sm bg-transparent"
                style={{ color: searchFocused ? '#0F0F0F' : 'rgba(255,255,255,0.8)' }}
                onKeyDown={(e) => e.key === 'Enter' && onNavigate('search', searchQuery)}
              />
              <button
                onClick={() => onNavigate('search', searchQuery)}
                className="px-4 py-2 rounded-2xl text-xs font-bold transition-all duration-200 hover:opacity-90"
                style={{ background: '#D7FF54', color: '#111' }}
              >
                Search
              </button>
            </div>

            {/* Recent searches */}
            {searchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-float-lg p-4 z-50 animate-in">
                <p className="text-xs font-semibold text-muted mb-2">Recent Searches</p>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((s) => (
                    <button
                      key={s}
                      className="px-3 py-1.5 rounded-full text-xs font-medium bg-bg text-text hover:bg-border transition-colors"
                      onClick={() => { setSearchQuery(s); onNavigate('search', s); }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Trending skills */}
          <div className="flex flex-wrap gap-2">
            <span className="text-white/40 text-xs flex items-center gap-1 mr-1">
              <TrendingUp size={12} /> Trending:
            </span>
            {TRENDING_SKILLS.map((s) => (
              <button
                key={s.label}
                onClick={() => onNavigate('explore')}
                className="px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-200 hover:scale-105"
                style={{ background: s.color, color: s.textColor }}
              >
                {s.hot && <Zap size={14} className="inline mr-1" />}{s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right decorative cards */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-3">
          <div className="bg-white/10 backdrop-blur rounded-3xl p-4 w-52 border border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-lime/20 flex items-center justify-center">
                <Zap size={14} color="#D7FF54" />
              </div>
              <div>
                <p className="text-white text-xs font-bold">Daily Streak</p>
                <p className="text-white/50 text-xs">Keep it up!</p>
              </div>
            </div>
            <div className="text-white flex items-center gap-2 text-3xl font-black">
              <span>23</span>
              <Flame size={28} />
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-3xl p-4 w-52 border border-white/10">
            <p className="text-white/60 text-xs mb-1">This week</p>
            <p className="text-white text-sm font-bold mb-2">14.3 hours learned</p>
            <div className="flex gap-1">
              {[60, 80, 45, 90, 70].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm" style={{ height: `${h * 0.4}px`, background: `rgba(215,255,84,${0.3 + h * 0.005})`, alignSelf: 'flex-end' }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {STATS.map((s) => (
          <div key={s.label} className="card-static p-5 rounded-3xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: s.bg }}>
              {s.icon}
            </div>
            <div>
              <p className="font-black text-xl text-text">{s.value}</p>
              <p className="text-xs text-muted">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Continue Learning */}
      <div className="card-static p-6 rounded-4xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-card-title text-text">Continue Learning</h2>
          <button
            onClick={() => onNavigate('my-learning')}
            className="flex items-center gap-1 text-sm font-semibold text-muted hover:text-text transition-colors"
          >
            View all <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CONTINUE_COURSES.map((c) => (
            <CourseCard 
              key={c.id} 
              course={c} 
              compact 
              onClick={() => onCourseClick(c.id)}
              isOfflineAvailable={offlineCourses.has(c.title.toLowerCase().replace(/\s+/g, '-'))}
            />
          ))}
        </div>
      </div>

      {/* Partners */}
      <div className="card-static p-5 rounded-3xl">
        <p className="text-xs font-semibold text-muted text-center mb-3">Learn from the world's top organizations</p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {PARTNERS.map((p) => (
            <div 
              key={p.name} 
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-bg transition-colors cursor-pointer partner-item"
              id={`partner-${p.name.replace(/\s+/g, '-').toLowerCase()}`}
            >
              <img 
                src={p.logo} 
                alt={p.name}
                className="w-4 h-4 object-contain"
                onError={(e) => {
                  const parent = e.currentTarget.closest('.partner-item');
                  if (parent) parent.style.display = 'none';
                }}
              />
              <span className="text-sm font-semibold text-muted/60 hover:text-muted transition-colors">
                {p.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-card-title text-text">Recommended for You</h2>
          <button
            onClick={() => onNavigate('explore')}
            className="flex items-center gap-1 text-sm font-semibold text-muted hover:text-text transition-colors"
          >
            Browse all <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {RECOMMENDED.map((c) => (
            <CourseCard 
              key={c.id} 
              course={c} 
              onClick={() => onCourseClick(c.id)}
              isOfflineAvailable={offlineCourses.has(c.title.toLowerCase().replace(/\s+/g, '-'))}
            />
          ))}
        </div>
      </div>

      {/* Career Paths Preview */}
      <div
        className="p-7 rounded-4xl"
        style={{ background: 'linear-gradient(135deg, #EDE9FF 0%, #E0F5FF 100%)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-2xl flex items-center justify-center" style={{ background: '#A98BFF' }}>
                <TrendingUp size={16} color="white" />
              </div>
              <span className="text-xs font-bold text-purple uppercase tracking-wider">Career Paths</span>
            </div>
            <h2 className="text-section text-text mb-2">Find your perfect career path</h2>
            <p className="text-muted text-sm max-w-md leading-relaxed">
              Job-ready learning programs designed with top companies. Get the skills employers want most.
            </p>
          </div>
          <button
            onClick={() => onNavigate('career-paths')}
            className="btn-primary ml-8 whitespace-nowrap flex items-center gap-2"
          >
            Explore Paths <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {[
            { title: 'Data Analyst', courses: 8, color: '#A98BFF' },
            { title: 'UX Designer', courses: 7, color: '#FF6D70' },
            { title: 'Cloud Engineer', courses: 10, color: '#83D6FF' },
            { title: 'ML Engineer', courses: 12, color: '#D7FF54' },
          ].map((p) => (
            <div
              key={p.title}
              className="bg-white/70 backdrop-blur rounded-3xl p-4 cursor-pointer hover:-translate-y-1 transition-transform duration-200"
              onClick={() => onNavigate('career-paths')}
            >
              <div className="w-9 h-9 rounded-2xl mb-3 flex items-center justify-center" style={{ background: p.color }}>
                <TrendingUp size={16} color={p.color === '#D7FF54' ? '#111' : 'white'} />
              </div>
              <p className="font-bold text-sm text-text mb-1">{p.title}</p>
              <p className="text-xs text-muted">{p.courses} courses</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="card-static p-6 rounded-4xl">
        <h2 className="text-card-title text-text mb-5">What learners say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: 'Priya Sharma',
              role: 'ML Engineer at Google',
              avatar: 'https://i.pravatar.cc/150?img=32',
              text: 'Coursera completely transformed my career. I went from marketing to ML engineering in 18 months.',
              rating: 5,
            },
            {
              name: 'Marcus Lee',
              role: 'Data Scientist at Netflix',
              avatar: 'https://i.pravatar.cc/150?img=33',
              text: "The Deep Learning Specialization was exactly what I needed. World-class content, practical projects.",
              rating: 5,
            },
            {
              name: 'Sofia Rodriguez',
              role: 'UX Lead at Airbnb',
              avatar: 'https://i.pravatar.cc/150?img=47',
              text: "Google's UX Design certificate gave me the confidence and skills to land my dream job.",
              rating: 5,
            },
          ].map((t) => (
            <div key={t.name} className="p-5 rounded-3xl" style={{ background: '#F6F6F8' }}>
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={12} fill="#F59E0B" color="#F59E0B" />
                ))}
              </div>
              <p className="text-sm text-text leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-2">
                <img src={t.avatar} alt={t.name} className="w-8 h-8 rounded-full object-cover" />
                <div>
                  <p className="text-xs font-bold text-text">{t.name}</p>
                  <p className="text-xs text-muted">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="card-static p-7 rounded-4xl">
        <div className="text-center mb-7">
          <h2 className="text-section text-text mb-2">Choose your learning path</h2>
          <p className="text-muted text-sm">Flexible plans for every learner. Start free, upgrade anytime.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[
            { 
              name: 'Free Explorer', 
              price: '$0', 
              period: 'forever', 
              badge: 'Get Started',
              features: ['Access 2,000+ courses', 'Watch video lectures', 'Community forums', 'Course bookmarks', 'Mobile app access'], 
              accent: '#E0E0E8', 
              cta: 'Start Learning', 
              dark: false,
              popular: false
            },
            { 
              name: 'Premium Plus', 
              price: '$49', 
              period: 'per month', 
              badge: 'Most Popular',
              features: ['Unlimited course access', '7,000+ premium courses', 'Earn certificates', 'AI-powered mentor', 'Download for offline', 'Priority support'], 
              accent: '#D7FF54', 
              cta: 'Start 7-Day Free Trial', 
              dark: false,
              popular: true
            },
            { 
              name: 'Enterprise', 
              price: '$299', 
              period: 'per user/year', 
              badge: 'For Teams',
              features: ['Everything in Premium', 'Advanced analytics', 'Custom learning paths', 'SSO & integrations', 'Dedicated account manager', 'Bulk licenses'], 
              accent: '#111', 
              cta: 'Contact Sales', 
              dark: true,
              popular: false
            },
          ].map((p) => (
            <div
              key={p.name}
              className="p-6 rounded-3xl border-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl relative"
              style={{
                background: p.dark ? '#111' : 'white',
                borderColor: p.accent === '#D7FF54' ? '#D7FF54' : p.dark ? '#111' : '#EBEBF0',
                transform: p.popular ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1" style={{ background: '#D7FF54', color: '#111' }}>
                  <Zap size={12} /> {p.badge}
                </div>
              )}
              <div className="mb-5">
                <p className="text-sm font-bold mb-1" style={{ color: p.dark ? '#fff' : '#6B6B7B' }}>{p.name}</p>
                <div className="flex items-end gap-1 mb-1">
                  <span className="text-4xl font-black" style={{ color: p.dark ? '#fff' : '#0F0F0F' }}>{p.price}</span>
                  <span className="text-xs text-muted mb-2">/{p.period}</span>
                </div>
                {!p.popular && (
                  <span className="text-xs font-semibold" style={{ color: p.dark ? '#D7FF54' : '#A98BFF' }}>{p.badge}</span>
                )}
              </div>
              <ul className="space-y-3 mb-6">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-xs" style={{ color: p.dark ? '#ccc' : '#6B6B7B' }}>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: p.accent === '#D7FF54' ? '#D7FF54' : p.dark ? '#333' : '#F0F0F5' }}>
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 3L3.5 5.5L9 1" stroke={p.dark && p.accent !== '#D7FF54' ? '#D7FF54' : '#0F0F0F'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <span className="leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>
              <button
                className="w-full py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 hover:opacity-90 active:scale-95 hover:shadow-lg"
                style={{
                  background: p.accent === '#D7FF54' ? '#D7FF54' : p.dark ? '#D7FF54' : '#111',
                  color: p.accent === '#D7FF54' ? '#111' : p.dark ? '#111' : '#fff',
                }}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
        <p className="text-center text-xs text-muted mt-6">All plans include money-back guarantee • Cancel anytime • No hidden fees</p>
      </div>

      {/* Bottom spacer */}
      <div className="h-4" />
    </div>
  );
}
