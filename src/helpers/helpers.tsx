import { Event } from "../constants";

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
import { Alert } from "react-native";

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
  return /^[A-Za-z,;'"!@%.].*[\s\.]*$/.test(test);
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


  const startDateTimeString: string =
  date.getUTCFullYear() + "-" + ((date.getUTCMonth() + 1) < 10 ? "0" : "") +  (date.getUTCMonth() + 1)
    "T" +
    moment.utc(startTime).format("hh[:]mm") +
    ":00.000Z";

  const endDateTimeString: string =
    moment.utc(date).format("YYYY[-]MM[-]DD") +
    "T" +
    moment.utc(endTime).format("hh[:]mm") +
    ":00.000Z";

    console.log("startDateTime")
    console.log(startDateTimeString)
    console.log("endDateTimeString")
    console.log(endDateTimeString)

  var valuesToMap = {};

  valuesToMap["startDateTime"] = new Date(startDateTimeString);
  valuesToMap["endDateTime"] = new Date(endDateTimeString);
  return valuesToMap;
}

export function checkIfEventIsFormatted(event: Event): boolean {
  return (
    checkIfStringIsReadable(event.Title) &&
    event.Description !== undefined &&
    event.Description !== null &&
    event.Description !== "" &&
    checkIfStringIsReadable(event.Location) &&
    checkIfStringIsReadable(event.Picture) &&
    event.StartDateTime !== null &&
    event.StartDateTime !== undefined &&
    event.EndDateTime !== null &&
    event.EndDateTime !== undefined
  );
}

export async function HELPME() {
  for (var i = 0; i < 9999999; i++) {
    if (i % 10000 === 0) {
      console.log(i);
    }
  }
  return;
}
