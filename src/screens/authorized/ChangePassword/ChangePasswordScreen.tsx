//import React from 'react';
import React, { useState, useEffect, useContext } from "react";
import {
  TouchableHighlight,
  Platform,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Button,
  SafeAreaView,
  TextInput,
  FlatList,
  Image,
  ImageBackground,
  TouchableWithoutFeedback,
  Alert,
  Modal,
  Pressable,
  Appearance,
  useColorScheme,
} from "react-native";
import styled from "styled-components/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";

import { FONTS, SIZES, COLORS, icons, images, User } from "../../../constants";
import { McText, McIcon, McAvatar } from "../../../components/Styled";
import { TouchableOpacity } from "react-native-gesture-handler";
import "react-native-gesture-handler";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Dimensions } from "react-native";
import DatePicker from "react-native-modern-datepicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ProgressLoader from "rn-progress-loader";
import ImagePicker from "../../../components/ImagePickerButton";
import {
  checkIfStringIsAlphanumeric,
  checkIfStringIsReadable,
  displayError,
  formatError,
} from "../../../helpers/helpers";
import { updateUser } from "../../../services/UserService";
import { UserContext } from "../../../contexts/UserContext";
import { CUSTOMFONT_REGULAR } from "../../../constants/theme";
import SectionHeader from "../../../components/Styled/SectionHeader";
import MobileSafeView from "../../../components/Styled/MobileSafeView";
import { ScreenContext } from "../../../contexts/ScreenContext";
import { CONSTRAINTS } from "../../../constants/constraints";
import { changePassword } from "../../../services/AuthService";

const ChangePasswordScreen = ({ route }) => {
  const navigation = useNavigation<any>();
  const { setLoading } = useContext(ScreenContext);
  const { userToken } = useContext(UserContext);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");

  const handleSubmit = () => {
    if (confirmNewPassword !== newPassword) {
      displayError(
        formatError(
          "Input error",
          "New passwords do not match"
        )
      );
      return;
    }
    setLoading(true);
    changePassword(userToken.UserAccessToken, oldPassword, newPassword)
      .then(() => {
        setLoading(false);
        navigation.goBack();
      })
      .catch((error: Error) => {
        displayError(error);
        setLoading(false);
      });
  };

  return (
    <MobileSafeView style={styles.container}>
      <SectionHeader
        title={"Password"}
        leftButtonSVG={<icons.backarrow />}
        leftButtonOnClick={() => navigation.goBack()}
        rightButtonSVG={
          <McText h3 color={COLORS.purple}>
            Save
          </McText>
        }
        rightButtonOnClick={() => handleSubmit()}
      />
      <KeyboardAwareScrollView>
        <View style={{ alignItems: "center" }}>
          <View>
            <TextInput
              placeholder={"Old password"}
              placeholderTextColor={COLORS.gray}
              style={styles.textInputContainer}
              maxLength={CONSTRAINTS.User.Password.Max}
              onChangeText={(newText) => setOldPassword(newText)}
              secureTextEntry={true}
            />
          </View>
          <View>
            <TextInput
              placeholder={"New password"}
              placeholderTextColor={COLORS.gray}
              style={styles.textInputContainer}
              maxLength={CONSTRAINTS.User.Password.Max}
              onChangeText={(newText) => setNewPassword(newText)}
              secureTextEntry={true}
            />
          </View>
          <View>
            <TextInput
              placeholder={"Confirm new password"}
              placeholderTextColor={COLORS.gray}
              style={styles.textInputContainer}
              maxLength={CONSTRAINTS.User.Password.Max}
              onChangeText={(newText) => setConfirmNewPassword(newText)}
              secureTextEntry={true}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </MobileSafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.trueBlack,
  },
  MainContainer: {
    flex: 1,
    padding: 6,
    alignItems: "center",
    backgroundColor: "white",
  },

  titleContainer: {
    marginTop: 20,
    marginBottom: 2,
    flexDirection: "row",
    alignItems: "center",
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
    marginTop: 30,
  },

  modalBackground: {
    backgroundColor: "#161616",
    borderRadius: 15,
    justifyContent: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: COLORS.purple,
  },
});

export default ChangePasswordScreen;
