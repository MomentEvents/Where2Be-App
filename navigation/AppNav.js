import React, { useState, useEffect, Context, createContext, useContext } from 'react';
import * as Font from 'expo-font';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  StatusBar,
  FlatList,
  Image,
  SafeAreaView,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Tabs from './Tabs';
import { Featured, EventDetail, Interests, Search, ImageScreen, OrganizationDetail, Login, Signup, Personal, InterestDetail, CreateEvent } from '../screens';
import { SIZES, COLORS, customFonts } from '../constants';
import { AuthContext } from '../AuthContext';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();
const Stack = createStackNavigator();
function AppNav(){
    const [assetsLoaded, setAssetLoaded] = useState(false);
    const {UserId, loadingToken} = useContext(AuthContext);
    
  /* Loading custom fonts in async */
  const _loadAssetsAsync = async () => {
    await Font.loadAsync(customFonts);
    setAssetLoaded(true);
  };
  useEffect(() => {
    _loadAssetsAsync();
  });
  return ((assetsLoaded && !loadingToken)?
    <NavigationContainer>
    {UserId !== null ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
    :<SafeAreaView style={styles.container}>
    <Image
    source={require('../assets/adaptive-icon.png')}
    style = {{
      width: '100%',
      height: 
        SIZES.height < 700? SIZES.height * 0.4 : SIZES.height * 0.5,
      
    }}
  />
  <ActivityIndicator size="small"/>
  </SafeAreaView>
  );

}
SplashScreen.hideAsync();



const AuthStack = () =>{
    return (
    
    
    <Stack.Navigator
        screenOptions={{
        headerShown: false,
        }}
        initialRouteName="Login"
    >
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Signup" component={Signup}/>
        
    </Stack.Navigator>
    
    );
  }
  
  const AppStack = () =>{
    return (
      
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
          initialRouteName="Featured"
        >
          <Stack.Screen name="Featured" component={Tabs} />
          <Stack.Screen name="EventDetail" component={EventDetail} />
          <Stack.Screen name="OrganizationDetail" component={OrganizationDetail} />
          <Stack.Screen name="Search" component={Search}/>
          <Stack.Screen name="Personal" component={Personal}/>
          <Stack.Screen name="InterestDetail" component={InterestDetail}/>
          <Stack.Screen name="ImageScreen" component={ImageScreen}/>
          <Stack.Screen name="CreateEvent" component={CreateEvent}/>
          <Stack.Screen name="Interests" component={Interests}/>
          
        </Stack.Navigator>
    );
  }

  
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.black,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default AppNav;