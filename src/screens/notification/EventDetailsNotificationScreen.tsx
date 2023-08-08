import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import EventDetails from '../../components/EventDetails/EventDetails';
import { COLORS } from '../../constants';
import { UserContext } from '../../contexts/UserContext';
import { getStoredToken } from '../../services/AuthService';

type routeParametersType = {
    eventID: string;
  };

const EventDetailsNotificationScreen = ({ route }) => {
    const routeParamsTyped: routeParametersType = route.params;
    const { eventID } = routeParamsTyped;
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
        eventID={eventID}
        currentToken={currentToken}
        disableHostClick={true}
      />
    );
}

export default EventDetailsNotificationScreen

const styles = StyleSheet.create({})