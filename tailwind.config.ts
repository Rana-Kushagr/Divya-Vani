import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#09090B',
          surface: '#121215',
          elevated: '#18181B',
        },
        alabaster: {
          DEFAULT: '#FFFFFF',
          muted: '#F8FAFC',
          card: '#F4F4F5',
        },
        structural: {
          dark: '#27272A',
          light: '#E4E4E7',
        },
        royal: {
          DEFAULT: '#6D28D9',
          hover: '#5B21B6',
          light: '#EDE9FE',
        },
        mint: {
          DEFAULT: '#10B981',
          hover: '#059669',
          light: '#D1FAE5',
        },
        amber: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
          light: '#FEF3C7',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      borderWidth: {
        '1.5': '1.5px',
      },
      boxShadow: {
        'block-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.45)',
        'block-light': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};

export default config;
