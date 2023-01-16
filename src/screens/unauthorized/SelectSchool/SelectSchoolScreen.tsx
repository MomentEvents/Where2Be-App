import {
  ActivityIndicator,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
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

  useEffect(() => {
    if (school != null) {
      console.log("School selected is " + school.Name);
      Navigator.navigate(SCREENS.IntroduceEvents, { school: school });
    }
  }, [school]);

  return (
    <GradientBackground>
      <View
        style={{
          flex: 1,
          // backgroundColor: COLORS.black,
          justifyContent: "center",
        }}
      >
        <SafeAreaView style={{ alignItems: "center" }}>
          <icons.moment width={Math.min(SIZES.width * 0.7, SIZES.height * .7)}></icons.moment>
          <View
            style={styles.textInputContainer}
          >
            <SchoolSelector setSelectedSchool={setSchool}></SchoolSelector>
          </View>
        </SafeAreaView>
      </View>
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
  textInputContainer: {
    width: SIZES.width / 1.3,
    borderColor: COLORS.purple,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontFamily: FONTS.CUSTOMFONT_REGULAR,
    fontSize: 16,
    color: COLORS.white,
    paddingVertical: 10,
    marginTop: 20,
  },
});
