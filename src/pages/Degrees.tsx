import { GraduationCap, TrendingUp, Star, Clock, Users, ChevronRight, Award, BookOpen, Globe } from 'lucide-react';
import { useState } from 'react';
import type { Page } from '../components/Sidebar';

const DEGREE_PROGRAMS = [
  {
    id: 'mscs-iit',
    title: 'Master of Science in Computer Science',
    university: 'Indian Institute of Technology',
    location: 'India',
    degree: 'Master of Computer Science (MCS)',
    duration: '2-3 years',
    cost: '₹2,50,000',
    rating: 4.9,
    enrolled: '5,200+',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
    logo: '/Indian Institutes of Technology Logo (IITs).jpg',
    category: 'Computer Science',
    categoryColor: '#D7FF54',
    accreditation: 'UGC Approved',
    highlights: ['IIT degree certificate', 'World-class faculty', 'Top CS program'],
  },
  {
    id: 'mba-oxford',
    title: 'Master of Business Administration',
    university: 'University of Oxford',
    location: 'Oxford, UK',
    degree: 'MBA',
    duration: '2 years',
    cost: '£38,500',
    rating: 4.9,
    enrolled: '2,400+',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
    logo: '/The Onoto Pen Company unveils the University of Oxford Collection - INKED HAPPINESS.jpg',
    category: 'Business',
    categoryColor: '#FFB259',
    accreditation: 'Triple Crown Accredited',
    highlights: ['Oxford degree', 'Global network', 'Top business school'],
  },
  {
    id: 'msds-tech',
    title: 'Master of Applied Data Science',
    university: 'Technology Institute',
    location: 'USA',
    degree: 'Master of Applied Data Science (MADS)',
    duration: '1.5-3 years',
    cost: '$48,000',
    rating: 4.8,
    enrolled: '3,800+',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    logo: '/download (1).jpg',
    category: 'Data Science',
    categoryColor: '#A98BFF',
    accreditation: 'Accredited',
    highlights: ['No GRE required', 'Portfolio capstone', 'Industry partnerships'],
  },
  {
    id: 'msis-business',
    title: 'Bachelor of Science in Data Science',
    university: 'Business School',
    location: 'International',
    degree: 'BS in Data Science & Applications',
    duration: '3-4 years',
    cost: '$25,000',
    rating: 4.7,
    enrolled: '15,000+',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&q=80',
    logo: '/download (2).jpg',
    category: 'Data Science',
    categoryColor: '#A98BFF',
    accreditation: 'Accredited',
    highlights: ['Affordable tuition', 'Industry projects', 'Global recognition'],
  },
  {
    id: 'msee-ai',
    title: 'Master of Science in Artificial Intelligence',
    university: 'AI Technology Institute',
    location: 'Global',
    degree: 'MS in Artificial Intelligence',
    duration: '2-3 years',
    cost: '$42,000',
    rating: 4.8,
    enrolled: '1,200+',
    thumbnail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80',
    logo: '/Bit_ai_ AI-Powered Documents, Wikis, & Knowledge Management for Teams.jpg',
    category: 'Engineering',
    categoryColor: '#83D6FF',
    accreditation: 'International Accredited',
    highlights: ['AI specialization', 'Cutting-edge research', 'Industry network'],
  },
  {
    id: 'mph-iit2',
    title: 'Master of Technology in Data Science',
    university: 'Indian Institute of Technology',
    location: 'India',
    degree: 'MTech Data Science',
    duration: '2 years',
    cost: '₹3,00,000',
    rating: 4.9,
    enrolled: '1,800+',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
    logo: '/Indian Institutes of Technology Logo (IITs).jpg',
    category: 'Health',
    categoryColor: '#FF6D70',
    accreditation: 'UGC Approved',
    highlights: ['IIT certification', 'Research excellence', 'Premier institute'],
  },
  {
    id: 'bscs-oxford2',
    title: 'Bachelor of Science in Computer Science',
    university: 'University of Oxford',
    location: 'Oxford, UK',
    degree: 'BSc Computer Science',
    duration: '3-4 years',
    cost: '£25,000',
    rating: 4.8,
    enrolled: '8,500+',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
    logo: '/The Onoto Pen Company unveils the University of Oxford Collection - INKED HAPPINESS.jpg',
    category: 'Computer Science',
    categoryColor: '#D7FF54',
    accreditation: 'Oxford Certified',
    highlights: ['Oxford degree', 'World-class education', 'Career support'],
  },
  {
    id: 'mba-tech',
    title: 'Master of Business Administration',
    university: 'Technology Business School',
    location: 'USA',
    degree: 'MBA',
    duration: '2 years',
    cost: '$45,000',
    rating: 4.7,
    enrolled: '3,200+',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=80',
    logo: '/download (1).jpg',
    category: 'Business',
    categoryColor: '#FFB259',
    accreditation: 'AACSB Accredited',
    highlights: ['Industry collaborations', 'Live projects', 'Strong alumni network'],
  },
  {
    id: 'msai-business',
    title: 'Master of Computer & Information Technology',
    university: 'Global Business Institute',
    location: 'International',
    degree: 'MCIT',
    duration: '1.5-2.5 years',
    cost: '$38,000',
    rating: 4.7,
    enrolled: '2,100+',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
    logo: '/download (2).jpg',
    category: 'Computer Science',
    categoryColor: '#D7FF54',
    accreditation: 'Internationally Accredited',
    highlights: ['Global degree', 'No prerequisites', 'Career support'],
  },
  {
    id: 'msba-ai',
    title: 'Master of Science in Business Analytics',
    university: 'AI Business School',
    location: 'Global',
    degree: 'MS in Business Analytics',
    duration: '2 years',
    cost: '$40,000',
    rating: 4.6,
    enrolled: '1,900+',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    logo: '/Bit_ai_ AI-Powered Documents, Wikis, & Knowledge Management for Teams.jpg',
    category: 'Business Analytics',
    categoryColor: '#7DEBA3',
    accreditation: 'Accredited',
    highlights: ['Top program', 'Analytics bootcamp', 'Industry capstone'],
  },
  {
    id: 'btech-iit3',
    title: 'Bachelor of Technology in Computer Science',
    university: 'Indian Institute of Technology',
    location: 'India',
    degree: 'BTech CSE',
    duration: '4 years',
    cost: '₹8,00,000',
    rating: 4.9,
    enrolled: '2,500+',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80',
    logo: '/Indian Institutes of Technology Logo (IITs).jpg',
    category: 'Computer Science',
    categoryColor: '#D7FF54',
    accreditation: 'UGC Approved',
    highlights: ['Premier IIT', 'World-class faculty', 'Placement excellence'],
  },
  {
    id: 'msds-oxford3',
    title: 'Master of Data Science',
    university: 'University of Oxford',
    location: 'Oxford, UK',
    degree: 'MDS',
    duration: '2 years',
    cost: '£30,000',
    rating: 4.8,
    enrolled: '1,400+',
    thumbnail: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&q=80',
    logo: '/The Onoto Pen Company unveils the University of Oxford Collection - INKED HAPPINESS.jpg',
    category: 'Data Science',
    categoryColor: '#A98BFF',
    accreditation: 'Oxford Certified',
    highlights: ['Top-ranked university', 'Research focus', 'Global recognition'],
  },
];

const STATS = [
  { label: 'Degree Programs', value: '50+', icon: <GraduationCap size={18} color="#A98BFF" />, bg: '#EDE9FF' },
  { label: 'Partner Universities', value: '35+', icon: <Globe size={18} color="#83D6FF" />, bg: '#E0F5FF' },
  { label: 'Graduates', value: '100K+', icon: <Users size={18} color="#059669" />, bg: '#ECFDF5' },
  { label: 'Countries', value: '190+', icon: <Award size={18} color="#FF6D70" />, bg: '#FFF0F0' },
];

const CATEGORIES = [
  { name: 'Computer Science', count: 15, color: '#D7FF54', textColor: '#111' },
  { name: 'Business', count: 12, color: '#FFB259', textColor: '#111' },
  { name: 'Data Science', count: 18, color: '#A98BFF', textColor: '#fff' },
  { name: 'Engineering', count: 8, color: '#83D6FF', textColor: '#111' },
  { name: 'Health', count: 6, color: '#FF6D70', textColor: '#fff' },
  { name: 'Public Policy', count: 5, color: '#7DEBA3', textColor: '#111' },
];

const WHY_ONLINE_DEGREE = [
  {
    title: 'Accredited & Recognized',
    description: 'Earn the same degree as on-campus students from top-ranked universities.',
    icon: <Award size={24} color="#D7FF54" />,
    color: '#D7FF54',
  },
  {
    title: 'Flexible Learning',
    description: 'Study at your own pace while working full-time. No campus visits required.',
    icon: <Clock size={24} color="#83D6FF" />,
    color: '#83D6FF',
  },
  {
    title: 'Cost-Effective',
    description: 'Save on housing, commute, and living expenses. Financial aid available.',
    icon: <TrendingUp size={24} color="#7DEBA3" />,
    color: '#7DEBA3',
  },
  {
    title: 'Career Advancement',
    description: 'Increase earning potential and open doors to leadership positions.',
    icon: <BookOpen size={24} color="#A98BFF" />,
    color: '#A98BFF',
  },
];

export default function Degrees({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter degrees by selected category
  const filteredDegrees = selectedCategory
    ? DEGREE_PROGRAMS.filter(degree => degree.category === selectedCategory)
    : DEGREE_PROGRAMS;

  return (
    <div className="flex-1 py-4 px-4 md:pr-4 md:pl-2 overflow-y-auto no-scrollbar space-y-5 animate-in">

      {/* Hero Section */}
      <div
        className="relative rounded-4xl overflow-hidden p-8"
        style={{
          background: 'linear-gradient(135deg, #1a1a2e 0%, #0f0f0f 50%, #16213e 100%)',
          minHeight: '280px',
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #A98BFF, transparent 70%)', transform: 'translate(40%, -40%)' }} />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #D7FF54, transparent 70%)', transform: 'translateY(50%)' }} />

        <div className="relative z-10 max-w-3xl">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5 text-xs font-bold"
            style={{ background: 'rgba(169,139,255,0.15)', color: '#A98BFF', border: '1px solid rgba(169,139,255,0.3)' }}
          >
            <GraduationCap size={14} />
            100% Online · Accredited · Career-Focused
          </div>

          <h1 className="text-hero text-white mb-3">
            Earn Your Degree
            <br />
            <span style={{ color: '#A98BFF' }}>100% Online</span>
          </h1>
          <p className="text-white/60 text-base mb-6 max-w-2xl leading-relaxed">
            Study bachelor's and master's degrees from world-class universities. Same quality, same credentials, more flexibility.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => onNavigate('explore')}
              className="px-6 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 hover:opacity-90 flex items-center gap-2"
              style={{ background: '#A98BFF', color: 'white' }}
            >
              Explore Degrees <ChevronRight size={16} />
            </button>
            <button
              className="px-6 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 hover:bg-white/20 border-2"
              style={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}
            >
              Download Brochure
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
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

      {/* Categories Filter */}
      <div className="card-static p-5 rounded-3xl">
        <h3 className="text-sm font-bold text-text mb-3">Browse by Field</h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(selectedCategory === cat.name ? null : cat.name)}
              className={`px-4 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 hover:scale-105 ${
                selectedCategory === cat.name ? 'shadow-lg scale-105 ring-2 ring-offset-2' : 'hover:shadow-lg'
              }`}
              style={{ 
                background: cat.color, 
                color: cat.textColor,
                ringColor: selectedCategory === cat.name ? cat.color : 'transparent'
              }}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory(null)}
            className="mt-3 text-xs font-bold text-muted hover:text-text transition-colors"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Featured Programs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-card-title text-text">
            {selectedCategory ? `${selectedCategory} Programs` : 'Featured Degree Programs'}
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">{filteredDegrees.length} / {DEGREE_PROGRAMS.length} programs</span>
          </div>
        </div>
        {filteredDegrees.length === 0 ? (
          <div className="card-static p-12 rounded-4xl text-center">
            <p className="text-muted text-sm">No programs found in this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredDegrees.map((degree) => (
            <div
              key={degree.id}
              className="card-static rounded-4xl overflow-hidden cursor-pointer hover:-translate-y-1 transition-all duration-200 hover:shadow-2xl group"
            >
              {/* Thumbnail */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={degree.thumbnail}
                  alt={degree.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* University Logo */}
                <div className="absolute top-3 left-3">
                  <div 
                    className="bg-white rounded-2xl p-2.5 shadow-lg flex items-center justify-center" 
                    style={{ minWidth: '64px', minHeight: '64px' }}
                  >
                    <img
                      src={degree.logo}
                      alt={degree.university}
                      className="h-14 w-14 object-contain"
                    />
                  </div>
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 right-3">
                  <span
                    className="px-3 py-1.5 rounded-full text-xs font-bold shadow-lg"
                    style={{ background: degree.categoryColor, color: degree.categoryColor === '#D7FF54' || degree.categoryColor === '#FFB259' || degree.categoryColor === '#83D6FF' || degree.categoryColor === '#7DEBA3' ? '#111' : '#fff' }}
                  >
                    {degree.category}
                  </span>
                </div>

                {/* Cost & Duration */}
                <div className="absolute bottom-3 left-3 flex gap-2">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 text-text">
                    <Clock size={10} className="inline mr-1" />
                    {degree.duration}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-white/90 text-text">
                    {degree.cost}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="mb-3">
                  <h3 className="font-bold text-base text-text mb-1 leading-tight">{degree.title}</h3>
                  <p className="text-sm font-semibold text-muted">{degree.university}</p>
                  <p className="text-xs text-muted/70 flex items-center gap-1 mt-0.5">
                    <Globe size={10} />
                    {degree.location}
                  </p>
                </div>

                {/* Degree name */}
                <div className="mb-3 p-2.5 rounded-xl bg-bg">
                  <p className="text-xs font-bold text-text">{degree.degree}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4 text-xs">
                  <div className="flex items-center gap-1">
                    <Star size={12} fill="#F59E0B" color="#F59E0B" />
                    <span className="font-bold text-text">{degree.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted">
                    <Users size={12} />
                    <span>{degree.enrolled} enrolled</span>
                  </div>
                </div>

                {/* Highlights */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {degree.highlights.map((highlight, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 rounded-full text-[10px] font-semibold bg-bg text-text"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Accreditation */}
                <div className="flex items-center gap-2 mb-4 p-2 rounded-xl" style={{ background: '#ECFDF5' }}>
                  <Award size={12} color="#059669" />
                  <span className="text-xs font-bold" style={{ color: '#059669' }}>
                    {degree.accreditation}
                  </span>
                </div>

                {/* CTA */}
                <button
                  className="w-full py-3 rounded-2xl text-sm font-bold transition-all duration-200 hover:opacity-90 flex items-center justify-center gap-2"
                  style={{ background: degree.categoryColor, color: degree.categoryColor === '#D7FF54' || degree.categoryColor === '#FFB259' || degree.categoryColor === '#83D6FF' || degree.categoryColor === '#7DEBA3' ? '#111' : '#fff' }}
                >
                  View Program Details <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>

      {/* Why Choose Online Degree */}
      <div className="card-static p-7 rounded-4xl">
        <h2 className="text-card-title text-text mb-6 text-center">Why Choose an Online Degree?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {WHY_ONLINE_DEGREE.map((item) => (
            <div key={item.title} className="text-center">
              <div
                className="w-14 h-14 rounded-3xl flex items-center justify-center mx-auto mb-4"
                style={{ background: item.color + '20' }}
              >
                {item.icon}
              </div>
              <h3 className="font-bold text-sm text-text mb-2">{item.title}</h3>
              <p className="text-xs text-muted leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Success Stories */}
      <div
        className="p-7 rounded-4xl"
        style={{ background: 'linear-gradient(135deg, #EDE9FF 0%, #E0F5FF 100%)' }}
      >
        <h2 className="text-card-title text-text mb-5 text-center">Graduate Success Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: 'Rajesh Kumar',
              degree: 'MS in Data Science - IIT Madras',
              role: 'Senior Data Scientist at Amazon',
              avatar: 'https://i.pravatar.cc/150?img=12',
              quote: 'The IIT Madras online degree transformed my career. I could work full-time while earning a world-class degree.',
            },
            {
              name: 'Emily Chen',
              degree: 'MCIT - University of Pennsylvania',
              role: 'Software Engineer at Google',
              avatar: 'https://i.pravatar.cc/150?img=45',
              quote: 'Penn\'s MCIT program gave me the skills to transition into tech without any CS background.',
            },
            {
              name: 'Amit Patel',
              degree: 'MBA - Imperial College London',
              role: 'Product Manager at Microsoft',
              avatar: 'https://i.pravatar.cc/150?img=33',
              quote: 'Imperial\'s Global MBA connected me with professionals worldwide and accelerated my career growth.',
            },
          ].map((story) => (
            <div key={story.name} className="bg-white/70 backdrop-blur rounded-3xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <img src={story.avatar} alt={story.name} className="w-12 h-12 rounded-2xl object-cover" />
                <div>
                  <p className="text-sm font-bold text-text">{story.name}</p>
                  <p className="text-xs text-muted">{story.role}</p>
                </div>
              </div>
              <p className="text-xs text-text/80 italic mb-2">"{story.quote}"</p>
              <p className="text-[10px] font-semibold text-muted">{story.degree}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Aid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card-static p-6 rounded-4xl">
          <div className="w-12 h-12 rounded-3xl flex items-center justify-center mb-4" style={{ background: '#ECFDF5' }}>
            <TrendingUp size={24} color="#059669" />
          </div>
          <h3 className="font-bold text-lg text-text mb-2">Financial Aid Available</h3>
          <p className="text-sm text-muted mb-4 leading-relaxed">
            Most programs offer financial aid, scholarships, and flexible payment plans. Make your education affordable.
          </p>
          <button className="text-sm font-bold flex items-center gap-1" style={{ color: '#059669' }}>
            Learn About Aid Options <ChevronRight size={14} />
          </button>
        </div>
        <div className="card-static p-6 rounded-4xl">
          <div className="w-12 h-12 rounded-3xl flex items-center justify-center mb-4" style={{ background: '#EDE9FF' }}>
            <BookOpen size={24} color="#A98BFF" />
          </div>
          <h3 className="font-bold text-lg text-text mb-2">Admissions Support</h3>
          <p className="text-sm text-muted mb-4 leading-relaxed">
            Get help with applications, requirements, and choosing the right program for your career goals.
          </p>
          <button className="text-sm font-bold flex items-center gap-1" style={{ color: '#A98BFF' }}>
            Talk to an Advisor <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="h-4" />
    </div>
  );
}


