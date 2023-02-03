import React from "react";
import { View, StyleSheet, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { COLORS, SCREENS, SIZES, icons } from "../constants";
import MyCalendarScreen from "../screens/authorized/MyCalendar/MyCalendarScreen";
import ExploreEventsScreen from "../screens/authorized/ExploreEvents/ExploreEventsScreen";
import SearchScreen from "../screens/authorized/Search/SearchScreen";
import MyProfileScreen from "../screens/authorized/MyProfile/MyProfileScreen";

const Tab = createBottomTabNavigator();

// constants used for rendering images
const EVENTS = "Events";
const SEARCH = "Search";
const FAVORITES = "Favorites";
const PROFILE = "Profile";

const TabIcon = ({ focused, icon }) => {
  switch (icon) {
    case EVENTS:
      return (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          {focused ? (
            <icons.activehome height={32}></icons.activehome>
          ) : (
            <icons.inactivehome height={32}></icons.inactivehome>
          )}
        </View>
      );
    case SEARCH:
      return (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          {focused ? (
            <icons.activesearch height={32}></icons.activesearch>
          ) : (
            <icons.inactivesearch height={32}></icons.inactivesearch>
          )}
        </View>
      );
    case FAVORITES:
      return (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          {focused ? (
            <icons.activefavorite height={32}></icons.activefavorite>
          ) : (
            <icons.inactivefavorite height={32}></icons.inactivefavorite>
          )}
        </View>
      );
    case PROFILE:
      return (
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          {focused ? (
            <icons.activeprofile height={32}></icons.activeprofile>
          ) : (
            <icons.inactiveprofile height={32}></icons.inactiveprofile>
          )}
        </View>
      );
  }
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
    </View>
  );
};

const TabNavigator = ({ params }) => {
  return (
    <Tab.Navigator
      //tabBarOptions={{ showLabel: false }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.white,
        tabBarInactiveTintColor: COLORS.white,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: COLORS.trueBlack,
          opacity: 1,
          borderTopColor: COLORS.gray2,
          borderTopWidth: StyleSheet.hairlineWidth,
          height: Platform.OS === 'ios' ? SIZES.tab_bar_height : SIZES.tab_bar_height - 20,
          borderTopRightRadius: 0,
          borderTopLeftRadius: 0,
        },
        tabBarItemStyle: {
          display: "flex",
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen
        name={SCREENS.ExploreEvents}
        component={ExploreEventsScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={EVENTS} />
          ),
        }}
      />

      <Tab.Screen
        name={SCREENS.Search}
        component={SearchScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={SEARCH} />
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
