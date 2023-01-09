import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { navigationRef } from "./Navigator";
import { UserContext } from "../contexts/UserContext";
import SelectSchoolScreen from "../screens/unauthorized/SelectSchool/SelectSchoolScreen";
import IntroduceEventsScreen from "../screens/unauthorized/IntroduceEvents/IntroduceEventsScreen";
import LoginScreen from "../screens/unauthorized/Login/LoginScreen"
import TabNavigator from "./TabNavigator";
import { Button, View } from "react-native";

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
      initialRouteName="SelectSchoolScreen"
    >
      <Stack.Screen name="SelectSchoolScreen" component={SelectSchoolScreen} />
      <Stack.Screen name="IntroduceEventsScreen" component={IntroduceEventsScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen}/>
    </Stack.Navigator>
  );
};

const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="TabNavigator"
    >
      <Stack.Screen name="TabNavigator" component={TabNavigator} />
    </Stack.Navigator>
  );
};

export default AppNav;
