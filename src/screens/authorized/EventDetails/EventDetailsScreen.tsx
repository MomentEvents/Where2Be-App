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
  displayError,
  formatError,
  showBugReportPopup,
} from "../../../helpers/helpers";
import { EventContext } from "../../../contexts/EventContext";
import { deleteEvent, getEvent } from "../../../services/EventService";
import { getEventInterestsByEventId } from "../../../services/InterestService";
import GradientButton from "../../../components/Styled/GradientButton";
import { useNavigation } from "@react-navigation/native";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Hyperlink from "react-native-hyperlink";
import RetryButton from "../../../components/RetryButton";
import { CustomError } from "../../../constants/error";

type routeParametersType = {
  eventID: string;
};

const EventDetailsScreen = ({ route }) => {
  const { userToken, isAdmin, userIDToUser, updateUserIDToUser } =
    useContext(UserContext);
  const navigation = useNavigation<any>();

  // Props from previous event card to update
  const propsFromEventCard: routeParametersType = route.params;
  const { eventID } = propsFromEventCard;

  // Loading context in case we want to disable the screen
  const { setLoading } = useContext(ScreenContext);

  const {
    eventIDToEvent,
    updateEventIDToEvent,
    eventIDToInterests,
    updateEventIDToInterests,
    clientAddUserJoin: addUserJoin,
    clientAddUserShoutout: addUserShoutout,
    clientRemoveUserJoin: removeUserJoin,
    clientRemoveUserShoutout: removeUserShoutout,
  } = useContext(EventContext);

  if (!eventID) {
    throw formatError(
      "Error",
      "eventID was null or undefined when entering event details"
    );
  }

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

  const onHostPressed = () => {
    if (host && userIDToUser[host.UserID]) {
      navigation.push(SCREENS.ProfileDetails, {
        userID: host.UserID,
      });
    }
  };

  const onEditEventPressed = () => {
    if (!eventIDToEvent[eventID]) {
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
                updateEventIDToEvent({ id: eventID, event: undefined });
                updateUserIDToUser({
                  id: userToken.UserID,
                  user: {
                    ...userIDToUser[userToken.UserID],
                    NumEvents: userIDToUser[userToken.UserID].NumEvents - 1,
                  },
                });
                navigation.goBack();
              })
              .catch((error: CustomError) => {
                if (error.showBugReportDialog) {
                  showBugReportPopup(error);
                } else {
                  displayError(error);
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
        updateEventIDToEvent({ id: eventID, event: pulledEvent });
        if (!userIDToUser[pulledEvent.HostUserID] || useRefRefreshing.current) {
          getEventHostByEventId(userToken.UserAccessToken, eventID)
            .then((pulledHost: User) => {
              setHost(pulledHost);
              updateUserIDToUser({ id: pulledHost.UserID, user: pulledHost });
            })
            .catch((error: CustomError) => {
              if (!gotError) {
                gotError = true;
                if (error.showBugReportDialog) {
                  showBugReportPopup(error);
                } else if (error.shouldDisplay) {
                  displayError(error);
                }
                setShowRetry(true);
              }
            })
            .finally(() => {
              setDidFetchHost(true);
            });
        } else {
          setHost(userIDToUser[pulledEvent.HostUserID]);
          setDidFetchHost(true);
        }
      })
      .catch((error: CustomError) => {
        if (!gotError) {
          gotError = true;
          if (error.showBugReportDialog) {
            showBugReportPopup(error);
          } else if (error.shouldDisplay) {
            displayError(error);
          }
          setShowRetry(true);
        }
      })
      .finally(() => {
        setDidFetchEvent(true);
      });
    getEventInterestsByEventId(eventID, userToken.UserAccessToken)
      .then((tags: Interest[]) => {
        updateEventIDToInterests({ id: eventID, interests: tags });
      })
      .catch((error: CustomError) => {
        if (!gotError) {
          gotError = true;
          if (error.showBugReportDialog) {
            showBugReportPopup(error);
          } else if (error.shouldDisplay) {
            displayError(error);
          }
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
    updateEventIDToInterests({ id: eventID, interests: undefined });
    pullData();
  };

  useEffect(() => {
    if (eventIDToEvent[eventID]) {
      setHost(userIDToUser[eventIDToEvent[eventID].HostUserID]);
    }
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
      <ImageView
        images={[
          {
            uri:
              eventIDToEvent[eventID] === undefined
                ? null
                : eventIDToEvent[eventID].Picture,
          },
        ]}
        imageIndex={0}
        visible={imageViewVisible}
        backgroundColor="#101010"
        onRequestClose={() => setImageViewVisible(false)}
      />
      <View style={{ height: "100%", position: "relative" }}>
        <ScrollView
          contentContainerStyle={{
            backgroundColor: "transparent",
          }}
          style={{
            backgroundColor: "transparent",
          }}
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
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity onPress={() => setImageViewVisible(true)}>
            <ImageBackground
              resizeMode="cover"
              source={{
                uri:
                  eventIDToEvent[eventID] === undefined
                    ? null
                    : eventIDToEvent[eventID].Picture,
              }}
              style={{
                width: "100%",
                height: SIZES.height * 0.45,
              }}
            >
              <View
                style={{
                  flex: 1,
                  marginTop: insets.top,
                }}
              >
                <ImageHeaderSection>
                  <TouchableOpacity
                    onPress={() => {
                      onBackPressed();
                    }}
                    style={{
                      width: 56,
                      height: 40,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 13,
                    }}
                  >
                    <Feather name="arrow-left" size={28} color="white" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setImageViewVisible(true);
                    }}
                    style={{
                      height: 40,
                      width: 40,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 13,
                    }}
                  >
                    <MaterialCommunityIcons
                      name="arrow-expand"
                      size={23}
                      color="white"
                    />
                  </TouchableOpacity>
                </ImageHeaderSection>
                <ImageFooterSection>
                  <LinearGradient
                    colors={["transparent", COLORS.black]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={{
                      width: "100%",
                      height: 120,
                      justifyContent: "flex-end",
                    }}
                  >
                    <FooterContentView>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <icons.calendar_eventdetails
                          style={{ marginRight: 8 }}
                        />
                        <McText
                          h5
                          style={{
                            letterSpacing: 0.1,
                            color: COLORS.lightGray,
                          }}
                        >
                          {eventIDToEvent[eventID] === undefined
                            ? null
                            : moment(
                                eventIDToEvent[eventID].StartDateTime
                              ).format("MMM DD[,] YYYY")}
                        </McText>
                        <View
                          style={{
                            position: "absolute",
                            right: 0,
                            flexDirection: "row",
                          }}
                        >
                          <icons.time_eventdetails style={{ marginRight: 8 }} />
                          <McText
                            h5
                            style={{
                              letterSpacing: 0.1,
                              color: COLORS.lightGray,
                            }}
                          >
                            {eventIDToEvent[eventID] === undefined
                              ? null
                              : eventIDToEvent[eventID].EndDateTime
                              ? moment(
                                  eventIDToEvent[eventID].StartDateTime
                                ).format("h:mm a") +
                                " - " +
                                moment(
                                  eventIDToEvent[eventID].EndDateTime
                                ).format("h:mm a")
                              : moment(
                                  eventIDToEvent[eventID].StartDateTime
                                ).format("h:mm a")}
                          </McText>
                        </View>
                      </View>
                    </FooterContentView>
                  </LinearGradient>
                </ImageFooterSection>
              </View>
            </ImageBackground>
          </TouchableOpacity>
          <View style={styles.scrollcontainer}>
            <TitleSection>
              <View style={{ flex: 1 }}>
                <McText
                  h1
                  style={{
                    marginTop: 10,
                    marginRight: 10,
                  }}
                >
                  {eventIDToEvent[eventID] === undefined
                    ? null
                    : eventIDToEvent[eventID].Title}
                </McText>
              </View>
              <TouchableOpacity
                style={{
                  padding: 10,
                  flexDirection: "row",
                  borderRadius: 5,
                  alignSelf: "flex-start",
                  marginTop: 20,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: COLORS.purple,
                }}
                onPress={onChatPressed}
              >
                <Ionicons
                  style={{ marginRight: 10 }}
                  name="chatbox"
                  size={20}
                  color="white"
                />
                <McText h5 color={COLORS.white}>
                  Chat
                </McText>
              </TouchableOpacity>
            </TitleSection>
            <InterestSection>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                {eventIDToInterests[eventID]
                  ? eventIDToInterests[eventID].map((taglist) => (
                      <View
                        key={taglist.InterestID}
                        style={{
                          borderRadius: 5,
                          paddingVertical: 5,
                          paddingHorizontal: 15,
                          marginRight: 10,
                          backgroundColor: COLORS.input,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <McText
                          h4
                          color={COLORS.lightGray}
                          style={{ letterSpacing: 0.8 }}
                        >
                          {taglist === undefined ? null : taglist.Name}
                        </McText>
                      </View>
                    ))
                  : null}
              </ScrollView>
            </InterestSection>

            <HostSection>
              <TouchableOpacity
                style={{
                  maxWidth: "80%",
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => {
                  onHostPressed();
                }}
              >
                <Image
                  style={styles.hostProfilePic}
                  source={{
                    uri:
                      host && userIDToUser[host.UserID]
                        ? userIDToUser[host.UserID].Picture
                        : null,
                  }}
                ></Image>
                <McText
                  h4
                  numberOfLines={1}
                  style={{
                    letterSpacing: 1,
                    color: COLORS.white,
                  }}
                >
                  {host && userIDToUser[host.UserID]
                    ? userIDToUser[host.UserID].DisplayName
                    : "..."}
                </McText>
                {host &&
                  userIDToUser[host.UserID] &&
                  userIDToUser[host.UserID].VerifiedOrganization && (
                    <View style={{ paddingLeft: 3 }}>
                      <MaterialIcons
                        name="verified"
                        size={18}
                        color={COLORS.purple}
                      />
                    </View>
                  )}
              </TouchableOpacity>
            </HostSection>
            <View>
              <DescriptionSection>
                <View
                  style={{
                    marginBottom: 8,
                    marginTop: 8,
                    marginRight: 12,
                    marginLeft: 12,
                  }}
                >
                  <Hyperlink
                    linkDefault={true}
                    linkStyle={{ textDecorationLine: "underline" }}
                  >
                    <McText
                      onTextLayout={descriptionOnExpand}
                      numberOfLines={descriptionExpanded ? undefined : 3}
                      body3
                      style={{
                        letterSpacing: 0.7,
                        color: COLORS.lightGray,
                      }}
                      selectable={true}
                    >
                      {eventIDToEvent[eventID] === undefined
                        ? null
                        : eventIDToEvent[eventID].Description}
                    </McText>
                  </Hyperlink>

                  {lengthMoreText ? (
                    <McText
                      body4
                      onPress={descriptionToggleNumberOfLines}
                      style={{
                        lineHeight: 22,
                        marginTop: 10,
                        color: COLORS.gray,
                        letterSpacing: 0.3,
                      }}
                    >
                      {descriptionExpanded ? "Read less..." : "Read more..."}
                    </McText>
                  ) : null}
                </View>
              </DescriptionSection>
              <LocationSection>
                <Ionicons
                  name="location-outline"
                  size={16}
                  style={{ marginHorizontal: 8 }}
                  color={COLORS.lightGray}
                />
                <McText
                  h5
                  style={{
                    letterSpacing: 0.5,
                    marginTop: -1,
                    color: COLORS.lightGray,
                  }}
                >
                  {eventIDToEvent[eventID] === undefined
                    ? null
                    : eventIDToEvent[eventID].Location}
                </McText>
              </LocationSection>
              <VisibilitySection>
                <MaterialCommunityIcons
                  name="map-search"
                  size={16}
                  style={{ marginHorizontal: 8 }}
                  color={COLORS.lightGray}
                />
                <View>
                  <McText
                    body5
                    numberOfLines={1}
                    style={{
                      letterSpacing: 1,
                      color: COLORS.lightGray,
                    }}
                  >
                    {eventIDToEvent[eventID] === undefined
                      ? null
                      : eventIDToEvent[eventID].Visibility}
                  </McText>
                </View>
              </VisibilitySection>
            </View>
            {isHost &&
              eventIDToInterests[eventID] &&
              eventIDToEvent[eventID] && (
                <>
                  <EditOrDeleteEventSection>
                    <TouchableOpacity
                      style={styles.edit}
                      onPress={() => {
                        onEditEventPressed();
                      }}
                    >
                      <McText h5>Edit this Event</McText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.delete}
                      onPress={() => {
                        onDeleteEventPressed();
                      }}
                    >
                      <McText h5>Delete this Event</McText>
                    </TouchableOpacity>
                  </EditOrDeleteEventSection>
                </>
              )}
            <SectionFooter>
              <View
                style={{
                  height: 170 + insets.bottom,
                }}
              ></View>
            </SectionFooter>
          </View>
        </ScrollView>
        <View
          style={{ ...styles.userControlContainer, bottom: insets.bottom + 10 }}
        >
          {eventIDToEvent[eventID] ? (
            <UserOptionsSection>
              {showRetry ? (
                <RetryButton
                  setShowRetry={setShowRetry}
                  retryCallBack={onRefresh}
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
                          backgroundColor: eventIDToEvent[eventID].UserJoin
                            ? "transparent"
                            : COLORS.white,
                          // borderWidth: StyleSheet.hairlineWidth,
                          // borderColor: COLORS.white,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onPress={
                          eventIDToEvent[eventID].UserJoin
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
                                addUserJoin(eventID);
                              }
                        }
                      >
                        {eventIDToEvent[eventID].UserJoin ? (
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
                      body2
                      style={{
                        color: eventIDToEvent[eventID].UserJoin
                          ? COLORS.darkPurple
                          : COLORS.white,
                      }}
                    >
                      {eventIDToEvent[eventID].NumJoins}
                    </McText>
                  </View>
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
                          backgroundColor: eventIDToEvent[eventID].UserShoutout
                            ? "transparent"
                            : COLORS.white,
                          // borderWidth: StyleSheet.hairlineWidth,
                          // borderColor: COLORS.white,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onPress={
                          eventIDToEvent[eventID].UserShoutout
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
                        {eventIDToEvent[eventID].UserShoutout ? (
                          <Ionicons
                            name="ios-megaphone"
                            size={32}
                            color="white"
                          />
                        ) : (
                          <Ionicons
                            name="ios-megaphone-outline"
                            size={32}
                            color="black"
                          />
                        )}
                      </TouchableOpacity>
                    </GradientButton>
                    <McText
                      body2
                      style={{
                        color: eventIDToEvent[eventID].UserShoutout
                          ? COLORS.darkPurple
                          : COLORS.white,
                      }}
                    >
                      {eventIDToEvent[eventID].NumShoutouts}
                    </McText>
                  </View>
                </>
              )}
            </UserOptionsSection>
          ) : (
            <ActivityIndicator color={COLORS.white} style={{ marginTop: 20 }} />
          )}
        </View>
      </View>
    </View>
  );
};

export default EventDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
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
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
  edit: {
    backgroundColor: COLORS.purple,
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
  margin: 5px 0px 10px 10px;
`;

const DescriptionSection = styled.View`
  background-color: ${COLORS.input};
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
  margin: 5px 20px 5px 0px;
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
