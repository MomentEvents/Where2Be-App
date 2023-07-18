import {
  ActivityIndicator,
  FlatList,
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
import { COLORS, SCREENS, User, Event, icons, SIZES } from "../../../constants";
import { useNavigation } from "@react-navigation/native";
import HomeEvent from "../../../components/HomeEvent/HomeEvent";
import { UserContext } from "../../../contexts/UserContext";
import { getAllHomePageEventsWithHosts } from "../../../services/EventService";
import { displayError, showBugReportPopup } from "../../../helpers/helpers";
import RetryButton from "../../../components/RetryButton";
import { CustomError } from "../../../constants/error";
import { McText } from "../../../components/Styled";
import CardsSwipe from "react-native-cards-swipe";

const HomeScreen = () => {
  const navigation = useNavigation<any>();

  const { currentSchool, userToken } = useContext(UserContext);

  const [eventsAndHosts, setEventsAndHosts] =
    useState<[{ Host: User; Event: Event; Reason: string }][]>();
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [showRetry, setShowRetry] = useState<boolean>(false);

  const [isCardView, setIsCardView] = useState<boolean>(true);

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
      .catch((error: CustomError) => {
        setShowRetry(true);
        setIsRefreshing(false);
        if (error.showBugReportDialog) {
          showBugReportPopup(error);
        } else if (error.shouldDisplay) {
          displayError(error);
        }
      });
  };
  const onRefresh = () => {
    setIsRefreshing(true);
    setEventsAndHosts(undefined);
    setIsLoading(true);
    setShowRetry(false);
    pullData();
  };

  useEffect(() => {
    pullData();
  }, []);

  return (
    <MobileSafeView style={styles.container} isBottomViewable={true}>
      <SectionHeader
        title={"Where2Be @ " + currentSchool.Abbreviation}
        rightButtonOnClick={() => {
          setIsCardView((value) => !value);
        }}
        rightButtonSVG={
          <View
            style={{
              borderRadius: 5,
              paddingHorizontal: 20,
              paddingVertical: 5,
              backgroundColor: isCardView ? COLORS.purple : COLORS.gray,
            }}
          >
            <McText style={{ textAlign: "center" }} h4>
              {isCardView ? "Cards" : "List"}
            </McText>
          </View>
        }
      />
      <FlatList
        pagingEnabled
      
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            tintColor={COLORS.white}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
          />
        }
        style={{ backgroundColor: COLORS.black }}
        data={eventsAndHosts}
        keyExtractor={(item, index) =>
          "homescreeneventcard" + index + item[0].Event.EventID
        }
        ListEmptyComponent={() =>
          !isLoading &&
          !isRefreshing &&
          !showRetry && (
            <McText h3 style={{ textAlign: "center", marginTop: 20 }}>
              Nothing to see here yet!
            </McText>
          )
        }
        ListHeaderComponent={() =>
          showRetry && (
            <RetryButton
              setShowRetry={setShowRetry}
              retryCallBack={pullData}
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: 20,
              }}
            />
          )
        }
        ListFooterComponent={() =>
          isLoading &&
          !isRefreshing &&
          !showRetry && (
            <ActivityIndicator
              color={COLORS.white}
              style={{ marginTop: 20 }}
              size={"small"}
            />
          )
        }
        renderItem={({ item }) => (
          <HomeEvent
            event={item[0].Event}
            user={item[0].Host}
            reason={item[0].Reason} height={SIZES.width} width={SIZES.width}/>
        )}
      />
      <TouchableOpacity
        style={styles.hoverButtonContainer}
        onPressOut={() => {
          navigation.push(SCREENS.CreateEvent);
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
    alignItems: "center",
    justifyContent: "center",
  },
});
