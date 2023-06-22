import {
  StyleSheet
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
import GradientButton from "../../../components/Styled/GradientButton";
import { UserContext } from "../../../contexts/UserContext";
import SectionHeader from "../../../components/Styled/SectionHeader";
import EventViewer from "../../../components/EventViewer/EventViewer";
import MobileSafeView from "../../../components/Styled/MobileSafeView";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from '@expo/vector-icons'; 

type RouteParams = {
  school: School;
};
const ExploreEvents = ({ route }) => {
  const { currentSchool } = useContext(UserContext);
  const navigation = useNavigation<any>();

  return (
    <MobileSafeView style={styles.container} isBottomViewable={true}>
      <SectionHeader title={"Explore Events"} rightButtonOnClick={() => navigation.push(SCREENS.Search)} rightButtonSVG={<MaterialIcons name="search" size={28} color="white"/>}/>
      <EventViewer school={currentSchool}/>
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
