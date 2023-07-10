import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { User, Event, COLORS, SCREENS } from "../../constants";
import { McText } from "../Styled";
import { useNavigation } from "@react-navigation/native";
import HomeEventCard from "./HomeEventCard";
import { displayError } from "../../helpers/helpers";
import {
  addUserJoinEvent,
  addUserShoutoutEvent,
  removeUserJoinEvent,
  removeUserShoutoutEvent,
  setNotInterestedInEvent,
  undoNotInterestedInEvent,
} from "../../services/UserService";
import { EventContext } from "../../contexts/EventContext";
import { UserContext } from "../../contexts/UserContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { CustomError } from "../../constants/error";

type HomeEventProps = {
  event: Event;
  user: User;
  reason: string;
};

const HomeEvent = (props: HomeEventProps) => {
  const navigation = useNavigation<any>();

  const { userIDToUser, updateUserIDToUser, userToken } =
    useContext(UserContext);
  const { eventIDToEvent, updateEventIDToEvent } = useContext(EventContext);

  const [isHidden, setIsHidden] = useState(false);

  const onHostUsernamePressed = () => {
    navigation.push(SCREENS.ProfileDetails, {
      userID: props.user.UserID,
    });
  };

  const handleUndoNotInterested = () => {
    setIsHidden(false);
    undoNotInterestedInEvent(
      userToken.UserAccessToken,
      userToken.UserID,
      props.event.EventID
    ).catch((error: CustomError) => {
      setIsHidden(true);
    });
  };

  const handleNotInterested = () => {
    setIsHidden(true);
    setNotInterestedInEvent(
      userToken.UserAccessToken,
      userToken.UserID,
      props.event.EventID
    ).catch((error: CustomError) => {
      setIsHidden(false);
    });
  };

  const onOptionsPressed = () => {
    Alert.alert(
      "Post Options",
      eventIDToEvent[props.event.EventID].Title,
      [
        {
          text: "Not Interested",
          style: "destructive",
          onPress: handleNotInterested,
        },
        { text: "Cancel" },
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    if (!userIDToUser[props.user.UserID]) {
      updateUserIDToUser({ id: props.user.UserID, user: props.user });
    }
    if (!eventIDToEvent[props.event.EventID]) {
      updateEventIDToEvent({ id: props.event.EventID, event: props.event });
    }
  }, []);

  return (
    <View key={props.user.UserID + "HomeEvent" + props.event.EventID}>
      {isHidden ? (
        <View style={{ paddingVertical: 10, paddingHorizontal: 20, backgroundColor: COLORS.gray1 }}>
          <McText body4 color={COLORS.white}>You set this event to be hidden</McText>
          <TouchableOpacity onPress={handleUndoNotInterested}>
            <McText h4 color={COLORS.white}>Undo</McText>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View
            style={{
              paddingVertical: 10,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: COLORS.gray1,
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: 20,
                flex: 1,
              }}
            >
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center" }}
                onPress={() => {
                  onHostUsernamePressed();
                }}
              >
                <Image
                  style={styles.hostProfilePic}
                  source={{
                    uri: userIDToUser[props.user.UserID]
                      ? userIDToUser[props.user.UserID].Picture
                      : props.user.Picture,
                  }}
                ></Image>
                <McText
                  h4
                  numberOfLines={1}
                  style={{
                    letterSpacing: 1,
                    color: COLORS.white,
                    marginRight: 10,
                  }}
                >
                  {userIDToUser[props.user.UserID]
                    ? userIDToUser[props.user.UserID].DisplayName
                    : props.user.DisplayName}
                </McText>
                {userIDToUser[props.user.UserID] &&
                  userIDToUser[props.user.UserID].VerifiedOrganization && (
                    <View style={{ marginRight: 20 }}>
                      <MaterialIcons
                        name="verified"
                        size={18}
                        color={COLORS.purple}
                      />
                    </View>
                  )}
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={onOptionsPressed}
              style={{ marginRight: 20 }}
            >
              <Entypo name="dots-three-horizontal" size={24} color="white" />
            </TouchableOpacity>
          </View>
          <HomeEventCard
            event={props.event}
            host={props.user}
            reason={props.reason}
          />
        </>
      )}
    </View>
  );
};

export default HomeEvent;

const styles = StyleSheet.create({
  hostProfilePic: {
    height: 35,
    width: 35,
    borderRadius: 30,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
});
