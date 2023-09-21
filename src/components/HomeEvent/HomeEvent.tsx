import React, { useContext, useEffect, useState, useRef, useCallback } from "react";
import {
  Animated,
  Modal,
  PanResponder,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Alert,
  Image,
  ActivityIndicator,
  Pressable,
  ScrollView,
} from "react-native";
import { User, Event, COLORS, SCREENS, SIZES } from "../../constants";
import { McText } from "../Styled";
import { useNavigation } from "@react-navigation/native";
import HomeEventCard from "./HomeEventCard";
import {
  addUserJoinEvent,
  addUserShoutoutEvent,
  removeUserJoinEvent,
  removeUserShoutoutEvent,
  setNotInterestedInEvent,
  undoNotInterestedInEvent,
} from "../../services/UserService";
import { EventContext } from "../../contexts/EventContext";
import { UserContext } from "../../contexts/UserContext";
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { CustomError } from "../../constants/error";
import { showBugReportPopup, createEventLink, showShareEventLink } from "../../helpers/helpers";
import InterestSelector from "../InterestSelector/InterestSelector";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AlertContext } from "../../contexts/AlertContext";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { selectUserByID } from "../../redux/users/userSelectors";
import { updateUserMap } from "../../redux/users/userSlice";
import { selectEventByID } from "../../redux/events/eventSelectors";
import { updateEventMap } from "../../redux/events/eventSlice";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import QRCode from "react-native-qrcode-svg";
import LoadImage from "../LoadImage/LoadImage";

type HomeEventProps = {
  event: Event;
  user: User;
  reason: string;
  height: number;
  width: number;
  handleNotInterested: (eventID: string) => void;
  handleUndoNotInterested: (eventID: string) => void;
  showPullUpMenuButton: boolean;
};

const HomeEvent = (props: HomeEventProps) => {
  const { showAlert, hideAlert } = useContext(AlertContext);
  const navigation = useNavigation<any>();
  const usernameHeight = 52;
  const dispatch = useDispatch<AppDispatch>();
  const storedUser = useSelector((state: RootState) => selectUserByID(state, props.user.UserID));
  const storedEvent = useSelector((state: RootState) => selectEventByID(state, props.event.EventID));

  const { userToken } =
    useContext(UserContext);

  let timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const qrSize = SIZES.width * 0.8; // 80% of screen width, adjust as needed
  const [isBottomModalOpen, setIsBottomModalOpen] = useState(false);

  const onShareLinkPressed = () => {
    showShareEventLink(
      props.event.EventID,
      props.event.Title,
      props.event.Picture,
      props.event.Description
    );
  };

  const closeBottomModal = () => {
    bottomSheetModalRef.current?.close();
    setIsBottomModalOpen(false);
  };

  const openBottomModal = () => {
    bottomSheetModalRef.current?.present();
    setIsBottomModalOpen(true);
  };

  const renderBackdrop = useCallback(
    (props) => <BottomSheetBackdrop onPress={closeBottomModal} {...props} />,
    []
  );

  const [isQRModalVisible, setQRModalVisible] = React.useState(false);
  const [qrUrl, setQrUrl] = React.useState("");

  const onQRCodePressed = async () => {
    const url = await createEventLink(
      props.event.EventID,
      props.event.Title,
      props.event.Picture,
      props.event.Description
    );
    setQrUrl(url);
    setQRModalVisible(true);
  };

  const onHostUsernamePressed = () => {
    navigation.push(SCREENS.ProfileDetails, {
      userID: props.user.UserID,
    });
  };

  const handleNotInterested = () => {
    showAlert(
      <>
        <McText body4 style={{ color: COLORS.white }}>
          You set this event to be hidden
        </McText>
        <TouchableOpacity
          onPress={() => {
            handleUndoNotInterested();
            hideAlert();
          }}
        >
          <McText
            h4
            style={{ color: COLORS.white, textDecorationLine: "underline" }}
          >
            Undo
          </McText>
        </TouchableOpacity>
      </>,
      5
    );
    props.handleNotInterested(props.event.EventID);
    setNotInterestedInEvent(
      userToken.UserAccessToken,
      userToken.UserID,
      props.event.EventID
    ).catch((error: CustomError) => {
      if (error.showBugReportDialog) {
        showBugReportPopup(error);
      }
    });
  };

  const handleUndoNotInterested = () => {
    props.handleUndoNotInterested(props.event.EventID);
    undoNotInterestedInEvent(
      userToken.UserAccessToken,
      userToken.UserID,
      props.event.EventID
    ).catch((error: CustomError) => {
      if (error.showBugReportDialog) {
        showBugReportPopup(error);
      }
    });
  };

  useEffect(() => {
    if (!storedUser) {
      dispatch(updateUserMap({
        id: props.user.UserID,
        changes: props.user,
      }));
    }
    if (!storedEvent) {
      dispatch(updateEventMap({ id: props.event.EventID, changes: props.event }));
    }
  }, []);

  if(!storedEvent){
    return <></>
  }
  return (
    <>
      <Pressable
        onPressIn={closeBottomModal}
        style={{ position: "relative" }}
      >
        <View
          style={{ height: props.height, width: props.width, overflow: "hidden" }}
        >
          <View
            style={{
              height: usernameHeight,
              paddingTop: 10,
              paddingBottom: 10,
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 20,
            }}
          >
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
                marginRight: 80,
              }}
              onPress={() => {
                onHostUsernamePressed();
              }}
              disabled={isBottomModalOpen}
            >
              <LoadImage
                imageStyle={styles.hostProfilePic}
                imageSource={storedUser
                  ? storedUser.Picture
                  : props.user.Picture}
              />
              <McText
                h4
                numberOfLines={1}
                style={{
                  letterSpacing: 1,
                  color: COLORS.white,
                  marginRight: 10,
                }}
              >
                {storedUser
                  ? storedUser.DisplayName
                  : props.user.DisplayName}
              </McText>
              {storedUser?.VerifiedOrganization && (
                  <View style={{ marginRight: 20 }}>
                    <MaterialIcons
                      name="verified"
                      size={18}
                      color={COLORS.purple}
                    />
                  </View>
                )}
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => {
                if (props.showPullUpMenuButton) {
                  openBottomModal();
                }
              }}
              disabled={isBottomModalOpen || !props.showPullUpMenuButton}
              style={{
                opacity: props.showPullUpMenuButton ? 1 : 0,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 13,
              }}
            >
              <Ionicons name="ellipsis-horizontal-sharp" size={20} color="gray" />
            </TouchableOpacity>
          </View>
          <HomeEventCard
            width={props.width}
            height={props.height - usernameHeight}
            event={props.event}
            reason={props.reason}
            isBottomModalOpen={isBottomModalOpen}
          />
        </View>
      </Pressable>
    
      {isQRModalVisible && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={isQRModalVisible}
            onRequestClose={() => {
              setQRModalVisible(!isQRModalVisible);
            }}
          >
            <TouchableOpacity
              style={styles.centeredView}
              activeOpacity={1}
              onPressOut={() => setQRModalVisible(false)}
            >
              <View style={styles.qrContainer}>
                <QRCode
                  value={qrUrl}
                  size={qrSize}
                  logoSize={30} // Adjust accordingly
                  logoBackgroundColor="transparent"
                />
              </View>
            </TouchableOpacity>
          </Modal>
        )}
        <BottomSheetModal
          ref={bottomSheetModalRef}
          snapPoints={["30%"]}
          backgroundComponent={({ style }) => (
            <View
              style={[
                style,
                {
                  backgroundColor: "rgba(20,20,20,1)",
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                },
              ]}
            />
          )}
          stackBehavior={"replace"}
          index={0}
          backdropComponent={renderBackdrop}
          handleComponent={() => (
            <View
              style={{
                width: 40,
                height: 5,
                borderRadius: 400,
                marginTop: 10,
                marginBottom: 20,
                backgroundColor: COLORS.gray,
                alignSelf: "center",
              }}
            />
          )} // Use your custom handle component here
        >
          <BottomSheetView style={styles.bottomView}>
            <TouchableOpacity
              onPress={() => {
                closeBottomModal();
                handleNotInterested();
              }}
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <MaterialCommunityIcons
                name="window-close"
                style={{ marginHorizontal: 20 }}
                size={32}
                color="white"
              />
              <McText body2 color={COLORS.white}>
                Not interested
              </McText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                closeBottomModal();
                onShareLinkPressed();
              }}
              style={{ 
                marginTop: 10,
                flexDirection: "row", 
                alignItems: "center" 
              }}
            >
              <MaterialIcons
                name="link"
                style={{ marginHorizontal: 20 }}
                size={32}
                color="white"
              />
              <McText body2 color={COLORS.white}>
                Share link
              </McText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                closeBottomModal();
                onQRCodePressed();
              }}
              style={{
                marginTop: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <MaterialIcons
                name="qr-code-2"
                style={{ marginHorizontal: 20 }}
                size={32}
                color="white"
              />
              <McText body2 color={COLORS.white}>
                Share QR code
              </McText>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheetModal>
    </>
  );
};

export default HomeEvent;

const styles = StyleSheet.create({
  hostProfilePic: {
    height: 35,
    width: 35,
    borderRadius: 30,
    marginRight: 10,
    borderWidth: 0.2,
    borderColor: COLORS.gray,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomView: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,.8)", // This will make background a bit dark for better visibility of popup
  },
  qrContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "white",
    elevation: 5,
  },
});
