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
import { Event } from "../../../constants";
import { getAllInterests } from "../../../services/InterestService";
import { displayError } from "../../../helpers/helpers";
import EventCard from "../../../components/EventCard";
import { McIcon, McText } from "../../../components/Styled";
import styled from "styled-components/native";
import GradientBackground from "../../../components/Styled/GradientBackground";
import { LinearGradient } from "expo-linear-gradient";
import GradientButton from "../../../components/Styled/GradientButton";
import { UserContext } from "../../../contexts/UserContext";
import { EventContext } from "../../../contexts/EventContext";
import SectionHeader from "../../../components/Styled/SectionHeader";
import EventViewer from "../../../components/EventViewer/EventViewer";
import MobileSafeView from "../../../components/Styled/MobileSafeView";
import { useNavigation } from "@react-navigation/native";
type RouteParams = {
  school: School;
};
const ExploreEvents = ({ route }) => {
  const { currentSchool } = useContext(UserContext);
  const navigation = useNavigation<any>();

  return (
    <MobileSafeView style={styles.container} isTabNavigatorVisible={true}>
      <SectionHeader title={"Explore Events"} />
      <EventViewer school={currentSchool}/>
      <TouchableOpacity
        style={styles.hoverButtonContainer}
        onPressOut={() => {
          navigation.navigate(SCREENS.CreateEvent);
        }}
      >
        <GradientButton style={styles.hoverButtonIconContainer}>
          <icons.plus height="50%" width="50%"></icons.plus>
        </GradientButton>
      </TouchableOpacity>
    </MobileSafeView>
  );
};

export default ExploreEvents;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.trueBlack,
  },
  hoverButtonContainer: {
    flex: 1,
    position: "absolute",
    right: 30,
    bottom: 30,
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
