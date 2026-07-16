import { GraduationCap, TrendingUp, Star, Clock, Users, ChevronRight, Award, BookOpen, Globe } from 'lucide-react';
import type { Page } from '../components/Sidebar';

const DEGREE_PROGRAMS = [
  {
    id: 'mscs-uiuc',
    title: 'Master of Computer Science',
    university: 'University of Illinois Urbana-Champaign',
    location: 'Illinois, USA',
    degree: 'Master of Computer Science (MCS)',
    duration: '2-3 years',
    cost: '$21,440',
    rating: 4.8,
    enrolled: '5,200+',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/University_of_Illinois_at_Urbana-Champaign_logo.svg/120px-University_of_Illinois_at_Urbana-Champaign_logo.svg.png',
    category: 'Computer Science',
    categoryColor: '#D7FF54',
    accreditation: 'ABET Accredited',
    highlights: ['Same degree as on-campus', 'No GRE required', 'Top 5 CS program'],
  },
  {
    id: 'mba-imperial',
    title: 'Global Master of Business Administration',
    university: 'Imperial College London',
    location: 'London, UK',
    degree: 'Global MBA',
    duration: '2 years',
    cost: '£38,500',
    rating: 4.7,
    enrolled: '2,400+',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Imperial_College_London_Logo.svg/120px-Imperial_College_London_Logo.svg.png',
    category: 'Business',
    categoryColor: '#FFB259',
    accreditation: 'Triple Crown Accredited',
    highlights: ['Triple accreditation', 'Global immersions', 'Top 10 business school'],
  },
  {
    id: 'msds-michigan',
    title: 'Master of Applied Data Science',
    university: 'University of Michigan',
    location: 'Michigan, USA',
    degree: 'Master of Applied Data Science (MADS)',
    duration: '1.5-3 years',
    cost: '$48,000',
    rating: 4.9,
    enrolled: '3,800+',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Michigan_Wolverines_logo.svg/120px-Michigan_Wolverines_logo.svg.png',
    category: 'Data Science',
    categoryColor: '#A98BFF',
    accreditation: 'HLC Accredited',
    highlights: ['No GRE required', 'Portfolio-based capstone', 'Industry partnerships'],
  },
  {
    id: 'msis-iitm',
    title: 'Bachelor of Science in Data Science',
    university: 'Indian Institute of Technology Madras',
    location: 'Chennai, India',
    degree: 'BS in Data Science & Applications',
    duration: '3-4 years',
    cost: '₹2,75,000',
    rating: 4.8,
    enrolled: '15,000+',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/6/69/IIT_Madras_Logo.svg/120px-IIT_Madras_Logo.svg.png',
    category: 'Data Science',
    categoryColor: '#A98BFF',
    accreditation: 'UGC Approved',
    highlights: ['IIT degree certificate', 'Affordable tuition', 'Industry projects'],
  },
  {
    id: 'msee-stanford',
    title: 'Master of Science in Electrical Engineering',
    university: 'Stanford University',
    location: 'California, USA',
    degree: 'MS in Electrical Engineering',
    duration: '2-3 years',
    cost: '$56,169',
    rating: 4.9,
    enrolled: '1,200+',
    thumbnail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=600&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Seal_of_Stanford_University.svg/120px-Seal_of_Stanford_University.svg.png',
    category: 'Engineering',
    categoryColor: '#83D6FF',
    accreditation: 'WASC Accredited',
    highlights: ['Stanford degree', 'Cutting-edge research', 'Silicon Valley network'],
  },
  {
    id: 'mph-imperial',
    title: 'Master of Public Health',
    university: 'Imperial College London',
    location: 'London, UK',
    degree: 'MPH',
    duration: '2 years',
    cost: '£22,000',
    rating: 4.7,
    enrolled: '1,800+',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Imperial_College_London_Logo.svg/120px-Imperial_College_London_Logo.svg.png',
    category: 'Health',
    categoryColor: '#FF6D70',
    accreditation: 'APHEA Accredited',
    highlights: ['World-leading faculty', 'Global health focus', 'Research excellence'],
  },
  {
    id: 'bscs-london',
    title: 'Bachelor of Science in Computer Science',
    university: 'University of London',
    location: 'London, UK',
    degree: 'BSc Computer Science',
    duration: '3-6 years',
    cost: '£10,992',
    rating: 4.6,
    enrolled: '8,500+',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/University_of_London_logo.svg/120px-University_of_London_logo.svg.png',
    category: 'Computer Science',
    categoryColor: '#D7FF54',
    accreditation: 'Royal Charter',
    highlights: ['World-class degree', 'Flexible schedule', 'Career support'],
  },
  {
    id: 'mba-bits',
    title: 'Master of Business Administration',
    university: 'BITS Pilani',
    location: 'Pilani, India',
    degree: 'MBA',
    duration: '2 years',
    cost: '₹4,00,000',
    rating: 4.5,
    enrolled: '3,200+',
    thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/d/d3/BITS_Pilani-Logo.svg/120px-BITS_Pilani-Logo.svg.png',
    category: 'Business',
    categoryColor: '#FFB259',
    accreditation: 'NAAC A++ Accredited',
    highlights: ['Industry collaborations', 'Live projects', 'Strong alumni network'],
  },
  {
    id: 'msai-penn',
    title: 'Master of Computer & Information Technology',
    university: 'University of Pennsylvania',
    location: 'Pennsylvania, USA',
    degree: 'MCIT',
    duration: '1.5-2.5 years',
    cost: '$52,200',
    rating: 4.8,
    enrolled: '2,100+',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/UPenn_shield_with_banner.svg/120px-UPenn_shield_with_banner.svg.png',
    category: 'Computer Science',
    categoryColor: '#D7FF54',
    accreditation: 'Ivy League',
    highlights: ['Ivy League degree', 'No prerequisites', 'Career support'],
  },
  {
    id: 'msba-austin',
    title: 'Master of Science in Business Analytics',
    university: 'University of Texas at Austin',
    location: 'Texas, USA',
    degree: 'MS in Business Analytics',
    duration: '2 years',
    cost: '$42,000',
    rating: 4.7,
    enrolled: '1,900+',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/University_of_Texas_at_Austin_logo.svg/120px-University_of_Texas_at_Austin_logo.svg.png',
    category: 'Business Analytics',
    categoryColor: '#7DEBA3',
    accreditation: 'AACSB Accredited',
    highlights: ['Top McCombs program', 'Analytics bootcamp', 'Industry capstone'],
  },
  {
    id: 'btech-iitb',
    title: 'Bachelor of Technology in Computer Science',
    university: 'IIT Bombay',
    location: 'Mumbai, India',
    degree: 'BTech CSE',
    duration: '4 years',
    cost: '₹8,00,000',
    rating: 4.9,
    enrolled: '2,500+',
    thumbnail: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/Indian_Institute_of_Technology_Bombay_Logo.svg/120px-Indian_Institute_of_Technology_Bombay_Logo.svg.png',
    category: 'Computer Science',
    categoryColor: '#D7FF54',
    accreditation: 'NBA Accredited',
    highlights: ['Premier IIT', 'World-class faculty', 'Placement excellence'],
  },
  {
    id: 'msds-anu',
    title: 'Master of Data Science',
    university: 'Australian National University',
    location: 'Canberra, Australia',
    degree: 'MDS',
    duration: '2 years',
    cost: 'AUD $45,000',
    rating: 4.6,
    enrolled: '1,400+',
    thumbnail: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=600&q=80',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/2/2e/Australian_National_University_logo.svg/120px-Australian_National_University_logo.svg.png',
    category: 'Data Science',
    categoryColor: '#A98BFF',
    accreditation: 'TEQSA Registered',
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
  return (
    <div className="flex-1 py-4 pr-4 pl-2 overflow-y-auto no-scrollbar space-y-5 animate-in">

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
      <div className="grid grid-cols-4 gap-4">
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
              className="px-4 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 hover:scale-105 hover:shadow-lg"
              style={{ background: cat.color, color: cat.textColor }}
            >
              {cat.name} ({cat.count})
            </button>
          ))}
        </div>
      </div>

      {/* Featured Programs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-card-title text-text">Featured Degree Programs</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">{DEGREE_PROGRAMS.length} programs available</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {DEGREE_PROGRAMS.map((degree) => (
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
                  <div className="bg-white rounded-2xl p-2 shadow-lg">
                    <img
                      src={degree.logo}
                      alt={degree.university}
                      className="h-8 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
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
      </div>

      {/* Why Choose Online Degree */}
      <div className="card-static p-7 rounded-4xl">
        <h2 className="text-card-title text-text mb-6 text-center">Why Choose an Online Degree?</h2>
        <div className="grid grid-cols-4 gap-4">
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
        <div className="grid grid-cols-3 gap-4">
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
      <div className="grid grid-cols-2 gap-4">
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
