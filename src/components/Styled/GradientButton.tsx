import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, FONTS, SCREENS, SIZES } from "../../constants";

const GradientButton = ({ style, children }) => {
  return (
    <LinearGradient colors={[COLORS.purple,COLORS.purple]} style={[style]}>
      {children}
    </LinearGradient>
  );
};

export default GradientButton;

const styles = StyleSheet.create({});
