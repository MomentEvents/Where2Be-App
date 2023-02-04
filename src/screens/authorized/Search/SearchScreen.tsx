import {
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React from "react";
import GradientBackground from "../../../components/Styled/GradientBackground";
import { McText } from "../../../components/Styled";
import { SafeAreaView } from "react-native-safe-area-context";
import SectionHeader from "../../../components/Styled/SectionHeader";
import { COLORS } from "../../../constants";
import SearchToggler from "../../../components/SearchToggler/SearchToggler";
import { Keyboard } from "react-native";

const SearchScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <SearchToggler />
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.trueBlack,
    flex: 1,
  },
  searchContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    backgroundColor: COLORS.black
  },
});
