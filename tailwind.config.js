/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: {
            primary: '#121212',
            secondary: '#1E1E1E',
            tertiary: '#2D2D2D',
          },
          text: {
            primary: '#E4E4E7',
            secondary: '#A1A1AA',
            muted: '#71717A',
          },
        },
      },
    },
  },
  plugins: [],
};