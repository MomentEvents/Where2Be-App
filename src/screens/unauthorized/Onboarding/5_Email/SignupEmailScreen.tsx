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
import {
  checkEmailAvailability,
  checkUsernameAvailability,
} from "../../../../services/AuthService";
import { CustomError } from "../../../../constants/error";
import {
  checkIfStringIsEmail,
  displayError,
} from "../../../../helpers/helpers";

const SignupEmailScreen = () => {
  const navigator = useNavigation<any>();

  const { signupValues, setSignupValues } = useContext(AuthContext);

  const { setLoading } = useContext(ScreenContext);

  const emailRef = useRef("");

  const onNavigateBack = () => {
    navigator.goBack();
  };

  const onNextClick = () => {
    emailRef.current = emailRef.current.trim()
    if (!checkIfStringIsEmail(emailRef.current)) {
      Alert.alert("Please enter a valid email.");
      return;
    }
    setLoading(true);

    checkEmailAvailability(emailRef.current)
      .then(() => {
        setSignupValues({ ...signupValues, Email: emailRef.current });
        navigator.navigate(SCREENS.Onboarding.SignupPasswordScreen);
      })
      .catch((error: CustomError) => {
        displayError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: COLORS.trueBlack }}
      contentContainerStyle={{ backgroundColor: COLORS.trueBlack, flex: 1 }}
    >
      <MobileSafeView style={styles.container}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <TouchableOpacity onPress={onNavigateBack}>
            <icons.backarrow />
          </TouchableOpacity>
          <TouchableOpacity onPress={onNextClick}>
            <McText h4>Next</McText>
          </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
          <Image
            source={IMAGES.email}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.titleTextContainer}>
          <McText style={styles.titleText} h1>
            Stay Connected
          </McText>
          <McText style={styles.descriptionText} h4>
            Provide your email address, which will serve as a way to{" "}
            <McText color={COLORS.purple} h4>
              recover your account if needed
            </McText>
            .
          </McText>
        </View>
        <View style={styles.userInputContainer}>
          <TextInput
            placeholder={"Email"}
            placeholderTextColor={COLORS.gray}
            style={styles.textInputContainer}
            onChangeText={(newText) => (emailRef.current = newText)}
          />
        </View>
      </MobileSafeView>
    </KeyboardAwareScrollView>
  );
};

export default SignupEmailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.trueBlack,
    paddingBottom: 100,
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
    marginTop: 50,
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
    width: "90%",
  },
});
