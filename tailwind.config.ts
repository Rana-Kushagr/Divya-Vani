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
          surface: '#111114',
          card: '#18181B',
        },
        alabaster: {
          DEFAULT: '#FFFFFF',
          surface: '#FAFAFA',
          muted: '#F4F4F5',
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
      borderWidth: {
        '2': '2px',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'black-block': '0 8px 30px rgba(0, 0, 0, 0.45)',
        'white-block': '0 8px 30px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
};

export default config;
