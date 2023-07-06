import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Text, View, Button, Platform } from "react-native";
import { momentAPI } from "../constants/server";
import { formatError, responseHandler } from "../helpers/helpers";

export async function getPushNotificationToken(): Promise<string> {
  let token: string = null;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert(
        "To receive push notifications, enable them in settings and restart the app."
      );
      return null;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert("You must use a physical device to receive push notifications.");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  return token;
}

export async function registerPushNotificationToken(
  userAccessToken: string,
  userID: string,
  notificationToken: string
): Promise<void> {
  if(!notificationToken){
    return
  }
  
  const response = await fetch(momentAPI + `/notification/user_id/${userID}/add_token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_access_token: userAccessToken,
      push_token: notificationToken,
      push_type: "Expo"
    }),
  })

  await responseHandler<void>(response, "Unable to register push notifications. Please try again later", false)
}

export async function unregisterPushNotificationToken(
  userAccessToken: string,
  userID: string,
  notificationToken: string
): Promise<void> {

  if(!notificationToken){
    return
  }

  const response = await fetch(momentAPI + `/notification/user_id/${userID}/remove_token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_access_token: userAccessToken,
      push_token: notificationToken,
      push_type: "Expo"
    }),
  })

  await responseHandler<void>(response, "Cannot unregister push notifications. Please try again", false)
}
