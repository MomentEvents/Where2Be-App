import { getUserByUserAccessToken } from "./UserService";
import { momentAPI, momentAPIVersionless } from "../constants/server";
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  checkIfStringIsEmail,
  checkIfStringIsAlphanumeric,
  formatError,
  checkIfStringIsReadable,
} from "../helpers/helpers";
import { Token, User } from "../constants";

const USERACCESSTOKEN_STORAGE = "UserAccessToken";
const FIRST_TIME_INSTALL = {
  KEY: "FIRST_TIME_INSTALL_KEY",
  YES: "FIRST_TIME_INSTALL_YES",
  NO: "FIRST_TIME_INSTALL_NO"
}
const FIRST_TIME_LOGIN = {
  KEY: "FIRST_TIME_LOGIN_KEY",
  YES: "FIRST_TIME_LOGIN_YES",
  NO: "FIRST_TIME_LOGIN_NO"
}

/******************************************************
 * login
 *
 * Attempts to login a user through giving a usercredential
 * and password. credType can be either "email" or "username",
 * which is checked by checking if usercred is formatted by an
 * email or a username
 *
 * Parameters -
 * usercred: either an email or a username string
 * Return -
 * a token which contains the UserAccessToken and valid expiration
 */
export async function login(
  usercred: string,
  password: string
): Promise<Token> {
  if (
    !usercred || usercred === ""
  ) {
    throw formatError("Input error", "Please enter a valid username");
  }

  if (!password || password === "") {
    throw formatError("Input error", "Please enter a valid password");
  }

  // usercred = usercred.toLowerCase();

  if (checkIfStringIsEmail(usercred.toLowerCase())) {
    throw formatError("Input error", "Email login is not supported yet");
  }

  // DO LOGIN HERE

  const response = await fetch(momentAPI + `/auth/login/username`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: usercred,
      password: password,
    }),
  }).catch((error: Error) => {
    throw formatError("Network error", "Could not login");
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error " + response.status, message);
  }
  const data = await response.json();

  const createdToken: Token = createTokenFromUserAccessToken(
    data["user_access_token"]
  );
  writeToken(createdToken);

  console.log(createdToken);

  return Promise.resolve(createdToken);
}

/******************************************************
 * signup
 *
 * Attempts to signup a user through giving a username, displayName,
 * email, password, and universityID. Returns a valid token if a valid
 * response occurs or rejects the promise and gives an error. The function
 * already has validation checks, so no need to check if valid input is occurring
 *
 * Parameters -
 * username: the username of the user
 * displayName: the display name of the user
 * email: the email of the user
 * password: the password of the user
 * universityID: the university id of the user
 *
 * Return -
 * a token which contains the UserAccessToken and valid expiration
 */
export async function signup(
  username: string,
  displayName: string,
  password: string,
  schoolID: string
): Promise<Token> {
  if (!checkIfStringIsReadable(displayName)) {
    throw formatError("Input error", "Please enter a readable display name");
  }
  if (
    displayName === "" ||
    !displayName ||
    password === "" ||
    !password
  ) {
    throw formatError(
      "Input error",
      "Please enter non-empty values before signing up"
    );
  }
  // if (!checkIfStringIsReadable(displayName)) {
  //   throw formatError("Input error", "Please have a readable display name");
  // }
  // if (!checkIfStringIsAlphanumeric(username)) {
  //   throw formatError("Input error", "Please enter an alphanumeric username");
  // }
  if (schoolID === "" || !schoolID) {
    throw formatError("Input error", "Please enter a valid school");
  }

  // DO SIGNUP HERE

  const response = await fetch(momentAPI + `/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      display_name: displayName,
      password: password,
      school_id: schoolID,
    }),
  }).catch((error: Error) => {
    throw formatError("Network error", "Could not signup");
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error " + response.status, message);
  }

  const data = await response.json();

  const createdToken: Token = createTokenFromUserAccessToken(
    data["user_access_token"]
  );
  writeToken(createdToken);

  console.log(createdToken);

  return Promise.resolve(createdToken);
}

/******************************************************
 * logout
 *
 * Attempts to logout a user through removing the token
 * from the device by calling deleteToken.
 *
 * Parameters -
 * None
 *
 * Return -
 * None
 */
export async function logout(): Promise<void> {
  if ((await getToken()) !== null) {
    deleteToken();
  }
  return Promise.resolve();
}

/******************************************************
 * createTokenFromUserAccessToken
 *
 * Creates and formats a userAccessToken
 *
 * Parameters -
 * userAccessToken: The user access token to create a token
 *
 * Return -
 * The token to use
 */
function createTokenFromUserAccessToken(userAccessToken: string): Token {
  const token: Token  = { UserAccessToken: userAccessToken };
  return token;
}

/******************************************************
 * writeToken
 *
 * Attempts to write a token into the storage. It writes the user access token and expiration
 *
 * Parameters -
 * newToken: The token we want to write
 *
 * Return -
 * none
 */
async function writeToken(newToken: Token): Promise<void> {
  console.log("writeToken() call.\nUser Access Token:");
  console.log(newToken.UserAccessToken);
  console.log();
  await SecureStore.setItemAsync(USERACCESSTOKEN_STORAGE, newToken.UserAccessToken);
}

/******************************************************
 * getToken
 *
 * Attempts to get a token from the storage
 *
 * Parameters: None
 * Return: A Token object. Returns null if not found.
 */
async function getToken(): Promise<Token> {
  console.log("getToken() call.\nUser Access Token:");
  console.log(await SecureStore.getItemAsync(USERACCESSTOKEN_STORAGE));
  const userAccessToken: string = await SecureStore.getItemAsync(
    USERACCESSTOKEN_STORAGE
  );

  if (userAccessToken == null) {
    return Promise.resolve(null);
  }
  const token: Token = {
    UserAccessToken: userAccessToken
  };
  return Promise.resolve(token);
}

/******************************************************
 * deleteToken
 *
 * Attempts to delete the token from the phone
 *
 * Parameters: None
 * Return: None
 */
export async function deleteToken(): Promise<void> {
  console.log("deleteToken() call.\nUser Access Token:");
  console.log(await SecureStore.getItemAsync(USERACCESSTOKEN_STORAGE));
  await SecureStore.deleteItemAsync(USERACCESSTOKEN_STORAGE);
}

/******************************************************
 * validateTokenExpirationAndUpdate
 *
 * Validates the token first in the Context, then in the
 * storage. At the end of the function call, UserContext
 * will be filled and the storage will be update
 *
 * Parameters -
 * none
 *
 * Return -
 * none
 */
export async function getTokenAndValidate(): Promise<Token> {

  const storageToken: Token = await getToken();

  if (!storageToken) {
    return Promise.resolve(null);
  }

  if(checkIfFirstInstall()){
    await deleteToken();
    return Promise.resolve(null)
  }

  return Promise.resolve(storageToken);
}

export async function checkIfFirstInstall(): Promise<boolean> {
  const status = await AsyncStorage.getItem(FIRST_TIME_INSTALL.KEY)

  if(status == null || status == undefined || status == FIRST_TIME_INSTALL.NO){
    return false;
  }

  return true
}

export async function updateFirstInstall(status: boolean): Promise<void> {
  if(status){
    await AsyncStorage.setItem(FIRST_TIME_INSTALL.KEY, FIRST_TIME_INSTALL.YES)
  }
  else {
    await AsyncStorage.setItem(FIRST_TIME_INSTALL.KEY, FIRST_TIME_INSTALL.NO)
  }
}

export async function checkIfFirstLogin(): Promise<boolean> {
  const status = await AsyncStorage.getItem(FIRST_TIME_LOGIN.KEY)

  if(status == null || status == undefined || status == FIRST_TIME_LOGIN.NO){
    return false;
  }

  return true
}

export async function updateFirstLogin(status: boolean): Promise<void> {
  if(status){
    await AsyncStorage.setItem(FIRST_TIME_LOGIN.KEY, FIRST_TIME_LOGIN.YES)
  }
  else {
    await AsyncStorage.setItem(FIRST_TIME_LOGIN.KEY, FIRST_TIME_LOGIN.NO)
  }
}

/******************************************************
 * getServerStatus
 *
 * This function gets the server status. Resolves if
 * server is running. False if it is not
 *
 * Parameters -
 * none
 *
 * Return -
 * none
 */
export async function getServerStatus(version: string): Promise<void> {
  console.log("Version is " + version);
  const response = await fetch(momentAPIVersionless + "/app_compatability", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      app_version: version,
    }),
  }).catch((error: Error) => {
    throw formatError("Unable to connect to server", "Please try again later");
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error " + response.status, message);
  }

  return Promise.resolve();
}

export async function checkIfUserAccessTokenIsAdmin(
  userAccessToken: string
): Promise<boolean> {
  const response = await fetch(momentAPI + `/auth/privileged_admin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_access_token: userAccessToken,
    }),
  }).catch((error: Error) => {
    throw formatError("Network error", "Unable to check if user is admin");
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error " + response.status, message);
  }

  const responseJSON = await response.json();

  return Promise.resolve(responseJSON.is_admin);
}

export async function changePassword(
  userAccessToken: string,
  oldPassword: string,
  newPassword: string
): Promise<void> {
  const response = await fetch(momentAPI + `/auth/change_password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_access_token: userAccessToken,
      old_password: oldPassword,
      new_password: newPassword
    }),
  }).catch((error: Error) => {
    throw formatError("Network error", "Unable to change password");
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error " + response.status, message);
  }

  return Promise.resolve()
}