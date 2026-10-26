/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Emerald green brand accent
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        sidebar: {
          bg: '#0f172a', // Slate 900 dark lateral navigation
          hover: '#1e293b',
          active: '#334155',
          text: '#94a3b8',
          textActive: '#ffffff'
        }
      },
      boxShadow: {
        'cabinet': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.08), 0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        'box-active': '0 0 0 3px rgba(16, 185, 129, 0.4), 0 8px 20px -4px rgba(16, 185, 129, 0.3)',
      }
    },
  },
  plugins: [],
}
