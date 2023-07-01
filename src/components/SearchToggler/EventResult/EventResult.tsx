import { StyleSheet, Text, TouchableOpacity, Image, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { COLORS, SCREENS, Event, icons, SIZES } from "../../../constants";
import { McText } from "../../Styled";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
import { EventContext } from "../../../contexts/EventContext";

type EventResultProps = {
  event: Event;
};
const EventResult = (props: EventResultProps) => {
  const [fetchedEvent, setFetchedEvent] = useState(false);
  const { eventIDToEvent, updateEventIDToEvent } = useContext(EventContext);
  const navigation = useNavigation<any>();
  const onEventPress = () => {
    navigation.push(SCREENS.EventDetails, { eventID: props.event.EventID });
  };

  const pullData = async () => {
    updateEventIDToEvent({ id: props.event.EventID, event: props.event });
    setFetchedEvent(true);
  };

  // First time being loaded and rendered
  useEffect(() => {
    pullData();
  }, []);

  if (!fetchedEvent || !eventIDToEvent[props.event.EventID]) {
    return <View />;
  }
  return (
    <View
      style={{
        width: "100%",
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginLeft: 10,
        justifyContent: "center",
        backgroundColor: COLORS.black,
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
            source={{ uri: eventIDToEvent[props.event.EventID].Picture }}
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
              {eventIDToEvent[props.event.EventID].Title}
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
                {moment(eventIDToEvent[props.event.EventID].StartDateTime).format("MMM DD[,] YYYY") +
                  " at " +
                  moment(eventIDToEvent[props.event.EventID].StartDateTime).format("h:mm a")}
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
                {eventIDToEvent[props.event.EventID].Location}
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
