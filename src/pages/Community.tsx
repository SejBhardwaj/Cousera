import { Users, MessageCircle, TrendingUp, Heart, Share2, Bookmark, Plus, Flame } from 'lucide-react';

const POSTS = [
  {
    author: 'Priya Sharma',
    avatar: 'https://i.pravatar.cc/150?img=32',
    role: 'ML Engineer at Google',
    time: '2h ago',
    content: 'Just completed the Machine Learning Specialization! The neural networks module blew my mind. Highly recommend to anyone looking to break into AI.',
    likes: 247,
    comments: 34,
    tags: ['MachineLearning', 'AI', 'Career'],
    accent: '#D7FF54',
  },
  {
    author: 'Marcus Lee',
    avatar: 'https://i.pravatar.cc/150?img=33',
    role: 'Data Scientist at Netflix',
    time: '5h ago',
    content: "Study tip that changed everything for me: I switched from passive video watching to active coding. For every concept, I immediately implement it from scratch. My retention went from ~30% to ~85%.",
    likes: 412,
    comments: 67,
    tags: ['StudyTips', 'Learning', 'DataScience'],
    accent: '#A98BFF',
  },
  {
    author: 'Sofia Rodriguez',
    avatar: 'https://i.pravatar.cc/150?img=47',
    role: 'UX Lead at Airbnb',
    time: '1d ago',
    content: "Got my first design job offer! 6 months ago I knew nothing about UX. Google's certificate + Coursera community = life changed. DM me if you want to chat about the journey.",
    likes: 892,
    comments: 156,
    tags: ['SuccessStory', 'UXDesign', 'CareerChange'],
    accent: '#FF6D70',
  },
];

const GROUPS = [
  { name: 'ML Study Group', members: '12.4K', color: '#A98BFF', active: 234 },
  { name: 'Python Beginners', members: '45K', color: '#D7FF54', active: 891 },
  { name: 'Data Visualization', members: '8.2K', color: '#83D6FF', active: 167 },
  { name: 'Career Changers', members: '29K', color: '#FF6D70', active: 445 },
];

export default function Community() {
  return (
    <div className="flex-1 py-4 px-4 md:pr-4 md:pl-2 overflow-y-auto no-scrollbar space-y-5 animate-in">

      {/* Header */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 card-static p-7 rounded-4xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-section text-text">Community</h1>
              <p className="text-muted text-sm mt-1">Connect, share, and grow together</p>
            </div>
            <button className="btn-primary flex items-center gap-2">
              <Plus size={15} />
              New Post
            </button>
          </div>
          <div className="flex gap-3">
            {[
              { label: 'Posts Today', value: '1,247' },
              { label: 'Active Learners', value: '48K' },
              { label: 'Study Groups', value: '340' },
            ].map((s) => (
              <div key={s.label} className="flex-1 p-4 rounded-3xl" style={{ background: '#F6F6F8' }}>
                <div className="text-2xl font-black text-text">{s.value}</div>
                <div className="text-xs text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div
          className="p-6 rounded-4xl flex flex-col justify-between"
          style={{ background: 'linear-gradient(135deg, #111 0%, #1a1a2e 100%)' }}
        >
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4" style={{ background: '#D7FF54' }}>
            <TrendingUp size={18} color="#111" />
          </div>
          <div>
            <p className="text-white font-bold mb-1 flex items-center gap-1">
              Trending Topic
            </p>
            <p className="text-white/50 text-xs mb-3 flex items-center gap-1">
              <Flame size={12} /> Generative AI discussion
            </p>
            <button className="text-xs font-bold px-4 py-2 rounded-xl" style={{ background: '#D7FF54', color: '#111' }}>
              Join Discussion
            </button>
          </div>
        </div>
      </div>

      {/* Study Groups */}
      <div className="card-static p-6 rounded-4xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-2xl flex items-center justify-center" style={{ background: '#EDE9FF' }}>
              <Users size={15} color="#A98BFF" />
            </div>
            <h2 className="text-card-title text-text">Study Groups</h2>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {GROUPS.map((g) => (
            <div
              key={g.name}
              className="p-4 rounded-3xl cursor-pointer hover:-translate-y-1 transition-transform duration-200"
              style={{ background: g.color + '18', border: `1.5px solid ${g.color}40` }}
            >
              <div className="w-8 h-8 rounded-2xl mb-3" style={{ background: g.color }} />
              <p className="font-bold text-sm text-text mb-1">{g.name}</p>
              <p className="text-xs text-muted">{g.members} members</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
                <span className="text-[10px] text-muted">{g.active} online</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {POSTS.map((post, i) => (
          <div key={i} className="card-static p-6 rounded-4xl">
            <div className="flex items-start gap-4">
              <img src={post.avatar} alt={post.author} className="w-11 h-11 rounded-2xl object-cover flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <p className="font-bold text-text">{post.author}</p>
                    <p className="text-xs text-muted">{post.role} · {post.time}</p>
                  </div>
                </div>
                <p className="text-sm text-text leading-relaxed mt-3 mb-4">{post.content}</p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {post.tags.map((t) => (
                    <span key={t} className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: post.accent + '20', color: '#0F0F0F' }}>
                      #{t}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-5 pt-4 border-t border-border">
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-text transition-colors">
                    <Heart size={14} /> {post.likes.toLocaleString()}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-text transition-colors">
                    <MessageCircle size={14} /> {post.comments}
                  </button>
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-text transition-colors ml-auto">
                    <Share2 size={14} />
                  </button>
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-text transition-colors">
                    <Bookmark size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="h-4" />
    </div>
  );
}


