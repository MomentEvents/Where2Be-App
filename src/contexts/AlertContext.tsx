import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { View, StyleSheet, Animated, PanResponder } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../constants";

type AlertContextType = {
  showAlert: (component: ReactNode, seconds: number) => void;
  hideAlert: () => void;
};

const initialState: AlertContextType = {
  showAlert: () => {},
  hideAlert: () => {},
};

export const AlertContext = createContext<AlertContextType>(initialState);

export const AlertProvider = ({ children }) => {
  const [alertVisible, setAlertVisible] = useState<boolean>(false);
  const [alertComponent, setAlertComponent] = useState<ReactNode | null>(null);
  const slideAnimation = useRef(new Animated.Value(-100)).current;

  const insets = useSafeAreaInsets();

  const timeoutId = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: alertVisible ? 0 : -100,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [alertVisible]);

  const showAlert = (component: ReactNode, seconds: number) => {
    if(timeoutId.current){
        clearTimeout(timeoutId.current);
        timeoutId.current = null;
        setAlertVisible(false);
    }
    setAlertVisible(true);
    setAlertComponent(component);

    timeoutId.current = setTimeout(() => {
        timeoutId.current = null;
      setAlertVisible(false);
    }, seconds * 1000);
  };

  const hideAlert = () => {
    Animated.timing(slideAnimation, {
      toValue: -500,
      duration: 200,
      useNativeDriver: false,
    }).start(() => {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
      setAlertVisible(false);
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dy < 0) {
          slideAnimation.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.vy < -0.5 || gestureState.dy < -100) {
          Animated.timing(slideAnimation, {
            toValue: -500,
            duration: 200,
            useNativeDriver: false,
          }).start(() => {
            clearTimeout(timeoutId.current);
            timeoutId.current = null;
            setAlertVisible(false);
          });
        } else {
          Animated.timing(slideAnimation, {
            toValue: 0,
            duration: 200,
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {alertVisible && (
        <Animated.View
          {...panResponder.panHandlers}
          style={{
            position: "absolute",
            paddingBottom: 30,
            paddingTop: insets.top + 30,
            backgroundColor: COLORS.black,
            alignItems: "center",
            justifyContent: "center",
            top: 0,
            left: 0,
            right: 0,
            transform: [{ translateY: slideAnimation }],
          }}
        >
          {alertComponent}
        </Animated.View>
      )}
    </AlertContext.Provider>
  );
};
