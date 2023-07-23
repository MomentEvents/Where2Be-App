import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import EventViewer from "../../../components/EventViewer/EventViewer";
import GradientButton from "../../../components/Styled/GradientButton";
import MobileSafeView from "../../../components/Styled/MobileSafeView";
import SectionHeader from "../../../components/Styled/SectionHeader";
import { COLORS, SCREENS, User, Event, icons, SIZES } from "../../../constants";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import HomeEvent from "../../../components/HomeEvent/HomeEvent";
import { UserContext } from "../../../contexts/UserContext";
import { getAllHomePageEventsWithHosts, getAndCleanReadEventIDs, saveReadEventIDs } from "../../../services/EventService";
import { displayError, showBugReportPopup } from "../../../helpers/helpers";
import RetryButton from "../../../components/RetryButton";
import { CustomError } from "../../../constants/error";
import { McText } from "../../../components/Styled";
import CardsSwipe from "react-native-cards-swipe";
import InterestSelector from "../../../components/InterestSelector/InterestSelector";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AlertContext } from "../../../contexts/AlertContext";
import { EventContext } from "../../../contexts/EventContext";
import { IMAGES } from "../../../constants/images";

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const { showErrorAlert } = useContext(AlertContext);

  const { newPostedEventHomePageRef } = useContext(EventContext);
  const flatListRef = useRef<FlatList>(null);

  const viewedEventIDs = useRef<{
    [key: string]: boolean;
  }>({});

  const [hiddenEvents, setHiddenEvents] = useState<string[]>([]);

  const { currentSchool, userToken, userIDToUser } = useContext(UserContext);

  const insets = useSafeAreaInsets();

  const [eventsAndHosts, setEventsAndHosts] =
    useState<{ Host: User; Event: Event; Reason: string }[]>();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [showRetry, setShowRetry] = useState<boolean>(false);

  const [isCardView, setIsCardView] = useState<boolean>(true);

  const timeoutId = useRef<NodeJS.Timeout>(null);

  const queuedEventIDs = useRef<{ eventID: string; startDateTime: Date }[]>([]);

  const lastPulled = useRef<Date>(new Date());

  const isFocused = useIsFocused();

  const homeCardHeight =
    SIZES.height -
    insets.top -
    insets.bottom -
    SIZES.tabBarHeight -
    SIZES.sectionHeaderHeight -
    120;

  const homeCardWidth = SIZES.width;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50, // The item is considered visible when 50% of its area is visible
    minimumViewTime: 300, // Minimum milliseconds the item is considered visible after the viewability event fires
  };

  const handleNotInterested = (eventID: string) => {
    // Add the eventID to the hiddenEvents state
    setHiddenEvents((prevHiddenEvents) => [...prevHiddenEvents, eventID]);
  };

  const handleUndoNotInterested = (eventID: string) => {
    // Remove the eventID from the hiddenEvents state
    setHiddenEvents((prevHiddenEvents) =>
      prevHiddenEvents.filter((id) => id !== eventID)
    );
  };

  const sendViewedEvents = () => {
    try {
      // To avoid race conditions
      const sentQueuedEventIDs = queuedEventIDs.current;

      console.log("Queued EventIDs: ", sentQueuedEventIDs);

      saveReadEventIDs(
        sentQueuedEventIDs
      )
        .then(() => {
          queuedEventIDs.current.splice(0, sentQueuedEventIDs.length);
        })
        .catch((error: CustomError) => {
          console.warn(error);
        });
    } catch (e) {
      console.warn(e);
    }
  };

  useEffect(() => {
    if (isFocused) {
      const timeDiff = Math.abs(
        new Date().getTime() - lastPulled.current.getTime()
      );

      // Calculate the difference in minutes
      const minutesDiff = Math.floor(timeDiff / (1000 * 60));

      console.log(minutesDiff + " minutes elapsed since last pull");
      if (minutesDiff > 10 && !newPostedEventHomePageRef.current) {
        console.log("Repulling events");
        onRefresh();
        lastPulled.current = new Date();
      }
      if (newPostedEventHomePageRef.current) {
        try {
          const newHostEvent: { Host: User; Event: Event; Reason: string } = {
            Host: userIDToUser[userToken.UserID],
            Event: newPostedEventHomePageRef.current,
            Reason: undefined,
          };
          const newList = eventsAndHosts;
          eventsAndHosts.unshift(newHostEvent)
          setEventsAndHosts(newList)
          newPostedEventHomePageRef.current = null;
          if (flatListRef.current) {
            flatListRef.current.scrollToOffset({ offset: 0, animated: true });
          }
        } catch (e) {
          console.warn("ERROR PUTTING EVENT ON HOME PAGE: ", e)
        }
      }
    }
  }, [isFocused]);

  const CaughtUpCard = (props: { doPaddingBottom: boolean }) => {
    return (
      <View
        style={{
          width: homeCardWidth,
          height: homeCardHeight,
          backgroundColor: COLORS.trueBlack,
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: props.doPaddingBottom ? 140 : 30,
          paddingTop: 30,
          paddingHorizontal: 30,
        }}
      >
        <McText h2>You're all caught up!</McText>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather name="aperture" size={homeCardWidth - 200} color="white" />
        </View>
      </View>
    );
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    try {
      if (viewableItems.length === 0) {
        return;
      }
      const viewedEvent: Event = viewableItems[0].item.Event;
      console.log(viewedEvent.EventID);
      if (
        !viewedEventIDs.current[viewedEvent.EventID] &&
        !viewedEvent.UserViewed
      ) {
        viewedEventIDs.current[viewedEvent.EventID] = true;
        queuedEventIDs.current.push({eventID: viewedEvent.EventID, startDateTime: viewedEvent.StartDateTime});
        // Update API to say that user viewed the event
        console.log(
          "user has viewed event " +
            viewedEvent.EventID +
            " for the first time!"
        );
        clearTimeout(timeoutId.current);
        const newTimeoutId = setTimeout(() => sendViewedEvents(), 2000);
        timeoutId.current = newTimeoutId;
      }
      // You can put your logic here.
      // viewableItems is an array of objects, each object represents a visible item.
      // Each object in viewableItems has an item property that refers to the actual data item in your data array
    } catch (error) {
      console.warn(error);
    }
  }).current;

  const getEventsAndHostsWithReasons = async (
    data: {
      Host: User;
      Event: Event;
      Reason: string;
    }[]
  ): Promise<{
    Host: User;
    Event: Event;
    Reason: string;
}[]> => {
    const viewedEvents: {
      Host: User;
      Event: Event;
      Reason: string;
    }[] = [];
    const nonViewedEvents: {
      Host: User;
      Event: Event;
      Reason: string;
    }[] = [];

    const viewedEventIDs = await getAndCleanReadEventIDs()

    for (var i = 0; i < data.length; i++) {
      if (data[i].Event.UserFollowHost){
        data[i].Reason = "From an account you follow"
      }
      if (viewedEventIDs.includes(data[i].Event.EventID)) {
        viewedEvents.push(data[i]);
      } else {
        if(!data[i].Event.UserFollowHost){
          data[i].Reason = "An event you have not seen before"
        }
        nonViewedEvents.push(data[i]);
      }
    }

    console.log("VIEWED EVENTS: ", viewedEvents, "\n\n\n");
    console.log("NONVIEWED EVENTS: ", nonViewedEvents, "\n\n\n");
    const newArray = nonViewedEvents.concat(viewedEvents);
    return newArray
  };

  const pullData = async () => {
    lastPulled.current = new Date();
    getAllHomePageEventsWithHosts(
      userToken.UserAccessToken,
      currentSchool.SchoolID
    )
      .then((data) => {
        getEventsAndHostsWithReasons(data).then((data) => {
          setEventsAndHosts(data)
          setIsLoading(false)
          setIsRefreshing(false);
        }).catch((error: Error) => {
          showErrorAlert(error)
          setShowRetry(true);
          setIsRefreshing(false);
        });
      })
      .catch((error: CustomError) => {
        setShowRetry(true);
        setIsRefreshing(false);
        if (error.showBugReportDialog) {
          showBugReportPopup(error);
        } else if (error.shouldDisplay) {
          showErrorAlert(error);
        }
      });
  };
  const onRefresh = () => {
    setEventsAndHosts(undefined);
    setIsLoading(true);
    setShowRetry(false);
    viewedEventIDs.current = {};
    pullData();
  };

  const keyExtractor = (item, index) =>
    "homescreeneventcard" + index + item.Event.EventID;

  useEffect(() => {
    pullData();
  }, []);

  return (
    <MobileSafeView style={styles.container} isBottomViewable={true}>
      <SectionHeader title={"Where2Be @ " + currentSchool.Abbreviation} />
      {isLoading && !isRefreshing && !showRetry && (
        <ActivityIndicator
          color={COLORS.white}
          style={{ marginTop: 20 }}
          size={"small"}
        />
      )}

      {showRetry && (
        <RetryButton
          setShowRetry={setShowRetry}
          retryCallBack={pullData}
          style={{
            alignItems: "center",
            justifyContent: "center",
            marginTop: 20,
          }}
        />
      )}

      <FlatList
        ref={flatListRef}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        
        refreshControl={
          <RefreshControl
            tintColor={COLORS.white}
            refreshing={isRefreshing}
            onRefresh={() => {
              setIsRefreshing(true);
              onRefresh();
            }}
          />
        }
        onViewableItemsChanged={onViewableItemsChanged}
        getItemLayout={(data, index) => ({
          length: homeCardHeight,
          offset: homeCardHeight * index,
          index,
        })}
        windowSize={5}
        data={eventsAndHosts?.filter(
          (item) => !hiddenEvents.includes(item.Event.EventID)
        )}
        keyExtractor={keyExtractor}
        snapToInterval={homeCardHeight}
        decelerationRate="fast"
        renderItem={({ item, index }) => (
          <HomeEvent
            event={item.Event}
            user={item.Host}
            reason={item.Reason}
            height={homeCardHeight}
            width={homeCardWidth}
            handleNotInterested={handleNotInterested}
            handleUndoNotInterested={handleUndoNotInterested}
          />
        )}
        viewabilityConfig={viewabilityConfig}
        ListFooterComponent={
          !isLoading && <CaughtUpCard doPaddingBottom={true} />
        }
      />
      <TouchableOpacity
        style={styles.hoverButtonContainer}
        onPressOut={() => {
          navigation.push(SCREENS.CreateEvent);
        }}
      >
        <GradientButton style={styles.hoverButtonIconContainer}>
          <icons.plus height="50%" width="50%"></icons.plus>
        </GradientButton>
      </TouchableOpacity>
    </MobileSafeView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.trueBlack,
  },
  hoverButtonContainer: {
    flex: 1,
    position: "absolute",
    right: 30,
    bottom: 30,
    borderRadius: 10,
  },
  hoverButtonIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    height: 60,
    width: 60,
    borderRadius: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButton: {
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: COLORS.purple,
  },
});
