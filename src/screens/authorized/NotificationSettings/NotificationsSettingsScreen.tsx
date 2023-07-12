import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, Switch, View } from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { McText } from "../../../components/Styled";
import MobileSafeView from "../../../components/Styled/MobileSafeView";
import SectionHeader from "../../../components/Styled/SectionHeader";
import { icons, COLORS, SIZES } from "../../../constants";
import { useNavigation } from "@react-navigation/native";
import { getNotificationPreferences, setNotificationPreferences } from "../../../services/NotificationService";
import { UserContext } from "../../../contexts/UserContext";
import { NotificationPreferences } from "../../../constants/types";
import { CustomError } from "../../../constants/error";
import { displayError } from "../../../helpers/helpers";
import { ScreenContext } from "../../../contexts/ScreenContext";

const NotificationsSettingsScreen = () => {
  const { userToken } = useContext(UserContext);
  const {setLoading} = useContext(ScreenContext)
  const navigation = useNavigation<any>();
  const [followedUsersEnabled, setFollowedUsersEnabled] = useState(false);

  const onSubmit = () => {
    setLoading(true)
    const preferences: NotificationPreferences = {
        DoNotifyFollowing: followedUsersEnabled
    }
    setNotificationPreferences(userToken.UserAccessToken, userToken.UserID, preferences).then(() => {
        navigation.pop()
    }).catch((error: CustomError) => {
        displayError(error)
    }).finally(() => {
        setLoading(false)
    })
  }

  useEffect(() => {
    setLoading(true)
    getNotificationPreferences(
      userToken.UserAccessToken,
      userToken.UserID
    ).then((preferences: NotificationPreferences) => {
        setFollowedUsersEnabled(preferences.DoNotifyFollowing)
    }).catch((error: CustomError) => {
        displayError(error)
        navigation.pop()
    }).finally(() => {
        setLoading(false)
    });
  }, []);

  return (
    <MobileSafeView style={styles.container} isBottomViewable={true}>
      <SectionHeader
        title={"Notifications"}
        leftButtonSVG={<Feather name="arrow-left" size={28} color="white" />}
        leftButtonOnClick={() => {
          navigation.goBack();
        }}
        rightButtonOnClick={() => {
            onSubmit();
          }}
          rightButtonSVG={
            <McText h3 color={COLORS.purple}>
              Save
            </McText>
          }
      />
      <ScrollView>
        <View style={styles.buttonContainer}>
          <McText h3>Followed Users</McText>
          <View style={styles.switchContainer}>
            <Switch
              trackColor={{ false: COLORS.gray2, true: COLORS.gray2 }}
              thumbColor={followedUsersEnabled ? COLORS.white : COLORS.gray}
              onValueChange={() =>
                setFollowedUsersEnabled((prevState) => !prevState)
              }
              value={followedUsersEnabled}
            />
          </View>
        </View>
      </ScrollView>
    </MobileSafeView>
  );
};

export default NotificationsSettingsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.trueBlack,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingVertical: 10,
    alignItems: "center",
  },
  switchContainer: {
    marginLeft: 10,
  },
});
