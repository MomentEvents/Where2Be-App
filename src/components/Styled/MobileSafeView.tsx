import { Platform, StyleSheet, Text, View, StatusBar } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../../constants";
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';


type MobileSafeViewProps = {
  children;
  style?;
  isBottomViewable?: boolean;
  isTopViewable?: boolean;
};
const MobileSafeView = (props: MobileSafeViewProps) => {
  const insets = useSafeAreaInsets();
  if (props.isBottomViewable || props.isTopViewable) {
    return (
      <View style={[props.style, styles.container]}>
        {!props.isTopViewable && (
          <View style={{height: insets.top, ...styles.topBarContainer}} />
        )}
        <View style={{...styles.container}}>{props.children}</View>
        {!props.isBottomViewable && (
          <View style={{height: insets.bottom, ...styles.bottomBarContainer}} />
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
  },
  bottomBarContainer: {
    width: "100%",
  }
});
