/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#1b1b1e',
          card: '#252528',
          cardHover: '#2d2d32',
          border: '#36363a',
          sidebar: '#141416',
          text: '#e6edf3',
          muted: '#8b949e',
          accent: '#00dc82',
          cyan: '#38bdf8',
          crimson: '#f43f5e',
          amber: '#fbbf24',
          purple: '#c084fc'
        },
      },
      fontFamily: {
        sans: ['"Source Sans Pro"', 'Lato', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
