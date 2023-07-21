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
import { LinearGradient } from "expo-linear-gradient";

import { FONTS, SIZES, COLORS, icons, User } from "../../../constants";
import { McText } from "../../../components/Styled";
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
  showBugReportPopup,
} from "../../../helpers/helpers";
import { updateUser } from "../../../services/UserService";
import { UserContext } from "../../../contexts/UserContext";
import { CUSTOMFONT_REGULAR } from "../../../constants/theme";
import SectionHeader from "../../../components/Styled/SectionHeader";
import MobileSafeView from "../../../components/Styled/MobileSafeView";
import { ScreenContext } from "../../../contexts/ScreenContext";
import { CONSTRAINTS } from "../../../constants/constraints";
import { McTextInput } from "../../../components/Styled/styled";
import { Feather } from "@expo/vector-icons";
import { CustomError } from "../../../constants/error";
import { AlertContext } from "../../../contexts/AlertContext";

var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height; //full height

type EditProfileParams = {
  user: User;
  isSelf?: boolean;
};
const EditProfileScreen = ({ route }) => {
  const { user, isSelf }: EditProfileParams = route.params;

  const navigation = useNavigation<any>();
  const { showErrorAlert } = useContext(AlertContext);

  const { userIDToUser, updateUserIDToUser, userToken } =
    useContext(UserContext);
  const { setLoading } = useContext(ScreenContext);
  const [image, setImage] = useState(user.Picture);
  const [base64Image, setBase64Image] = useState<string>(null);

  const [displayName, setDisplayName] = useState(user.DisplayName);
  const [username, setUsername] = useState(user.Username);

  const handleSubmit = () => {
    if (displayName === "") {
      Alert.alert("Input Error", "Please enter a valid display name");
      return;
    }

    if (username === "") {
      Alert.alert("Input Error", "Please enter an alphanumeric username");
      return;
    }

    // Update information

    const formattedUsername = username.trim().toLowerCase();
    const formattedDisplayName = displayName.trim();

    const createdUser: User = {
      UserID: user.UserID,
      DisplayName: formattedDisplayName,
      Username: formattedUsername,
      Picture: image,
      VerifiedOrganization: user.VerifiedOrganization,
      UserFollow: user.UserFollow,
      NumFollowers: user.NumFollowers,
      NumFollowing: user.NumFollowing,
      NumEvents: user.NumEvents,
    };
    const createdUserBase64 = { ...createdUser };
    createdUserBase64.Picture = base64Image;
    setLoading(true);
    updateUser(userToken.UserAccessToken, createdUserBase64)
      .then(() => {
        setLoading(false);
        updateUserIDToUser({
          id: createdUser.UserID,
          user: { ...userIDToUser[createdUser.UserID], ...createdUser },
        });
        navigation.goBack();
      })
      .catch((error: CustomError) => {
        if (error.showBugReportDialog) {
          showBugReportPopup(error);
        } else {
          showErrorAlert(error);
        }
        setLoading(false);
      });
  };

  return (
    <MobileSafeView style={styles.container}>
      <SectionHeader
        title={"Edit Profile"}
        leftButtonSVG={<Feather name="arrow-left" size={28} color="white" />}
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
          <View style={styles.titleContainer}>
            <ImagePicker
              height={width * 0.3}
              width={width * 0.3}
              setImageURI={setImage}
              setImageBase64={setBase64Image}
              originalImageURI={image}
              style={{ borderRadius: 90 }}
            />
          </View>
          <View>
            <View style={styles.titleContainer}>
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
            <McTextInput
              value={displayName}
              placeholder={"Enter your display name"}
              placeholderTextColor={COLORS.gray}
              style={styles.textInputContainer}
              maxLength={CONSTRAINTS.User.DisplayName.Max}
              onChangeText={(newText) => setDisplayName(newText)}
            />
          </View>
          <View>
            <View style={styles.titleContainer}>
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
            <McTextInput
              value={username}
              placeholder={"Enter your username"}
              placeholderTextColor={COLORS.gray}
              style={styles.textInputContainer}
              onChangeText={(newText) => setUsername(newText)}
              maxLength={CONSTRAINTS.User.Username.Max}
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
    marginTop: 8,
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

export default EditProfileScreen;
