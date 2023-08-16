import { momentAPI, momentAPIVersionless } from "../constants/server";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  checkIfStringIsEmail,
  checkIfStringIsAlphanumeric,
  formatError,
  checkIfStringIsReadable,
  responseHandler,
} from "../helpers/helpers";
import { School, Token, User } from "../constants";
import { SchoolResponse } from "../constants/types";
import { schoolResponseToSchool } from "../helpers/converters";

const TOKEN_STORAGE = "UserAccessToken";
const FIRST_TIME_INSTALL = {
  KEY: "FIRST_TIME_INSTALL_KEY",
  YES: "FIRST_TIME_INSTALL_YES",
  NO: "FIRST_TIME_INSTALL_NO",
};
const FIRST_TIME_LOGIN = {
  KEY: "FIRST_TIME_LOGIN_KEY",
  YES: "FIRST_TIME_LOGIN_YES",
  NO: "FIRST_TIME_LOGIN_NO",
};

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
  if (!usercred || usercred === "") {
    throw formatError(
      "Input error",
      "Please enter a valid username or password"
    );
  }

  if (!password || password === "") {
    throw formatError("Input error", "Please enter a valid password");
  }

  const response = await fetch(momentAPI + `/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      usercred: usercred,
      password: password,
    }),
  }).catch(() => {
    return undefined;
  });

  const data = await responseHandler<{
    user_id: string;
    user_access_token: string;
  }>(response, "Could not login", true);

  if (!data["user_id"] || !data["user_access_token"]) {
    throw formatError(
      "Error",
      "User access token or UserID is undefined. Please report this to support"
    );
  }
  const createdToken: Token = createToken(
    data["user_id"],
    data["user_access_token"]
  );
  console.log("ABOUT TO WRITE TOKEN");
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

export type NeedVerification = {
  need_verify: boolean
}

export async function signup(
  username: string,
  displayName: string,
  password: string,
  email: string
): Promise<Token | NeedVerification> {
  if (!checkIfStringIsReadable(displayName)) {
    throw formatError("Input error", "Please enter a readable display name");
  }

  if (displayName === "" || !displayName || password === "" || !password) {
    throw formatError(
      "Input error",
      "Please enter non-empty values before signing up"
    );
  }

  if (!checkIfStringIsEmail(email) || email === "") {
    throw formatError("Input error", "Please enter a valid email");
  }

  const response = await fetch(momentAPI + `/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      display_name: displayName,
      password: password,
      email: email,
    }),
  }).catch(() => {
    return undefined;
  });

  const data = await responseHandler<{
    user_id: string;
    user_access_token: string;
  } | NeedVerification>(response, "Could not signup", true);

  if(data["need_verify"]){
    return {
      need_verify: true
    }
  }

  if (!data["user_id"] || !data["user_access_token"]) {
    throw formatError(
      "Error",
      "User access token or UserID is undefined. Please report this to support"
    );
  }
  const createdToken: Token = createToken(
    data["user_id"],
    data["user_access_token"]
  );
  console.log("ABOUT TO WRITE TOKEN");
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
  const token = await getToken();
  if (token !== null && token !== undefined) {
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
function createToken(userID: string, userAccessToken: string): Token {
  const token: Token = { UserID: userID, UserAccessToken: userAccessToken };
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
  console.log("writeToken() call.\nToken:");
  console.log(JSON.stringify(newToken));
  console.log();
  await SecureStore.setItemAsync(TOKEN_STORAGE, JSON.stringify(newToken));
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
  console.log(await SecureStore.getItemAsync(TOKEN_STORAGE));
  const token: Token = JSON.parse(
    await SecureStore.getItemAsync(TOKEN_STORAGE)
  );

  if (!token) {
    return Promise.resolve(null);
  }

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
  console.log(JSON.stringify(await SecureStore.getItemAsync(TOKEN_STORAGE)));
  await SecureStore.deleteItemAsync(TOKEN_STORAGE);
}

export async function getStoredToken(): Promise<Token> {
  const storageToken: Token = await getToken();

  if (!storageToken) {
    return Promise.resolve(null);
  }

  if (await checkIfFirstInstall()) {
    await deleteToken();
    return Promise.resolve(null);
  }

  return Promise.resolve(storageToken);
}

export async function checkIfFirstInstall(): Promise<boolean> {
  const status = await AsyncStorage.getItem(FIRST_TIME_INSTALL.KEY);

  console.log("CHECKIFFIRSTINSTALL call. " + status);
  if (
    status == null ||
    status == undefined ||
    status === FIRST_TIME_INSTALL.YES
  ) {
    return true;
  }

  return false;
}

export async function updateFirstInstall(status: boolean): Promise<void> {
  if (status) {
    await AsyncStorage.setItem(FIRST_TIME_INSTALL.KEY, FIRST_TIME_INSTALL.YES);
  } else {
    await AsyncStorage.setItem(FIRST_TIME_INSTALL.KEY, FIRST_TIME_INSTALL.NO);
  }
}

export async function checkIfFirstLogin(): Promise<boolean> {
  const status = await AsyncStorage.getItem(FIRST_TIME_LOGIN.KEY);

  if (status == null || status == undefined || status == FIRST_TIME_LOGIN.YES) {
    return true;
  }

  return false;
}

export async function updateFirstLogin(status: boolean): Promise<void> {
  if (status) {
    await AsyncStorage.setItem(FIRST_TIME_LOGIN.KEY, FIRST_TIME_LOGIN.YES);
  } else {
    await AsyncStorage.setItem(FIRST_TIME_LOGIN.KEY, FIRST_TIME_LOGIN.NO);
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
  }).catch(() => {
    return undefined;
  });

  await responseHandler<void>(response, "Could not get server status", false);
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
  }).catch(() => {
    return undefined;
  });

  const data = await responseHandler<{ is_admin: boolean }>(
    response,
    "Could not check if user is admin",
    true
  );

  return Promise.resolve(data.is_admin);
}

export async function resetPassword(email: string): Promise<void> {
  const response = await fetch(momentAPI + `/auth/reset_password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
    }),
  }).catch(() => {
    return undefined;
  });

  await responseHandler<void>(
    response,
    "Could not send password reset email",
    false
  );
}

export async function checkEmailAvailability(email: string): Promise<School> {
  const response = await fetch(momentAPI + `/auth/check_email_availability`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
    }),
  }).catch(() => {
    return undefined;
  });

  const schoolResponse = await responseHandler<SchoolResponse>(
    response,
    "Could not check email availability",
    true
  );

  const school = schoolResponseToSchool(schoolResponse)

  console.log(JSON.stringify(school))
  return school
}

export async function checkUsernameAvailability(
  username: string
): Promise<void> {
  const response = await fetch(
    momentAPI + `/auth/check_username_availability`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
      }),
    }
  ).catch(() => {
    return undefined;
  });

  await responseHandler<void>(
    response,
    "Could not check username availability",
    false
  );
}

// This only removes the event caches. User Access Tokens are stored in SecureStore, which won't be removed with this function

// Putting a token in rewrites the data
export const clearAllCachedData = async () => {
  await AsyncStorage.clear();
  await updateFirstInstall(false)
};