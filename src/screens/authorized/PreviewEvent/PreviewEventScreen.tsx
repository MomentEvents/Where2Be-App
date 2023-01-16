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
import * as Navigator from "../../../navigation/Navigator";
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
  createEvent,
  deleteEvent,
  getEvent,
  getEventNumJoins,
  getEventNumShoutouts,
} from "../../../services/EventService";
import { getEventInterestsByEventId } from "../../../services/InterestService";
import GradientButton from "../../../components/Styled/GradientButton";
import SectionHeader from "../../../components/Styled/SectionHeader";

type routeParametersType = {
  createdEvent: Event;
  interests: Interest[];
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
    updateEventIDToInterests,
  } = useContext(EventContext);

  const { createdEvent, interests } = propsFromEventCard;

  const [descriptionExpanded, setDescriptionExpanded] =
    useState<boolean>(false); // to expand description box
  const [lengthMoreText, setLengthMoreText] = useState<boolean>(false); // to show the "Read more..." & "Read Less"

  const [imageViewVisible, setImageViewVisible] = useState<boolean>(false);

  const onBackPressed = () => {
    Navigator.goBack();
  };

  const onSubmit = () => {
    setLoading(true);
    createEvent(userToken.UserAccessToken, createdEvent, interests)
      .then((eventID: string) => {
        setLoading(false);

        const pushedEvent: Event = {
          EventID: eventID,
          Title: createdEvent.Title,
          Description: createdEvent.Description,
          Picture: createdEvent.Picture,
          Location: createdEvent.Location,
          StartDateTime: createdEvent.StartDateTime,
          EndDateTime: createdEvent.EndDateTime,
          Visibility: createdEvent.Visibility,
        };

        updateEventIDToEvent({ id: eventID, event: createdEvent });
        Navigator.popToTop();
        Navigator.push(SCREENS.EventDetails, { eventID: eventID });
      })
      .catch((error: Error) => {
        displayError(error);
        setLoading(false);
      });
  };

  // For description expansion
  const descriptionOnExpand = useCallback((e) => {
    setLengthMoreText(e.nativeEvent.lines.length > 2); //to check the text is more than 4 lines or not
  }, []);

  //To toggle the show text or hide it
  const descriptionToggleNumberOfLines = () => {
    setDescriptionExpanded(!descriptionExpanded);
  };

  return (
    <View style={styles.container}>
      <ImageView
        images={[
          {
            uri: createdEvent.Picture,
          },
        ]}
        imageIndex={0}
        visible={imageViewVisible}
        onRequestClose={() => setImageViewVisible(false)}
      />
      <SafeAreaView style={styles.container}>
        <SectionHeader
          title={"Preview Event"}
          leftButtonOnClick={onBackPressed}
          leftButtonSVG={<icons.backarrow />}
          rightButtonOnClick={onSubmit}
          rightButtonSVG={
            <McText h3 color={COLORS.purple}>
              Post
            </McText>
          }
        />
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ position: "relative" }}>
            <ImageBackground
              resizeMode="cover"
              source={{
                uri: createdEvent.Picture,
              }}
              style={{
                width: "100%",
                height: SIZES.height * 0.3,
              }}
            >
              <View style={{ flex: 1 }}>
                <ImageHeaderSection>
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
                            width: SIZES.width - 40,
                          }}
                        >
                          <icons.pickdate
                            style={{ marginRight: 10, opacity: 0.7 }}
                          />
                          <McText
                            h4
                            style={{
                              letterSpacing: 0.5,
                              color: COLORS.lightGray,
                              opacity: 0.7,
                            }}
                          >
                            {moment(createdEvent.StartDateTime)
                              .format("MMM DD[,] YYYY")
                              .toLowerCase()}
                          </McText>
                          <View
                            style={{
                              position: "absolute",
                              right: 0,
                              flexDirection: "row",
                            }}
                          >
                            <icons.picktime
                              style={{ marginRight: 10, opacity: 0.7 }}
                            />
                            <McText
                              h4
                              style={{
                                letterSpacing: 0.5,
                                color: COLORS.lightGray,
                                opacity: 0.7,
                              }}
                            >
                              {moment(createdEvent.StartDateTime).format(
                                "h:mm a"
                              ) +
                                " - " +
                                moment(createdEvent.EndDateTime).format(
                                  "h:mm a"
                                )}
                            </McText>
                          </View>
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
                    marginTop: 10,
                  }}
                >
                  {createdEvent.Title}
                </McText>
              </TitleSection>
              <InterestSection>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  {interests.map((taglist) => (
                    <View
                      key={taglist.InterestID}
                      style={{
                        width:
                          taglist === undefined
                            ? 20
                            : taglist.Name.length * 9 + 15,
                        height: 32,
                        borderRadius: 5,
                        marginRight: 10,
                        backgroundColor: COLORS.input,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <McText h5 style={{ letterSpacing: 1 }}>
                        {taglist === undefined ? null : taglist.Name}
                      </McText>
                    </View>
                  ))}
                </ScrollView>
              </InterestSection>

              <HostSection>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Image
                    style={styles.hostProfilePic}
                    source={{ uri: currentUser.Picture }}
                  ></Image>
                  <McText
                    h4
                    numberOfLines={1}
                    style={{
                      letterSpacing: 1,
                      width: SIZES.width / 1.25,
                      color: COLORS.lightGray,
                    }}
                  >
                    {currentUser.Name}
                  </McText>
                </View>
              </HostSection>

              <DescriptionSection>
                <View
                  style={{
                    marginBottom: 8,
                    marginTop: 8,
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
                    {createdEvent.Description}
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
                    tintColor: COLORS.lightGray,
                  }}
                />
                <McText
                  h5
                  style={{
                    letterSpacing: 1,
                    marginTop: -1,
                    width: SIZES.width * 0.83,
                    color: COLORS.lightGray,
                  }}
                >
                  {createdEvent.Location}
                </McText>
              </LocationSection>
              <VisibilitySection>
                <McIcon
                  source={icons.visibility}
                  size={16}
                  style={{
                    margin: 4,
                    tintColor: COLORS.lightGray,
                  }}
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
                    Public
                  </McText>
                </View>
              </VisibilitySection>
            </View>
          </View>
        </ScrollView>
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
});

const ImageHeaderSection = styled.View`
  flex-direction: row;
  justify-content: flex-end;
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
  margin: 10px 0px 0px 0px;
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
