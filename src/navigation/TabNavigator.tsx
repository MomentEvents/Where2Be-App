import React, { useContext, useEffect, useRef } from "react";
import { View, StyleSheet, Platform, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { COLORS, SCREENS, SIZES, icons } from "../constants";
import MyCalendarScreen from "../screens/authorized/MyCalendar/MyCalendarScreen";
import ExploreEventsScreen from "../screens/authorized/ExploreEvents/ExploreEventsScreen";
import SearchScreen from "../screens/authorized/Search/SearchScreen";
import MyProfileScreen from "../screens/authorized/MyProfile/MyProfileScreen";
import { MaterialIcons } from "@expo/vector-icons";
import { Octicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import HomeScreen from "../screens/authorized/Home/HomeScreen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Notifications from "expo-notifications";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ScreenContext } from "../contexts/ScreenContext";

const Tab = createBottomTabNavigator();

// constants used for rendering images
const HOME = "Home";
const SEARCH = "Search";
const EXPLORE = "Explore";
const FAVORITES = "Favorites";
const PROFILE = "Profile";

const TabIcon = ({ focused, icon }) => {
  switch (icon) {
    case HOME:
      return (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          {focused ? (
            <Octicons name="home" size={28} color="white" />
          ) : (
            <Octicons name="home" size={28} color="gray" />
          )}
        </View>
      );

    case SEARCH:
      return (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          {focused ? (
            <MaterialIcons name="search" size={30} color="white" />
          ) : (
            <MaterialIcons name="search" size={30} color="gray" />
          )}
        </View>
      );
    case EXPLORE:
      return (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          {focused ? (
            <MaterialCommunityIcons
              name="compass-outline"
              size={30}
              color="white"
            />
          ) : (
            <MaterialCommunityIcons
              name="compass-outline"
              size={30}
              color="gray"
            />
          )}
        </View>
      );
    case FAVORITES:
      return (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          {focused ? (
            <MaterialIcons name="event-available" size={30} color="white" />
          ) : (
            <MaterialIcons name="event-available" size={30} color="gray" />
          )}
        </View>
      );
    case PROFILE:
      return (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          {focused ? (
            <Octicons name="person" size={28} color="white" />
          ) : (
            <Octicons name="person" size={28} color="gray" />
          )}
        </View>
      );
  }
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}></View>
  );
};

const TabNavigator = ({ params }) => {
  const insets = useSafeAreaInsets();

  const currentTab = useRef<string>(SCREENS.Home);
  const { flatListRef, signupActionEventID } = useContext(ScreenContext);

  const navigator = useNavigation<any>()

  useEffect(() => {
    if (signupActionEventID.current) {
      navigator.navigate(SCREENS.EventDetails, {
        eventID: signupActionEventID.current,
      });
  
      signupActionEventID.current = null;
    }
  },[])

  return (
    <Tab.Navigator
      //tabBarOptions={{ showLabel: false }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.white,
        tabBarInactiveTintColor: COLORS.white,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: COLORS.trueBlack,
          opacity: 1,
          borderTopColor: COLORS.gray2,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: SIZES.tabBarHeight + insets.bottom,
          borderTopRightRadius: 0,
          borderTopLeftRadius: 0,
        },
        tabBarItemStyle: {
          display: "flex",
          paddingTop: 5,
        },
      }}
    >
      <Tab.Screen
        name={SCREENS.Home}
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={HOME} />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={(e) => {
                if (
                  currentTab.current === SCREENS.Home &&
                  flatListRef.current
                ) {
                  console.log("going up?")
                  flatListRef.current.scrollToOffset({
                    offset: 0,
                    animated: true,
                  });
                }
                currentTab.current = SCREENS.Home;
                props.onPress(e); // Call the original onPress prop
              }}
            />
          ),
        }}
      />

      {/* <Tab.Screen
        name={SCREENS.Search}
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={SEARCH} />
          ),
        }}
      /> */}

      <Tab.Screen
        name={SCREENS.ExploreEvents}
        component={ExploreEventsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={EXPLORE} />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={(e) => {
                currentTab.current = SCREENS.ExploreEvents;
                props.onPress(e); // Call the original onPress prop
              }}
            />
          ),
        }}
      />

      <Tab.Screen
        name={SCREENS.MyCalendar}
        component={MyCalendarScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={FAVORITES} />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={(e) => {
                currentTab.current = SCREENS.MyCalendar;
                props.onPress(e); // Call the original onPress prop
              }}
            />
          ),
        }}
      />
      <Tab.Screen
        name={SCREENS.MyProfile}
        component={MyProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={PROFILE} />
          ),
          tabBarButton: (props) => (
            <TouchableOpacity
              {...props}
              onPress={(e) => {
                currentTab.current = SCREENS.MyProfile;
                props.onPress(e); // Call the original onPress prop
              }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
