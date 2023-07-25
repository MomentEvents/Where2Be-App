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
import { useDispatch, useSelector } from "react-redux";
import { selectEventByID } from "../redux/events/eventSelectors";
import { AppDispatch, RootState } from "../redux/store";
import { updateEventMap } from "../redux/events/eventSlice";

type EventCardProps = {
  onClick?: () => void;
  event: Event;
  user?: User;
  isBigCard?: boolean;
  width?: number;
  height?: number;
};

const EventCard = ({
  onClick,
  event,
  user,
  isBigCard,
  width,
  height,
}: EventCardProps) => {
  const navigation = useNavigation<any>();

  const dispatch = useDispatch<AppDispatch>();
  const storedEvent = useSelector((state: RootState) => selectEventByID(state, event.EventID));

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
    if (!storedEvent) {
      dispatch(updateEventMap({id: event.EventID, changes: event}))
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
            paddingHorizontal: 15,
            borderRightWidth: 2,
            borderRightColor: COLORS.gray,
            marginRight: 5,
          }}
        >
          <McText h3>{dayName}</McText>
        </View>
      );
    }

    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 15,
          marginRight: 5,
          borderRightWidth: 2,
          borderRightColor: COLORS.gray,
        }}
      >
        <McText h5>{monthName}</McText>
        <McText h3>{dateNumber}</McText>
      </View>
    );
  };

  if (!isLoaded || !storedEvent) {
    return <View />;
  }

  function isWithin24hours(dateCheck: Date) {
    if(!dateCheck){
      return undefined
    }
    const today = new Date();
    if (dateCheck > today) {
      const timeDifference = dateCheck.getTime() - today.getTime();
      const millisecondsIn24Hours = 24 * 60 * 60 * 1000;
      return timeDifference < millisecondsIn24Hours;
    }
    return false;
  }

  if (isBigCard) {
    return (
      <TouchableHighlight
        onPress={onPressCard}
        style={{
          borderRadius: cardBorderRadius,
          height: cardHeight,
          width: cardWidth,
          overflow: "hidden",
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
            source={{ uri: storedEvent.Picture }}
            style={{
              flex: 1,
              width: "100%",
              borderRadius: cardBorderRadius,
              borderWidth: cardBorderWidth,
              borderColor: cardBorderColor,
              overflow: "hidden",
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
              <View style={{ flex: 1, flexDirection: "row", marginBottom: 5 }}>
                <DateTextComponent
                  date={storedEvent?.StartDateTime}
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <McText h3 numberOfLines={1}>
                    {storedEvent?.Title}
                  </McText>
                  <View style={{ flexDirection: "row", flex: 1 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        flex: 1,
                        alignItems: "center",
                      }}
                    >
                      <McText body4 color={COLORS.purple} numberOfLines={1}>
                        {isWithin24hours(
                          storedEvent?.StartDateTime
                        )
                          ? moment(
                              storedEvent?.StartDateTime
                            ).fromNow()
                          : moment(
                              storedEvent?.StartDateTime
                            ).format("h:mm a")}
                        {!storedEvent?.EndDateTime
                          ? ""
                          : " - " +
                            moment(
                              storedEvent?.EndDateTime
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
                          marginLeft: 7,
                          marginRight: 5,
                        }}
                      >
                        <Ionicons
                          name="checkmark-sharp"
                          size={18}
                          color={
                            storedEvent?.UserJoin
                              ? COLORS.purple
                              : COLORS.lightGray
                          }
                          style={{ alignSelf: "center" }}
                        />
                        <McText
                          body3
                          style={{
                            marginRight: 7,
                            marginLeft: 5,
                            color: storedEvent?.UserJoin
                              ? COLORS.purple
                              : COLORS.lightGray,
                          }}
                        >
                          {truncateNumber(
                            storedEvent?.NumJoins
                          )}
                        </McText>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                        }}
                      >
                        <AntDesign
                          name="retweet"
                          size={14}
                          color={
                            storedEvent?.UserShoutout
                              ? COLORS.purple
                              : COLORS.lightGray
                          }
                          style={{ alignSelf: "center" }}
                        />
                        <McText
                          body3
                          style={{
                            marginRight: 2,
                            marginLeft: 8,
                            color: storedEvent?.UserShoutout
                              ? COLORS.purple
                              : COLORS.lightGray,
                          }}
                        >
                          {truncateNumber(
                            storedEvent?.NumShoutouts
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
  }

  // Small card

  return (
    <TouchableHighlight
      onPress={onPressCard}
      style={{
        borderRadius: cardBorderRadius,
        height: cardHeight,
        width: cardWidth,
        overflow: "hidden",
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
          source={{ uri: storedEvent?.Picture }}
          style={{
            flex: 1,
            width: "100%",
            borderRadius: cardBorderRadius,
            borderWidth: cardBorderWidth,
            borderColor: cardBorderColor,
            overflow: "hidden",
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
            <View style={{ flex: 1, flexDirection: "row", marginBottom: 5 }}>
              <DateTextComponent
                date={storedEvent?.StartDateTime}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <McText h3 numberOfLines={1}>
                  {storedEvent?.Title}
                </McText>
                <View style={{ flexDirection: "row", flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      flex: 1,
                      alignItems: "center",
                    }}
                  >
                    <McText body4 color={COLORS.purple} numberOfLines={1}>
                      {isBigCard
                        ? isWithin24hours(
                            storedEvent?.StartDateTime
                          )
                          ? moment(
                              storedEvent?.StartDateTime
                            ).fromNow()
                          : moment(
                              storedEvent?.StartDateTime
                            ).format("h:mm a") +
                            (storedEvent?.EndDateTime ? (" - " +
                            moment(
                              storedEvent?.EndDateTime
                            ).format("h:mm a")) : "")
                        : moment(
                            storedEvent?.StartDateTime
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
                        size={18}
                        color={
                          storedEvent?.UserJoin
                            ? COLORS.purple
                            : COLORS.lightGray
                        }
                        style={{ alignSelf: "center" }}
                      />
                      <McText
                        body3
                        style={{
                          marginRight: 7,
                          marginLeft: 5,
                          color: storedEvent?.UserJoin
                            ? COLORS.purple
                            : COLORS.lightGray,
                        }}
                      >
                        {truncateNumber(storedEvent?.NumJoins)}
                      </McText>
                    </View>
                    <View
                      style={{ flexDirection: "row", justifyContent: "center" }}
                    >
                      <AntDesign
                        name="retweet"
                        size={14}
                        color={
                          storedEvent?.UserShoutout
                            ? COLORS.purple
                            : COLORS.lightGray
                        }
                        style={{ alignSelf: "center" }}
                      />
                      <McText
                        body3
                        style={{
                          marginRight: 2,
                          marginLeft: 8,
                          color: storedEvent?.UserShoutout
                            ? COLORS.purple
                            : COLORS.lightGray,
                        }}
                      >
                        {truncateNumber(
                          storedEvent?.NumShoutouts
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
