/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");

module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: colors.blue,
        secondary: colors.slate,
      },
    },
  },
  plugins: [],
}
