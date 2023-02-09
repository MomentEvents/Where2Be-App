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
import GradientBackground from "../../../components/Styled/GradientBackground";
import { LinearGradient } from "expo-linear-gradient";
import GradientButton from "../../../components/Styled/GradientButton";
import SectionHeader from "../../../components/Styled/SectionHeader";
import EventViewer from "../../../components/EventViewer/EventViewer";
import MobileSafeView from "../../../components/Styled/MobileSafeView";
import { useNavigation } from "@react-navigation/native";
type RouteParams = {
  school: School;
};
const IntroduceEventsScreen = ({ route }) => {
  const { school }: RouteParams = route.params;

  const navigation = useNavigation<any>();

  const navigateToLogin = (): void => {
    navigation.navigate(SCREENS.Login);
  };

  return (
    <MobileSafeView style={styles.container} isBottomViewable={true}>
      <SectionHeader
        title={"Explore Events"}
        leftButtonSVG={<icons.backarrow />}
        leftButtonOnClick={() => {
          navigation.goBack();
        }}
      />
      <EventViewer school={school}></EventViewer>
      <TouchableOpacity
        style={styles.hoverButtonContainer}
        onPressOut={navigateToLogin}
      >
        <GradientButton style={styles.hoverButtonIconContainer}>
          <icons.login height="50%" width="50%"></icons.login>
        </GradientButton>
      </TouchableOpacity>
    </MobileSafeView>
  );
};

export default IntroduceEventsScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.trueBlack,
    position: "relative",
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
    right: 30,
    bottom: 30 + SIZES.bottomBarHeight,
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
