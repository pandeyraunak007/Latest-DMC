import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Dark mode colors (default)
        background: '#0F0F0F',
        foreground: '#F4F4F5',
        muted: '#A1A1AA',
        'muted-dark': '#71717A',
        border: '#27272A',
        'border-light': '#3F3F46',
        primary: '#8B5CF6',
        'primary-hover': '#7C3AED',
        secondary: '#52525B',
        panel: '#18181B',
        hover: '#27272A',
      },
      // Additional color utilities for both modes
      backgroundColor: {
        'dark-bg': '#0F0F0F',
        'dark-panel': '#18181B',
        'light-bg': '#F9FAFB',
        'light-panel': '#FFFFFF',
      },
      textColor: {
        'dark-primary': '#F4F4F5',
        'dark-secondary': '#A1A1AA',
        'light-primary': '#111827',
        'light-secondary': '#6B7280',
      },
      borderColor: {
        'dark-border': '#27272A',
        'light-border': '#E5E7EB',
      },
    },
  },
  plugins: [],
};
export default config;