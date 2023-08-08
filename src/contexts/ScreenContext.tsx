import React, { useState, useEffect, createContext, useContext } from "react";
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
} from "react-native";
import { UserContext } from "./UserContext";
import { appVersionText } from "../constants/texts";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { McText } from "../components/Styled";
import { AlertContext } from "./AlertContext";
import { displayError } from "../helpers/helpers";

type ScreenContextType = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
export const ScreenContext = createContext<ScreenContextType>({
  setLoading: null,
});

export const ScreenProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const { isUserContextLoaded, pullTokenFromServer, serverError } =
    useContext(UserContext);

  const onDiscordClick = () => {
    const supported = Linking.canOpenURL("https://where2be.app/discord");

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      Linking.openURL("https://where2be.app/discord");
    } else {
      Alert.alert(`Unable to open link: ${"https://where2be.app/discord"}`);
    }
  };

  return (
    <ScreenContext.Provider value={{ setLoading }}>
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
