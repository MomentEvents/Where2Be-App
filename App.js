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
import Tabs from './navigation/Tabs';

import { Featured, EventDetail, Search, Interests, OrganizationDetail, Login } from './screens';


import { customFonts } from './constants';


import 'react-native-gesture-handler';
import NewInterest from './New-Screen/NewInterest';

const Stack = createStackNavigator();

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




//   const fetchData = async () => {
//     const resp = await fetch('http://mighty-chamber-83878.herokuapp.com/interests', {
//         method: 'GET',
//     });

//     const data = await resp.json();
//     // console.log(data,"resp data")
    
    
    

//     const resp2 = await fetch('http://mighty-chamber-83878.herokuapp.com/import_interest_list', {
//         method: 'POST',
//         headers: {
//             Accept: 'application/json',
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//             id: 'user_1'
//         })
//     });
//     const inTags = await resp2.json();
//     console.log(inTags, "selected data")

    
    

//     for (var i = 0; i < inTags.length; i++) {
//         outTags[inTags[i]] = true
//     }

//     setInTags(inTags);
//     setData(data);

//     setLoading(false);
// };

// useEffect(() => {
// fetchData()
// },[])
   

  return assetsLoaded ? (
    <NavigationContainer>
      <StatusBar barStyle="light-content"></StatusBar>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Featured"
      >
        <Stack.Screen name="Interests" component={Interests}/>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Featured" component={Tabs} />
        <Stack.Screen name="EventDetail" component={EventDetail} />
        <Stack.Screen name="OrganizationDetail" component={OrganizationDetail} />
        <Stack.Screen name="Search" component={Search}/>
        
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
