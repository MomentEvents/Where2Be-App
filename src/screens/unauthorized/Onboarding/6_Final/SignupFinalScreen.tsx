import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
  ImageBackground,
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
  SIZES,
} from "../../../../constants/theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CONSTRAINTS } from "../../../../constants/constraints";
import { ScreenContext } from "../../../../contexts/ScreenContext";
import {
  checkEmailAvailability,
  checkUsernameAvailability,
} from "../../../../services/AuthService";
import { CustomError } from "../../../../constants/error";
import {
  checkIfStringIsEmail,
  showBugReportPopup,
} from "../../../../helpers/helpers";
import { AntDesign, Feather } from "@expo/vector-icons";
import { AlertContext } from "../../../../contexts/AlertContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as WebBrowser from "expo-web-browser";

const SignupFinalScreen = () => {
  const navigator = useNavigation<any>();

  const { signupValues, setSignupValues, userSignup } = useContext(AuthContext);
  const { showErrorAlert, showTextAlert } = useContext(AlertContext);
  const { setLoading, signupActionEventID } = useContext(ScreenContext);

  const insets = useSafeAreaInsets();

  const onNavigateBack = () => {
    navigator.goBack();
  };

  const onTermsOfServiceClick = () => {
    const supported = Linking.canOpenURL("https://where2be.app/terms");

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      WebBrowser.openBrowserAsync("https://where2be.app/terms");
    } else {
      Alert.alert(`Unable to open link: ${"https://where2be.app/terms"}`);
    }
  };

  const onPrivacyPolicyClick = () => {
    const supported = Linking.canOpenURL("https://where2be.app/privacy");

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      WebBrowser.openBrowserAsync("https://where2be.app/privacy");
    } else {
      Alert.alert(`Unable to open link: ${"https://where2be.app/privacy"}`);
    }
  };

  const onCreateAccountClick = () => {
    for (var key in signupValues) {
      if (!signupValues[key]) {
        Alert.alert(
          key + " is undefined in signup values. Please report this!"
        );
        return;
      }
    }
    setLoading(true);
    userSignup(
      signupValues.Username,
      signupValues.Name,
      signupValues.Password,
      signupValues.Email
    )
      .then((token) => {
        // Do something. Maybe in context for is email verified
        console.log(signupActionEventID.current + " IS THE ACTION EVENT ID");

        if (signupActionEventID.current) {
          navigator.navigate(SCREENS.EventDetails, {
            eventID: signupActionEventID.current,
          });
          showTextAlert("Welcome to Where2Be!", 5)

          signupActionEventID.current = null;
        }
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
          {/* <View style={styles.imageContainer}>
            <Image
              source={IMAGES.graduation}
              style={styles.image}
              resizeMode="contain"
            />
          </View> */}
          <View style={styles.titleTextContainer}>
            <McText style={styles.titleText} h1>
              Let the Adventure Begin!
            </McText>
            <McText
              style={styles.descriptionText}
              color={COLORS.lightGray}
              body3
            >
              You're all set! Start exploring events and make unforgettable
              memories on your campus.
            </McText>
          </View>
          <View
            style={{
              marginTop: 30,
              alignSelf: "center",
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
          <View style={styles.userInputContainer}>
            <TouchableOpacity
              onPress={onCreateAccountClick}
              style={{
                width: "100%",
                marginTop: 15,
                paddingVertical: 10,
                borderRadius: 8,
                backgroundColor: COLORS.purple,
              }}
            >
              <McText h4 style={{ textAlign: "center" }}>
                Activate Account
              </McText>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginTop: 60,
              justifyContent: "space-between",
            }}
          />
        </View>
      </ImageBackground>
    </MobileSafeView>
  );
};

export default SignupFinalScreen;

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
