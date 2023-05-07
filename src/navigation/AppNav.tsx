import React, { useContext } from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
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
import EditProfileScreen from "../screens/authorized/EditProfile/EditProfileScreen";
import SettingsScreen from "../screens/authorized/Settings/SettingsScreen";
import AccountSettingsScreen from "../screens/authorized/AccountSettings/AccountSettingsScreen";
import ChangePasswordScreen from "../screens/authorized/ChangePassword/ChangePasswordScreen";
import SearchScreen from "../screens/authorized/Search/SearchScreen";
import HomeScreen from "../screens/authorized/Home/HomeScreen";

const Stack = createStackNavigator();

const AppNav = () => {
  const { isLoggedIn } = useContext(UserContext);
  return (
    <NavigationContainer>
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
      <Stack.Screen name={SCREENS.EditProfile} component={EditProfileScreen}/>
      <Stack.Screen name={SCREENS.EditMyPassword} component={EditMyPasswordScreen}/>
      <Stack.Screen name={SCREENS.Settings} component={SettingsScreen}/>
      <Stack.Screen name={SCREENS.AccountSettings} component={AccountSettingsScreen}/>
      <Stack.Screen name={SCREENS.ChangePassword} component={ChangePasswordScreen}/>
      <Stack.Screen name={SCREENS.Search} component={SearchScreen}/>
      <Stack.Screen name={SCREENS.Home} component={HomeScreen}/>
    </Stack.Navigator>
  );
};

export default AppNav;
