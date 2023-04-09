import {
  ActivityIndicator,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Keyboard
} from "react-native";
import React, { useContext, useEffect, useState, useRef } from "react";
import { User, Event } from "../../constants/types";
import { SIZES, COLORS, EVENT_TOGGLER } from "../../constants";
import { QUERY_PER_BATCH } from "../../constants/server";
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

  const eventsFlatListRef = useRef(null);
  const usersFlatListRef = useRef(null);

  const [displayingUsers, setDisplayingUsers] = useState<User[]>([]);
  const [displayingEvents, setDisplayingEvents] = useState<Event[]>([]);

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);

  const [isEventsRefreshing, setIsEventsRefreshing] = useState<boolean>(true);
  const [isUsersRefreshing, setIsUsersRefreshing] = useState<boolean>(true);

  const [eventsCurrentBatch, setEventsCurrentBatch] = useState<number>(0);
  const [usersCurrentBatch, setUsersCurrentBatch] = useState<number>(0);

  const [eventsBatchSet, setEventsBatchSet] = useState<Set<number>>(new Set());
  const [usersBatchSet, setUsersBatchSet] = useState<Set<number>>(new Set());

  const [isEventsToggle, setIsEventsToggle] = useState<boolean>(true);

  const [searchText, setSearchText] = useState<string>("");

  const toggleTab = (isEvent: boolean) => {
    if (isEventsToggle != isEvent){
      setDisplayingEvents(displayingEvents.slice(0, QUERY_PER_BATCH));
      setDisplayingUsers(displayingUsers.slice(0, QUERY_PER_BATCH));
      setEventsCurrentBatch(1);
      setUsersCurrentBatch(1);
      setEventsBatchSet(new Set([0]));
      setUsersBatchSet(new Set([0]));
      setIsEventsToggle(isEvent);
    }
  }

  const pullEvents = async (reset: boolean) => {
    const currentBatch = reset? 0 : eventsCurrentBatch;
    const currentSearchText = searchText;
    console.log("eventsBatchSet.has(currentBatch) is " + eventsBatchSet.has(currentBatch) + ", size is " + eventsBatchSet.size);
    if (reset || !eventsBatchSet.has(currentBatch)){
      eventsBatchSet.add(currentBatch);
      // getting events
      getAllSchoolEvents(userToken.UserAccessToken, currentSchool.SchoolID, currentSearchText, currentBatch)
        .then((events: Event[]) => {
          console.log("Received response from EventService: getAllSchoolEvents (searchQuery: " + currentSearchText + ", currentBatch: " + currentBatch + ", reset: " + reset + ")");
          setDisplayingEvents(reset? events : displayingEvents.concat(events));
          if (searchText == ""){
            setAllEvents(reset? events : allEvents.concat(events));
          }
          setIsEventsRefreshing(false);
          if (reset && eventsFlatListRef.current && events.length > 0) {
            eventsFlatListRef.current.scrollToIndex({ index: 0 });
          }
          if (reset){
            setEventsCurrentBatch(1);
          } else if (events.length > 0){
            setEventsCurrentBatch(eventsCurrentBatch + 1);
          }
        })
        .catch((error: Error) => {
          displayError(error);
          setIsEventsRefreshing(false);
        });
    }
  };

  const pullUsers = async (reset: boolean) => {
    const currentBatch = reset? 0 : usersCurrentBatch;
    const currentSearchText = searchText;
    console.log("usersBatchSet.has(currentBatch) is " + usersBatchSet.has(currentBatch) + ", size is " + usersBatchSet.size);
    if (reset || !usersBatchSet.has(currentBatch)){
      usersBatchSet.add(currentBatch);
      // getting users
      getAllSchoolUsers(userToken.UserAccessToken, currentSchool.SchoolID, currentSearchText, currentBatch)
        .then((users: User[]) => {
          console.log("Received response from UserService: getAllSchoolUsers (searchQuery: " + currentSearchText + ", currentBatch: " + currentBatch + ", reset: " + reset + ")");
          setDisplayingUsers(reset? users : displayingUsers.concat(users));
          if (searchText == ""){
            setAllUsers(reset? users : allUsers.concat(users));
          }
          setIsUsersRefreshing(false);
          if (reset && usersFlatListRef.current && users.length > 0) {
            usersFlatListRef.current.scrollToIndex({ index: 0 });
          }
          if (reset){
            setUsersCurrentBatch(1);
          } else if (users.length > 0){
            setUsersCurrentBatch(usersCurrentBatch + 1);
          }
        })
        .catch((error: Error) => {
          displayError(error);
          setIsUsersRefreshing(false);
        });
    }
  };

  const onEventsRefresh = async () => {
    setEventsBatchSet(new Set());
    setIsEventsRefreshing(true);
    await pullEvents(true);
  };

  const onUsersRefresh = async () => {
    setUsersBatchSet(new Set());
    setIsUsersRefreshing(true);
    await pullUsers(true);
  };

  const handleLoadMoreEvents = () => {
    pullEvents(false);
  }

  const handleLoadMoreUsers = () => {
    pullUsers(false);
  }

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

  const searchQueryLocal = (newText: string) => {
    setSearchText(newText);
    const searchedEventsTemp: Event[] = [];
    const searchedUsersTemp: User[] = [];
    allEvents.forEach((event: Event) => {
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
    setDisplayingEvents(searchedEventsTemp);
    if (eventsFlatListRef.current && searchedEventsTemp.length > 0) {
      eventsFlatListRef.current.scrollToIndex({ index: 0 });
    }
    allUsers.forEach((user: User) => {
      try {
        if (
          user.DisplayName.toLowerCase().includes(newText.toLowerCase()) ||
          user.Username.toLowerCase().includes(newText.toLowerCase())
        ) {
          searchedUsersTemp.push(user);
        }
      } catch (e) {
        console.log("exception with user with UserID " + user.UserID);
      }
    });
    setDisplayingUsers(searchedUsersTemp);
    if (usersFlatListRef.current && searchedUsersTemp.length > 0) {
      usersFlatListRef.current.scrollToIndex({ index: 0 });
    }
  }

  const searchQueryServer = () => {
    onEventsRefresh();
    onUsersRefresh();
  }

  useEffect(() => {
    onEventsRefresh();
    onUsersRefresh();
  }, []);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

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
            onChangeText={searchQueryLocal}
            onSubmitEditing={searchQueryServer}
            returnKeyType="search"
            style={{
              fontFamily: CUSTOMFONT_REGULAR,
              color: COLORS.white,
              fontSize: 16,
            }}
            placeholderTextColor={COLORS.lightGray}
            onFocus={() => setKeyboardVisible(true)}
            onBlur={() => setKeyboardVisible(false)}
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
            toggleTab(true);
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
            toggleTab(false);
          }}
        >
          <McText h3 color={!isEventsToggle ? COLORS.purple : COLORS.white}>
            Users
          </McText>
        </TouchableOpacity>
      </View>
      {
        isKeyboardVisible && searchText != ""? (
          <TouchableOpacity
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginVertical: 10
            }}
            onPress={() => {
              searchQueryServer();
              Keyboard.dismiss();
            }}  
          >
            <McText h4 numberOfLines={1}>See all results</McText>
          </TouchableOpacity>
        ) : (<></>)
      }
      {isEventsToggle? (
        displayingEvents.length > 0? (
          <FlatList
            ref={eventsFlatListRef}
            data={displayingEvents}
            keyExtractor={(item) => item.EventID + "SearchToggler renderEventResult"}
            renderItem={({ item }) => (renderEventResult(item))}
            onEndReached={handleLoadMoreEvents}
            onEndReachedThreshold={2}
            refreshControl={
              <RefreshControl
                tintColor={COLORS.white}
                refreshing={isEventsRefreshing}
                onRefresh={onEventsRefresh}
              />
            }
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={"always"}
          />
        ) : (
          isEventsRefreshing? (
            <ActivityIndicator color={COLORS.white} style={{ marginTop: 10 }} />
          ) : (
            <View
              style={{
                marginTop: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <McText h3>{isEventsRefreshing || isKeyboardVisible? "": "No upcoming events!"}</McText>
            </View>
          )
        ) 
      ) : (
        displayingUsers.length > 0? (
          <FlatList
            ref={usersFlatListRef}
            data={displayingUsers}
            keyExtractor={(item) => item.UserID + "SearchToggler renderUserResult"}
            renderItem={({ item }) => (renderUserResult(item))}
            onEndReached={handleLoadMoreUsers}
            onEndReachedThreshold={2}
            refreshControl={
              <RefreshControl
                tintColor={COLORS.white}
                refreshing={isUsersRefreshing}
                onRefresh={onUsersRefresh}
              />
            }
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps={"always"}
          />
        ) : (
          isUsersRefreshing? (
            <ActivityIndicator color={COLORS.white} style={{ marginTop: 10 }} />
          ) : (
            <View
              style={{
                marginTop: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <McText h3>{isUsersRefreshing || isKeyboardVisible? "" : "No users to display!"}</McText>
            </View>
          )
        )
      )}
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
