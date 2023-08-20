import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import React, { useContext, useRef } from "react";
import MobileSafeView from "../../../../components/Styled/MobileSafeView";
import { COLORS, SCREENS, School, icons } from "../../../../constants";
import { McText } from "../../../../components/Styled";
import { IMAGES } from "../../../../constants/images";
import { useNavigation } from "@react-navigation/native";
import SchoolSearchSelector from "../../../../components/SchoolSearchSelector/SchoolSearchSelector";
import { AuthContext } from "../../../../contexts/AuthContext";
import {
  CUSTOMFONT_BOLD,
  CUSTOMFONT_REGULAR,
} from "../../../../constants/theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CONSTRAINTS } from "../../../../constants/constraints";
import { ScreenContext } from "../../../../contexts/ScreenContext";
import { AntDesign } from "@expo/vector-icons";
import { McTextInput } from "../../../../components/Styled/styled";

const SignupPasswordScreen = () => {
  const navigator = useNavigation<any>();

  const { signupValues, setSignupValues } = useContext(AuthContext);

  const { setLoading } = useContext(ScreenContext);

  const passwordRef = useRef("");
  const confirmPasswordRef = useRef("");

  const onNavigateBack = () => {
    navigator.goBack();
  };

  const onNextClick = () => {
    if (passwordRef.current.length < CONSTRAINTS.User.Password.Min) {
      Alert.alert(
        "Please enter a password that is longer than " +
          (CONSTRAINTS.User.Password.Min - 1) +
          " characters."
      );
      return;
    }
    if (passwordRef.current != confirmPasswordRef.current) {
      Alert.alert("Passwords do not match");
      return;
    }
    setSignupValues({ ...signupValues, Password: passwordRef.current });
    navigator.navigate(SCREENS.Onboarding.SignupFinalScreen);
  };
  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: COLORS.trueBlack }}
      contentContainerStyle={{ backgroundColor: COLORS.trueBlack, flex: 1 }}
    >
      <MobileSafeView style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={IMAGES.password}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.titleTextContainer}>
          <McText style={styles.titleText} h1>
            Secure Your Account
          </McText>
          <McText style={styles.descriptionText} h4>
            Create a strong password. Remember, a great event experience{" "}
            <McText color={COLORS.purple} h4>
              starts with peace of mind
            </McText>
            .
          </McText>
        </View>
        <View style={styles.userInputContainer}>
          <McTextInput
            placeholder={"Password"}
            autoCapitalize={"none"}
            placeholderTextColor={COLORS.gray}
            style={styles.textInputContainer}
            secureTextEntry={true}
            onChangeText={(newText) => (passwordRef.current = newText)}
          />
          <McTextInput
            placeholder={"Confirm Password"}
            placeholderTextColor={COLORS.gray}
            style={styles.textInputContainer}
            secureTextEntry={true}
            onChangeText={(newText) => (confirmPasswordRef.current = newText)}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            marginTop: 60,
            justifyContent: "space-between",
          }}
        >
          <TouchableOpacity
            style={{
              borderRadius: 5,
              paddingVertical: 10,
              paddingHorizontal: 14,
            }}
            onPress={onNavigateBack}
          >
            <View style={{ flexDirection: "row" }}>
              <AntDesign name="caretleft" size={24} color="white" />
              <McText h4>Back</McText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              borderRadius: 5,
              paddingVertical: 10,
              paddingHorizontal: 14,
            }}
            onPress={onNextClick}
          >
            <View style={{ flexDirection: "row" }}>
              <McText h4>Next</McText>

              <AntDesign name="caretright" size={24} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </MobileSafeView>
    </KeyboardAwareScrollView>
  );
};

export default SignupPasswordScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.trueBlack,
    paddingBottom: 30,
    paddingTop: 20,
    paddingHorizontal: 30,
  },
  imageContainer: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  titleTextContainer: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  titleText: {
    textAlign: "center",
  },
  descriptionText: {
    marginTop: 20,
    textAlign: "center",
  },
  userInputContainer: {
    marginTop: 10,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  textInputContainer: {
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontFamily: CUSTOMFONT_REGULAR,
    fontSize: 16,
    color: COLORS.white,
    paddingVertical: 10,
    marginTop: 20,
    width: "90%",
  },
});
