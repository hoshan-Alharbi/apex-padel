import tokens from './tokens';

export const { colors, radius, spacing, fonts } = tokens as {
  colors: typeof tokens.colors;
  radius: typeof tokens.radius;
  spacing: typeof tokens.spacing;
  fonts: typeof tokens.fonts;
};
