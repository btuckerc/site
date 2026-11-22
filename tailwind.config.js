/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--bg-rgb) / <alpha-value>)',
        'bg-elev': 'rgb(var(--bg-elev-rgb) / <alpha-value>)',
        fg: 'rgb(var(--fg-rgb) / <alpha-value>)',
        muted: 'rgb(var(--muted-rgb) / <alpha-value>)',
        accent: 'rgb(var(--accent-rgb) / <alpha-value>)',
        line: 'rgb(var(--line-rgb) / <alpha-value>)',
        border: 'rgb(var(--line-rgb) / <alpha-value>)',
        'card-bg': 'rgb(var(--bg-elev-rgb) / <alpha-value>)',
        panel: 'var(--panel)',
        'hover-bg': 'var(--hover-bg)',
        'active-bg': 'var(--active-bg)',
        'focus-ring': 'var(--focus-ring)',
      },
      fontFamily: {
        mono: ['var(--font-family)', 'SF Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['var(--font-family)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
