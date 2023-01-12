//import React from 'react';
import React, { useState, useEffect, useContext } from "react";
import {
  TouchableHighlight,
  View,
  StyleSheet,
  ImageBackground,
  Image,
  ActivityIndicator,
} from "react-native";
import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";

import { SIZES, COLORS, icons, SCREENS } from "../constants";
import { McText, McIcon } from "./Styled";
import "react-native-gesture-handler";
import * as Navigator from "../navigation/Navigator";
import { Event } from "../constants";
import { UserContext } from "../contexts/UserContext";
import {
  getEventNumJoins,
  getEventNumShoutouts,
} from "../services/EventService";
import {
  getUserJoinEvent,
  getUserShoutoutEvent,
} from "../services/UserService";
import { displayError } from "../helpers/helpers";

type EventCardProps = {
  onClick?: () => void;
  event: Event;
  isBigCard: boolean;
};

const EventCard = ({ onClick, event, isBigCard }: EventCardProps) => {
  const { userToken, currentUser, isLoggedIn } = useContext(UserContext);
  const [selectedEvent, setSelectedEvent] = useState<Event>(event);
  const [joins, setJoins] = useState<number>(null);
  const [shoutouts, setShoutouts] = useState<number>(null);
  const [userJoined, setUserJoined] = useState<boolean>(null);
  const [userShouted, setUserShouted] = useState<boolean>(null);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const cardWidth = isBigCard ? SIZES.width - 20 : 160;
  const cardHeight = isBigCard ? SIZES.height / 3 : 230;
  const cardBorderRadius = 10;

  const onPressCard = () => {
    console.log(isBigCard)
    if (onClick !== undefined) {
      onClick();
      return;
    }

    Navigator.navigate(SCREENS.EventDetails, {EventID: selectedEvent.EventID, getCardEvent: getCardEvent, updateCardValues: updateCardValues})
    // Navigate to event details page
  };

  const updateCardValues = (
    updatedEvent: Event,
    userJoined: boolean,
    userShouted: boolean,
    numJoins: number,
    numShoutouts: number
  ) => {
    console.log("updating card values")
    console.log(updatedEvent)
    setSelectedEvent(updatedEvent);
    setUserJoined(userJoined);
    setJoins(numJoins);
    setUserShouted(userShouted);
    setShoutouts(numShoutouts);
  };

  const getCardEvent = (): Event => {
    return selectedEvent
  }

  const pullJoinAndShoutoutData = async () => {
    setJoins(await getEventNumJoins(selectedEvent.EventID));
    setShoutouts(await getEventNumShoutouts(selectedEvent.EventID));
    if (isLoggedIn) {
      setUserJoined(
        await getUserJoinEvent(
          userToken.UserAccessToken,
          currentUser.UserID,
          selectedEvent.EventID
        ).catch((error: Error) => {
          console.log(error);
          return null;
        })
      );
      setUserShouted(
        await getUserShoutoutEvent(
          userToken.UserAccessToken,
          currentUser.UserID,
          selectedEvent.EventID
        ).catch((error: Error) => {
          console.log(error);
          return null;
        })
      );
    } else {
      setUserJoined(false);
      setUserShouted(false);
    }
  };

  // First time being loaded and rendered
  useEffect(() => {
    pullJoinAndShoutoutData();
  }, []);

  useEffect(() => {
    setIsLoaded(
      joins !== null &&
        shoutouts !== null &&
        userJoined !== null &&
        userShouted !== null
    );
  }, [joins, shoutouts, userJoined, userShouted]);

  if (!isLoaded) {
    return (
      <View
        style={{
          height: cardHeight,
          width: cardWidth,
          borderRadius: cardBorderRadius,
        }}
      >
        <Image
          style={{
            height: cardHeight,
            width: cardWidth,
            borderRadius: cardBorderRadius,
            borderWidth: 2,
            borderColor: COLORS.white,
            overlayColor: COLORS.trueBlack,
          }}
        />
        <ActivityIndicator
          style={{
            flex: 1,
            position: "absolute",
            top: 0,
            left: 0,
            height: cardHeight,
            width: cardWidth,
            borderRadius: cardBorderRadius,
            borderWidth: 2,
            borderColor: COLORS.white,
            backgroundColor: "rgba(0,0,0,.5)",
          }}
        />
      </View>
    );
  }

  console.log("Card is loaded");
  if (isBigCard) {
    return (
      <TouchableHighlight
        onPress={onPressCard}
        style={{
          borderRadius: cardBorderRadius,
          borderColor: COLORS.gray,
        }}
      >
        <View
          style={{
            height: cardHeight,
            width: cardWidth,
            borderRadius: cardBorderRadius,
          }}
        >
          <Image
            source={{ uri: selectedEvent.Picture }}
            blurRadius={3}
            style={{
              height: cardHeight,
              width: cardWidth,
              borderRadius: cardBorderRadius,
              borderWidth: 2,
              borderColor: COLORS.white,
            }}
          />
          <View
            style={{
              flex: 1,
              position: "absolute",
              top: 0,
              left: 0,
              height: cardHeight,
              width: cardWidth,
              borderRadius: cardBorderRadius,
              borderWidth: 2,
              borderColor: COLORS.white,
              backgroundColor: "rgba(0,0,0,.5)",
            }}
          />
          <View
            style={{
              flex: 1,
              position: "absolute",
              top: 2,
              left: 2,
              width: cardWidth - 4,
              height: cardHeight - 4,
            }}
          >
            <LinearGradient
              colors={["transparent", COLORS.trueBlack]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 0.9 }}
              style={{ borderRadius: cardBorderRadius, height: "100%" }}
            ></LinearGradient>

            <View
              style={{
                flexDirection: "column",
                justifyContent: "flex-end",
                position: "absolute",
                marginHorizontal: 15,
                marginVertical: 15,
                bottom: 0,
                left: 0,
                width: cardWidth - 30,
              }}
            >
              <McText h1 numberOfLines={2}>
                {selectedEvent.Title}
              </McText>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <McText
                  h3
                  style={{
                    color: COLORS.white,
                    opacity: 0.8,
                    marginTop: 4,
                    letterSpacing: 1.2,
                    marginRight: 4,
                  }}
                >
                  {moment(selectedEvent.StartDateTime)
                    .format("MMM DD")
                    .toUpperCase()}
                </McText>
                <McText
                  h3
                  style={{
                    color: COLORS.purple,
                    opacity: 0.9,
                    marginTop: 4,
                    letterSpacing: 1.2,
                  }}
                >
                  {moment(selectedEvent.StartDateTime)
                    .format("hh:mm A")
                    .toUpperCase()}
                </McText>
                <View
                  style={{
                    flexDirection: "row",
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                  }}
                >
                  <McIcon
                    source={icons.check}
                    size={20}
                    style={{
                      tintColor: userJoined ? COLORS.purple : COLORS.lightGray,
                      marginRight: 10,
                    }}
                  />
                  <McText
                    body7
                    style={{
                      marginTop: 2,
                      marginLeft: -7,
                      marginRight: 10,
                      color: userJoined ? COLORS.purple : COLORS.lightGray,
                    }}
                  >
                    {joins}
                  </McText>
                  <McIcon
                    source={icons.shoutout}
                    size={20}
                    style={{
                      tintColor: userShouted ? COLORS.purple : COLORS.lightGray,
                      marginRight: 10,
                    }}
                  />
                  <McText
                    body7
                    style={{
                      marginTop: 2,
                      marginLeft: -7,
                      marginRight: 10,
                      color: userShouted ? COLORS.purple : COLORS.lightGray,
                    }}
                  >
                    {shoutouts}
                  </McText>
                </View>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    );
  }

  // Small card

  return (
    <TouchableHighlight
      onPress={onPressCard}
      style={{
        borderRadius: cardBorderRadius,
      }}
    >
      <View
        style={{
          height: cardHeight,
          width: cardWidth,
          borderRadius: cardBorderRadius,
        }}
      >
        <Image
          source={{ uri: selectedEvent.Picture }}
          blurRadius={3}
          style={{
            height: cardHeight,
            width: cardWidth,
            borderRadius: cardBorderRadius,
            borderWidth: 2,
            borderColor: COLORS.white,
          }}
        />
        <View
          style={{
            flex: 1,
            position: "absolute",
            top: 0,
            left: 0,
            height: cardHeight,
            width: cardWidth,
            borderRadius: cardBorderRadius,
            borderWidth: 2,
            borderColor: COLORS.white,
            backgroundColor: "rgba(0,0,0,.5)",
          }}
        />
        <View
          style={{
            flex: 1,
            position: "absolute",
            top: 2,
            left: 2,
            width: cardWidth - 4,
            height: cardHeight - 4,
          }}
        >
          <LinearGradient
            colors={["transparent", COLORS.trueBlack]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 0.9 }}
            style={{ borderRadius: cardBorderRadius - 2, height: "100%" }}
          ></LinearGradient>

          <View
            style={{
              flexDirection: "column",
              justifyContent: "flex-end",
              position: "absolute",
              marginHorizontal: 10,
              marginVertical: 10,
              bottom: 0,
              left: 0,
              width: cardWidth - 20,
            }}
          >
            <McText h4 numberOfLines={2}>
              {selectedEvent.Title}
            </McText>
            <McText
              body3
              style={{
                color: COLORS.white,
                opacity: 0.8,
              }}
            >
              {moment(selectedEvent.StartDateTime).format("MMM DD h:mm A")}
            </McText>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <McIcon
                source={icons.check}
                size={20}
                style={{
                  tintColor: userJoined ? COLORS.purple : COLORS.lightGray,
                  marginRight: 10,
                }}
              />
              <McText
                body7
                style={{
                  marginTop: 2,
                  marginLeft: -7,
                  marginRight: 10,
                  color: userJoined ? COLORS.purple : COLORS.lightGray,
                }}
              >
                {joins}
              </McText>
              <McIcon
                source={icons.shoutout}
                size={20}
                style={{
                  tintColor: userShouted ? COLORS.purple : COLORS.lightGray,
                  marginRight: 10,
                }}
              />
              <McText
                body7
                style={{
                  marginTop: 2,
                  marginLeft: -7,
                  marginRight: 10,
                  color: userShouted ? COLORS.purple : COLORS.lightGray,
                }}
              >
                {shoutouts}
              </McText>
            </View>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default EventCard;

const styles = StyleSheet.create({});
