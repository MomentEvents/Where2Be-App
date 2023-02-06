import {
  ActivityIndicator,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState, useContext, useEffect } from "react";
import {
  COLORS,
  FONTS,
  icons,
  SIZES,
  images,
  School,
  SCREENS,
} from "../../../constants";
import { ScreenContext } from "../../../contexts/ScreenContext";
import { McText } from "../../../components/Styled";
import SelectList from "react-native-dropdown-select-list";
import SchoolSelector from "./components/SchoolSelector";
import * as Navigator from "../../../navigation/Navigator";
import { LinearGradient } from "expo-linear-gradient";
import GradientBackground from "../../../components/Styled/GradientBackground";

const SelectSchoolScreen = ({ navigation, route }) => {
  const [school, setSchool] = useState<School>(null);

  const onNavigateLogin = () => {
    Navigator.navigate(SCREENS.Login);
  };

  useEffect(() => {
    if (school != null) {
      console.log("School selected is " + school.Name);
      Navigator.navigate(SCREENS.IntroduceEvents, { school: school });
    }
  }, [school]);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          position: "absolute",
          flex: 1,
          zIndex: 99,
          width: "70%",
          justifyContent: "flex-end",
        }}
      >
        <icons.moment width="100%"></icons.moment>
      </View>
      <View style={{ flex: 2 }} />
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          width: "70%"
        }}
      >
        <View style={{ alignItems: "center", justifyContent: 'flex-start' }}>
          <SchoolSelector setSelectedSchool={setSchool}></SchoolSelector>
        </View>
        <View style={{ alignItems: "center" }}>
          <TouchableOpacity
            style={{ marginTop: 40, alignSelf: "center" }}
            onPress={onNavigateLogin}
          >
            <McText body3>Already have an account?</McText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SelectSchoolScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.trueBlack,
    alignItems: "center",
    justifyContent: "center",
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: "100%",
  },
});
