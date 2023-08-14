import {
  Feather,
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import React, { useCallback, useContext, useRef, useState } from "react";
import {
  ScrollView,
  View,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import Hyperlink from "react-native-hyperlink";
import { Interest, Event, User, COLORS, SIZES, SCREENS } from "../../constants";
import { McText } from "../Styled";
import styled from "styled-components/native";
import ImageView from "react-native-image-viewing";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CustomError } from "../../constants/error";
import {
  openMaps,
  showBugReportPopup,
  showShareEventLink,
} from "../../helpers/helpers";
import { deleteEvent } from "../../services/EventService";
import { ScreenContext } from "../../contexts/ScreenContext";
import { EventContext } from "../../contexts/EventContext";
import { UserContext } from "../../contexts/UserContext";
import { AlertContext } from "../../contexts/AlertContext";
import { useDispatch, useSelector } from "react-redux";
import { selectUserByID } from "../../redux/users/userSelectors";
import { AppDispatch, RootState } from "../../redux/store";
import { updateUserNumericField } from "../../redux/users/userSlice";
import { setEventMap, updateEventMap } from "../../redux/events/eventSlice";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

interface EventPreviewerProps {
  event: Event;
  interests: Interest[];
  host: User;
  backButtonEnabled: boolean;
  hostClickEnabled: boolean;
  paddingTopEnabled: boolean;
  userControlElement: JSX.Element;
  showModeratorFeatures: boolean;
  refreshControl: JSX.Element;
  hostClickFunction?: () => void;
  backButtonFunction?: () => void;
  postEventFunction?: () => void;
  showShareButton?: boolean;
}

const EventPreviewer = (props: EventPreviewerProps) => {
  const { setLoading } = useContext(ScreenContext);
  const dispatch = useDispatch<AppDispatch>();

  const { userToken } = useContext(UserContext);
  const [descriptionExpanded, setDescriptionExpanded] =
    useState<boolean>(false); // to expand description box
  const [lengthMoreText, setLengthMoreText] = useState<boolean>(false); // to show the "Read more..." & "Read Less"
  const { showErrorAlert } = useContext(AlertContext);
  const [imageViewVisible, setImageViewVisible] = useState<boolean>(false);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const onShareLinkPressed = () => {
    showShareEventLink(
      props.event.EventID,
      props.event.Title,
      props.event.Picture,
      props.event.Description
    );
  };

  const onQRCodePressed = () => {};

  // For description expansion
  const descriptionOnExpand = useCallback((e) => {
    setLengthMoreText(e.nativeEvent.lines.length > 2); //to check the text is more than 4 lines or not
  }, []);
  //To toggle the show text or hide it
  const descriptionToggleNumberOfLines = () => {
    setDescriptionExpanded(!descriptionExpanded);
  };

  const navigation = useNavigation<any>();

  const insets = useSafeAreaInsets();

  const closeBottomModal = () => {
    bottomSheetModalRef.current?.close();
  };

  const onHostPressed = () => {
    if (props.host) {
      if (props.hostClickFunction) {
        props.hostClickFunction();
      } else {
        navigation.push(SCREENS.ProfileDetails, {
          userID: props.host.UserID,
        });
      }
    }
  };

  const onBackPressed = () => {
    if (props.backButtonFunction) {
      props.backButtonFunction();
    } else {
      navigation.goBack();
    }
  };

  const onEditEventPressed = () => {
    if (!props.event) {
      return;
    }
    navigation.push(SCREENS.EditEvent, {
      eventID: props.event.EventID,
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
            deleteEvent(userToken.UserAccessToken, props.event.EventID)
              .then(() => {
                setLoading(false);
                dispatch(
                  setEventMap({ id: props.event.EventID, event: undefined })
                );
                dispatch(
                  updateUserNumericField({
                    id: props.event.HostUserID,
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

  return (
    <BottomSheetModalProvider>
      <ImageView
        images={[
          {
            uri: props.event?.Picture,
          },
        ]}
        imageIndex={0}
        visible={imageViewVisible}
        onRequestClose={() => setImageViewVisible(false)}
      />
      <ScrollView
        style={{ flex: 1, backgroundColor: COLORS.trueBlack }}
        showsVerticalScrollIndicator={false}
        refreshControl={props.refreshControl}
      >
        <View style={{ height: "100%", position: "relative" }}>
          <TouchableOpacity onPress={() => setImageViewVisible(true)}>
            <ImageBackground
              resizeMode="cover"
              source={{
                uri: props.event?.Picture,
              }}
              style={{
                width: "100%",
                height: SIZES.height * 0.45,
              }}
            >
              <View
                style={{
                  flex: 1,
                  marginTop: props.paddingTopEnabled ? insets.top : 0,
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
                      opacity: props.backButtonEnabled ? 1 : 0,
                    }}
                    onPress={onBackPressed}
                    disabled={!props.backButtonEnabled}
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
                          {props.event
                            ? moment(
                                new Date(props.event.StartDateTime)
                              ).format("MMM DD[,] YYYY")
                            : null}
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
                            {props.event
                              ? props.event.EndDateTime
                                ? moment(
                                    new Date(props.event.StartDateTime)
                                  ).format("h:mm a") +
                                  " - " +
                                  moment(
                                    new Date(props.event.EndDateTime)
                                  ).format("h:mm a")
                                : moment(
                                    new Date(props.event.StartDateTime)
                                  ).format("h:mm a")
                              : null}
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
              <View style={{ flex: 1, flexDirection: "row" }}>
                <McText
                  h1
                  style={{
                    flex: 1,
                    marginTop: 10,
                    marginRight: 10,
                  }}
                >
                  {props.event ? props.event.Title : "Loading..."}
                </McText>
                {props.showShareButton && (
                  <TouchableOpacity
                    onPress={() => {
                      bottomSheetModalRef.current?.present();
                    }}
                  >
                    <Feather
                      style={{ marginLeft: 10, marginTop: 15, marginRight: 10 }}
                      name="share"
                      size={24}
                      color={COLORS.lightGray}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </TitleSection>

            <TouchableOpacity onPress={() => openMaps(props.event?.Location)}>
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
                  {props.event?.Location}
                </McText>
              </LocationSection>
            </TouchableOpacity>

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
                      {props.event?.Description}
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
                  onPress={onHostPressed}
                  disabled={!props.hostClickEnabled}
                >
                  <Image
                    style={styles.hostProfilePic}
                    source={{
                      uri: props.host?.Picture,
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
                    {props.host ? props.host.DisplayName : "Loading..."}
                  </McText>
                  {props.host?.VerifiedOrganization && (
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
                  {props.interests &&
                    props.interests.map((taglist) => (
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
                    {props.event?.Visibility}
                  </McText>
                </View>
              </VisibilitySection>
            </View>
          </View>
          {props.showModeratorFeatures && props.interests && props.event && (
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
          {props.postEventFunction && (
            <TouchableOpacity
              onPress={props.postEventFunction}
              style={{
                marginTop: 15,
                marginHorizontal: 30,
                paddingVertical: 10,
                borderRadius: 8,
                backgroundColor: COLORS.purple,
              }}
            >
              <McText h4 style={{ textAlign: "center" }}>
                Post Event
              </McText>
            </TouchableOpacity>
          )}
          {props.userControlElement ? (
            <SectionFooter>
              <View
                style={{
                  height: 170 + insets.bottom,
                }}
              ></View>
            </SectionFooter>
          ) : (
            <View style={{ height: insets.bottom + 30 }} />
          )}
        </View>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={["30%"]}
          backgroundComponent={({ style }) => (
            <View
              style={[
                style,
                {
                  backgroundColor: "rgba(20,20,20,.90)",
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                },
              ]}
            />
          )}
          stackBehavior={"replace"}
          handleComponent={() => (
            <View
              style={{
                width: 40,
                height: 5,
                borderRadius: 400,
                marginTop: 10,
                marginBottom: 20,
                backgroundColor: COLORS.gray,
                alignSelf: "center",
              }}
            />
          )} // Use your custom handle component here
        >
          <BottomSheetView style={styles.bottomView}>
            <TouchableOpacity
              onPress={() => {
                closeBottomModal();
                onShareLinkPressed();
              }}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <MaterialIcons
                name="link"
                style={{ marginHorizontal: 20 }}
                size={32}
                color="white"
              />
              <McText body2 color={COLORS.white}>
                Share link
              </McText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                closeBottomModal();
                onQRCodePressed();
              }}
              style={{ marginTop: 10, flexDirection: "row", alignItems: "center" }}
            >
              <MaterialIcons
                name="qr-code-2"
                style={{ marginHorizontal: 20 }}
                size={32}
                color="white"
              />
              <McText body2 color={COLORS.white}>
                Share QR code
              </McText>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheetModal>
      </ScrollView>
      {props.userControlElement}
    </BottomSheetModalProvider>
  );
};

export default EventPreviewer;

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
  bottomView: {
    flex: 1,
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
  margin: 10px 0px 0px 20px;
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
