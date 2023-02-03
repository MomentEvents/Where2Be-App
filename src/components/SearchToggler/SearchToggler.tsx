import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
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
  getAllSchoolEvents,
  getUserHostedFutureEvents,
  getUserHostedPastEvents,
  getUserJoinedFutureEvents,
  getUserJoinedPastEvents,
} from "../../services/EventService";
import EventCard from "../EventCard";
import { McText } from "../Styled";
import SectionHeader from "../Styled/SectionHeader";
import { getAllSchoolUsers } from "../../services/UserService";
import UserResult from "./UserResult/UserResult";
import EventResult from "./EventResult/EventResult";
import { CUSTOMFONT_REGULAR } from "../../constants/theme";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

const SearchToggler = () => {
  const { userToken, currentSchool } = useContext(UserContext);

  const [pulledUsers, setPulledUsers] = useState<User[]>(null);
  const [pulledEvents, setPulledEvents] = useState<Event[]>(null);

  const [searchedUsers, setSearchedUsers] = useState<User[]>(null);
  const [searchedEvents, setSearchedEvents] = useState<Event[]>(null);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isEventsToggle, setIsEventsToggle] = useState<boolean>(true);

  const [searchText, setSearchText] = useState<string>("");

  const searchQuery = (newText: string) => {
    setSearchText(newText);
    if (pulledEvents) {
      const searchedEventsTemp: Event[] = [];

      pulledEvents.forEach((event: Event) => {
        try {
          if (
            event.Title.toLowerCase().includes(newText.toLowerCase()) ||
            event.Description.toLowerCase().includes(newText.toLowerCase()) ||
            event.Location.toLowerCase().includes(newText.toLowerCase())
          ) {
            searchedEventsTemp.push(event);
          }
        } catch (e) {
          console.log("exception with event with EventID " + event.EventID);
        }
      });

      setSearchedEvents(searchedEventsTemp);
    }
    if (pulledUsers) {
      const searchedUsersTemp: User[] = [];

      pulledUsers.forEach((user: User) => {
        try {
          if (
            user.Name.toLowerCase().includes(newText.toLowerCase()) ||
            user.Username.toLowerCase().includes(newText.toLowerCase())
          ) {
            searchedUsersTemp.push(user);
          }
        } catch (e) {
          console.log("exception with user with UserID " + user.UserID);
        }
      });

      setSearchedUsers(searchedUsersTemp);
    }
  };
  const pullData = async () => {
    // getting events
    getAllSchoolEvents(userToken.UserAccessToken, currentSchool.SchoolID)
      .then((events: Event[]) => {
        setPulledEvents(events);
        setSearchedEvents(events);
        setIsRefreshing(false);
        searchQuery(searchText);
      })
      .catch((error: Error) => {
        displayError(error);
        setIsRefreshing(false);
      });
    // getting users
    getAllSchoolUsers(userToken.UserAccessToken, currentSchool.SchoolID)
      .then((users: User[]) => {
        setPulledUsers(users);
        setSearchedUsers(users);
        setIsRefreshing(false);
        searchQuery(searchText);
      })
      .catch((error: Error) => {
        displayError(error);
        setIsRefreshing(false);
      });
  };

  const onRefresh = async () => {
    setPulledEvents(null)
    setPulledUsers(null);
    setSearchedEvents(null)
    setSearchedUsers(null);
    setIsRefreshing(true);
    pullData();
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
    if (isEventsToggle && !pulledEvents) {
      pullData();
    } else if (!isEventsToggle && !pulledUsers) {
      pullData();
    }
  }, [isEventsToggle]);

  return (
    <View style={{ flex: 1 }}>
      <View style={{ backgroundColor: COLORS.black }}>
        <View
          style={{
            width: "90%",
            backgroundColor: "rgba(80,80,80,.90)",
            borderRadius: 5,
            paddingHorizontal: 10,
            paddingVertical: 10,
            marginVertical: 20,
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <TextInput
            placeholder="Search..."
            onChangeText={searchQuery}
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
          backgroundColor: isEventsToggle ? COLORS.black : COLORS.white,
          ...styles.buttonToggleContainer,
        }}
      >
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            borderWidth: isEventsToggle ? 0 : 1,
            borderColor: COLORS.purple,
            backgroundColor: isEventsToggle ? COLORS.purple : COLORS.trueBlack,
            ...styles.toggleButton,
          }}
          onPress={() => {
            setIsEventsToggle(true);
          }}
        >
          <McText h3 color={isEventsToggle ? COLORS.white : COLORS.purple}>
            Events
          </McText>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            borderWidth: !isEventsToggle ? 0 : 1,
            borderColor: COLORS.purple,
            backgroundColor: !isEventsToggle ? COLORS.purple : COLORS.trueBlack,
            ...styles.toggleButton,
          }}
          onPress={() => {
            setIsEventsToggle(false);
          }}
        >
          <McText h3 color={!isEventsToggle ? COLORS.white : COLORS.purple}>
            Users
          </McText>
        </TouchableOpacity>
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        keyboardShouldPersistTaps={"always"}
      >
        <View style={{height: 10}}/>
        <View style={{ flex: 1 }}>
          {isEventsToggle ? (
            searchedEvents ? (
              searchedEvents.length !== 0 ? (
                searchedEvents.map((event: Event) => renderEventResult(event))
              ) : (
                <View
                  style={{
                    marginTop: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <McText h3>No upcoming events!</McText>
                </View>
              )
            ) : (
              !isRefreshing && <ActivityIndicator style={{ marginTop: 20 }} />
            )
          ) : searchedUsers ? (
            searchedUsers.length !== 0 ? (
              searchedUsers.map((user: User) => renderUserResult(user))
            ) : (
              <View
                style={{
                  marginTop: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <McText h3>No users to display!</McText>
              </View>
            )
          ) : (
            !isRefreshing && <ActivityIndicator style={{ marginTop: 20 }} />
          )}
          <TouchableOpacity style={{ height: SIZES.tab_bar_height + 10 }} />
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
