import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS } from "../../constants";

const GradientBackground = ({ children }) => {
  return (
    <LinearGradient
      colors={[COLORS.black,COLORS.black]}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        height: "100%",
      }}
    >
      <View style={{ flex: 1 }}>{children}</View>
    </LinearGradient>
  );
};

export default GradientBackground;

const styles = StyleSheet.create({});
