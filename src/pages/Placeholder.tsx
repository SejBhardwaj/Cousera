import { LucideIcon } from 'lucide-react';

interface PlaceholderProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  accent?: string;
}

export default function Placeholder({ title, description, icon, accent = '#D7FF54' }: PlaceholderProps) {
  return (
    <div className="flex-1 py-4 pr-4 pl-2 overflow-y-auto no-scrollbar animate-in">
      <div className="h-full flex items-center justify-center min-h-96">
        <div className="text-center max-w-sm">
          <div
            className="w-20 h-20 rounded-4xl flex items-center justify-center mx-auto mb-6"
            style={{ background: accent }}
          >
            <div className="scale-125">{icon}</div>
          </div>
          <h1 className="text-section text-text mb-3">{title}</h1>
          <p className="text-muted text-sm leading-relaxed">{description}</p>
          <div
            className="mt-6 px-6 py-3 rounded-2xl inline-block text-sm font-bold cursor-pointer hover:opacity-80 transition-opacity"
            style={{ background: '#111', color: '#fff' }}
          >
            Coming Soon
          </div>
        </div>
      </div>
    </div>
  );
}
