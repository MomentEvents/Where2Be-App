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
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { ScreenContext } from "../../../contexts/ScreenContext";
import { COLORS, SCREENS, SIZES, icons } from "../../../constants";
import { Event } from "../../../constants/types";
import { User } from "../../../constants/types";
import { Interest } from "../../../constants/types";
import { LinearGradient } from "expo-linear-gradient";
import * as RootNavigation from "../../../navigation/Navigator";
import { McIcon, McText } from "../../../components/Styled";
import moment from "moment";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import ImageView from "react-native-image-viewing";
import {
  addUserJoinEvent,
  addUserShoutoutEvent,
  getEventHostByEventId,
  getUserJoinEvent,
  getUserShoutoutEvent,
  removeUserJoinEvent,
  removeUserShoutoutEvent,
} from "../../../services/UserService";
import { UserContext } from "../../../contexts/UserContext";
import { displayError } from "../../../helpers/helpers";
import { EventContext } from "../../../contexts/EventContext";
import {
  deleteEvent,
  getEvent,
  getEventNumJoins,
  getEventNumShoutouts,
} from "../../../services/EventService";
import { getEventInterestsByEventId } from "../../../services/InterestService";
import GradientButton from "../../../components/Styled/GradientButton";

/*********************************************
 * route parameters:
 *
 * EventID: string,
 * SetCardLikes?: React.SetStateAction<number>,
 * SetCardShoutouts?: React.SetStateAction<number>,
 * SetCardUserLiked?: React.SetStateAction<boolean>,
 * SetCardUserShouted?: React.SetStateAction<boolean>
 *********************************************/

type routeParametersType = {
  eventID: string;
};
const EventDetailsScreen = ({ route }) => {
  const { isLoggedIn, userToken, currentUser } = useContext(UserContext);

  // Props from previous event card to update
  const propsFromEventCard: routeParametersType = route.params;

  // Loading context in case we want to disable the screen
  const { setLoading } = useContext(ScreenContext);

  const {
    eventIDToEvent,
    updateEventIDToEvent,
    eventIDToDidJoin,
    updateEventIDToDidJoin,
    eventIDToJoins,
    updateEventIDToJoins,
    eventIDToDidShoutout,
    updateEventIDToDidShoutout,
    eventIDToShoutouts,
    updateEventIDToShoutouts,
    eventIDToInterests,
    updateEventIDToInterests
  } = useContext(EventContext);

  const { eventID } = propsFromEventCard;

  const [host, setHost] = useState<User>(null);

  const [isHost, setIsHost] = useState<boolean>(false);

  const [descriptionExpanded, setDescriptionExpanded] =
    useState<boolean>(false); // to expand description box
  const [lengthMoreText, setLengthMoreText] = useState<boolean>(false); // to show the "Read more..." & "Read Less"

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const [loadedJoins, setLoadedJoins] = useState(false);
  const [loadedShoutouts, setLoadedShoutouts] = useState(false);
  const [loadedUserJoined, setLoadedUserJoined] = useState(false);
  const [loadedUserShouted, setLoadedUserShouted] = useState(false);

  const [imageViewVisible, setImageViewVisible] = useState<boolean>(false);

  // Update the previous screen event cards

  const addUserJoin = async () => {
    setLoading(true);
    await addUserJoinEvent(
      userToken.UserAccessToken,
      currentUser.UserID,
      eventID
    )
      .then(() => {
        updateEventIDToDidJoin({ id: eventID, didJoin: true });
        updateEventIDToJoins({
          id: eventID,
          joins: eventIDToJoins[eventID] + 1,
        });

        setLoading(false);
      })
      .catch((error: Error) => {
        displayError(error);
        setLoading(false);
      });
  };

  const addUserShoutout = () => {
    setLoading(true);
    addUserShoutoutEvent(userToken.UserAccessToken, currentUser.UserID, eventID)
      .then(() => {
        updateEventIDToDidShoutout({ id: eventID, didShoutout: true });
        updateEventIDToShoutouts({
          id: eventID,
          shoutouts: eventIDToShoutouts[eventID] + 1,
        });

        setLoading(false);
      })
      .catch((error: Error) => {
        displayError(error);
        setLoading(false);
      });
  };

  const removeUserJoin = () => {
    setLoading(true);
    removeUserJoinEvent(userToken.UserAccessToken, currentUser.UserID, eventID)
      .then(() => {
        updateEventIDToDidJoin({ id: eventID, didJoin: false });
        updateEventIDToJoins({
          id: eventID,
          joins: eventIDToJoins[eventID] - 1,
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
        updateEventIDToDidShoutout({ id: eventID, didShoutout: false });
        updateEventIDToShoutouts({
          id: eventID,
          shoutouts: eventIDToShoutouts[eventID] - 1,
        });

        setLoading(false);
      })
      .catch((error: Error) => {
        displayError(error);
        setLoading(false);
      });
  };

  const onHostUsernamePressed = () => {
    if (host !== null) {
      RootNavigation.push("ProfileDetail", {
        UserID: host.UserID,
      });
    }
  };

  const onEditEventPressed = () => {
    if (!eventIDToEvent[eventID]) {
      return;
    }
    RootNavigation.navigate(SCREENS.EditEvent, {
      eventID: eventID
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

            await deleteEvent(userToken.UserAccessToken, eventID).catch(
              (error: Error) => {
                displayError(error);
              }
            );

            updateEventIDToEvent({ id: eventID, event: undefined });
            RootNavigation.goBack();
          },
        },
      ],
      { cancelable: false }
    );
  };

  const onBackPressed = () => {
    RootNavigation.goBack();
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
    getEvent(eventID)
      .then((pulledEvent: Event) => {
        updateEventIDToEvent({ id: eventID, event: pulledEvent });
      })
      .catch((error: Error) => {
        if (!gotError) {
          gotError = true;
          displayError(error);
          RootNavigation.goBack();
        }
      });

    getEventNumJoins(eventID)
      .then((pulledJoins: number) => {
        updateEventIDToJoins({ id: eventID, joins: pulledJoins });
        setLoadedJoins(true);
      })
      .catch((error: Error) => {
        if (!gotError) {
          gotError = true;
          displayError(error);
          RootNavigation.goBack();
        }
      });

    getEventNumShoutouts(eventID)
      .then((pulledShoutouts: number) => {
        updateEventIDToShoutouts({ id: eventID, shoutouts: pulledShoutouts });
        setLoadedShoutouts(true);
      })
      .catch((error: Error) => {
        if (!gotError) {
          gotError = true;
          displayError(error);
          RootNavigation.goBack();
        }
      });

    getUserJoinEvent(userToken.UserAccessToken, currentUser.UserID, eventID)
      .then((pulledUserJoined: boolean) => {
        updateEventIDToDidJoin({ id: eventID, didJoin: pulledUserJoined });
        setLoadedUserJoined(true);
      })
      .catch((error: Error) => {
        if (!gotError) {
          gotError = true;
          displayError(error);
          RootNavigation.goBack();
        }
      });

    getUserShoutoutEvent(userToken.UserAccessToken, currentUser.UserID, eventID)
      .then((pulledUserShouted: boolean) => {
        updateEventIDToDidShoutout({
          id: eventID,
          didShoutout: pulledUserShouted,
        });
        setLoadedUserShouted(true);
      })
      .catch((error: Error) => {
        if (!gotError) {
          gotError = true;
          displayError(error);
          RootNavigation.goBack();
        }
      });

    // Get interests by route.params.EventID
    // TODODATABASE

    getEventInterestsByEventId(eventID)
      .then((tags: Interest[]) => {
        updateEventIDToInterests({id: eventID, interests: tags})
      })
      .catch((error: Error) => {
        if (!gotError) {
          gotError = true;
          displayError(error);
          RootNavigation.goBack();
        }
      });

    getEventHostByEventId(userToken.UserAccessToken, eventID)
      .then((pulledHost: User) => {
        setHost(pulledHost);
      })
      .catch((error: Error) => {
        if (!gotError) {
          gotError = true;
          displayError(error);
          RootNavigation.goBack();
        }
      });
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    setLoadedJoins(false);
    setLoadedShoutouts(false);
    setLoadedUserJoined(false);
    setLoadedUserShouted(false);
    await pullData();
    setIsRefreshing(false);
  };

  useEffect(() => {
    pullData();
  }, []);

  useEffect(() => {
    console.log("going into host use effect");
    if (host === null) {
      return;
    }
    console.log("Host UserID is " + host.UserID);
    console.log("Current user UserID is " + currentUser.UserID);
    if (host.UserID == currentUser.UserID) {
      setIsHost(true);
    } else {
      console.log("bitch is false");
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
        onRequestClose={() => setImageViewVisible(false)}
      />
      <SafeAreaView>
        <View style={{ position: "relative" }}>
          <ScrollView
            contentContainerStyle={{
              backgroundColor: "transparent",
            }}
            style={{
              backgroundColor: "transparent",
            }}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          >
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
                height:
                  SIZES.height < 700 ? SIZES.height * 0.4 : SIZES.height * 0.5,
              }}
            >
              <View style={{ flex: 1 }}>
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
                    <McIcon
                      source={icons.fullscreen}
                      style={{
                        tintColor: COLORS.white,
                      }}
                      size={24}
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
                      <View style={styles.scrollcontainer}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "flex-start",
                          }}
                        >
                          <McText
                            h3
                            style={{
                              letterSpacing: 1.5,
                              color: COLORS.purple,
                              opacity: 0.85,
                            }}
                          >
                            {eventIDToEvent[eventID] === undefined
                              ? null
                              : moment(eventIDToEvent[eventID].StartDateTime)
                                  .format("MMM DD")
                                  .toUpperCase()}
                          </McText>
                          <McText
                            h3
                            style={{
                              letterSpacing: 1.2,
                              marginLeft: 10,
                              color: COLORS.white,
                              opacity: 0.85,
                            }}
                          >
                            {eventIDToEvent[eventID] === undefined
                              ? null
                              : moment(
                                  eventIDToEvent[eventID].StartDateTime
                                ).format("h:mm A")}
                          </McText>
                        </View>
                      </View>
                    </FooterContentView>
                  </LinearGradient>
                </ImageFooterSection>
              </View>
            </ImageBackground>
            <View style={styles.scrollcontainer}>
              <TitleSection>
                <McText
                  h1
                  style={{
                    width: SIZES.width * 0.8,
                    marginTop: 5,
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
                  {eventIDToInterests[eventID] ? eventIDToInterests[eventID].map((taglist) => (
                        <View
                          key={taglist.InterestID}
                          style={{
                            width:
                              taglist === undefined
                                ? 20
                                : taglist.Name.length * 9 + 15,
                            height: 32,
                            borderRadius: 14,
                            marginRight: 10,
                            backgroundColor: COLORS.input,
                            borderWidth: StyleSheet.hairlineWidth,
                            borderColor: COLORS.purple,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <McText h5 style={{ letterSpacing: 1 }}>
                            {taglist === undefined ? null : taglist.Name}
                          </McText>
                        </View>
                      )) : null}
                </ScrollView>
              </InterestSection>

              <HostSection>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => {
                    onHostUsernamePressed();
                  }}
                >
                  <Image
                    style={styles.hostProfilePic}
                    source={{ uri: host === null ? null : host.Picture }}
                  ></Image>
                  <McText
                    h4
                    numberOfLines={1}
                    style={{
                      letterSpacing: 1,
                      textTransform: "uppercase",
                      width: SIZES.width / 1.25,
                    }}
                  >
                    {host === null ? (
                      <ActivityIndicator style={{ marginLeft: 10 }} />
                    ) : (
                      host.Name
                    )}
                  </McText>
                </TouchableOpacity>
              </HostSection>

              <DescriptionSection>
                <View
                  style={{
                    marginBottom: 4,
                    marginTop: 4,
                    marginRight: 12,
                    marginLeft: 12,
                  }}
                >
                  <McText
                    onTextLayout={descriptionOnExpand}
                    numberOfLines={descriptionExpanded ? undefined : 3}
                    body3
                    selectable={true}
                  >
                    {eventIDToEvent[eventID] === undefined
                      ? null
                      : eventIDToEvent[eventID].Description}
                  </McText>
                  {lengthMoreText ? (
                    <McText
                      onPress={descriptionToggleNumberOfLines}
                      style={{
                        lineHeight: 22,
                        marginTop: 10,
                        color: COLORS.gray,
                      }}
                    >
                      {descriptionExpanded ? "Read less..." : "Read more..."}
                    </McText>
                  ) : null}
                </View>
              </DescriptionSection>
              <LocationSection>
                <McIcon
                  source={icons.location}
                  size={16}
                  style={{
                    margin: 4,
                    tintColor: COLORS.purple,
                  }}
                />
                <McText
                  h5
                  style={{
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    marginTop: -1,
                    width: SIZES.width * 0.83,
                  }}
                >
                  {eventIDToEvent[eventID] === undefined
                    ? null
                    : eventIDToEvent[eventID].Location}
                </McText>
              </LocationSection>
              <VisibilitySection>
                <McIcon
                  source={icons.visibility}
                  size={16}
                  style={{
                    margin: 4,
                    tintColor: COLORS.purple,
                  }}
                />
                <View>
                  <McText
                    body5
                    numberOfLines={1}
                    style={{
                      opacity: 0.8,
                      letterSpacing: 1,
                      textTransform: "uppercase",
                    }}
                  >
                    {eventIDToEvent[eventID] === undefined
                      ? null
                      : eventIDToEvent[eventID].Visibility
                      ? "Public"
                      : "Private"}
                  </McText>
                </View>
              </VisibilitySection>
              {isHost &&
              eventIDToInterests[eventID] &&
              eventIDToEvent[eventID] ? (
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
                  <SectionFooter>
                    <View
                      style={{
                        height: 170,
                      }}
                    ></View>
                  </SectionFooter>
                </>
              ) : (
                <SectionFooter>
                  <View
                    style={{
                      height: 170,
                    }}
                  ></View>
                </SectionFooter>
              )}
            </View>
          </ScrollView>
          <View style={styles.userControlContainer}>
            {loadedJoins &&
            loadedShoutouts &&
            loadedUserJoined &&
            loadedUserShouted ? (
              <UserOptionsSection>
                <View
                  style={{
                    alignItems: "center",
                    marginRight: 60,
                  }}
                >
                  <GradientButton
                    style={{ width: 60, height: 60, borderRadius: 80 }}
                  >
                    <TouchableOpacity
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 80,
                        marginBottom: 5,
                        backgroundColor: eventIDToDidJoin[eventID]
                          ? "transparent"
                          : COLORS.trueBlack,
                        borderWidth: 2,
                        borderColor: eventIDToDidJoin[eventID]
                          ? COLORS.white
                          : COLORS.gray,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPressOut={() => {
                        eventIDToDidJoin[eventID]
                          ? removeUserJoin()
                          : addUserJoin();
                      }}
                    >
                      {eventIDToDidJoin[eventID] ? (
                        <icons.activecheckmark width={35} />
                      ) : (
                        <icons.inactivecheckmark width={35} />
                      )}
                    </TouchableOpacity>
                  </GradientButton>
                  <McText
                    body3
                    style={{
                      color: eventIDToDidJoin[eventID]
                        ? COLORS.purple
                        : COLORS.white,
                    }}
                  >
                    Join
                  </McText>
                  <McText
                    body2
                    style={{
                      color: eventIDToDidJoin[eventID]
                        ? COLORS.purple
                        : COLORS.white,
                    }}
                  >
                    {eventIDToJoins[eventID]}
                  </McText>
                </View>
                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <GradientButton
                    style={{ width: 60, height: 60, borderRadius: 80 }}
                  >
                    <TouchableOpacity
                      style={{
                        width: 60,
                        height: 60,
                        borderRadius: 80,
                        marginBottom: 5,
                        backgroundColor: eventIDToDidShoutout[eventID]
                          ? "transparent"
                          : COLORS.trueBlack,
                        borderWidth: 2,
                        borderColor: eventIDToDidShoutout[eventID]
                          ? COLORS.white
                          : COLORS.gray,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() => {
                        eventIDToDidShoutout[eventID]
                          ? removeUserShoutout()
                          : addUserShoutout();
                      }}
                    >
                      {eventIDToDidShoutout[eventID] ? (
                        <icons.activeshoutout width={35} />
                      ) : (
                        <icons.inactiveshoutout width={35} />
                      )}
                    </TouchableOpacity>
                  </GradientButton>
                  <McText
                    body3
                    style={{
                      color: eventIDToDidShoutout[eventID]
                        ? COLORS.purple
                        : COLORS.white,
                    }}
                  >
                    Shoutout
                  </McText>
                  <McText
                    body2
                    style={{
                      color: eventIDToDidShoutout[eventID]
                        ? COLORS.purple
                        : COLORS.white,
                    }}
                  >
                    {eventIDToShoutouts[eventID]}
                  </McText>
                </View>
              </UserOptionsSection>
            ) : (
              <ActivityIndicator style={{ marginTop: 20 }} />
            )}
          </View>
        </View>
      </SafeAreaView>
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
    bottom: 0,
    width: SIZES.width,
    height: 150,
    borderTopWidth: 0.5,
    borderColor: COLORS.gray,
    backgroundColor: COLORS.black,
    opacity: 0.9,
  },
  hostProfilePic: {
    height: 35,
    width: 35,
    borderRadius: 30,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.white,
    justifyContent: "center",
    alignItems: "center",
  },
  edit: {
    backgroundColor: COLORS.purple,
    width: SIZES.width / 3,
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    height: 35,
    marginRight: 10,
    justifyContent: "center",
  },
  delete: {
    backgroundColor: COLORS.red,
    width: SIZES.width / 2.5,
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
  width: ${SIZES.width}px;
`;

const FooterContentView = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  marginhorizontal: 15px;
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
  align-items: center;
`;

const DescriptionSection = styled.View`
  background-color: ${COLORS.input};
  border-radius: 10px;
  margin: 5px 0px 0px 0px;
  opacity: 0.8;
`;

const LocationSection = styled.View`
  flex-direction: row;
  margin: 5px 0px 0px 0px;
  border-radius: 10px;
  align-items: center;
`;

const VisibilitySection = styled.View`
  flex-direction: row;
  margin: 0px 0px 0px 0px;
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
