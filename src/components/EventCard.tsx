//import React from 'react';
import React, { useState, useEffect, useContext } from "react";
import {
  TouchableHighlight,
  View,
  StyleSheet,
  ImageBackground,
  Image,
} from "react-native";
import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";

import { SIZES, COLORS, SCREENS } from "../constants";
import { McText } from "./Styled";
import "react-native-gesture-handler";
import { Event, User } from "../constants";
import { UserContext } from "../contexts/UserContext";
import { displayError } from "../helpers/helpers";
import { EventContext } from "../contexts/EventContext";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

type EventCardProps = {
  onClick?: () => void;
  event: Event;
  user?: User;
  isBigCard?: boolean;
  width?: number;
  height?: number;
  showRelativeTime?: boolean;
};

const EventCard = ({
  onClick,
  event,
  user,
  isBigCard,
  width,
  height,
  showRelativeTime,
}: EventCardProps) => {
  const { eventIDToEvent, updateEventIDToEvent } = useContext(EventContext);
  const navigation = useNavigation<any>();

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
    navigation.push(SCREENS.EventDetails, {
      eventID: event.EventID,
      passedUser: user? user : null,
    });
    // Navigate to event details page
  };

  const pullData = async () => {
    if(!eventIDToEvent[event.EventID]){
      updateEventIDToEvent({ id: event.EventID, event: event });
    }
    setFetchedEvent(true);
  };

  // First time being loaded and rendered
  useEffect(() => {
    pullData();
  }, []);

  useEffect(() => {
    setIsLoaded(fetchedEvent);
  }, [fetchedEvent]);

  if (!isLoaded || !eventIDToEvent[event.EventID]) {
    return (
      <View/>
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
              colors={[
                "transparent",
                COLORS.transparentBlack,
                COLORS.transparentBlack,
              ]}
              start={{ x: 0, y: 0.4 }}
              end={{ x: 0, y: 1.3 }}
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
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Ionicons
                    name="md-checkmark"
                    size={21}
                    color={
                      eventIDToEvent[event.EventID].UserJoin
                        ? COLORS.purple
                        : COLORS.lightGray
                    }
                    style={{marginTop: 1}}
                  />
                  <McText
                    body3
                    style={{
                      marginRight: 12,
                      marginLeft: 5,
                      color: eventIDToEvent[event.EventID].UserJoin
                        ? COLORS.purple
                        : COLORS.lightGray,
                    }}
                  >
                    {eventIDToEvent[event.EventID].NumJoins}
                  </McText>
                  <Ionicons
                    name="md-megaphone-outline"
                    size={15}
                    color={
                      eventIDToEvent[event.EventID].UserShoutout
                        ? COLORS.purple
                        : COLORS.lightGray
                    }
                    style={{ marginTop: 1 }}
                  />
                  <McText
                    body3
                    style={{
                      marginRight: 12,
                      marginLeft: 8,
                      color: eventIDToEvent[event.EventID].UserShoutout
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
            colors={["transparent", COLORS.transparentBlack, COLORS.trueBlack]}
            start={{ x: 0, y: 0.4 }}
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
            <View style={{ flexDirection: "row" }}>
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
                alignItems: "center",
              }}
            >
              <Ionicons
                name="md-checkmark"
                size={18}
                color={
                  eventIDToEvent[event.EventID].UserJoin
                    ? COLORS.purple
                    : COLORS.lightGray
                }
                style={{ marginTop: 1 }}
              />
              <McText
                body4
                style={{
                  marginRight: 12,
                  marginLeft: 4,
                  color: eventIDToEvent[event.EventID].UserJoin
                    ? COLORS.purple
                    : COLORS.lightGray,
                }}
              >
                {eventIDToEvent[event.EventID].NumJoins}
              </McText>
              <Ionicons
                name="md-megaphone-outline"
                size={13}
                color={
                  eventIDToEvent[event.EventID].UserShoutout
                    ? COLORS.purple
                    : COLORS.lightGray
                }
                style={{ marginTop: 1 }}
              />
              <McText
                body4
                style={{
                  marginRight: 12,
                  marginLeft: 6,
                  color: eventIDToEvent[event.EventID].UserShoutout
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
