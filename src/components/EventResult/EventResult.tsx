import { StyleSheet, Text, TouchableOpacity, Image, View, ActivityIndicator } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { COLORS, SCREENS, Event, icons, SIZES } from "../../constants";
import { McText } from "../Styled";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { EventContext } from "../../contexts/EventContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { selectEventByID } from "../../redux/events/eventSelectors";
import { updateEventMap } from "../../redux/events/eventSlice";
import LoadImage from "../LoadImage/LoadImage"

type EventResultProps = {
  event: Event;
};
const EventResult = (props: EventResultProps) => {

  const navigation = useNavigation<any>();
  const onEventPress = () => {
    navigation.push(SCREENS.EventDetails, { eventID: props.event.EventID });
  };

  return (
    <View
      style={{
        width: "100%",
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginLeft: 10,
        justifyContent: "center",
      }}
    >
      <TouchableOpacity onPress={onEventPress}>
        <View style={{ flexDirection: "row" }}>
          <LoadImage
            imageStyle={styles.eventPic}
            imageSource={props.event?.Picture}
          />
          <View
            style={{
              marginRight: 30,
              marginLeft: 15,
              flex: 1,
              justifyContent: "center",
            }}
          >
            <McText h3 numberOfLines={1} style={{ marginLeft: 3 }}>
              {props.event?.Title}
            </McText>
            <View
              style={{
                paddingVertical: 2,
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <icons.pickdate width={25} height={12} />
              <McText body5 style={{ marginRight: 25 }} numberOfLines={1}>
                {moment(new Date(props.event.StartDateTime)).format("MMM DD[,] YYYY") +
                  " at " +
                  moment(new Date(props.event.StartDateTime)).format("h:mm a")}
              </McText>
            </View>
            <View
              style={{
                paddingVertical: 2,
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <icons.picklocation
                width={25}
                height={12}
                style={{ opacity: 0.7 }}
              />
              <McText
                body5
                numberOfLines={1}
                style={{ color: COLORS.gray, marginRight: 25 }}
              >
                {props.event?.Location}
              </McText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default EventResult;

const styles = StyleSheet.create({
  eventPic: {
    height: 70,
    width: 70,
    borderRadius: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.gray2,
  }
});
