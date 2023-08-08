import { Dimensions, Platform, StatusBar } from 'react-native';
const { width, height } = Dimensions.get('window');

export const CUSTOMFONT_BLACK = 'CustomFont-Black';
export const CUSTOMFONT_EXTRABOLD = 'CustomFont-ExtraBold';
export const CUSTOMFONT_BOLD = 'CustomFont-Bold';
export const CUSTOMFONT_SEMIBOLD = 'CustomFont-SemiBold';
export const CUSTOMFONT_REGULAR = 'CustomFont-Regular';
export const CUSTOMFONT_THIN = 'CustomFont-Thin';
export const CUSTOMFONT_LIGHT = 'CustomFont-Light';
export const CUSTOMFONT_EXTRALIGHT = 'CustomFont-ExtraLight';

export const COLORS = {
  default: '#FFFFFF',
  primary: '#FFFFFF',
  white: '#FFFFFF',
  trueBlack: '#050505',
  black: '#101010',
  tabBar: '#121212',
  input: '#1D1D1D',
  blue: '#4096FE',
  gray: '#878787',
  gray1: '#666666',
  gray2: '#444444',
  red: '#EB4B4B',
  lightGray: '#dedede',
  purple: '#9e69f5',
  indigo: '#5C00F1',
  lightPurple: '#9a77e0',
  darkPurple: '#7e69f5',
  transparentWhite: 'rgba(255, 255, 255, 0.2)',
  transparentBlack: 'rgba(0, 0, 0, 0.9)',
  linear: ['transparent', '#F687FFE8'],
};
export const SIZES = {
  // global sizes
  base: 8,
  font: 14,
  radius: 20,
  padding: 30,
  small: 24,
  big: 32,

  // font sizes
  large: 40,
  h1: 28,
  h2: 24,
  h3: 18,
  h4: 16,
  h5: 14,
  h6: 13,
  h7: 10,
  body1: 24,
  body2: 18,
  body3: 16,
  body4: 14,
  body5: 13,
  body6: 12,
  body7: 11,
  body8: 10,

  // app dimensions
  width,
  height,
  tabBarHeight: 45,
  sectionHeaderHeight: 55,
};
export const FONTS = {
  f0: { fontFamily: CUSTOMFONT_BOLD, fontSize: SIZES.large},
  small: { fontFamily: CUSTOMFONT_REGULAR, fontSize: SIZES.small},
  h1: { fontFamily: CUSTOMFONT_SEMIBOLD, fontSize: SIZES.h1},
  h2: { fontFamily: CUSTOMFONT_SEMIBOLD, fontSize: SIZES.h2},
  h3: { fontFamily: CUSTOMFONT_SEMIBOLD, fontSize: SIZES.h3},
  h4: { fontFamily: CUSTOMFONT_SEMIBOLD, fontSize: SIZES.h4},
  h5: { fontFamily: CUSTOMFONT_SEMIBOLD, fontSize: SIZES.h5},
  h6: { fontFamily: CUSTOMFONT_SEMIBOLD, fontSize: SIZES.h6},
  body1: { fontFamily: CUSTOMFONT_REGULAR, fontSize: SIZES.body1},
  body2: { fontFamily: CUSTOMFONT_REGULAR, fontSize: SIZES.body2},
  body3: { fontFamily: CUSTOMFONT_REGULAR, fontSize: SIZES.body3},
  body4: { fontFamily: CUSTOMFONT_REGULAR, fontSize: SIZES.body4},
  body5: { fontFamily: CUSTOMFONT_REGULAR, fontSize: SIZES.body5},
  body6: { fontFamily: CUSTOMFONT_REGULAR, fontSize: SIZES.body6},
  body7: { fontFamily: CUSTOMFONT_REGULAR, fontSize: SIZES.body7},
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;