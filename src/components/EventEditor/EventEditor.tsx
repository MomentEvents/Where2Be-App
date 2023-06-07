import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import moment from "moment";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { COLORS, icons, Interest, SIZES } from "../../constants";
import ImagePickerButton from "../ImagePickerButton";
import InterestSelector from "../InterestSelector/InterestSelector";
import { McText } from "../Styled";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import styled from "styled-components/native";
import { CUSTOMFONT_REGULAR } from "../../constants/theme";
import { convertDateToUTC } from "../../helpers/helpers";
import { CONSTRAINTS } from "../../constants/constraints";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type EventEditorProps = {
    title: string,
    setTitle: React.Dispatch<React.SetStateAction<string>>,
    location: string,
    setLocation: React.Dispatch<React.SetStateAction<string>>,
    image: string,
    setImage: React.Dispatch<React.SetStateAction<string>>,
    base64Image: string,
    setBase64Image: React.Dispatch<React.SetStateAction<string>>,
    date: Date,
    setDate: React.Dispatch<React.SetStateAction<Date>>,
    description: string,
    setDescription: React.Dispatch<React.SetStateAction<string>>,
    startTime: Date,
    setStartTime: React.Dispatch<React.SetStateAction<Date>>,
    endTime: Date,
    setEndTime: React.Dispatch<React.SetStateAction<Date>>,
    selectedInterests: Set<Interest>,
    setSelectedInterests: React.Dispatch<React.SetStateAction<Set<Interest>>>
}
const EventEditor = (props: EventEditorProps) => {
  const insets = useSafeAreaInsets();

  const [openedStartTimePicker, setOpenedStartTimePicker] =
    useState<boolean>(false);
  const [openedEndTimePicker, setOpenedEndTimePicker] =
    useState<boolean>(false);
  const [openedDatePicker, setOpenedDatePicker] = useState<boolean>(false);

  const onStartTimePicked = (selectedTime: Date) => {
    var date = convertDateToUTC(selectedTime);
    console.log("setting start to be " + date.toISOString());
    props.setStartTime(date);
    setOpenedStartTimePicker(false);
  };

  const onEndTimePicked = (selectedTime: Date) => {
    props.setEndTime(selectedTime);
    setOpenedEndTimePicker(false);
  };

  const onDatePicked = (selectedDate: Date) => {
    props.setDate(selectedDate);
    setOpenedDatePicker(false);
  };
  return (
    <View style={{flex: 1}}>
      <KeyboardAwareScrollView style={{backgroundColor: COLORS.black }}>
        <View style={styles.scrollViewContainer}>
          <SectionInputs>
            <View style={styles.titleContainer}>
              <icons.pickpicture style={styles.iconsContainer} width={30} />
              <McText h3>Image</McText>
            </View>

            <View style={{ alignItems: "center" }}>
              <ImagePickerButton
                originalImageURI={props.image}
                setImageURI={props.setImage}
                setImageBase64={props.setBase64Image}
                width={Math.min(SIZES.height, SIZES.width) - 150}
                height={Math.min(SIZES.height, SIZES.width) - 150}
              />
            </View>

            <View style={styles.titleContainer}>
              <icons.picktitle style={styles.iconsContainer} width={30} />
              <McText h3>Title</McText>
            </View>

            <TextInput
              placeholder={"Enter your event's title"}
              placeholderTextColor={COLORS.gray}
              style={styles.textInputContainer}
              value={props.title}
              onChangeText={props.setTitle}
              multiline={false}
              maxLength={CONSTRAINTS.Event.Title.Max}
            />

            <View style={styles.titleContainer}>
              <icons.pickdescription style={styles.iconsContainer} width={30} />
              <McText h3>Description</McText>
            </View>

            <TextInput
              placeholder={"Enter your event's description"}
              placeholderTextColor={COLORS.gray}
              style={styles.textInputContainer}
              value={props.description}
              onChangeText={props.setDescription}
              multiline={true}
              maxLength={CONSTRAINTS.Event.Description.Max}
            />

            <View style={styles.titleContainer}>
              <icons.pickdate style={styles.iconsContainer} width={30} />
              <McText h3>Date</McText>
            </View>

            <TouchableOpacity
              style={styles.textInputContainer}
              onPress={() => {
                setOpenedDatePicker(true);
              }}
            >
              <Text style={styles.timeInputText}>
                {props.date ? (
                  <Text style={styles.timeInputText}>
                    {moment.utc(props.date).local().format("ll")}
                  </Text>
                ) : (
                  <Text style={styles.timeInputInactiveText}>
                    Pick your event's date
                  </Text>
                )}
              </Text>
            </TouchableOpacity>

            <View style={styles.titleContainer}>
              <icons.picktime style={styles.iconsContainer} width={30} />
              <McText h3>Time</McText>
            </View>

            <View style={{ flexDirection: "row", flex: 1 }}>
              <TouchableOpacity
                style={styles.startTimeInputContainer}
                onPress={() => {
                  setOpenedStartTimePicker(true);
                }}
              >
                {props.startTime ? (
                  <Text style={styles.timeInputText}>
                    {moment.utc(props.startTime).local().format("LT")}
                  </Text>
                ) : (
                  <Text style={styles.timeInputInactiveText}>Start</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.endTimeInputContainer}
                onPress={() => {
                  setOpenedEndTimePicker(true);
                }}
              >
                {props.endTime ? (
                  <Text style={styles.timeInputText}>
                    {moment.utc(props.endTime).local().format("LT")}
                  </Text>
                ) : (
                  <Text style={styles.timeInputInactiveText}>End</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.titleContainer}>
              <icons.picklocation style={styles.iconsContainer} width={30} />
              <McText h3>Location</McText>
            </View>

            <TextInput
              placeholder={"Enter your event's location"}
              placeholderTextColor={COLORS.gray}
              style={styles.textInputContainer}
              value={props.location}
              onChangeText={props.setLocation}
              maxLength={CONSTRAINTS.Event.Location.Max}
            />

            <View style={styles.titleContainer}>
              <icons.picktags style={styles.iconsContainer} width={30} />
              <McText h3>Tags (select 1)</McText>
            </View>

            <View>
              <InterestSelector
                selectedInterests={props.selectedInterests}
                setSelectedInterests={props.setSelectedInterests}
              />
            </View>
          </SectionInputs>
        </View>
        <View style={{height: insets.bottom }}/>
      </KeyboardAwareScrollView>
      <DateTimePickerModal
        isVisible={openedDatePicker}
        mode="date"
        date={props.date}
        onConfirm={onDatePicked}
        onCancel={() => setOpenedDatePicker(false)}
      />
      <DateTimePickerModal
        isVisible={openedStartTimePicker}
        mode="time"
        date={props.startTime}
        onConfirm={onStartTimePicked}
        onCancel={() => setOpenedStartTimePicker(false)}
      />
      <DateTimePickerModal
        isVisible={openedEndTimePicker}
        mode="time"
        date={props.endTime}
        onConfirm={onEndTimePicked}
        onCancel={() => setOpenedEndTimePicker(false)}
      />
    </View>
  );
};

export default EventEditor;

const SectionInputs = styled.View`
  margin-horizontal: 10px;
  margin-vertical: 15px;
`;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.trueBlack,
  },
  scrollViewContainer: {
    marginHorizontal: 20,
  },
  titleContainer: {
    marginTop: 20,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  textInputContainer: {
    borderColor: COLORS.gray,
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
  startTimeInputContainer: {
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontFamily: CUSTOMFONT_REGULAR,
    fontSize: 16,
    color: COLORS.white,
    paddingHorzontal: 10,
    paddingBottom: 10,
    paddingTop: 10,
    width: "47%",
  },
  endTimeInputContainer: {
    borderColor: COLORS.gray,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontFamily: CUSTOMFONT_REGULAR,
    fontSize: 16,
    color: COLORS.white,
    paddingHorzontal: 10,
    paddingBottom: 10,
    paddingTop: 10,
    width: "47%",
    position: "absolute",
    right: 0,
  },
  timeInputText: {
    fontSize: 16,
    fontFamily: CUSTOMFONT_REGULAR,
    color: COLORS.white,
  },
  timeInputInactiveText: {
    fontSize: 16,
    fontFamily: CUSTOMFONT_REGULAR,
    color: COLORS.gray,
  },
  iconsContainer: {
    marginRight: 10,
  },
});
