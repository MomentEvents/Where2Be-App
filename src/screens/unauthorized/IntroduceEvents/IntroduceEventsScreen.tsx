import {
  StyleSheet,
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
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import GradientButton from "../../../components/Styled/GradientButton";
import SectionHeader from "../../../components/Styled/SectionHeader";
import EventViewer from "../../../components/EventViewer/EventViewer";
import MobileSafeView from "../../../components/Styled/MobileSafeView";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { McText } from "../../../components/Styled";
type RouteParams = {
  school: School;
};
const IntroduceEventsScreen = ({ route }) => {
  const { school }: RouteParams = route.params;
  const insets = useSafeAreaInsets();

  const navigation = useNavigation<any>();

  const navigateToLogin = (): void => {
    navigation.push(SCREENS.Login);
  };

  return (
    <MobileSafeView style={styles.container} isBottomViewable={true}>
      <SectionHeader
        title={"Explore Events"}
        leftButtonSVG={<Feather name="arrow-left" size={28} color="white" />}
        leftButtonOnClick={() => {
          navigation.goBack();
        }}
        rightButtonSVG={<McText color={COLORS.purple} body3>Sign in</McText>}
        rightButtonOnClick={navigateToLogin}
      />
      <EventViewer school={school} isHoverButtonVisible={false}></EventViewer>
      {/* <TouchableOpacity
        style={{bottom: insets.bottom + 30, ...styles.hoverButtonContainer}}
        onPressOut={navigateToLogin}
      >
        <GradientButton style={styles.hoverButtonIconContainer}>
          <icons.login height="50%" width="50%"></icons.login>
        </GradientButton>
      </TouchableOpacity> */}
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
