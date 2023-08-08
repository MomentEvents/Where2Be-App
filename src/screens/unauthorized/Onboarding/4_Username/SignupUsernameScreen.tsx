import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
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
} from "../../../../constants/theme";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CONSTRAINTS } from "../../../../constants/constraints";
import { ScreenContext } from "../../../../contexts/ScreenContext";
import { checkUsernameAvailability } from "../../../../services/AuthService";
import { CustomError } from "../../../../constants/error";
import { showBugReportPopup } from "../../../../helpers/helpers";
import { AntDesign, Feather } from "@expo/vector-icons";
import { McTextInput } from "../../../../components/Styled/styled";
import { AlertContext } from "../../../../contexts/AlertContext";
import CustomTextInput from "../../../../components/Styled/CustomTextInput";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SignupUsernameScreen = () => {
  const { showErrorAlert } = useContext(AlertContext);

  const navigator = useNavigation<any>();

  const { signupValues, setSignupValues } = useContext(AuthContext);

  const { setLoading } = useContext(ScreenContext);

  const usernameRef = useRef("");

  const insets = useSafeAreaInsets();

  const onNavigateBack = () => {
    navigator.goBack();
  };

  const nameRef = useRef("");
  const passwordRef = useRef("");

  const onNextClick = () => {
    usernameRef.current = usernameRef.current.trim();
    if (usernameRef.current.length < CONSTRAINTS.User.Username.Min) {
      Alert.alert(
        "Please enter a username that is longer than " +
          (CONSTRAINTS.User.Username.Min - 1) +
          " characters."
      );
      return;
    }

    if (nameRef.current.length < CONSTRAINTS.User.DisplayName.Min) {
      Alert.alert(
        "Please enter a name that is longer than " +
          (CONSTRAINTS.User.DisplayName.Min - 1) +
          " characters."
      );
      return;
    }

    if (passwordRef.current.length < CONSTRAINTS.User.Password.Min) {
      Alert.alert(
        "Please enter a password that is longer than " +
          (CONSTRAINTS.User.Password.Min - 1) +
          " characters."
      );
      return;
    }
    setLoading(true);

    checkUsernameAvailability(usernameRef.current)
      .then(() => {
        setSignupValues({
          ...signupValues,
          Name: nameRef.current,
          Username: usernameRef.current,
          Password: passwordRef.current,
        });
        navigator.navigate(SCREENS.Onboarding.SignupFinalScreen);
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
              <McText style={styles.titleText} h1>
                Username and password
              </McText>
            </View>
            <View style={styles.userInputContainer}>
              {/* <CustomTextInput
                placeholder={"Name"}
                onChangeText={(newText) => (nameRef.current = newText)}
              /> */}
              <CustomTextInput
                placeholder={"Username"}
                onChangeText={(newText) => {
                  usernameRef.current = newText;
                  nameRef.current = newText;
                }}
              />
              <CustomTextInput
                placeholder={"Password"}
                style={{ marginTop: 15 }}
                onChangeText={(newText) => (passwordRef.current = newText)}
                secureTextEntry={true}
              />
              <TouchableOpacity
                onPress={onNextClick}
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
            </View>
          </View>
        </ImageBackground>
      </MobileSafeView>
    </KeyboardAwareScrollView>
  );
};

export default SignupUsernameScreen;

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
