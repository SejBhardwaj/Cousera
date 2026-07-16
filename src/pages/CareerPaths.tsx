import { TrendingUp, Users, Clock, ChevronRight, Briefcase, Star, ArrowRight, DollarSign } from 'lucide-react';

const PATHS = [
  {
    title: 'Data Analyst',
    description: 'Transform raw data into business insights using statistical analysis and visualization tools.',
    avgSalary: '$85K',
    demand: 'High',
    courses: 8,
    duration: '6 months',
    color: '#D7FF54',
    textColor: '#111',
    skills: ['SQL', 'Python', 'Tableau', 'Statistics', 'Excel'],
    employers: ['Google', 'Amazon', 'Microsoft', 'Netflix'],
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80',
  },
  {
    title: 'UX Designer',
    description: 'Create user-centered digital experiences that are both beautiful and functional.',
    avgSalary: '$95K',
    demand: 'High',
    courses: 7,
    duration: '5 months',
    color: '#FF6D70',
    textColor: '#fff',
    skills: ['Figma', 'User Research', 'Prototyping', 'Accessibility', 'Design Systems'],
    employers: ['Apple', 'Airbnb', 'Spotify', 'Stripe'],
    thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&q=80',
  },
  {
    title: 'Cloud Engineer',
    description: 'Design and manage scalable cloud infrastructure across AWS, GCP, and Azure.',
    avgSalary: '$130K',
    demand: 'Very High',
    courses: 10,
    duration: '8 months',
    color: '#83D6FF',
    textColor: '#111',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Python'],
    employers: ['Amazon', 'Google', 'Microsoft', 'Cloudflare'],
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80',
  },
  {
    title: 'ML Engineer',
    description: 'Build and deploy production machine learning systems at scale.',
    avgSalary: '$148K',
    demand: 'Explosive',
    courses: 12,
    duration: '10 months',
    color: '#A98BFF',
    textColor: '#fff',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'Spark'],
    employers: ['OpenAI', 'DeepMind', 'Anthropic', 'Meta'],
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&q=80',
  },
  {
    title: 'Product Manager',
    description: 'Lead product strategy and work cross-functionally to ship products users love.',
    avgSalary: '$125K',
    demand: 'High',
    courses: 6,
    duration: '4 months',
    color: '#FFB259',
    textColor: '#111',
    skills: ['Strategy', 'Analytics', 'Leadership', 'SQL', 'Roadmapping'],
    employers: ['Google', 'Meta', 'LinkedIn', 'Shopify'],
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80',
  },
  {
    title: 'Cybersecurity Analyst',
    description: 'Protect organizations from digital threats and vulnerabilities.',
    avgSalary: '$112K',
    demand: 'Very High',
    courses: 9,
    duration: '7 months',
    color: '#7DEBA3',
    textColor: '#111',
    skills: ['Network Security', 'SIEM', 'Penetration Testing', 'Compliance', 'Python'],
    employers: ['IBM', 'Palo Alto', 'CrowdStrike', 'Cisco'],
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80',
  },
];

const DEMAND_COLORS: Record<string, { bg: string; text: string }> = {
  'High': { bg: '#ECFDF5', text: '#059669' },
  'Very High': { bg: '#EFF6FF', text: '#2563EB' },
  'Explosive': { bg: '#FFF0F0', text: '#FF6D70' },
};

export default function CareerPaths() {
  return (
    <div className="flex-1 py-4 pr-4 pl-2 overflow-y-auto no-scrollbar space-y-5 animate-in">

      {/* Hero */}
      <div
        className="p-8 rounded-4xl"
        style={{ background: 'linear-gradient(135deg, #0F0F0F 0%, #1a1a2e 100%)' }}
      >
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-2xl flex items-center justify-center" style={{ background: '#D7FF54' }}>
              <TrendingUp size={16} color="#111" />
            </div>
            <span className="text-xs font-bold text-white/40 uppercase tracking-wider">Career Paths</span>
          </div>
          <h1 className="text-section text-white mb-3">Build a career you'll love</h1>
          <p className="text-white/60 text-sm leading-relaxed mb-6">
            Job-ready learning programs built in collaboration with leading companies.
            Get the exact skills hiring managers are looking for.
          </p>
          <div className="flex gap-6">
            {[
              { label: 'Career Paths', value: '50+' },
              { label: 'Partner Companies', value: '3,800+' },
              { label: 'Learners Hired', value: '1M+' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-black text-white">{s.value}</div>
                <div className="text-white/40 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Career Path Cards */}
      <div className="space-y-4">
        {PATHS.map((path) => {
          const demandStyle = DEMAND_COLORS[path.demand] || DEMAND_COLORS['High'];
          return (
            <div
              key={path.title}
              className="card-static rounded-4xl overflow-hidden p-0 cursor-pointer group hover:-translate-y-1 transition-transform duration-200"
            >
              <div className="flex">
                {/* Thumbnail */}
                <div className="w-52 flex-shrink-0 relative overflow-hidden">
                  <img src={path.thumbnail} alt={path.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0" style={{ background: path.color + 'CC' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Briefcase size={40} color={path.textColor} />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-7">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-card-title text-text">{path.title}</h2>
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                          style={{ background: demandStyle.bg, color: demandStyle.text }}
                        >
                          {path.demand} Demand
                        </span>
                      </div>
                      <p className="text-sm text-muted leading-relaxed max-w-lg">{path.description}</p>
                    </div>
                    <div className="text-right ml-6 flex-shrink-0">
                      <div className="flex items-center gap-1 text-text mb-1">
                        <DollarSign size={16} />
                        <span className="text-2xl font-black">{path.avgSalary}</span>
                      </div>
                      <p className="text-xs text-muted">avg. salary</p>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-5 mb-4 text-xs text-muted">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: path.color }}>
                        <Star size={8} color={path.textColor} />
                      </div>
                      <span>{path.courses} courses</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock size={12} />
                      <span>{path.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users size={12} />
                      <span>50K+ enrolled</span>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {path.skills.map((s) => (
                      <span key={s} className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: path.color + '20', color: '#0F0F0F' }}>
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted">Hiring at:</span>
                      <div className="flex gap-2">
                        {path.employers.slice(0, 3).map((e) => (
                          <span key={e} className="text-xs font-bold text-text px-2 py-1 rounded-lg" style={{ background: '#F6F6F8' }}>
                            {e}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button
                      className="flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
                      style={{ background: path.color, color: path.textColor }}
                    >
                      Explore Path <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="h-4" />
    </div>
  );
}
