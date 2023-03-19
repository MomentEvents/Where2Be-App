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
import { displayError } from "../../helpers/helpers";
import { useNavigation } from "@react-navigation/native";

type EventViewerProps = {
  school: School;
};
const EventViewer = (props: EventViewerProps) => {
  const navigation = useNavigation<any>();
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
        {isLoggedIn ? (
          <EventCard event={item} isBigCard={true} />
        ) : (
          <EventCard
            event={item}
            isBigCard={true}
            onClick={() => {
              navigation.navigate(SCREENS.Login);
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
          <EventCard event={item} isBigCard={false} />
        ) : (
          <EventCard
            event={item}
            isBigCard={false}
            onClick={() => {
              navigation.navigate(SCREENS.Login);
            }}
          />
        )}
      </View>
    );
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setCategoryNameToEventsMap({});
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
        <RefreshControl tintColor={COLORS.white} refreshing={isRefreshing} onRefresh={onRefresh} />
      }
      style={{ backgroundColor: COLORS.black }}
    >
      {isLoadingEvents && !isRefreshing && (
        <ActivityIndicator color={COLORS.white} style={{ marginTop: 20 }} size={"small"} />
      )}
      {!isLoadingEvents && !isRefreshing && Object.keys(categoryNameToEventsMap).length === 0 && (
        <View style={{marginTop: 20, alignItems: "center"}}>
          <McText h3>No upcoming events!</McText>
        </View>
      )}
      {Object.keys(categoryNameToEventsMap).map((key, index) =>
        key === "Featured" ? (
          <View style={{marginTop: 10}} key={"Featured" + key + index}>
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
      <View style={{ height: SIZES.bottomBarHeight + 110 }} />
    </ScrollView>
  );
};

export default EventViewer;

const styles = StyleSheet.create({
  categoryTitle: {
    marginTop: 15,
    marginBottom: 10,
    marginLeft: 20,
    backgroundColor: COLORS.black,
  },
  flatlistContainer: {
    backgroundColor: COLORS.black,
  },
});
