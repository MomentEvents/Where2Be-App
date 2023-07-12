import { Event } from "../constants";
import { ServerError, CustomError, NetworkError, UserError } from "../constants/error";

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
import { Alert, Linking } from "react-native";

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
  Alert.alert(error.name, error.message);
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

export function openURL(url: string): void {
  const supported = Linking.canOpenURL(url);

  if (supported) {
    // Opening the link with some app, if the URL scheme is "http" the web link should be opened
    // by some browser in the mobile
    Linking.openURL(url);
  } else {
    Alert.alert(`Unable to open link: ${url}`);
  }
}

export function showCancelablePopup(
  title: string,
  description: string,
  onYesFunction: () => {},
): void {
  Alert.alert(
    "Log out",
    "Are you sure you want to log out?",
    [
      {
        text: "Cancel",
      },
      {
        text: "Yes",
        onPress: () => {
          onYesFunction()
        },
      },
    ],
    { cancelable: false }
  );
}

export async function responseHandler<CustomType>(response: Response, message: string, doParseData: boolean): Promise<CustomType> {
  if (response == undefined){
    throw new NetworkError(message);
  }
  if (!response.ok) {
    let responseMessage = await response.text();
    if(response.status === 500){
      responseMessage = message + "\n\nPlease send a bug report :) We'll fix it ASAP!"
      throw new ServerError(responseMessage)
    }
    throw new UserError("Error " + response.status, responseMessage);
  }

  if(!doParseData){
    return
  }

  const responseJSON = await response.json();
  return responseJSON as CustomType;
}

export function showBugReportPopup(error: ServerError){
  Alert.alert(
    error.name,
    error.message,
    [
      {
        text: 'Send bug report',
        onPress: () => Linking.openURL('https://where2be.app/discord'),
      },
      {
        text: 'Not now',
        style: 'cancel',
      },
    ],
  );
}

export function showAppFeedbackPopup(){
  Alert.alert(
    'Send App Feedback',
    'We would love to hear what you think of Where2Be!',
    [
      {
        text: 'Send feedback',
        onPress: () => Linking.openURL('https://where2be.app/feedback'),
      },
      {
        text: 'Not now',
        style: 'cancel',
      },
    ],
  );
}

export function discordInvitePopup(){
  Alert.alert(
    'Welcome to Where2Be!',
    'Join our Discord to get the latest updates',
    [
      {
        text: 'Join our Discord',
        onPress: () => Linking.openURL('https://where2be.app/discord'),
      },
      {
        text: 'Not now',
        style: 'cancel',
      },
    ],
  );
}