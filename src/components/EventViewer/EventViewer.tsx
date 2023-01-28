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
import { SIZES, School, Event, Interest } from "../../constants";
import { McText } from "../Styled";
import { UserContext } from "../../contexts/UserContext";
import {
  getAllSchoolEventsByInterest,
  getAllSchoolFeaturedEvents,
  getAllSchoolOngoingEvents,
} from "../../services/EventService";
import { getAllInterests } from "../../services/InterestService";
import EventCard from "../EventCard";

type EventViewerProps = {
  school: School;
};
const EventViewer = (props: EventViewerProps) => {
  const { isLoggedIn } = useContext(UserContext);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>(undefined);
  const [categoryNameToEventsMap, updateCategoryNameToEventsMap] = useReducer(updateMap, {});

  function updateMap(
    map: { [key: string]: Event[] },
    action: { categoryName: string; events: Event[]; empty?: boolean }
  ) {
    if(action.empty){
        map = {}
        return map
    }
    map[action.categoryName] = action.events;
    map = {...map}
    return map;
  }

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoadingInterests, setIsLoadingInterests] = useState<boolean>(true);

  const pullData = async () => {
    updateCategoryNameToEventsMap({categoryName: "Ongoing", events: undefined});

    getAllSchoolFeaturedEvents(props.school.SchoolID).then(
      (events: Event[]) => {
        setFeaturedEvents(events);
      }
    );

    getAllSchoolOngoingEvents(props.school.SchoolID).then((events: Event[]) => {
        console.log("setting ongoing events")
        updateCategoryNameToEventsMap({categoryName: "Ongoing", events: events});
    });

    getAllInterests(props.school.SchoolID).then((allInterests: Interest[]) => {
      setIsLoadingInterests(false);
      allInterests.sort((a: Interest, b: Interest) => {return a.Name.localeCompare(b.Name)})
      console.log(allInterests)
      allInterests.forEach((interest: Interest) => {
        updateCategoryNameToEventsMap({categoryName: interest.Name, events: undefined})
      });
      allInterests.forEach((interest: Interest) => {
        getAllSchoolEventsByInterest(
          props.school.SchoolID,
          interest.InterestID
        ).then((events: Event[]) => {
            console.log("updating " + interest.Name + " events")
            updateCategoryNameToEventsMap({categoryName: interest.Name, events: events})
        });
      });
    });
  };

  const _renderBigEventCards = ({ item, index }) => {
    return (
      <View style={{ paddingHorizontal: 5, marginLeft: index === 0 ? 15 : 0 }}>
        <EventCard event={item} isBigCard={true} />
      </View>
    );
  };

  const _renderSmallEventCards = ({ item, index }) => {
    return (
      <View style={{ paddingHorizontal: 5, marginLeft: index === 0 ? 15 : 0 }}>
        <EventCard event={item} isBigCard={false} />
      </View>
    );
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setIsLoadingInterests(true);
    setFeaturedEvents(undefined);
    updateCategoryNameToEventsMap({categoryName: undefined, events: undefined, empty: true});
    pullData();
    setIsRefreshing(false);
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
      {featuredEvents ? (
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.EventID}
          data={Object.values(featuredEvents)}
          renderItem={_renderBigEventCards}
          style={styles.flatlistContainer}
        />
      ) : (
        <View
          style={{
            height: 240,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size={"large"} />
        </View>
      )}
      {Object.keys(categoryNameToEventsMap).map((key, index) =>
        categoryNameToEventsMap[key] === undefined ? (
          <View key={key + index} style={{ flex: 1 }}>
            <McText h2 style={styles.categoryTitle}>
              {key}
            </McText>
            <View
              style={{
                height: 210,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ActivityIndicator size={"small"} />
            </View>
          </View>
        ) : (
          categoryNameToEventsMap[key].length !== 0 && (
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
              ></FlatList>
            </View>
          )
        )
      )}

      {isLoadingInterests && (
        <View
          style={{
            height: 210,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size={"small"} />
        </View>
      )}

      {isLoggedIn && <View style={{ height: SIZES.tab_bar_height }} />}
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
