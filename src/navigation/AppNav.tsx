import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/native-stack";
import { navigationRef } from "./Navigator";
import { UserContext } from "../contexts/UserContext";
import SelectSchoolScreen from "../screens/unauthorized/SelectSchool/SelectSchoolScreen";
import IntroduceEventsScreen from "../screens/unauthorized/IntroduceEvents/IntroduceEventsScreen";
import LoginScreen from "../screens/unauthorized/Login/LoginScreen"
import TabNavigator from "./TabNavigator";
import SignupScreen from "../screens/unauthorized/Signup/SignupScreen";
import { SCREENS } from "../constants";
import EventDetailsScreen from "../screens/authorized/EventDetails/EventDetailsScreen";
import EditEventScreen from "../screens/authorized/EditEvent/EditEventScreen";
import ProfileDetailsScreen from "../screens/authorized/ProfileDetails/ProfileDetailsScreen";
import CreateEventScreen from "../screens/authorized/CreateEvent/CreateEventScreen";
import PreviewEventScreen from "../screens/authorized/PreviewEvent/PreviewEventScreen";
import EditMyPasswordScreen from "../screens/authorized/EditMyPassword/EditMyPasswordScreen";
import EditMyProfileScreen from "../screens/authorized/EditMyProfile/EditMyProfileScreen";
import SettingsScreen from "../screens/authorized/Settings/SettingsScreen";

const Stack = createStackNavigator();

const AppNav = () => {
  const { isLoggedIn } = useContext(UserContext);
  return (
    <NavigationContainer ref={navigationRef}>
      {isLoggedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const AuthStack = () => {
  console.log("Loading AuthStack");
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={SCREENS.SelectSchool}
    >
      <Stack.Screen name={SCREENS.SelectSchool} component={SelectSchoolScreen} />
      <Stack.Screen name={SCREENS.IntroduceEvents} component={IntroduceEventsScreen} />
      <Stack.Screen name={SCREENS.Login} component={LoginScreen}/>
      <Stack.Screen name={SCREENS.Signup} component={SignupScreen}/>
    </Stack.Navigator>
  );
};

const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={SCREENS.TabNavigator}
    >
      <Stack.Screen name={SCREENS.TabNavigator} component={TabNavigator} />
      <Stack.Screen name={SCREENS.EventDetails} component={EventDetailsScreen}/>
      <Stack.Screen name={SCREENS.EditEvent} component={EditEventScreen}/>
      <Stack.Screen name={SCREENS.ProfileDetails} component={ProfileDetailsScreen}/>
      <Stack.Screen name={SCREENS.CreateEvent} component={CreateEventScreen}/>
      <Stack.Screen name={SCREENS.PreviewEvent} component={PreviewEventScreen}/>
      <Stack.Screen name={SCREENS.EditMyProfile} component={EditMyProfileScreen}/>
      <Stack.Screen name={SCREENS.EditMyPassword} component={EditMyPasswordScreen}/>
      <Stack.Screen name={SCREENS.Settings} component={SettingsScreen}/>
    </Stack.Navigator>
  );
};

export default AppNav;
