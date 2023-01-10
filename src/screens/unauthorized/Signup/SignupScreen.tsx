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
import * as Navigator from "../../../navigation/Navigator";
import SchoolSelector from "./components/SchoolSelector";

const SignupScreen = () => {
  const { userSignup } = useContext(AuthContext);
  const { setLoading } = useContext(ScreenContext);

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [selectedSchool, setSelectedSchool] = useState<School>(null);
  const [password, setPassword] = useState<string>("");

  const onSignup = () => {
    if(selectedSchool === null){
        displayError(formatError("Input error", "Please select a valid school"))
        return;
    }
    setLoading(true);
    userSignup(username, displayName, email, password, selectedSchool.SchoolID)
      .then(() => setLoading(false))
      .catch((error) => {
        displayError(error);
        setLoading(false);
      });
  };

  const onNavigateLogin = () => {
    Navigator.navigate(SCREENS.Login);
  };

  return (
    <GradientBackground>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <SafeAreaView style={styles.container}>
            <View>
              <McText h1>Welcome to Moment!</McText>
            </View>
            <TextInput
              placeholder={"name"}
              placeholderTextColor={COLORS.gray}
              style={styles.textInputContainer}
              onChangeText={(newText) => setDisplayName(newText)}
            />
            <TextInput
              placeholder={"username"}
              placeholderTextColor={COLORS.gray}
              style={styles.textInputContainer}
              onChangeText={(newText) => setUsername(newText)}
            />
            <TextInput
              placeholder={"email"}
              placeholderTextColor={COLORS.gray}
              style={styles.textInputContainer}
              onChangeText={(newText) => setEmail(newText)}
            />
            <TextInput
              placeholder={"password"}
              placeholderTextColor={COLORS.gray}
              style={styles.textInputContainer}
              onChangeText={(newText) => setPassword(newText)}
              secureTextEntry={true}
            />
            <View style={styles.textInputContainer} >
              <SchoolSelector setSelectedSchool={setSelectedSchool}/>
            </View>
            <TouchableOpacity onPress={onSignup}>
              <View style={styles.submitButton}>
                <McText
                  h4
                  style={{
                    color: COLORS.black,
                  }}
                >
                  Signup
                </McText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={onNavigateLogin}>
              <McText b3>Already have an account? Login here!</McText>
            </TouchableOpacity>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </ScrollView>
    </GradientBackground>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textInputContainer: {
    width: SIZES.width / 1.3,
    borderColor: COLORS.white,
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
    backgroundColor: COLORS.white,
    marginTop: 30,
    marginBottom: 60,
  },
});
