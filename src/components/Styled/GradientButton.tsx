import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants";

const GradientButton = ({ style, children }) => {
  return (
    // <View style={{backgroundColor: COLORS.purple, ...style}}>
    //   {children}
    // </View>

    <LinearGradient colors={["#B66DFF", "#4a3091"]} style={[style]}>
      {children}
    </LinearGradient>
  );
};

export default GradientButton;

const styles = StyleSheet.create({});
