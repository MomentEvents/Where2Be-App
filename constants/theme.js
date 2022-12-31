import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const CUSTOMFONT_REGULAR = 'ProductSans-Regular';
const CUSTOMFONT_BOLD = 'ProductSans-Bold';
const CUSTOMFONT_BLACK = 'ProductSans-Black';

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
  transparentWhite: 'rgba(255, 255, 255, 0.2)',
  transparentBlack: 'rgba(0, 0, 0, 0.9)',
  linear: ['transparent', '#F687FFE8'],
  
};
export const SIZES = {
  // global sizes
  base: '8px',
  font: '14px',
  radius: 20,
  padding: '30px',
  small: '24px',
  big: '32px',

  // font sizes
  large: 40,
  small: '24px',
  h1: 30,
  h2: 24,
  h3: 20,
  h4: 16,
  h5: 14,
  h6: 13,
  h7: 10,
  body1: 30,
  body2: 22,
  body3: 16,
  body4: 14,
  body5: 13,
  body6: 12,
  body7: 11,

  // app dimensions
  width,
  height,
};
export const FONTS = {
  f0: { fontFamily: CUSTOMFONT_BOLD, fontSize: SIZES.large},
  small: { fontFamily: CUSTOMFONT_REGULAR, fontSize: SIZES.small},
  h1: { fontFamily: CUSTOMFONT_BOLD, fontSize: SIZES.h1},
  h2: { fontFamily: CUSTOMFONT_BOLD, fontSize: SIZES.h2},
  h3: { fontFamily: CUSTOMFONT_BOLD, fontSize: SIZES.h3},
  h4: { fontFamily: CUSTOMFONT_BOLD, fontSize: SIZES.h4},
  h5: { fontFamily: CUSTOMFONT_BOLD, fontSize: SIZES.h5},
  h6: { fontFamily: CUSTOMFONT_BOLD, fontSize: SIZES.h6},
  body1: { fontFamily: CUSTOMFONT_REGULAR, fontSize: SIZES.body1},
  body2: { fontFamily: CUSTOMFONT_REGULAR, fontSize: SIZES.body2},
  body3: { fontFamily: CUSTOMFONT_REGULAR, fontSize: SIZES.body3},
  body4: { fontFamily: CUSTOMFONT_REGULAR, fontSize: SIZES.body4},
  body5: { fontFamily: CUSTOMFONT_REGULAR, fontSize: SIZES.body5},
  body6: { fontFamily: CUSTOMFONT_REGULAR, fontSize: SIZES.body6},
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;