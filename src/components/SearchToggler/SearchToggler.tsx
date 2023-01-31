import {
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
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
  
  const SearchToggler = () => {
    const { userToken, currentSchool } = useContext(UserContext);
  
    const [pulledUsers, setPulledUsers] = useState<User[]>(null);
    const [pulledEvents, setPulledEvents] = useState<Event[]>(null);
  
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [isEventsToggle, setIsEventsToggle] = useState<boolean>(true);
  
    const pullData = async () => {
      if (isEventsToggle) {
        // getting events
        getAllSchoolEvents(userToken.UserAccessToken, currentSchool.SchoolID).then((events: Event[]) => {
            setPulledEvents(events)
            setIsRefreshing(false)
        }).catch((error: Error) => {
            displayError(error)
            setIsRefreshing(false)
        })
      } else {
        // getting users
        getAllSchoolUsers(userToken.UserAccessToken, currentSchool.SchoolID).then((users: User[]) => {
            setPulledUsers(users)
            setIsRefreshing(false)
        }).catch((error: Error) => {
            displayError(error)
            setIsRefreshing(false)
        })
        
      }
    };
  
    const onRefresh = async () => {
      isEventsToggle ? setPulledEvents(null) : setPulledUsers(null);
      setIsRefreshing(true);
      pullData();
    };
  
    const renderEventResult = (event: Event) => {
      return (
        <View key={event.EventID + "SearchToggler renderEventResult"}>

        </View>
      );
    };
    const renderUserResult = (user: User) => {
        return (
          <View key={user.UserID + "SearchToggler renderUserResult"}>
  
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
      <View style={{flex: 1}}>
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
            onPress={() => setIsEventsToggle(true)}
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
            onPress={() => setIsEventsToggle(false)}
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
        >
          {isEventsToggle ? (
            pulledEvents ? (
              pulledEvents.length !== 0 ? (
                pulledEvents.map((event: Event) => renderEventResult(event))
              ) : (
                <View
                  style={{
                    marginTop: 20,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <McText h3>No events to display!</McText>
                </View>
              )
            ) : (
              !isRefreshing && <ActivityIndicator style={{ marginTop: 20 }} />
            )
          ) : pulledUsers ? (
            pulledUsers.length !== 0 ? (
              pulledUsers.map((user: User) => renderUserResult(user))
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
          <View style={{ height: SIZES.tab_bar_height + 10 }}/>
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
  