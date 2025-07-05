/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  './sections/**/*.liquid',
  './snippets/**/*.liquid',
  './templates/**/*.liquid',
],
  theme: {
    extend: {
      fontFamily: {
          figtree: ['Figtree', 'sans-serif'],
          catalina: ['"Catalina Village"', 'serif'],
          castoro: ['"Castoro Titling"', 'sans-serif'],
      },
      colors: {
        primary: '#2F2F2F',
        secondary: '#6B749E',
        accent:'#8B8B8B'
      }
    },
  },
  plugins: [],
}
