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
import React, { useContext, useRef } from "react";
import { COLORS, icons, SCREENS, SIZES } from "../../../constants";
import { McText } from "../../../components/Styled";
import SectionHeader from "../../../components/Styled/SectionHeader";
import { UserContext } from "../../../contexts/UserContext";
import { AuthContext } from "../../../contexts/AuthContext";
import MobileSafeView from "../../../components/Styled/MobileSafeView";
import { useNavigation } from "@react-navigation/native";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { displayError, showBugReportPopup } from "../../../helpers/helpers";
import { ScreenContext } from "../../../contexts/ScreenContext";
import * as Updates from "expo-updates";
import { CustomError } from "../../../constants/error";
import { clearAllCachedData } from "../../../services/AuthService";
import { AlertContext } from "../../../contexts/AlertContext";

const SettingsScreen = () => {
  const { userLogout } = useContext(AuthContext);
  const {userToken} = useContext(UserContext)
  const { setLoading } = useContext(ScreenContext);
  const { showAlert, showErrorAlert, showTextAlert } = useContext(AlertContext);
  const navigation = useNavigation<any>();
  const pressedCleanCacheRef = useRef(false);

  const onChangePasswordClick = () => {};

  const onWebsiteClick = () => {
    const supported = Linking.canOpenURL("https://where2be.app");
    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      Linking.openURL("https://where2be.app");
    } else {
      Alert.alert(`Unable to open link: ${"https://where2be.app"}`);
    }
  };

  const onContactSupportClick = () => {
    const supported = Linking.canOpenURL("https://where2be.app/discord");

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      Linking.openURL("https://where2be.app/discord");
    } else {
      Alert.alert(`Unable to open link: ${"https://where2be.app/discord"}`);
    }
  };

  const onCacheClean = () => {
    if(pressedCleanCacheRef.current){
      return
    }
    pressedCleanCacheRef.current = true
    clearAllCachedData()
      .then(() => {
        showTextAlert(
            "Successfully deleted cached data",
          5
        );
      })
      .catch((error: Error) => {
        showErrorAlert(error);
      }).finally(() => {
        pressedCleanCacheRef.current = false
      });
  };

  const onCheckForUpdatesClick = async () => {
    setLoading(true);
    console.log("Checking updates");
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        await Updates.fetchUpdateAsync();
        await Updates.reloadAsync();
      } else {
        Alert.alert("No update is available");
      }
    } catch (error) {
      displayError(error);
    } finally {
      setLoading(false);
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
            setLoading(true);
            userLogout()
              .then(() => {
                setLoading(false);
              })
              .catch((error: CustomError) => {
                if (error.showBugReportDialog) {
                  showBugReportPopup(error);
                } else {
                  displayError(error);
                }
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
        leftButtonSVG={<Feather name="arrow-left" size={28} color="white" />}
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
        <TouchableOpacity onPress={onCheckForUpdatesClick}>
          <View style={styles.buttonContainer}>
            <View
              style={{
                width: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="update"
                style={styles.iconContainer}
                size={28}
                color="white"
              />
            </View>
            <McText h3>Check For Updates</McText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onCacheClean}>
          <View style={styles.buttonContainer}>
            <View
              style={{
                width: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialIcons
                name="cleaning-services"
                style={styles.iconContainer}
                size={28}
                color="white"
              />
            </View>
            <McText h3>Clean Cache</McText>
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
