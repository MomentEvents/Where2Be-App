import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

const GradientButton = ({ style, children }) => {
  return (
    <LinearGradient colors={["#B66DFF", "#280292"]} style={[style]}>
      {children}
    </LinearGradient>
  );
};

export default GradientButton;

const styles = StyleSheet.create({});
