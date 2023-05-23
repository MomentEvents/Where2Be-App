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
import React, { useCallback, useContext, useEffect, useState } from "react";
import { ScreenContext } from "../../../contexts/ScreenContext";
import { COLORS, SCREENS, SIZES, icons } from "../../../constants";
import { Event } from "../../../constants/types";
import { User } from "../../../constants/types";
import { Interest } from "../../../constants/types";
import { LinearGradient } from "expo-linear-gradient";
import { McIcon, McText } from "../../../components/Styled";
import moment from "moment";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import ImageView from "react-native-image-viewing";
import {
  addUserJoinEvent,
  addUserShoutoutEvent,
  getEventHostByEventId,
  removeUserJoinEvent,
  removeUserShoutoutEvent,
} from "../../../services/UserService";
import { UserContext } from "../../../contexts/UserContext";
import { displayError, formatError } from "../../../helpers/helpers";
import { EventContext } from "../../../contexts/EventContext";
import { deleteEvent, getEvent } from "../../../services/EventService";
import { getEventInterestsByEventId } from "../../../services/InterestService";
import GradientButton from "../../../components/Styled/GradientButton";
import { useNavigation } from "@react-navigation/native";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Hyperlink from "react-native-hyperlink";
import { Colors } from "react-native/Libraries/NewAppScreen";
import RetryButton from "../../../components/RetryButton";
import { CustomError } from "../../../constants/error";

type routeParametersType = {
  eventID: string;
  passedUser?: User;
};

const EventDetailsScreen = ({ route }) => {
  const { userToken, currentUser, isAdmin } = useContext(UserContext);
  const navigation = useNavigation<any>();

  // Props from previous event card to update
  const propsFromEventCard: routeParametersType = route.params;
  const { eventID, passedUser } = propsFromEventCard;

  // Loading context in case we want to disable the screen
  const { setLoading } = useContext(ScreenContext);

  const {
    eventIDToEvent,
    updateEventIDToEvent,
    eventIDToInterests,
    updateEventIDToInterests,
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

  const [didFetchEvent, setDidFetchEvent] = useState<boolean>(false);
  const [didFetchInterests, setDidFetchInterests] = useState<boolean>(false);
  const [didFetchHost, setDidFetchHost] = useState<boolean>(false);

  const [imageViewVisible, setImageViewVisible] = useState<boolean>(false);

  const [showRetry, setShowRetry] = useState<boolean>(false);

  // Update the previous screen event cards

  const addUserJoin = async () => {
    updateEventIDToEvent({
      id: eventID,
      event: {
        ...eventIDToEvent[eventID],
        UserJoin: true,
        NumJoins: eventIDToEvent[eventID].NumJoins + 1,
      },
    });
    addUserJoinEvent(
      userToken.UserAccessToken,
      currentUser.UserID,
      eventID
    ).catch((error: Error) => {
      updateEventIDToEvent({
        id: eventID,
        event: {
          ...eventIDToEvent[eventID],
          UserJoin: false,
          NumJoins: eventIDToEvent[eventID].NumJoins - 1,
        },
      });
      displayError(error);
    });
  };

  const addUserShoutout = () => {
    updateEventIDToEvent({
      id: eventID,
      event: {
        ...eventIDToEvent[eventID],
        UserShoutout: true,
        NumShoutouts: eventIDToEvent[eventID].NumShoutouts + 1,
      },
    });
    addUserShoutoutEvent(
      userToken.UserAccessToken,
      currentUser.UserID,
      eventID
    ).catch((error: Error) => {
      updateEventIDToEvent({
        id: eventID,
        event: {
          ...eventIDToEvent[eventID],
          UserShoutout: false,
          NumShoutouts: eventIDToEvent[eventID].NumShoutouts - 1,
        },
      });
      displayError(error);
    });
  };

  const removeUserJoin = () => {
    setLoading(true);
    removeUserJoinEvent(userToken.UserAccessToken, currentUser.UserID, eventID)
      .then(() => {
        updateEventIDToEvent({
          id: eventID,
          event: {
            ...eventIDToEvent[eventID],
            UserJoin: false,
            NumJoins: eventIDToEvent[eventID].NumJoins - 1,
          },
        });

        setLoading(false);
      })
      .catch((error: Error) => {
        displayError(error);
        setLoading(false);
      });
  };

  const removeUserShoutout = () => {
    setLoading(true);
    removeUserShoutoutEvent(
      userToken.UserAccessToken,
      currentUser.UserID,
      eventID
    )
      .then(() => {
        updateEventIDToEvent({
          id: eventID,
          event: {
            ...eventIDToEvent[eventID],
            UserShoutout: false,
            NumShoutouts: eventIDToEvent[eventID].NumShoutouts - 1,
          },
        });
        setLoading(false);
      })
      .catch((error: Error) => {
        displayError(error);
        setLoading(false);
      });
  };

  const onHostPressed = () => {
    if (host) {
      navigation.push(SCREENS.ProfileDetails, {
        user: host,
      });
    }
  };

  const onEditEventPressed = () => {
    if (!eventIDToEvent[eventID]) {
      return;
    }
    navigation.navigate(SCREENS.EditEvent, {
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
                navigation.goBack();
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

  const onBackPressed = () => {
    navigation.goBack();
  };

  // For description expansion
  const descriptionOnExpand = useCallback((e) => {
    setLengthMoreText(e.nativeEvent.lines.length > 2); //to check the text is more than 4 lines or not
  }, []);

  //To toggle the show text or hide it
  const descriptionToggleNumberOfLines = () => {
    setDescriptionExpanded(!descriptionExpanded);
  };

  const handleGetEventHostByEventId = () => {
    getEventHostByEventId(userToken.UserAccessToken, eventID)
    .then((pulledHost: User) => {
      setHost(pulledHost);
      setDidFetchHost(true);
    })
    .catch((error: CustomError) => {
      setShowRetry(true);
      if (error.shouldDisplay){
        displayError(error);
      }
    });
  }

  const pullData = async () => {
    getEvent(eventID, userToken.UserAccessToken)
      .then((pulledEvent: Event) => {
        updateEventIDToEvent({ id: eventID, event: pulledEvent });
        setDidFetchEvent(true);
      })
      .catch((error: CustomError) => {
        if (error.shouldDisplay){
          displayError(error);
        }
      });

    getEventInterestsByEventId(eventID, userToken.UserAccessToken)
      .then((tags: Interest[]) => {
        updateEventIDToInterests({ id: eventID, interests: tags });
        setDidFetchInterests(true);
      })
      .catch((error: CustomError) => {
        if (error.shouldDisplay){
          displayError(error);
        }
      });

    if (!passedUser) {
      handleGetEventHostByEventId();
    } else {
      setHost(passedUser);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    setHost(undefined);
    setDidFetchHost(false);
    setDidFetchInterests(false);
    setDidFetchEvent(false);
    updateEventIDToInterests({ id: eventID, interests: undefined });
    pullData();
  };

  useEffect(() => {
    pullData();
  }, []);

  useEffect(() => {
    if (didFetchHost && didFetchEvent && didFetchInterests) {
      setIsRefreshing(false);
    }
  }, [didFetchHost, didFetchEvent, didFetchInterests]);

  useEffect(() => {
    console.log("going into host use effect");
    if (!host) {
      setIsHost(false);
      return;
    }
    console.log("Host UserID is " + host.UserID);
    console.log("Current user UserID is " + currentUser.UserID);
    if (host.UserID == currentUser.UserID || isAdmin) {
      setIsHost(true);
    } else {
      setIsHost(false);
    }
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
              onRefresh={onRefresh}
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
                  marginTop: SIZES.topBarHeight,
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
                    <icons.backarrow width={24} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => {
                      setImageViewVisible(true);
                    }}
                    style={{
                      width: 40,
                      height: 40,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 13,
                    }}
                  >
                    <Ionicons name="md-expand" size={24} color="white" />
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
                          h4
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
                            h4
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
              <McText
                h1
                style={{
                  marginTop: 10,
                }}
              >
                {eventIDToEvent[eventID] === undefined
                  ? null
                  : eventIDToEvent[eventID].Title}
              </McText>
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

            {showRetry? (
              <RetryButton setShowRetry={setShowRetry} retryCallBack={handleGetEventHostByEventId} style={{ alignItems: 'center', justifyContent: 'center', marginBottom: 10, backgroundColor: COLORS.black }}/>
            ) : (
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
                    source={{ uri: !host ? null : host.Picture }}
                  ></Image>
                  <McText
                    h4
                    numberOfLines={1}
                    style={{
                      letterSpacing: 1,
                      color: COLORS.white,
                    }}
                  >
                    {!host ? (
                      <ActivityIndicator color={COLORS.white} style={{ marginLeft: 10 }} />
                    ) : (
                      host.DisplayName
                    )}
                  </McText>
                  {host && host.VerifiedOrganization && (
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
            )}
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
                  height: 170 + SIZES.bottomBarHeight,
                }}
              ></View>
            </SectionFooter>
          </View>
        </ScrollView>
        <View style={styles.userControlContainer}>
          {eventIDToEvent[eventID] ? (
            <UserOptionsSection>
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
                    onPressOut={() => {
                      eventIDToEvent[eventID].UserJoin
                        ? removeUserJoin()
                        : addUserJoin();
                    }}
                  >
                    {eventIDToEvent[eventID].UserJoin ? (
                      <icons.activecheckmark width={30} />
                    ) : (
                      <icons.inactivecheckmark width={30} />
                    )}
                  </TouchableOpacity>
                </GradientButton>
                <McText
                  body3
                  style={{
                    color: eventIDToEvent[eventID].UserJoin
                      ? COLORS.darkPurple
                      : COLORS.white,
                  }}
                >
                  Join
                </McText>
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
                    onPress={() => {
                      eventIDToEvent[eventID].UserShoutout
                        ? removeUserShoutout()
                        : addUserShoutout();
                    }}
                  >
                    {eventIDToEvent[eventID].UserShoutout ? (
                      <icons.activeshoutout
                        style={{ marginRight: 2 }}
                        width={30}
                      />
                    ) : (
                      <icons.inactiveshoutout
                        style={{ marginRight: 2 }}
                        width={30}
                      />
                    )}
                  </TouchableOpacity>
                </GradientButton>
                <McText
                  body3
                  style={{
                    color: eventIDToEvent[eventID].UserShoutout
                      ? COLORS.darkPurple
                      : COLORS.white,
                  }}
                >
                  Boost
                </McText>
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
    bottom: SIZES.bottomBarHeight + 10,
    left: 10,
    right: 10,
    height: 130,
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
