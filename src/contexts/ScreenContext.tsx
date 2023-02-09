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
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Text,
} from "react-native";
import { UserContext } from "./UserContext";
import { displayError } from "../helpers/helpers";
import { McText } from "../components/Styled";
import { appVersionText } from "../constants/texts";
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

  const { isUserContextLoaded } = useContext(UserContext);

  const loadAssets = async () => {
    console.log("Loading assets");
    await Font.loadAsync(customFonts)
      .then(() => setAssetsLoaded(true))
      .catch((error: Error) => displayError(error));
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
            <icons.moment
              width="70%"
              style={{ marginBottom: 50 }}
            ></icons.moment>
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: "flex-start",
            }}
          >
            <ActivityIndicator size="small" />
          </View>
          <View style={{ padding: 5 }}>
            <Text style={{ fontSize: 12, color: COLORS.gray1 }}>
              {appVersionText}
            </Text>
          </View>
        </SafeAreaView>
      )}
    </ScreenContext.Provider>
  );
};
