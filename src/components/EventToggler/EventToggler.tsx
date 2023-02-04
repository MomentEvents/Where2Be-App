import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { User, Event } from "../../constants/types";
import { SIZES, COLORS, EVENT_TOGGLER } from "../../constants";
import { UserContext } from "../../contexts/UserContext";
import { displayError } from "../../helpers/helpers";
import {
  getUserHostedFutureEvents,
  getUserHostedPastEvents,
  getUserJoinedFutureEvents,
  getUserJoinedPastEvents,
} from "../../services/EventService";
import EventCard from "../EventCard";
import { McText } from "../Styled";
import SectionHeader from "../Styled/SectionHeader";

type EventTogglerProps = {
  selectedUser: User;
  eventsToPull: string;
};
const EventToggler = (props: EventTogglerProps) => {
  const { userToken } = useContext(UserContext);

  const [pulledPastEvents, setPulledPastEvents] = useState<Event[]>(null);
  const [pulledFutureEvents, setPulledFutureEvents] = useState<Event[]>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFutureToggle, setIsFutureToggle] = useState<boolean>(true);

  const pullData = async () => {
    if (isFutureToggle) {
      // getting future events
      props.eventsToPull === EVENT_TOGGLER.JoinedEvents
        ? getUserJoinedFutureEvents(
            userToken.UserAccessToken,
            props.selectedUser.UserID
          )
            .then((events: Event[]) => {
              setPulledFutureEvents(events);
              setIsRefreshing(false);
            })
            .catch((error: Error) => {
              displayError(error);
              setIsRefreshing(false);
            })
        : getUserHostedFutureEvents(
            userToken.UserAccessToken,
            props.selectedUser.UserID
          )
            .then((events: Event[]) => {
              setPulledFutureEvents(events);
              setIsRefreshing(false);
            })
            .catch((error: Error) => {
              displayError(error);
              setIsRefreshing(false);
            });
    } else {
      // getting past events

      props.eventsToPull === EVENT_TOGGLER.JoinedEvents
        ? getUserJoinedPastEvents(
            userToken.UserAccessToken,
            props.selectedUser.UserID
          )
            .then((events: Event[]) => {
              setPulledPastEvents(events);
              setIsRefreshing(false);
            })
            .catch((error: Error) => {
              displayError(error);
              setIsRefreshing(false);
            })
        : getUserHostedPastEvents(
            userToken.UserAccessToken,
            props.selectedUser.UserID
          )
            .then((events: Event[]) => {
              setPulledPastEvents(events);
              setIsRefreshing(false);
            })
            .catch((error: Error) => {
              displayError(error);
              setIsRefreshing(false);
            });
    }
  };

  const onRefresh = async () => {
    isFutureToggle ? setPulledFutureEvents(null) : setPulledPastEvents(null);
    setIsRefreshing(true);
    pullData();
  };

  const renderEventCard = (event: Event) => {
    return (
      <View
        style={{ alignItems: "center", marginTop: 15 }}
        key={
          event.EventID +
          props.selectedUser.UserID +
          props.eventsToPull +
          " Event"
        }
      >
        <EventCard
          width={SIZES.width - 40}
          height={SIZES.height * 0.3}
          event={event}
          isBigCard={true}
          showRelativeTime={true}
        />
      </View>
    );
  };

  useEffect(() => {
    if (isFutureToggle && !pulledFutureEvents) {
      pullData();
    } else if (!isFutureToggle && !pulledPastEvents) {
      pullData();
    }
  }, [isFutureToggle]);

  return (
    <View style={{flex: 1}}>
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
            borderWidth: isFutureToggle ? 1 : 0,
            borderColor: 'transparent',
            borderBottomColor: isFutureToggle ? COLORS.purple : COLORS.trueBlack,
            backgroundColor: 'transparent',
            ...styles.toggleButton,
          }}
          onPress={() => setIsFutureToggle(true)}
        >
          <McText h3 color={isFutureToggle ? COLORS.purple : COLORS.white}>
            Upcoming
          </McText>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            borderWidth: !isFutureToggle ? 1 : 0,
            borderColor: 'transparent',
            borderBottomColor: isFutureToggle ? COLORS.trueBlack : COLORS.purple,
            backgroundColor: 'transparent',
            ...styles.toggleButton,
          }}
          onPress={() => setIsFutureToggle(false)}
        >
          <McText h3 color={!isFutureToggle ? COLORS.purple : COLORS.white}>
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
        {isFutureToggle ? (
          pulledFutureEvents ? (
            pulledFutureEvents.length !== 0 ? (
              pulledFutureEvents.map((event: Event) => renderEventCard(event))
            ) : (
              <View
                style={{
                  marginTop: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <McText h3>No events to display!</McText>
              </View>
            )
          ) : (
            !isRefreshing && <ActivityIndicator style={{ marginTop: 20 }} />
          )
        ) : pulledPastEvents ? (
          pulledPastEvents.length !== 0 ? (
            pulledPastEvents.map((event: Event) => renderEventCard(event))
          ) : (
            <View
              style={{
                marginTop: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <McText h3>No events to display!</McText>
            </View>
          )
        ) : (
          !isRefreshing && <ActivityIndicator style={{ marginTop: 20 }} />
        )}
        <View style={{ height: SIZES.tab_bar_height + 10 }}/>
      </ScrollView>
    </View>
  );
};

export default EventToggler;

const styles = StyleSheet.create({
  
  
  buttonToggleContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.trueBlack,
  },
  toggleButton: {
    width: "50%",
    height: 40,
  },
});
