import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
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
import { CUSTOMFONT_BOLD } from "../../../../constants/theme";
import { AntDesign } from "@expo/vector-icons";

const SignupSelectSchoolScreen = () => {
  const navigator = useNavigation<any>();

  const { signupValues, setSignupValues } = useContext(AuthContext);

  const currentSchoolRef = useRef<School>(undefined);
  const onNavigateBack = () => {
    navigator.goBack();
  };

  const onNextClick = () => {
    if (!currentSchoolRef.current) {
      Alert.alert("Please select a school");
      return;
    }
    setSignupValues({
      ...signupValues,
      SchoolID: currentSchoolRef.current.SchoolID,
    });
    navigator.navigate(SCREENS.Onboarding.SignupNameScreen);
  };
  return (
    <MobileSafeView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={IMAGES.schoolLandmark}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.titleTextContainer}>
        <McText style={styles.titleText} h1>
          Your Campus, Your Events
        </McText>
        <McText style={styles.descriptionText} h4>
          Select your university to unlock a world of events{" "}
          <McText h4 color={COLORS.purple}>
            tailored just for you
          </McText>
          .
        </McText>
      </View>
      <View style={styles.buttonContainer}>
        <SchoolSearchSelector
          onSelectSchool={(school: School) => {
            currentSchoolRef.current = school;
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
        <McText
          style={{ marginTop: 20, textAlign: "center" }}
          color={COLORS.gray}
          body5
        >
          Don't see your school? Contact us on discord or email
          team@where2be.app!
        </McText>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginTop: 25,
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity
          style={{ borderRadius: 5, paddingVertical: 10, paddingHorizontal: 14}}
          onPress={onNavigateBack}
        >
          <View style={{ flexDirection: "row" }}>
            <AntDesign name="caretleft" size={24} color="white" />
            <McText h4>Back</McText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ borderRadius: 5, paddingVertical: 10, paddingHorizontal: 14 }}
          onPress={onNextClick}
        >
          <View style={{ flexDirection: "row" }}>
            <McText h4>Next</McText>

            <AntDesign name="caretright" size={24} color="white" />
          </View>
        </TouchableOpacity>
      </View>
    </MobileSafeView>
  );
};

export default SignupSelectSchoolScreen;

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
  buttonContainer: {
    marginTop: 80,
    justifyContent: "flex-end",
    alignItems: "center",
  },
});
