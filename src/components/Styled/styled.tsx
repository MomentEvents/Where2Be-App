import React, { FC } from 'react';
import { Text, TextInput, TextInputProps, TextProps, TextStyle } from 'react-native';
import { COLORS, FONTS } from "../../constants";

interface McTextProps extends TextProps {
  h1?: boolean;
  h2?: boolean;
  h3?: boolean;
  h4?: boolean;
  h5?: boolean;
  h6?: boolean;
  body1?: boolean;
  body2?: boolean;
  body3?: boolean;
  body4?: boolean;
  body5?: boolean;
  body6?: boolean;
  color?: string;
  style?: TextStyle;
}

const McText: FC<McTextProps> = ({
  h1, h2, h3, h4, h5, h6, body1, body2, body3, body4, body5, body6, color = COLORS.default, style, ...props
}) => {
  let fontSize = FONTS.body1; // default to body1 if no other sizes are specified
  
  if (h1) fontSize = FONTS.h1;
  else if (h2) fontSize = FONTS.h2;
  else if (h3) fontSize = FONTS.h3;
  else if (h4) fontSize = FONTS.h4;
  else if (h5) fontSize = FONTS.h5;
  else if (h6) fontSize = FONTS.h6;
  else if (body1) fontSize = FONTS.body1;
  else if (body2) fontSize = FONTS.body2;
  else if (body3) fontSize = FONTS.body3;
  else if (body4) fontSize = FONTS.body4;
  else if (body5) fontSize = FONTS.body5;
  else if (body6) fontSize = FONTS.body6;

  const combinedStyle = { color, ...fontSize, ...style };

  return <Text allowFontScaling={false} style={combinedStyle} {...props} />;
};

interface McTextInputProps extends TextInputProps {
  style?: TextStyle
}

const McTextInput: FC<McTextInputProps> = ({
  ...props
}) => {

  return <TextInput allowFontScaling={false} style={props.style} {...props} />;
};

export { McText, McTextInput };
