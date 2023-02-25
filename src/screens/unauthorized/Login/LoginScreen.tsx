import {
  Button,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Touchable,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";
import { AuthContext } from "../../../contexts/AuthContext";
import GradientBackground from "../../../components/Styled/GradientBackground";
import { McText } from "../../../components/Styled";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { COLORS, FONTS, SCREENS, SIZES, icons } from "../../../constants";
import { CUSTOMFONT_REGULAR } from "../../../constants/theme";
import { ScreenContext } from "../../../contexts/ScreenContext";
import { displayError, openURL } from "../../../helpers/helpers";
import { useNavigation } from "@react-navigation/native";
import MobileSafeView from "../../../components/Styled/MobileSafeView";
import { CONSTRAINTS } from "../../../constants/constraints";

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
    navigation.navigate(SCREENS.Signup);
  };

  const onNavigateBack = () => {
    navigation.pop();
  };

  return (
    <MobileSafeView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 30 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView style={styles.container}>
          <View style={styles.backarrowContainer}>
            <TouchableOpacity onPress={onNavigateBack}>
              <icons.backarrow />
            </TouchableOpacity>
          </View>
          <View style={styles.welcomeTextContainer}>
            <McText h1 style={styles.welcomeText}>
              Welcome to Moment!
            </McText>
          </View>
          <TextInput
            placeholder={"Username"}
            placeholderTextColor={COLORS.gray}
            style={styles.textInputContainer}
            onChangeText={(newText) => setUsercred(newText)}
            maxLength={CONSTRAINTS.User.Username.Max}
          />
          <TextInput
            placeholder={"Password"}
            placeholderTextColor={COLORS.gray}
            style={styles.textInputContainer}
            onChangeText={(newText) => setPassword(newText)}
            secureTextEntry={true}
          />
          <View
            style={{
              marginTop: 30,
              marginBottom: 15,
              width: "80%",
              alignItems: "center",
            }}
          >
            <McText style={{ textAlign: "center" }} body6 color={COLORS.gray}>
              Forgot your password?{" "}
              <McText
                onPress={() => openURL("https://momentevents.app/contact")}
                body6
                color={COLORS.gray}
                style={{ textDecorationLine: "underline" }}
              >
                 Contact us
              </McText>
            </McText>
          </View>
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
        </KeyboardAvoidingView>
      </ScrollView>
    </MobileSafeView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: COLORS.trueBlack,
  },
  backarrowContainer: {
    width: SIZES.width - 60,
    marginVertical: 20,
  },
  welcomeTextContainer: {
    marginVertical: 40,
  },
  welcomeText: {
    textAlign: "center",
  },
  textInputContainer: {
    width: SIZES.width - 80,
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
    marginBottom: 60,
  },
});
