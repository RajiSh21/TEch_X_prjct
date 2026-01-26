// API Base URL - Update this to your backend URL
export const API_BASE_URL = 'http://localhost:5000/api';

// Colors - Professional Color Scheme
export const COLORS = {
  // Primary Colors
  primary: '#6366F1', // Indigo
  primaryDark: '#4F46E5',
  primaryLight: '#818CF8',
  
  // Secondary Colors
  secondary: '#EC4899', // Pink
  secondaryDark: '#DB2777',
  secondaryLight: '#F472B6',
  
  // Neutral Colors
  white: '#FFFFFF',
  black: '#000000',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  
  // Text Colors
  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textLight: '#9CA3AF',
  
  // Status Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Additional
  border: '#E5E7EB',
  shadow: '#00000029',
  overlay: 'rgba(0, 0, 0, 0.5)',
};

// Typography
export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border Radius
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

// Shadow
export const SHADOW = {
  sm: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  lg: {
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};
