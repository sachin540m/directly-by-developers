/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#B8860B',
          light: '#DAA520',
          dark: '#8B6914',
        },
        sage: {
          deep: '#E8EDE8',
          card: '#FFFFFF',
          border: '#CFD9CF',
          dark: '#16281E',
          muted: '#4F5D54',
          input: '#FAFFFA',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [],
}
