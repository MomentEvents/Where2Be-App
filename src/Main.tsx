import { StyleSheet, Text, TextInput, View } from "react-native";
import AppNav from "./navigation/AppNav";
import { UserProvider } from "./contexts/UserContext";
import { ScreenProvider } from "./contexts/ScreenContext";
import { AuthProvider } from "./contexts/AuthContext";
import { EventProvider } from "./contexts/EventContext";
import { StatusBar } from "react-native";
import * as Notifications from 'expo-notifications';
import { useEffect } from "react";

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
    // This listener is fired whenever a notification is received while the app is foregrounded
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification
    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      const { notification } = response;
      console.log('User interacted with this notification:', notification);

      // The notification's data is where you put your own custom payload
      const { data } = notification.request.content;

      if (data.myCommand === 'openDialog') {
        // Here you perform your command based on the payload
        console.log('Opening dialog...');
      } else if (data.myCommand === 'navigateToScreen') {
        // Or navigate to a specific screen, etc.
        console.log('Navigating to screen...');
      }
    });

    return () => {
      // Clean up on unmount
      Notifications.removeNotificationSubscription(foregroundSubscription);
      Notifications.removeNotificationSubscription(responseSubscription);
    };
  }, []);
  
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
