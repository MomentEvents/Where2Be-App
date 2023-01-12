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

import { SIZES, COLORS, icons } from "../constants";
import { McText, McIcon } from "./Styled";
import "react-native-gesture-handler";
import * as Navigator from "../navigation/Navigator";
import { Event } from "../constants";
import { UserContext } from "../contexts/UserContext";

type EventCardProps = {
  OnClick?: () => void;
  Event: Event;
  Width: number;
  Height: number;
};

const EventCard = ({
  OnClick,
  Event,
  Width,
  Height
}: EventCardProps) => {

  const { userToken, currentUser, isLoggedIn } = useContext(UserContext)

  const [event, setEvent ] = useState<Event>(Event);
  const [likes, setLikes] = useState<number>(null);
  const [shoutouts, setShoutouts] = useState<number>(null);
  const [userLiked, setUserLiked] = useState<boolean>(null);
  const [userShouted, setUserShouted] = useState<boolean>(null);

  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const cardWidth = Width;
  const cardHeight = Height;
  const cardBorderRadius = 10;

  // First time being loaded and rendered
  useEffect(() => {

    
    setLikes(await );
    setShoutouts(Shoutouts);
    if(isLoggedIn){
      setUserLiked(await )
    }
    else{
      setUserLiked
    }
    setUserLiked(UserLiked);
    setUserShouted(UserShouted);
  }, []);

  const NavigateToEvent = () => {
    // Navigator.navigate("NewEventDetailScreen", {
    //   EventID: EventID,
    //   SetCardLikes: setLikes,
    //   SetCardShoutouts: setShoutouts,
    //   SetCardUserLiked: setUserLiked,
    //   SetCardUserShouted: setUserShouted,
    //   SetCardImage: setImage,
    //   SetCardTitle: setTitle,
    //   SetCardStartDateTime: setStartingDateTime,
    // });
  };
  return (
    <TouchableHighlight
      onPress={() => {
        OnClick === undefined ? NavigateToEvent() : OnClick();
      }}
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
          source={{ uri: event.Picture }}
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
            borderWidth: 1,
            borderColor: COLORS.white,
            backgroundColor: 'rgba(0,0,0,.5)',
          }}
        />
        <View
          style={{
            flex: 1,
            position: "absolute",
            top: 0,
            left: 0,
            width: cardWidth,
            height: cardHeight,
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
              width: Width - 20
            }}
          >
            <McText h4 numberOfLines={2}>
              {event.Title}
            </McText>
            <McText
              body3
              style={{
                color: COLORS.white,
                opacity: 0.8,
              }}
            >
              {moment(event.StartDateTime).format("MMM DD h:mm A")}
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
        </View>
      </View>
    </TouchableHighlight>
  );
};

export default EventCard;

const styles = StyleSheet.create({});
