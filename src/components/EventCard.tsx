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
import { displayError, truncateNumber } from "../helpers/helpers";
import { EventContext } from "../contexts/EventContext";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AntDesign } from "@expo/vector-icons";

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
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  let cardWidth = width ? width : isBigCard ? 330 : 270;
  let cardHeight = height ? height : isBigCard ? 240 : 250;

  console.log(width);
  console.log(height);

  if (cardWidth < 0) {
    cardWidth = 40;
  }
  if (cardHeight < 0) {
    cardHeight = 40;
  }

  const cardBorderRadius = 10;
  const cardBorderWidth = 1;
  const cardBorderColor = COLORS.gray2;

  const onPressCard = () => {
    if (onClick !== undefined) {
      onClick();
      return;
    }
    navigation.push(SCREENS.EventDetails, {
      eventID: event.EventID,
    });
    // Navigate to event details page
  };

  const pullData = async () => {
    if (!eventIDToEvent[event.EventID]) {
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

  const DateTextComponent = (props: { date: Date }) => {
    if (!props.date) {
      return <View />;
    }
    var dayOfWeek = props.date.getDay();
    var weekdays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    var month = props.date.getMonth();
    var months = [
      "JAN",
      "FEB",
      "MAR",
      "APR",
      "MAY",
      "JUN",
      "JUL",
      "AUG",
      "SEP",
      "OCT",
      "NOV",
      "DEC",
    ];

    var monthName = months[month];
    var dayName = weekdays[dayOfWeek];
    var dateNumber = props.date.getDate();

    var today = new Date();
    var timeDiff = props.date.getTime() - today.getTime();
    var daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (daysDiff > 0 && daysDiff <= 6) {
      return (
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 20,
            borderRightWidth: 2,
            borderRightColor: COLORS.gray,
          }}
        >
          <McText h1>{dayName}</McText>
        </View>
      );
    }

    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
          borderRightWidth: 2,
          borderRightColor: COLORS.gray,
        }}
      >
        <McText h3>{monthName}</McText>
        <McText h1>{dateNumber}</McText>
      </View>
    );
  };

  if (!isLoaded || !eventIDToEvent[event.EventID]) {
    return <View />;
  }

  if (isBigCard) {
    return (
      <View
        style={{
          height: cardHeight,
          width: cardWidth,
          borderRadius: cardBorderRadius,
        }}
      >
        <TouchableHighlight
          onPress={onPressCard}
          style={{
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
                    style={{ marginTop: 1 }}
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
                    {truncateNumber(eventIDToEvent[event.EventID].NumJoins)}
                  </McText>
                  <AntDesign
                    name="retweet"
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
                    {truncateNumber(eventIDToEvent[event.EventID].NumShoutouts)}
                  </McText>
                </View>
              </View>
            </View>
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  // Small card

  return (
    <TouchableHighlight
      onPress={onPressCard}
      style={{
        borderRadius: cardBorderRadius,
        height: cardHeight,
        width: cardWidth,
      }}
    >
      <View
        style={{
          borderRadius: cardBorderRadius,
          flex: 1,
          height: cardHeight,
          width: cardWidth,
        }}
      >
        <ImageBackground
          source={{ uri: eventIDToEvent[event.EventID].Picture }}
          style={{
            flex: 1,
            width: "100%",
            borderRadius: cardBorderRadius,
            borderWidth: cardBorderWidth,
            borderColor: cardBorderColor,
          }}
        >
          <LinearGradient
            colors={["transparent", COLORS.trueBlack, COLORS.trueBlack]}
            start={{ x: 0, y: 0.4 }}
            end={{ x: 0, y: 1.6 }}
            style={{ borderRadius: cardBorderRadius - 1, height: "100%" }}
          ></LinearGradient>

          <View
            style={{
              flex: 1,
              alignSelf: "center",
              flexDirection: "row",
              position: "absolute",
              bottom: 0,
              left: 0,
              paddingRight: 10,
              width: cardWidth - 10,
            }}
          >
            <View style={{ flex: 1, flexDirection: "row" }}>
              <DateTextComponent
                date={eventIDToEvent[event.EventID].StartDateTime}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <McText h2 numberOfLines={1}>
                  {eventIDToEvent[event.EventID].Title}
                </McText>
                <View style={{ flexDirection: "row", flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      flex: 1,
                      alignItems: "center",
                    }}
                  >
                    <McText body3 color={COLORS.purple}>
                      {moment(
                        eventIDToEvent[event.EventID].StartDateTime
                      ).format("h:mm a")}
                    </McText>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 5,
                      }}
                    >
                      <Ionicons
                        name="checkmark-sharp"
                        size={22}
                        color={
                          eventIDToEvent[event.EventID].UserJoin
                            ? COLORS.purple
                            : COLORS.lightGray
                        }
                        style={{ alignSelf: "center" }}
                      />
                      <McText
                        h3
                        style={{
                          marginRight: 12,
                          marginLeft: 5,
                          color: eventIDToEvent[event.EventID].UserJoin
                            ? COLORS.purple
                            : COLORS.lightGray,
                        }}
                      >
                        {truncateNumber(eventIDToEvent[event.EventID].NumJoins)}
                      </McText>
                    </View>
                    <View
                      style={{ flexDirection: "row", justifyContent: "center" }}
                    >
                      <AntDesign
                        name="retweet"
                        size={16}
                        color={
                          eventIDToEvent[event.EventID].UserShoutout
                            ? COLORS.purple
                            : COLORS.lightGray
                        }
                        style={{ alignSelf: "center" }}
                      />
                      <McText
                        h3
                        style={{
                          marginRight: 12,
                          marginLeft: 8,
                          color: eventIDToEvent[event.EventID].UserShoutout
                            ? COLORS.purple
                            : COLORS.lightGray,
                        }}
                      >
                        {truncateNumber(
                          eventIDToEvent[event.EventID].NumShoutouts
                        )}
                      </McText>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    </TouchableHighlight>
  );
};

export default EventCard;

const styles = StyleSheet.create({});
