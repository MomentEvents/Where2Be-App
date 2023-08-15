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
  signupActionEventID: React.MutableRefObject<string>;
};
export const ScreenContext = createContext<ScreenContextType>({
  setLoading: null,
  flatListRef: null,
  signupActionEventID: null
});

export const ScreenProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const signupActionEventID = useRef<string>()
  const flatListRef = useRef<FlatList>(null);

  return (
    <ScreenContext.Provider value={{ setLoading, flatListRef, signupActionEventID }}>
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
