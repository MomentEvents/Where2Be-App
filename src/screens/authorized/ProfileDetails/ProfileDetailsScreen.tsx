import {
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  COLORS,
  EVENT_TOGGLER,
  SCREENS,
  User,
  icons,
} from "../../../constants";
import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect } from "react";
import MobileSafeView from "../../../components/Styled/MobileSafeView";
import SectionHeader from "../../../components/Styled/SectionHeader";
import { ScreenContext } from "../../../contexts/ScreenContext";
import { UserContext } from "../../../contexts/UserContext";
import { showBugReportPopup } from "../../../helpers/helpers";
import { deleteUser } from "../../../services/UserService";
import EventToggler from "../../../components/EventToggler/EventToggler";
import { Feather } from "@expo/vector-icons";
import { CustomError } from "../../../constants/error";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store";
import { selectUserByID } from "../../../redux/users/userSelectors";
import { AlertContext } from "../../../contexts/AlertContext";

type ProfileDetailsRouteParams = {
  userID: string;
};
const ProfileDetailsScreen = ({ route }) => {
  const { userID }: ProfileDetailsRouteParams = route.params;

  const navigation = useNavigation<any>();
  const { isAdmin, userToken } =
    useContext(UserContext);
    const {showErrorAlert} = useContext(AlertContext)
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => selectUserByID(state, userID));
  const { setLoading } = useContext(ScreenContext);

  const nukeUser = () => {
    Alert.alert(
      "Nuke user",
      "Are you sure you want to delete " +
        user?.DisplayName +
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
              .catch((error: CustomError) => {
                setLoading(false);
                if (error.showBugReportDialog) {
                  showBugReportPopup(error);
                } else {
                  showErrorAlert(error)
                }
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
          user ? user?.Username : "Loading..."
        }
        hideBottomUnderline={true}
        leftButtonSVG={<Feather name="arrow-left" size={28} color="white" />}
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
        doReloadIfChanged={false}
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
