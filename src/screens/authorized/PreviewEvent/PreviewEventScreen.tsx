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
import { McIcon, McText } from "../../../components/Styled";
import moment from "moment";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import ImageView from "react-native-image-viewing";
import { UserContext } from "../../../contexts/UserContext";
import { displayError } from "../../../helpers/helpers";
import { EventContext } from "../../../contexts/EventContext";
import { createEvent } from "../../../services/EventService";
import { getEventInterestsByEventId } from "../../../services/InterestService";
import GradientButton from "../../../components/Styled/GradientButton";
import SectionHeader from "../../../components/Styled/SectionHeader";
import MobileSafeView from "../../../components/Styled/MobileSafeView";
import { useNavigation } from "@react-navigation/native";

type routeParametersType = {
  createdEvent: Event;
  base64Image: string;
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
    eventIDToInterests,
    updateEventIDToInterests,
  } = useContext(EventContext);

  const navigation = useNavigation<any>();

  const { createdEvent, interests, base64Image } = propsFromEventCard;

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
    createEvent(userToken.UserAccessToken, createdEventBase64, interests)
      .then((eventID: string) => {
        setLoading(false);
        updateEventIDToEvent({ id: eventID, event: createdEvent });
        navigation.popToTop();
        navigation.push(SCREENS.EventDetails, { eventID: eventID });
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
    <MobileSafeView isBottomViewable={true} style={styles.container}>
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
        style={{ flex: 1, backgroundColor: COLORS.black }}
        showsVerticalScrollIndicator={false}
      >
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
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <icons.calendar_eventdetails style={{ marginRight: 8 }} />
                      <McText
                        h4
                        style={{
                          letterSpacing: 0.1,
                          color: COLORS.lightGray,
                        }}
                      >
                        {createdEvent === undefined
                          ? null
                          : moment(createdEvent.StartDateTime).format(
                              "MMM DD[,] YYYY"
                            )}
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
                          {createdEvent === undefined
                            ? null
                            : moment(createdEvent.StartDateTime).format(
                                "h:mm a"
                              ) +
                              " - " +
                              moment(createdEvent.EndDateTime).format("h:mm a")}
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
                  marginTop: 10,
                }}
              >
                {createdEvent === undefined ? null : createdEvent.Title}
              </McText>
            </TitleSection>
            <InterestSection>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                {interests
                  ? interests.map((taglist) => (
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
                    color: COLORS.white,
                  }}
                >
                  {currentUser === null ? (
                    <ActivityIndicator style={{ marginLeft: 10 }} />
                  ) : (
                    currentUser.DisplayName
                  )}
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
                  style={{ letterSpacing: 0.7, color: COLORS.lightGray }}
                  selectable={true}
                >
                  {createdEvent === undefined ? null : createdEvent.Description}
                </McText>
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
                  letterSpacing: 0.5,
                  marginTop: -1,
                  color: COLORS.lightGray,
                }}
              >
                {createdEvent === undefined ? null : createdEvent.Location}
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
                  {createdEvent === undefined
                    ? null
                    : createdEvent.Visibility
                    ? "Public"
                    : "Private"}
                </McText>
              </View>
            </VisibilitySection>
          </View>
        </View>
        <View style={{ height: SIZES.bottomBarHeight }} />
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
