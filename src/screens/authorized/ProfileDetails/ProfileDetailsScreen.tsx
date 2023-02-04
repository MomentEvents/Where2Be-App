import {
  ActivityIndicator,
  Button,
  Image,
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
import * as Navigator from "../../../navigation/Navigator";
import { McText } from "../../../components/Styled";
import { Event } from "../../../constants";
import EventCard from "../../../components/EventCard";
import {
  getUserHostedFutureEvents,
  getUserHostedPastEvents,
} from "../../../services/EventService";
import { UserContext } from "../../../contexts/UserContext";
import { displayError } from "../../../helpers/helpers";
import SectionProfile from "../../../components/Styled/SectionProfile";
import EventToggler from "../../../components/EventToggler/EventToggler";

type ProfileDetailsRouteParams = {
  User: User;
};
const ProfileDetailsScreen = ({ route }) => {
  const { User }: ProfileDetailsRouteParams = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <SectionHeader
        title={"View Profile"}
        leftButtonSVG={<icons.backarrow />}
        leftButtonOnClick={() => {
          Navigator.goBack();
        }}
      />
      <SectionProfile user={User} canEditProfile={false}/>
      <EventToggler selectedUser={User} eventsToPull={EVENT_TOGGLER.HostedEvents}/>
    </SafeAreaView>
  );
};

export default ProfileDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  displayNameContainer: { flex: 1, flexWrap: "wrap" },
  usernameContainer: {
    marginTop: 5,
    flex: 1,
    flexWrap: "wrap",
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
