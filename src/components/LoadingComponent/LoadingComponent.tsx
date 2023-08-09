import { ActivityIndicator, Alert, Linking, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS, icons } from '../../constants';
import { appVersionText } from '../../constants/texts';
import * as WebBrowser from 'expo-web-browser';


const LoadingComponent = () => {
  const onDiscordClick = () => {
    const supported = Linking.canOpenURL("https://where2be.app/discord");

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      WebBrowser.openBrowserAsync("https://where2be.app/discord");
    } else {
      Alert.alert(`Unable to open link: ${"https://where2be.app/discord"}`);
    }
  };
  return (
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
        <ActivityIndicator color={COLORS.white} size="small" />
      </View>
      <View style={{ padding: 5 }}>
        <Text
          allowFontScaling={false}
          style={{ fontSize: 12, color: COLORS.gray1 }}
        >
          {appVersionText} | Join our{" "}
          <Text
            allowFontScaling={false}
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
  );
};
export default LoadingComponent

const styles = StyleSheet.create({})