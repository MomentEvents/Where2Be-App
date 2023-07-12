import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Text, View, Button, Platform, Alert, Linking } from "react-native";
import { momentAPI } from "../constants/server";
import { formatError, responseHandler } from "../helpers/helpers";
import { NotificationPreferences } from "../constants/types";

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
      Alert.alert("Please enable push notifications", "This allows you to better connect with your campus! You can disable specific notifications if needed in settings.", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Go to Settings",
          onPress: () => Linking.openURL("app-settings:"),
        },
      ]);
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
  if (!notificationToken) {
    return;
  }

  const response = await fetch(
    momentAPI + `/notification/user_id/${userID}/add_token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_access_token: userAccessToken,
        push_token: notificationToken,
        push_type: "Expo",
      }),
    }
  ).catch(() => {
    return undefined
  });

  await responseHandler<void>(
    response,
    "Unable to register push notifications",
    false
  );
}

export async function unregisterPushNotificationToken(
  userAccessToken: string,
  userID: string,
  notificationToken: string
): Promise<void> {
  if (!notificationToken) {
    return;
  }

  const response = await fetch(
    momentAPI + `/notification/user_id/${userID}/remove_token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_access_token: userAccessToken,
        push_token: notificationToken,
        push_type: "Expo",
      }),
    }
  ).catch(() => {
    return undefined
  });

  await responseHandler<void>(
    response,
    "Cannot unregister push notification",
    false
  );
}

export async function getNotificationPreferences(
  userAccessToken: string,
  userID: string
): Promise<NotificationPreferences> {
  const response = await fetch(
    momentAPI + `/notification/user_id/${userID}/get_preferences`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_access_token: userAccessToken,
      }),
    }
  ).catch(() => {
    return undefined
  });

  const notificationPreferences =
    await responseHandler<NotificationPreferences>(
      response,
      "Cannot get push notification preferences",
      true
    );

  console.log(JSON.stringify(notificationPreferences));
  return notificationPreferences;
}

export async function setNotificationPreferences(
  userAccessToken: string,
  userID: string,
  preferences: NotificationPreferences
): Promise<void> {
  const response = await fetch(
    momentAPI + `/notification/user_id/${userID}/set_preferences`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_access_token: userAccessToken,
        preferences: preferences,
      }),
    }
  ).catch(() => {
    return undefined
  });

  await responseHandler<void>(
    response,
    "Cannot set push notification preferences",
    false
  );
}
