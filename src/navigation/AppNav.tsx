import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { navigationRef } from "./Navigator";
import { UserContext } from "../contexts/UserContext";
import SelectSchoolScreen from "../screens/unauthorized/SelectSchool/SelectSchoolScreen";
import IntroduceEventsScreen from "../screens/unauthorized/IntroduceEvents/IntroduceEventsScreen";
import LoginScreen from "../screens/unauthorized/Login/LoginScreen"
import TabNavigator from "./TabNavigator";
import SignupScreen from "../screens/unauthorized/Signup/SignupScreen";
import { SCREENS } from "../constants";

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
    </Stack.Navigator>
  );
};

export default AppNav;
