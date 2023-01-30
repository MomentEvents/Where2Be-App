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
import { getAllInterests } from "../../../services/InterestService";
import { displayError } from "../../../helpers/helpers";
import EventCard from "../../../components/EventCard";
import { McIcon, McText } from "../../../components/Styled";
import styled from "styled-components/native";
import * as Navigator from "../../../navigation/Navigator";
import GradientBackground from "../../../components/Styled/GradientBackground";
import { LinearGradient } from "expo-linear-gradient";
import GradientButton from "../../../components/Styled/GradientButton";
import SectionHeader from "../../../components/Styled/SectionHeader";
import EventViewer from "../../../components/EventViewer/EventViewer";
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


  const navigateToLogin = (): void => {
    Navigator.navigate(SCREENS.Login);
  };

 
  return (
      <SafeAreaView style={styles.container}>
        <SectionHeader title={"Explore Events"} leftButtonSVG={<icons.backarrow/>} leftButtonOnClick={() => {Navigator.goBack()}}/>
        <EventViewer school={school}></EventViewer>
        <TouchableOpacity
          style={styles.hoverButtonContainer}
          onPress={navigateToLogin}
        >
          <GradientButton style={styles.hoverButtonIconContainer}>
            <icons.login height="50%" width="50%"></icons.login>
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
