import {
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
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
import { UserContext } from "../../../contexts/UserContext";
import { displayError, showBugReportPopup } from "../../../helpers/helpers";
import { EventContext } from "../../../contexts/EventContext";
import { createEvent } from "../../../services/EventService";
import { getEventInterestsByEventId } from "../../../services/InterestService";
import GradientButton from "../../../components/Styled/GradientButton";
import SectionHeader from "../../../components/Styled/SectionHeader";
import MobileSafeView from "../../../components/Styled/MobileSafeView";
import { useNavigation } from "@react-navigation/native";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Hyperlink from "react-native-hyperlink";
import { CustomError } from "../../../constants/error";

type routeParametersType = {
  createdEvent: Event;
  base64Image: string;
  interests: Interest[];
  doNotifyFollowers: boolean;
};

const EventDetailsScreen = ({ route }) => {
  const { isLoggedIn, userToken, userIDToUser, updateUserIDToUser } =
    useContext(UserContext);

  const { didHostedEventsChangeRef } = useContext(EventContext);

  // Props from previous event card to update
  const propsFromEventCard: routeParametersType = route.params;

  // Loading context in case we want to disable the screen
  const { setLoading } = useContext(ScreenContext);

  const {
    eventIDToEvent,
    updateEventIDToEvent,
    eventIDToInterests,
    updateEventIDToInterests,
  } = useContext(EventContext);

  const insets = useSafeAreaInsets();

  const navigation = useNavigation<any>();

  const { createdEvent, interests, base64Image, doNotifyFollowers } =
    propsFromEventCard;

  const [descriptionExpanded, setDescriptionExpanded] =
    useState<boolean>(false); // to expand description box
  const [lengthMoreText, setLengthMoreText] = useState<boolean>(false); // to show the "Read more..." & "Read Less"

  const [imageViewVisible, setImageViewVisible] = useState<boolean>(false);

  const onBackPressed = () => {
    navigation.goBack();
  };

  const onSubmit = () => {
    setLoading(true);
    const createdEventBase64 = { ...createdEvent };
    createdEventBase64.Picture = base64Image;
    createEvent(
      userToken.UserAccessToken,
      createdEventBase64,
      interests,
      doNotifyFollowers
    )
      .then((eventID: string) => {
        setLoading(false);
        updateUserIDToUser({
          id: userToken.UserID,
          user: {
            ...userIDToUser[userToken.UserID],
            NumEvents: userIDToUser[userToken.UserID].NumEvents + 1,
          },
        });
        updateEventIDToEvent({ id: eventID, event: createdEvent });
        didHostedEventsChangeRef.current = true;
        navigation.popToTop();
        navigation.push(SCREENS.EventDetails, { eventID: eventID });
      })
      .catch((error: CustomError) => {
        if (error.showBugReportDialog) {
          showBugReportPopup(error);
        } else {
          displayError(error);
        }
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
    <MobileSafeView isBottomViewable={true} style={styles.container}>
      <SectionHeader
        title={"Preview Event"}
        leftButtonOnClick={onBackPressed}
        leftButtonSVG={<Feather name="arrow-left" size={28} color="white" />}
        rightButtonOnClick={onSubmit}
        rightButtonSVG={
          <McText h3 color={COLORS.purple}>
            Post
          </McText>
        }
      />
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
      <ScrollView
        style={{ flex: 1, backgroundColor: COLORS.trueBlack }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ height: "100%", position: "relative" }}>
          <ScrollView
            contentContainerStyle={{
              backgroundColor: "transparent",
            }}
            style={{
              backgroundColor: "transparent",
            }}
            showsVerticalScrollIndicator={false}
          >
            <TouchableOpacity onPress={() => setImageViewVisible(true)}>
              <ImageBackground
                resizeMode="cover"
                source={{
                  uri: createdEvent.Picture,
                }}
                style={{
                  width: "100%",
                  height: SIZES.height * 0.45,
                }}
              >
                <View
                  style={{
                    flex: 1,
                  }}
                >
                  <ImageHeaderSection>
                    <TouchableOpacity
                      style={{
                        width: 56,
                        height: 40,
                        backgroundColor: "rgba(0,0,0,0.5)",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 13,
                        opacity: 0,
                      }}
                      disabled={true}
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
                      colors={["transparent", COLORS.trueBlack]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 0, y: 0.9 }}
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
                          <Feather
                            name="calendar"
                            size={24}
                            color={COLORS.purple}
                            style={{ marginRight: 8 }}
                          />
                          <McText
                            body4
                            style={{
                              letterSpacing: 0.1,
                              color: COLORS.lightGray,
                            }}
                          >
                            {moment(createdEvent.StartDateTime).format(
                              "MMM DD[,] YYYY"
                            )}
                          </McText>
                          <View
                            style={{
                              position: "absolute",
                              alignItems: "center",
                              right: 0,
                              flexDirection: "row",
                            }}
                          >
                            <Feather
                              style={{ marginRight: 8 }}
                              name="clock"
                              size={24}
                              color={COLORS.purple}
                            />
                            <McText
                              body4
                              style={{
                                letterSpacing: 0.1,
                                color: COLORS.lightGray,
                              }}
                            >
                              {createdEvent.EndDateTime
                                ? moment(createdEvent.StartDateTime).format(
                                    "h:mm a"
                                  ) +
                                  " - " +
                                  moment(createdEvent.EndDateTime).format(
                                    "h:mm a"
                                  )
                                : moment(createdEvent.StartDateTime).format(
                                    "h:mm a"
                                  )}
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
                    {createdEvent.Title}
                  </McText>
                </View>
              </TitleSection>

              <LocationSection>
                <Ionicons
                  name="location-outline"
                  size={16}
                  style={{ marginRight: 5 }}
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
                  {createdEvent.Location}
                </McText>
              </LocationSection>

              <View>
                <DescriptionSection>
                  <View
                    style={{
                      marginBottom: 8,
                      marginTop: 8,
                      marginRight: 12,
                      marginLeft: 7,
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
                        {createdEvent.Description}
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

                <HostSection>
                  <TouchableOpacity
                    style={{
                      maxWidth: "80%",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                    disabled={true}
                  >
                    <Image
                      style={styles.hostProfilePic}
                      source={{
                        uri: userIDToUser[userToken.UserID]
                          ? userIDToUser[userToken.UserID].Picture
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
                      {userIDToUser[userToken.UserID].DisplayName}
                    </McText>
                    {userIDToUser[userToken.UserID] &&
                      userIDToUser[userToken.UserID].VerifiedOrganization && (
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

                <InterestSection>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  >
                    {interests.map((taglist) => (
                      <View
                        key={taglist.InterestID}
                        style={{
                          borderRadius: 20,
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
                    ))}
                  </ScrollView>
                </InterestSection>

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
                      {createdEvent.Visibility}
                    </McText>
                  </View>
                </VisibilitySection>
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={{ height: insets.bottom + 10 }} />
      </ScrollView>
    </MobileSafeView>
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