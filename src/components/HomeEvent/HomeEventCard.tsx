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
import { McText, McIcon } from "./../Styled";
import "react-native-gesture-handler";
import { Event } from "../../constants";
import { UserContext } from "../../contexts/UserContext";
import { displayError } from "../../helpers/helpers";
import { EventContext } from "../../contexts/EventContext";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";

type EventCardProps = {
  onClick?: () => void;
  event: Event;
  isBigCard?: boolean;
  width?: number;
  height?: number;
  showRelativeTime?: boolean;
  host: User;
};

const HomeEventCard = ({
  onClick,
  event,
  isBigCard,
  width,
  height,
  showRelativeTime,
  host
}: EventCardProps) => {
  const {
    eventIDToEvent,
    updateEventIDToEvent,
    addUserJoin,
    addUserShoutout,
    removeUserJoin,
    removeUserShoutout,
  } = useContext(EventContext);

  const navigation = useNavigation<any>();

  const [fetchedEvent, setFetchedEvent] = useState(false);
  const [fetchedDidUserShoutout, setFetchedDidUserShoutout] = useState(false);
  const [fetchedDidUserJoin, setFetchedDidUserJoin] = useState(false);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const cardWidth = SIZES.width;
  const cardHeight = 300;

  const cardBorderRadius = 0;
  const cardBorderWidth = 0;
  const cardBorderColor = COLORS.gray2;

  const onPressCard = () => {
    if (onClick !== undefined) {
      onClick();
      return;
    }
    navigation.push(SCREENS.EventDetails, {
      eventID: event.EventID,
      passedUser: host
    });
    // Navigate to event details page
  };

  const pullData = async () => {
    updateEventIDToEvent({ id: event.EventID, event: event });
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
                marginTop: 3,
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
                  : moment(eventIDToEvent[event.EventID].StartDateTime).format(
                      "MMM DD"
                    )}
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
                    {eventIDToEvent[event.EventID].NumJoins}
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
                  <Ionicons
                    name="md-megaphone-outline"
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
                    {eventIDToEvent[event.EventID].NumShoutouts}
                  </McText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default HomeEventCard;

const styles = StyleSheet.create({});
