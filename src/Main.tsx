import {
  ActivityIndicator,
  Alert,
  Linking,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AppNav from "./navigation/AppNav";
import { UserProvider } from "./contexts/UserContext";
import { ScreenProvider } from "./contexts/ScreenContext";
import { AuthProvider } from "./contexts/AuthContext";
import { EventProvider } from "./contexts/EventContext";
import { StatusBar } from "react-native";
import * as Notifications from "expo-notifications";
import * as Updates from "expo-updates";
import { AlertProvider } from "./contexts/AlertContext";
import { Provider } from "react-redux";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { store } from "./redux/store";
import * as Font from "expo-font";
import { COLORS, SCREENS, SIZES, customFonts, icons } from "./constants";
import { displayError } from "./helpers/helpers";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useRef, useState, useEffect } from "react";
import { Animated, Dimensions } from "react-native";
import { appVersionText } from "./constants/texts";
import EventDetails from "./components/EventDetails/EventDetails";
import NotificationEventDetailsModal from "./components/NotificationModals/EventDetails/NotificationEventDetailsModal";
import { NavigationContainer } from "@react-navigation/native";
import {
  TransitionPresets,
  createStackNavigator,
} from "@react-navigation/stack";
import EventDetailsScreen from "./screens/authorized/EventDetails/EventDetailsScreen";

// Set the handler that's invoked whenever a notification is received when the app is open
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Main = () => {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);

  const [eventDetailsNotificationVisible, setEventDetailsNotificationVisible] =
    useState(false);
  const [eventIDNotification, setEventIDNotification] = useState("");

  useEffect(() => {
    reactToUpdates();
  });

  const reactToUpdates = () => {
    Updates.addListener((event) => {
      if (event.type === Updates.UpdateEventType.ERROR) {
        console.log("UPDATE ERROR: COULD NOT FETCH LATEST EXPO UPDATE");
      }
      if (event.type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
        Alert.alert("New update available", "Restarting the app...");
        Updates.reloadAsync();
      }
    });
  };

  const onDiscordClick = () => {
    const supported = Linking.canOpenURL("https://where2be.app/discord");

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      Linking.openURL("https://where2be.app/discord");
    } else {
      Alert.alert(`Unable to open link: ${"https://where2be.app/discord"}`);
    }
  };

  const loadAssets = async () => {
    console.log("Loading assets");
    await Font.loadAsync(customFonts)
      .then(() => setAssetsLoaded(true))
      .catch((error: Error) => displayError(error));
  };

  const modalY = useRef(
    new Animated.Value(Dimensions.get("window").height)
  ).current; // Initial position is off screen

  const onCloseModal = () => {
    setAnimateOut(true);
    setTimeout(() => {
      setEventDetailsNotificationVisible(false);
    }, 300);
  };

  useEffect(() => {
    if (eventDetailsNotificationVisible && !animateOut) {
      // Animate the modal into view
      Animated.timing(modalY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    if (animateOut) {
      // Animate the modal out of view
      Animated.timing(modalY, {
        toValue: Dimensions.get("window").height,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setAnimateOut(false); // Reset the animateOut state
      });
    }
  }, [eventDetailsNotificationVisible, animateOut]);

  const renderModal = () => {
    return (
      <Animated.View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          top: 0,
          transform: [{ translateY: modalY }],
        }}
      >
        <NotificationEventDetailsModal
          setClose={onCloseModal}
          eventID={eventIDNotification}
        />
      </Animated.View>
    );
  };

  useEffect(() => {
    loadAssets();
  }, []);

  if (!assetsLoaded) {
    return (
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.trueBlack,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            flex: 2,
            width: "100%",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <icons.where2be
            width="70%"
            style={{ marginBottom: 80 }}
          ></icons.where2be>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "flex-start",
          }}
        >
          <ActivityIndicator color={COLORS.white} size="small" />
        </View>
        <View style={{ padding: 5 }}>
          <Text
            allowFontScaling={false}
            style={{ fontSize: 12, color: COLORS.gray1 }}
          >
            {appVersionText} | Join our{" "}
            <Text
              allowFontScaling={false}
              onPress={onDiscordClick}
              style={{
                fontSize: 12,
                color: COLORS.gray1,
                textDecorationLine: "underline",
              }}
            >
              Discord server
            </Text>
            !
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const Stack = createStackNavigator();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.trueBlack }}>
      <Provider store={store}>
        <SafeAreaProvider>
          <AlertProvider>
            <UserProvider>
              <EventProvider>
                <ScreenProvider>
                  <AuthProvider>
                    <StatusBar barStyle="light-content" translucent={true} />
                    <NavigationContainer independent={true}>
                      <Stack.Navigator
                        screenOptions={{
                          cardStyle: {
                            backgroundColor: "rgba(0,0,0,0.5)", // semi-transparent background
                          },
                          presentation: "modal",
                          headerShown: false,
                          gestureEnabled: true,
                          gestureDirection: "vertical", // swipe up/down to open/close
                          cardStyleInterpolator: ({ current }) => ({
                            cardStyle: {
                              opacity: current.progress, // controls the opacity based on the transition progress
                            },
                          }),
                        }}
                        initialRouteName={SCREENS.AppNav}
                      >
                        <Stack.Screen
                          name={SCREENS.AppNav}
                          component={AppNav}
                        />
                        <Stack.Screen
                          name={SCREENS.EventDetails}
                          component={EventDetailsScreen}
                          options={{
                            ...TransitionPresets.ModalSlideFromBottomIOS, // Use the iOS style slide from bottom animation
                          }}
                        />
                      </Stack.Navigator>
                    </NavigationContainer>
                  </AuthProvider>
                </ScreenProvider>
              </EventProvider>
            </UserProvider>
          </AlertProvider>
        </SafeAreaProvider>
      </Provider>
    </View>
  );
};

export default Main;
