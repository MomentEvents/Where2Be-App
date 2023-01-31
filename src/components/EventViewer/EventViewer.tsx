import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useEffect, useReducer, useState } from "react";
import { SIZES, School, Event, Interest, SCREENS } from "../../constants";
import { McText } from "../Styled";
import { UserContext } from "../../contexts/UserContext";
import { getAllInterests } from "../../services/InterestService";
import EventCard from "../EventCard";
import { getAllSchoolEventsCategorized } from "../../services/EventService";
import { displayError } from "../../helpers/helpers";
import * as Navigator from "../../navigation/Navigator";

type EventViewerProps = {
  school: School;
};
const EventViewer = (props: EventViewerProps) => {
  const { isLoggedIn, userToken } = useContext(UserContext);
  const [categoryNameToEventsMap, setCategoryNameToEventsMap] = useState<{
    [key: string]: Event[];
  }>({});

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState<boolean>(true);
  const pullData = async () => {
    getAllSchoolEventsCategorized(
      isLoggedIn ? userToken.UserAccessToken : undefined,
      props.school.SchoolID
    )
      .then((map: { [key: string]: Event[] }) => {
        setIsLoadingEvents(false);
        setIsRefreshing(false);
        setCategoryNameToEventsMap(map);
      })
      .catch((error: Error) => {
        setIsRefreshing(false);
        displayError(error);
      });
  };

  const _renderBigEventCards = ({ item, index }) => {
    return (
      <View style={{ paddingHorizontal: 5, marginLeft: index === 0 ? 15 : 0 }}>
        {isLoggedIn ? <EventCard event={item} isBigCard={true}/> : <EventCard event={item} isBigCard={true} onClick={() => {Navigator.navigate(SCREENS.Login)}}/>}
      </View>
    );
  };

  const _renderSmallEventCards = ({ item, index }) => {
    return (
      <View style={{ paddingHorizontal: 5, marginLeft: index === 0 ? 15 : 0 }}>
        {isLoggedIn ? <EventCard event={item} isBigCard={false}/> : <EventCard event={item} isBigCard={false} onClick={() => {Navigator.navigate(SCREENS.Login)}}/>}
      </View>
    );
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setCategoryNameToEventsMap({})
    setIsLoadingEvents(true);
    pullData();
  };

  useEffect(() => {
    pullData();
  }, []);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      {isLoadingEvents && !isRefreshing && (
        <ActivityIndicator style={{ marginTop: 20 }} size={"small"} />
      )}
      {Object.keys(categoryNameToEventsMap).map((key, index) =>
        key === "Featured" ? (
          <View key={"Featured"+key + index}>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.EventID}
              data={Object.values(categoryNameToEventsMap[key])}
              renderItem={_renderBigEventCards}
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
              renderItem={_renderSmallEventCards}
              style={styles.flatlistContainer}
            />
          </View>
        )
      )}

      {isLoggedIn && <View style={{ height: SIZES.tab_bar_height + 10 }} />}
    </ScrollView>
  );
};

export default EventViewer;

const styles = StyleSheet.create({
  categoryTitle: {
    marginLeft: 20,
  },
  flatlistContainer: {
    marginTop: 15,
    marginBottom: 20,
  },
});
