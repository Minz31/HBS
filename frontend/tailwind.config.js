/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors';

export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: { 
    extend: {
      colors: {
        primary: colors.blue,
      },
    } 
  },
  plugins: [],
};
