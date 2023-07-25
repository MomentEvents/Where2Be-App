import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Alert,
  Image,
} from "react-native";
import { User, Event, COLORS, SCREENS } from "../../constants";
import { McText } from "../Styled";
import { useNavigation } from "@react-navigation/native";
import HomeEventCard from "./HomeEventCard";
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
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { CustomError } from "../../constants/error";
import { showBugReportPopup } from "../../helpers/helpers";
import InterestSelector from "../InterestSelector/InterestSelector";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AlertContext } from "../../contexts/AlertContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { selectUserByID } from "../../redux/users/userSelectors";
import { updateUserMap } from "../../redux/users/userSlice";
import { selectEventByID } from "../../redux/events/eventSelectors";
import { updateEventMap } from "../../redux/events/eventSlice";

type HomeEventProps = {
  event: Event;
  user: User;
  reason: string;
  height: number;
  width: number;
  handleNotInterested: (eventID: string) => void;
  handleUndoNotInterested: (eventID: string) => void;
};

const HomeEvent = (props: HomeEventProps) => {
  const { showAlert, hideAlert } = useContext(AlertContext);
  const navigation = useNavigation<any>();
  const usernameHeight = 52;
  const dispatch = useDispatch<AppDispatch>();
  const storedUser = useSelector((state: RootState) => selectUserByID(state, props.user.UserID));
  const storedEvent = useSelector((state: RootState) => selectEventByID(state, props.event.EventID));

  const { userToken } =
    useContext(UserContext);

  let timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const onHostUsernamePressed = () => {
    navigation.push(SCREENS.ProfileDetails, {
      userID: props.user.UserID,
    });
  };

  const handleNotInterested = () => {
    showAlert(
      <>
        <McText body4 style={{ color: COLORS.white }}>
          You set this event to be hidden
        </McText>
        <TouchableOpacity
          onPress={() => {
            handleUndoNotInterested();
            hideAlert();
          }}
        >
          <McText
            h4
            style={{ color: COLORS.white, textDecorationLine: "underline" }}
          >
            Undo
          </McText>
        </TouchableOpacity>
      </>,
      5
    );
    props.handleNotInterested(props.event.EventID);
    setNotInterestedInEvent(
      userToken.UserAccessToken,
      userToken.UserID,
      props.event.EventID
    ).catch((error: CustomError) => {
      if (error.showBugReportDialog) {
        showBugReportPopup(error);
      }
    });
  };

  const handleUndoNotInterested = () => {
    props.handleUndoNotInterested(props.event.EventID);
    undoNotInterestedInEvent(
      userToken.UserAccessToken,
      userToken.UserID,
      props.event.EventID
    ).catch((error: CustomError) => {
      if (error.showBugReportDialog) {
        showBugReportPopup(error);
      }
    });
  };

  useEffect(() => {
    if (!storedUser) {
      dispatch(updateUserMap({
        id: props.user.UserID,
        changes: props.user,
      }));
    }
    if (!storedEvent) {
      dispatch(updateEventMap({ id: props.event.EventID, changes: props.event }));
    }
  }, []);

  if(!storedEvent){
    return <></>
  }
  return (
    <View
      style={{ height: props.height, width: props.width, overflow: "hidden" }}
    >
      <View
        style={{
          height: usernameHeight,
          paddingTop: 10,
          paddingBottom: 10,
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
            marginRight: 80,
          }}
          onPress={() => {
            onHostUsernamePressed();
          }}
        >
          <Image
            style={styles.hostProfilePic}
            source={{
              uri: storedUser
                ? storedUser.Picture
                : props.user.Picture,
            }}
          />
          <McText
            h4
            numberOfLines={1}
            style={{
              letterSpacing: 1,
              color: COLORS.white,
              marginRight: 10,
            }}
          >
            {storedUser
              ? storedUser.DisplayName
              : props.user.DisplayName}
          </McText>
          {storedUser?.VerifiedOrganization && (
              <View style={{ marginRight: 20 }}>
                <MaterialIcons
                  name="verified"
                  size={18}
                  color={COLORS.purple}
                />
              </View>
            )}
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNotInterested}>
          <MaterialCommunityIcons name="window-close" size={20} color="gray" />
        </TouchableOpacity>
      </View>
      <HomeEventCard
        width={props.width}
        height={props.height - usernameHeight}
        event={props.event}
        reason={props.reason}
      />
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
    borderWidth: 0.2,
    borderColor: COLORS.gray,
    justifyContent: "center",
    alignItems: "center",
  },
});
