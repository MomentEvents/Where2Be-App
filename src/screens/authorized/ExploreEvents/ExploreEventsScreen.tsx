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
  Platform,
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
import SectionHeader from "../../../components/Styled/SectionHeader";
import EventViewer from "../../../components/EventViewer/EventViewer";
type RouteParams = {
  school: School;
};
const ExploreEvents = ({ navigation, route }) => {
  const { currentSchool } = useContext(UserContext);


  return (
    <SafeAreaView style={styles.container}>
      <SectionHeader title={"Explore Events"} />
      <EventViewer school={currentSchool}/>
      <TouchableOpacity
        style={styles.hoverButtonContainer}
        onPressOut={() => {
          Navigator.navigate(SCREENS.CreateEvent);
        }}
      >
        <GradientButton style={styles.hoverButtonIconContainer}>
          <icons.plus height="50%" width="50%"></icons.plus>
        </GradientButton>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ExploreEvents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  hoverButtonContainer: {
    flex: 1,
    position: "absolute",
    right: 20,
    bottom: Platform.OS === 'ios' ? SIZES.tab_bar_height + 20 : SIZES.tab_bar_height,
    borderRadius: 10,
  },
  hoverButtonIconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    height: 60,
    width: 60,
    borderRadius: 90,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },
});
