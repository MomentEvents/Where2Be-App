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

import { FONTS, SIZES, COLORS, icons, images } from "../../../constants";
import { McText, McIcon, McAvatar } from "../../../components/Styled";
import { TouchableOpacity } from "react-native-gesture-handler";
import "react-native-gesture-handler";
import { useRoute } from "@react-navigation/native";
import { Dimensions } from "react-native";
import DatePicker from "react-native-modern-datepicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ProgressLoader from "rn-progress-loader";
import ImagePicker from "../../../components/ImagePickerButton";
import {
  checkIfStringIsAlphanumeric,
  checkIfStringIsReadable,
  displayError,
} from "../../../helpers/helpers";
import { updateUser } from "../../../services/UserService";
import { UserContext } from "../../../contexts/UserContext";
import * as Navigator from "../../../navigation/Navigator";
import { CUSTOMFONT_REGULAR } from "../../../constants/theme";
import SectionHeader from "../../../components/Styled/SectionHeader";

var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height; //full height

const EditMyProfileScreen = ({ navigation, route }) => {
  const { currentUser, userToken } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(currentUser.Picture);

  const [displayName, setDisplayName] = useState(currentUser.Name);
  const [username, setUsername] = useState(currentUser.Username);

  const handleSubmit = () => {
    if (!checkIfStringIsReadable(displayName)) {
      Alert.alert("Error", "Please enter a valid display name");
      return;
    }

    if (!checkIfStringIsAlphanumeric(username)) {
      Alert.alert("Error", "Please enter a valid username");
      return;
    }

    // Update information

    setLoading(true);

    updateUser(
      currentUser.UserID,
      userToken.UserAccessToken,
      username,
      displayName,
      null,
      image
    )
      .then(() => {
        setLoading(false);
        Navigator.goBack();
      })
      .catch((error: Error) => {
        displayError(error);
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <SectionHeader
        title={"Edit Profile"}
        leftButtonSVG={<icons.backarrow />}
        leftButtonOnClick={() => Navigator.goBack()}
      />
      <KeyboardAwareScrollView>
        <View
          style={{
            marginTop: 40,
          }}
        >
          <ImagePicker
            height={width * 0.3}
            width={width * 0.3}
            setImageURI={setImage}
            originalImageURI={image}
            style={{borderRadius: 90}}
          />
        </View>
        <View
          style={{
            marginVertical: 8,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <icons.displayname width={30} />
            <McText
              h3
              style={{
                marginLeft: 4,
              }}
            >
              Name
            </McText>
          </View>
          <TextInput
            placeholder={"enter your display name"}
            placeholderTextColor={COLORS.gray}
            style={styles.textInputContainer}
            value={displayName}
            onChangeText={setDisplayName}
            multiline={false}
            maxLength={40}
          />
        </View>
        <View
          style={{
            marginVertical: 8,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 6,
            }}
          >
            <icons.username width={30} />
            <McText
              h3
              style={{
                marginLeft: 4,
              }}
            >
              Username
            </McText>
          </View>
          <TextInput
            placeholder={"enter your display name"}
            placeholderTextColor={COLORS.gray}
            style={styles.textInputContainer}
            value={username}
            onChangeText={setUsername}
            multiline={false}
            maxLength={30}
          />
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  grabox: {
    backgroundColor: "rgba(100,100,100,0.8)",
    borderRadius: SIZES.radius,
  },
  tempNav: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#282828",
    // borderRadius: 20
  },
  org: {
    borderRadius: SIZES.radius,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.gray,
  },
  userProfilePic: {
    height: height / 11,
    width: height / 11,
    borderRadius: 300,
    margin: 12,
    marginBottom: 5,
    padding: 30,
    borderWidth: 1,
    borderColor: COLORS.gray,
    justifyContent: "center",
    alignItems: "center",
  },
  category: {
    width: width / 2.5,
    height: height / 15,
    backgroundColor: COLORS.input,
    marginHorizontal: 6,
    marginBottom: 12,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  MainContainer: {
    flex: 1,
    padding: 6,
    alignItems: "center",
    backgroundColor: "white",
  },

  text: {
    fontSize: 25,
    color: "red",
    padding: 3,
    marginBottom: 10,
    textAlign: "center",
  },

  textInputContainer: {
    borderColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontFamily: CUSTOMFONT_REGULAR,
    fontSize: 16,
    color: COLORS.white,
    paddingHorzontal: 10,
    paddingBottom: 10,
    paddingTop: 10,
  },

  // Style for iOS ONLY...
  datePicker: {
    justifyContent: "center",
    alignItems: "flex-start",
    width: 320,
    height: 260,
    display: "flex",
    backgroundColor: "#161616",
    borderRadius: 14,
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

export default EditMyProfileScreen;
