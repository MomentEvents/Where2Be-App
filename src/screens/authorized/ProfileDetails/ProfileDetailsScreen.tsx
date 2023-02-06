import {
  ActivityIndicator,
  Alert,
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
import { EVENT_TOGGLER, User, icons } from "../../../constants";
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
import EventToggler from "../../../components/EventToggler/EventToggler";
import MobileSafeView from "../../../components/Styled/MobileSafeView";
import { deleteUser, getUser } from "../../../services/UserService";
import { ScreenContext } from "../../../contexts/ScreenContext";

type ProfileDetailsRouteParams = {
  user: User;
};
const ProfileDetailsScreen = ({ route }) => {
  const { user }: ProfileDetailsRouteParams = route.params;
  const [viewedUser, setViewedUser] = useState<User>(user);
  const { isAdmin, userToken } = useContext(UserContext);
  const { setLoading } = useContext(ScreenContext);

  const nukeUser = () => {
    Alert.alert(
      "Nuke user",
      "Are you sure you want to delete " +
        viewedUser.DisplayName +
        " and all of their events?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
        },
        {
          text: "Yes",
          onPress: () => {
            console.log("Yes Pressed");
            setLoading(true);
            deleteUser(userToken.UserAccessToken, user.UserID)
              .then(() => {
                setLoading(false);
                Navigator.popToTop();
              })
              .catch((error: Error) => {
                setLoading(false);
                displayError(error);
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    getUser(user.UserID)
      .then((pulledUser: User) => {
        setViewedUser(pulledUser);
      })
      .catch((error: Error) => {
        displayError(error);
        Navigator.goBack();
      });
  }, []);
  return (
    <MobileSafeView style={styles.container} isBottomViewable={true}>
      {isAdmin ? (
        <SectionHeader
          title={"View Profile"}
          leftButtonSVG={<icons.backarrow />}
          leftButtonOnClick={() => {
            Navigator.goBack();
          }}
          hideBottomUnderline={true}
          rightButtonOnClick={nukeUser}
          rightButtonSVG={<icons.trash />}
        />
      ) : (
        <SectionHeader
          title={"View Profile"}
          leftButtonSVG={<icons.backarrow />}
          leftButtonOnClick={() => {
            Navigator.goBack();
          }}
          hideBottomUnderline={true}
        />
      )}
      <SectionProfile user={user} canEditProfile={true} />
      <EventToggler
        selectedUser={user}
        eventsToPull={EVENT_TOGGLER.HostedEvents}
      />
    </MobileSafeView>
  );
};

export default ProfileDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.trueBlack,
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
