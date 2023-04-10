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

  const [isEventsToggle, setIsEventsToggle] = useState<boolean>(true);
  const [searchText, setSearchText] = useState<string>("");

  // For auto list scrolling
  const eventsFlatListRef = useRef(null);
  const usersFlatListRef = useRef(null);

  // Data currently in the list
  const [displayingUsers, setDisplayingUsers] = useState<User[]>([]);
  const [displayingEvents, setDisplayingEvents] = useState<Event[]>([]);

  // All data pulled with empty search query
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);

  // Is list refreshing
  const [isEventsRefreshing, setIsEventsRefreshing] = useState<boolean>(true);
  const [isUsersRefreshing, setIsUsersRefreshing] = useState<boolean>(true);
  // Show activity indicator for the entire search
  const [showRefresh, setShowRefresh] = useState(true);

  // Current batch number
  const [eventsCurrentBatch, setEventsCurrentBatch] = useState<number>(0);
  const [usersCurrentBatch, setUsersCurrentBatch] = useState<number>(0);

  // A set of batch number used (avoid repetitive api calls)
  const [eventsBatchSet, setEventsBatchSet] = useState<Set<number>>(new Set());
  const [usersBatchSet, setUsersBatchSet] = useState<Set<number>>(new Set());

  // Is search or "See all results" pressed
  const [searchPressed, setSearchPressed] = useState<boolean>(false);

  // Allow api calls
  const [allowServerSearch, setAllowServerSearch] = useState<boolean>(true);

  // Initial
  useEffect(() => {
    onEventsRefresh();
    onUsersRefresh(true);
  }, []);
  
  // Reset when search text changes
  useEffect(() => {
    setSearchPressed(false);
    setAllowServerSearch(searchText == ""? true : false);
  }, [searchText]);

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

  const pullEvents = async (reset: boolean, stopRefresh=false) => {
    const currentBatch = reset? 0 : eventsCurrentBatch;
    const currentSearchText = searchText;
    console.log(eventsBatchSet.has(currentBatch)? "events api current batch " +  currentBatch + " is repetitive and blocked" : "events api current batch " +  currentBatch + " is allowed and underway");
    if (reset || !eventsBatchSet.has(currentBatch)){
      eventsBatchSet.add(currentBatch);
      // getting events
      getAllSchoolEvents(userToken.UserAccessToken, currentSchool.SchoolID, currentSearchText, currentBatch)
        .then((events: Event[]) => {
          console.log("Received response from EventService: getAllSchoolEvents (searchQuery: " + currentSearchText + ", currentBatch: " + currentBatch + ", reset: " + reset + ")");
          setDisplayingEvents(prevDisplayingEvents => reset? events : prevDisplayingEvents.concat(events));
          if (searchText == ""){
            setAllEvents(prevAllEvents => reset? events : prevAllEvents.concat(events));
          }
          setIsEventsRefreshing(false);
          // if (reset && eventsFlatListRef.current && events.length > 0) {
          //   eventsFlatListRef.current.scrollToIndex({ index: 0 });
          // }
          if (reset){
            setEventsCurrentBatch(1);
          } else if (events.length > 0){
            setEventsCurrentBatch(prevEventsCurrentBatch => prevEventsCurrentBatch + 1);
          }
        })
        .catch((error: Error) => {
          displayError(error);
          setIsEventsRefreshing(false);
          setShowRefresh(false);
        })
        .finally(() => {
          if (stopRefresh){
            setShowRefresh(false);
          }
        });
    }
  };

  const pullUsers = async (reset: boolean, stopRefresh=false) => {
    const currentBatch = reset? 0 : usersCurrentBatch;
    const currentSearchText = searchText;
    console.log(usersBatchSet.has(currentBatch)? "users api current batch " +  currentBatch + " is repetitive and blocked" : "users api current batch " +  currentBatch + " is allowed and underway");
    if (reset || !usersBatchSet.has(currentBatch)){
      usersBatchSet.add(currentBatch);
      // getting users
      getAllSchoolUsers(userToken.UserAccessToken, currentSchool.SchoolID, currentSearchText, currentBatch)
        .then((users: User[]) => {
          console.log("Received response from UserService: getAllSchoolUsers (searchQuery: " + currentSearchText + ", currentBatch: " + currentBatch + ", reset: " + reset + ")");
          setDisplayingUsers(prevDisplayingUsers => reset? users : prevDisplayingUsers.concat(users));
          if (searchText == ""){
            setAllUsers(prevAllUsers => reset? users : prevAllUsers.concat(users));
          }
          setIsUsersRefreshing(false);
          // if (reset && usersFlatListRef.current && users.length > 0) {
          //   usersFlatListRef.current.scrollToIndex({ index: 0 });
          // }
          if (reset){
            setUsersCurrentBatch(1);
          } else if (users.length > 0){
            setUsersCurrentBatch(prevUsersCurrentBatch => prevUsersCurrentBatch + 1);
          }
        })
        .catch((error: Error) => {
          displayError(error);
          setIsUsersRefreshing(false);
          setShowRefresh(false);
        })
        .finally(() => {
          if (stopRefresh){
            setShowRefresh(false);
          }
        });
    }
  };

  const onEventsRefresh = async (stopRefresh=false) => {
    setEventsBatchSet(new Set());
    setIsEventsRefreshing(true);
    await pullEvents(true, stopRefresh);
  };
  const onUsersRefresh = async (stopRefresh=false) => {
    setUsersBatchSet(new Set());
    setIsUsersRefreshing(true);
    await pullUsers(true, stopRefresh);
  };

  const handleLoadMoreEvents = () => {
    if (allowServerSearch){
      pullEvents(false);
    }
  }
  const handleLoadMoreUsers = () => {
    if (allowServerSearch){
      pullUsers(false);
    }
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

  const renderListFooter = () => {
    if (!searchPressed && searchText !== '') {
      return (
        <TouchableOpacity
          style={{
            marginTop: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={searchQueryServer}
        >
          <McText h4 numberOfLines={1}>
            See all results
          </McText>
        </TouchableOpacity>
      );
    } else {
      return (
        <View
          style={{
            marginTop: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <McText h3>
            {isEventsToggle && displayingEvents.length == 0 && !isEventsRefreshing? "No upcoming events!" : 
            !isEventsToggle && displayingUsers.length == 0 && !isUsersRefreshing? "No users to display!" : ""}
          </McText>
        </View>
      )
    }
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
    // if (eventsFlatListRef.current && searchedEventsTemp.length > 0) {
    //   eventsFlatListRef.current.scrollToIndex({ index: 0 });
    // }
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
    // if (usersFlatListRef.current && searchedUsersTemp.length > 0) {
    //   usersFlatListRef.current.scrollToIndex({ index: 0 });
    // }
  }

  const searchQueryServer = async() => {
    Keyboard.dismiss();
    setSearchPressed(true);
    setShowRefresh(true);
    setDisplayingEvents([]);
    setDisplayingUsers([]);
    onEventsRefresh();
    onUsersRefresh(true);
    setAllowServerSearch(true);
  }

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
        showRefresh? (
          <ActivityIndicator color={COLORS.white} style={{ marginTop: 10 }}/>
        ) : (
        isEventsToggle? (
          <FlatList
            contentContainerStyle={{paddingTop: 10, paddingBottom: 20}}
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
            ListFooterComponent={renderListFooter}
            onScrollBeginDrag={() => {Keyboard.dismiss()}}
          />
        ) : (
          <FlatList
            contentContainerStyle={{paddingTop: 10, paddingBottom: 20}}
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
            ListFooterComponent={renderListFooter}
            onScrollBeginDrag={() => {Keyboard.dismiss()}}
          />
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
