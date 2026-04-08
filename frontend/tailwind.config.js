/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        purple: {
          DEFAULT: '#663399',
          dark: '#4a1a6b',
          light: '#8b5cb8',
        },
        gold: {
          DEFAULT: '#ffd700',
          dark: '#daa520',
          light: '#ffec8b',
        },
      },
    },
  },
  plugins: [],
}
