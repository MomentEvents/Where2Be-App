import { Event } from "../constants";
import {
  ServerError,
  CustomError,
  NetworkError,
  UserError,
} from "../constants/error";
import * as WebBrowser from 'expo-web-browser';
import branch from 'react-native-branch'


import backendConfig from "../../backendconfig.json"

/***********************************
 * checkIfStringIsEmail
 *
 * Checks if a string is an email
 *
 * Parameters -
 * test: a string to check if it is formatted like an email or username
 *
 * Return -
 * a boolean which if true, means the string is an email or if false, means the string is not an email
 */

import moment from "moment";
import { Alert, Linking, Platform } from "react-native";

export function checkIfStringIsEmail(test: string): boolean {
  const expression =
    /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

  return expression.test(String(test).toLowerCase());
}

/***********************************
 * checkIfStringIsAlphanumeric
 *
 * Checks if a string contains only letters and numbers
 *
 * Parameters -
 * test: a string to check if it is formatted alphanumerically
 *
 * Return -
 * a boolean which if true, means the string is only alphanumeric or if false, is not alpanumeric
 */
export function checkIfStringIsAlphanumeric(test: string): boolean {
  return /^[A-Za-z0-9]*$/.test(test);
}

/***********************************
 * checkIfStringIsAlphanumeric
 *
 * Checks if a string contains only letters and numbers
 *
 * Parameters -
 * test: a string to check if it is formatted alphanumerically
 *
 * Return -
 * a boolean which if true, means the string is only alphanumeric or if false, is not alpanumeric
 */
export function formatError(name: string, message: string): Error {
  const thrownError: Error = new Error(message);
  thrownError.name = name;

  return thrownError;
}

/***********************************
 * checkIfStringIsAlphanumeric
 *
 * Checks if a string contains only letters and numbers
 *
 * Parameters -
 * test: a string to check if it is formatted alphanumerically
 *
 * Return -
 * a boolean which if true, means the string is only alphanumeric or if false, is not alpanumeric
 */
export function displayError(error: Error): boolean {
  Alert.alert(error.name, error.message)
  return true;
}

export function checkIfStringIsReadable(test: string): boolean {
  if (test === undefined || test === null) {
    return false;
  }
  return /^[A-Za-z0-9,;'"!@%.].*[\s\.]*$/.test(test);
}

export function convertDateToUTC(originalDate: Date): Date {
  var date = originalDate;
  var now_utc = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );

  return date;
}

export function convertToStartTimeEndTime(
  date: Date,
  startTime: Date,
  endTime: Date
): { [key: string]: Date } {
  // yyyy-mm-ddThh:mm:ss.000Z
  const offset = date.getTimezoneOffset() * 60000;

  const startDateTimeString =
    moment.utc(date).local().format("YYYY[-]MM[-]DD") +
    "T" +
    moment.utc(startTime).local().format("HH[:]mm") +
    ":00.000Z";

  const endDateTimeString =
    moment.utc(date).local().format("YYYY[-]MM[-]DD") +
    "T" +
    moment.utc(endTime).local().format("HH[:]mm") +
    ":00.000Z";

  const toBeConvertedStartTime = new Date(startDateTimeString);

  const convertedStartTime = new Date(
    toBeConvertedStartTime.getTime() + offset
  );

  const toBeConvertedEndTime = new Date(endDateTimeString);

  const convertedEndTime = new Date(toBeConvertedEndTime.getTime() + offset);

  var valuesToMap = {};

  valuesToMap["startDateTime"] = convertedStartTime;
  valuesToMap["endDateTime"] = convertedEndTime;

  return valuesToMap;
}

export function checkIfEventIsFormatted(event: Event): boolean {
  return (
    //checkIfStringIsReadable(event.Title) &&
    event.Description !== undefined &&
    event.Description !== null &&
    event.Description !== "" &&
    //checkIfStringIsReadable(event.Location) &&
    checkIfStringIsReadable(event.Picture) &&
    event.StartDateTime !== null &&
    event.StartDateTime !== undefined &&
    event.EndDateTime !== null &&
    event.EndDateTime !== undefined
  );
}

export async function openURL(url: string): Promise<void> {
  // If URL does not start with 'https://', prepend it
  if (!url.startsWith('https://') && !url.startsWith('http://')) {
    url = 'https://' + url;
  }

  const supported = Linking.canOpenURL(url);

  if (!supported) {
    Alert.alert(`Open this link in your browser: ${url}`);
    return;
  }

  try {
    await WebBrowser.openBrowserAsync(url);
  } catch (e) {
    Alert.alert("Open this url in your browser: " + url)
  }
}

export function openMaps(query: string) {
  if (!query) {
    return
  }
  const isIOS = Platform.OS === 'ios';
  let url;

  if (isIOS) {
    url = `http://maps.apple.com/?q=${query}`;
  } else {
    // try to open Google Maps, if not installed it will default to browser map version
    url = `geo:0,0?q=${query}`;
  }

  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Linking.openURL(url);
    } else {
      console.error("Can't handle URL: " + url);
    }
  });
}


export function showCancelablePopup(
  title: string,
  description: string,
  noText: string,
  yesText: string,
  onYesFunction: () => {}
): void {
  Alert.alert(
    title,
    description,
    [
      {
        text: noText,
      },
      {
        text: yesText,
        onPress: () => {
          onYesFunction();
        },
      },
    ],
    { cancelable: false }
  );
}

export async function responseHandler<CustomType>(
  response: Response,
  message: string,
  doParseData: boolean
): Promise<CustomType> {
  if (response == undefined) {
    throw new NetworkError(message);
  }
  if (!response.ok) {
    if (response.status === 500) {
      let serverResponseMessage =
        message + "\n\nPlease send a bug report :) We'll fix it ASAP!";
      if (backendConfig["env"] === "dev") {
        serverResponseMessage += await response.text()
      }
      throw new ServerError(serverResponseMessage);
    }

    let userResponseMessage = undefined;
    if (response.status === 502) {
      userResponseMessage = "We're upgrading our servers. Come back soon!"
    }
    else {
      userResponseMessage = await response.text();
    }
    throw new UserError("Error " + response.status, userResponseMessage);
  }

  if (!doParseData) {
    return;
  }

  const responseJSON = await response.json();
  return responseJSON as CustomType;
}

export function showBugReportPopup(error: ServerError) {
  Alert.alert(error.name, error.message, [
    {
      text: "Send bug report",
      onPress: () => WebBrowser.openBrowserAsync("https://where2be.app/discord"),
    },
    {
      text: "Not now",
      style: "cancel",
    },
  ]);
}

export function showAppFeedbackPopup() {
  Alert.alert(
    "Send App Feedback",
    "We would love to hear what you think of Where2Be!",
    [
      {
        text: "Send feedback",
        onPress: () => WebBrowser.openBrowserAsync("https://where2be.app/feedback"),
      },
      {
        text: "Not now",
        style: "cancel",
      },
    ]
  );
}

export function discordInvitePopup() {
  Alert.alert(
    "Welcome to Where2Be!",
    "Join our Discord to get the latest updates",
    [
      {
        text: "Join our Discord",
        onPress: () => WebBrowser.openBrowserAsync("https://where2be.app/discord"),
      },
      {
        text: "Not now",
        style: "cancel",
      },
    ]
  );
}

export function truncateNumber(num: number): string {
  if (num === undefined || num === null) {
    return undefined;
  }
  if (num >= 1000000000) {
    return "1B+";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  }
  return num.toString();
}

export async function createEventLink(eventID: string, title: string, description: string) {
  console.log("fee")
  let buo = await branch.createBranchUniversalObject('event', {
    title: title,
    contentDescription: description,
    contentMetadata: {
      customMetadata: {
        event_id: eventID
      }
    }
  })

  console.log("fi")

  let { url } = await buo.generateShortUrl({
    feature: 'sharing',
    channel: 'where2be',
    campaign: 'University event'
  }, {
    $fallback_url: 'https://where2be.app/event/' + eventID,
    $desktop_url: 'https://where2be.app/event/' + eventID,

  })

  console.log(url)

  return url
}

export async function showShareEventLink(eventID: string, title: string, description: string) {

  let buo = await branch.createBranchUniversalObject('event', {
    title: title,
    contentDescription: description,
    contentMetadata: {
      customMetadata: {
        event_id: eventID
      }
    }
  })

  let shareOptions = {
    messageHeader: title,
  }

  let linkProperties = {
    feature: 'sharing',
    channel: 'where2be'
  }

  let controlParams = {
    $desktop_url: 'https://where2be.app/event/' + eventID,
    $deeplink_path: 'eventdetails/' + eventID,
  }

  let { channel, completed, error} = await buo.showShareSheet(shareOptions, linkProperties, controlParams)

  console.log("Channel is " + channel)
  console.log("completed is " + completed)
  console.log("error is " + error)

}