import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  StyleSheet,
} from "react-native";
import React, { useContext } from "react";
import { User, Event, COLORS, SCREENS } from "../../constants";
import { McText } from "../Styled";
import { useNavigation } from "@react-navigation/native";
import HomeEventCard from "./HomeEventCard";
import { displayError } from "../../helpers/helpers";
import {
  addUserJoinEvent,
  addUserShoutoutEvent,
  removeUserJoinEvent,
  removeUserShoutoutEvent,
} from "../../services/UserService";
import { EventContext } from "../../contexts/EventContext";
import { UserContext } from "../../contexts/UserContext";

type HomeEventProps = {
  event: Event;
  user: User;
};

const HomeEvent = (props: HomeEventProps) => {
  const navigation = useNavigation<any>();

  const onHostUsernamePressed = () => {
    navigation.push(SCREENS.ProfileDetails, {
      user: props.user,
    });
  };

  return (
    <View>
      <View
        style={{
          paddingVertical: 10,
          borderTopWidth: 1,
          borderBottomWidth: 1,
          borderColor: COLORS.gray1,
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 20,
          }}
          onPress={() => {
            onHostUsernamePressed();
          }}
        >
          <Image
            style={styles.hostProfilePic}
            source={{ uri: props.user.Picture }}
          ></Image>
          <McText
            h4
            numberOfLines={1}
            style={{
              letterSpacing: 1,
              color: COLORS.white,
            }}
          >
            {props.user.DisplayName}
          </McText>
        </TouchableOpacity>
      </View>
      <HomeEventCard event={props.event} host={props.user} />
    </View>
  );
};

export default HomeEvent;

const styles = StyleSheet.create({
  hostProfilePic: {
    height: 35,
    width: 35,
    borderRadius: 30,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },
});
