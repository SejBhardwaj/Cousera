import { ChevronRight, TrendingUp } from 'lucide-react';
import type { Page } from '../components/Sidebar';

const CATEGORIES = [
  {
    name: 'Data Science',
    description: 'Statistics, machine learning, data visualization, and AI.',
    courses: 1400,
    color: '#D7FF54',
    textColor: '#111',
    trending: ['Python', 'Machine Learning', 'Deep Learning', 'SQL'],
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
  },
  {
    name: 'Technology',
    description: 'Cloud computing, cybersecurity, software development, and DevOps.',
    courses: 1800,
    color: '#83D6FF',
    textColor: '#111',
    trending: ['AWS', 'React', 'DevOps', 'Kubernetes'],
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
  },
  {
    name: 'Business',
    description: 'Leadership, entrepreneurship, project management, and strategy.',
    courses: 980,
    color: '#FFB259',
    textColor: '#111',
    trending: ['Leadership', 'Product Management', 'Agile', 'Finance'],
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80',
  },
  {
    name: 'Design',
    description: 'UI/UX design, graphic design, product design, and motion graphics.',
    courses: 620,
    color: '#A98BFF',
    textColor: '#fff',
    trending: ['Figma', 'UX Research', 'Motion Design', 'Branding'],
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',
  },
  {
    name: 'Marketing',
    description: 'Digital marketing, SEO, content strategy, and social media.',
    courses: 380,
    color: '#FF6D70',
    textColor: '#fff',
    trending: ['SEO', 'Content Marketing', 'Analytics', 'Social Media'],
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
  },
  {
    name: 'Personal Development',
    description: 'Productivity, communication, leadership, and mindfulness.',
    courses: 430,
    color: '#7DEBA3',
    textColor: '#111',
    trending: ['Productivity', 'Public Speaking', 'Writing', 'Career'],
    thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80',
  },
  {
    name: 'Finance',
    description: 'Investment, accounting, financial modeling, and FinTech.',
    courses: 290,
    color: '#FFB3C6',
    textColor: '#111',
    trending: ['Excel', 'Financial Modeling', 'Crypto', 'Accounting'],
    thumbnail: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=600&q=80',
  },
  {
    name: 'Health & Medicine',
    description: 'Public health, bioinformatics, clinical research, and nutrition.',
    courses: 210,
    color: '#FF6D70',
    textColor: '#fff',
    trending: ['Bioinformatics', 'Public Health', 'Clinical Trials', 'R'],
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80',
  },
];

export default function Categories({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <div className="flex-1 py-4 pr-4 pl-2 overflow-y-auto no-scrollbar space-y-5 animate-in">

      {/* Header */}
      <div className="card-static p-7 rounded-4xl">
        <h1 className="text-section text-text mb-2">All Categories</h1>
        <p className="text-muted text-sm">Explore courses across every discipline. Over 7,000 courses from 300+ world-class institutions.</p>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 gap-4">
        {CATEGORIES.map((cat) => (
          <div
            key={cat.name}
            className="rounded-4xl overflow-hidden cursor-pointer group hover:-translate-y-1 transition-transform duration-200"
            style={{ boxShadow: '0 4px 28px rgba(0,0,0,0.07)' }}
            onClick={() => onNavigate('explore')}
          >
            {/* Image header */}
            <div className="relative h-36 overflow-hidden">
              <img
                src={cat.thumbnail}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0" style={{ background: cat.color + 'CC' }} />
              <div className="absolute inset-0 p-5 flex flex-col justify-end">
                <h2 className="font-black text-xl mb-1" style={{ color: cat.textColor }}>{cat.name}</h2>
                <p className="text-sm font-semibold" style={{ color: cat.textColor, opacity: 0.7 }}>
                  {cat.courses.toLocaleString()} courses
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="bg-white p-5">
              <p className="text-sm text-muted leading-relaxed mb-4">{cat.description}</p>

              <div className="flex items-center gap-1.5 mb-4">
                <TrendingUp size={12} color="#6B6B7B" />
                <span className="text-xs font-semibold text-muted">Trending:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {cat.trending.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ background: cat.color + '25', color: '#0F0F0F' }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <button className="w-full mt-4 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-80" style={{ background: cat.color, color: cat.textColor }}>
                Browse {cat.name} <ChevronRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="h-4" />
    </div>
  );
}
