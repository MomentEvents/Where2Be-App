/**
 * React Native Event Booking App UI - Event Detail Screnn
 * -> The screen can be seperated 4 sections and 1 fixed bottom bar
 * 
 */

import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useContext,
} from "react";
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
  Alert,
  Linking,
} from "react-native";
//import LinearGradient from 'react-native-linear-gradient';
import { VERTICAL } from "react-native/Libraries/Components/ScrollView/ScrollViewContext";
import styled from "styled-components/native";
import { McIcon, McText } from "../../components";
import { LinearGradient } from "expo-linear-gradient";
import { dummyData, FONTS, SIZES, COLORS, icons } from "../../constants";
import moment from "moment";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { createNavigatorFactory } from "@react-navigation/native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { AuthContext } from "../../Contexts/AuthContext";

import { memo } from "react";

import { Dimensions } from "react-native";
import ImageViewer from "react-native-image-zoom-viewer";

var width = Dimensions.get("window").width; //full width
var height = Dimensions.get("window").height; //full height

// const onPinchEvent = Animated.event([{
//   nativeEvent: {scale}
// }], {useNativeDriver: true})

const Settings = ({ navigation, route }) => {
  const [img, setImg] = useState(null);

  const [loading, setLoading] = useState(true);

  const { logoutTok, UserId, Data, setupData, FinImport, MData } =
    useContext(AuthContext);
  // console.log(joindedEvent)
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tempNav}>
        <SectionHeader>
          <TouchableWithoutFeedback
            onPress={() => {
              navigation.goBack();
            }}
            style={{
              marginLeft: -width / 32,
            }}
          >
            <McIcon
              source={icons.back_arrow}
              size={28}
              style={{
                tintColor: COLORS.white,
                marginRight: 10,
              }}
            />
          </TouchableWithoutFeedback>
          <View>
            <McText h1>
              <Text>Settings</Text>
            </McText>
          </View>
        </SectionHeader>
      </View>
      <View
        style={{
          paddingTop: 12,
        }}
      >
        <TouchableHighlight style={styles.setting} onPress={() => {}}>
          <View style={styles.category}>
            <icons.email height={25} width={25} />
            <View marginLeft={10}>
              <McText body2>Change Email</McText>
            </View>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.setting}
          onPress={() => {
            console.log("hello");
          }}
        >
          <View style={styles.category}>
            <icons.password height={25} width={25} />
            <View marginLeft={10}>
              <McText body2>Change Password</McText>
            </View>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.setting}
          onPress={() => {
            console.log("hello");
          }}
        >
          <View style={styles.category}>
            <icons.notifications height={25} width={25} />
            <View marginLeft={10}>
              <McText body2>Modify Push Notifications</McText>
            </View>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.setting}
          onPress={() => {
              // Checking if the link is supported for links with custom URL scheme.
              const supported = Linking.canOpenURL("https://discord.gg/dQZ64mGgbP");
        
              if (supported) {
                // Opening the link with some app, if the URL scheme is "http" the web link should be opened
                // by some browser in the mobile
                Linking.openURL("https://discord.gg/dQZ64mGgbP");
              } else {
                Alert.alert(`Unable to open link: ${"https://discord.gg/dQZ64mGgbP"}`);
              }
          }}
        >
          <View style={styles.category}>
            <icons.contact height={25} width={25} />
            <View marginLeft={10}>
              <McText body2>Contact Us</McText>
            </View>
          </View>
        </TouchableHighlight>
        <TouchableHighlight
          style={styles.setting}
          onPress={() => {
            Alert.alert(
              "Log out",
              "Are you sure you want to log out?",
              [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                },
                {
                  text: "Yes",
                  onPress: () => {
                    console.log("Yes Pressed");
                    logoutTok();
                  },
                },
              ],
              { cancelable: false }
            );
          }}
        >
          <View style={styles.category}>
            <icons.logout height={25} width={25} />
            <View marginLeft={10}>
              <McText body2>Log Out</McText>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    </SafeAreaView>
  );
};

const SectionTitle = styled.View`
  margin: 16px ${SIZES.padding};
  margintop: 20px;
`;

const DateBox = styled.View`
  width: 50;
  height: 50;
  border-radius: 15px;
  border-color: #000000;
  border-width: 1px;
  background-color: ${COLORS.white};
  align-items: center;
`;
//background-color: rgba(100,100,100,0.65);
const GrayBox = styled.View`
  background-color: rgba(100, 100, 100, 0.3);
  borderbottomrightradius: 20px;
  borderbottomleftradius: 20px;
`;

const SectionHeader = styled.View`
  background-color: transparent;
  padding: 16px ${SIZES.padding};
  justify-content: space-between;
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
const SectionSearch = styled.View`
  margin: 8px ${SIZES.padding};
  height: 50px;
  marginbottom: 12px;
  background-color: ${COLORS.input};
  border-radius: 15px;
  justify-content: center;
`;

const SearchView = styled.View`
  flex-direction: row;

  align-items: center;
  margin-left: 9px;
  margin-right: 15px;
`;
//background-color: ${COLORS.white};
const Srch = styled.View`
  margin-left: 0px;
  width: 100px;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#1E2029',
    backgroundColor: COLORS.black,
  },
  category: {
    marginLeft: (3 * width) / 5,
    flexDirection: "row",
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: width / 20,
  },
  tempNav: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#282828",
    alignItems: "flex-start",
    // borderRadius: 20
  },
  setting: {
    width: width * 2,
    backgroundColor: COLORS.black,
    borderWidth: 1,
    marginLeft: -width / 2,
    borderColor: COLORS.gray,
    alignItems: "flex-start",
    justifyContent: "center",
  },
});
export default Settings;
