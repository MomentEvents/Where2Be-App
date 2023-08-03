import {
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Linking,
  AppState,
} from "react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ScreenContext } from "../../../contexts/ScreenContext";
import { COLORS, SCREENS, SIZES, icons } from "../../../constants";
import { Event } from "../../../constants/types";
import { User } from "../../../constants/types";
import { Interest } from "../../../constants/types";
import { LinearGradient } from "expo-linear-gradient";
import { McText } from "../../../components/Styled";
import moment from "moment";
import styled from "styled-components/native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import ImageView from "react-native-image-viewing";
import {
  addUserJoinEvent,
  addUserShoutoutEvent,
  getEventHostByEventId,
  removeUserJoinEvent,
  removeUserShoutoutEvent,
} from "../../../services/UserService";
import { UserContext } from "../../../contexts/UserContext";
import {
  formatError,
  openURL,
  showBugReportPopup,
  truncateNumber,
} from "../../../helpers/helpers";
import { EventContext } from "../../../contexts/EventContext";
import { deleteEvent, getEvent } from "../../../services/EventService";
import { getEventInterestsByEventId } from "../../../services/InterestService";
import GradientButton from "../../../components/Styled/GradientButton";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  AntDesign,
  Entypo,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Hyperlink from "react-native-hyperlink";
import RetryButton from "../../../components/RetryButton";
import { CustomError } from "../../../constants/error";
import { AlertContext } from "../../../contexts/AlertContext";
import EventPreviewer from "../../../components/EventPreviewer/EventPreviewer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { selectUserByID } from "../../../redux/users/userSelectors";
import {
  updateUserMap,
  updateUserNumericField,
} from "../../../redux/users/userSlice";
import {
  selectEventByID,
  selectEventInterestsByID,
} from "../../../redux/events/eventSelectors";
import {
  setEventInterestsMap,
  setEventMap,
  updateEventInterestsMap,
  updateEventMap,
} from "../../../redux/events/eventSlice";

type routeParametersType = {
  eventID: string;
};

const EventDetailsScreen = ({ route }) => {
  const { userToken, isAdmin } = useContext(UserContext);
  const navigation = useNavigation<any>();

  // Props from previous event card to update
  const propsFromEventCard: routeParametersType = route.params;
  const { eventID } = propsFromEventCard;

  // Loading context in case we want to disable the screen
  const { setLoading } = useContext(ScreenContext);

  const {
    clientAddUserJoin: addUserJoin,
    clientAddUserShoutout: addUserShoutout,
    clientRemoveUserJoin: removeUserJoin,
    clientRemoveUserShoutout: removeUserShoutout,
  } = useContext(EventContext);

  const dispatch = useDispatch<AppDispatch>();
  const storedEvent = useSelector((state: RootState) =>
    selectEventByID(state, eventID)
  );
  const storedInterests = useSelector((state: RootState) =>
    selectEventInterestsByID(state, eventID)
  );
  const user = useSelector((state: RootState) =>
    selectUserByID(state, storedEvent?.HostUserID)
  );

  if (!eventID) {
    throw formatError(
      "Error",
      "eventID was null or undefined when entering event details"
    );
  }

  const { showErrorAlert } = useContext(AlertContext);

  const [host, setHost] = useState<User>(undefined);

  const [isHost, setIsHost] = useState<boolean>(false);

  const [descriptionExpanded, setDescriptionExpanded] =
    useState<boolean>(false); // to expand description box
  const [lengthMoreText, setLengthMoreText] = useState<boolean>(false); // to show the "Read more..." & "Read Less"

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const useRefRefreshing = useRef(false);

  const [didFetchEvent, setDidFetchEvent] = useState<boolean>(false);
  const [didFetchInterests, setDidFetchInterests] = useState<boolean>(false);
  const [didFetchHost, setDidFetchHost] = useState<boolean>(false);

  const [imageViewVisible, setImageViewVisible] = useState<boolean>(false);

  const [showRetry, setShowRetry] = useState(false);

  const insets = useSafeAreaInsets();

  // These are local variables to determine if the user has tapped join or shouout before the event has been fetched.
  // This updates the event counter and the boolean in case there is a discrepency.
  // Please see pullData() logic specifically in the pullEvent logic
  let beforeLoadJoin = useRef<boolean>(undefined);
  let beforeLoadShoutout = useRef<boolean>(undefined);

  const didClickTicketRef = useRef<boolean>(false);

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log("IT IS ACTIVE")
        console.log(didClickTicketRef.current + "DIDCLICKTICKETREF")
        console.log(JSON.stringify(storedEvent))
        console.log(!storedEvent.UserJoin)
        if (didClickTicketRef.current && !storedEvent.UserJoin) {
          Alert.alert(
            "Did you complete your registration?",
            "",
            [
              {
                text: "No",
                onPress: () => console.log("Cancel Pressed"),
              },
              {
                text: "Yes",
                onPress: () => {
                  console.log("Yes Pressed");
                  addUserJoin(eventID)
                },
              },
            ],
            { cancelable: false }
          );
        }
        didClickTicketRef.current = false;
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log('AppState', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const onTicketPressed = () => {
    if (storedEvent?.SignupLink) {
      didClickTicketRef.current = true;
      console.log("Setting didClickTicketRef to be ", didClickTicketRef.current)
      openURL(storedEvent.SignupLink);    
    }
  };

  const onHostPressed = () => {
    if (host && user) {
      navigation.push(SCREENS.ProfileDetails, {
        userID: host.UserID,
      });
    }
  };

  const onEditEventPressed = () => {
    if (!storedEvent) {
      return;
    }
    navigation.push(SCREENS.EditEvent, {
      eventID: eventID,
    });
  };

  const onDeleteEventPressed = () => {
    Alert.alert(
      "Delete event",
      "Are you sure you want to delete your event?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
        },
        {
          text: "Yes",
          onPress: async () => {
            console.log("Yes Pressed");
            setLoading(true);
            deleteEvent(userToken.UserAccessToken, eventID)
              .then(() => {
                setLoading(false);
                dispatch(setEventMap({ id: eventID, event: undefined }));
                dispatch(
                  updateUserNumericField({
                    id: userToken.UserID,
                    field: "NumEvents",
                    delta: -1,
                  })
                );
                navigation.goBack();
              })
              .catch((error: CustomError) => {
                if (error.showBugReportDialog) {
                  showBugReportPopup(error);
                } else {
                  showErrorAlert(error);
                }
                setLoading(false);
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  const onBackPressed = () => {
    navigation.goBack();
  };

  const onChatPressed = () => {
    navigation.push(SCREENS.EventChat, { eventID: eventID });
  };

  // For description expansion
  const descriptionOnExpand = useCallback((e) => {
    setLengthMoreText(e.nativeEvent.lines.length > 2); //to check the text is more than 4 lines or not
  }, []);

  //To toggle the show text or hide it
  const descriptionToggleNumberOfLines = () => {
    setDescriptionExpanded(!descriptionExpanded);
  };

  const pullData = async () => {
    var gotError = false;
    getEvent(eventID, userToken.UserAccessToken)
      .then((pulledEvent: Event) => {
        console.log("CURRENT EVENT JOINED CLICK: ", beforeLoadJoin.current);
        if (beforeLoadJoin.current === undefined) {
          // Join button has not been clicked. Do nothing
        } else if (beforeLoadJoin.current && !pulledEvent.UserJoin) {
          // User has clicked join in between when the event has been pulled, yet the user has not joined when the event has been pulled. Update counter
          pulledEvent.UserJoin = true;
          pulledEvent.NumJoins = pulledEvent.NumJoins + 1;
        } else if (!beforeLoadJoin.current && pulledEvent.UserJoin) {
          // User has unclicked join in between when the event has been pulled, yet the user has joined when the event has been pulled. Update counter
          pulledEvent.UserJoin = false;
          pulledEvent.NumJoins = pulledEvent.NumJoins - 1;
        }

        console.log(
          "CURRENT EVENT SHOUTOUT CLICK: ",
          beforeLoadShoutout.current
        );

        if (beforeLoadShoutout.current === undefined) {
          // Join button has not been clicked. Do nothing
        } else if (beforeLoadShoutout.current && !pulledEvent.UserShoutout) {
          // User has clicked shoutout in between when the event has been pulled, yet the user has not shouted out when the event has been pulled. Update counter
          pulledEvent.UserShoutout = true;
          pulledEvent.NumShoutouts = pulledEvent.NumShoutouts + 1;
        } else if (!beforeLoadShoutout.current && pulledEvent.UserShoutout) {
          // User has unclicked shoutout in between when the event has been pulled, yet the user has shouted out when the event has been pulled. Update counter
          pulledEvent.UserShoutout = false;
          pulledEvent.NumShoutouts = pulledEvent.NumShoutouts - 1;
        }

        console.log("BEFORE SYNCED EVENT\n\n", pulledEvent);
        console.log("STORED EVENT\n\n", storedEvent);
        if (
          beforeLoadShoutout.current === undefined &&
          beforeLoadJoin.current === undefined &&
          storedEvent &&
          !isRefreshing
        ) {
          // In case results differ by the time the user has pulled the event vs interacting with it from the home screen
          pulledEvent.UserJoin = storedEvent.UserJoin;
          pulledEvent.UserShoutout = storedEvent.UserShoutout;
          if (pulledEvent.UserJoin && pulledEvent.NumJoins <= 0) {
            pulledEvent.NumJoins = 1;
          } else if (pulledEvent.NumJoins < 0) {
            pulledEvent.NumJoins = 0;
          }
          if (pulledEvent.UserShoutout && pulledEvent.NumShoutouts <= 0) {
            pulledEvent.NumShoutouts = 1;
          } else if (pulledEvent.NumShoutouts < 0) {
            pulledEvent.NumShoutouts = 0;
          }
        }

        console.log("AFTER SYNCED EVENT\n\n", pulledEvent);
        dispatch(updateEventMap({ id: eventID, changes: pulledEvent }));
        if (!user || useRefRefreshing.current) {
          getEventHostByEventId(userToken.UserAccessToken, eventID)
            .then((pulledHost: User) => {
              setHost(pulledHost);
              dispatch(
                updateUserMap({ id: pulledHost.UserID, changes: pulledHost })
              );
            })
            .catch((error: CustomError) => {
              if (!gotError) {
                gotError = true;
                if (error.showBugReportDialog) {
                  showBugReportPopup(error);
                }
                showErrorAlert(error);
                setIsHost(false);
                setShowRetry(true);
              }
            })
            .finally(() => {
              setDidFetchHost(true);
            });
        } else {
          setHost(user);
          setDidFetchHost(true);
        }
      })
      .catch((error: CustomError) => {
        if (!gotError) {
          gotError = true;
          if (error.showBugReportDialog) {
            showBugReportPopup(error);
          }
          showErrorAlert(error);
          setIsHost(false);
          setShowRetry(true);
        }
      })
      .finally(() => {
        setDidFetchEvent(true);
      });
    getEventInterestsByEventId(eventID, userToken.UserAccessToken)
      .then((tags: Interest[]) => {
        dispatch(setEventInterestsMap({ id: eventID, interests: tags }));
      })
      .catch((error: CustomError) => {
        if (!gotError) {
          gotError = true;
          if (error.showBugReportDialog) {
            showBugReportPopup(error);
          }
          showErrorAlert(error);
          setIsHost(false);
          setShowRetry(true);
        }
      })
      .finally(() => {
        setDidFetchInterests(true);
      });
  };

  const onRefresh = async () => {
    beforeLoadJoin.current = undefined;
    beforeLoadShoutout.current = undefined;
    useRefRefreshing.current = true;
    setHost(undefined);
    setShowRetry(false);
    setDidFetchHost(false);
    setDidFetchInterests(false);
    setDidFetchEvent(false);
    dispatch(setEventInterestsMap({ id: eventID, interests: undefined }));
    pullData();
  };

  useEffect(() => {
    pullData();
  }, []);

  useEffect(() => {
    if (didFetchEvent && didFetchInterests) {
      setIsRefreshing(false);
      useRefRefreshing.current = false;
    }
  }, [didFetchEvent, didFetchInterests]);

  useEffect(() => {
    console.log("going into host use effect");
    if (!host) {
      setIsHost(false);
      return;
    }
    console.log("Host UserID is " + host.UserID);
    console.log("Current user UserID is " + userToken.UserID);
    setIsHost(host.UserID == userToken.UserID || isAdmin);
  }, [host]);

  return (
    <View style={styles.container}>
      <EventPreviewer
        event={storedEvent}
        interests={storedInterests}
        host={user}
        backButtonEnabled={true}
        hostClickEnabled={true}
        paddingTopEnabled={true}
        userControlElement={
          <View
            style={{
              ...styles.userControlContainer,
              bottom: insets.bottom + 10,
            }}
          >
            <UserOptionsSection>
              {!showRetry ? (
                !storedEvent ? (
                  <ActivityIndicator
                    color={COLORS.white}
                  />
                ) : (
                  <>
                    <View
                      style={{
                        alignItems: "center",
                        paddingHorizontal: 20,
                      }}
                    >
                      <GradientButton
                        style={{
                          width: 58,
                          height: 58,
                          borderRadius: 80,
                          marginBottom: 5,
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            width: 58,
                            height: 58,
                            borderRadius: 80,
                            marginBottom: 5,
                            backgroundColor: storedEvent?.UserJoin
                              ? "transparent"
                              : COLORS.white,
                            // borderWidth: StyleSheet.hairlineWidth,
                            // borderColor: COLORS.white,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onPress={
                            storedEvent?.UserJoin
                              ? () => {
                                  if (!didFetchEvent) {
                                    beforeLoadJoin.current = false;
                                  }
                                  removeUserJoin(eventID);
                                }
                              : () => {
                                  if (!didFetchEvent) {
                                    beforeLoadJoin.current = true;
                                  }
                                  if(storedEvent?.SignupLink){
                                    Alert.alert("This is a ticketed event", "Make sure to click the ticket button to confirm your signup!")
                                  }
                                  addUserJoin(eventID);
                                }
                          }
                        >
                          {storedEvent?.UserJoin ? (
                            <Ionicons
                              name="checkmark-sharp"
                              size={38}
                              color="white"
                            />
                          ) : (
                            <Ionicons
                              name="checkmark-outline"
                              size={38}
                              color="black"
                            />
                          )}
                        </TouchableOpacity>
                      </GradientButton>
                      <McText
                        body6
                        style={{
                          color: storedEvent?.UserJoin
                            ? COLORS.darkPurple
                            : COLORS.white,
                        }}
                      >
                        {truncateNumber(storedEvent?.NumJoins)} Going
                      </McText>
                    </View>
                    {storedEvent?.SignupLink && (
                      <View
                        style={{
                          alignItems: "center",
                          paddingHorizontal: 10,
                        }}
                      >
                        <View
                          style={{
                            width: 58,
                            height: 58,
                            borderRadius: 80,
                            marginBottom: 5,
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              width: 58,
                              height: 58,
                              borderRadius: 80,
                              marginBottom: 5,
                              backgroundColor: COLORS.gray1,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                            onPress={() => {
                              onTicketPressed();
                            }}
                          >
                            <Entypo name="ticket" size={35} color="white" />
                          </TouchableOpacity>
                        </View>
                        <McText
                          body6
                          style={{
                            color: COLORS.white,
                          }}
                        >
                          Tickets
                        </McText>
                      </View>
                    )}
                    <View
                      style={{
                        alignItems: "center",
                        paddingHorizontal: 20,
                        shadowColor: "#B66DFF",
                        shadowRadius: 10,
                        // shadowOpacity: eventIDToDidShoutout[eventID] ? 1 : 0,
                        // shadowOffset: { width: 0, height: 0 },
                      }}
                    >
                      <GradientButton
                        style={{
                          width: 58,
                          height: 58,
                          borderRadius: 80,
                          marginBottom: 5,
                        }}
                      >
                        <TouchableOpacity
                          style={{
                            width: 58,
                            height: 58,
                            borderRadius: 80,
                            backgroundColor: storedEvent?.UserShoutout
                              ? "transparent"
                              : COLORS.white,
                            // borderWidth: StyleSheet.hairlineWidth,
                            // borderColor: COLORS.white,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                          onPress={
                            storedEvent?.UserShoutout
                              ? () => {
                                  if (!didFetchEvent) {
                                    beforeLoadShoutout.current = false;
                                  }
                                  removeUserShoutout(eventID);
                                }
                              : () => {
                                  if (!didFetchEvent) {
                                    beforeLoadShoutout.current = true;
                                  }
                                  addUserShoutout(eventID);
                                }
                          }
                        >
                          {storedEvent?.UserShoutout ? (
                            <AntDesign name="retweet" size={32} color="white" />
                          ) : (
                            <AntDesign name="retweet" size={32} color="black" />
                          )}
                        </TouchableOpacity>
                      </GradientButton>
                      <McText
                        body6
                        style={{
                          color: storedEvent?.UserShoutout
                            ? COLORS.darkPurple
                            : COLORS.white,
                        }}
                      >
                        {truncateNumber(storedEvent?.NumShoutouts)}{" "}
                        {storedEvent?.NumShoutouts === 1 ? "Repost" : "Reposts"}
                      </McText>
                    </View>
                  </>
                )
              ) : (
                <RetryButton
                  setShowRetry={setShowRetry}
                  retryCallBack={onRefresh}
                />
              )}
            </UserOptionsSection>
          </View>
        }
        refreshControl={
          <RefreshControl
            tintColor={COLORS.white}
            refreshing={isRefreshing}
            onRefresh={() => {
              setIsRefreshing(true);
              onRefresh();
            }}
          />
        }
        showModeratorFeatures={isHost}
      />
    </View>
  );
};

export default EventDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.trueBlack,
  },
  scrollcontainer: {
    marginLeft: 20,
    marginRight: 20,
  },
  userControlContainer: {
    flex: 1,
    position: "absolute",
    left: 10,
    right: 10,
    height: 110,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(100,100,100,.95)",
    backgroundColor: "rgba(40,40,40,.95)",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 8,
  },
  hostProfilePic: {
    height: 35,
    width: 35,
    borderRadius: 30,
    marginRight: 10,
    borderWidth: 0.2,
    borderColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  edit: {
    backgroundColor: COLORS.gray2,
    width: 120,
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    height: 35,
    marginRight: 10,
    justifyContent: "center",
  },
  delete: {
    backgroundColor: COLORS.red,
    width: 140,
    padding: 8,
    borderRadius: 5,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  },
});

const ImageHeaderSection = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
  margin-left: 30px;
  margin-right: 30px;
`;
const ImageFooterSection = styled.View`
  flex: 1;
  justify-content: flex-end;
  position: relative;
  width: 100%;
`;

const FooterContentView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-horizontal: 20px;
`;

const TitleSection = styled.View`
  margin: 0px 0px 0px 0px;
  flex-direction: row;
`;

const InterestSection = styled.View`
  margin: 15px 0px 10px 0px;
  flex-direction: row;
`;

const HostSection = styled.View`
  flex-direction: row;
  margin: 10px 0px 0px 0px;
`;

const DescriptionSection = styled.View`
  border-radius: 5px;
  margin: 5px 0px 0px 0px;
  opacity: 1;
`;

// top right bottom left
const LocationSection = styled.View`
  flex-direction: row;
  margin: 10px 20px 5px 0px;
  border-radius: 10px;
  align-items: center;
`;

const VisibilitySection = styled.View`
  flex-direction: row;
  margin: 5px 20px 10px 0px;
  border-radius: 10px;
  align-items: center;
`;

const EditOrDeleteEventSection = styled.View`
  flex-direction: row;
  margin: 10px 0px 0px 0px;
  border-radius: 10px;
  align-items: center;
`;

const SectionFooter = styled.View`
  background-color: transparent;
  justify-content: space-between;
`;

const UserOptionsSection = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
