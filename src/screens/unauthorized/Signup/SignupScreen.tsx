import {
  Button,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { AuthContext } from "../../../contexts/AuthContext";
import GradientBackground from "../../../components/Styled/GradientBackground";
import { McText } from "../../../components/Styled";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { COLORS, FONTS, SCREENS, SIZES, School } from "../../../constants";
import { CUSTOMFONT_REGULAR } from "../../../constants/theme";
import { ScreenContext } from "../../../contexts/ScreenContext";
import { displayError, formatError } from "../../../helpers/helpers";
import SchoolSelector from "./components/SchoolSelector";
import { useNavigation } from "@react-navigation/native";

const SignupScreen = () => {
  const { userSignup } = useContext(AuthContext);
  const { setLoading } = useContext(ScreenContext);
  const navigation = useNavigation<any>();
  
  const [username, setUsername] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [selectedSchool, setSelectedSchool] = useState<School>(null);
  const [password, setPassword] = useState<string>("");

  const onSignup = () => {
    if (selectedSchool === null) {
      displayError(formatError("Input error", "Please select a valid school"));
      return;
    }
    setLoading(true);
    userSignup(username, displayName, password, selectedSchool.SchoolID)
      .then(() => setLoading(false))
      .catch((error) => {
        displayError(error);
        setLoading(false);
      });
  };

  const onNavigateLogin = () => {
    navigation.navigate(SCREENS.Login);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <SafeAreaView style={styles.container}>
            <View style={styles.welcomeTextContainer}>
              <McText h1 style={styles.welcomeText}>
                Welcome to Moment!
              </McText>
            </View>
            <TextInput
              placeholder={"Name"}
              placeholderTextColor={COLORS.gray}
              style={styles.textInputContainer}
              onChangeText={(newText) => setDisplayName(newText)}
              maxLength={20}
            />
            <TextInput
              placeholder={"Username"}
              placeholderTextColor={COLORS.gray}
              style={styles.textInputContainer}
              onChangeText={(newText) => setUsername(newText)}
              maxLength={20}
            />
            <TextInput
              placeholder={"Password"}
              placeholderTextColor={COLORS.gray}
              style={styles.textInputContainer}
              onChangeText={(newText) => setPassword(newText)}
              secureTextEntry={true}
            />
            <View style={styles.textInputContainer}>
              <SchoolSelector setSelectedSchool={setSelectedSchool} />
            </View>
            <TouchableOpacity onPress={onSignup}>
              <View style={styles.submitButton}>
                <McText
                  h4
                  style={{
                    color: COLORS.white,
                  }}
                >
                  Signup
                </McText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={onNavigateLogin}>
              <McText body3>Already have an account?</McText>
            </TouchableOpacity>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.trueBlack
  },
  welcomeTextContainer: {
    marginBottom: 40,
  },
  welcomeText: { 
    textAlign: "center" 
  },
  textInputContainer: {
    width: SIZES.width / 1.3,
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontFamily: CUSTOMFONT_REGULAR,
    fontSize: 16,
    color: COLORS.white,
    paddingVertical: 10,
    marginTop: 20,
  },
  submitButton: {
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.purple,
    marginTop: 30,
    marginBottom: 60,
  },
});
