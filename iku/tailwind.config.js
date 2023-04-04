/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'emerald-dark': '#0e3331',
        'emerald-darker': '#0c2927',
        'emerald-darkest': '#0a1e1d',
      },
    },
  },
}
