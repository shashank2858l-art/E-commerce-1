import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        neon: {
          green: 'var(--neon-green)',
          teal: 'var(--neon-teal)',
          dim: 'var(--neon-dim)',
        },
        surface: {
          DEFAULT: 'var(--surface)',
          low: 'var(--surface-low)',
          mid: 'var(--surface-mid)',
          high: 'var(--surface-high)',
          highest: 'var(--surface-highest)',
        },
        accent: {
          green: 'var(--neon-green)',
          teal: 'var(--neon-teal)',
          purple: '#BF5AF2',
          gold: '#FFD700',
          orange: '#FF6B35',
          red: '#FF4D4D',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          dim: 'var(--muted-dim)',
          dark: 'var(--muted-dark)',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slide-up 0.6s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(57,255,20,0.15)' },
          '50%': { boxShadow: '0 0 40px rgba(57,255,20,0.3)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
