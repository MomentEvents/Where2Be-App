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
import { updateEvent } from "../../../services/EventService";
import { UserContext } from "../../../contexts/UserContext";
import MobileSafeView from "../../../components/Styled/MobileSafeView";
import EventEditor from "../../../components/EventEditor/EventEditor";
import { useNavigation } from "@react-navigation/native";
import { CONSTRAINTS } from "../../../constants/constraints";

type EditEventScreenParams = {
  eventID: string;
};

const CreateEventScreen = ({ route }) => {
  const navigation = useNavigation<any>();

  const { userToken } = useContext(UserContext);
  const [title, setTitle] = useState<string>();
  const [location, setLocation] = useState<string>();
  const [image, setImage] = useState<string>();
  const [base64Image, setBase64Image] = useState<string>();
  const [date, setDate] = useState<Date>();
  const [desc, setDesc] = useState<string>();
  const [start, setStart] = useState<Date>();
  const [end, setEnd] = useState<Date>();
  const [selectedInterests, setSelectedInterests] = useState(
    new Set<Interest>()
  );
  const [doNotifyFollowers, setDoNotifyFollowers] = useState(true);

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
      Visibility: "Public",
      NumJoins: 0,
      NumShoutouts: 0,
      UserJoin: false,
      UserShoutout: false,
      HostUserID: userToken.UserID,
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

    if (selectedInterests.size > CONSTRAINTS.Event.Interest.Max) {
      displayError(
        formatError(
          "Input error",
          "Please select at most " + CONSTRAINTS.Event.Interest.Max + " tag."
        )
      );
      return;
    }
    if (selectedInterests.size < CONSTRAINTS.Event.Interest.Min) {
      displayError(
        formatError(
          "Input error",
          "Please select at least " + CONSTRAINTS.Event.Interest.Min + " tag."
        )
      );
      return;
    }
    console.log(createdEvent);

    navigation.push(SCREENS.PreviewEvent, {
      createdEvent: createdEvent,
      base64Image: base64Image,
      interests: Array.from(selectedInterests),
      doNotifyFollowers: doNotifyFollowers,
    });
  };

  return (
    <MobileSafeView style={styles.container} isBottomViewable={true}>
      <SectionHeader
        title={"Create Event"}
        leftButtonOnClick={() => {
          navigation.goBack();
        }}
        leftButtonSVG={<icons.backarrow />}
        rightButtonOnClick={() => {
          onSubmit();
        }}
        rightButtonSVG={
          <McText h3 color={COLORS.purple}>
            Save
          </McText>
        }
      />
      <EventEditor
        title={title}
        setTitle={setTitle}
        location={location}
        setLocation={setLocation}
        image={image}
        setImage={setImage}
        base64Image={base64Image}
        setBase64Image={setBase64Image}
        date={date}
        setDate={setDate}
        description={desc}
        setDescription={setDesc}
        startTime={start}
        setStartTime={setStart}
        endTime={end}
        setEndTime={setEnd}
        selectedInterests={selectedInterests}
        setSelectedInterests={setSelectedInterests}
        doNotify={doNotifyFollowers}
        setDoNotify={setDoNotifyFollowers}
        notifyText={"Notify followers"}
      />
    </MobileSafeView>
  );
};

export default CreateEventScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.trueBlack,
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
