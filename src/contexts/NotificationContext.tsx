import React, {
    createContext,
    useState,
    useEffect,
    useRef,
    ReactNode,
  } from "react";
  import {
    View,
    StyleSheet,
    Animated,
    PanResponder,
    TouchableOpacity,
  } from "react-native";
  import { useSafeAreaInsets } from "react-native-safe-area-context";
  import { COLORS } from "../constants";
  import { McText } from "../components/Styled";
  import * as Notifications from "expo-notifications";
    import { useNavigation } from "@react-navigation/native";
  
  type NotificationContextType = {
    notificationActionRef: React.MutableRefObject<string>,
    notificationDataRef: React.MutableRefObject<any>,
    notificationShouldBeAuthenticated: React.MutableRefObject<boolean>
    clearNotificationPayloads: () => void,
  };
  
  const initialState: NotificationContextType = {
    notificationActionRef: null,
    notificationDataRef: null,
    notificationShouldBeAuthenticated: null,
    clearNotificationPayloads: () => {}
  };
  
  export const NotificationContext = createContext<NotificationContextType>(initialState);
  
  export const NotificationProvider = ({ children }) => {

    const notificationActionRef = useRef<string>(null)
    const notificationDataRef = useRef<any>(null)
    const notificationShouldBeAuthenticated = useRef<boolean>(null)

    useEffect(() => {
        // This listener is fired whenever a notification is received while the app is foregrounded
        const foregroundSubscription =
          Notifications.addNotificationReceivedListener((notification) => {
            console.log("Notification received in foreground:", notification);
          });
    
        // This listener is fired whenever a user taps on or interacts with a notification
        const responseSubscription =
          Notifications.addNotificationResponseReceivedListener((response) => {
            const { notification } = response;
            console.log("User interacted with this notification:", notification);
    
            // The notification's data is where you put your own custom payload
            const { data } = notification.request.content;
    
            if (data.action === "ViewEventDetails") {
              notificationShouldBeAuthenticated.current = true
            }
    
            console.log("\n\n NOTIFICATION DATA: " + JSON.stringify(data));
          });
    
        return () => {
          // Clean up on unmount
          Notifications.removeNotificationSubscription(foregroundSubscription);
          Notifications.removeNotificationSubscription(responseSubscription);
        };
      }, []);

    const clearNotificationPayloads = () => {

    }
  
    return (
      <NotificationContext.Provider value={{ notificationActionRef, notificationDataRef, notificationShouldBeAuthenticated, clearNotificationPayloads }}>
        {children}
      </NotificationContext.Provider>
    );
  };
  