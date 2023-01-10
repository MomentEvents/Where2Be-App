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
import { COLORS, Interest, SIZES, School, icons } from "../../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { Event } from "../../../constants";
import {
  FEATURED,
  ONGOING,
  getAllSchoolOngoingEvents,
  getAllSchoolFeaturedEvents,
  getAllSchoolEventsByInterest,
} from "../../../services/EventService";
import { getAllInterests } from "../../../services/InterestService";
import { displayError } from "../../../helpers/helpers";
import EventCard from "../../../components/EventCard";
import { McIcon, McText } from "../../../components/Styled";
import BigEventCard from "../../../components/BigEventCard";
import styled from "styled-components/native";
import * as Navigator from "../../../navigation/Navigator";
import GradientBackground from "../../../components/Styled/GradientBackground";
import { LinearGradient } from "expo-linear-gradient";
import GradientButton from "../../../components/Styled/GradientButton";
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

  const pullEvents = async () => {
    // We will await getting featured first to load the more important
    // events on the header
    var errorThrown: boolean = false;
    getAllSchoolFeaturedEvents(school.SchoolID)
      .then((events: Event[]) => setFeaturedEvents(events))
      .catch((error: Error) => {
        if (!errorThrown) {
          displayError(error);
          errorThrown = true;
        }
      });

    var interestToEventMapTemp: { [key: string]: Event[] } = {};

    await getAllSchoolOngoingEvents(school.SchoolID)
      .then((events: Event[]) => interestToEventMapTemp["Ongoing"] = events)
      .catch((error: Error) => {
        if (!errorThrown) {
          displayError(error);
          errorThrown = true;
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
          }
        });
    }

    console.log(interestToEventMapTemp);

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

  const navigateToLogin = (): void => {
    Navigator.navigate("LoginScreen");
  };

  const _renderBigEventCards = ({ item, index }) => {
    return (
      <View
        style={{
          marginLeft: 10,
        }}
      >
        <BigEventCard
          EventID={item.EventID}
          Title={item.Title}
          StartingDateTime={item.StartDateTime}
          Picture={item.Picture}
          Likes={35}
          Shoutouts={35}
          UserLiked={false}
          UserShouted={false}
          Width={SIZES.width - 20}
          Height={SIZES.height / 3}
          OnClick={navigateToLogin}
        />
      </View>
    );
  };

  const _renderSmallEventCards = ({ item, index }) => {
    console.log("Putting key");
    console.log(item);
    if (loadedEventsMap[item.EventID] === true) {
      return <></>;
    }
    loadedEventsMap[item.EventID] = true;
    return (
      <View style={styles.categoryTitle}>
        <EventCard
          EventID={item.EventID}
          Title={item.Title}
          StartingDateTime={item.StartDateTime}
          Picture={item.Picture}
          Likes={35}
          Shoutouts={35}
          UserLiked={false}
          UserShouted={false}
          Width={160}
          Height={230}
          OnClick={navigateToLogin}
        />
      </View>
    );
  };

  useEffect(() => {
    console.log("Going into use effect");
    setLoadingEvents(
      featuredEvents === null ||
        interestToEventMap === null
    );
  }, [featuredEvents, interestToEventMap]);

  useEffect(() => {
    pullEvents();
  }, []);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <SectionHeader>
          <TouchableOpacity
            onPress={() => {
              Navigator.goBack();
            }}
            style={{
              width: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <icons.backarrow />
          </TouchableOpacity>
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
          <ActivityIndicator animating={loadingEvents} />
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
    </GradientBackground>
  );
};

export default IntroduceEventsScreen;

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
    bottom: 60,
    borderRadius: 10,
  },
  hoverButtonIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    height: 70,
    width: 70,
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
