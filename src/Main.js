import {
  StyleSheet,
  Text,
  TextInput,
  View,
  AppState,
  StatusBar,
} from "react-native";
import AppNav from "./navigation/AppNav";
import { UserProvider } from "./contexts/UserContext";
import { ScreenProvider } from "./contexts/ScreenContext";
import { AuthProvider } from "./contexts/AuthContext";
import { EventProvider } from "./contexts/EventContext";
import React, { useEffect, useState } from "react";
import * as Updates from "expo-updates";
import AppUpdates from "expo-splash-screen";

const Main = () => {
  const [appState, setAppState] = useState(AppState.currentState);
  var isBackground = false;
  var lastActiveTime = Date.now();

  useEffect(() => {
    console.log("in initial use effect");
    const handleAppStateChange = (nextAppState) => {
      console.log("---------------------------------");
      console.log("Checking phone timeout");
      console.log("Current app state is " + appState);
      console.log("nextAppState is " + nextAppState);
      console.log(
        "Difference between now and last active time is " +
          (Date.now() - lastActiveTime)
      );

      console.log("isBackground is " + isBackground);
      if (nextAppState === "active") {
        console.log("setting last active time");
        lastActiveTime = Date.now();
      }
      if (
        isBackground &&
        nextAppState === "active" &&
        Date.now() - lastActiveTime >= 5000
      ) {
        console.log("restarting app");
        Updates.reloadAsync();
      }

      if (nextAppState === "background") {
        isBackground = true;
      } else {
        isBackground = false;
      }
      console.log("---------------------------------");
    };
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );
    return () => {
      subscription.remove();
    };
  });

  // Disable font scaling
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;
  TextInput.defaultProps = TextInput.defaultProps || {};
  TextInput.defaultProps.allowFontScaling = false;
  return (
    <UserProvider>
      <EventProvider>
        <ScreenProvider>
          <AuthProvider>
            <StatusBar barStyle="light-content" translucent={true} />
            <AppNav />
          </AuthProvider>
        </ScreenProvider>
      </EventProvider>
    </UserProvider>
  );
};

export default Main;
