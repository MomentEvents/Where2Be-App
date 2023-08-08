import {
  Alert,
  Button,
  ImageBackground,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Touchable,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { AuthContext } from "../../../contexts/AuthContext";
import GradientBackground from "../../../components/Styled/GradientBackground";
import { McText } from "../../../components/Styled";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { COLORS, FONTS, SCREENS, SIZES, icons } from "../../../constants";
import { CUSTOMFONT_REGULAR } from "../../../constants/theme";
import { ScreenContext } from "../../../contexts/ScreenContext";
import {
  displayError,
  openURL,
  showBugReportPopup,
} from "../../../helpers/helpers";
import { useNavigation } from "@react-navigation/native";
import MobileSafeView from "../../../components/Styled/MobileSafeView";
import { CONSTRAINTS } from "../../../constants/constraints";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { resetPassword } from "../../../services/AuthService";
import { McTextInput } from "../../../components/Styled/styled";
import { Feather } from "@expo/vector-icons";
import { CustomError } from "../../../constants/error";
import { AlertContext } from "../../../contexts/AlertContext";
import { IMAGES } from "../../../constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomTextInput from "../../../components/Styled/CustomTextInput";

const LoginScreen = () => {
  const { userLogin } = useContext(AuthContext);
  const { setLoading } = useContext(ScreenContext);
  const { showErrorAlert } = useContext(AlertContext);
  const navigation = useNavigation<any>();

  const [usercred, setUsercred] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const insets = useSafeAreaInsets();

  const onLogin = () => {
    setLoading(true);
    userLogin(usercred, password)
      .then(() => setLoading(false))
      .catch((error: CustomError) => {
        if (error.showBugReportDialog) {
          showBugReportPopup(error);
        } else {
          displayError(error);
        }
        setLoading(false);
      });
  };

  const onNavigateSignup = () => {
    navigation.navigate(SCREENS.Onboarding.SignupWelcomeScreen);
  };

  const onNavigateBack = () => {
    navigation.pop();
  };

  const onForgotPassword = () => {
    Alert.prompt(
      "Input email",
      "To reset an account's password, type the email of the account",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Submit",
          onPress: (email) => {
            setLoading(true);
            resetPassword(email)
              .then(() => {
                setLoading(false);
                Alert.alert(
                  "Link sent",
                  "Check your email inbox for a password reset link"
                );
              })
              .catch((error: CustomError) => {
                if (error.showBugReportDialog) {
                  showBugReportPopup(error);
                } else {
                  showErrorAlert(error);
                }
                setLoading(false);
              });
          },
        },
      ],
      "plain-text"
    );
  };

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: "#000000" }}
      contentContainerStyle={{ backgroundColor: COLORS.trueBlack, flex: 1 }}
    >
      <MobileSafeView
        style={styles.container}
        isBottomViewable={true}
        isTopViewable={true}
      >
        <ImageBackground
          source={IMAGES.partyIllustration}
          style={{
            flex: 1,
            width: "100%",
            height: "100%", // This is to ensure it takes full height
          }}
          resizeMode="cover" // This scales the image to cover the view
        >
          <View
            style={{
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
              paddingHorizontal: 30,
              flex: 1,
              backgroundColor: "rgba(0, 0, 0, 0.9)",
            }}
          >
            <View
              style={{
                marginTop: 30,
                marginBottom: 30,
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
                <Feather name="arrow-left" size={28} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.titleTextContainer}>
              <McText h1 style={styles.titleText}>
                Login
              </McText>
            </View>
            <CustomTextInput
              placeholder={"Username / Email"}
              style={{ marginTop: 15 }}
              onChangeText={(newText) => setUsercred(newText)}
            />
            <CustomTextInput
              placeholder={"Password"}
              style={{ marginTop: 15 }}
              onChangeText={(newText) => setPassword(newText)}
              secureTextEntry={true}
            />

            <View
              style={{
                marginTop: 30,
                marginBottom: 15,
                alignItems: "center",
              }}
            >
              <McText
                style={{
                  textAlign: "center",
                  textDecorationLine: "underline",
                }}
                body6
                color={COLORS.gray}
                onPress={onForgotPassword}
              >
                Forgot your password?
              </McText>
            </View>
            <TouchableOpacity
              onPress={onLogin}
              style={{
                width: "100%",
                marginTop: 15,
                paddingVertical: 10,
                borderRadius: 8,
                backgroundColor: COLORS.purple,
              }}
            >
              <McText h4 style={{ textAlign: "center" }}>
                Next
              </McText>
            </TouchableOpacity>
            <TouchableOpacity onPress={onNavigateSignup}
            style={{width: "100%", marginTop: 50}}>
              <McText color={COLORS.purple} style={{textAlign: "center"}} body4>I don't have an account</McText>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </MobileSafeView>
    </KeyboardAwareScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  imageContainer: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  userInputContainer: {
    marginTop: 50,
    justifyContent: "flex-end",
    alignItems: "center",
    marginHorizontal: 10,
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
  buttonContainer: {
    marginTop: 80,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  textInputContainer: {
    borderColor: COLORS.gray2,
    borderWidth: 0.3,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontFamily: CUSTOMFONT_REGULAR,
    fontSize: 16,
    color: COLORS.lightGray,
    paddingVertical: 10,
    width: "90%",
    backgroundColor: COLORS.black,
  },
});
