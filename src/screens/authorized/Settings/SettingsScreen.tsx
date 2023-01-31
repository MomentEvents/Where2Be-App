import {
  Alert,
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext } from "react";
import { COLORS, icons, SIZES } from "../../../constants";
import { McText } from "../../../components/Styled";
import SectionHeader from "../../../components/Styled/SectionHeader";
import * as Navigator from "../../../navigation/Navigator";
import { UserContext } from "../../../contexts/UserContext";
import { AuthContext } from "../../../contexts/AuthContext";

const SettingsScreen = () => {

  const {userLogout} = useContext(AuthContext)

  const onChangePasswordClick = () => {

  }

  const onContactSupportClick = () => {
    const supported = Linking.canOpenURL("https://discord.gg/dQZ64mGgbP");
        
    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      Linking.openURL("https://discord.gg/dQZ64mGgbP");
    } else {
      Alert.alert(`Unable to open link: ${"https://discord.gg/dQZ64mGgbP"}`);
    }
  }

  const onLogoutClick = () => {
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
            userLogout();
          },
        },
      ],
      { cancelable: false }
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <SectionHeader
        title={"Settings"}
        leftButtonSVG={<icons.backarrow />}
        leftButtonOnClick={() => {
          Navigator.goBack();
        }}
      />
      <ScrollView>
        {/* <TouchableOpacity onPress={onChangePasswordClick}>
          <View style={styles.buttonContainer}>
            <icons.password style={styles.iconContainer} width={30} />
            <McText body2>Change Password</McText>
          </View>
        </TouchableOpacity>
        <View
          style={styles.horizontalSeparator}
        /> */}
        <TouchableOpacity onPress={onContactSupportClick}>
          <View style={styles.buttonContainer}>
            <icons.contact style={styles.iconContainer} width={30} />
            <McText body2>Contact Support</McText>
          </View>
        </TouchableOpacity>
        <View
          style={styles.horizontalSeparator}
        />
        <TouchableOpacity onPress={onLogoutClick}>
          <View style={styles.buttonContainer}>
            <icons.logout style={styles.iconContainer} width={30} />
            <McText body2>Logout</McText>
          </View>
        </TouchableOpacity>
        <View
          style={styles.horizontalSeparator}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.black,
    flex: 1,
  },
  buttonContainer: {
    width: SIZES.width,
    flexDirection: "row",
    padding: 15,
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 20,
  },
  horizontalSeparator: {
    borderBottomColor: COLORS.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  }
});
