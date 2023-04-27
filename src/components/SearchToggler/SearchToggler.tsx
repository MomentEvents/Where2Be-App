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
import React, { useContext, useEffect, useState } from "react";
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

const SearchToggler = () => {
  const { userToken, currentSchool } = useContext(UserContext);

  const [pulledUsers, setPulledUsers] = useState<User[]>(null);
  const [pulledEvents, setPulledEvents] = useState<Event[]>(null);

  const [isEventsToggle, setIsEventsToggle] = useState<boolean>(true);

  const [searchText, setSearchText] = useState<string>("");

  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>(null);

  const onSearchTextChanged = (newText: string) => {
    setPulledEvents(null);
    setPulledUsers(null);
    setSearchText(newText);
    clearTimeout(timeoutId);
    const newTimeoutId = setTimeout(() => pullData(newText), 500);
    setTimeoutId(newTimeoutId);
  };


  const pullData = async (newText: string) => {
    // getting events
    searchSchoolEvents(userToken.UserAccessToken, currentSchool.SchoolID, newText)
      .then((events: Event[]) => {
        setPulledEvents(prevEvents => events);
      })
      .catch((error: Error) => {
        displayError(error);
      });
    // getting users
    searchSchoolUsers(userToken.UserAccessToken, currentSchool.SchoolID, newText)
      .then((users: User[]) => {
        setPulledUsers(prevUsers => users);
      })
      .catch((error: Error) => {
        displayError(error);
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
    pullData(searchText)
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor:COLORS.black }}>
      <View style={{ backgroundColor: COLORS.trueBlack }}>
        <View
          style={{
            width: "90%",
            backgroundColor: "rgba(80,80,80,.90)",
            borderRadius: 10,
            paddingHorizontal: 15,
            paddingVertical: 10,
            marginVertical: 10,
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <TextInput
            placeholder="Search"
            onChangeText={onSearchTextChanged}
            style={{
              fontFamily: CUSTOMFONT_REGULAR,
              color: COLORS.white,
              fontSize: 16,
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
            borderBottomColor: isEventsToggle ? COLORS.purple : COLORS.trueBlack,
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
            borderColor: 'transparent',
            borderBottomColor: !isEventsToggle ? COLORS.purple : COLORS.trueBlack,
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
        <View style={{height: 10}}/>
        <View style={{ flex: 1 }}>
          {isEventsToggle ? (
            pulledEvents? (
              pulledEvents.map((event: Event) => renderEventResult(event))
            ) : (
              <></>
            )
          ) : (
            pulledUsers? (
              pulledUsers.map((user: User) => renderUserResult(user))
            ) : (
              <></>
            )
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