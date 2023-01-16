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
import { SCREENS, User, icons } from "../../../constants";
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

type ProfileDetailsRouteParams = {
  User: User;
};
const MyProfileScreen = ({ route }) => {
  const { currentUser } = useContext(UserContext);
  const { userToken } = useContext(UserContext);

  const [pulledEvents, setPulledEvents] = useState<Event[]>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFutureToggle, setIsFutureToggle] = useState<boolean>(true);
  const pullData = async () => {
    if (isFutureToggle) {
      // getting future events

      getUserHostedFutureEvents(userToken.UserAccessToken, currentUser.UserID)
        .then((events: Event[]) => {
          setPulledEvents(events);
        })
        .catch((error: Error) => {
          displayError(error);
        });
    } else {
      // getting past events

      getUserHostedPastEvents(userToken.UserAccessToken, currentUser.UserID)
        .then((events: Event[]) => {
          setPulledEvents(events);
        })
        .catch((error: Error) => {
          displayError(error);
        });
    }
  };

  const onRefresh = async () => {
    setPulledEvents(null);
    setIsRefreshing(true);
    pullData();
    setIsRefreshing(false);
  };

  useEffect(() => {
    setPulledEvents(null);
    pullData();
  }, [isFutureToggle]);

  return (
    <SafeAreaView style={styles.container}>
      <SectionHeader
        title={"Hosted Events"}
        rightButtonSVG={<icons.settings />}
        rightButtonOnClick={() => {}}
      />
      <View style={styles.profileContainer}>
        <Image
          style={styles.imageContainer}
          source={{ uri: currentUser.Picture }}
        />
        <View style={styles.infoContainer}>
          <View style={{ flexDirection: "row" }}>
            <McText h3 style={styles.displayNameContainer}>
              {currentUser.Name}
            </McText>
          </View>
          <View style={{ flexDirection: "row" }}>
            <McText body3 style={styles.usernameContainer}>
              @{currentUser.Username}
            </McText>
          </View>
          <TouchableOpacity
            onPress={() => {
              Navigator.navigate(SCREENS.EditMyProfile);
            }}
          >
            <View style={styles.editProfileButtonContainer}>
              <McText h3>Edit Profile</McText>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          backgroundColor: isFutureToggle ? COLORS.black : COLORS.white,
          ...styles.buttonToggleContainer,
        }}
      >
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            borderWidth: isFutureToggle ? 0 : 1,
            borderColor: COLORS.gray,
            backgroundColor: isFutureToggle ? COLORS.white : COLORS.trueBlack,
            ...styles.toggleButton,
          }}
          onPress={() => setIsFutureToggle(true)}
        >
          <McText h3 color={isFutureToggle ? COLORS.trueBlack : COLORS.gray}>
            Upcoming
          </McText>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            borderWidth: !isFutureToggle ? 0 : 1,
            borderColor: COLORS.gray,
            backgroundColor: !isFutureToggle ? COLORS.white : COLORS.trueBlack,
            ...styles.toggleButton,
          }}
          onPress={() => setIsFutureToggle(false)}
        >
          <McText h3 color={!isFutureToggle ? COLORS.trueBlack : COLORS.gray}>
            Previous
          </McText>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {pulledEvents && pulledEvents.length === 0 ? (
          <View
            style={{
              marginTop: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <McText h3>No events to display!</McText>
          </View>
        ) : (
          <></>
        )}
        {pulledEvents ? (
          pulledEvents.map((event: Event) => (
            <View
              style={{ alignItems: "center", marginTop: 15 }}
              key={event.EventID + currentUser.UserID + "Host"}
            >
              <EventCard
                width={SIZES.width - 40}
                height={SIZES.height * 0.3}
                event={event}
                isBigCard={true}
                showRelativeTime={true}
              />
            </View>
          ))
        ) : (
          <ActivityIndicator style={{ marginTop: 20 }} />
        )}
        <View style={{ height: SIZES.tab_bar_height }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  profileContainer: {
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
    backgroundColor: COLORS.trueBlack,
  },
  toggleButton: {
    width: SIZES.width * 0.5,
    height: 40,
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
