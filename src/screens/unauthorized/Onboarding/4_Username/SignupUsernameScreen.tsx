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
import { checkUsernameAvailability } from "../../../../services/AuthService";
import { CustomError } from "../../../../constants/error";
import { displayError } from "../../../../helpers/helpers";

const SignupUsernameScreen = () => {
  const navigator = useNavigation<any>();

  const { signupValues, setSignupValues } = useContext(AuthContext);

  const { setLoading } = useContext(ScreenContext);

  const usernameRef = useRef("");

  const onNavigateBack = () => {
    navigator.goBack();
  };

  const onNextClick = () => {
    usernameRef.current = usernameRef.current.trim();
    if (usernameRef.current.length < CONSTRAINTS.User.Username.Min) {
      Alert.alert(
        "Please enter a name that is longer than " +
          (CONSTRAINTS.User.Username.Min - 1) +
          " characters."
      );
      return;
    }
    setLoading(true);

    checkUsernameAvailability(usernameRef.current)
      .then(() => {
        setSignupValues({ ...signupValues, Name: usernameRef.current });
        navigator.navigate(SCREENS.Onboarding.SignupEmailScreen);
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
            source={IMAGES.myAccount}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.titleTextContainer}>
          <McText style={styles.titleText} h1>
            Claim Your Unique Username
          </McText>
          <McText style={styles.descriptionText} h4>
            Create a memorable username that will help you connect with others
            and make your mark in the{" "}
            <McText color={COLORS.purple} h4>
              Where2Be community
            </McText>
            .
          </McText>
        </View>
        <View style={styles.userInputContainer}>
          <TextInput
            placeholder={"Username"}
            placeholderTextColor={COLORS.gray}
            style={styles.textInputContainer}
            onChangeText={(newText) => (usernameRef.current = newText)}
            maxLength={CONSTRAINTS.User.DisplayName.Max}
          />
        </View>
      </MobileSafeView>
    </KeyboardAwareScrollView>
  );
};

export default SignupUsernameScreen;

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
