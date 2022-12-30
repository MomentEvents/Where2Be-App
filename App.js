// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';

import React, { useState, useEffect, Context, createContext } from "react";
import * as Font from "expo-font";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ActivityIndicator,
  StatusBar,
  FlatList,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Tabs from "./navigation/Tabs";

import {
  Featured,
  EventDetail,
  Search,
  Interests,
  OrganizationDetail,
  Login,
  OrgEventDetail,
  Mine,
  Signup,
} from "./screens";

import { customFonts } from "./constants";
import AppNav from "./navigation/AppNav";

import "react-native-gesture-handler";

import { AuthProvider } from "./Contexts/AuthContext";
import { LoadingProvider } from "./Contexts/LoadingContext";

export default function App() {
  // Remove font scaling for app
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;
  TextInput.defaultProps = TextInput.defaultProps || {};
  TextInput.defaultProps.allowFontScaling = false;
  return (
    <AuthProvider>
      <LoadingProvider>
        <AppNav />
      </LoadingProvider>
    </AuthProvider>
  );
}
