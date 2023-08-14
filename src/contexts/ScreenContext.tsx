import React, { useState, useEffect, createContext, useContext, useRef } from "react";
import { COLORS, icons } from "../constants";
import ProgressLoader from "rn-progress-loader";
import * as Font from "expo-font";
import { customFonts } from "../constants";
import {
  ActivityIndicator,
  SafeAreaView,
  View,
  Text,
  Alert,
  Linking,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { UserContext } from "./UserContext";
import { appVersionText } from "../constants/texts";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { McText } from "../components/Styled";
import { AlertContext } from "./AlertContext";
import { displayError } from "../helpers/helpers";

type ScreenContextType = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  flatListRef: React.MutableRefObject<FlatList<any>>;
  notificationNavigationRef: React.MutableRefObject<any>;
  navigationRef: React.MutableRefObject<any>,
  preSignupEventID: React.MutableRefObject<string>,
};
export const ScreenContext = createContext<ScreenContextType>({
  setLoading: null,
  flatListRef: React.createRef(),
  notificationNavigationRef: React.createRef(),
  navigationRef: React.createRef(),
  preSignupEventID: React.createRef(),
});

export const ScreenProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const notificationNavigationRef = useRef<any>();
  const navigationRef = useRef<any>();
  const preSignupEventID = useRef<string>();

  return (
    <ScreenContext.Provider value={{ setLoading, flatListRef, notificationNavigationRef, navigationRef, preSignupEventID }}>
      <>
        <ProgressLoader
          visible={loading}
          isModal={true}
          isHUD={true}
          hudColor={"#000000"}
          color={"#FFFFFF"}
        ></ProgressLoader>

        {children}
      </>
    </ScreenContext.Provider>
  );
};
