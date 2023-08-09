import React, { useContext, useEffect } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { UserContext } from "../contexts/UserContext";
import SelectSchoolScreen from "../screens/unauthorized/SelectSchool/SelectSchoolScreen";
import IntroduceEventsScreen from "../screens/unauthorized/IntroduceEvents/IntroduceEventsScreen";
import LoginScreen from "../screens/unauthorized/Login/LoginScreen";
import TabNavigator from "./TabNavigator";
import SignupScreen from "../screens/unauthorized/Signup/SignupScreen";
import { COLORS, SCREENS } from "../constants";
import EventDetailsScreen from "../screens/authorized/EventDetails/EventDetailsScreen";
import EditEventScreen from "../screens/authorized/EditEvent/EditEventScreen";
import ProfileDetailsScreen from "../screens/authorized/ProfileDetails/ProfileDetailsScreen";
import CreateEventScreen from "../screens/authorized/CreateEvent/CreateEventScreen";
import PreviewEventScreen from "../screens/authorized/PreviewEvent/PreviewEventScreen";
import EditMyPasswordScreen from "../screens/authorized/EditMyPassword/EditMyPasswordScreen";
import EditProfileScreen from "../screens/authorized/EditProfile/EditProfileScreen";
import SettingsScreen from "../screens/authorized/Settings/SettingsScreen";
import AccountSettingsScreen from "../screens/authorized/AccountSettings/AccountSettingsScreen";
import SearchScreen from "../screens/authorized/Search/SearchScreen";
import HomeScreen from "../screens/authorized/Home/HomeScreen";
import AccountFollowListScreen from "../screens/authorized/AccountFollowList/AccountFollowListScreen";
import SignupWelcomeScreen from "../screens/unauthorized/Onboarding/1_Welcome/SignupWelcomeScreen";
import SignupSelectSchoolScreen from "../screens/unauthorized/Onboarding/UNUSED_2_School/SignupSelectSchoolScreen";
import SignupNameScreen from "../screens/unauthorized/Onboarding/3_Name/SignupNameScreen";
import SignupUsernameScreen from "../screens/unauthorized/Onboarding/4_Username/SignupUsernameScreen";
import SignupEmailScreen from "../screens/unauthorized/Onboarding/2_Email/SignupEmailScreen";
import SignupPasswordScreen from "../screens/unauthorized/Onboarding/5_Password/SignupPasswordScreen";
import SignupFinalScreen from "../screens/unauthorized/Onboarding/6_Final/SignupFinalScreen";
import NotificationsSettingsScreen from "../screens/authorized/NotificationSettings/NotificationsSettingsScreen";
import EventChatScreen from "../screens/authorized/EventChat/EventChatScreen";
// import analytics from '@react-native-firebase/analytics';
import { SETTINGS } from "../constants/settings";
import * as Notifications from "expo-notifications";
import LoadingComponent from "../components/LoadingComponent/LoadingComponent";


const Stack = createStackNavigator();

const AppNav = () => {
  const { isLoggedIn, isUserContextLoaded } = useContext(UserContext);
  const routeNameRef = React.useRef<any>();
  const navigationRef = React.useRef<any>();
  const notificationNavigation = useNavigation<any>()

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      if(!response){
        console.log("Notification response is null")
        return
      }
      const { notification } = response;
      console.log("User interacted with this notification:", notification);

      // The notification's data is where you put your own custom payload
      const { data } = notification.request.content;

      if (data.action === "ViewEventDetails") {
        notificationNavigation.push(SCREENS.EventDetails, {
          eventID: data.event_id,
        });
      }

      console.log("\n\n NOTIFICATION DATA: " + JSON.stringify(data));
    });
  
    return () => subscription.remove();
  }, []);
  

  if(!isUserContextLoaded){
    return <LoadingComponent/>
  }
  
  return (
    <NavigationContainer
      independent={true}
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.current.getCurrentRoute().name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        let currentRouteName = undefined;
        if (navigationRef.current) {
          currentRouteName = navigationRef.current.getCurrentRoute().name;
        }
        if (
          previousRouteName !== currentRouteName &&
          SETTINGS.firebaseAnalytics
        ) {
          // await analytics().logScreenView({
          //   screen_name: currentRouteName,
          //   screen_class: currentRouteName,
          // });
        }
        routeNameRef.current = currentRouteName;
      }}
    >
      {isLoggedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const AuthStack = () => {
  console.log("Loading AuthStack");
  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: {
          backgroundColor: COLORS.trueBlack,
        },
        headerShown: false,
      }}
      initialRouteName={SCREENS.SelectSchool}
    >
      <Stack.Screen
        name={SCREENS.SelectSchool}
        component={SelectSchoolScreen}
      />
      <Stack.Screen
        name={SCREENS.IntroduceEvents}
        component={IntroduceEventsScreen}
      />
      <Stack.Screen name={SCREENS.Login} component={LoginScreen} />
      <Stack.Screen name={SCREENS.Signup} component={SignupScreen} />
      <Stack.Screen
        name={SCREENS.Onboarding.SignupWelcomeScreen}
        component={SignupWelcomeScreen}
      />
      <Stack.Screen
        name={SCREENS.Onboarding.SignupSchoolScreen}
        component={SignupSelectSchoolScreen}
      />
      <Stack.Screen
        name={SCREENS.Onboarding.SignupNameScreen}
        component={SignupNameScreen}
      />
      <Stack.Screen
        name={SCREENS.Onboarding.SignupUsernameScreen}
        component={SignupUsernameScreen}
      />
      <Stack.Screen
        name={SCREENS.Onboarding.SignupEmailScreen}
        component={SignupEmailScreen}
      />
      <Stack.Screen
        name={SCREENS.Onboarding.SignupPasswordScreen}
        component={SignupPasswordScreen}
      />
      <Stack.Screen
        name={SCREENS.Onboarding.SignupFinalScreen}
        component={SignupFinalScreen}
      />
    </Stack.Navigator>
  );
};

const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: COLORS.trueBlack,
        },
      }}
      initialRouteName={SCREENS.TabNavigator}
    >
      <Stack.Screen name={SCREENS.TabNavigator} component={TabNavigator} />
      <Stack.Screen
        name={SCREENS.EventDetails}
        component={EventDetailsScreen}
      />
      <Stack.Screen name={SCREENS.EditEvent} component={EditEventScreen} />
      <Stack.Screen
        name={SCREENS.ProfileDetails}
        component={ProfileDetailsScreen}
      />
      <Stack.Screen name={SCREENS.CreateEvent} component={CreateEventScreen} />
      <Stack.Screen
        name={SCREENS.PreviewEvent}
        component={PreviewEventScreen}
      />
      <Stack.Screen name={SCREENS.EditProfile} component={EditProfileScreen} />
      <Stack.Screen
        name={SCREENS.EditMyPassword}
        component={EditMyPasswordScreen}
      />
      <Stack.Screen name={SCREENS.Settings} component={SettingsScreen} />
      <Stack.Screen
        name={SCREENS.AccountSettings}
        component={AccountSettingsScreen}
      />
      <Stack.Screen name={SCREENS.Search} component={SearchScreen} />
      <Stack.Screen name={SCREENS.Home} component={HomeScreen} />
      <Stack.Screen
        name={SCREENS.AccountFollowList}
        component={AccountFollowListScreen}
      />
      <Stack.Screen
        name={SCREENS.NotificationsSettings}
        component={NotificationsSettingsScreen}
      />
      <Stack.Screen name={SCREENS.EventChat} component={EventChatScreen} />
    </Stack.Navigator>
  );
};

export default AppNav;
