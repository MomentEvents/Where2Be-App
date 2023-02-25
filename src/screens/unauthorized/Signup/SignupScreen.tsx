import {
  Alert,
  Button,
  KeyboardAvoidingView,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { AuthContext } from "../../../contexts/AuthContext";
import GradientBackground from "../../../components/Styled/GradientBackground";
import { McText } from "../../../components/Styled";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import {
  COLORS,
  FONTS,
  SCREENS,
  SIZES,
  School,
  icons,
} from "../../../constants";
import { CUSTOMFONT_BOLD, CUSTOMFONT_REGULAR } from "../../../constants/theme";
import { ScreenContext } from "../../../contexts/ScreenContext";
import { displayError, formatError } from "../../../helpers/helpers";
import { useNavigation } from "@react-navigation/native";
import SchoolSearchSelector from "../../../components/SchoolSearchSelector/SchoolSearchSelector";
import MobileSafeView from "../../../components/Styled/MobileSafeView";
import { CONSTRAINTS } from "../../../constants/constraints";

const SignupScreen = () => {
  const { userSignup } = useContext(AuthContext);
  const { setLoading } = useContext(ScreenContext);
  const navigation = useNavigation<any>();

  const [username, setUsername] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [selectedSchool, setSelectedSchool] = useState<School>(null);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const onSignup = () => {
    if (!selectedSchool) {
      displayError(formatError("Input error", "Please select a valid school"));
      return;
    }
    if (password !== confirmPassword) {
      displayError(formatError("Input error", "Passwords must match"));
      return;
    }
    setLoading(true);
    userSignup(username, displayName, password, selectedSchool.SchoolID)
      .then(() => setLoading(false))
      .catch((error) => {
        displayError(error);
        setLoading(false);
      });
  };

  const onNavigateLogin = () => {
    navigation.navigate(SCREENS.Login);
  };

  const onTermsOfServiceClick = () => {
    const supported = Linking.canOpenURL("https://momentevents.app/terms");

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      Linking.openURL("https://momentevents.app/terms");
    } else {
      Alert.alert(`Unable to open link: ${"https://momentevents.app/terms"}`);
    }
  };

  const onPrivacyPolicyClick = () => {
    const supported = Linking.canOpenURL("https://momentevents.app/privacy");

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      Linking.openURL("https://momentevents.app/privacy");
    } else {
      Alert.alert(`Unable to open link: ${"https://momentevents.app/privacy"}`);
    }
  };

  const onNavigateBack = () => {
    navigation.goBack();
  };

  return (
    <MobileSafeView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 30 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView style={styles.container}>
          <View style={styles.backarrowContainer}>
            <TouchableOpacity onPress={onNavigateBack}>
              <icons.backarrow />
            </TouchableOpacity>
          </View>
          <View style={styles.welcomeTextContainer}>
            <McText h1 style={styles.welcomeText}>
              Welcome to Moment!
            </McText>
          </View>
          <TextInput
            placeholder={"Name"}
            placeholderTextColor={COLORS.gray}
            style={styles.textInputContainer}
            onChangeText={(newText) => setDisplayName(newText)}
            maxLength={CONSTRAINTS.User.DisplayName.Max}
          />
          <TextInput
            placeholder={"Username"}
            placeholderTextColor={COLORS.gray}
            style={styles.textInputContainer}
            onChangeText={(newText) => setUsername(newText)}
            maxLength={CONSTRAINTS.User.Username.Max}
          />
          <TextInput
            placeholder={"Password"}
            placeholderTextColor={COLORS.gray}
            style={styles.textInputContainer}
            onChangeText={(newText) => setPassword(newText)}
            secureTextEntry={true}
            maxLength={CONSTRAINTS.User.Password.Max}
          />
          <TextInput
            placeholder={"Confirm Password"}
            placeholderTextColor={COLORS.gray}
            style={styles.textInputContainer}
            onChangeText={(newText) => setConfirmPassword(newText)}
            secureTextEntry={true}
            maxLength={CONSTRAINTS.User.Password.Max}
          />
          <View style={styles.textInputContainer}>
            <SchoolSearchSelector
              setSelectedSchool={setSelectedSchool}
              textStyle={{
                color: COLORS.gray,
                fontFamily: CUSTOMFONT_REGULAR,
              }}
              buttonStyle={{
                borderRadius: 5,
                borderWidth: 0,
              }}
              initialText={"Select your school"}
              maxLines={1}
            />
          </View>
          <View
            style={{
              marginTop: 40,
              marginBottom: 20,
              width: "80%",
              alignItems: "center",
            }}
          >
            <McText style={{ textAlign: "center" }} body6 color={COLORS.gray}>
              By creating an account, you agree to our{" "}
              <McText
                onPress={onTermsOfServiceClick}
                body6
                color={COLORS.gray}
                style={{ textDecorationLine: "underline" }}
              >
                Terms of Service
              </McText>{" "}
              and{" "}
              <McText
                onPress={onPrivacyPolicyClick}
                body6
                color={COLORS.gray}
                style={{ textDecorationLine: "underline" }}
              >
                Privacy Policy
              </McText>
            </McText>
          </View>
          <TouchableOpacity onPress={onSignup}>
            <View style={styles.submitButton}>
              <McText
                h4
                style={{
                  color: COLORS.white,
                }}
              >
                Signup
              </McText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={onNavigateLogin}>
            <McText body3>Already have an account?</McText>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </MobileSafeView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: COLORS.trueBlack,
  },
  welcomeTextContainer: {
    marginTop: 15
  },
  welcomeText: {
    textAlign: "center",
  },
  textInputContainer: {
    width: SIZES.width - 80,
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontFamily: CUSTOMFONT_REGULAR,
    fontSize: 16,
    color: COLORS.white,
    paddingVertical: 10,
    marginTop: 20,
  },
  submitButton: {
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.purple,
    marginBottom: 50,
  },
  backarrowContainer: {
    width: SIZES.width - 60,
    marginTop: 20,
  },
});
