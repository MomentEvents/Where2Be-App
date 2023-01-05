//import React from 'react';
import React, { useState, useEffect, useContext } from "react";
import {
  TouchableHighlight,
  View,
  StyleSheet,
  ImageBackground,
} from "react-native";
import moment from "moment";
import { LinearGradient } from "expo-linear-gradient";

import { SIZES, COLORS, icons } from "../constants";
import { McText, McIcon } from ".";
import "react-native-gesture-handler";
import * as RootNavigation from "../navigation/RootNavigation";
import { Event } from "../Services/EventService";

type EventCardProps = {
  EventID: string;
  OnClick?: () => {};
  Title: string;
  StartingDateTime: Date;
  Image: string;
  Likes: number;
  Shoutouts: number;
  UserLiked: boolean;
  UserShouted: boolean;
};

const EventCard = ({
  EventID,
  OnClick,
  Title,
  StartingDateTime,
  Image,
  Likes,
  Shoutouts,
  UserLiked,
  UserShouted,
}: EventCardProps) => {

  // The purpose of these state variables is to make it so when the user clicks on the event details screen, it updates these values automatically
  // when we exit
  const [title, setTitle] = useState<string>();
  const [image, setImage] = useState<string | null>();
  const [startingDateTime, setStartingDateTime] = useState<Date>();
  const [likes, setLikes] = useState<number>();
  const [shoutouts, setShoutouts] = useState<number>();
  const [userLiked, setUserLiked] = useState<boolean>();
  const [userShouted, setUserShouted] = useState<boolean>();

  const cardWidth = SIZES.width / 2.5 + 10;
  const cardHeight = SIZES.width / 1.9 + 10;
  const cardBorderRadius = 20;

  
  // First time being loaded and rendered
  useEffect(() => {
    setImage(Image);
    setTitle(Title);
    setStartingDateTime(StartingDateTime);
    setLikes(Likes);
    setShoutouts(Shoutouts);
    setUserLiked(UserLiked);
    setUserShouted(UserShouted);
  }, []);

  const NavigateToEvent = () => {
    RootNavigation.navigate("NewEventDetailScreen", {
      EventID: EventID,
      SetCardLikes: setLikes,
      SetCardShoutouts: setShoutouts,
      SetCardUserLiked: setUserLiked,
      SetCardUserShouted: setUserShouted,
      SetCardImage: setImage,
      SetCardTitle: setTitle,
      SetCardStartDateTime: setStartingDateTime,
    });
  };
  return (
    <View
      style={{
        width: cardWidth,
        height: cardHeight,
      }}
    >
      <TouchableHighlight
        onPress={() => {
          OnClick === undefined ? NavigateToEvent() : OnClick();
        }}
        style={{
          borderRadius: cardBorderRadius,
          borderColor: COLORS.gray,
        }}
      >
        <ImageBackground
          source={{ uri: image }}
          resizeMode="cover"
          borderRadius={cardBorderRadius}
          style={{
            justifyContent: "space-between",
            borderColor: COLORS.gray,
            borderWidth: 2,
            borderRadius: cardBorderRadius + 2,
          }}
        >
          <View
            style={{
              flexDirection: "column",
              marginVertical: 8,
              marginHorizontal: 8,
              alignItems: "flex-end",
            }}
          >
            <View
              style={{ flexDirection: "row", height: cardHeight - 130 }}
            ></View>
          </View>
          <LinearGradient
            colors={["transparent", COLORS.trueBlack]}
            start={{ x: 1, y: 0 }}
            end={{ x: 1, y: 0.9 }}
            style={{ borderRadius: cardBorderRadius, height: SIZES.height / 7 }}
          >
            <View
              style={{
                flexDirection: "column",
                justifyContent: "flex-end",
                width: SIZES.width / 2.7,
                position: "absolute",
                bottom: 8,
                left: 12,
              }}
            >
              <McText h3 numberOfLines={2}>
                {title}
              </McText>
              <McText
                body3
                style={{
                  marginTop: -2,
                  color: COLORS.white,
                  opacity: 0.8,
                }}
              >
                {moment(startingDateTime).format("MMM DD h:mm A")}
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
                    tintColor: userLiked ? COLORS.purple : COLORS.lightGray,
                    marginRight: 10,
                  }}
                />
                <McText
                  body7
                  style={{
                    marginTop: 2,
                    marginLeft: -7,
                    marginRight: 10,
                    color: userLiked ? COLORS.purple : COLORS.lightGray,
                  }}
                >
                  {likes}
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
          </LinearGradient>
        </ImageBackground>
      </TouchableHighlight>
    </View>
  );
};

export default EventCard;

const styles = StyleSheet.create({});
