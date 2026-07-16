/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F6F6F8',
        sidebar: '#111111',
        card: '#FFFFFF',
        lime: '#D7FF54',
        'lime-dim': '#c5ed3e',
        purple: '#A98BFF',
        'purple-dim': '#9070ff',
        blue: '#83D6FF',
        coral: '#FF6D70',
        pink: '#FFB3C6',
        green: '#7DEBA3',
        orange: '#FFB259',
        text: '#0F0F0F',
        muted: '#6B6B7B',
        border: '#EBEBF0',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        hero: ['60px', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '700' }],
        section: ['32px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        card: ['21px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
      },
      boxShadow: {
        float: '0 4px 32px rgba(0,0,0,0.08)',
        'float-md': '0 8px 40px rgba(0,0,0,0.12)',
        'float-lg': '0 16px 60px rgba(0,0,0,0.16)',
        glow: '0 0 20px rgba(215,255,84,0.3)',
        'glow-purple': '0 0 20px rgba(169,139,255,0.35)',
        'glow-blue': '0 0 20px rgba(131,214,255,0.35)',
        'glow-coral': '0 0 20px rgba(255,109,112,0.35)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
        'count-up': 'countUp 1s ease-out',
        'progress-fill': 'progressFill 1.2s ease-out',
        'float-bob': 'floatBob 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(16px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        progressFill: { '0%': { width: '0%' }, '100%': { width: 'var(--progress)' } },
        floatBob: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-6px)' } },
      },
    },
  },
  plugins: [],
};
