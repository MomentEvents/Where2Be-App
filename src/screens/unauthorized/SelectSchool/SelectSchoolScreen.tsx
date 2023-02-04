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
    <GradientBackground>
      <SafeAreaView
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <icons.moment
          width={Math.min(SIZES.width * 0.7, SIZES.height * 0.7)}
        ></icons.moment>
        <View
          style={{
            marginTop: 30,
            marginBottom: 60,
            marginHorizontal: 30,
          }}
        >
          <SchoolSelector setSelectedSchool={setSchool}></SchoolSelector>
        </View>
        <TouchableOpacity onPress={onNavigateLogin}>
          <McText body3 style={{color:COLORS.purple}}>Already have an account?</McText>
        </TouchableOpacity>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default SelectSchoolScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
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
