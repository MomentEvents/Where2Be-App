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
import { EVENT_TOGGLER, SCREENS, User, icons } from "../../../constants";
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
import MobileSafeView from "../../../components/Styled/MobileSafeView";

type ProfileDetailsRouteParams = {
  User: User;
};
const MyProfileScreen = ({ route }) => {
  const { currentUser } = useContext(UserContext);

  return (
    <MobileSafeView style={styles.container} isTabNavigatorVisible={true}>
      <SectionHeader
        title={"Hosted Events"}
        rightButtonSVG={<icons.settings />}
        rightButtonOnClick={() => {Navigator.navigate(SCREENS.Settings)}}
        hideBottomUnderline={true}
      />
      <SectionProfile user={currentUser} canEditProfile={true} canNukeUser={false}/>
      <View style={{flex: 1}}>
        <EventToggler
          selectedUser={currentUser}
          eventsToPull={EVENT_TOGGLER.HostedEvents}
        />
      </View>
    </MobileSafeView>
  );
};

export default MyProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.trueBlack,
  },
  profileContainer: {
    backgroundColor: COLORS.black,
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
    marginBottom: 20,
    borderColor: COLORS.white,
  },
  infoContainer: {
    paddingTop: 15,
    marginRight: 10,
    flex: 1,
    flexWrap: "wrap",
  },
  displayNameContainer: {},
  usernameContainer: {
    marginTop: 1,
  },
  buttonToggleContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.black,
  },
  toggleButton: {
    width: SIZES.width * 0.5,
    height: 40,
    backgroundColor: COLORS.black
  },
  editProfileButtonContainer: {
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: COLORS.gray1,
  },
});
