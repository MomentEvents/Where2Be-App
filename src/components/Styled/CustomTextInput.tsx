import { StyleSheet, Text, View, ViewStyle } from "react-native";
import React from "react";
import { McTextInput } from "./styled";
import { COLORS } from "../../constants";
import { CUSTOMFONT_REGULAR } from "../../constants/theme";

type CustomTextInputProps = {
  placeholder: string;
  onChangeText?: (text: string) => void;
  style?: ViewStyle
  secureTextEntry?: boolean;
};
const CustomTextInput = (props: CustomTextInputProps) => {
  return (
    <McTextInput
      placeholder={props.placeholder}
      placeholderTextColor={COLORS.gray}
      style={{...styles.textInputContainer, ...props.style}}
      onChangeText={props.onChangeText}
      secureTextEntry={props.secureTextEntry}
    />
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  textInputContainer: {
    borderColor: COLORS.gray2,
    borderWidth: 0.3,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontFamily: CUSTOMFONT_REGULAR,
    fontSize: 16,
    color: COLORS.lightGray,
    paddingVertical: 10,
    width: "100%",
    backgroundColor: COLORS.black,
  },
});
