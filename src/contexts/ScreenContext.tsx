import React, { useState, useEffect, createContext, useContext } from "react";
import {
  User,
  School,
  Token,
  SIZES,
  images,
  COLORS,
  icons,
} from "../constants";
import ProgressLoader from "rn-progress-loader";
import * as Font from "expo-font";
import { customFonts } from "../constants";
import {
  ActivityIndicator,
  ImageBackground,
  SafeAreaView,
  View,
} from "react-native";
import { UserContext } from "./UserContext";
import { displayError } from "../helpers/helpers";
import { getServerStatus } from "../services/AuthService";
// import { displayError } from "../helpers/helpers";

type ScreenContextType = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
export const ScreenContext = createContext<ScreenContextType>({
  setLoading: null,
});

export const ScreenProvider = ({ children }) => {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [serverConnected, setServerConnected] = useState(false);
  const [loading, setLoading] = useState(false);


  const { isUserContextLoaded } = useContext(UserContext);

  const loadAssets = async () => {
    console.log("Loading assets")
    await Font.loadAsync(customFonts)
      .then(() => setAssetsLoaded(true))
      .catch((error: Error) => displayError(error));
  };

  const checkServerStatus = async () => {
    console.log("Getting server status")
    await getServerStatus()
    .then(() => setServerConnected(true))
    .catch((error: Error) => displayError(error));
  }

  useEffect(() => {
    loadAssets();
    checkServerStatus();
  }, []);
  
  return (
    <ScreenContext.Provider value={{ setLoading }}>
      {assetsLoaded && isUserContextLoaded && serverConnected ? (
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
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: COLORS.black,
            justifyContent: "center",
          }}
        >
          <SafeAreaView style={{ alignItems: "center" }}>
            <icons.moment width={SIZES.width * 0.7}></icons.moment>
            <ActivityIndicator size="small" />
          </SafeAreaView>
        </View>
      )}
    </ScreenContext.Provider>
  );
};
