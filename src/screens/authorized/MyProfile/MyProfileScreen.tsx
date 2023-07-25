import {
  COLORS,
  EVENT_TOGGLER,
  SCREENS,
  User,
  icons,
} from "../../../constants";
import { UserContext } from "../../../contexts/UserContext";
import { useContext } from "react";
import MobileSafeView from "../../../components/Styled/MobileSafeView";
import SectionHeader from "../../../components/Styled/SectionHeader";
import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ScreenContext } from "../../../contexts/ScreenContext";
import EventToggler from "../../../components/EventToggler/EventToggler";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { selectUserByID } from "../../../redux/users/userSelectors";

const MyProfileScreen = ({ route }) => {
  const navigation = useNavigation<any>();
  const { isAdmin, userToken  } =
    useContext(UserContext);
  const { setLoading } = useContext(ScreenContext);
  const currentUser = useSelector((state: RootState) => selectUserByID(state, userToken.UserID));

  return (
    <MobileSafeView style={styles.container} isBottomViewable={true}>
      <SectionHeader
        title={currentUser?.Username}
        hideBottomUnderline={true}
        rightButtonSVG={<icons.settings />}
        rightButtonOnClick={() => {
          navigation.push(SCREENS.Settings);
        }}
      />
      <EventToggler
        selectedUserID={userToken.UserID}
        eventsToPull={EVENT_TOGGLER.HostedEvents}
        showProfileSection={true}
        doReloadIfChanged={true}
      />
    </MobileSafeView>
  );
};

export default MyProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.trueBlack,
  },
});
