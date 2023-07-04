import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import React from "react";
import MobileSafeView from "../../../../components/Styled/MobileSafeView";
import { COLORS, SCREENS, icons } from "../../../../constants";
import { McText } from "../../../../components/Styled";
import { IMAGES } from "../../../../constants/images";
import { useNavigation } from "@react-navigation/native";

const SignupWelcomeScreen = () => {
  const navigator = useNavigation<any>();
  const onNavigateLogin = () => {
    navigator.navigate(SCREENS.Login);
  };

  const onNavigateBack = () => {
    navigator.goBack();
  };

  const onNextClick = () => {
    navigator.push(SCREENS.Onboarding.SignupSchoolScreen);
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
          source={IMAGES.happyStudents}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.titleTextContainer}>
        <McText style={styles.titleText} h1>
          Welcome to Where2Be!
        </McText>
        <McText style={styles.descriptionText} h4>
          Join our{" "}
          <McText h4 color={COLORS.purple}>
            vibrant community
          </McText>{" "}
          and{" "}
          <McText h4 color={COLORS.purple}>
            discover exciting events
          </McText>{" "}
          happening around your campus. Let's get started!
        </McText>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={{
            borderRadius: 5,
            backgroundColor: COLORS.purple,
            paddingVertical: 10,
            paddingHorizontal: 20,
          }}
          onPress={onNextClick}
        >
          <McText h4>Let's go!</McText>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 20 }} onPress={onNavigateLogin}>
          <McText body3 style={{ textAlign: "center" }}>
            I already have an account
          </McText>
        </TouchableOpacity>
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
