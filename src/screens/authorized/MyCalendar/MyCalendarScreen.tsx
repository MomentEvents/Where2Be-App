import { Platform, StyleSheet, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../../../constants/theme";
import SectionHeader from "../../../components/Styled/SectionHeader";
import { EVENT_TOGGLER, User, icons } from "../../../constants";
import { UserContext } from "../../../contexts/UserContext";
import EventToggler from "../../../components/EventToggler/EventToggler";
import MobileSafeView from "../../../components/Styled/MobileSafeView";

const MyCalendarScreen = ({ route }) => {
  const { userToken } = useContext(UserContext);

  return (
    <MobileSafeView style={styles.container} isBottomViewable={true}>
      <SectionHeader title={"Joined Events"} hideBottomUnderline={true} />
      <View style={{ flex: 1, backgroundColor: COLORS.trueBlack }}>
        <EventToggler
          selectedUserID={userToken.UserID}
          eventsToPull={EVENT_TOGGLER.JoinedEvents}
          showProfileSection={false}
          doReloadIfChanged={true}
        />
      </View>
    </MobileSafeView>
  );
};

export default MyCalendarScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.trueBlack,
  },
  profileContainer: {
    height: 120,
    backgroundColor: COLORS.trueBlack,
    flexDirection: "row",
  },
  imageContainer: {
    height: 90,
    width: 90,
    borderRadius: 90,
    borderWidth: 1,
    marginTop: 15,
    marginLeft: 30,
    marginRight: 30,
    borderColor: COLORS.white,
  },
  infoContainer: {
    paddingTop: 20,
  },
  displayNameContainer: {},
  usernameContainer: {
    marginTop: 5,
  },
  buttonToggleContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.trueBlack,
  },
  toggleButton: {
    width: SIZES.width * 0.5,
    height: 40,
  },
});
