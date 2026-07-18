import { ChevronRight, TrendingUp, Sparkles, BookOpen, Users, Trophy, Zap } from 'lucide-react';
import type { Page } from '../components/Sidebar';

const CATEGORIES = [
  {
    name: 'Data Science',
    description: 'Statistics, machine learning, data visualization, and AI.',
    courses: 1400,
    gradient: 'from-emerald-400 via-teal-500 to-cyan-600',
    accentColor: '#10b981',
    icon: 'chart',
    trending: ['Python', 'Machine Learning', 'Deep Learning', 'SQL'],
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
  },
  {
    name: 'Technology',
    description: 'Cloud computing, cybersecurity, software development, and DevOps.',
    courses: 1800,
    gradient: 'from-red-700 via-red-800 to-red-900',
    accentColor: '#b91c1c',
    icon: 'code',
    trending: ['AWS', 'React', 'DevOps', 'Kubernetes'],
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
  },
  {
    name: 'Business',
    description: 'Leadership, entrepreneurship, project management, and strategy.',
    courses: 980,
    gradient: 'from-amber-400 via-orange-500 to-red-600',
    accentColor: '#f59e0b',
    icon: 'briefcase',
    trending: ['Leadership', 'Product Management', 'Agile', 'Finance'],
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
  },
  {
    name: 'Design',
    description: 'UI/UX design, graphic design, product design, and motion graphics.',
    courses: 620,
    gradient: 'from-yellow-400 via-yellow-500 to-amber-600',
    accentColor: '#eab308',
    icon: 'palette',
    trending: ['Figma', 'UX Research', 'Motion Design', 'Branding'],
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
  },
  {
    name: 'Marketing',
    description: 'Digital marketing, SEO, content strategy, and social media.',
    courses: 380,
    gradient: 'from-rose-400 via-pink-500 to-fuchsia-600',
    accentColor: '#ec4899',
    icon: 'megaphone',
    trending: ['SEO', 'Content Marketing', 'Analytics', 'Social Media'],
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
  },
  {
    name: 'Personal Development',
    description: 'Productivity, communication, leadership, and mindfulness.',
    courses: 430,
    gradient: 'from-sky-400 via-blue-500 to-indigo-600',
    accentColor: '#0ea5e9',
    icon: 'growth',
    trending: ['Productivity', 'Public Speaking', 'Writing', 'Career'],
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80',
  },
  {
    name: 'Finance',
    description: 'Investment, accounting, financial modeling, and FinTech.',
    courses: 290,
    gradient: 'from-sky-400 via-cyan-500 to-teal-600',
    accentColor: '#0ea5e9',
    icon: 'dollar',
    trending: ['Excel', 'Financial Modeling', 'Crypto', 'Accounting'],
    thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&q=80',
  },
  {
    name: 'Health & Medicine',
    description: 'Public health, bioinformatics, clinical research, and nutrition.',
    courses: 210,
    gradient: 'from-red-400 via-rose-500 to-pink-600',
    accentColor: '#ef4444',
    icon: 'heart',
    trending: ['Bioinformatics', 'Public Health', 'Clinical Trials', 'R'],
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
  },
];

export default function Categories({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <div className="flex-1 py-4 px-4 md:pr-4 md:pl-2 overflow-y-auto no-scrollbar space-y-5 animate-in">

      {/* Header */}
      <div className="card-static p-7 rounded-4xl">
        <h1 className="text-section text-text mb-2">All Categories</h1>
        <p className="text-muted text-sm">Explore courses across every discipline. Over 7,000 courses from 300+ world-class institutions.</p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {CATEGORIES.map((cat, index) => (
          <div
            key={cat.name}
            className="rounded-[32px] overflow-hidden cursor-pointer group relative"
            style={{ 
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              animation: `slideUp 0.5s ease-out ${index * 0.1}s backwards`
            }}
            onClick={() => onNavigate('explore')}
          >
            {/* Modern Image Header with Gradient Overlay */}
            <div className="relative h-44 overflow-hidden">
              {/* Background Image */}
              <img
                src={cat.thumbnail}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                style={{ filter: 'brightness(0.7)' }}
              />
              
              {/* Animated Gradient Overlay */}
              <div 
                className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-75 group-hover:opacity-85 transition-opacity duration-500`}
              />
              
              {/* Floating Orbs */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" style={{ background: cat.accentColor, transform: 'translate(30%, -30%)' }} />
              <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" style={{ background: 'white', transform: 'translate(-30%, 30%)' }} />
              
              {/* Content Overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                {/* Top Row - Icon & Course Count */}
                <div className="flex items-start justify-between">
                  <div 
                    className="w-14 h-14 rounded-[18px] flex items-center justify-center backdrop-blur-xl shadow-2xl group-hover:scale-110 transition-transform duration-300"
                    style={{ background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.3)' }}
                  >
                    <BookOpen size={24} color="white" strokeWidth={2.5} />
                  </div>
                  
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl backdrop-blur-xl" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}>
                    <Users size={14} color="white" strokeWidth={2.5} />
                    <span className="text-xs font-bold text-white">{cat.courses.toLocaleString()}</span>
                  </div>
                </div>
                
                {/* Bottom Row - Title */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={16} style={{ color: '#fbbf24' }} className="animate-pulse" />
                    <span className="text-xs font-bold" style={{ color: '#fbbf24' }}>TRENDING</span>
                  </div>
                  <h2 className="font-black text-3xl text-white mb-1 group-hover:translate-x-1 transition-transform duration-300">
                    {cat.name}
                  </h2>
                  <p className="text-sm font-semibold text-white/90">
                    Explore {cat.courses.toLocaleString()}+ courses
                  </p>
                </div>
              </div>
            </div>

            {/* Modern Content Section */}
            <div className="bg-white p-6">
              <p className="text-sm text-muted leading-relaxed mb-5">{cat.description}</p>

              {/* Trending Tags */}
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${cat.gradient} flex items-center justify-center shadow-lg`}>
                  <TrendingUp size={14} color="white" strokeWidth={3} />
                </div>
                <span className="text-xs font-black text-text">Trending Skills:</span>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-5">
                {cat.trending.map((t, i) => (
                  <span
                    key={t}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer"
                    style={{ 
                      background: `linear-gradient(135deg, ${cat.accentColor}15, ${cat.accentColor}25)`,
                      color: cat.accentColor,
                      border: `1.5px solid ${cat.accentColor}30`,
                      animation: `slideUp 0.4s ease-out ${0.7 + i * 0.1}s backwards`
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* CTA Button - Glassmorphism */}
              <button 
                className={`w-full py-3.5 rounded-[18px] text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-98 bg-gradient-to-r ${cat.gradient} text-white shadow-xl relative overflow-hidden group/btn`}
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                
                <Zap size={16} fill="white" strokeWidth={0} />
                <span>Browse {cat.name}</span>
                <ChevronRight size={16} strokeWidth={3} className="group-hover/btn:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
            
            {/* Hover Glow Effect */}
            <div 
              className="absolute inset-0 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ 
                boxShadow: `0 0 80px ${cat.accentColor}40`
              }}
            />
          </div>
        ))}
      </div>

      <div className="h-4" />
    </div>
  );
}


