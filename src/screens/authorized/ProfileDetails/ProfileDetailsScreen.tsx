import {
  ActivityIndicator,
  Button,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../../../constants/theme";
import SectionHeader from "../../../components/Styled/SectionHeader";
import { User, icons } from "../../../constants";
import * as Navigator from "../../../navigation/Navigator";
import { McText } from "../../../components/Styled";
import { Event } from "../../../constants";
import EventCard from "../../../components/EventCard";
import {
  getUserHostedFutureEvents,
  getUserHostedPastEvents,
} from "../../../services/EventService";
import { UserContext } from "../../../contexts/UserContext";
import { displayError } from "../../../helpers/helpers";
import SectionProfile from "../../../components/Styled/SectionProfile";

type ProfileDetailsRouteParams = {
  User: User;
};
const ProfileDetailsScreen = ({ route }) => {
  const { User }: ProfileDetailsRouteParams = route.params;
  const { userToken } = useContext(UserContext);

  const [pulledEvents, setPulledEvents] = useState<Event[]>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFutureToggle, setIsFutureToggle] = useState<boolean>(true);
  const pullData = async () => {
    if (isFutureToggle) {
      // getting future events

      getUserHostedFutureEvents(userToken.UserAccessToken, User.UserID)
        .then((events: Event[]) => {
          setPulledEvents(events);
          setIsRefreshing(false);
        })
        .catch((error: Error) => {
          displayError(error);
          setIsRefreshing(false);
        });
    } else {
      // getting past events

      getUserHostedPastEvents(userToken.UserAccessToken, User.UserID)
        .then((events: Event[]) => {
          setPulledEvents(events);
          setIsRefreshing(false);
        })
        .catch((error: Error) => {
          displayError(error);
          setIsRefreshing(false);
        });
    }
  };

  const onRefresh = async () => {
    setPulledEvents(null);
    setIsRefreshing(true);
    pullData();
  };

  useEffect(() => {
    setPulledEvents(null);
    pullData();
  }, [isFutureToggle]);

  return (
    <SafeAreaView style={styles.container}>
      <SectionHeader
        title={"View Profile"}
        leftButtonSVG={<icons.backarrow />}
        leftButtonOnClick={() => {
          Navigator.goBack();
        }}
      />
      <SectionProfile user={User} canEditProfile={false}/>
      <View
        style={{
          backgroundColor: isFutureToggle ? COLORS.black : COLORS.white,
          ...styles.buttonToggleContainer,
        }}
      >
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            borderWidth: isFutureToggle ? 0 : 1,
            borderColor: COLORS.purple,
            backgroundColor: isFutureToggle ? COLORS.purple : COLORS.trueBlack,
            ...styles.toggleButton,
          }}
          onPress={() => setIsFutureToggle(true)}
        >
          <McText h3 color={isFutureToggle ? COLORS.white : COLORS.purple}>
            Upcoming
          </McText>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            borderWidth: !isFutureToggle ? 0 : 1,
            borderColor: COLORS.purple,
            backgroundColor: !isFutureToggle ? COLORS.purple : COLORS.trueBlack,
            ...styles.toggleButton,
          }}
          onPress={() => setIsFutureToggle(false)}
        >
          <McText h3 color={!isFutureToggle ? COLORS.white : COLORS.purple}>
            Previous
          </McText>
        </TouchableOpacity>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {pulledEvents && pulledEvents.length === 0 ? (
          <View
            style={{
              marginTop: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <McText h3>No events to display!</McText>
          </View>
        ) : (
          <></>
        )}
        {pulledEvents ? (
          pulledEvents.map((event: Event) => (
            <View
              style={{ alignItems: "center", marginTop: 15 }}
              key={event.EventID + User.UserID + "Host"}
            >
              <EventCard
                width={SIZES.width - 40}
                height={SIZES.height * 0.3}
                event={event}
                isBigCard={true}
                showRelativeTime={true}
              />
            </View>
          ))
        ) : (
          !isRefreshing && <ActivityIndicator style={{ marginTop: 20 }} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  profileContainer: {
    height: 120,
    backgroundColor: COLORS.trueBlack,
    flexDirection: "row",
  },
  imageContainer: {
    height: 90,
    width: 90,
    borderRadius: 90,
    borderWidth: 1,
    marginTop: 15,
    marginLeft: 30,
    marginRight: 30,
    borderColor: COLORS.white,
  },
  infoContainer: {
    paddingTop: 20,
  },
  displayNameContainer: { flex: 1, flexWrap: "wrap" },
  usernameContainer: {
    marginTop: 5,
    flex: 1,
    flexWrap: "wrap",
  },
  buttonToggleContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.trueBlack,
  },
  toggleButton: {
    width: SIZES.width * 0.5,
    height: 40,
  },
});
