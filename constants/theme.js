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
  lightGray: '#dedede',
  transparentWhite: 'rgba(255, 255, 255, 0.2)',
  transparentBlack: 'rgba(0, 0, 0, 0.4)',
  linear: ['#439DFEE8', '#F687FFE8'],
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
  large: '40px',
  small: '24px',
  h1: 30,
  h2: 24,
  h3: 20,
  h4: 16,
  h5: 14,
  h6: 13,
  h7: 10,
  body1: '30px',
  body2: '22px',
  body3: '16px',
  body4: '14px',
  body5: '13px',
  body6: '12px',

  // app dimensions
  width,
  height,
};
export const FONTS = {
  large: { fontFamily: CUSTOMFONT_REGULAR, fontSize: SIZES.large, lineHeight: '40px' },
  small: { fontFamily: CUSTOMFONT_REGULAR, fontSize: SIZES.small, lineHeight: '22px' },
  h1: { fontFamily: CUSTOMFONT_BOLD, fontSize: SIZES.h1, lineHeight: 36 },
  h2: { fontFamily: CUSTOMFONT_BOLD, fontSize: SIZES.h2, lineHeight: 30 },
  h3: { fontFamily: CUSTOMFONT_BOLD, fontSize: SIZES.h3, lineHeight: 22 },
  h4: { fontFamily: CUSTOMFONT_BOLD, fontSize: SIZES.h4, lineHeight: 22 },
  h5: { fontFamily: CUSTOMFONT_BOLD, fontSize: SIZES.h5, lineHeight: 22 },
  h6: { fontFamily: CUSTOMFONT_BOLD, fontSize: SIZES.h6, lineHeight: 22 },
  body1: { fontFamily: CUSTOMFONT_REGULAR, fontSize: SIZES.body1, lineHeight: '36px', },
  body2: { fontFamily: CUSTOMFONT_REGULAR, fontSize: SIZES.body2, lineHeight: '30px', },
  body3: { fontFamily: CUSTOMFONT_REGULAR, fontSize: SIZES.body3, lineHeight: '25px', },
  body4: { fontFamily: CUSTOMFONT_REGULAR, fontSize: SIZES.body4, lineHeight: '22px', },
  body5: { fontFamily: CUSTOMFONT_REGULAR, fontSize: SIZES.body5, lineHeight: '22px', },
  body6: { fontFamily: CUSTOMFONT_REGULAR, fontSize: SIZES.body6, lineHeight: '22px', },
};

const appTheme = { COLORS, SIZES, FONTS };

export default appTheme;