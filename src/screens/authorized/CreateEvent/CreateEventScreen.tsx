import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import {
  COLORS,
  Event,
  FONTS,
  Interest,
  SCREENS,
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
import DatePicker from "react-native-date-picker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import {
  checkIfEventIsFormatted,
  convertDateToUTC,
  convertToStartTimeEndTime,
  displayError,
  formatError,
} from "../../../helpers/helpers";
import * as Navigator from "../../../navigation/Navigator";
import { updateEvent } from "../../../services/EventService";
import { UserContext } from "../../../contexts/UserContext";
import { updateEventInterestsByEventId } from "../../../services/InterestService";

type EditEventScreenParams = {
  eventID: string;
};

const CreateEventScreen = ({ navigation, route }) => {
  const { setLoading } = useContext(ScreenContext);
  const { userToken } = useContext(UserContext);

  const [title, setTitle] = useState<string>();
  const [location, setLocation] = useState<string>();
  const [image, setImage] = useState<string>();
  const [date, setDate] = useState<Date>();
  const [desc, setDesc] = useState<string>();
  const [start, setStart] = useState<Date>();
  const [end, setEnd] = useState<Date>();
  const [selectedInterests, setSelectedInterests] = useState(
    new Set<Interest>()
  );

  const [openedStartTimePicker, setOpenedStartTimePicker] =
    useState<boolean>(false);
  const [openedEndTimePicker, setOpenedEndTimePicker] =
    useState<boolean>(false);
  const [openedDatePicker, setOpenedDatePicker] = useState<boolean>(false);

  useEffect(() => {}, []);

  const onStartTimePicked = (selectedTime: Date) => {
    var date = convertDateToUTC(selectedTime);
    console.log("setting start to be " + date.toISOString());
    setStart(date);
    setOpenedStartTimePicker(false);
  };

  const onEndTimePicked = (selectedTime: Date) => {
    setEnd(selectedTime);
    setOpenedEndTimePicker(false);
  };

  const onDatePicked = (selectedDate: Date) => {
    setDate(selectedDate);
    setOpenedDatePicker(false);
  };

  const onSubmit = () => {
    if (!date || !start || !end) {
      displayError(
        formatError("Input error", "Please fill in all valid fields")
      );
      return;
    }
    const timeValuesToMap: { [key: string]: Date } = convertToStartTimeEndTime(
      date,
      start,
      end
    );

    const startDateTime: Date = timeValuesToMap["startDateTime"];
    const endDateTime: Date = timeValuesToMap["endDateTime"];

    const createdEvent: Event = {
      EventID: undefined,
      Title: title,
      Description: desc,
      Picture: image,
      Location: location,
      StartDateTime: startDateTime,
      EndDateTime: endDateTime,
      Visibility: true,
    };

    if (!checkIfEventIsFormatted(createdEvent)) {
      displayError(
        formatError("Input error", "Check that all of the fields are readable")
      );
      return;
    }

    console.log("start time:");
    console.log(createdEvent.StartDateTime.getTime());
    if (
      createdEvent.StartDateTime.getTime() > createdEvent.EndDateTime.getTime()
    ) {
      displayError(
        formatError("Input error", "The start time must be before the end time")
      );
      return;
    }

    if (createdEvent.StartDateTime.getTime() < Date.now()) {
      displayError(
        formatError("Input error", "The event must not be in the past")
      );
      return;
    }

    if (selectedInterests.size !== 1) {
      displayError(formatError("Input error", "Please only select one tag"));
      return;
    }
    console.log(createdEvent);

    Navigator.navigate(SCREENS.PreviewEvent, {
      createdEvent: createdEvent,
      interests: Array.from(selectedInterests),
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <SectionHeader
        title={"Create Event"}
        leftButtonOnClick={() => {
          Navigator.goBack();
        }}
        leftButtonSVG={<icons.backarrow />}
        rightButtonOnClick={() => {
          onSubmit();
        }}
        rightButtonSVG={
          <McText h3 color={COLORS.purple}>
            Next
          </McText>
        }
      />
      <KeyboardAwareScrollView>
        <View style={styles.scrollViewContainer}>
          <SectionInputs>
            <View style={styles.titleContainer}>
              <icons.pickpicture width={30} />
              <McText h3>Image</McText>
            </View>

            <View style={{ alignItems: "center" }}>
              <ImagePickerButton
                originalImageURI={image}
                setImageURI={setImage}
                width={Math.min(SIZES.height, SIZES.width) - 150}
                height={Math.min(SIZES.height, SIZES.width) - 150}
              />
            </View>

            <View style={styles.titleContainer}>
              <icons.picktitle style={styles.iconsContainer} width={30} />
              <McText h3>Title</McText>
            </View>

            <TextInput
              placeholder={"enter your event's title"}
              placeholderTextColor={COLORS.gray}
              style={styles.textInputContainer}
              value={title}
              onChangeText={setTitle}
              multiline={false}
              maxLength={70}
            />

            <View style={styles.titleContainer}>
              <icons.pickdescription style={styles.iconsContainer} width={30} />
              <McText h3>Description</McText>
            </View>

            <TextInput
              placeholder={"enter your event's description"}
              placeholderTextColor={COLORS.gray}
              style={styles.textInputContainer}
              value={desc}
              onChangeText={setDesc}
              multiline={true}
              maxLength={400}
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
                {date ? (
                  <Text style={styles.timeInputText}>
                    {moment.utc(date).local().format("ll")}
                  </Text>
                ) : (
                  <Text style={styles.timeInputInactiveText}>
                    pick your event's date
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
                {start ? (
                  <Text style={styles.timeInputText}>
                    {moment.utc(start).local().format("LT")}
                  </Text>
                ) : (
                  <Text style={styles.timeInputInactiveText}>start</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.endTimeInputContainer}
                onPress={() => {
                  setOpenedEndTimePicker(true);
                }}
              >
                {end ? (
                  <Text style={styles.timeInputText}>
                    {moment.utc(end).local().format("LT")}
                  </Text>
                ) : (
                  <Text style={styles.timeInputInactiveText}>end</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.titleContainer}>
              <icons.picklocation style={styles.iconsContainer} width={30} />
              <McText h3>Location</McText>
            </View>

            <TextInput
              placeholder={"enter your event's location"}
              placeholderTextColor={COLORS.gray}
              style={styles.textInputContainer}
              value={location}
              onChangeText={setLocation}
              maxLength={50}
            />

            <View style={styles.titleContainer}>
              <icons.picktags style={styles.iconsContainer} width={30} />
              <McText h3>Tags (select 1)</McText>
            </View>

            <View>
              <InterestSelector
                selectedInterests={selectedInterests}
                setSelectedInterests={setSelectedInterests}
              />
            </View>
          </SectionInputs>
        </View>
      </KeyboardAwareScrollView>
      <DateTimePickerModal
        isVisible={openedDatePicker}
        mode="date"
        date={date}
        onConfirm={onDatePicked}
        onCancel={() => setOpenedDatePicker(false)}
      />
      <DateTimePickerModal
        isVisible={openedStartTimePicker}
        mode="time"
        date={start}
        onConfirm={onStartTimePicked}
        onCancel={() => setOpenedStartTimePicker(false)}
      />
      <DateTimePickerModal
        isVisible={openedEndTimePicker}
        mode="time"
        date={end}
        onConfirm={onEndTimePicked}
        onCancel={() => setOpenedEndTimePicker(false)}
      />
    </SafeAreaView>
  );
};

export default CreateEventScreen;

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
  startTimeInputContainer: {
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
    width: "47%",
  },
  endTimeInputContainer: {
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
