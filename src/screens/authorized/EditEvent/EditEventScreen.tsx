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
  formatError,
  showBugReportPopup,
} from "../../../helpers/helpers";
import { updateEvent } from "../../../services/EventService";
import { UserContext } from "../../../contexts/UserContext";
import MobileSafeView from "../../../components/Styled/MobileSafeView";
import EventEditor from "../../../components/EventEditor/EventEditor";
import { useNavigation } from "@react-navigation/native";
import { CONSTRAINTS } from "../../../constants/constraints";
import { CustomError } from "../../../constants/error";
import { Feather } from "@expo/vector-icons";
import { AlertContext } from "../../../contexts/AlertContext";
import { useDispatch, useSelector } from "react-redux";
import { selectEventByID, selectEventInterestsByID } from "../../../redux/events/eventSelectors";
import { AppDispatch, RootState } from "../../../redux/store";
import { setEventInterestsMap, setEventMap, updateEventInterestsMap, updateEventMap } from "../../../redux/events/eventSlice";

type EditEventScreenParams = {
  eventID: string;
};

const EditEventScreen = ({ route }) => {
  const { eventID }: EditEventScreenParams = route.params;

  const dispatch = useDispatch<AppDispatch>();
  const storedEvent = useSelector((state: RootState) => selectEventByID(state, eventID));
  const storedInterests = useSelector((state: RootState) => selectEventInterestsByID(state, eventID));

  const { setLoading } = useContext(ScreenContext);
  const { userToken } = useContext(UserContext);
  const navigation = useNavigation<any>();

  const {showErrorAlert} = useContext(AlertContext)


  const [title, setTitle] = useState<string>(storedEvent?.Title);
  const [location, setLocation] = useState<string>(
    storedEvent?.Location
  );
  const [image, setImage] = useState<string>(storedEvent?.Picture);
  const [base64Image, setBase64Image] = useState<string>(null);
  const [date, setDate] = useState<Date>(new Date(storedEvent?.StartDateTime));
  const [desc, setDesc] = useState<string>(storedEvent?.Description);
  const [start, setStart] = useState<Date>(
    new Date(storedEvent?.StartDateTime)
  );
  const [end, setEnd] = useState<Date>(storedEvent?.EndDateTime ? new Date(storedEvent?.EndDateTime) : undefined);
  const [selectedInterests, setSelectedInterests] = useState(
    new Set<Interest>(storedInterests)
  );

  const [doNotifyJoinedUsers, setDoNotifyJoinedUsers] = useState(false)

  const [openedStartTimePicker, setOpenedStartTimePicker] =
    useState<boolean>(false);
  const [openedEndTimePicker, setOpenedEndTimePicker] =
    useState<boolean>(false);
  const [openedDatePicker, setOpenedDatePicker] = useState<boolean>(false);

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
      showErrorAlert(
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

    const updatedEvent: Event = {
      EventID: eventID,
      Title: title,
      Description: desc,
      Picture: image,
      Location: location,
      StartDateTime: startDateTime.toISOString(),
      EndDateTime: endDateTime.toISOString(),
      Visibility: storedEvent?.Visibility,
      NumJoins: storedEvent?.NumJoins,
      NumShoutouts: storedEvent?.NumShoutouts,
      UserJoin: storedEvent?.UserJoin,
      UserShoutout: storedEvent?.UserShoutout,
      HostUserID: storedEvent?.HostUserID,
    };

    if (!checkIfEventIsFormatted(updatedEvent)) {
      showErrorAlert(
        formatError("Input error", "Check that all of the fields are readable")
      );
      return;
    }

    if (
      (new Date(updatedEvent.StartDateTime)).getTime() > (new Date(updatedEvent.EndDateTime)).getTime()
    ) {
      showErrorAlert(
        formatError("Input error", "The start time must be before the end time")
      );
      return;
    }

    console.log(Date.now());
    if ((new Date(updatedEvent.StartDateTime)).getTime() < Date.now()) {
      showErrorAlert(
        formatError("Input error", "The event must not be in the past")
      );
      return;
    }

    if (selectedInterests.size > CONSTRAINTS.Event.Interest.Max) {
      showErrorAlert(
        formatError(
          "Input error",
          "Please select at most " + CONSTRAINTS.Event.Interest.Max + " tag."
        )
      );
      return;
    }
    if (selectedInterests.size < CONSTRAINTS.Event.Interest.Min) {
      showErrorAlert(
        formatError(
          "Input error",
          "Please select at least " + CONSTRAINTS.Event.Interest.Min + " tag."
        )
      );
      return;
    }
    console.log(updatedEvent);

    setLoading(true);
    const arrayInterests: Interest[] = Array.from(selectedInterests);
    const updatedEventBase64 = { ...updatedEvent };
    updatedEventBase64.Picture = base64Image;
    updateEvent(userToken.UserAccessToken, updatedEventBase64, arrayInterests, doNotifyJoinedUsers)
      .then(() => {
        dispatch(updateEventMap({id: eventID, changes: updatedEvent }))
        dispatch(setEventInterestsMap({id: eventID, interests: arrayInterests}))
        setLoading(false);
        navigation.goBack();
      })
      .catch((error: CustomError) => {
        if(error.showBugReportDialog){
          showBugReportPopup(error)
        }
        else{
          showErrorAlert(error);
        }
        setLoading(false);
      });
  };

  return (
    <MobileSafeView style={styles.container} isBottomViewable={true}>
      <SectionHeader
        title={"Edit Event"}
        leftButtonOnClick={() => {
          navigation.goBack();
        }}
        leftButtonSVG={<Feather name="arrow-left" size={28} color="white" />}
        rightButtonOnClick={() => {
          onSubmit();
        }}
        rightButtonSVG={
          <McText body2 color={COLORS.purple}>
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
        setSelectedInterests={setSelectedInterests} doNotify={doNotifyJoinedUsers} setDoNotify={setDoNotifyJoinedUsers} notifyText={"Notify joined users"}      />
    </MobileSafeView>
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
