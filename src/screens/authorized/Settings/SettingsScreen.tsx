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
import { COLORS, icons, SCREENS, SIZES } from "../../../constants";
import { McText } from "../../../components/Styled";
import SectionHeader from "../../../components/Styled/SectionHeader";
import { UserContext } from "../../../contexts/UserContext";
import { AuthContext } from "../../../contexts/AuthContext";
import MobileSafeView from "../../../components/Styled/MobileSafeView";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { displayError } from "../../../helpers/helpers";
import { ScreenContext } from "../../../contexts/ScreenContext";

const SettingsScreen = () => {
  const { userLogout } = useContext(AuthContext);
  const { setLoading } = useContext(ScreenContext);
  const navigation = useNavigation<any>();

  const onChangePasswordClick = () => {};

  const onWebsiteClick = () => {
    const supported = Linking.canOpenURL("https://momentevents.app");
    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      Linking.openURL("https://momentevents.app");
    } else {
      Alert.alert(`Unable to open link: ${"https://momentevents.app"}`);
    }
  };

  const onContactSupportClick = () => {
    const supported = Linking.canOpenURL("https://momentevents.app/discord");

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      Linking.openURL("https://momentevents.app/discord");
    } else {
      Alert.alert(`Unable to open link: ${"https://momentevents.app/discord"}`);
    }
  };

  const onAccountSettingsClick = () => {
    navigation.push(SCREENS.AccountSettings);
  };

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
            userLogout()
              .then(() => {
                setLoading(false);
              })
              .catch((error: Error) => {
                displayError(error);
                setLoading(false);
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

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
        <TouchableOpacity onPress={onAccountSettingsClick}>
          <View style={styles.buttonContainer}>
            <View
              style={{
                width: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="account-circle-outline"
                style={styles.iconContainer}
                size={28}
                color="white"
              />
            </View>
            <McText h3>Account</McText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onWebsiteClick}>
          <View style={styles.buttonContainer}>
            <View
              style={{
                width: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="globe-outline"
                style={styles.iconContainer}
                size={28}
                color="white"
              />
            </View>
            <McText h3>Visit Website</McText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onContactSupportClick}>
          <View style={styles.buttonContainer}>
            <View
              style={{
                width: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="discord"
                style={styles.iconContainer}
                size={28}
                color="white"
              />
            </View>
            <McText h3>Join Discord</McText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onLogoutClick}>
          <View style={styles.buttonContainer}>
            <View
              style={{
                width: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="logout"
                style={styles.iconContainer}
                size={28}
                color="white"
              />
            </View>
            <McText h3>Logout</McText>
          </View>
        </TouchableOpacity>
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
    marginLeft: 15,
    paddingVertical: 10,
    alignItems: "center",
  },
  iconContainer: {
    marginRight: 10,
  },
  horizontalSeparator: {},
});
