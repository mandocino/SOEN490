module.exports = {
  plugins: [
    require('postcss-import')(),
    require('tailwindcss')('./tailwind.config.cjs'),
    require('autoprefixer')
  ],
};