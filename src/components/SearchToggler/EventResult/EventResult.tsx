import { StyleSheet, Text, TouchableOpacity, Image, View } from "react-native";
import React from "react";
import { COLORS, SCREENS, Event, icons, SIZES } from "../../../constants";
import { McText } from "../../Styled";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";

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
        backgroundColor: COLORS.black
      }}
    >
      <TouchableOpacity onPress={onEventPress}>
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{
              height: 70,
              width: 70,
              borderRadius: 10,
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: COLORS.white,
            }}
            source={{ uri: props.event.Picture }}
          />
          <View
            style={{
              marginRight: 20,
              marginLeft: 15,
              flex: 1,
              justifyContent: "center",
            }}
          >
            <McText h3 numberOfLines={1} style={{marginRight: 10, marginLeft: 3}}>
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
              <icons.picklocation width={20} height={12} style={{opacity: 0.7}}/>
              <McText body5 numberOfLines={1} style={{color:COLORS.gray}}>
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
