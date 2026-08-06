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
        mono: {
          bg: '#FFFFFF',
          darkBg: '#0A0A0A',
          darkCard: '#141414',
          ink: '#0A0A0A',
          darkInk: '#F5F5F5',
          secondary: '#8A8A8A',
          border: '#E5E5E5',
          darkBorder: '#262626',
          surface: '#FAFAFA',
        }
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        heading: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Space Grotesk"', 'sans-serif'],
        serif: ['"Space Grotesk"', 'sans-serif'],
      },
      borderRadius: {
        'card': '8px',
        'none': '0px',
      }
    },
  },
  plugins: [],
}
