import { COLORS, EVENT_TOGGLER, SCREENS, User, icons } from "../../../constants";
import ProfileViewer from "../../../components/ProfileViewer/ProfileViewer";
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

const MyProfileScreen = ({ route }) => {
  const navigation = useNavigation<any>();
  const { isAdmin, userToken, userIDToUser, updateUserIDToUser } =
    useContext(UserContext);
  const { setLoading } = useContext(ScreenContext);

  return (
    <MobileSafeView style={styles.container} isBottomViewable={true}>
      <SectionHeader
        title={userIDToUser[userToken.UserID].Username}
        hideBottomUnderline={true}
        rightButtonSVG={<icons.settings />}
        rightButtonOnClick={() => {
          navigation.navigate(SCREENS.Settings);
        }}
      />
      <EventToggler
        selectedUserID={userToken.UserID}
        eventsToPull={EVENT_TOGGLER.HostedEvents}
        showProfileSection={true}
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
