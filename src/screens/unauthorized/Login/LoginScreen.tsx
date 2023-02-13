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
import { COLORS, FONTS, SCREENS, SIZES } from "../../../constants";
import { CUSTOMFONT_REGULAR } from "../../../constants/theme";
import { ScreenContext } from "../../../contexts/ScreenContext";
import { displayError } from "../../../helpers/helpers";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const { userLogin } = useContext(AuthContext);
  const { setLoading } = useContext(ScreenContext);
  const navigation = useNavigation<any>();

  const [usercred, setUsercred] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const onLogin = () => {
    setLoading(true);
    userLogin(usercred, password)
      .then(() => setLoading(false))
      .catch((error) => {
        displayError(error);
        setLoading(false);
      });
  };

  const onNavigateSignup = () => {
    navigation.navigate(SCREENS.Signup)
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          <SafeAreaView style={styles.container}>
            <View style={styles.welcomeTextContainer}>
              <McText h1 style={styles.welcomeText}>Welcome to Moment!</McText>
            </View>
            <TextInput
              placeholder={"Username"}
              placeholderTextColor={COLORS.gray}
              style={styles.textInputContainer}
              onChangeText={(newText) => setUsercred(newText)}
              maxLength={20}
            />
            <TextInput
              placeholder={"Password"}
              placeholderTextColor={COLORS.gray}
              style={styles.textInputContainer}
              onChangeText={(newText) => setPassword(newText)}
              secureTextEntry={true}
            />
            <TouchableOpacity onPress={onLogin}>
              <View style={styles.submitButton}>
                <McText
                  h4
                  style={{
                    color: COLORS.white,
                  }}
                >
                  Login
                </McText>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={onNavigateSignup}>
              <McText body3>Don't have an account?</McText>
            </TouchableOpacity>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
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
    width: "100%",
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
