//import React from 'react';
import React, { useState, useEffect } from "react";
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
import InterestSelector from "../../components/InterestSelect";

import {
  dummyData,
  FONTS,
  SIZES,
  COLORS,
  icons,
  images,
} from "../../constants";
import { McText, McIcon, McAvatar } from "../../components";
import { TouchableOpacity } from "react-native-gesture-handler";
import "react-native-gesture-handler";
import { useRoute } from "@react-navigation/native";
import { Dimensions } from "react-native";
import DatePicker from "react-native-modern-datepicker";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePickerPopup from "../../components/DateTimePickerPopup/DateTimePickerPopup";
import ProgressLoader from "rn-progress-loader";
import ImagePicker from "../../components/ImagePicker";
import defaultimage from "../../assets/images/defaultprofilepicture.png"

var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height; //full height

const EditProfile = ({ navigation, route }) => {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  const handleSubmit = () => {};
  return (
    <SafeAreaView style={styles.container}>
      <ProgressLoader
        visible={loading}
        isModal={true}
        isHUD={true}
        hudColor={"#000000"}
        color={"#FFFFFF"}
      ></ProgressLoader>
      <View style={styles.tempNav}>
        <SectionHeader>
          <TouchableOpacity
            style={{
              width: 40,
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              marginLeft: -12,
              marginTop: 4,
            }}
            onPress={() => {
              navigation.pop();
            }}
          >
            <McIcon
              source={icons.close}
              style={{
                tintColor: COLORS.white,
                marginBottom: 4,
                marginLeft: -8,
              }}
              size={32}
            />
          </TouchableOpacity>
          <McText h1>Edit Profile</McText>
          <View
            style={{
              position: "absolute",
              right: 0,
            }}
          >
            <TouchableOpacity
              style={{
                marginRight: 15,
                marginTop: 5,
              }}
              onPress={() => {
                handleSubmit();
              }}
            >
              <McText
                h3
                style={{
                  color: COLORS.purple,
                }}
              >
                Save
              </McText>
            </TouchableOpacity>
          </View>
        </SectionHeader>
      </View>

      <KeyboardAwareScrollView>
        <View
          style={{
            marginTop: 20,
            marginBottom: 20,
          }}
        >
          <ImagePicker
            height={width * 0.3}
            width={width * 0.3}
            setImg={setImage}
            image={Image.resolveAssetSource(defaultimage).uri}
          ></ImagePicker>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const SectionHeader = styled.View`
  background-color: transparent;
  padding: 16px ${SIZES.padding};
  align-items: center;
  flex-direction: row;
`;

const SectionImage = styled.View`
  background-color: transparent;
  align-items: center;
  flex-direction: row;
`;

//temp fix for padding
const SectionFooter = styled.View`
  background-color: transparent;
  padding: 60px;
  justify-content: space-between;
`;
//justify-content: space-between;

const SectionInputs = styled.View`
  margin-left: 50;
  margin-vertical: 15;
`;
const SectionTextIn = styled.View`
  background-color: ${COLORS.black};
  width: ${SIZES.width * 0.76};
  border-radius: 10;
  justify-content: center;
  border: 2px;
  border-color: ${COLORS.gray};
  align-items: flex-start;
`;
const SectionTimings = styled.View`
  background-color: ${COLORS.black};
  width: ${SIZES.width * 0.33};
  border-radius: 10;
  justify-content: center;
  border: 2px;
  border-color: ${COLORS.gray};
`;

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

export default EditProfile;
