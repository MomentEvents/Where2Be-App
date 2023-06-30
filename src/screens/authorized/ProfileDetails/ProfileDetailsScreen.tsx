import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { COLORS, EVENT_TOGGLER, SCREENS, User, icons } from "../../../constants";
import ProfileViewer from "../../../components/ProfileViewer/ProfileViewer";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect } from "react";
import MobileSafeView from "../../../components/Styled/MobileSafeView";
import SectionHeader from "../../../components/Styled/SectionHeader";
import { ScreenContext } from "../../../contexts/ScreenContext";
import { UserContext } from "../../../contexts/UserContext";
import { displayError } from "../../../helpers/helpers";
import { deleteUser } from "../../../services/UserService";
import EventToggler from "../../../components/EventToggler/EventToggler";

type ProfileDetailsRouteParams = {
  userID: string;
};
const ProfileDetailsScreen = ({ route }) => {
  const { userID }: ProfileDetailsRouteParams = route.params;

  const navigation = useNavigation<any>();
  const { isAdmin, userToken, userIDToUser, updateUserIDToUser } =
    useContext(UserContext);
  const { setLoading } = useContext(ScreenContext);

  const nukeUser = () => {
    Alert.alert(
      "Nuke user",
      "Are you sure you want to delete " +
        userIDToUser[userID].DisplayName +
        " and all of their events?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
        },
        {
          text: "Yes",
          onPress: () => {
            console.log("Yes Pressed");
            setLoading(true);
            deleteUser(userToken.UserAccessToken, userID)
              .then(() => {
                setLoading(false);
                navigation.popToTop();
              })
              .catch((error: Error) => {
                setLoading(false);
                displayError(error);
              });
          },
        },
      ],
      { cancelable: false }
    );
  };

  if (!userID) {
    console.warn("FATAL ERROR: NO USERID PASSED INTO PROFILEDETAILSSCREEN");
  }

  return (
    <MobileSafeView style={styles.container} isBottomViewable={true}>
      <SectionHeader
        title={
          userIDToUser[userID] ? userIDToUser[userID].Username : "Loading..."
        }
        hideBottomUnderline={true}
        leftButtonSVG={<icons.backarrow />}
        leftButtonOnClick={() => navigation.goBack()}
        rightButtonSVG={isAdmin ? <icons.trash /> : undefined}
        rightButtonOnClick={() => {
          if (isAdmin) {
            nukeUser();
          }
        }}
      />
      <EventToggler
        selectedUserID={userID}
        eventsToPull={EVENT_TOGGLER.HostedEvents}
        showProfileSection={true}
      />
    </MobileSafeView>
  );
};

export default ProfileDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.trueBlack,
  },
});
