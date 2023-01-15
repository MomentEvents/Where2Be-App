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
import ImagePickerButton from "../../../components/ImagePickerButton";
import { CUSTOMFONT_REGULAR } from "../../../constants/theme";
import DateTimePickerModal from "react-native-modal-datetime-picker";

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

  const [openedDatePicker, setOpenedDatePicker] = useState<boolean>(false);

  useEffect(() => {}, []);

  const onDateTimePicked = (selectedDate: Date) => {
    setDate(selectedDate);
    setOpenedDatePicker(false);
  };
  return (
    <View>
      <View style={{marginTop: 200}}/>
      <Button  title="Show Date Picker" onPress={() => setOpenedDatePicker(true)} />
      <DateTimePickerModal
        isVisible={openedDatePicker}
        mode="date"
        onConfirm={onDateTimePicked}
        onCancel={() => setOpenedDatePicker(false)}
      />
    </View>
    // <SafeAreaView style={styles.container}>
    //   <DateTimePickerModal
    //     isVisible={openedDatePicker}
    //     mode="date"
    //     onConfirm={onDateTimePicked}
    //     onCancel={() => setOpenedDatePicker(false)}
    //   />
    //   <SectionHeader
    //     title={"Edit Event"}
    //     leftButtonOnClick={() => {}}
    //     leftButtonSVG={<icons.backarrow />}
    //     rightButtonOnClick={() => {}}
    //     rightButtonSVG={
    //       <McText h3 color={COLORS.purple}>
    //         Save
    //       </McText>
    //     }
    //   />
    //   <KeyboardAwareScrollView>
    //     <View style={styles.scrollViewContainer}>
    //       <SectionInputs>
    //         <View style={styles.titleContainer}>
    //           <icons.pickpicture width={30} />
    //           <McText h3>Image</McText>
    //         </View>

    //         <ImagePickerButton
    //           originalImageURI={image}
    //           setImageURI={setImage}
    //           width={Math.min(SIZES.height, SIZES.width) - 40}
    //           height={Math.min(SIZES.height, SIZES.width) - 40}
    //         />

    //         <View style={styles.titleContainer}>
    //           <icons.picktitle style={styles.iconsContainer} width={30} />
    //           <McText h3>Title</McText>
    //         </View>

    //         <TextInput
    //           placeholder={"enter your title"}
    //           placeholderTextColor={COLORS.gray}
    //           style={styles.textInputContainer}
    //           value={title}
    //           onChangeText={setTitle}
    //           multiline={true}
    //           maxLength={40}
    //         />

    //         <View style={styles.titleContainer}>
    //           <icons.pickdescription style={styles.iconsContainer} width={30} />
    //           <McText h3>Description</McText>
    //         </View>

    //         <TextInput
    //           placeholder={"enter your description"}
    //           placeholderTextColor={COLORS.gray}
    //           style={styles.textInputContainer}
    //           value={desc}
    //           onChangeText={setDesc}
    //           multiline={true}
    //           maxLength={40}
    //         />
    //         <View style={styles.titleContainer}>
    //           <icons.picktags style={styles.iconsContainer} width={30} />
    //           <McText h3>Tags (select up to 1)</McText>
    //         </View>

    //         <View>
    //           <InterestSelector
    //             selectedInterests={selectedInterests}
    //             setSelectedInterests={setSelectedInterests}
    //           />
    //         </View>
    //         <Button
    //           title={"open date picker"}
    //           onPress={() => {
    //             setOpenedDatePicker(true);
    //           }}
    //         />
    //       </SectionInputs>
    //     </View>
    //   </KeyboardAwareScrollView>
    // </SafeAreaView>
  );
};

export default EditEventScreen;

const SectionInputs = styled.View`
  margin-horizontal: 10px;
  margin-vertical: 15px;
`;
const SectionTextIn = styled.View`
  background-color: ${COLORS.black};
  width: ${SIZES.width * 0.76};
  border-radius: 5px;
  justify-content: center;
  border: 2px;
  border-color: ${COLORS.gray};
  align-items: flex-start;
`;
const SectionTimings = styled.View`
  background-color: ${COLORS.black};
  width: ${SIZES.width * 0.33};
  border-radius: 5px;
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
    marginHorizontal: 10,
  },
  titleContainer: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  textInputContainer: {
    borderColor: COLORS.white,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontFamily: CUSTOMFONT_REGULAR,
    fontSize: 16,
    color: COLORS.white,
    paddingHorzontal: 10,
    paddingBottom: 10,
    paddingTop: 10,
  },
  iconsContainer: {
    marginRight: 10,
  },
});
