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
import { LinearGradient } from "expo-linear-gradient";
import GradientBackground from "../../../components/Styled/GradientBackground";
import { appVersionText } from "../../../constants/texts";
import { useNavigation } from "@react-navigation/native";

const SelectSchoolScreen = ({ route }) => {
  const [school, setSchool] = useState<School>(null);
  const navigation = useNavigation<any>();

  const onNavigateLogin = () => {
    navigation.navigate(SCREENS.Login);
  };

  useEffect(() => {
    if (school != null) {
      console.log("School selected is " + school.Name);
      navigation.navigate(SCREENS.IntroduceEvents, { school: school });
    }
  }, [school]);

  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 2,
          width: "100%",
          justifyContent: "flex-end",
          alignItems: "center",
        }}
      >
        <icons.moment width="70%" style={{ marginBottom: 50 }}></icons.moment>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          width: "70%",
        }}
      >
        <View style={{ alignItems: "center", justifyContent: "flex-start" }}>
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
      <View style={{ padding: 5 }}>
        <McText body6 color={COLORS.gray1}>
          {appVersionText}
        </McText>
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
