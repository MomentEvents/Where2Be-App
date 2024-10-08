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
import { ScreenContext } from "../../contexts/ScreenContext";
import { COLORS, SCREENS, SIZES, icons } from "../../constants";
import { Event, Token } from "../../constants/types";
import { User } from "../../constants/types";
import { Interest } from "../../constants/types";
import { LinearGradient } from "expo-linear-gradient";
import { McText } from "../../components/Styled";
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
} from "../../services/UserService";
import { UserContext } from "../../contexts/UserContext";
import {
  formatError,
  openURL,
  showBugReportPopup,
  showCancelablePopup,
  truncateNumber,
} from "../../helpers/helpers";
import { EventContext } from "../../contexts/EventContext";
import { deleteEvent, getEvent } from "../../services/EventService";
import { getEventInterestsByEventId } from "../../services/InterestService";
import GradientButton from "../../components/Styled/GradientButton";
import {
  AntDesign,
  Entypo,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Hyperlink from "react-native-hyperlink";
import RetryButton from "../../components/RetryButton";
import { CustomError } from "../../constants/error";
import { AlertContext } from "../../contexts/AlertContext";
import EventPreviewer from "../../components/EventPreviewer/EventPreviewer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { selectUserByID } from "../../redux/users/userSelectors";
import {
  updateUserMap,
  updateUserNumericField,
} from "../../redux/users/userSlice";
import {
  selectEventByID,
  selectEventInterestsByID,
} from "../../redux/events/eventSelectors";
import {
  setEventInterestsMap,
  setEventMap,
  updateEventInterestsMap,
  updateEventMap,
} from "../../redux/events/eventSlice";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import analytics from "@react-native-firebase/analytics";
import { SETTINGS } from "../../constants/settings";

type EventDetailsProps = {
  eventID: string;
  currentToken: Token;
  onBackFunction?: () => void;
  disableHostClick?: boolean;
};

const EventDetails = (props: EventDetailsProps) => {
  const { isAdmin, isLoggedIn } = useContext(UserContext);
  const { signupActionEventID } = useContext(ScreenContext);
  const eventID = props.eventID;

  // Loading context in case we want to disable the screen
  const { setLoading } = useContext(ScreenContext);

  const navigation = useNavigation<any>();

  const promptLogin = () => {
    if (!isLoggedIn) {
      signupActionEventID.current = eventID;
      navigation.navigate(SCREENS.Onboarding.SignupWelcomeScreen);
    }
  };

  console.log(
    "CURRENT TOKEN THAT WENT INTO EVENTDETAILS IS ",
    props.currentToken
  );
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

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const useRefRefreshing = useRef(false);

  const [didFetchEvent, setDidFetchEvent] = useState<boolean>(false);
  const [didFetchInterests, setDidFetchInterests] = useState<boolean>(false);

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

  const checkTicketJoin = () => {
    console.log("IT IS ACTIVE");
    console.log(didClickTicketRef.current + "DIDCLICKTICKETREF");
    console.log(JSON.stringify(storedEvent));
    if (didClickTicketRef.current && storedEvent && !storedEvent.UserJoin) {
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
              addUserJoin(eventID, undefined, props.currentToken);
            },
          },
        ],
        { cancelable: false }
      );
    }
    didClickTicketRef.current = false;
  };

  const onTicketPressed = async () => {
    if (!props.currentToken) {
      promptLogin();
      return;
    }
    if (storedEvent?.SignupLink) {
      didClickTicketRef.current = true;
      console.log(
        "Setting didClickTicketRef to be ",
        didClickTicketRef.current
      );
      await openURL(storedEvent.SignupLink);
      checkTicketJoin();
    }
  };

  const pullData = async () => {
    var gotError = false;
    getEvent(eventID, props.currentToken?.UserAccessToken)
      .then((pulledEvent: Event) => {
        const beforeModifiedEvent = pulledEvent;
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

        if (!useRefRefreshing.current) {
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
        }

        dispatch(updateEventMap({ id: eventID, changes: pulledEvent }));

        if (!user || useRefRefreshing.current) {
          getEventHostByEventId(props.currentToken?.UserAccessToken, eventID)
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
            .finally(() => {});
        } else {
          setHost(user);
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
    getEventInterestsByEventId(eventID, props.currentToken?.UserAccessToken)
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
    setDidFetchInterests(false);
    setDidFetchEvent(false);
    dispatch(setEventInterestsMap({ id: eventID, interests: undefined }));
    pullData();
  };

  useEffect(() => {
    pullData();
    if (SETTINGS.firebaseAnalytics) {
      analytics()
        .logEvent("EventDetailsView", {
          eventID: eventID,
          userID: props.currentToken.UserID,
        })
        .then(() => {
          console.log("Logged EventDetailsView for " + eventID);
        });
    }
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
    setIsHost(host.UserID == props.currentToken?.UserID || isAdmin);
  }, [host]);

  return (
    <View style={styles.container}>
      <EventPreviewer
        event={storedEvent}
        interests={storedInterests}
        host={user}
        backButtonEnabled={true}
        hostClickEnabled={!props.disableHostClick}
        backButtonFunction={props.onBackFunction}
        paddingTopEnabled={true}
        showShareButton={true}
        hostClickFunction={props.currentToken ? undefined : promptLogin}
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
                  <ActivityIndicator color={COLORS.white} />
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
                                  if (!props.currentToken) {
                                    promptLogin();
                                    return;
                                  }
                                  if (!didFetchEvent) {
                                    beforeLoadJoin.current = false;
                                  }
                                  removeUserJoin(eventID, props.currentToken);
                                }
                              : () => {
                                  if (!props.currentToken) {
                                    promptLogin();
                                    return;
                                  }
                                  if (!didFetchEvent) {
                                    beforeLoadJoin.current = true;
                                  }
                                  if (storedEvent?.SignupLink) {
                                    Alert.alert(
                                      "This is a ticketed event",
                                      "Make sure to click the ticket button to confirm your signup!"
                                    );
                                  }
                                  addUserJoin(
                                    eventID,
                                    undefined,
                                    props.currentToken
                                  );
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
                                  if (!props.currentToken) {
                                    promptLogin();
                                    return;
                                  }
                                  if (!didFetchEvent) {
                                    beforeLoadShoutout.current = false;
                                  }
                                  removeUserShoutout(
                                    eventID,
                                    props.currentToken
                                  );
                                }
                              : () => {
                                  if (!props.currentToken) {
                                    promptLogin();
                                    return;
                                  }
                                  if (!didFetchEvent) {
                                    beforeLoadShoutout.current = true;
                                  }
                                  addUserShoutout(eventID, props.currentToken);
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

export default EventDetails;

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

const UserOptionsSection = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
