import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useEffect, useReducer, useRef, useState } from "react";
import {
  SIZES,
  School,
  Event,
  Interest,
  SCREENS,
  COLORS,
} from "../../constants";
import { McText } from "../Styled";
import { UserContext } from "../../contexts/UserContext";
import { getAllInterests } from "../../services/InterestService";
import EventCard from "../EventCard";
import { getAllSchoolEventsCategorized } from "../../services/EventService";
import { showBugReportPopup } from "../../helpers/helpers";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CustomError } from "../../constants/error";
import RetryButton from "../RetryButton";
import { AlertContext } from "../../contexts/AlertContext";

type EventViewerProps = {
  school: School;
  isHoverButtonVisible?: Boolean;
};
const EventViewer = (props: EventViewerProps) => {
  const { showErrorAlert } = useContext(AlertContext);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { isLoggedIn, userToken } = useContext(UserContext);
  const [categoryNameToEventsMap, setCategoryNameToEventsMap] = useState<{
    [key: string]: Event[];
  }>({});

  const smallEventCardWidth = SIZES.width - 100;
  const smallEventCardHeight = SIZES.width - 120;

  const [showRetry, setShowRetry] = useState(false);

  const [allowRefreshControl, setAllowRefreshControl] = useState(false)

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(true);

  const lastPulled = useRef<Date>(new Date());
  const isFocused = useIsFocused()

  const didFirstTimePulled = useRef(false)

  useEffect(() => {
    if (isFocused && didFirstTimePulled.current) {
      const timeDiff = Math.abs(
        new Date().getTime() - lastPulled.current.getTime()
      );

      // Calculate the difference in minutes
      const minutesDiff = Math.floor(timeDiff / (1000 * 60));

      console.log(minutesDiff + " minutes elapsed since last pull");
      if (minutesDiff >= 5) {
        console.log("Repulling events");
        setIsLoadingEvents(true);
        onRefresh();
        lastPulled.current = new Date();
      }
    }
  }, [isFocused]);


  const pullData = async () => {
    didFirstTimePulled.current = true
    lastPulled.current = new Date();
    getAllSchoolEventsCategorized(
      isLoggedIn ? userToken.UserAccessToken : undefined,
      props.school.SchoolID
    )
      .then((map: { [key: string]: Event[] }) => {
        setIsLoadingEvents(false);
        setIsRefreshing(false);
        setCategoryNameToEventsMap(map);
      })
      .catch((error: CustomError) => {
        if (error.showBugReportDialog) {
          showBugReportPopup(error);
        }
        showErrorAlert(error);
        setShowRetry(true);
        setIsRefreshing(false);
      });
  };

  const _renderBigEventCards = ({ item, index }) => {
    return (
      <View style={{ paddingHorizontal: 5, marginLeft: index === 0 ? 15 : 0 }}>
        {isLoggedIn ? (
          <EventCard event={item} isBigCard={true} />
        ) : (
          <EventCard
            event={item}
            isBigCard={true}
            onClick={() => {
              navigation.push(SCREENS.Onboarding.SignupWelcomeScreen);
            }}
          />
        )}
      </View>
    );
  };

  const _renderSmallEventCards = ({ item, index }) => {
    return (
      <View style={{ paddingHorizontal: 5, marginLeft: index === 0 ? 15 : 0 }}>
        {isLoggedIn ? (
          <EventCard
            event={item}
            isBigCard={false}
            width={smallEventCardWidth}
            height={smallEventCardHeight}
          />
        ) : (
          <EventCard
            event={item}
            width={smallEventCardWidth}
            height={smallEventCardHeight}
            onClick={() => {
              navigation.push(SCREENS.Onboarding.SignupWelcomeScreen);
            }}
          />
        )}
      </View>
    );
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setIsLoadingEvents(true);
    pullData();
    setShowRetry(false);
  };

  useEffect(() => {
    if(!allowRefreshControl && !isLoadingEvents){
      // Prevents first time refreshes for double queries
      setAllowRefreshControl(true)
    }
  }, [isLoadingEvents])

  useEffect(() => {
    pullData();
  }, []);

  const _smallKeyExtractor = (item, index) =>
    item.EventID + index + "Smallcard";

  const _bigKeyExtractor = (item, index) => item.EventID + index + "Bigcard";

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        allowRefreshControl ? 
        <RefreshControl
          tintColor={COLORS.white}
          refreshing={isRefreshing}
          onRefresh={onRefresh}
        /> : undefined
      }
      style={{ backgroundColor: COLORS.trueBlack }}
    >
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

      {!showRetry && isLoadingEvents && !isRefreshing &&(
        // LOAD THIS
        <ActivityIndicator
          color={COLORS.white}
          style={{ marginTop: 20 }}
          size={"small"}
        />
      )}
      {!isLoadingEvents &&
        !isRefreshing &&
        Object.keys(categoryNameToEventsMap).length === 0 && (
          <View style={{ marginTop: 20, alignItems: "center" }}>
            <McText h3>No upcoming events!</McText>
          </View>
        )}
      {Object.keys(categoryNameToEventsMap).map((key, index) =>
        key === "Featured" ? (
          <View key={key + index}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={Object.values(categoryNameToEventsMap[key])}
              keyExtractor={_bigKeyExtractor}
              renderItem={_renderBigEventCards}
              windowSize={2}
              style={styles.flatlistContainer}
            />
          </View>
        ) : (
          <View key={key + index}>
            <McText h2 style={styles.categoryTitle}>
              {key}
            </McText>

            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={Object.values(categoryNameToEventsMap[key])}
              keyExtractor={_smallKeyExtractor}
              windowSize={4}
              renderItem={_renderSmallEventCards}
              style={styles.flatlistContainer}
            />
          </View>
        )
      )}
        <View style={{ height: insets.bottom + (props.isHoverButtonVisible ? 90 : 20) }} />
      <View style={{ height: 20 }} />
    </ScrollView>
  );
};

export default EventViewer;

const styles = StyleSheet.create({
  categoryTitle: {
    marginTop: 15,
    marginBottom: 10,
    marginLeft: 20,
    backgroundColor: COLORS.trueBlack,
  },
  flatlistContainer: {
    backgroundColor: COLORS.trueBlack,
  },
});
