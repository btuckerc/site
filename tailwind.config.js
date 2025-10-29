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
        // New theme system variables
        bg: 'var(--bg)',
        'bg-elev': 'var(--bg-elev)',
        fg: 'var(--fg)',
        muted: 'var(--muted)',
        accent: 'var(--accent)',
        line: 'var(--line)',
        border: 'var(--line)',
        'card-bg': 'var(--card-bg)',
        'glass-bg': 'var(--glass-bg)',
        'hover-bg': 'var(--hover-bg)',
        'active-bg': 'var(--active-bg)',
        'focus-ring': 'var(--focus-ring)',
        'btn-bg': 'var(--button-bg)',
        'btn-hover': 'var(--button-hover-bg)',
        'btn-active': 'var(--button-active-bg)',
        'btn-border': 'var(--button-border)',
        'btn-shine': 'var(--button-shine)',
      },
      fontFamily: {
        mono: ['var(--font-family)', 'Monaco', 'Menlo', 'Ubuntu Mono', 'Fira Code', 'monospace'],
        sans: ['var(--font-family)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'flip': 'flip 0.6s ease-in-out',
        'spring-in': 'springIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        flip: {
          '0%': { transform: 'rotateY(0)' },
          '50%': { transform: 'rotateY(90deg)' },
          '100%': { transform: 'rotateY(0)' },
        },
        springIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      borderRadius: {
        'xl': '14px',
      },
    },
  },
  plugins: [],
}