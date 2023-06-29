import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  User,
  icons,
  EVENT_TOGGLER,
  COLORS,
  SIZES,
  SCREENS,
} from "../../constants";
import { ScreenContext } from "../../contexts/ScreenContext";
import { UserContext } from "../../contexts/UserContext";
import { displayError } from "../../helpers/helpers";
import { deleteUser, getUser } from "../../services/UserService";
import EventToggler from "../EventToggler/EventToggler";
import MobileSafeView from "../Styled/MobileSafeView";
import SectionHeader from "../Styled/SectionHeader";
import SectionProfile from "../Styled/SectionProfile";
import { CustomError } from "../../constants/error";
import RetryButton from "../RetryButton";

type ProfileViewerProps = {
  userID: string;
  showSettings?: boolean;
};
const ProfileViewer = (props: ProfileViewerProps) => {
  const navigation = useNavigation<any>();
  const { isAdmin, userToken, userIDToUser, updateUserIDToUser } =
    useContext(UserContext);
  const { setLoading } = useContext(ScreenContext);

  const [isRefreshing, setIsRefreshing] = useState(false);

  const [userRefreshing, setUserRefreshing] = useState(false);
  const [didPullUser, setDidPullUser] = useState(false);
  const [eventsRefreshing, setEventsRefreshing] = useState(false);

  const [showRetry, setShowRetry] = useState(false);

  useEffect(() => {
    setIsRefreshing(userRefreshing || eventsRefreshing);
  }, [userRefreshing, eventsRefreshing]);

  const onRefresh = () => {
    setDidPullUser(false);
    setShowRetry(false);
    setUserRefreshing(true);
    setEventsRefreshing(true);
  };
  const nukeUser = () => {
    Alert.alert(
      "Nuke user",
      "Are you sure you want to delete " +
        userIDToUser[props.userID].DisplayName +
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
            deleteUser(userToken.UserAccessToken, props.userID)
              .then(() => {
                setLoading(false);
                navigation.popToTop();
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

  const pullData = () => {
    getUser(userToken.UserAccessToken, props.userID)
      .then((pulledUser: User) => {
        console.log("GOT USER\n\n");
        console.log(JSON.stringify(pulledUser));
        updateUserIDToUser({ id: pulledUser.UserID, user: pulledUser });
        setUserRefreshing(false);
        setDidPullUser(true);
      })
      .catch((error: CustomError) => {
        if (error.shouldDisplay) {
          displayError(error);
        }
        setUserRefreshing(false);
        setShowRetry(true)
      });
  };

  useEffect(() => {
    pullData();
  }, []);

  useEffect(() => {
    if (isRefreshing) {
      pullData();
    }
  }, [isRefreshing]);

  if (!props.userID) {
    console.warn("FATAL ERROR: NO USER ID PASSED INTO PROFILE VIEWER");
    return <></>;
  }

  return (
    <MobileSafeView style={styles.container} isBottomViewable={true}>
      {isAdmin ? (
        <SectionHeader
          title={userIDToUser[props.userID].Username}
          leftButtonSVG={<icons.backarrow />}
          leftButtonOnClick={() => {
            navigation.goBack();
          }}
          hideBottomUnderline={true}
          rightButtonOnClick={nukeUser}
          rightButtonSVG={<icons.trash />}
        />
      ) : (
        <SectionHeader
          title={userIDToUser[props.userID].Username}
          leftButtonSVG={!props.showSettings ? <icons.backarrow /> : undefined}
          leftButtonOnClick={() => {
            if (!props.showSettings) {
              navigation.goBack();
            }
          }}
          hideBottomUnderline={true}
          rightButtonSVG={props.showSettings ? <icons.settings /> : undefined}
          rightButtonOnClick={() => {
            if (props.showSettings) {
              navigation.navigate(SCREENS.Settings);
            }
          }}
        />
      )}
      <ScrollView
        style={{ backgroundColor: COLORS.black }}
        refreshControl={
          <RefreshControl
            tintColor={COLORS.white}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            style={{ backgroundColor: COLORS.trueBlack }}
          />
        }
      >
        <SectionProfile
          userID={props.userID}
          canEditProfile={isAdmin || userToken.UserID === props.userID}
          canFollow={didPullUser && userToken.UserID !== props.userID}
        />
        {showRetry && (
          <RetryButton
            setShowRetry={setShowRetry}
            retryCallBack={pullData}
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
            }}
          />
        )}
        {!showRetry && (
          <EventToggler
            selectedUserID={props.userID}
            eventsToPull={EVENT_TOGGLER.HostedEvents}
            isRefreshing={eventsRefreshing}
            setIsRefreshing={setEventsRefreshing}
          />
        )}
      </ScrollView>
    </MobileSafeView>
  );
};

export default ProfileViewer;

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
