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

const EventCard = ({ onClick, event, isBigCard, width, height, showRelativeTime }: EventCardProps) => {
  const { userToken, currentUser, isLoggedIn } = useContext(UserContext);
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
  } = useContext(EventContext);

  const [fetchedEvent, setFetchedEvent] = useState(false);
  const [fetchedDidUserShoutout, setFetchedDidUserShoutout] = useState(false);
  const [fetchedDidUserJoin, setFetchedDidUserJoin] = useState(false);
  const [fetchedShoutouts, setFetchedShoutouts] = useState(false);
  const [fetchedJoins, setFetchedJoins] = useState(false);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const cardWidth = width ? width : isBigCard ? 310 : 150;
  const cardHeight = height ? height : isBigCard ? 240 : 210;

  const cardBorderRadius = 7;
  const cardBorderWidth = 1;
  const cardBorderColor = COLORS.gray;

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

    await getEventNumJoins(event.EventID)
      .then((joins: number) => {
        updateEventIDToJoins({ id: event.EventID, joins: joins });
        setFetchedJoins(true);
      })
      .catch((error: Error) => {
        console.log(error);
      });

    await getEventNumShoutouts(event.EventID)
      .then((shoutouts: number) => {
        updateEventIDToShoutouts({ id: event.EventID, shoutouts: shoutouts });
        setFetchedShoutouts(true);
      })
      .catch((error: Error) => {
        console.log(error);
      });

    if (isLoggedIn) {
      console.log("Going to is logged in");

      getUserJoinEvent(
        userToken.UserAccessToken,
        currentUser.UserID,
        event.EventID
      )
        .then((didJoin: boolean) => {
          console.log("updated didJoin for " + event.Title);
          updateEventIDToDidJoin({ id: event.EventID, didJoin: didJoin });
          setFetchedDidUserJoin(true);
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
          setFetchedDidUserShoutout(true);
        })
        .catch((error: Error) => {
          console.log("updated didShoutout for " + event.Title);
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
      fetchedJoins &&
        fetchedDidUserJoin &&
        fetchedShoutouts &&
        fetchedDidUserShoutout &&
        fetchedEvent
    );
  }, [
    fetchedJoins,
    fetchedDidUserJoin,
    fetchedShoutouts,
    fetchedDidUserShoutout,
    fetchedEvent,
  ]);

  if (
    !isLoaded || eventIDToEvent[event.EventID] === undefined
  ) {
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
                    color: COLORS.white,
                    opacity: 0.8,
                    marginTop: 4,
                    letterSpacing: 1.2,
                    marginRight: 4,
                  }}
                >
                  {showRelativeTime ? moment(eventIDToEvent[event.EventID].StartDateTime).fromNow() : 
                    moment(eventIDToEvent[event.EventID].StartDateTime)
                    .format("MMM DD hh:mm A")
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
                    {eventIDToJoins[event.EventID]}
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
                    {eventIDToShoutouts[event.EventID]}
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
            end={{ x: 0, y: 0.9 }}
            style={{ borderRadius: cardBorderRadius, height: "100%" }}
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
              {eventIDToEvent[event.EventID].Title}
            </McText>
            <McText
              body3
              style={{
                color: COLORS.white,
                opacity: 0.8,
              }}
            >
              {moment(eventIDToEvent[event.EventID].StartDateTime).format(
                "MMM DD h:mm A"
              )}
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
                {eventIDToJoins[event.EventID]}
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
                {eventIDToShoutouts[event.EventID]}
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
