import React from "react";
import { View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Featured, Personal, Search, Profile } from "../screens";
import { COLORS, SIZES, FONTS, icons } from "../constants";
import { McText, McIcon } from "../components";
import { Platform } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Colors } from "react-native/Libraries/NewAppScreen";

const Tab = createBottomTabNavigator();

const TabIcon = ({ focused, icon }) => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <McIcon
        size={focused ? 28 : 32}
        source={icon}
        resizeMode="contain"
        style={{
          tintColor: focused ? COLORS.white : COLORS.gray,
        }}
      />
    </View>
  );
};
const TabLabel = ({ focused, text }) => {
  return focused ? (
    <McText
      body6
      style={{
        marginBottom: Platform.OS === "ios" ? -8 : 8,
        color: focused ? COLORS.white : COLORS.gray,
      }}
    >
      {text}
    </McText>
  ) : (
    <View />
  );
};

const Tabs = ({ params }) => {
  const screenOptions = {
    headerShown: false,
    tabBarStyle: {
      position: "absolute",
      backgroundColor: COLORS.trueBlack,
      opacity: 1,
      borderTopColor: COLORS.gray2,
      height: 80,
      borderTopRightRadius: 0,
      borderTopLeftRadius: 0,
    },
    tabBarItemStyle: {
      display: "flex",
      paddingTop: 8,
    },
  };

  return (
    <Tab.Navigator
      tabBarOptions={{ showLabel: false }}
      {...{ screenOptions }}
      // screenOptions={{
      //   headerShown: false,
      //   style: {
      //     position: 'absolute',
      //     bottom: 0,
      //     left: 0,
      //     right: 0,
      //     elevation: 0,
      //     backgroundColor: COLORS.tabBar,
      //     opacity: 0.9,
      //     borderTopColor: 'transparent',
      //     height: 111,
      //     borderRadius: SIZES.radius,
      //     "tabBarStyle": [
      //       {
      //         "display": "flex"
      //       },
      //       null
      //     ],
      //   },
    >
      {/* <Tab.Screen
        name="Feed"
        component={SocialFeed}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel focused={focused} text="Feed" />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Featured"
        component={Featured}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.tab_2} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel focused={focused} text="Events" />
          ),
        }}
      />

      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.search} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel focused={focused} text="Search" />
          ),
        }}
        
      />
      {/* <Tab.Screen
        name="Create"
        component={CreateEvent}
        options={{
          tabBarIcon: ({ focused }) => (
            <TouchableOpacity style={{
              height: 50,
              width: 50,
              borderRadius: 40,
              backgroundColor: COLORS.purple,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <McIcon size={40} style={{
              tintColor: COLORS.white
            }} source={icons.plus}/>
            </TouchableOpacity>
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel text="Create" />
          ),
        }}
      /> */}

      <Tab.Screen
        name="Personal"
        component={Personal}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.like} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel focused={focused} text="Personal" />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.tab_4} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel focused={focused} text="Profile" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
