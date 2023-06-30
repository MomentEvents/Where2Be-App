import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import RetryButton from "../RetryButton";
import { CustomError } from "../../constants/error";
import { getUser } from "../../services/UserService";
import SectionProfile from "../Styled/SectionProfile";
import { FlatList } from "react-native";

type EventTogglerProps = {
  selectedUserID: string;
  showProfileSection: boolean;
  eventsToPull: string;
};

const EventToggler = (props: EventTogglerProps) => {
  const { userToken, isAdmin, userIDToUser, updateUserIDToUser } =
    useContext(UserContext);

  const [pulledPastEvents, setPulledPastEvents] = useState<Event[]>(null);
  const [pulledFutureEvents, setPulledFutureEvents] = useState<Event[]>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isFutureToggle, setIsFutureToggle] = useState<boolean>(true);

  const insets = useSafeAreaInsets();
  const [showRetry, setShowRetry] = useState<boolean>(false);

  const [userPulled, setUserPulled] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const canLoadPastData = useRef(true);
  const canLoadFutureData = useRef(true);

  const ListHeader = () => (
    <>
      {props.showProfileSection && (
        <SectionProfile
          userID={props.selectedUserID}
          canEditProfile={isAdmin || userToken.UserID === props.selectedUserID}
          canFollow={userPulled && userToken.UserID !== props.selectedUserID}
        />
      )}
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
            borderColor: "transparent",
            borderBottomColor: isFutureToggle
              ? COLORS.purple
              : COLORS.trueBlack,
            backgroundColor: "transparent",
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
            borderColor: "transparent",
            borderBottomColor: isFutureToggle
              ? COLORS.trueBlack
              : COLORS.purple,
            backgroundColor: "transparent",
            ...styles.toggleButton,
          }}
          onPress={() => setIsFutureToggle(false)}
        >
          <McText h3 color={!isFutureToggle ? COLORS.purple : COLORS.white}>
            Previous
          </McText>
        </TouchableOpacity>
      </View>
    </>
  );

  const loadMoreData = async () => {
    if (
      (isFutureToggle && !canLoadFutureData.current) ||
      (!isFutureToggle && !canLoadPastData.current)
    ) {
      return;
    }

    if (!isLoading) {
      setIsLoading(true);
      let cursor: { eventID: string; date: Date } = null;

      if (isFutureToggle) {
        if (pulledFutureEvents && pulledFutureEvents.length > 0) {
          const date =
            pulledFutureEvents[pulledFutureEvents.length - 1].StartDateTime;
          const eventID =
            pulledFutureEvents[pulledFutureEvents.length - 1].EventID;
          cursor = {
            eventID: eventID,
            date: date,
          };
        }
      } else {
        if (pulledPastEvents && pulledPastEvents.length > 0) {
          const date =
            pulledPastEvents[pulledPastEvents.length - 1].StartDateTime;
          const eventID = pulledPastEvents[pulledPastEvents.length - 1].EventID;
          cursor = {
            eventID: eventID,
            date: date,
          };
        }
      }

      if (cursor) {
        // Only proceed if cursor is not null
        try {
          let additionalEvents = null;
          if (isFutureToggle && canLoadFutureData.current) {
            if (props.eventsToPull === EVENT_TOGGLER.JoinedEvents) {
              additionalEvents = await getUserJoinedFutureEvents(
                userToken.UserAccessToken,
                props.selectedUserID,
                cursor
              );
            } else {
              additionalEvents = await getUserHostedFutureEvents(
                userToken.UserAccessToken,
                props.selectedUserID,
                cursor
              );
            }
            setPulledFutureEvents((currentEvents) => [
              ...currentEvents,
              ...additionalEvents,
            ]);
          } else if (!isFutureToggle && canLoadPastData.current) {
            if (props.eventsToPull === EVENT_TOGGLER.JoinedEvents) {
              additionalEvents = await getUserJoinedPastEvents(
                userToken.UserAccessToken,
                props.selectedUserID,
                cursor
              );
            } else {
              additionalEvents = await getUserHostedPastEvents(
                userToken.UserAccessToken,
                props.selectedUserID,
                cursor
              );
            }
            setPulledPastEvents((currentEvents) => [
              ...currentEvents,
              ...additionalEvents,
            ]);
          }
          console.log(JSON.stringify(additionalEvents));
          if (additionalEvents.length === 0) {
            console.log("CANT GO INTO DATA ANYMORE");
            if (isFutureToggle) {
              canLoadFutureData.current = false;
            } else {
              canLoadPastData.current = false;
            }
          }
        } catch (error) {
          if (error.shouldDisplay) {
            displayError(error);
          }
        }
      }

      setIsLoading(false);
    }
  };

  const pullData = async () => {
    setUserPulled(false);
    setShowRetry(false);
    if (props.showProfileSection) {
      getUser(userToken.UserAccessToken, props.selectedUserID)
        .then((pulledUser: User) => {
          console.log("GOT USER\n\n");
          console.log(JSON.stringify(pulledUser));
          setUserPulled(true);
          updateUserIDToUser({ id: pulledUser.UserID, user: pulledUser });
        })
        .catch((error: CustomError) => {
          if (error.shouldDisplay) {
            displayError(error);
          }
          setShowRetry(true);
        });
    } else {
      setUserPulled(true);
    }

    props.eventsToPull === EVENT_TOGGLER.JoinedEvents
      ? getUserJoinedFutureEvents(
          userToken.UserAccessToken,
          props.selectedUserID
        )
          .then((events: Event[]) => {
            setPulledFutureEvents(events);
            setIsRefreshing(false);
          })
          .catch((error: CustomError) => {
            setIsRefreshing(false);
            setShowRetry(true);
            if (error.shouldDisplay) {
              displayError(error);
            }
          })
      : getUserHostedFutureEvents(
          userToken.UserAccessToken,
          props.selectedUserID
        )
          .then((events: Event[]) => {
            setPulledFutureEvents(events);
            setIsRefreshing(false);
          })
          .catch((error: CustomError) => {
            setIsRefreshing(false);
            setShowRetry(true);
            if (error.shouldDisplay) {
              displayError(error);
            }
          });
    props.eventsToPull === EVENT_TOGGLER.JoinedEvents
      ? getUserJoinedPastEvents(userToken.UserAccessToken, props.selectedUserID)
          .then((events: Event[]) => {
            setPulledPastEvents(events);
            setIsRefreshing(false);
          })
          .catch((error: CustomError) => {
            setIsRefreshing(false);
            setShowRetry(true);
            if (error.shouldDisplay) {
              displayError(error);
            }
          })
      : getUserHostedPastEvents(userToken.UserAccessToken, props.selectedUserID)
          .then((events: Event[]) => {
            setPulledPastEvents(events);
            setIsRefreshing(false);
          })
          .catch((error: CustomError) => {
            setIsRefreshing(false);
            setShowRetry(true);
            if (error.shouldDisplay) {
              displayError(error);
            }
          });
  };

  const onRefresh = async () => {
    console.log("SETTING REFRESH");
    setShowRetry(false);
    setPulledFutureEvents(null);
    setPulledPastEvents(null);
    setIsRefreshing(true);
    pullData();
  };

  const renderEventCard = (event: Event) => {
    return (
      <View
        style={{ alignItems: "center", marginTop: 15 }}
        key={
          event.EventID + props.selectedUserID + props.eventsToPull + " Event"
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
    pullData();
  }, []);

  useEffect(() => {
    if (isRefreshing) {
      setIsRefreshing(!userPulled);
    }
  }, [userPulled]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={isFutureToggle ? pulledFutureEvents : pulledPastEvents}
        ListHeaderComponent={ListHeader}
        renderItem={({ item }) => renderEventCard(item)}
        refreshControl={
          <RefreshControl
            tintColor={COLORS.white}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            style={{ backgroundColor: COLORS.trueBlack }}
          />
        }
        style={{ backgroundColor: COLORS.black }}
        ListEmptyComponent={
          <View
            style={{
              marginTop: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {showRetry && (
              <RetryButton
                setShowRetry={setShowRetry}
                retryCallBack={pullData}
              />
            )}
            {!showRetry &&
              isFutureToggle &&
              (pulledFutureEvents ? (
                <McText h3>No events to display!</McText>
              ) : (
                <ActivityIndicator color={COLORS.white} size={"small"} />
              ))}
            {!showRetry &&
              !isFutureToggle &&
              (pulledPastEvents ? (
                <McText h3>No events to display!</McText>
              ) : (
                <ActivityIndicator color={COLORS.white} size={"small"} />
              ))}
          </View>
        }
        ListFooterComponent={() =>
          isLoading ? (
            <ActivityIndicator
              style={{ marginTop: 10, marginBottom: insets.bottom + 30 }}
              size="small"
              color={COLORS.white}
            />
          ) : (
            <View style={{ height: insets.bottom + 10 }} />
          )
        }
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.6} // triggers when user scrolls to 50% from the bottom of the list
        keyExtractor={(item) =>
          item.EventID + props.selectedUserID + props.eventsToPull + " Event"
        }
      />
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
