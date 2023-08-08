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
import { UserContext, UserProvider } from "./contexts/UserContext";
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
import React, { useRef, useState, useEffect, useContext } from "react";
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
import LoadingComponent from "./components/LoadingComponent/LoadingComponent";
import * as SplashScreen from 'expo-splash-screen';
import ProfileDetailsScreen from "./screens/authorized/ProfileDetails/ProfileDetailsScreen";


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
      if (event.type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
        Alert.alert("New update available", "Restarting the app...");
        Updates.reloadAsync();
      }
    });
  };

  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();

        // Load fonts
        await Font.loadAsync(customFonts);
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the app it's ready to render
        setIsAppReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (isAppReady) {
      // Hide the splash screen
      SplashScreen.hideAsync();
    }
  }, [isAppReady]);

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
                        <Stack.Screen
                          name={SCREENS.ProfileDetails}
                          component={ProfileDetailsScreen}
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
