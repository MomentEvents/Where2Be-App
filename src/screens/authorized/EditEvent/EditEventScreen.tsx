import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import { Event, Interest } from "../../../constants";
import { ScreenContext } from "../../../contexts/ScreenContext";
import { EventContext } from "../../../contexts/EventContext";

type EditEventScreenParams = {
  eventID: string,
};

const EditEventScreen = ({ navigation, route }) => {
  const { eventID }: EditEventScreenParams = route.params;
  const { setLoading } = useContext(ScreenContext);

  const { eventIDToEvent, updateEventIDToEvent, eventIDToInterests, updateEventIDToInterests } = useContext(EventContext);

  const [title, setTitle] = useState(eventIDToEvent[eventID].Title);
  const [location, setLocation] = useState(eventIDToEvent[eventID].Location);
  const [image, setImage] = useState(eventIDToEvent[eventID].Picture);
  const [date, setDate] = useState(eventIDToEvent[eventID].StartDateTime.getDate());
  const [desc, setDesc] = useState(eventIDToEvent[eventID].Description);
  const [start, setStart] = useState<Date>(eventIDToEvent[eventID].StartDateTime);
  const [end, setEnd] = useState<Date>(eventIDToEvent[eventID].EndDateTime);
  
  return (
    <View>
      <Text>EditEventScreen</Text>
    </View>
  );
};

export default EditEventScreen;

const styles = StyleSheet.create({});
