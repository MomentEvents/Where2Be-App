import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../contexts/UserContext";
import EventDetails from "../../EventDetails/EventDetails";
import { getStoredToken } from "../../../services/AuthService";
import { COLORS } from "../../../constants";

type NotificationEventDetailsModalProps = {
  setClose: React.Dispatch<React.SetStateAction<boolean>>;
  eventID: string;
};

const NotificationEventDetailsModal = (
  props: NotificationEventDetailsModalProps
) => {
  const { userToken, isLoggedIn } = useContext(UserContext);

  const [currentToken, setCurrentToken] = useState(undefined);

  const parseToken = async () => {
    const token = await getStoredToken();
    setCurrentToken(token);
  };
  useEffect(() => {
    parseToken();
  }, []);

  useEffect(() => {
    console.log(currentToken);
  }, [currentToken]);

  if (!currentToken) {
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
  return (
    <EventDetails
      eventID={props.eventID}
      currentToken={currentToken}
      onBackFunction={() => {
        props.setClose(false);
      }}
      disableHostClick={true}
    />
  );
};

export default NotificationEventDetailsModal;

const styles = StyleSheet.create({});
