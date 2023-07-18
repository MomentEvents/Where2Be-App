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
import { MaterialIcons } from "@expo/vector-icons";
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

  const lastPulled = useRef<Date>(new Date());

  const isFocused = useIsFocused();

  const homeCardHeight =
    SIZES.height -
    insets.top -
    insets.bottom -
    SIZES.tabBarHeight -
    SIZES.sectionHeaderHeight -
    120;

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50, // The item is considered visible when 50% of its area is visible
    minimumViewTime: 300, // Minimum milliseconds the item is considered visible after the viewability event fires
  };

  const sendViewedEvents = () => {};

  useEffect(() => {
    if (isFocused) {
      const timeDiff = Math.abs(
        new Date().getTime() - lastPulled.current.getTime()
      );

      // Calculate the difference in minutes
      const minutesDiff = Math.floor(timeDiff / (1000 * 60));

      console.log(minutesDiff + " minutes elapsed since last pull")
      if (minutesDiff > 10) {
        console.log("Repulling events");
        onRefresh();
        lastPulled.current = new Date();
      }
    }
  }, [isFocused]);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    try {
      if (viewableItems.length === 0) {
        return;
      }
      const viewedEventID = viewableItems[0].item.Event.EventID;

      console.log(viewedEventID);

      if (!viewedEventIDs.current[viewedEventID]) {
        viewedEventIDs.current[viewedEventID] = true;
        queuedEventIDs.current.push(viewedEventID)

        // Update API to say that user viewed the event
        console.log(
          "user has viewed event " + viewedEventID + " for the first time!"
        );
        clearTimeout(timeoutId.current);
        const newTimeoutId = setTimeout(() => sendViewedEvents(), 10000);
        timeoutId.current = newTimeoutId;
      }

      // You can put your logic here.
      // viewableItems is an array of objects, each object represents a visible item.
      // Each object in viewableItems has an item property that refers to the actual data item in your data array
    } catch (error) {
      console.warn(error);
    }
  }).current;

  const pullData = async () => {
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
    viewedEventIDs.current = {}
    pullData();
  };

  useEffect(() => {
    pullData();
  }, []);

  return (
    <MobileSafeView style={styles.container} isBottomViewable={true}>
      <SectionHeader title={"Where2Be @ " + currentSchool.Abbreviation} />
      <FlatList
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
        style={{ backgroundColor: COLORS.black }}
        data={eventsAndHosts}
        keyExtractor={(item, index) =>
          "homescreeneventcard" + index + item.Event.EventID
        }
        ListEmptyComponent={() =>
          !isLoading &&
          !isRefreshing &&
          !showRetry && (
            <McText h3 style={{ textAlign: "center", marginTop: 20 }}>
              Nothing to see here yet!
            </McText>
          )
        }
        ListHeaderComponent={() =>
          showRetry && (
            <RetryButton
              setShowRetry={setShowRetry}
              retryCallBack={pullData}
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
              }}
            />
          )
        }
        ListFooterComponent={() =>
          isLoading &&
          !isRefreshing &&
          !showRetry && (
            <ActivityIndicator
              color={COLORS.white}
              style={{ marginTop: 20 }}
              size={"small"}
            />
          )
        }
        snapToInterval={homeCardHeight}
        decelerationRate={0}
        renderItem={({ item }) => (
          <HomeEvent
            event={item.Event}
            user={item.Host}
            reason={item.Reason}
            height={homeCardHeight}
            width={SIZES.width}
          />
        )}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
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
});
