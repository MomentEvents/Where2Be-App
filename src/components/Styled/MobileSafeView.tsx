import { Platform, StyleSheet, Text, View, StatusBar } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../../constants";

type MobileSafeViewProps = {
  children;
  style?;
  isBottomViewable?: boolean;
  isTopViewable?: boolean;
};
const MobileSafeView = (props: MobileSafeViewProps) => {
  
  if (props.isBottomViewable || props.isTopViewable) {
    return (
      <View style={[props.style, styles.container]}>
        {!props.isTopViewable && (
          <View style={[styles.topBarContainer]} />
        )}
        <View style={[styles.container]}>{props.children}</View>
        {!props.isBottomViewable && (
          <View style={[styles.bottomBarContainer]} />
        )}
      </View>
    );
  }
  return (
    <SafeAreaView style={[props.style, styles.container]}>
      <View style={{ flex: 1 }}>{props.children}</View>
    </SafeAreaView>
  );
};

export default MobileSafeView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBarContainer: {
    width: "100%",
    height: SIZES.topBarHeight,
  },
  bottomBarContainer: {
    width: "100%",
    height: SIZES.bottomBarHeight,
  },
  tabBarContainer: {
    width: "100%",
    height: SIZES.tabBarHeight - SIZES.bottomBarHeight,
  }
});
