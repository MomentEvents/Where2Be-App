import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ImageBackground,
  Linking,
  Alert,
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
import CustomTextInput from "../../../../components/Styled/CustomTextInput";
import { appVersionText } from "../../../../constants/texts";
import * as WebBrowser from 'expo-web-browser';

const SignupWelcomeScreen = () => {

  const navigator = useNavigation<any>();
  const emailRef = useRef("");
  const { showErrorAlert, showAlert, showTextAlert } = useContext(AlertContext);
  const { setLoading } = useContext(ScreenContext);
  const { signupValues, setSignupValues } = useContext(AuthContext);
  const insets = useSafeAreaInsets();

  const onNavigateLogin = () => {
    navigator.navigate(SCREENS.Login);
  };

  const onDiscordClick = () => {
    const supported = Linking.canOpenURL("https://where2be.app/discord");

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      WebBrowser.openBrowserAsync("https://where2be.app/discord");
    } else {
      Alert.alert(`Unable to open link: ${"https://where2be.app/discord"}`);
    }
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
        navigator.navigate(SCREENS.Onboarding.SignupUsernameScreen);
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
            <View style={styles.titleTextContainer}>
              <McText style={styles.titleText} h1>
                Welcome to Where<McText h1 color={COLORS.purple}>2</McText>Be!
              </McText>
              <McText style={styles.descriptionText} body3>
                Let's create your account
                </McText>
            </View>
            <View style={styles.userInputContainer}>
              <CustomTextInput
                placeholder={"School email"}
                onChangeText={(newText) => (emailRef.current = newText)}
              />
              <TouchableOpacity onPress={onNextClick} style={{width: "100%", marginTop: 15, paddingVertical: 10, borderRadius: 8, backgroundColor: COLORS.purple}}>
                <McText h4 style={{textAlign: "center"}}>
                  Next
                </McText>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={{ marginTop: 20 }}
                onPress={onNavigateLogin}
              >
                <McText
                  body4
                  color={COLORS.lightGray}
                  style={{ textAlign: "center" }}
                >
                  I already have an account
                </McText>
              </TouchableOpacity>
            </View>
            <View style={{ padding: 5, alignItems: 'center', justifyContent: 'flex-end', flexGrow: 1}}>
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
    paddingTop: 108,
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
