// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';


import React, { useState, useEffect, Context, createContext } from 'react';
import * as Font from 'expo-font';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  StatusBar,
  FlatList,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { Featured, EventDetail, Search, OrganizationDetail, InterestDetail, ImageScreen } from './screens';


import { customFonts } from './constants';
import * as Notifications from 'expo-notifications'
import 'react-native-gesture-handler';

import * as SplashScreen from 'expo-splash-screen';

async function registerForPushNotificationsAsync(){
  let token;
  if(!Constants.isDevice){
    alert("Must use physical device for push notifications");
    console.log("Must use physical device for push notifications");
    return
  }
  const { status: existingStatus} = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if(existingStatus !== 'granted'){
    const {status} = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if(finalStatus !== 'granted'){
    alert('Failed to get push token for push notification!');
    console.log("Failed to get push token for push notification!");
    return;
  }
  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log(token);
  const resp = await fetch('http://3.136.67.161:8080/set_push_token', {
    method: 'POST',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        id: token
    })
  });
  return token;
}

const Stack = createStackNavigator();
SplashScreen.preventAutoHideAsync();

export default function App() {
  const event = createContext()
  const [assetsLoaded, setAssetLoaded] = useState(false);

  const [joinEvent, setJoinEvent] = useState([])

  /* Loading custom fonts in async */
  const _loadAssetsAsync = async () => {
    await Font.loadAsync(customFonts);
    setAssetLoaded(true);
  };

  useEffect(() => {
    _loadAssetsAsync();
  });
  
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);
   
  return assetsLoaded ? (
    <NavigationContainer>
      <StatusBar barStyle="light-content"></StatusBar>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }} navigationOptions={{
          gesturesEnabled: false
        }}
        initialRouteName="Featured">
        <Stack.Screen name="Featured" component={Featured} />
        <Stack.Screen name="InterestDetail" component={InterestDetail} />
        <Stack.Screen name="EventDetail" component={EventDetail} />
        <Stack.Screen name="OrganizationDetail" component={OrganizationDetail} />
        <Stack.Screen name="Search" component={Search}/>
        <Stack.Screen name="ImageScreen" component={ImageScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  ) : (
    <ActivityIndicator size="small"></ActivityIndicator>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


