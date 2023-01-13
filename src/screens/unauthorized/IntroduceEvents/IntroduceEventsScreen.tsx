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
import React, { useEffect, useState } from "react";
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
import SectionHeader from "../../../components/SectionHeader";
type RouteParams = {
  school: School;
};
const IntroduceEventsScreen = ({ navigation, route }) => {
  const { school }: RouteParams = route.params;
  var loadedEventsMap: { [eventID: string]: boolean } = {};

  const [featuredEvents, setFeaturedEvents] = useState<Event[]>(null);
  const [interestToEventMap, setInterestToEventMap] = useState<{
    [key: string]: Event[];
  }>(null);

  const [loadingEvents, setLoadingEvents] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const [errorThrown, setErrorThrown] = useState<boolean>(false);

  const pullEvents = async () => {
    // We will await getting featured first to load the more important
    // events on the header
    setErrorThrown(false);
    var errorThrown: boolean = false;
    getAllSchoolFeaturedEvents(school.SchoolID)
      .then((events: Event[]) => setFeaturedEvents(events))
      .catch((error: Error) => {
        if (!errorThrown) {
          displayError(error);
          errorThrown = true;
          setErrorThrown(true);
        }
      });

    var interestToEventMapTemp: { [key: string]: Event[] } = {};

    await getAllSchoolOngoingEvents(school.SchoolID)
      .then((events: Event[]) => (interestToEventMapTemp["Ongoing"] = events))
      .catch((error: Error) => {
        if (!errorThrown) {
          displayError(error);
          errorThrown = true;
          setErrorThrown(true);
        }
      });

    const allSchoolInterests: Interest[] = await getAllInterests(
      school.SchoolID
    );

    for (const interest of allSchoolInterests) {
      await getAllSchoolEventsByInterest(school.SchoolID, interest.InterestID)
        .then((events: Event[]) => {
          interestToEventMapTemp[interest.Name] = events;
        })
        .catch((error: Error) => {
          if (!errorThrown) {
            displayError(error);
            errorThrown = true;
            setErrorThrown(true);
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
    await pullEvents();
    setIsRefreshing(false);
  };

  const navigateToLogin = (): void => {
    Navigator.navigate(SCREENS.Login);
  };

  const _renderBigEventCards = ({ item, index }) => {
    return (
      <View
        style={{
          paddingHorizontal: 5,
          marginLeft: index === 0 ? 15 : 0
        }}
      >
        <EventCard event={item} isBigCard={true} onClick={navigateToLogin} />
      </View>
    );
  };

  const _renderSmallEventCards = ({ item, index }) => {
    if (loadedEventsMap[item.EventID] === true) {
      return <></>;
    }
    loadedEventsMap[item.EventID] = true;
    return (
      <View
        style={{
          paddingHorizontal: 5,
          marginLeft: index === 0 ? 15 : 0
        }}
      >
        <EventCard event={item} isBigCard={false} onClick={navigateToLogin} />
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
      <SafeAreaView style={styles.container}>
        <SectionHeader title={"Explore Events"} leftButtonSVG={<icons.backarrow/>} leftButtonOnClick={() => {Navigator.goBack()}}/>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        >
          {featuredEvents !== null && featuredEvents.length !== 0 ? (

              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.EventID}
                data={Object.values(featuredEvents)}
                renderItem={_renderBigEventCards}
                style={styles.flatlistContainer}
              />
          ) : (
            <View />
          )}
          {interestToEventMap === null ? (
            <></>
          ) : (
            <View>
              {Object.keys(interestToEventMap).map((key, index) => (
                <View key={key + index}>
                  <McText h2 style={styles.categoryTitle}>
                    {key}
                  </McText>
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={Object.values(interestToEventMap[key])}
                    renderItem={_renderSmallEventCards}
                    style={styles.flatlistContainer}
                  ></FlatList>
                </View>
              ))}
            </View>
          )}
          <ActivityIndicator animating={loadingEvents || errorThrown} />
        </ScrollView>
        <TouchableOpacity
          style={styles.hoverButtonContainer}
          onPress={navigateToLogin}
        >
          <GradientButton style={styles.hoverButtonIconContainer}>
            <icons.login height="60%" width="60%"></icons.login>
          </GradientButton>
        </TouchableOpacity>
      </SafeAreaView>
  );
};

export default IntroduceEventsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black
  },
  categoryTitle: {
    marginLeft: 20,
  },
  flatlistContainer: {
    marginTop: 15,
    marginBottom: 20,
  },
  hoverButtonContainer: {
    flex: 1,
    position: "absolute",
    right: 40,
    bottom: 60,
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
