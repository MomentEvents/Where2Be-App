import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import EventViewer from "../../../components/EventViewer/EventViewer";
import GradientButton from "../../../components/Styled/GradientButton";
import MobileSafeView from "../../../components/Styled/MobileSafeView";
import SectionHeader from "../../../components/Styled/SectionHeader";
import { COLORS, SCREENS, User, Event, icons } from "../../../constants";
import { useNavigation } from "@react-navigation/native";
import HomeEvent from "../../../components/HomeEvent/HomeEvent";
import { UserContext } from "../../../contexts/UserContext";
import { getAllHomePageEventsWithHosts } from "../../../services/EventService";
import { displayError } from "../../../helpers/helpers";

const HomeScreen = () => {
  const navigation = useNavigation<any>();

  const { currentSchool, userToken } = useContext(UserContext);

  const [eventsAndHosts, setEventsAndHosts] = useState<[{Host: User, Event: Event}][]>();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const pullData = async () => {
    getAllHomePageEventsWithHosts(
      userToken.UserAccessToken,
      currentSchool.SchoolID
    )
      .then((data) => {
        setIsLoading(false);
        setIsRefreshing(false);
        setEventsAndHosts(data);
      })
      .catch((error: Error) => {
        setIsRefreshing(false);
        displayError(error);
      });
  };
  const onRefresh = () => {
    setIsRefreshing(true);
    setEventsAndHosts(undefined);
    setIsLoading(true);
    pullData();
  };

  useEffect(() => {
    pullData();
  }, []);

  return (
    <MobileSafeView style={styles.container} isBottomViewable={true}>
      <SectionHeader title={"Where2Be @ " + currentSchool.Abbreviation} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            tintColor={COLORS.white}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
          />
        }
        style={{ backgroundColor: COLORS.black }}
      >
        {isLoading && !isRefreshing && (
          // LOAD THIS
          <ActivityIndicator
            color={COLORS.white}
            style={{ marginTop: 20 }}
            size={"small"}
          />
        )}
        {eventsAndHosts && eventsAndHosts.map((value) => {
          return <HomeEvent key={"homescreeneventcard"+value[0].Event.EventID} event={value[0].Event} user={value[0].Host}></HomeEvent>;
        })}
      </ScrollView>
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

export default HomeScreen;

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
