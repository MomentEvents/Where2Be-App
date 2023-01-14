import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  COLORS,
  Event,
  FONTS,
  Interest,
  SIZES,
  icons,
} from "../../../constants";
import { ScreenContext } from "../../../contexts/ScreenContext";
import { EventContext } from "../../../contexts/EventContext";
import InterestSelector from "../../../components/InterestSelector/InterestSelector";
import SectionHeader from "../../../components/Styled/SectionHeader";
import { McText } from "../../../components/Styled";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styled from "styled-components/native";
import ImagePickerButton from "../../../components/ImagePicker";

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
  const [date, setDate] = useState<Date>(eventIDToEvent[eventID].StartDateTime);
  const [desc, setDesc] = useState(eventIDToEvent[eventID].Description);
  const [start, setStart] = useState<Date>(
    eventIDToEvent[eventID].StartDateTime
  );
  const [end, setEnd] = useState<Date>(eventIDToEvent[eventID].EndDateTime);

  const [selectedInterests, setSelectedInterests] = useState(
    new Set<Interest>(eventIDToInterests[eventID])
  );

  useEffect(() => {}, []);

  return (
    <SafeAreaView style={styles.container}>
      <SectionHeader
        title={"Edit Event"}
        leftButtonOnClick={() => {}}
        leftButtonSVG={<icons.backarrow />}
        rightButtonOnClick={() => {}}
        rightButtonSVG={
          <McText h3 color={COLORS.purple}>
            Save
          </McText>
        }
      />
      <KeyboardAwareScrollView style={styles.scrollViewContainer}>
        <SectionInputs>
          <McText
            h3
            style={{
              marginBottom: 16,
            }}
          >
            Image
          </McText>
          <View style={{ alignItems: "center", marginLeft: -50 }}>
            <ImagePickerButton
              originalImageURI={image}
              setImageURI={setImage}
            ></ImagePickerButton>
          </View>
        </SectionInputs>
        <InterestSelector
          selectedInterests={selectedInterests}
          setSelectedInterests={setSelectedInterests}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default EditEventScreen;

const SectionInputs = styled.View`
  margin-left: 50;
  margin-vertical: 15;
`;
const SectionTextIn = styled.View`
  background-color: ${COLORS.black};
  width: ${SIZES.width * 0.76};
  border-radius: 10;
  justify-content: center;
  border: 2px;
  border-color: ${COLORS.gray};
  align-items: flex-start;
`;
const SectionTimings = styled.View`
  background-color: ${COLORS.black};
  width: ${SIZES.width * 0.33};
  border-radius: 10;
  justify-content: center;
  border: 2px;
  border-color: ${COLORS.gray};
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  scrollViewContainer: {
    padding: 10,
  },
});
