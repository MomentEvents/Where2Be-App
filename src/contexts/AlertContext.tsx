import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../constants";
import { McText } from "../components/Styled";

type AlertContextType = {
  showAlert: (component: ReactNode, seconds: number) => void;
  showErrorAlert: (error: Error) => void;
  hideAlert: () => void;
};

const initialState: AlertContextType = {
    showErrorAlert: () => {},
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

  const showErrorAlert = (error: Error) => {
    showAlert(
      <McText body3 style={{ textAlign: "center", color: COLORS.white }}>
        {error.message}
      </McText>,
      5
    );
  };

  const showAlert = (component: ReactNode, seconds: number) => {
    // If there's an existing timeout (i.e., an alert is already showing), clear it
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;

      // Start an animation to slide the current alert up
      Animated.timing(slideAnimation, {
        toValue: -500,
        duration: 200,
        useNativeDriver: false,
      }).start(() => {
        // Once the animation is complete, hide the current alert
        setAlertVisible(false);
        // And show the new alert
        displayNewAlert(component, seconds);
      });
    } else {
      // If there isn't a timeout (i.e., no alert is currently showing), simply show the new alert
      displayNewAlert(component, seconds);
    }
  };

  const displayNewAlert = (component: ReactNode, seconds: number) => {
    setAlertVisible(true);
    setAlertComponent(component);

    // Reset the position of the alert for slide in
    slideAnimation.setValue(-100);

    // Start an animation to slide the new alert down
    Animated.timing(slideAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    timeoutId.current = setTimeout(() => {
      hideAlert();
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
    <AlertContext.Provider value={{ showAlert, hideAlert, showErrorAlert }}>
      {children}
      {alertVisible && (
        <Animated.View
          {...panResponder.panHandlers}
          style={{
            position: "absolute",
            paddingBottom: 20,
            paddingTop: insets.top + 20,
            width: "100%",
            paddingHorizontal: 30,
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
