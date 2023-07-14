import { useNavigation, useRoute } from "@react-navigation/native";
import SectionHeader from "../../../components/Styled/SectionHeader";
import MobileSafeView from "../../../components/Styled/MobileSafeView";
import { Feather } from "@expo/vector-icons";
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useCallback, useContext, useEffect, useState } from "react";
import { COLORS, FONTS } from "../../../constants";
import {
  Composer,
  GiftedChat,
  IMessage,
  InputToolbar,
  Send,
  User,
  Message,
  MessageText,
  Bubble,
} from "react-native-gifted-chat";
import { FirebaseEventMessage } from "../../../constants/types";
import { EventContext } from "../../../contexts/EventContext";
import { UserContext } from "../../../contexts/UserContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CUSTOMFONT_BOLD,
  CUSTOMFONT_LIGHT,
  CUSTOMFONT_SEMIBOLD,
  CUSTOMFONT_THIN,
} from "../../../constants/theme";
import { McText } from "../../../components/Styled";

// IMPORTANT NOTE: EVENT DETAILS MUST BE NAVIGATED FIRST AND THEN PUSH EVENTCHATSCREEN
// THIS IS TO CHECK IF A USER IS THE HOST OF THE EVENT
type EventChatScreenParams = {
  eventID: string;
};
const EventChatScreen = ({ route }) => {
  const { eventID }: EventChatScreenParams = route.params;
  const [text, setText] = useState("");
  const navigation = useNavigation<any>();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { eventIDToEvent } = useContext(EventContext);
  const { userToken } = useContext(UserContext);
  const insets = useSafeAreaInsets();

  const [pulledFirebaseMessages, setPulledFirebaseMessages] =
    useState<FirebaseEventMessage[]>();

  const pullMessages = () => {
    setPulledFirebaseMessages([]);
  };

  const onSend = useCallback((messages = []) => {
    Alert.alert(
      "Notify joined users?",
      "Do you want to send a push notification?",
      [
        {
          text: "Send with notification",
          onPress: () => postMessage(messages, true),
        },
        {
          text: "Send without notification",
          onPress: () => postMessage(messages, false),
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  }, []);

  const postMessage = (messages = [], doNotify: boolean) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
  };

  const renderInputToolbar = (props) => (
    <InputToolbar
      {...props}
      containerStyle={{
        backgroundColor: COLORS.black,
        paddingTop: 6,
        paddingHorizontal: 20,
      }}
      primaryStyle={{ alignItems: "center" }}
      renderSend={renderSend}
    />
  );

  const renderSend = (props) => (
    <Send
      {...props}
      disabled={!props.text || props.text.trim().length === 0}
      containerStyle={{
        alignItems: "center",
        justifyContent: "center",
        marginHorizontal: 4,
      }}
    >
      <McText h4 style={{ marginLeft: 10 }}>
        Send
      </McText>
    </Send>
  );

  const renderMessage = (props) => <Message {...props} />;

  // const renderBubble = (props) => (
  //   <Bubble
  //     {...props}
  //     // renderTime={() => <Text>Time</Text>}
  //     // renderTicks={() => <Text>Ticks</Text>}
  //     containerStyle={{
  //       left: { borderColor: 'teal', borderWidth: 8 },
  //       right: {},
  //     }}
  //     wrapperStyle={{
  //       left: { borderColor: 'tomato', borderWidth: 4 },
  //       right: {},
  //     }}
  //     bottomContainerStyle={{
  //       left: { borderColor: 'purple', borderWidth: 4 },
  //       right: {},
  //     }}
  //     tickStyle={{}}
  //     usernameStyle={{ color: 'tomato', fontWeight: '100' }}
  //     containerToNextStyle={{
  //       left: { borderColor: 'navy', borderWidth: 4 },
  //       right: {},
  //     }}
  //     containerToPreviousStyle={{
  //       left: { borderColor: 'mediumorchid', borderWidth: 4 },
  //       right: {},
  //     }}
  //   />
  // );

  const renderMessageText = (props) => (
    <MessageText
      {...props}
      textStyle={{
        left: { color: COLORS.white },
        right: { color: COLORS.white },
      }}
      linkStyle={{
        left: { color: COLORS.white },
        right: { color: COLORS.white },
      }}
      customTextStyle={{
        fontSize: 16,
        fontFamily: CUSTOMFONT_SEMIBOLD,
        lineHeight: 20,
      }}
    />
  );

  const renderComposer = (props) => (
    <Composer
      {...props}
      placeholder={
        !eventIDToEvent[eventID]
          ? "Loading"
          : eventIDToEvent[eventID].HostUserID === userToken.UserID
          ? "Write an event update"
          : "Only hosts can write updates"
      }
      textInputStyle={{
        color: COLORS.white,
        backgroundColor: COLORS.gray2,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: COLORS.gray1,
        paddingTop: 8.5,
        paddingHorizontal: 12,
        alignSelf: "center",
        marginLeft: 0,
        fontFamily:
          eventIDToEvent[eventID] &&
          eventIDToEvent[eventID].HostUserID !== userToken.UserID
            ? CUSTOMFONT_BOLD
            : CUSTOMFONT_LIGHT,
        fontSize: 15,
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  );

  useEffect(() => {
    pullMessages();
  }, []);

  return (
    <MobileSafeView style={styles.container} isBottomViewable={true}>
      <SectionHeader
        title={"Event Updates"}
        leftButtonSVG={<Feather name="arrow-left" size={28} color="white" />}
        leftButtonOnClick={() => navigation.goBack()}
      />
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.black,
          paddingBottom: insets.bottom,
        }}
      >
        {messages.length === 0 && pulledFirebaseMessages && (
          <McText h2 style={{ textAlign: "center", marginTop: 20 }}>
            No updates yet!
          </McText>
        )}
        {!pulledFirebaseMessages && (
          <ActivityIndicator style={{ alignSelf: "center", marginTop: 20 }} />
        )}
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          alwaysShowSend
          disableComposer={
            !eventIDToEvent[eventID] ||
            eventIDToEvent[eventID].HostUserID !== userToken.UserID
          }
          showAvatarForEveryMessage={false}
          renderComposer={renderComposer}
          renderInputToolbar={renderInputToolbar}
          renderMessage={renderMessage}
          renderMessageText={renderMessageText}
          // renderBubble={renderBubble}
        />
      </View>
    </MobileSafeView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: COLORS.trueBlack,
  },
  chatContainer: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  writeMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  inputField: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
});

export default EventChatScreen;
