import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Featured, Schedule, SocialFeed, Mine } from '../screens';
import { COLORS, SIZES, FONTS, icons } from '../constants';
import { McText, McIcon } from '../components';

const Tab = createBottomTabNavigator();

const TabIcon = ({ focused, icon }) => {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <McIcon
        size={focused ? 28 : 32}
        source={icon}
        resizeMode="contain"
        style={{
          tintColor: focused ? COLORS.lightGray : COLORS.gray,
        }}
      />
    </View>
  );
};
const TabLabel = ({ focused, text }) => {
  return focused ? (
    <McText body6
      style={{
        marginBottom: 8,
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
    headerShown:false,
    tabBarStyle:{
      position: 'absolute',
      backgroundColor: COLORS.tabBar,
      opacity: 0.98,
      borderTopColor: 'transparent',
      height: 80,
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
    },
    tabBarItemStyle:{
      display:'flex',
      paddingTop: 8,

    }
  };

  return (
    <Tab.Navigator {...{screenOptions}}
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
      <Tab.Screen
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
      />
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
        name="Mine"
        component={Mine}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.tab_4} />
          ),
          tabBarLabel: ({ focused }) => (
            <TabLabel focused={focused} text="Mine" />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Tabs;
