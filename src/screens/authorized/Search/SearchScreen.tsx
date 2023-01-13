import { StyleSheet, Text, View } from "react-native";
import React from "react";
import GradientBackground from "../../../components/Styled/GradientBackground";
import { McText } from "../../../components/Styled";
import { SafeAreaView } from "react-native-safe-area-context";

const SearchScreen = () => {
  return (
    <GradientBackground>
      <SafeAreaView style={{ alignItems: "center" }}>
        <McText h1>Coming Soon!</McText>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({});
