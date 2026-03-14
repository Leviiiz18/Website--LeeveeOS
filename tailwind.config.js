/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ["'JetBrains Mono'", "'Fira Code'", 'monospace'],
        sans: ['-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      colors: {
        neon: {
          blue: '#00d4ff',
          purple: '#7c3aed',
          green: '#4ade80',
          pink: '#f472b6',
          orange: '#fb923c',
        },
      },
      animation: {
        'spin-slow': 'spin 4s linear infinite',
        twinkle: 'twinkle 3s ease-in-out infinite',
        pulse: 'pulse 1s ease-in-out infinite',
        windowOpen: 'windowOpen 0.18s cubic-bezier(.34,1.56,.64,1)',
      },
      keyframes: {
        twinkle: {
          '0%,100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        },
        windowOpen: {
          from: { opacity: '0', transform: 'scale(0.92) translateY(8px)' },
          to: { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
