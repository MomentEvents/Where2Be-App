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
import { ScreenContext, ScreenProvider } from "./contexts/ScreenContext";
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
import { NavigationContainer } from "@react-navigation/native";
import analytics from "@react-native-firebase/analytics";
import {
  TransitionPresets,
  createStackNavigator,
} from "@react-navigation/stack";
import EventDetailsScreen from "./screens/authorized/EventDetails/EventDetailsScreen";
import LoadingComponent from "./components/LoadingComponent/LoadingComponent";
import * as SplashScreen from "expo-splash-screen";
import ProfileDetailsScreen from "./screens/authorized/ProfileDetails/ProfileDetailsScreen";
import EditProfileScreen from "./screens/authorized/EditProfile/EditProfileScreen";
import FollowList from "./components/FollowList/FollowList";
import AccountFollowListScreen from "./screens/authorized/AccountFollowList/AccountFollowListScreen";
import EditEventScreen from "./screens/authorized/EditEvent/EditEventScreen";
import { SETTINGS } from "./constants/settings";
import LoginScreen from "./screens/unauthorized/Login/LoginScreen";
import SignupWelcomeScreen from "./screens/unauthorized/Onboarding/1_Welcome/SignupWelcomeScreen";
import SignupUsernameScreen from "./screens/unauthorized/Onboarding/4_Username/SignupUsernameScreen";
import SignupFinalScreen from "./screens/unauthorized/Onboarding/6_Final/SignupFinalScreen";
import SignupScreen from "./screens/unauthorized/Signup/SignupScreen";

// Set the handler that's invoked whenever a notification is received when the app is open
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

SplashScreen.preventAutoHideAsync();

const Main = () => {
  const routeNameRef = useRef<any>();

  const navigationRef = useRef<any>()

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

  if (!isAppReady) {
    return <LoadingComponent />;
  }

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
                    <AppNav/>
                    {/* <NavigationContainer
                      independent={true}
                      ref={navigationRef}
                      onReady={() => {
                        routeNameRef.current =
                        navigationRef.current.getCurrentRoute().name;
                      }}
                      onStateChange={async () => {
                        const previousRouteName = routeNameRef.current;
                        let currentRouteName = undefined;
                        if (navigationRef.current) {
                          currentRouteName =
                          navigationRef.current.getCurrentRoute()
                              .name;
                        }
                        if (
                          previousRouteName !== currentRouteName &&
                          SETTINGS.firebaseAnalytics
                        ) {
                          await analytics().logScreenView({
                            screen_name: currentRouteName,
                            screen_class: currentRouteName,
                          });
                        }
                        routeNameRef.current = currentRouteName;
                      }}
                    >
                      <Stack.Navigator
                        screenOptions={{
                          cardStyle: {
                            backgroundColor: COLORS.trueBlack,
                          },
                          headerShown: false,
                        }}
                      >
                        <Stack.Screen
                          name={SCREENS.AppNav}
                          component={AppNav}
                        />
                        <Stack.Screen
                          name={SCREENS.EventDetails}
                          component={EventDetailsScreen}
                        />
                        <Stack.Screen
                          name={SCREENS.ProfileDetails}
                          component={ProfileDetailsScreen}
                        />
                        <Stack.Screen
                          name={SCREENS.AccountFollowList}
                          component={AccountFollowListScreen}
                        />
                        <Stack.Screen
                          name={SCREENS.EditProfile}
                          component={EditProfileScreen}
                        />
                        <Stack.Screen
                          name={SCREENS.EditEvent}
                          component={EditEventScreen}
                        />
                        <Stack.Screen
                          name={SCREENS.Login}
                          component={LoginScreen}
                        />
                        <Stack.Screen
                          name={SCREENS.Signup}
                          component={SignupScreen}
                        />
                        <Stack.Screen
                          name={SCREENS.Onboarding.SignupWelcomeScreen}
                          component={SignupWelcomeScreen}
                        />
                        <Stack.Screen
                          name={SCREENS.Onboarding.SignupUsernameScreen}
                          component={SignupUsernameScreen}
                        />
                        <Stack.Screen
                          name={SCREENS.Onboarding.SignupFinalScreen}
                          component={SignupFinalScreen}
                        />
                      </Stack.Navigator>
                    </NavigationContainer> */}
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
