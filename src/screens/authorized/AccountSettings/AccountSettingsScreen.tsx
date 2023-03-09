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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { deleteUser } from "../../../services/UserService";
import { displayError } from "../../../helpers/helpers";
import { ScreenContext } from "../../../contexts/ScreenContext";

const AccountSettingsScreen = () => {
  const { userLogout } = useContext(AuthContext);
  const { userToken, currentUser } = useContext(UserContext);
  const navigation = useNavigation<any>();
  const { setLoading } = useContext(ScreenContext);

  const onDeleteAccountClick = () => {
    Alert.alert(
      "Delete account",
      "Are you sure you want to delete your account? You cannot recover your account if you do so!",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
        },
        {
          text: "Yes",
          onPress: () => {
            setLoading(true);
            deleteUser(userToken.UserAccessToken, currentUser.UserID)
              .then(() => {
                userLogout()
                  .then(() => {
                    setLoading(false);
                  })
                  .catch((error: Error) => {
                    displayError(error);
                    setLoading(false);
                  });
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

  const onPressChangePassword = () => {
    navigation.navigate(SCREENS.ChangePassword)
  }

  return (
    <MobileSafeView style={styles.container} isBottomViewable={true}>
      <SectionHeader
        title={"Account"}
        leftButtonSVG={<icons.backarrow />}
        leftButtonOnClick={() => {
          navigation.goBack();
        }}
      />
      <ScrollView>
        <TouchableOpacity onPress={onPressChangePassword}>
          <View style={styles.buttonContainer}>
            <View
              style={{
                width: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name="shield-key-outline"
                size={28}
                color="white"
              />
            </View>
            <McText h3>Change Password</McText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onDeleteAccountClick}>
          <View style={styles.buttonContainer}>
            <View
              style={{
                width: 50,
                justifyContent: "center",
                alignItems: "center",
                marginRight: 1,
              }}
            >
              <MaterialCommunityIcons
                name="trash-can-outline"
                size={28}
                color="white"
              />
            </View>
            <McText h3>Delete Account</McText>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </MobileSafeView>
  );
};

export default AccountSettingsScreen;

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