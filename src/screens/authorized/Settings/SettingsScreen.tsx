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
import { UserContext } from "../../../contexts/UserContext";
import { AuthContext } from "../../../contexts/AuthContext";
import MobileSafeView from "../../../components/Styled/MobileSafeView";
import { useNavigation } from "@react-navigation/native";

const SettingsScreen = () => {

  const {userLogout} = useContext(AuthContext)
  const navigation = useNavigation<any>();

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
    <MobileSafeView style={styles.container} isBottomViewable={true}>
      <SectionHeader
        title={"Settings"}
        leftButtonSVG={<icons.backarrow />}
        leftButtonOnClick={() => {
          navigation.goBack();
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
            <McText h3>Contact Support</McText>
          </View>
        </TouchableOpacity>
        <View
          style={styles.horizontalSeparator}
        />
        <TouchableOpacity onPress={onLogoutClick}>
          <View style={styles.buttonContainer}>
            <icons.logout style={styles.iconContainer} width={30} />
            <McText h3>Logout</McText>
          </View>
        </TouchableOpacity>
        <View
          style={styles.horizontalSeparator}
        />
      </ScrollView>
    </MobileSafeView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.trueBlack,
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
  }
});
