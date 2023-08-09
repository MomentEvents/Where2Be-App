import {
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Linking,
  AppState,
} from "react-native";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ScreenContext } from "../../../contexts/ScreenContext";
import { COLORS, SCREENS, SIZES, icons } from "../../../constants";
import { Event } from "../../../constants/types";
import { User } from "../../../constants/types";
import { Interest } from "../../../constants/types";
import { LinearGradient } from "expo-linear-gradient";
import { McText } from "../../../components/Styled";
import moment from "moment";
import styled from "styled-components/native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import ImageView from "react-native-image-viewing";
import {
  addUserJoinEvent,
  addUserShoutoutEvent,
  getEventHostByEventId,
  removeUserJoinEvent,
  removeUserShoutoutEvent,
} from "../../../services/UserService";
import { UserContext } from "../../../contexts/UserContext";
import {
  formatError,
  openURL,
  showBugReportPopup,
  truncateNumber,
} from "../../../helpers/helpers";
import { EventContext } from "../../../contexts/EventContext";
import { deleteEvent, getEvent } from "../../../services/EventService";
import { getEventInterestsByEventId } from "../../../services/InterestService";
import GradientButton from "../../../components/Styled/GradientButton";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  AntDesign,
  Entypo,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Hyperlink from "react-native-hyperlink";
import RetryButton from "../../../components/RetryButton";
import { CustomError } from "../../../constants/error";
import { AlertContext } from "../../../contexts/AlertContext";
import EventPreviewer from "../../../components/EventPreviewer/EventPreviewer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { selectUserByID } from "../../../redux/users/userSelectors";
import {
  updateUserMap,
  updateUserNumericField,
} from "../../../redux/users/userSlice";
import {
  selectEventByID,
  selectEventInterestsByID,
} from "../../../redux/events/eventSelectors";
import {
  setEventInterestsMap,
  setEventMap,
  updateEventInterestsMap,
  updateEventMap,
} from "../../../redux/events/eventSlice";
import EventDetails from "../../../components/EventDetails/EventDetails";
import { getStoredToken } from "../../../services/AuthService";

type routeParametersType = {
  eventID: string;
};

const EventDetailsScreen = ({ route }) => {
  const propsFromEventCard: routeParametersType = route.params;
  const { eventID } = propsFromEventCard;

  const { userToken, isLoggedIn } = useContext(UserContext);

  const [currentToken, setCurrentToken] = useState(undefined);

  const parseToken = async () => {
    if(!userToken){
      const token = await getStoredToken();
      setCurrentToken(token);
    } else {
      setCurrentToken(userToken)
    }

  };
  useEffect(() => {
    parseToken();
  }, []);

  useEffect(() => {
    console.log(currentToken);
  }, [currentToken]);

  if (!currentToken) {
    console.log("GOT UNDEFINED IN CURRENTTOKEN BUT HANDLED IT")
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.trueBlack,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color={COLORS.white} />
      </View>
    );
  }
  console.log(" MY TOKEN BEFORE GOING TO EVENTDETAILS IS ", currentToken);

  return <EventDetails eventID={eventID} currentToken={userToken}/>;
};

export default EventDetailsScreen;