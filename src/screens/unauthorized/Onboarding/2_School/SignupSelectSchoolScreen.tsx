import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import MobileSafeView from "../../../../components/Styled/MobileSafeView";
import { COLORS, SCREENS, School, icons } from "../../../../constants";
import { McText } from "../../../../components/Styled";
import { schoolLandmark } from "../../../../constants/images";
import { useNavigation } from "@react-navigation/native";
import SchoolSearchSelector from "../../../../components/SchoolSearchSelector/SchoolSearchSelector";
import { AuthContext } from "../../../../contexts/AuthContext";
import { CUSTOMFONT_BOLD } from "../../../../constants/theme";

const SignupWelcomeScreen = () => {
  const navigator = useNavigation<any>();

  const {signupValuesRef} = useContext(AuthContext)

  const onNavigateBack = () => {
    navigator.goBack();
  };

  const onNextClick = () => {
    navigator.navigate(SCREENS.Onboarding.SignupNameScreen);
  };
  return (
    <MobileSafeView style={styles.container}>
      <TouchableOpacity onPress={onNavigateBack}>
        <icons.backarrow />
      </TouchableOpacity>
      <View style={styles.imageContainer}>
        <Image
          source={schoolLandmark}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.titleTextContainer}>
        <McText style={styles.titleText} h1>
          Your Campus, Your Events
        </McText>
        <McText style={styles.descriptionText} h4>
          Please select your university to unlock a world of events{" "}
          <McText h4 color={COLORS.purple}>
            tailored just for you
          </McText>
          .
        </McText>
      </View>
      <View style={styles.buttonContainer}>
        <SchoolSearchSelector
          onSelectSchool={(school: School) => {
            signupValuesRef.current.SchoolID = school.SchoolID;
            onNextClick();
          }}
          textStyle={{
            color: COLORS.white,
            fontFamily: CUSTOMFONT_BOLD,
            paddingHorizontal: 10,
            paddingVertical: 3,
          }}
          buttonStyle={{
            backgroundColor: COLORS.purple,
            borderColor: COLORS.purple,
            borderRadius: 5,
            borderWidth: 0,
          }}
          initialText={"Select your school"}
        />
        <McText style={{ marginTop: 20, textAlign: "center" }} color={COLORS.gray} body5>
          Don't see your school? Contact us on discord or email
          team@where2be.app!
        </McText>
      </View>
    </MobileSafeView>
  );
};

export default SignupWelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.trueBlack,
    paddingBottom: 60,
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
  buttonContainer: {
    marginTop: 80,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
