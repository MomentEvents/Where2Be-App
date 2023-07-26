import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
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
  displayError,
} from "../../../../helpers/helpers";
import { AntDesign } from "@expo/vector-icons";

const SignupFinalScreen = () => {
  const navigator = useNavigation<any>();

  const { signupValues, setSignupValues, userSignup } = useContext(AuthContext);

  const { setLoading } = useContext(ScreenContext);

  const onNavigateBack = () => {
    navigator.goBack();
  };

  const onTermsOfServiceClick = () => {
    const supported = Linking.canOpenURL("https://where2be.app/terms");

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      Linking.openURL("https://where2be.app/terms");
    } else {
      Alert.alert(`Unable to open link: ${"https://where2be.app/terms"}`);
    }
  };

  const onPrivacyPolicyClick = () => {
    const supported = Linking.canOpenURL("https://where2be.app/privacy");

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      Linking.openURL("https://where2be.app/privacy");
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
      .then(() => {
        // Do something. Maybe in context for is email verified
      })
      .catch((error) => {
        displayError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  return (
    <MobileSafeView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={IMAGES.graduation}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.titleTextContainer}>
        <McText style={styles.titleText} h1>
          Let the Adventure Begin!
        </McText>
        <McText style={styles.descriptionText} h4>
          You're all set! Start exploring events, connecting with fellow
          students, and{" "}
          <McText color={COLORS.purple} h4>
            making unforgettable memories on your campus
          </McText>
          .
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
        <McText
          style={{ textAlign: "center"}}
          body6
          color={COLORS.gray}
        >
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
          style={{
            borderRadius: 5,
            backgroundColor: COLORS.purple,
            paddingVertical: 10,
            paddingHorizontal: 20,
          }}
          onPress={onCreateAccountClick}
        >
          <McText h3>Create Account</McText>
        </TouchableOpacity>
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
      </View>
    </MobileSafeView>
  );
};

export default SignupFinalScreen;

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
    marginTop: 20,
    width: "90%",
  },
});
