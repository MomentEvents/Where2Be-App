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

const SignupNameScreen = () => {
  const navigator = useNavigation<any>();

  const { signupValues, setSignupValues } = useContext(AuthContext);

  const nameRef = useRef("");

  const onNavigateBack = () => {
    navigator.goBack();
  };

  const onNextClick = () => {
    nameRef.current = nameRef.current.trim()
    if(nameRef.current.length < CONSTRAINTS.User.DisplayName.Min){
      Alert.alert("Please enter a name that is longer than " + (CONSTRAINTS.User.DisplayName.Min - 1) + " characters.")
      return
    }
    setSignupValues({...signupValues, Name: nameRef.current})
    navigator.navigate(SCREENS.Onboarding.SignupUsernameScreen);
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
            source={IMAGES.idCard}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.titleTextContainer}>
          <McText style={styles.titleText} h1>
            Introduce Yourself
          </McText>
          <McText style={styles.descriptionText} h4>
            We'd love to know your name to better personalize{" "}
            <McText color={COLORS.purple} h4>
              your experience
            </McText>
            .
          </McText>
        </View>
        <View style={styles.userInputContainer}>
          <TextInput
            placeholder={"My name is..."}
            placeholderTextColor={COLORS.gray}
            style={styles.textInputContainer}
            onChangeText={(newText) => (nameRef.current = newText)}
            maxLength={CONSTRAINTS.User.DisplayName.Max}
          />
        </View>
      </MobileSafeView>
    </KeyboardAwareScrollView>
  );
};

export default SignupNameScreen;

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
    marginTop: 80,
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
