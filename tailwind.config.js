const { colors, radius, spacing, fonts } = require('./src/theme/tokens');

const px = (map) => Object.fromEntries(Object.entries(map).map(([k, v]) => [k, `${v}px`]));
const families = Object.fromEntries(Object.entries(fonts).map(([k, v]) => [k, [v]]));

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors,
      borderRadius: { ...px(radius), DEFAULT: `${radius.sm}px` },
      spacing: px(spacing),
      fontFamily: families,
    },
  },
  plugins: [],
};
