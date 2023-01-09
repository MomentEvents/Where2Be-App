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
import { COLORS, SIZES, School, icons } from "../../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { Event } from "../../../constants";
import {
  FEATURED,
  STARTING_SOON,
  ONGOING,
  ACADEMIC,
  ATHLETICS,
  CAREER_DEVELOPMENT,
  COMMUNITY,
  ENTERTAINMENT,
  RECREATION,
  OTHER,
  getAllSchoolEventsByCategory,
} from "../../../services/EventService";
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
  const [startingSoonEvents, setStartingSoonEvents] = useState<Event[]>(null);
  const [ongoingEvents, setOngoingEvents] = useState<Event[]>(null);
  const [academicEvents, setAcademicEvents] = useState<Event[]>(null);
  const [athleticsEvents, setAthleticsEvents] = useState<Event[]>(null);
  const [careerDevelopmentEvents, setCareerDevelopmentEvents] =
    useState<Event[]>(null);
  const [communityEvents, setCommunityEvents] = useState<Event[]>(null);
  const [entertainmentEvents, setEntertainmentEvents] = useState<Event[]>(null);
  const [recreationEvents, setRecreationEvents] = useState<Event[]>(null);
  const [otherEvents, setOtherEvents] = useState<Event[]>(null);

  const [loadingEvents, setLoadingEvents] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const pullEvents = async () => {
    // We will await getting featured first to load the more important
    // events on the header
    var errorThrown: boolean = false;
    await getAllSchoolEventsByCategory(school.SchoolID, FEATURED)
      .then((events: Event[]) => setFeaturedEvents(events))
      .catch((error: Error) => {
        if (!errorThrown) {
          displayError(error);
          errorThrown = true;
        }
      });

    getAllSchoolEventsByCategory(school.SchoolID, STARTING_SOON)
      .then((events: Event[]) => setStartingSoonEvents(events))
      .catch((error: Error) => {
        if (!errorThrown) {
          displayError(error);
          errorThrown = true;
        }
      });
    getAllSchoolEventsByCategory(school.SchoolID, ONGOING)
      .then((events: Event[]) => setOngoingEvents(events))
      .catch((error: Error) => {
        if (!errorThrown) {
          displayError(error);
          errorThrown = true;
        }
      });
    getAllSchoolEventsByCategory(school.SchoolID, ACADEMIC)
      .then((events: Event[]) => setAcademicEvents(events))
      .catch((error: Error) => {
        if (!errorThrown) {
          displayError(error);
          errorThrown = true;
        }
      });
    getAllSchoolEventsByCategory(school.SchoolID, ATHLETICS)
      .then((events: Event[]) => setAthleticsEvents(events))
      .catch((error: Error) => {
        if (!errorThrown) {
          displayError(error);
          errorThrown = true;
        }
      });
    getAllSchoolEventsByCategory(school.SchoolID, CAREER_DEVELOPMENT)
      .then((events: Event[]) => setCareerDevelopmentEvents(events))
      .catch((error: Error) => {
        if (!errorThrown) {
          displayError(error);
          errorThrown = true;
        }
      });
    getAllSchoolEventsByCategory(school.SchoolID, COMMUNITY)
      .then((events: Event[]) => setCommunityEvents(events))
      .catch((error: Error) => {
        if (!errorThrown) {
          displayError(error);
          errorThrown = true;
        }
      });
    getAllSchoolEventsByCategory(school.SchoolID, ENTERTAINMENT)
      .then((events: Event[]) => setEntertainmentEvents(events))
      .catch((error: Error) => {
        if (!errorThrown) {
          displayError(error);
          errorThrown = true;
        }
      });
    getAllSchoolEventsByCategory(school.SchoolID, RECREATION)
      .then((events: Event[]) => setRecreationEvents(events))
      .catch((error: Error) => {
        if (!errorThrown) {
          displayError(error);
          errorThrown = true;
        }
      });
    getAllSchoolEventsByCategory(school.SchoolID, OTHER)
      .then((events: Event[]) => setOtherEvents(events))
      .catch((error: Error) => {
        if (!errorThrown) {
          displayError(error);
          errorThrown = true;
        }
      });
  };

  const onRefresh = async () => {
    setLoadingEvents(true);
    setIsRefreshing(true);
    setFeaturedEvents(null);
    setStartingSoonEvents(null);
    setOngoingEvents(null);
    setAcademicEvents(null);
    setAthleticsEvents(null);
    setCareerDevelopmentEvents(null);
    setCommunityEvents(null);
    setEntertainmentEvents(null);
    setRecreationEvents(null);
    setOtherEvents(null);
    pullEvents();
    setIsRefreshing(false);
  };

  const navigateToLogin = (): void => {
    Navigator.navigate("LoginScreen");
  };

  const _renderBigEventCards = ({ item, index }) => {
    if (loadedEventsMap[item.EventID] === true) {
      return <></>;
    }
    loadedEventsMap[item.EventID] = true;
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
        startingSoonEvents === null ||
        ongoingEvents === null ||
        academicEvents === null ||
        athleticsEvents === null ||
        careerDevelopmentEvents === null ||
        communityEvents === null ||
        entertainmentEvents === null ||
        recreationEvents === null ||
        otherEvents === null
    );
  }, [
    featuredEvents,
    startingSoonEvents,
    ongoingEvents,
    academicEvents,
    athleticsEvents,
    careerDevelopmentEvents,
    communityEvents,
    entertainmentEvents,
    recreationEvents,
    otherEvents,
  ]);

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
          {startingSoonEvents !== null && startingSoonEvents.length !== 0 ? (
            <View>
              <McText h2 style={styles.categoryTitle}>
                Starting Soon
              </McText>
              <FlatList
                horizontal
                keyExtractor={(item) => item.EventID}
                data={Object.values(startingSoonEvents)}
                renderItem={_renderSmallEventCards}
                
                style={styles.flatlistContainer}
              ></FlatList>
            </View>
          ) : (
            <View />
          )}
          {ongoingEvents !== null && ongoingEvents.length !== 0 ? (
            <View>
              <McText h2 style={styles.categoryTitle}>
                Ongoing
              </McText>
              <FlatList
                horizontal
                keyExtractor={(item) => item.EventID}
                data={Object.values(ongoingEvents)}
                renderItem={_renderSmallEventCards}
                style={styles.flatlistContainer}
              ></FlatList>
            </View>
          ) : (
            <View />
          )}
          {academicEvents !== null && academicEvents.length !== 0 ? (
            <View>
              <McText h2 style={styles.categoryTitle}>
                Academic
              </McText>
              <FlatList
                horizontal
                keyExtractor={(item) => item.EventID}
                data={Object.values(academicEvents)}
                renderItem={_renderSmallEventCards}
                style={styles.flatlistContainer}
              ></FlatList>
            </View>
          ) : (
            <View />
          )}
          {athleticsEvents !== null && athleticsEvents.length !== 0 ? (
            <View>
              <McText h2 style={styles.categoryTitle}>
                Athletics
              </McText>
              <FlatList
                horizontal
                keyExtractor={(item) => item.EventID}
                data={Object.values(athleticsEvents)}
                renderItem={_renderSmallEventCards}
                style={styles.flatlistContainer}
              ></FlatList>
            </View>
          ) : (
            <View />
          )}
          {careerDevelopmentEvents !== null &&
          careerDevelopmentEvents.length !== 0 ? (
            <View>
              <McText h2 style={styles.categoryTitle}>
                Career Development
              </McText>
              <FlatList
                horizontal
                keyExtractor={(item) => item.EventID}
                data={Object.values(careerDevelopmentEvents)}
                renderItem={_renderSmallEventCards}
                style={styles.flatlistContainer}
              ></FlatList>
            </View>
          ) : (
            <View />
          )}
          {communityEvents !== null && communityEvents.length !== 0 ? (
            <View>
              <McText h2 style={styles.categoryTitle}>
                Community
              </McText>
              <FlatList
                horizontal
                keyExtractor={(item) => item.EventID}
                data={Object.values(communityEvents)}
                renderItem={_renderSmallEventCards}
                style={styles.flatlistContainer}
              ></FlatList>
            </View>
          ) : (
            <View />
          )}
          {entertainmentEvents !== null && entertainmentEvents.length !== 0 ? (
            <View>
              <McText h2 style={styles.categoryTitle}>
                Entertainment
              </McText>
              <FlatList
                horizontal
                keyExtractor={(item) => item.EventID}
                data={Object.values(entertainmentEvents)}
                renderItem={_renderSmallEventCards}
                style={styles.flatlistContainer}
              ></FlatList>
            </View>
          ) : (
            <View />
          )}
          {recreationEvents !== null && recreationEvents.length !== 0 ? (
            <View>
              <McText h2 style={styles.categoryTitle}>
                Recreation
              </McText>
              <FlatList
                horizontal
                keyExtractor={(item) => item.EventID}
                data={Object.values(recreationEvents)}
                renderItem={_renderSmallEventCards}
                style={styles.flatlistContainer}
              ></FlatList>
            </View>
          ) : (
            <View />
          )}
          {otherEvents !== null && otherEvents.length !== 0 ? (
            <View>
              <McText h2 style={styles.categoryTitle}>
                Other
              </McText>
              <FlatList
                horizontal
                keyExtractor={(item) => item.EventID}
                data={Object.values(otherEvents)}
                renderItem={_renderSmallEventCards}
                style={styles.flatlistContainer}
              ></FlatList>
            </View>
          ) : (
            <View />
          )}
          <ActivityIndicator animating={loadingEvents} />
        </ScrollView>
        <TouchableOpacity
          style={{
            flex: 1,
            position: "absolute",
            right: 40,
            bottom: 60,
            borderRadius: 90,
          }}
          onPress={navigateToLogin}
        >
          <GradientButton
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              height: 70,
              width: 70,
              borderRadius: 90,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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
