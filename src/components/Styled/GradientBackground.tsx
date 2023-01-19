import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { LinearGradient } from "expo-linear-gradient";

const GradientBackground = ({ children }) => {
  return (
    <LinearGradient
      colors={["#000000", "#292436"]}
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
