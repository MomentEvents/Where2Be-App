import { StyleSheet, Text, View } from "react-native";
import React from "react";
import GradientBackground from "../../../components/Styled/GradientBackground";
import { McText } from "../../../components/Styled";
import { SafeAreaView } from "react-native-safe-area-context";
import SectionHeader from "../../../components/Styled/SectionHeader";
import { COLORS } from "../../../constants";

const SearchScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <SectionHeader title={"Search"} />
      <View style={styles.searchContainer}>
        <McText h2>Coming soon!</McText>
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.black,
    flex: 1,
  },
  searchContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
