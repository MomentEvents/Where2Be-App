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
import { displayError } from "../helpers/helpers";
import { appVersionText } from "../constants/texts";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// import { displayError } from "../helpers/helpers";

type ScreenContextType = {
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};
export const ScreenContext = createContext<ScreenContextType>({
  setLoading: null,
});

export const ScreenProvider = ({ children }) => {
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const { isUserContextLoaded, pullTokenFromServer, serverError } =
    useContext(UserContext);

  const loadAssets = async () => {
    console.log("Loading assets");
    await Font.loadAsync(customFonts)
      .then(() => setAssetsLoaded(true))
      .catch((error: Error) => displayError(error));
  };

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

  useEffect(() => {
    loadAssets();
  }, []);

  return (
    <ScreenContext.Provider value={{ setLoading }}>
      {assetsLoaded && isUserContextLoaded ? (
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
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: COLORS.trueBlack,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              flex: 2,
              width: "100%",
              justifyContent: "flex-end",
              alignItems: "center",
            }}
          >
            <icons.where2be
              width="70%"
              style={{ marginBottom: 80 }}
            ></icons.where2be>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "flex-start",
            }}
          >
            {serverError ? (
              <TouchableOpacity onPress={pullTokenFromServer}>
                <MaterialCommunityIcons name="reload" size={24} color="white" />
              </TouchableOpacity>
            ) : (
              <ActivityIndicator color={COLORS.white} size="small" />
            )}
          </View>
          <View style={{ padding: 5 }}>
            <Text style={{ fontSize: 12, color: COLORS.gray1 }}>
              {appVersionText} | Join our{" "}
              <Text
                onPress={onDiscordClick}
                style={{
                  fontSize: 12,
                  color: COLORS.gray1,
                  textDecorationLine: "underline",
                }}
              >
                Discord server
              </Text>
              !
            </Text>
          </View>
        </SafeAreaView>
      )}
    </ScreenContext.Provider>
  );
};
