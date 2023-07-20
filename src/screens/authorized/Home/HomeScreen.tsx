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
import { getAllHomePageEventsWithHosts } from "../../../services/EventService";
import { displayError, showBugReportPopup } from "../../../helpers/helpers";
import RetryButton from "../../../components/RetryButton";
import { CustomError } from "../../../constants/error";
import { McText } from "../../../components/Styled";
import CardsSwipe from "react-native-cards-swipe";
import InterestSelector from "../../../components/InterestSelector/InterestSelector";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HomeScreen = () => {
  const navigation = useNavigation<any>();

  const viewedEventIDs = useRef<{
    [key: string]: boolean;
  }>({});

  const { currentSchool, userToken } = useContext(UserContext);

  const insets = useSafeAreaInsets();

  const [eventsAndHosts, setEventsAndHosts] =
    useState<{ Host: User; Event: Event; Reason: string }[]>();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [showRetry, setShowRetry] = useState<boolean>(false);

  const [isCardView, setIsCardView] = useState<boolean>(true);

  const timeoutId = useRef<NodeJS.Timeout>(null);

  const queuedEventIDs = useRef<string[]>([]);

  const eventViewIndex = useRef<number>();

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

  // const sendViewedEvents = () => {
  //   try {
  //     // To avoid race conditions
  //     const sentQueuedEventIDs = queuedEventIDs.current;

  //     console.log("Queued EventIDs: ", sentQueuedEventIDs);

  //     setViewedEvents(
  //       userToken.UserAccessToken,
  //       userToken.UserID,
  //       sentQueuedEventIDs
  //     )
  //       .then(() => {
  //         queuedEventIDs.current.splice(0, sentQueuedEventIDs.length);
  //       })
  //       .catch((error: CustomError) => {
  //         console.warn(error);
  //       });
  //   } catch (e) {
  //     console.warn(e);
  //   }
  // };

  useEffect(() => {
    if (isFocused) {
      const timeDiff = Math.abs(
        new Date().getTime() - lastPulled.current.getTime()
      );

      // Calculate the difference in minutes
      const minutesDiff = Math.floor(timeDiff / (1000 * 60));

      console.log(minutesDiff + " minutes elapsed since last pull");
      if (minutesDiff > 10) {
        console.log("Repulling events");
        onRefresh();
        lastPulled.current = new Date();
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
    // try {
    //   if (viewableItems.length === 0) {
    //     return;
    //   }
    //   const viewedEvent = viewableItems[0].item.Event;

    //   console.log(viewedEvent.EventID);

    //   if (
    //     !viewedEventIDs.current[viewedEvent.EventID] &&
    //     !viewedEvent.UserViewed
    //   ) {
    //     viewedEventIDs.current[viewedEvent.EventID] = true;
    //     queuedEventIDs.current.push(viewedEvent.EventID);

    //     // Update API to say that user viewed the event
    //     console.log(
    //       "user has viewed event " +
    //         viewedEvent.EventID +
    //         " for the first time!"
    //     );
    //     clearTimeout(timeoutId.current);
    //     const newTimeoutId = setTimeout(() => sendViewedEvents(), 5000);
    //     timeoutId.current = newTimeoutId;
    //   }

    //   // You can put your logic here.
    //   // viewableItems is an array of objects, each object represents a visible item.
    //   // Each object in viewableItems has an item property that refers to the actual data item in your data array
    // } catch (error) {
    //   console.warn(error);
    // }
  }).current;

  // const formatEvents = (
  //   data: {
  //     Host: User;
  //     Event: Event;
  //     Reason: string;
  //   }[]
  // ) => {
  //   const viewedEvents: {
  //     Host: User;
  //     Event: Event;
  //     Reason: string;
  //   }[] = [];
  //   const nonViewedEvents: {
  //     Host: User;
  //     Event: Event;
  //     Reason: string;
  //   }[] = [];

  //   for (var i = 0; i < data.length; i++) {
  //     if (data[i].Event.UserViewed) {
  //       viewedEvents.push(data[i]);
  //     } else {
  //       nonViewedEvents.push(data[i]);
  //     }
  //   }

  //   eventViewIndex.current = nonViewedEvents.length - 1;

  //   console.log("VIEWED EVENTS: ", viewedEvents, "\n\n\n");
  //   console.log("NONVIEWED EVENTS: ", nonViewedEvents, "\n\n\n");
  //   console.log("\n\n\n CURRENTVIEWINDEX: " + eventViewIndex.current);
  //   const newArray = nonViewedEvents.concat(viewedEvents);
  //   setEventsAndHosts(newArray);
  // };

  const pullData = async () => {
    lastPulled.current = new Date();
    eventViewIndex.current = undefined;
    getAllHomePageEventsWithHosts(
      userToken.UserAccessToken,
      currentSchool.SchoolID
    )
      .then((data) => {
        setIsLoading(false);
        setIsRefreshing(false);
        setEventsAndHosts(data);
      })
      .catch((error: CustomError) => {
        setShowRetry(true);
        setIsRefreshing(false);
        if (error.showBugReportDialog) {
          showBugReportPopup(error);
        } else if (error.shouldDisplay) {
          displayError(error);
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

  const getReasonByEvent = (event: Event, defaultReason: string): string => {
    // if (event.UserFollowHost && !event.UserViewed) {
    //   return "A new event from an account you follow";
    // }
    if (event.UserFollowHost) {
      return "From an account you follow";
    }
    // if (!event.UserViewed) {
    //   return "An event you have not seen before";
    // }

    return defaultReason;
  };

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
        pagingEnabled
        showsVerticalScrollIndicator={false}
        // ListEmptyComponent={
        //   !isLoading && <CaughtUpCard doPaddingBottom={false} />
        // }
        // ListHeaderComponent={
        //   eventViewIndex.current === -1 && (
        //     <CaughtUpCard doPaddingBottom={false} />
        //   )
        // }
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
        getItemLayout={(data, index) => ({
          length: homeCardHeight,
          offset: homeCardHeight * index,
          index,
        })}
        windowSize={5}
        data={eventsAndHosts}
        keyExtractor={keyExtractor}
        snapToInterval={homeCardHeight}
        decelerationRate="fast"
        renderItem={({ item, index }) => (
          <View>
            <HomeEvent
              event={item.Event}
              user={item.Host}
              reason={getReasonByEvent(item.Event, item.Reason)}
              height={homeCardHeight}
              width={homeCardWidth}
            />
          </View>
        )}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        ListFooterComponent={!isLoading && <CaughtUpCard doPaddingBottom={true}/>}
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
