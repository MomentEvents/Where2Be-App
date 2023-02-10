import { StyleSheet, Text, TextInput, View } from "react-native";
import AppNav from "./navigation/AppNav";
import { UserProvider } from "./contexts/UserContext";
import { ScreenProvider } from "./contexts/ScreenContext";
import { AuthProvider } from "./contexts/AuthContext";
import { EventProvider } from "./contexts/EventContext";
import { StatusBar } from "react-native";

const Main = () => {
  // Disable font scaling
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.allowFontScaling = false;
  TextInput.defaultProps = TextInput.defaultProps || {};
  TextInput.defaultProps.allowFontScaling = false;
  return (
    <UserProvider>
      <EventProvider>
        <ScreenProvider>
          <AuthProvider>
            <StatusBar barStyle="light-content" translucent={true} />
            <AppNav />
          </AuthProvider>
        </ScreenProvider>
      </EventProvider>
    </UserProvider>
  );
};

export default Main;
