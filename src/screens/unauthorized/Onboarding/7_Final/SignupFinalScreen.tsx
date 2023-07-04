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

const SignupFinalScreen = () => {
  const navigator = useNavigation<any>();

  const { signupValues, setSignupValues, userSignup } = useContext(AuthContext);

  const { setLoading } = useContext(ScreenContext);

  const onNavigateBack = () => {
    navigator.goBack();
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
      signupValues.SchoolID,
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
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity onPress={onNavigateBack}>
          <icons.backarrow />
        </TouchableOpacity>
      </View>
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
          You're all set! Start
          exploring events, connecting with fellow students, and{" "}
          <McText color={COLORS.purple} h4>
            making unforgettable memories on your campus
          </McText>
          .
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
          <McText h4>Create Account</McText>
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
    marginTop: 20,
    width: "90%",
  },
});
