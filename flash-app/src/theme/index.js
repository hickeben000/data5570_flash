export const colors = {
  primary: '#4361ee',
  primaryLight: '#eef1ff',
  primaryDark: '#2f4acb',
  brandStart: '#2B7FFF',
  brandEnd: '#1560F0',
  bg: '#f0f4ff',
  surface: '#ffffff',
  surfaceInset: '#f8fafc',
  fg1: '#0f172a',
  fg2: '#64748b',
  fg3: '#94a3b8',
  border: '#e2e8f0',
  borderActive: '#4361ee',
  success: '#22c55e',
  successDark: '#16a34a',
  warning: '#f59e0b',
  warningDark: '#d97706',
  error: '#ef4444',
  errorDark: '#dc2626',
  errorBg: '#fee2e2',
};

export const gradients = {
  brand: ['#2B7FFF', '#1560F0'],
  hero: ['#1a56db', '#1560F0', '#2B7FFF'],
  success: ['#16a34a', '#22c55e'],
};

export const radius = {
  sm: 8,
  md: 10,
  lg: 14,
  xl: 18,
  xxl: 24,
  full: 9999,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
};

export const shadows = {
  low: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 2,
  },
  mid: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  high: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 5,
  },
};

export const typography = {
  display: { fontSize: 36, fontWeight: '800' },
  title: { fontSize: 30, fontWeight: '800' },
  heading: { fontSize: 26, fontWeight: '800' },
  subheading: { fontSize: 22, fontWeight: '800' },
  large: { fontSize: 20, fontWeight: '700' },
  body: { fontSize: 16, fontWeight: '400' },
  bodyMedium: { fontSize: 15, fontWeight: '500' },
  label: { fontSize: 13, fontWeight: '700' },
  caption: { fontSize: 12, fontWeight: '400' },
  eyebrow: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 },
};
