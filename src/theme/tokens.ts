/**
 * MemoryOS visual tokens. Mirror of `docs/design/orb-prototype.html`.
 * If you change a value here, update the prototype too.
 */

export const colors = {
  bg: '#13110f',
  bg2: '#1b1816',
  bgRaised: '#221d18',
  ink: '#f4ece1',
  inkDim: '#b8ad9e',
  inkFaint: '#756c61',
  line: '#2a2520',
  glow: '#f5b656',
  glowSoft: 'rgba(245, 182, 86, 0.13)',
  glowFaint: 'rgba(245, 182, 86, 0.06)',
  accent: '#e0c9a6',
  danger: '#d97757',
  safe: '#84a98c',
} as const;

export const radius = {
  sm: 10,
  md: 14,
  lg: 18,
  xl: 28,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 18,
  xl: 24,
  '2xl': 36,
  '3xl': 48,
} as const;

export const fonts = {
  serif: 'Fraunces_300Light',
  serifItalic: 'Fraunces_400Regular_Italic',
  serifMd: 'Fraunces_400Regular',
  sans: 'Geist_400Regular',
  sansMd: 'Geist_500Medium',
  sansSm: 'Geist_300Light',
  mono: 'GeistMono_400Regular',
} as const;

export const motion = {
  durations: { quick: 200, base: 300, breathe: 5500, wave: 1100, halo: 5500 },
  easings: { standard: [0.2, 0.8, 0.2, 1] as const },
} as const;
