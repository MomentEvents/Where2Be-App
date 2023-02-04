import { StyleSheet, Text, TouchableOpacity, Image, View } from "react-native";
import React from "react";
import { COLORS, SCREENS, Event, icons } from "../../../constants";
import * as Navigator from "../../../navigation/Navigator";
import { McText } from "../../Styled";
import moment from "moment";

type EventResultProps = {
  event: Event;
};
const EventResult = (props: EventResultProps) => {
  const onEventPress = () => {
    Navigator.navigate(SCREENS.EventDetails, { eventID: props.event.EventID });
  };

  return (
    <View
      style={{
        width: "100%",
        paddingVertical: 10,
        paddingHorizontal: 15,
        justifyContent: "center",
        backgroundColor: COLORS.black
      }}
    >
      <TouchableOpacity onPress={onEventPress}>
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{
              height: 70,
              width: 70,
              borderRadius: 50,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: COLORS.white,
            }}
            source={{ uri: props.event.Picture }}
          />
          <View
            style={{
              marginRight: 20,
              marginLeft: 30,
              flex: 1,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <McText h3 numberOfLines={1}>
              {props.event.Title}
            </McText>
            <View style={{ paddingVertical: 2, alignItems: "center", flexDirection: "row" }}>
              <icons.pickdate width={20} height={12}/>
              <McText body5 numberOfLines={1}>
                {moment(props.event.StartDateTime).format("MMM DD[,] YYYY") +
                  " at " +
                  moment(props.event.StartDateTime).format("h:mm a")}
              </McText>
            </View>
            <View style={{ paddingVertical: 2, alignItems: "center", flexDirection: "row" }}>
              <icons.picklocation width={20} height={12}/>
              <McText body5 numberOfLines={1}>
                {props.event.Location}
              </McText>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default EventResult;

const styles = StyleSheet.create({});
