import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { COLORS, Event, Interest, icons } from "../../../constants";
import { ScreenContext } from "../../../contexts/ScreenContext";
import { EventContext } from "../../../contexts/EventContext";
import InterestSelector from "../../../components/InterestSelector/InterestSelector";
import SectionHeader from "../../../components/Styled/SectionHeader";

type EditEventScreenParams = {
  eventID: string;
};

const EditEventScreen = ({ navigation, route }) => {
  const { eventID }: EditEventScreenParams = route.params;
  const { setLoading } = useContext(ScreenContext);

  const {
    eventIDToEvent,
    updateEventIDToEvent,
    eventIDToInterests,
    updateEventIDToInterests,
  } = useContext(EventContext);

  const [title, setTitle] = useState(eventIDToEvent[eventID].Title);
  const [location, setLocation] = useState(eventIDToEvent[eventID].Location);
  const [image, setImage] = useState(eventIDToEvent[eventID].Picture);
  const [date, setDate] = useState(
    eventIDToEvent[eventID].StartDateTime.getDate()
  );
  const [desc, setDesc] = useState(eventIDToEvent[eventID].Description);
  const [start, setStart] = useState<Date>(
    eventIDToEvent[eventID].StartDateTime
  );
  const [end, setEnd] = useState<Date>(eventIDToEvent[eventID].EndDateTime);

  const [selectedInterests, setSelectedInterests] = useState(
    new Set<Interest>(eventIDToInterests[eventID]))

  useEffect(() => {
    //selectedInterests.has(eventIDToInterests[eventID][2])
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <SectionHeader
        title={"Edit Event"}
        leftButtonOnClick={() => {}}
        leftButtonSVG={<icons.backarrow />}
      />
      <InterestSelector
        selectedInterests={selectedInterests}
        setSelectedInterests={setSelectedInterests}
      />
      <Button
        title={"Test"}
        onPress={() => {
          updateEventIDToInterests({id: eventID, interests: Array.from(selectedInterests)})
          console.log(selectedInterests);
        }}
      />
    </SafeAreaView>
  );
};

export default EditEventScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
});
