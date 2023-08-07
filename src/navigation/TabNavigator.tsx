import React, { useEffect } from "react";
import { View, StyleSheet, Platform } from "react-native";
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
import { useNavigation } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

// constants used for rendering images
const EVENTS = "Events";
const SEARCH = "Search";
const EXPLORE = "Explore";
const FAVORITES = "Favorites";
const PROFILE = "Profile";

const TabIcon = ({ focused, icon }) => {
  switch (icon) {
    case EVENTS:
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
            <TabIcon focused={focused} icon={EVENTS} />
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
        }}
      />

      <Tab.Screen
        name={SCREENS.MyCalendar}
        component={MyCalendarScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={FAVORITES} />
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
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
