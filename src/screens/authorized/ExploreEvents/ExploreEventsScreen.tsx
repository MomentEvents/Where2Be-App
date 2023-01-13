import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  COLORS,
  Interest,
  SCREENS,
  SIZES,
  School,
  icons,
} from "../../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { Event } from "../../../constants";
import {
  getAllSchoolOngoingEvents,
  getAllSchoolFeaturedEvents,
  getAllSchoolEventsByInterest,
} from "../../../services/EventService";
import { getAllInterests } from "../../../services/InterestService";
import { displayError } from "../../../helpers/helpers";
import EventCard from "../../../components/EventCard";
import { McIcon, McText } from "../../../components/Styled";
import styled from "styled-components/native";
import * as Navigator from "../../../navigation/Navigator";
import GradientBackground from "../../../components/Styled/GradientBackground";
import { LinearGradient } from "expo-linear-gradient";
import GradientButton from "../../../components/Styled/GradientButton";
import { UserContext } from "../../../contexts/UserContext";
import { EventContext } from "../../../contexts/EventContext";
type RouteParams = {
  school: School;
};
const ExploreEvents = ({ navigation, route }) => {
  const { currentSchool } = useContext(UserContext);
  var loadedEventsMap: { [eventID: string]: boolean } = {};

  const [featuredEvents, setFeaturedEvents] = useState<Event[]>(null);
  const [interestToEventMap, setInterestToEventMap] = useState<{
    [key: string]: Event[];
  }>(null);

  const [loadingEvents, setLoadingEvents] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const [errorThrown, setErrorThrown] = useState<boolean>(false)

  const pullEvents = async () => {
    // We will await getting featured first to load the more important
    // events on the header
    setErrorThrown(false)
    var errorThrown: boolean = false;
    getAllSchoolFeaturedEvents(currentSchool.SchoolID)
      .then((events: Event[]) => setFeaturedEvents(events))
      .catch((error: Error) => {
        if (!errorThrown) {
          displayError(error);
          errorThrown = true;
          setErrorThrown(true)
        }
      });

    var interestToEventMapTemp: { [key: string]: Event[] } = {};

    await getAllSchoolOngoingEvents(currentSchool.SchoolID)
      .then((events: Event[]) => (interestToEventMapTemp["Ongoing"] = events))
      .catch((error: Error) => {
        if (!errorThrown) {
          displayError(error);
          errorThrown = true;
          setErrorThrown(true)
        }
      });

    const allSchoolInterests: Interest[] = await getAllInterests(
      currentSchool.SchoolID
    );

    for (const interest of allSchoolInterests) {
      await getAllSchoolEventsByInterest(
        currentSchool.SchoolID,
        interest.InterestID
      )
        .then((events: Event[]) => {
          interestToEventMapTemp[interest.Name] = events;
        })
        .catch((error: Error) => {
          if (!errorThrown) {
            displayError(error);
            errorThrown = true;
            setErrorThrown(true)
          }
        });
    }

    setInterestToEventMap(interestToEventMapTemp);
  };

  const onRefresh = async () => {
    setLoadingEvents(true);
    setIsRefreshing(true);
    setFeaturedEvents(null);
    setInterestToEventMap(null);
    pullEvents();
    setIsRefreshing(false);
  };

  const _renderBigEventCards = ({ item, index }) => {
    return (
      <View
        style={{
          marginLeft: 10,
        }}
      >
        <EventCard event={item} isBigCard={true} />
      </View>
    );
  };

  const _renderSmallEventCards = ({ item, index }) => {
    if (loadedEventsMap[item.EventID] === true) {
      return <></>;
    }
    loadedEventsMap[item.EventID] = true;
    return (
      <View style={styles.categoryTitle}>
        <EventCard event={item} isBigCard={false} />
      </View>
    );
  };

  useEffect(() => {
    setLoadingEvents(featuredEvents === null || interestToEventMap === null);
  }, [featuredEvents, interestToEventMap]);

  useEffect(() => {
    pullEvents();
  }, []);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <SectionHeader>
          <McText
            h1
            style={{
              marginLeft: 10,
            }}
          >
            Explore Events
          </McText>
        </SectionHeader>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          {featuredEvents !== null && featuredEvents.length !== 0 ? (
            <View>
              <FlatList
                horizontal
                keyExtractor={(item) => item.EventID}
                data={Object.values(featuredEvents)}
                renderItem={_renderBigEventCards}
                style={styles.flatlistContainer}
              ></FlatList>
            </View>
          ) : (
            <View />
          )}
          {interestToEventMap === null ? (
            <></>
          ) : (
            Object.keys(interestToEventMap).map((key, index) => (
              <View key={key + index}>
                <McText h2 style={styles.categoryTitle}>
                  {key}
                </McText>
                <FlatList
                  horizontal
                  data={Object.values(interestToEventMap[key])}
                  renderItem={_renderSmallEventCards}
                  style={styles.flatlistContainer}
                ></FlatList>
              </View>
            ))
          )}
          <ActivityIndicator animating={loadingEvents || errorThrown} />

          <View style={{ height: SIZES.tab_bar_height }} />
        </ScrollView>
        <TouchableOpacity style={styles.hoverButtonContainer}>
          <GradientButton style={styles.hoverButtonIconContainer}>
            <icons.plus height="60%" width="60%"></icons.plus>
          </GradientButton>
        </TouchableOpacity>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default ExploreEvents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoryTitle: {
    marginLeft: 10,
  },
  flatlistContainer: {
    marginTop: 15,
    marginBottom: 20,
  },
  hoverButtonContainer: {
    flex: 1,
    position: "absolute",
    right: 40,
    bottom: 20 + SIZES.tab_bar_height,
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

const SectionHeader = ({ children }) => {
  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingVertical: 6,
        alignItems: "center",
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: COLORS.gray,
        backgroundColor: COLORS.trueBlack,
      }}
    >
      {children}
    </View>
  );
};
