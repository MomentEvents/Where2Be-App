import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants';


export default async function registerForPushNotificationsAsync(userId){
    console.log('starting notification funtion')
    let token;
    if(!Constants.isDevice){
      alert("Must use physical device for push notifications");
      console.log("Must use physical device for push notifications");
      return
    }
    const { status: existingStatus} = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if(existingStatus !== 'granted'){
      const {status} = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if(finalStatus !== 'granted'){
      alert('Failed to get push token for push notification!');
      console.log("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
    const resp = await fetch('http://10.0.2.2:8080/set_push_token', {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token: token,
        userId : userId
      })
    });
    return token;
  }
  