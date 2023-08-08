import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Linking,
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
  School,
  SCREENS,
} from "../../../constants";
import { ScreenContext } from "../../../contexts/ScreenContext";
import { McText } from "../../../components/Styled";
import SelectList from "react-native-dropdown-select-list";
import SchoolSelector from "../../../components/SchoolSearchSelector/SchoolSearchSelector";
import { LinearGradient } from "expo-linear-gradient";
import GradientBackground from "../../../components/Styled/GradientBackground";
import { appVersionText } from "../../../constants/texts";
import { useNavigation } from "@react-navigation/native";
import SchoolSearchSelector from "../../../components/SchoolSearchSelector/SchoolSearchSelector";
import { CUSTOMFONT_BOLD, CUSTOMFONT_SEMIBOLD } from "../../../constants/theme";

const SelectSchoolScreen = ({ route }) => {
  const [school, setSchool] = useState<School>(null);
  const navigation = useNavigation<any>();

  const onNavigateLogin = () => {
    navigation.navigate(SCREENS.Login);
  };

  const onNavigateSignup = () => {
    navigation.navigate(SCREENS.Onboarding.SignupWelcomeScreen);
  };

  const onDiscordClick = () => {
    const supported = Linking.canOpenURL("https://where2be.app/discord");

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      Linking.openURL("https://where2be.app/discord");
    } else {
      Alert.alert(`Unable to open link: ${"https://where2be.app/discord"}`);
    }
  };

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
        <icons.where2be
          width="70%"
          style={{ marginBottom: 80 }}
        ></icons.where2be>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          width: "70%",
        }}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <SchoolSearchSelector
            onSelectSchool={(school: School) => {
              setSchool(school);
              navigation.navigate(SCREENS.IntroduceEvents, { school: school });
            }}
            textStyle={{
              color: COLORS.white,
              fontFamily: CUSTOMFONT_SEMIBOLD,
              fontSize: 18,
              paddingHorizontal: 10,
              paddingVertical: 3,
            }}
            buttonStyle={{
              backgroundColor: COLORS.purple,
              borderColor: COLORS.purple,
              borderRadius: 5,
              borderWidth: 0,
            }}
            initialText={"Select your school"}
            initialTextStyle={{
              color: COLORS.white,
              fontFamily: CUSTOMFONT_SEMIBOLD,
              fontSize: 18,
              paddingHorizontal: 10,
              paddingVertical: 3,
            }}
            maxLines={2}
          />
        </View>
        <View
          style={{ flex: 2, justifyContent: "center", alignItems: "center" }}
        >
          <TouchableOpacity
            style={{ alignSelf: "center" }}
            onPress={onNavigateLogin}
          >
            <McText color={COLORS.purple} body4>Sign in</McText>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ alignSelf: "center", marginTop: 20, marginBottom: 20 }}
            onPress={onNavigateSignup}
          >
            <McText color={COLORS.purple} body4>Create an account</McText>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ padding: 5 }}>
        <Text
          allowFontScaling={false}
          style={{ fontSize: 12, color: COLORS.gray1 }}
        >
          {appVersionText} | Join our{" "}
          <Text
            allowFontScaling={false}
            onPress={onDiscordClick}
            style={{
              fontSize: 12,
              color: COLORS.gray1,
              textDecorationLine: "underline",
            }}
          >
            Discord server
          </Text>
          !
        </Text>
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
