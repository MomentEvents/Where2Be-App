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
import { EventContext } from "../contexts/EventContext";

type EventCardProps = {
  onClick?: () => void;
  event: Event;
  isBigCard?: boolean;
  width?: number;
  height?: number;
  showRelativeTime?: boolean;
};

const EventCard = ({
  onClick,
  event,
  isBigCard,
  width,
  height,
  showRelativeTime,
}: EventCardProps) => {
  const { userToken, currentUser, isLoggedIn } = useContext(UserContext);
  const {
    eventIDToEvent,
    updateEventIDToEvent,
    eventIDToDidJoin,
    updateEventIDToDidJoin,
    eventIDToDidShoutout,
    updateEventIDToDidShoutout,
  } = useContext(EventContext);

  const [fetchedEvent, setFetchedEvent] = useState(false);
  const [fetchedDidUserShoutout, setFetchedDidUserShoutout] = useState(false);
  const [fetchedDidUserJoin, setFetchedDidUserJoin] = useState(false);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const cardWidth = width ? width : isBigCard ? 330 : 160;
  const cardHeight = height ? height : isBigCard ? 240 : 210;

  const cardBorderRadius = 7;
  const cardBorderWidth = 1;
  const cardBorderColor = COLORS.gray2;

  const onPressCard = () => {
    if (onClick !== undefined) {
      onClick();
      return;
    }

    Navigator.navigate(SCREENS.EventDetails, {
      eventID: event.EventID,
    });
    // Navigate to event details page
  };

  const pullData = async () => {
    updateEventIDToEvent({ id: event.EventID, event: event });
    setFetchedEvent(true);
    if (isLoggedIn) {

      getUserJoinEvent(
        userToken.UserAccessToken,
        currentUser.UserID,
        event.EventID
      )
        .then((didJoin: boolean) => {
          updateEventIDToDidJoin({ id: event.EventID, didJoin: didJoin });
        })
        .catch((error: Error) => {
          console.log(error);
        });
      getUserShoutoutEvent(
        userToken.UserAccessToken,
        currentUser.UserID,
        event.EventID
      )
        .then((didShoutout: boolean) => {
          updateEventIDToDidShoutout({
            id: event.EventID,
            didShoutout: didShoutout,
          });
        })
        .catch((error: Error) => {
          console.log(error);
        });
    } else {
      updateEventIDToDidJoin({ id: event.EventID, didJoin: false });
      setFetchedDidUserJoin(true);
      updateEventIDToDidShoutout({ id: event.EventID, didShoutout: false });
      setFetchedDidUserShoutout(true);
    }
  };

  // First time being loaded and rendered
  useEffect(() => {
    pullData();
  }, []);

  useEffect(() => {
    setIsLoaded(
        fetchedEvent
    );
  }, [
    fetchedDidUserJoin,
    fetchedDidUserShoutout,
    fetchedEvent,
  ]);

  if (!isLoaded || eventIDToEvent[event.EventID] === undefined) {
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
            borderWidth: cardBorderWidth,
            borderColor: cardBorderColor,
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
            borderWidth: cardBorderWidth,
            borderColor: cardBorderColor,
            backgroundColor: "rgba(0,0,0,.5)",
          }}
        />
      </View>
    );
  }

  if (isBigCard) {
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
            source={{ uri: eventIDToEvent[event.EventID].Picture }}
            style={{
              height: cardHeight,
              width: cardWidth,
              borderRadius: cardBorderRadius,
              borderWidth: cardBorderWidth,
              borderColor: cardBorderColor,
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
              borderWidth: cardBorderWidth,
              borderColor: cardBorderColor,
            }}
          />
          <View
            style={{
              flex: 1,
              position: "absolute",
              top: cardBorderWidth,
              left: cardBorderWidth,
              width: cardWidth - cardBorderWidth * 2,
              height: cardHeight - cardBorderWidth * 2,
            }}
          >
            <LinearGradient
              colors={["transparent", COLORS.trueBlack]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1.1 }}
              style={{ borderRadius: cardBorderRadius - 1, height: "100%" }}
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
                {eventIDToEvent[event.EventID].Title}
              </McText>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <McText
                  h3
                  style={{
                    color: COLORS.purple,
                    opacity: 1,
                    marginTop: 4,
                    letterSpacing: 0.6,
                    marginRight: 8,
                  }}
                >
                  {showRelativeTime
                    ? moment(
                        eventIDToEvent[event.EventID].StartDateTime
                      ).fromNow()
                    : moment(
                        eventIDToEvent[event.EventID].StartDateTime
                      ).format("MMM DD")}
                </McText>
                <McText
                  h3
                  style={{
                    color: COLORS.lightGray,
                    opacity: 1,
                    marginTop: 4,
                    letterSpacing: 0.6,
                    marginRight: 4,
                  }}
                >
                  {showRelativeTime ? (
                    <></>
                  ) : (
                    moment(eventIDToEvent[event.EventID].StartDateTime).format(
                      "h:mm a"
                    )
                  )}
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
                      tintColor: eventIDToDidJoin[event.EventID]
                        ? COLORS.purple
                        : COLORS.lightGray,
                      marginRight: 10,
                    }}
                  />
                  <McText
                    body7
                    style={{
                      marginTop: 2,
                      marginLeft: -7,
                      marginRight: 10,
                      color: eventIDToDidJoin[event.EventID]
                        ? COLORS.purple
                        : COLORS.lightGray,
                    }}
                  >
                    {eventIDToEvent[event.EventID].NumJoins}
                  </McText>
                  <McIcon
                    source={icons.shoutout}
                    size={20}
                    style={{
                      tintColor: eventIDToDidShoutout[event.EventID]
                        ? COLORS.purple
                        : COLORS.lightGray,
                      marginRight: 10,
                    }}
                  />
                  <McText
                    body7
                    style={{
                      marginTop: 2,
                      marginLeft: -7,
                      marginRight: 10,
                      color: eventIDToDidShoutout[event.EventID]
                        ? COLORS.purple
                        : COLORS.lightGray,
                    }}
                  >
                    {eventIDToEvent[event.EventID].NumShoutouts}
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
          source={{ uri: eventIDToEvent[event.EventID].Picture }}
          blurRadius={0}
          style={{
            height: cardHeight,
            width: cardWidth,
            borderRadius: cardBorderRadius,
            borderWidth: cardBorderWidth,
            borderColor: cardBorderColor,
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
            borderWidth: cardBorderWidth,
            borderColor: cardBorderColor,
          }}
        />
        <View
          style={{
            flex: 1,
            position: "absolute",
            top: cardBorderWidth,
            left: cardBorderWidth,
            width: cardWidth - cardBorderWidth * 2,
            height: cardHeight - cardBorderWidth * 2,
          }}
        >
          <LinearGradient
            colors={["transparent", COLORS.trueBlack]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1.1 }}
            style={{ borderRadius: cardBorderRadius - 1, height: "100%" }}
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
            <McText h3 numberOfLines={2}>
              {eventIDToEvent[event.EventID].Title}
            </McText>
            <View style={{flexDirection: "row"}}>
              <McText
                h5
                style={{
                  color: COLORS.purple,
                  letterSpacing: 0.4,
                }}
              >
                {moment(eventIDToEvent[event.EventID].StartDateTime).format(
                  "MMM DD"
                )}
              </McText>
              <McText
                body4
                style={{
                  color: COLORS.lightGray,
                  letterSpacing: 0.4,
                  marginLeft: 4,
                }}
              >
                {moment(eventIDToEvent[event.EventID].StartDateTime).format(
                  "h:mm a"
                )}
              </McText>
            </View>
            <View
              style={{
                flexDirection: "row",
              }}
            >
              <McIcon
                source={icons.check}
                size={20}
                style={{
                  tintColor: eventIDToDidJoin[event.EventID]
                    ? COLORS.purple
                    : COLORS.lightGray,
                  marginRight: 10,
                }}
              />
              <McText
                body7
                style={{
                  marginTop: 2,
                  marginLeft: -7,
                  marginRight: 10,
                  color: eventIDToDidJoin[event.EventID]
                    ? COLORS.purple
                    : COLORS.lightGray,
                }}
              >
                {eventIDToEvent[event.EventID].NumJoins}
              </McText>
              <McIcon
                source={icons.shoutout}
                size={20}
                style={{
                  tintColor: eventIDToDidShoutout[event.EventID]
                    ? COLORS.purple
                    : COLORS.lightGray,
                  marginRight: 10,
                }}
              />
              <McText
                body7
                style={{
                  marginTop: 2,
                  marginLeft: -7,
                  marginRight: 10,
                  color: eventIDToDidShoutout[event.EventID]
                    ? COLORS.purple
                    : COLORS.lightGray,
                }}
              >
                {eventIDToEvent[event.EventID].NumShoutouts}
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
