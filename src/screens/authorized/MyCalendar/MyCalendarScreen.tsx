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
import { User, icons } from "../../../constants";
import * as Navigator from "../../../navigation/Navigator";
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

const MyCalendarScreen = ({ route }) => {
  const { userToken, currentUser } = useContext(UserContext);
  const { eventIDToDidJoin } = useContext(EventContext);

  const [pulledEvents, setPulledEvents] = useState<Event[]>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFutureToggle, setIsFutureToggle] = useState<boolean>(true);

  var didRenderEventID = new Set<string>();

  const pullData = async () => {
    didRenderEventID.clear();
    if (isFutureToggle) {
      // getting future events

      getUserJoinedFutureEvents(userToken.UserAccessToken, currentUser.UserID)
        .then((events: Event[]) => {
          setPulledEvents(events);
        })
        .catch((error: Error) => {
          displayError(error);
        });
    } else {
      // getting past events

      getUserJoinedPastEvents(userToken.UserAccessToken, currentUser.UserID)
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
    await pullData();
    setIsRefreshing(false);
  };

  const renderEventCard = (event: Event) => {
    return (
      <View
        style={{ alignItems: "center", marginTop: 15 }}
        key={event.EventID + currentUser.UserID + "Joined Event"}
      >
        {/* {eventIDToDidJoin[event.EventID] !== undefined &&
        !eventIDToDidJoin[event.EventID] ? (
          <></>
        ) : ( */}
        <EventCard
          width={SIZES.width - 40}
          height={SIZES.height * 0.3}
          event={event}
          isBigCard={true}
          showRelativeTime={true}
        />
        {/* )} */}
      </View>
    );
  };

  useEffect(() => {
    setPulledEvents(null);
    pullData();
  }, [isFutureToggle]);

  return (
    <SafeAreaView style={styles.container}>
      <SectionHeader title={"Joined Events"} />
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
            borderColor: COLORS.purple,
            backgroundColor: isFutureToggle ? COLORS.purple : COLORS.trueBlack,
            ...styles.toggleButton,
          }}
          onPress={() => setIsFutureToggle(true)}
        >
          <McText h3 color={isFutureToggle ? COLORS.white : COLORS.purple}>
            Upcoming
          </McText>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            borderWidth: !isFutureToggle ? 0 : 1,
            borderColor: COLORS.purple,
            backgroundColor: !isFutureToggle ? COLORS.purple : COLORS.trueBlack,
            ...styles.toggleButton,
          }}
          onPress={() => setIsFutureToggle(false)}
        >
          <McText h3 color={!isFutureToggle ? COLORS.white : COLORS.purple}>
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
        {pulledEvents ? (
          pulledEvents.map((event: Event) => renderEventCard(event))
        ) : (
          <ActivityIndicator style={{ marginTop: 20 }} />
        )}
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
        <View style={{ height: SIZES.tab_bar_height }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MyCalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
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
