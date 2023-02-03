import { Platform, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants";

const MobileSafeView = ({ children }, style) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.black }}>
      {children}
    </SafeAreaView>
  );
};

export default MobileSafeView;

const styles = StyleSheet.create({});
