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
        })
        .catch((error: Error) => {
          displayError(error);
        });
    } else {
      // getting past events

      getUserHostedPastEvents(userToken.UserAccessToken, User.UserID)
        .then((events: Event[]) => {
          setPulledEvents(events);
        })
        .catch((error: Error) => {
          displayError(error);
        });
    }
  };

  const onRefresh = async () => {
    setPulledEvents(null);
    setIsRefreshing(true);
    await pullData();
    setIsRefreshing(false);
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
      <View style={styles.profileContainer}>
        <Image style={styles.imageContainer} source={{ uri: User.Picture }} />
        <View style={styles.infoContainer}>
          <McText h3>{User.Name}</McText>
          <McText b3 style={styles.usernameContainer}>
            @{User.Username}
          </McText>
        </View>
      </View>
      {isFutureToggle ? (
        <View
          style={{
            backgroundColor: COLORS.black,
            ...styles.buttonToggleContainer,
          }}
        >
          <TouchableOpacity></TouchableOpacity>
          <TouchableOpacity></TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            backgroundColor: COLORS.white,
            ...styles.buttonToggleContainer,
          }}
        >
          <TouchableOpacity></TouchableOpacity>
          <TouchableOpacity></TouchableOpacity>
        </View>
      )}

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <Button
          title={"Test"}
          onPress={() => setIsFutureToggle(!isFutureToggle)}
        />
        {pulledEvents ? (
          pulledEvents.map((event: Event) => (
            <View
              style={{ alignItems: "center", marginTop: 15 }}
              key={event.EventID + User.UserID + "Host"}
            >
              <EventCard
                width={SIZES.width - 20}
                height={SIZES.height * 0.3}
                event={event}
                isBigCard={true}
              />
            </View>
          ))
        ) : (
          <ActivityIndicator style={{ marginTop: 20 }} />
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
  displayNameContainer: {},
  usernameContainer: {
    marginTop: 5,
  },
  buttonToggleContainer: {
    height: 40,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderColor: COLORS.gray,
    flexDirection: "row",
  },
  futureButton: {},
  pastButton: {},
});
