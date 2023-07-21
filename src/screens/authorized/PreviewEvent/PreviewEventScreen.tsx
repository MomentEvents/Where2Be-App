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
import EventPreviewer from "../../../components/EventPreviewer/EventPreviewer";

type routeParametersType = {
  createdEvent: Event;
  base64Image: string;
  interests: Interest[];
  doNotifyFollowers: boolean;
};

const EventDetailsScreen = ({ route }) => {
  const { isLoggedIn, userToken, userIDToUser, updateUserIDToUser } =
    useContext(UserContext);

  const { didHostedEventsChangeRef, newPostedEventHomePageRef } =
    useContext(EventContext);

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
        const eventWithID = { ...createdEvent, EventID: eventID };
        updateUserIDToUser({
          id: userToken.UserID,
          user: {
            ...userIDToUser[userToken.UserID],
            NumEvents: userIDToUser[userToken.UserID].NumEvents + 1,
          },
        });
        newPostedEventHomePageRef.current = eventWithID;
        updateEventIDToEvent({ id: eventID, event: eventWithID });
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
      <EventPreviewer
        event={createdEvent}
        interests={interests}
        host={userIDToUser[userToken.UserID]}
        backButtonEnabled={false}
        hostClickEnabled={false}
        paddingTopEnabled={false}
        userControlElement={undefined}
        showModeratorFeatures={false}
        refreshControl={undefined}
      />
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
