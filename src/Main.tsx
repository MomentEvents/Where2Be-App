import { Alert, StyleSheet, Text, TextInput, View } from "react-native";
import AppNav from "./navigation/AppNav";
import { UserProvider } from "./contexts/UserContext";
import { ScreenProvider } from "./contexts/ScreenContext";
import { AuthProvider } from "./contexts/AuthContext";
import { EventProvider } from "./contexts/EventContext";
import { StatusBar } from "react-native";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import * as Updates from "expo-updates";
import { AlertContextProvider, AlertProvider } from "./contexts/AlertContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Set the handler that's invoked whenever a notification is received when the app is open
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Main = () => {
  useEffect(() => {
    reactToUpdates();
  });

  const reactToUpdates = () => {
    Updates.addListener((event) => {
      if (event.type === Updates.UpdateEventType.ERROR) {
        console.log("UPDATE ERROR: COULD NOT FETCH LATEST EXPO UPDATE");
      }
      if (event.type === Updates.UpdateEventType.UPDATE_AVAILABLE)
        Alert.alert("New update available", "Restarting the app...");
      Updates.reloadAsync();
    });
  };

  return (
    <SafeAreaProvider>
      <AlertProvider>
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
      </AlertProvider>
    </SafeAreaProvider>
  );
};

export default Main;
