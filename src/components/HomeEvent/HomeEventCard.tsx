//import React from 'react';
import React, { useState, useEffect, useContext } from "react";
import {
  TouchableHighlight,
  View,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";

import { SIZES, COLORS, SCREENS, User } from "../../constants";
import { McText } from "./../Styled";
import "react-native-gesture-handler";
import { Event } from "../../constants";
import { UserContext } from "../../contexts/UserContext";
import { displayError, truncateNumber } from "../../helpers/helpers";
import { EventContext } from "../../contexts/EventContext";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { AntDesign } from "@expo/vector-icons";

type EventCardProps = {
  event: Event;
  width?: number;
  height?: number;
  showRelativeTime?: boolean;
  host: User;
  reason: string;
};

const HomeEventCard = ({
  event,
  width,
  height,
  showRelativeTime,
  host,
  reason,
}: EventCardProps) => {
  const {
    eventIDToEvent,
    updateEventIDToEvent,
    clientAddUserJoin: addUserJoin,
    clientAddUserShoutout: addUserShoutout,
    clientRemoveUserJoin: removeUserJoin,
    clientRemoveUserShoutout: removeUserShoutout,
  } = useContext(EventContext);

  const navigation = useNavigation<any>();

  const [fetchedEvent, setFetchedEvent] = useState(false);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const cardWidth = width ? width : SIZES.width;
  const cardHeight = height ? height : SIZES.width;

  const cardBorderRadius = 0;
  const cardBorderWidth = 0;
  const minTextBarHeight = 60;
  const cardBorderColor = COLORS.gray2;

  const onPressCard = () => {
    navigation.push(SCREENS.EventDetails, {
      eventID: event.EventID,
    });
    // Navigate to event details page
  };

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
            marginRight: 10,
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
          marginRight: 10,
          borderRightWidth: 2,
          borderRightColor: COLORS.gray,
        }}
      >
        <McText h3>{monthName}</McText>
        <McText h1>{dateNumber}</McText>
      </View>
    );
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

  if (!isLoaded || !eventIDToEvent[event.EventID]) {
    return <View />;
  }

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
        {reason && (
          <View
            style={{
              position: "absolute",
              zIndex: 1,
              width: cardWidth,
              paddingVertical: 5,
              paddingHorizontal: 20,
              backgroundColor: "rgba(0, 0, 0, 0.6)",
            }}
          >
            <McText body4 numberOfLines={1}>
              {reason}
            </McText>
          </View>
        )}
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
              minHeight: minTextBarHeight,
              width: width - 10,
            }}
          >
            <View style={{ flex: 1, flexDirection: "row" }}>
              <DateTextComponent
                date={eventIDToEvent[event.EventID].StartDateTime}
              />
              <View style={{flex: 1, marginLeft: 10}}>
                <McText h2 numberOfLines={1}>
                  {eventIDToEvent[event.EventID].Title}
                </McText>
                <View style={{ flexDirection: "row", flex: 1 }}>
                  <View style={{ flexDirection: "row", flex: 1, alignItems: "center" }}>
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
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 5,
                      }}
                      onPress={
                        eventIDToEvent[event.EventID].UserJoin
                          ? () => removeUserJoin(event.EventID)
                          : () => addUserJoin(event.EventID)
                      }
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
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{ flexDirection: "row", justifyContent: "center" }}
                      onPress={
                        eventIDToEvent[event.EventID].UserShoutout
                          ? () => removeUserShoutout(event.EventID)
                          : () => addUserShoutout(event.EventID)
                      }
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
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>

        <View
          style={{
            paddingHorizontal: 15,
            paddingBottom: 30,
            backgroundColor: COLORS.trueBlack,
          }}
        >
          {/* <McText body4 numberOfLines={2}>
            {event.Description.length === 0
              ? "N/A"
              : eventIDToEvent[event.EventID].Description}
          </McText> */}
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default HomeEventCard;

const styles = StyleSheet.create({});
