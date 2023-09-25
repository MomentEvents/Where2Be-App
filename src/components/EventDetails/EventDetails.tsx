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
  Text,
  Modal
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
import { Event, Token, UserPrefilledForm } from "../../constants/types";
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
  getUserPrefilledForm,
  updateUserPrefilledForm,
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
import { McTextInput } from "../Styled/styled";
import { CUSTOMFONT_REGULAR } from "../../constants/theme";
import { CONSTRAINTS } from "../../constants/constraints";

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


  const [isFormVisible, setFormVisible] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [major, setMajor] = useState("");
  const [year, setYear] = useState("");
  const [saveFormInfo, setSaveFormInfo] = useState(true);
  const [isFormInvalid, setIsFormInvalid] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");

  const [userPrefilledForm, setUserPrefilledForm] = useState<UserPrefilledForm>(undefined);
  
  const onGoingPressed = () => {
    getUserPrefilledForm(props.currentToken.UserAccessToken, props.currentToken.UserID)
      .then((pulledUserPrefilledForm: UserPrefilledForm) => {
        setUserPrefilledForm(pulledUserPrefilledForm)
        setName(pulledUserPrefilledForm.Name);
        setEmail(pulledUserPrefilledForm.Email);
        setPhoneNumber(pulledUserPrefilledForm.PhoneNumber);
        setMajor(pulledUserPrefilledForm.Major);
        setYear(pulledUserPrefilledForm.Year);
        setFormVisible(true);
      })
  }

  const emailPattern = /^[^@]+@[^@]+$/;
  const phoneNumberPattern = /\(\d{3}\) \d{3}-\d{4}/;

  const joinEvent = () => {
    if (name.trim() == "" || email.trim() == "" || phoneNumber.trim() == "" || major.trim() == "" || year.trim() == ""){
      setIsFormInvalid(true);
      setFormErrorMessage("Please enter all fields");
    } else if (!emailPattern.test(email)) {
      setIsFormInvalid(true);
      setFormErrorMessage("Invalid email");
    } else if (!phoneNumberPattern.test(phoneNumber)) {
      setIsFormInvalid(true);
      setFormErrorMessage("Invalid phone number");
    } else {
      if (saveFormInfo && (userPrefilledForm.Name != name || userPrefilledForm.Email != email || userPrefilledForm.PhoneNumber != phoneNumber || userPrefilledForm.Major != major || userPrefilledForm.Year != year)) {
        const newUserPrefilledForm: UserPrefilledForm = {
          UserID: props.currentToken.UserID,
          Name: name,
          Email: email,
          PhoneNumber: phoneNumber,
          Major: major,
          Year: year,
        };
        updateUserPrefilledForm(newUserPrefilledForm);
      }
      addUserJoin(
        eventID,
        name,
        email,
        phoneNumber,
        major,
        year,
        undefined,
        props.currentToken
      );
      setFormVisible(false);
    }
  }

  useEffect(() => {
    setIsFormInvalid(false);
  }, [name, email, phoneNumber, major, year]);

  const formatPhoneNumber = (value: string) => {
    if (value.length <= 14){
      const numericValue = value.replace(/[^0-9]/g, '');

      let formattedValue = '';

      if (numericValue.length >= 1) {
        formattedValue = `(${numericValue}`;
      }

      if (numericValue.length >= 4) {
        formattedValue = `(${numericValue.slice(0, 3)}) ${numericValue.slice(3)}`;
      }

      if (numericValue.length >= 7) {
        formattedValue = `(${numericValue.slice(0, 3)}) ${numericValue.slice(3, 6)}-${numericValue.slice(6)}`;
      }

      setPhoneNumber(formattedValue);
    }
  };

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
              addUserJoin(eventID, "", "", "", "", "", undefined, props.currentToken);
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
                                  onGoingPressed();
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
    {isFormVisible && (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFormVisible}
        onRequestClose={() => {
          setFormVisible(!isFormVisible);
        }}
      >
        <TouchableOpacity
          style={styles.centeredView}
          activeOpacity={1}
        >
          <View style={styles.formContainer}>
            <TouchableOpacity
              style={{position: 'absolute', right: 10, top: 10 }}
              onPress={() => setFormVisible(false)}
            >
              <Ionicons name="close" size={26} color="white" />
            </TouchableOpacity>
            <ScrollView
              style={{width: '100%', paddingRight: 10, marginTop: 20, marginBottom: 15}}
              showsVerticalScrollIndicator={true}
              showsHorizontalScrollIndicator={true}
              indicatorStyle={'white'}
            >
            <View style={styles.titleContainer}>
              <Ionicons name="person-outline" size={24} color="white" style={styles.iconsContainer}/>
              <McText h3>Name</McText>
            </View>
            <McTextInput
              placeholder={"Enter name"}
              placeholderTextColor={COLORS.white}
              style={styles.textInputContainer}
              value={name}
              onChangeText={setName}
              multiline={true}
              maxLength={CONSTRAINTS.Event.Title.Max}
            />
            <View style={styles.titleContainer}>
              <MaterialCommunityIcons name="email-outline" size={24} color="white" style={styles.iconsContainer}/>
              <McText h3>Email</McText>
            </View>
            <McTextInput
              placeholder={"Enter email"}
              placeholderTextColor={COLORS.white}
              style={styles.textInputContainer}
              value={email}
              onChangeText={setEmail}
              multiline={true}
              maxLength={CONSTRAINTS.Event.Title.Max}
            />
            <View style={styles.titleContainer}>
              <Feather name="smartphone" size={24} color="white" style={styles.iconsContainer}/>
              <McText h3>Phone number</McText>
            </View>
            <McTextInput
              placeholder={"Enter phone number"}
              placeholderTextColor={COLORS.white}
              style={styles.textInputContainer}
              value={phoneNumber}
              onChangeText={formatPhoneNumber}
              multiline={true}
              maxLength={CONSTRAINTS.Event.Title.Max}
            />
            <View style={styles.titleContainer}>
              <Ionicons name="book-outline" size={24} color="white" style={styles.iconsContainer}/>
              <McText h3>Major</McText>
            </View>
            <McTextInput
              placeholder={"Enter major"}
              placeholderTextColor={COLORS.white}
              style={styles.textInputContainer}
              value={major}
              onChangeText={setMajor}
              multiline={true}
              maxLength={CONSTRAINTS.Event.Title.Max}
            />
            <View style={styles.titleContainer}>
              <Ionicons name="school-outline" size={24} color="white" style={styles.iconsContainer}/>
              <McText h3>Year</McText>
            </View>
            <McTextInput
              placeholder={"Enter year"}
              placeholderTextColor={COLORS.white}
              style={styles.textInputContainer}
              value={year}
              onChangeText={setYear}
              multiline={true}
              maxLength={CONSTRAINTS.Event.Title.Max}
            />
            </ScrollView>

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                onPress={() =>
                  setSaveFormInfo((save) => {
                    return !save;
                  })
                }
                style={{
                  borderRadius: 5,
                  marginLeft: 3,
                  backgroundColor: saveFormInfo
                    ? COLORS.purple
                    : COLORS.gray2,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name={"checkmark-sharp"}
                  size={22}
                  color={saveFormInfo ? COLORS.white : COLORS.gray2}
                />
              </TouchableOpacity>
              <McText h3 style={{ marginLeft: 10 }}>
                {"Save for future events"}
              </McText>
            </View>
            <TouchableOpacity
              style={{
                paddingHorizontal: 20,
                paddingVertical: 5,
                borderRadius: 20,
                backgroundColor: 'white'
              }}
              onPress={joinEvent}
            >
              <McText h3 style={{color: "rgba(40,40,40,.95)"}}>
                {"Join"}
              </McText>
            </TouchableOpacity>
            {
              isFormInvalid && 
              <McText h3 style={{color: 'red', marginTop: 10,}}>
                {formErrorMessage}
              </McText>
            }
          </View>
        </TouchableOpacity>
      </Modal>
    )}
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,.8)", // This will make background a bit dark for better visibility of popup
  },
  formContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: '80%',
    maxHeight: '60%',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 10,
    backgroundColor: "rgba(40,40,40,.95)",
    elevation: 5,
  },
  titleContainer: {
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    width: '100%',
  },
  textInputContainer: {
    borderColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    fontFamily: CUSTOMFONT_REGULAR,
    fontSize: 16,
    color: COLORS.white,
    paddingBottom: 10,
    paddingTop: 10,
    width: '100%',
  },
  iconsContainer: {
    marginRight: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: '100%'
  },
});

const UserOptionsSection = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;