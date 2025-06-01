export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Open Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'], // override default sans
        // or add a custom key if you want:
        open: ['"Open Sans"', 'sans-serif'],
      },
    },
  },
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
}