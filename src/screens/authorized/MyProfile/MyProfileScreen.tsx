import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import { UserContext } from "../../../contexts/UserContext";
import { COLORS, SIZES, icons } from "../../../constants";
import { McText } from "../../../components/Styled";
import GradientBackground from "../../../components/Styled/GradientBackground";
import { TouchableOpacity } from "react-native-gesture-handler";

const MyProfileScreen = () => {
  const { userLogout } = useContext(AuthContext);
  const { currentUser } = useContext(UserContext);
  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <SectionHeader>
          <McText h1>Profile</McText>
          <TouchableOpacity style={{position: 'absolute', right: 0}}>
            <icons.settings />
          </TouchableOpacity>
        </SectionHeader>
        <Text>
          Logged in as {currentUser.Name}. {currentUser.Username}
        </Text>
        <Button title="Logout" onPress={() => userLogout()}></Button>
      </SafeAreaView>
    </GradientBackground>
  );
};

export default MyProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const SectionHeader = ({ children }) => {
  return (
    <View
      style={{
        paddingHorizontal: 20,
        paddingVertical: 6,
        alignItems: "center",
        flexDirection: "row",
        borderBottomWidth: 1,
        borderColor: COLORS.gray,
        backgroundColor: COLORS.trueBlack,
      }}
    >
      {children}
    </View>
  );
};
