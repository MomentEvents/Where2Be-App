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
import { User, Event, SearchResult } from "../../constants/types";
import { SIZES, COLORS, EVENT_TOGGLER } from "../../constants";
import { UserContext } from "../../contexts/UserContext";
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
import UserResult from "../UserResult/UserResult";
import EventResult from "../EventResult/EventResult";
import { CUSTOMFONT_REGULAR } from "../../constants/theme";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { icons } from "../../constants";
import { useNavigation } from "@react-navigation/native";
import { CustomError } from "../../constants/error";
import RetryButton from "../RetryButton";
import { McTextInput } from "../Styled/styled";
import { AntDesign, Feather } from "@expo/vector-icons";
import { showBugReportPopup } from "../../helpers/helpers";
import { searchSchoolEventsAndUsers } from "../../services/SchoolService";

const SearchToggler = () => {
  const { userToken, currentSchool } = useContext(UserContext);

  const [pulledResults, setPulledResults] = useState<SearchResult[]>(null);

  const [showRetry, setShowRetry] = useState(false);

  const searchTextRef = useRef<string>("");
  const newTextRef = useRef<string>("");

  const timeoutId = useRef<NodeJS.Timeout>(null);

  const navigation = useNavigation<any>();

  const onSearchTextChanged = (newText: string) => {
    setShowRetry(false);
    if (newText == searchTextRef.current) {
      return;
    }

    newText = newText.trim();
    setPulledResults(newText === "" ? [] : null);
    searchTextRef.current = newText;
    clearTimeout(timeoutId.current);
    if (newText === "") {
      return;
    }
    const newTimeoutId = setTimeout(() => pullData(), 500);
    timeoutId.current = newTimeoutId;
  };

  const onBackPressed = () => {
    navigation.pop();
  };

  const pullData = async () => {
    newTextRef.current = searchTextRef.current;
    const newText = newTextRef.current;

    searchSchoolEventsAndUsers(
      userToken.UserAccessToken,
      currentSchool.SchoolID,
      newText
    )
      .then((results: SearchResult[]) => {
        console.log(
          "newText: " + newText + " searchText: " + searchTextRef.current
        );
        if (newText !== searchTextRef.current) {
          return;
        }
        setPulledResults(results);
      })
      .catch((error: CustomError) => {
        if (error.showBugReportDialog) {
          showBugReportPopup(error);
        }
        setShowRetry(true);
        console.log(error);
      });
  };

  const renderResult = (result: SearchResult) => {
    if (result['Type'] == 'event'){
      return renderEventResult(result['Event']);
    } else if (result['Type'] == 'user'){
      return renderUserResult(result['User'])
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

  useEffect(() => {
    pullData();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.trueBlack }}>
      <View
        style={{
          backgroundColor: COLORS.trueBlack,
          flexDirection: "row",
          paddingVertical: 10,
        }}
      >
        <TouchableOpacity
          onPress={onBackPressed}
          style={{
            marginVertical: 15,
            marginLeft: 20,
          }}
        >
          <Feather name="arrow-left" size={28} color="white" />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(80,80,80,.90)",
            borderRadius: 10,
            paddingHorizontal: 15,
            paddingVertical: 10,
            marginHorizontal: 20,
            justifyContent: "center",
            alignSelf: "center",
          }}
        >
          <McTextInput
            autoCapitalize="none"
            autoCorrect={false}
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
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={"always"}
        onScrollBeginDrag={() => Keyboard.dismiss()}
      >
        {showRetry && (
          <RetryButton
            setShowRetry={setShowRetry}
            retryCallBack={pullData}
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
            }}
          />
        )}
        {!showRetry && (
          <View style={{ flex: 1, marginTop: 10 }}>
            {
              pulledResults ? (
                pulledResults.map((result: SearchResult) => renderResult(result))
              ) : (
                <ActivityIndicator
                  style={{ marginTop: 10 }}
                  color={COLORS.white}
                  size="small"
                />
              )
            }
            <View style={{ height: 20 }} />
          </View>
        )}
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
