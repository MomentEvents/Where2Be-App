// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';


import React, { useState, useEffect, Context, createContext } from 'react';
import * as Font from 'expo-font';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
  StatusBar,
  FlatList,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Tabs from './navigation/Tabs';

import { Featured, EventDetail, Search, Interests, OrganizationDetail, Login, OrgEventDetail, Mine, Signup } from './screens';


import { customFonts } from './constants';
import AppNav from './navigation/AppNav';

import 'react-native-gesture-handler';

import { AuthProvider } from './AuthContext';

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
  const resp = await fetch('http://10.0.2.2:8080/set_push_token', {
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


export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);
  // Remove font scaling for app
  Text.defaultProps = Text.defaultProps||{};
  Text.defaultProps.allowFontScaling = false;
  TextInput.defaultProps = TextInput.defaultProps||{};
  TextInput.defaultProps.allowFontScaling = false;
  return(
    <AuthProvider>
      <AppNav/>
    </AuthProvider>
  )

}



