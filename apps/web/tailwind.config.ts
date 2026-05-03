import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FDF6F0',
          100: '#FBE9DA',
          200: '#F5D3B5',
          300: '#EDB88C',
          400: '#E09A63',
          500: '#D48140',
          600: '#B8682D',
          700: '#945225',
          800: '#703E1E',
          900: '#4C2A17',
          950: '#2E180D',
        },
        accent: {
          50: '#FDF4F6',
          100: '#FAE8EC',
          200: '#F2D0D8',
          300: '#E6ACBB',
          400: '#D67D94',
          500: '#C55A75',
          600: '#A8415B',
          700: '#8A3349',
          800: '#6B2839',
          900: '#4A1C28',
        },
        warm: {
          50: '#FCFAF7',
          100: '#F8F3ED',
          200: '#F0E8DB',
          300: '#E5D7C0',
          400: '#D4C0A0',
          500: '#C0A882',
          600: '#A88E6A',
          700: '#8B7356',
          800: '#6B5944',
          900: '#4A3D2F',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        display: ['Georgia', 'Playfair Display', 'serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(74, 61, 47, 0.06), 0 2px 8px rgba(74, 61, 47, 0.04)',
        'card-hover': '0 2px 6px rgba(74, 61, 47, 0.08), 0 4px 16px rgba(74, 61, 47, 0.06)',
        'nav': '0 -1px 3px rgba(74, 61, 47, 0.04)',
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg, #FDF6F0 0%, #FAE8EC 100%)',
        'gradient-card': 'linear-gradient(180deg, #FFFFFF 0%, #FCFAF7 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
