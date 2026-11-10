// Single source of truth for design tokens.
// Read by tailwind.config.js (NativeWind classes) and by TS code that needs raw values
// (Reanimated, SVG, gradients). Values come from ref/DESIGN.md — see docs/design-system.md.
// CommonJS on purpose: tailwind.config.js is loaded by Node without a TS loader.

const colors = {
  bg: '#0E131D',
  surface: {
    lowest: '#090E18',
    low: '#171C26',
    DEFAULT: '#1B202A',
    high: '#252A35',
    highest: '#303540',
  },
  recessed: '#121721',
  card: '#1F242D',
  onPrimary: '#2A3400',
  error: {
    DEFAULT: '#FFB4AB',
    container: '#93000A',
    onContainer: '#FFD9DC',
  },
  ink: {
    DEFAULT: '#DEE2F1',
    strong: '#FFFFFF',
    soft: '#C5C9AC',
    muted: '#8F9378',
  },
  line: '#444932',
  volt: {
    DEFAULT: '#CAF300',
    dim: '#B0D500',
    ink: '#171E00',
  },
  cyan: {
    DEFAULT: '#00E3FD',
    soft: '#BDF4FF',
  },
  crimson: {
    DEFAULT: '#FF3366',
    soft: '#FFB2BA',
  },
};

// px values (React Native has no rem).
const radius = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

const spacing = {
  gutter: 16,
};

// Android ignores fontWeight for custom fonts, so every weight is its own family.
// Keys must match the names registered with useFonts() in src/app/_layout.tsx.
const fonts = {
  sans: 'ReadexPro_400Regular',
  'sans-medium': 'ReadexPro_500Medium',
  'sans-semibold': 'ReadexPro_600SemiBold',
  'sans-bold': 'ReadexPro_700Bold',
  mono: 'SpaceMono_700Bold',
};

module.exports = { colors, radius, spacing, fonts };
