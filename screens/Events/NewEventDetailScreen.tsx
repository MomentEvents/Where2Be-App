import {
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { LoadingContext } from "../../Contexts/LoadingContext";
import { COLORS, SIZES, icons } from "../../constants";
import { Event } from "../../Services/EventService";
import { User } from "../../Services/UserService";
import { Interest } from "../../Services/InterestService";
import { LinearGradient } from "expo-linear-gradient";
import * as RootNavigation from "../../navigation/RootNavigation";
import { McIcon, McText } from "../../components";
import moment from "moment";
import styled from "styled-components/native";
import { SafeAreaView } from "react-native-safe-area-context";
import ImageView from "react-native-image-viewing";

/*********************************************
 * route parameters:
 *
 * EventID: string,
 * SetCardLikes?: React.SetStateAction<number>,
 * SetCardShoutouts?: React.SetStateAction<number>,
 * SetCardUserLiked?: React.SetStateAction<boolean>,
 * SetCardUserShouted?: React.SetStateAction<boolean>
 */

const NewEventDetailScreen = ({ route }) => {
  // Props from previous event card to update
  const propsFromEventCard = route.params;

  // Loading context in case we want to disable the screen
  const { setLoading } = useContext(LoadingContext);

  const [viewedEvent, setViewedEvent] = useState<Event>();
  const [host, setHost] = useState<User>();
  const [tags, setTags] = useState<Interest[]>();
  const [likes, setLikes] = useState<number>();
  const [shoutouts, setShoutouts] = useState<number>();
  const [userLiked, setUserLiked] = useState<boolean>();
  const [userShouted, setUserShouted] = useState<boolean>();
  const [isHost, setIsHost] = useState<boolean>();
  const [descriptionExpanded, setDescriptionExpanded] =
    useState<boolean>(false); // to expand description box
  const [lengthMoreText, setLengthMoreText] = useState<boolean>(false); // to show the "Read more..." & "Read Less"
  const [imageViewVisible, setImageViewVisible] = useState<boolean>(false);

  const addUserLike = () => {};

  const addUserShoutout = () => {};

  const removeUserLike = () => {};

  const removeUserShoutout = () => {};

  // For description expandion
  const onTextLayout = useCallback((e) => {
    setLengthMoreText(e.nativeEvent.lines.length > 2); //to check the text is more than 4 lines or not
  }, []);

  const toggleNumberOfLines = () => {
    //To toggle the show text or hide it
    setDescriptionExpanded(!descriptionExpanded);
  };

  const pullData = () => {
    // Disable the screen
    setLoading(true);

    const pulledEvent: Event = {
      EventID: "1373",
      Title: "Wassup this is my title",
      Description: "This is our description\nh\nh\nh\nh\n\n\n Hi",
      Picture:
        "https://test-bucket-chirag5241.s3.us-west-1.amazonaws.com/test_image.jpeg",
      Location: "Hi",
      StartDateTime: new Date(),
      EndDateTime: undefined,
      Visibility: false,
    };
    setViewedEvent(pulledEvent);

    const pulledTags: Interest[] = [
      {
        InterestID: "abcde",
        Name: "Interest 1",
        Category: "Interest 1 Category",
      },
      {
        InterestID: "fghijk",
        Name: "Interest 2",
        Category: "Interest 2 Category",
      },
    ];
    setTags(pulledTags);

    const pulledHost: User = {
      UserID: "ABCDE",
      Name: "Kyle Wade",
      Username: "kyle1373",
      Email: "kwade@ucsd.edu",
      Picture:
        "https://test-bucket-chirag5241.s3.us-west-1.amazonaws.com/test_image.jpeg",
    };
    setHost(pulledHost);

    const pulledLikes: number = 20;
    setLikes(pulledLikes);

    const pulledShoutouts: number = 21;
    setShoutouts(pulledShoutouts);

    const pulledUserLiked: boolean = false;
    setUserLiked(pulledUserLiked);

    const pulledUserShouted: boolean = false;
    setUserShouted(pulledUserShouted);

    // setIsHost(pulledHost.UserID === UserID)

    // Set previous event card shoutouts
    propsFromEventCard.SetCardLikes !== undefined
      ? propsFromEventCard.SetCardLikes(pulledLikes)
      : {};
    propsFromEventCard.SetCardLikes !== undefined
      ? propsFromEventCard.SetCardUserLiked(pulledUserLiked)
      : {};
    propsFromEventCard.SetCardShoutouts !== undefined
      ? propsFromEventCard.SetCardShoutouts(pulledShoutouts)
      : {};
    propsFromEventCard.SetCardLikes !== undefined
      ? propsFromEventCard.SetCardUserShouted(pulledUserShouted)
      : {};

    setLoading(false);
  };
  useEffect(() => {
    pullData();
  }, []);
  return (
    <View style={styles.container}>
      <ImageView
        images={[
          { uri: viewedEvent === undefined ? null : viewedEvent.Picture },
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
          >
            <ImageBackground
              resizeMode="cover"
              source={{
                uri: viewedEvent === undefined ? null : viewedEvent.Picture,
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
                      RootNavigation.goBack();
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
                    <McIcon
                      source={icons.back_arrow}
                      style={{
                        tintColor: COLORS.white,
                        marginLeft: 8,
                      }}
                      size={24}
                    />
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
                            {viewedEvent === undefined
                              ? null
                              : moment(viewedEvent.StartDateTime)
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
                            {viewedEvent === undefined
                              ? null
                              : moment(viewedEvent.StartDateTime).format(
                                  "h:mm A"
                                )}
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
                  {viewedEvent === undefined ? null : viewedEvent.Title}
                </McText>
              </TitleSection>
              <InterestSection>
                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  {tags === undefined
                    ? null
                    : tags.map((taglist) => (
                        <View
                          style={{
                            width: taglist.Name.length * 9 + 15,
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
                            {taglist.Name}
                          </McText>
                        </View>
                      ))}
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
                    RootNavigation.push("ProfileDetail", {
                      UserID: host.UserID,
                    });
                  }}
                >
                  <Image
                    style={styles.hostProfilePic}
                    source={{ uri: host === undefined ? null : host.Picture }}
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
                    {host === undefined ? null : host.Name}
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
                    onTextLayout={onTextLayout}
                    numberOfLines={descriptionExpanded ? undefined : 3}
                    body3
                    selectable={true}
                  >
                    {viewedEvent === undefined ? null : viewedEvent.Description}
                  </McText>
                  {lengthMoreText ? (
                    <McText
                      onPress={toggleNumberOfLines}
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
                  {viewedEvent === undefined ? null : viewedEvent.Location}
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
                    {viewedEvent === undefined
                      ? null
                      : viewedEvent.Visibility
                      ? "Public"
                      : "Private"}
                  </McText>
                </View>
              </VisibilitySection>
              <EditOrDeleteEventSection>
                <TouchableOpacity
                  style={styles.edit}
                  onPress={() => {
                    // updateData(selectedEvent)
                    RootNavigation.navigate("EditEvent", {
                      SelectedEvent: viewedEvent,
                    });
                    // updateData(selectedEvent);
                  }}
                >
                  <McText h5>Edit this Event</McText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.delete}
                  onPress={() => {
                    // updateData(selectedEvent)
                    RootNavigation.navigate("EditEvent", {
                      SelectedEvent: viewedEvent,
                    });
                    // updateData(selectedEvent);
                  }}
                >
                  <McText h5>Delete this Event</McText>
                </TouchableOpacity>
              </EditOrDeleteEventSection>
              <SectionFooter>
                <View
                  style={{
                    height: 120,
                  }}
                ></View>
              </SectionFooter>
            </View>
          </ScrollView>
          <View style={styles.userControlContainer}>
            <UserOptionsSection>
              <View
                style={{
                  alignItems: "center",
                  marginRight: 60,
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 80,
                    backgroundColor: userLiked ? COLORS.purple : "transparent",
                    borderWidth: 1,
                    borderColor: COLORS.gray,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPressOut={() => {
                    userLiked ? removeUserLike() : addUserLike();

                    // console.log(selectedEvent)
                  }}
                >
                  <McIcon
                    source={icons.check}
                    size={32}
                    style={{
                      tintColor: userLiked ? COLORS.white : COLORS.gray,
                      marginHorizontal: 44,
                    }}
                  />
                </TouchableOpacity>
                <McText body3>Join</McText>
              </View>
              <View
                style={{
                  alignItems: "center",
                }}
              >
                <TouchableOpacity
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 80,
                    borderWidth: 1,
                    borderColor: COLORS.gray,
                    backgroundColor: userShouted
                      ? COLORS.purple
                      : "transparent",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  onPress={() => {
                    userShouted ? removeUserShoutout() : addUserShoutout();
                  }}
                >
                  <McIcon
                    source={icons.shoutout}
                    size={32}
                    style={{
                      tintColor: userShouted ? COLORS.white : COLORS.gray,
                    }}
                  />
                </TouchableOpacity>
                <McText body3>ShoutOut</McText>
              </View>
            </UserOptionsSection>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default NewEventDetailScreen;

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
    height: 100,
    borderTopWidth: .5,
    borderColor: COLORS.gray,
    backgroundColor: COLORS.black,
    opacity: .9,
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
    borderRadius: 14,
    alignItems: "center",
    height: 35,
    marginRight: 10,
    justifyContent: "center",
  },
  delete: {
    backgroundColor: COLORS.red,
    width: SIZES.width / 2.5,
    padding: 8,
    borderRadius: 14,
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
  width: ${SIZES.width};
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
