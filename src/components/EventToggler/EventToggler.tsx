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
import { showBugReportPopup } from "../../helpers/helpers";
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
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { EventContext } from "../../contexts/EventContext";
import { AlertContext } from "../../contexts/AlertContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { selectUserByID } from "../../redux/users/userSelectors";
import { updateUserMap } from "../../redux/users/userSlice";

type EventTogglerProps = {
  selectedUserID: string;
  showProfileSection: boolean;
  eventsToPull: string;
  doReloadIfChanged: boolean;
};

const EventToggler = (props: EventTogglerProps) => {
  const { showErrorAlert } = useContext(AlertContext);
  const { userToken, isAdmin } = useContext(UserContext);

  const dispatch = useDispatch<AppDispatch>();
  const { didHostedEventsChangeRef, didJoinedEventsChangeRef } =
    useContext(EventContext);

  const [pulledPastEvents, setPulledPastEvents] = useState<Event[]>(null);
  const [pulledFutureEvents, setPulledFutureEvents] = useState<Event[]>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isRefreshingRef = useRef(false);

  const [isFutureToggle, setIsFutureToggle] = useState<boolean>(true);

  const insets = useSafeAreaInsets();
  const [showRetry, setShowRetry] = useState<boolean>(false);

  const [userPulled, setUserPulled] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const isLoadingRef = useRef(false);

  const canLoadPastData = useRef(true);
  const canLoadFutureData = useRef(true);

  const isFocused = useIsFocused();

  const cardWidth = SIZES.width - 40;
  const cardHeight = SIZES.height * 0.3;

  // Run this whenever the list is outdated and the user focuses on the app again.

  useEffect(() => {
    if (isFocused) {
      if (!props.doReloadIfChanged) {
        return;
      }
      let doPull = false;
      if (
        props.eventsToPull === EVENT_TOGGLER.HostedEvents &&
        didHostedEventsChangeRef.current
      ) {
        didHostedEventsChangeRef.current = false;
        doPull = true;
      } else if (
        props.eventsToPull === EVENT_TOGGLER.JoinedEvents &&
        didJoinedEventsChangeRef.current
      ) {
        didJoinedEventsChangeRef.current = false;
        doPull = true;
      }
      if (doPull) {
        setShowRetry(false);
        canLoadFutureData.current = true;
        canLoadPastData.current = true;
        pullData(false);
      }
    }
  }, [isFocused]);

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

    if (!isLoadingRef.current) {
      setIsLoading(true);
      isLoadingRef.current = true;
      let cursor: { eventID: string; date: string } = null;

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
            if (!isRefreshingRef.current) {
              setPulledFutureEvents((currentEvents) => [
                ...currentEvents,
                ...additionalEvents,
              ]);
            }
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
            if (!isRefreshingRef.current) {
              setPulledPastEvents((currentEvents) => [
                ...currentEvents,
                ...additionalEvents,
              ]);
            }
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
            console.warn(error);
          }
        }
      }

      setIsLoading(false);
      isLoadingRef.current = false;
    }
  };

  const pullData = async (pullUser: boolean) => {
    setUserPulled(false);
    setShowRetry(false);
    let errorThrown = false;

    if (props.showProfileSection) {
      getUser(userToken.UserAccessToken, props.selectedUserID)
        .then((pulledUser: User) => {
          console.log("GOT USER\n\n");
          console.log(JSON.stringify(pulledUser));
          setUserPulled(true);
          dispatch(
            updateUserMap({ id: props.selectedUserID, changes: pulledUser })
          );
        })
        .catch((error: CustomError) => {
          if (!errorThrown) {
            errorThrown = true;
            if (error.showBugReportDialog) {
              showBugReportPopup(error);
            }
            showErrorAlert(error);
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
            isRefreshingRef.current = false;
          })
          .catch((error: CustomError) => {
            setIsRefreshing(false);
            isRefreshingRef.current = false;
            setShowRetry(true);
            if (!errorThrown) {
              errorThrown = true;
              if (error.showBugReportDialog) {
                showBugReportPopup(error);
              }
              showErrorAlert(error);
            }
          })
      : getUserHostedFutureEvents(
          userToken.UserAccessToken,
          props.selectedUserID
        )
          .then((events: Event[]) => {
            setPulledFutureEvents(events);
            setIsRefreshing(false);
            isRefreshingRef.current = false;
          })
          .catch((error: CustomError) => {
            setIsRefreshing(false);
            isRefreshingRef.current = false;
            setShowRetry(true);
            if (!errorThrown) {
              errorThrown = true;
              if (error.showBugReportDialog) {
                showBugReportPopup(error);
              }
              showErrorAlert(error);
            }
          });
    props.eventsToPull === EVENT_TOGGLER.JoinedEvents
      ? getUserJoinedPastEvents(userToken.UserAccessToken, props.selectedUserID)
          .then((events: Event[]) => {
            setPulledPastEvents(events);
            setIsRefreshing(false);
            isRefreshingRef.current = false;
          })
          .catch((error: CustomError) => {
            setIsRefreshing(false);
            isRefreshingRef.current = false;
            setShowRetry(true);
            if (!errorThrown) {
              errorThrown = true;
              if (error.showBugReportDialog) {
                showBugReportPopup(error);
              }
              showErrorAlert(error);
            }
          })
      : getUserHostedPastEvents(userToken.UserAccessToken, props.selectedUserID)
          .then((events: Event[]) => {
            setPulledPastEvents(events);
            setIsRefreshing(false);
            isRefreshingRef.current = false;
          })
          .catch((error: CustomError) => {
            setIsRefreshing(false);
            isRefreshingRef.current = false;
            setShowRetry(true);
            if (!errorThrown) {
              errorThrown = true;
              if (error.showBugReportDialog) {
                showBugReportPopup(error);
              }
              showErrorAlert(error);
            }
          });
  };

  const onRefresh = async () => {
    setShowRetry(false);
    // setPulledFutureEvents(null);
    // setPulledPastEvents(null);
    setIsRefreshing(true);
    isRefreshingRef.current = true;

    canLoadFutureData.current = true;
    canLoadPastData.current = true;
    pullData(true);
  };

  const renderEventCard = (event: Event) => {
    return (
      <View style={{ alignItems: "center", marginTop: 15 }}>
        <EventCard
          width={SIZES.width - 40}
          height={SIZES.width - 145}
          event={event}
          isBigCard={true}
        />
      </View>
    );
  };

  const renderItem = ({ item }) => renderEventCard(item);
  const keyExtractor = (item, index) =>
    item.EventID + props.selectedUserID + props.eventsToPull + " Event" + index;

  useEffect(() => {
    pullData(true);
  }, []);

  useEffect(() => {
    if (isRefreshing) {
      setIsRefreshing(!userPulled);
      isRefreshingRef.current = !userPulled;
    }
  }, [userPulled]);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        getItemLayout={(data, index) => ({
          length: cardHeight,
          offset: cardHeight * index,
          index,
        })}
        windowSize={8}
        data={isFutureToggle ? pulledFutureEvents : pulledPastEvents}
        ListHeaderComponent={ListHeader}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            tintColor={COLORS.white}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            style={{ backgroundColor: COLORS.trueBlack }}
          />
        }
        style={{ backgroundColor: COLORS.trueBlack }}
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
                retryCallBack={() => pullData(true)}
              />
            )}
            {!showRetry &&
              isFutureToggle &&
              (pulledFutureEvents ? (
                <McText h3>{userToken.UserID === props.selectedUserID ? props.eventsToPull === EVENT_TOGGLER.HostedEvents ? "Host some events!" : "Join some events!" : "No events to display!"}</McText>
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
        onEndReachedThreshold={0.8}
        keyExtractor={keyExtractor}
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
