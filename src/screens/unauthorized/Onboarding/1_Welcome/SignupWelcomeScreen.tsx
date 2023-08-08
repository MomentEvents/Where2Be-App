import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { useContext, useRef } from "react";
import MobileSafeView from "../../../../components/Styled/MobileSafeView";
import { COLORS, SCREENS, School, icons } from "../../../../constants";
import { McText } from "../../../../components/Styled";
import { IMAGES } from "../../../../constants/images";
import { useNavigation } from "@react-navigation/native";
import { AntDesign, Feather } from "@expo/vector-icons";
import { McTextInput } from "../../../../components/Styled/styled";
import { CustomError } from "../../../../constants/error";
import {
  checkIfStringIsEmail,
  showBugReportPopup,
} from "../../../../helpers/helpers";
import { checkEmailAvailability } from "../../../../services/AuthService";
import { AlertContext } from "../../../../contexts/AlertContext";
import { ScreenContext } from "../../../../contexts/ScreenContext";
import { AuthContext } from "../../../../contexts/AuthContext";
import { CUSTOMFONT_REGULAR } from "../../../../constants/theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SignupWelcomeScreen = () => {
  const navigator = useNavigation<any>();
  const emailRef = useRef("");
  const { showErrorAlert, showAlert, showTextAlert } = useContext(AlertContext);
  const { setLoading } = useContext(ScreenContext);
  const { signupValues, setSignupValues } = useContext(AuthContext);
  const insets = useSafeAreaInsets()

  const onNavigateLogin = () => {
    navigator.navigate(SCREENS.Login);
  };

  const onNavigateBack = () => {
    navigator.goBack();
  };

  const onNextClick = () => {
    emailRef.current = emailRef.current.trim();
    if (!checkIfStringIsEmail(emailRef.current)) {
      showTextAlert("Please enter an email", 5);
      return;
    }
    setLoading(true);

    checkEmailAvailability(emailRef.current)
      .then((school: School) => {
        showTextAlert("Welcome to " + school.Name + "!", 5);
        setSignupValues({ ...signupValues, Email: emailRef.current });
        navigator.navigate(SCREENS.Onboarding.SignupNameScreen);
      })
      .catch((error: CustomError) => {
        if (error.showBugReportDialog) {
          showBugReportPopup(error);
        } else {
          showErrorAlert(error);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: '#000000' }}
      contentContainerStyle={{ backgroundColor: COLORS.trueBlack, flex: 1 }}
    >
      <MobileSafeView style={styles.container} isBottomViewable={true} isTopViewable={true}>
        <ImageBackground
          source={IMAGES.partyIllustration}
          style={{
            flex: 1,
            width: "100%",
            height: "100%", // This is to ensure it takes full height
          }}
          resizeMode="cover" // This scales the image to cover the view
        >
          <View style={{ paddingTop: insets.top, paddingBottom: insets.bottom, paddingHorizontal: 30, flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)' }}>
            <View
              style={{
                flexDirection: "row",
                marginTop: 30,
                marginBottom: 50,
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
            <View style={styles.titleTextContainer}>
              <McText style={styles.titleText} h1>
                Welcome to Where2Be!
              </McText>
            </View>
            <View style={styles.userInputContainer}>
              <McTextInput
                placeholder={"School Email"}
                placeholderTextColor={COLORS.lightGray}
                style={styles.textInputContainer}
                onChangeText={(newText) => (emailRef.current = newText)}
              />
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={{ marginTop: 20 }}
                onPress={onNavigateLogin}
              >
                <McText body4 style={{ textAlign: "center" }}>
                  I already have an account
                </McText>
              </TouchableOpacity>
            </View>
          </View>
        </ImageBackground>
      </MobileSafeView>
    </KeyboardAwareScrollView>
  );
};

export default SignupWelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
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
    borderColor: COLORS.lightGray,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontFamily: CUSTOMFONT_REGULAR,
    fontSize: 16,
    color: COLORS.lightGray,
    paddingVertical: 10,
    width: "90%",
  },
});
