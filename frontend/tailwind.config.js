export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        boska: ['Boska', 'serif'],
        panchang: ['Panchang', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
