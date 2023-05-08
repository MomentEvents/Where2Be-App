import {
  ActivityIndicator,
  Button,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../../../constants/theme";
import SectionHeader from "../../../components/Styled/SectionHeader";
import { EVENT_TOGGLER, User, icons } from "../../../constants";
import { McText } from "../../../components/Styled";
import { Event } from "../../../constants";
import EventCard from "../../../components/EventCard";
import {
  getUserHostedFutureEvents,
  getUserHostedPastEvents,
  getUserJoinedFutureEvents,
  getUserJoinedPastEvents,
} from "../../../services/EventService";
import { UserContext } from "../../../contexts/UserContext";
import { displayError } from "../../../helpers/helpers";
import { EventContext } from "../../../contexts/EventContext";
import EventToggler from "../../../components/EventToggler/EventToggler";
import MobileSafeView from "../../../components/Styled/MobileSafeView";

const MyCalendarScreen = ({ route }) => {
  const { currentUserID, userIDToUser } = useContext(UserContext);

  return (
    <MobileSafeView style={styles.container} isBottomViewable={true}>
      <SectionHeader
        title={"Joined Events"}
        hideBottomUnderline={true}
        style={{ paddingBottom: Platform.OS === "ios" ? 17 : 24 }}
      />
      <View style={{ flex: 1, backgroundColor: COLORS.black }}>
        <EventToggler
          selectedUser={userIDToUser[currentUserID]}
          eventsToPull={EVENT_TOGGLER.JoinedEvents}
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
    backgroundColor: COLORS.black,
  },
  toggleButton: {
    width: SIZES.width * 0.5,
    height: 40,
  },
});
