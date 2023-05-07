import {
  ActivityIndicator,
  Keyboard,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { User, Event } from "../../constants/types";
import { SIZES, COLORS, EVENT_TOGGLER } from "../../constants";
import { UserContext } from "../../contexts/UserContext";
import { displayError } from "../../helpers/helpers";
import {
  searchSchoolEvents,
  getUserHostedFutureEvents,
  getUserHostedPastEvents,
  getUserJoinedFutureEvents,
  getUserJoinedPastEvents,
} from "../../services/EventService";
import EventCard from "../EventCard";
import { McText } from "../Styled";
import SectionHeader from "../Styled/SectionHeader";
import { searchSchoolUsers } from "../../services/UserService";
import UserResult from "./UserResult/UserResult";
import EventResult from "./EventResult/EventResult";
import { CUSTOMFONT_REGULAR } from "../../constants/theme";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";


type SearchTogglerProps = {
  canGoBack?: boolean;
};
const SearchToggler = (props: SearchTogglerProps) => {
  const { canGoBack } = props;
  const { userToken, currentSchool } = useContext(UserContext);
  const navigation = useNavigation<any>();

  const [pulledUsers, setPulledUsers] = useState<User[]>(null);
  const [pulledEvents, setPulledEvents] = useState<Event[]>(null);

  const [isEventsToggle, setIsEventsToggle] = useState<boolean>(true);

  const searchTextRef = useRef<string>("");
  const newTextRef = useRef<string>("");

  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>(null);

  const onSearchTextChanged = (newText: string) => {
    setPulledEvents(null);
    setPulledUsers(null);
    searchTextRef.current = newText;
    clearTimeout(timeoutId);
    const newTimeoutId = setTimeout(() => pullData(), 500);
    setTimeoutId(newTimeoutId);
  };

  const pullData = async () => {
    newTextRef.current = searchTextRef.current;
    const newText = newTextRef.current;

    // getting events
    searchSchoolEvents(
      userToken.UserAccessToken,
      currentSchool.SchoolID,
      newText
    )
      .then((events: Event[]) => {
        console.log(
          "newText: " + newText + " searchText: " + searchTextRef.current
        );
        if (newText !== searchTextRef.current) {
          return;
        }
        setPulledEvents(events);
      })
      .catch((error: Error) => {
        console.warn(error);
      });

    // getting users
    searchSchoolUsers(
      userToken.UserAccessToken,
      currentSchool.SchoolID,
      newText
    )
      .then((users: User[]) => {
        console.log(
          "newText: " + newText + " searchText: " + searchTextRef.current
        );
        if (newText !== searchTextRef.current) {
          return;
        }
        setPulledUsers(users);
      })
      .catch((error: Error) => {
        console.warn(error);
      });
  };

  const renderEventResult = (event: Event) => {
    return (
      <View key={event.EventID + "SearchToggler renderEventResult"}>
        <EventResult event={event} />
      </View>
    );
  };
  const renderUserResult = (user: User) => {
    return (
      <View key={user.UserID + "SearchToggler renderUserResult"}>
        <UserResult user={user} />
      </View>
    );
  };

  useEffect(() => {
    pullData();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.black }}>
      <View style={{ backgroundColor: COLORS.trueBlack }}>
        <View
          style={{
            width: "90%",
            backgroundColor: "rgba(80,80,80,.90)",
            borderRadius: 10,
            paddingHorizontal: 10,
            paddingVertical: 10,
            marginVertical: 10,
            flexDirection: "row",
            alignSelf: "center",
          }}
        >
          <TouchableOpacity onPress={() =>navigation.pop()}>
            <MaterialIcons name="arrow-back" size={25} color="white" />
          </TouchableOpacity>
          <TextInput
            placeholder="Search"
            onChangeText={onSearchTextChanged}
            style={{
              fontFamily: CUSTOMFONT_REGULAR,
              color: COLORS.white,
              fontSize: 16,
              paddingLeft: 10,
            }}
            placeholderTextColor={COLORS.lightGray}
          />
        </View>
      </View>
      <View
        style={{
          backgroundColor: COLORS.trueBlack,
          ...styles.buttonToggleContainer,
        }}
      >
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: "transparent",
            borderBottomColor: isEventsToggle
              ? COLORS.purple
              : COLORS.trueBlack,
            backgroundColor: COLORS.trueBlack,
            ...styles.toggleButton,
          }}
          onPress={() => {
            setIsEventsToggle(true);
          }}
        >
          <McText h3 color={isEventsToggle ? COLORS.purple : COLORS.white}>
            Events
          </McText>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: "transparent",
            borderBottomColor: !isEventsToggle
              ? COLORS.purple
              : COLORS.trueBlack,
            backgroundColor: COLORS.trueBlack,
            ...styles.toggleButton,
          }}
          onPress={() => {
            setIsEventsToggle(false);
          }}
        >
          <McText h3 color={!isEventsToggle ? COLORS.purple : COLORS.white}>
            Users
          </McText>
        </TouchableOpacity>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={"always"}
        onScrollBeginDrag={() => Keyboard.dismiss()}
      >
        <View style={{ height: 10 }} />
        <View style={{ flex: 1 }}>
          {isEventsToggle ? (
            pulledEvents ? (
              pulledEvents.map((event: Event) => renderEventResult(event))
            ) : (
              <ActivityIndicator
                style={{ marginTop: 10 }}
                color={COLORS.white}
                size="small"
              />
            )
          ) : pulledUsers ? (
            pulledUsers.map((user: User) => renderUserResult(user))
          ) : (
            <ActivityIndicator
              style={{ marginTop: 10 }}
              color={COLORS.white}
              size="small"
            />
          )}
          <View style={{ height: 20 }} />
        </View>
      </ScrollView>
    </View>
  );
};

export default SearchToggler;

const styles = StyleSheet.create({
  buttonToggleContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.trueBlack,
  },
  toggleButton: {
    width: "50%",
    height: 40,
  },
});
