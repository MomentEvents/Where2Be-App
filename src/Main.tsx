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
import { NavigationContainer } from "@react-navigation/native";
import {
  TransitionPresets,
  createStackNavigator,
} from "@react-navigation/stack";
import EventDetailsScreen from "./screens/authorized/EventDetails/EventDetailsScreen";
import LoadingComponent from "./components/LoadingComponent/LoadingComponent";
import * as SplashScreen from 'expo-splash-screen';
import ProfileDetailsScreen from "./screens/authorized/ProfileDetails/ProfileDetailsScreen";
import EditProfileScreen from "./screens/authorized/EditProfile/EditProfileScreen";
import FollowList from "./components/FollowList/FollowList";
import AccountFollowListScreen from "./screens/authorized/AccountFollowList/AccountFollowListScreen";
import EditEventScreen from "./screens/authorized/EditEvent/EditEventScreen";


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
