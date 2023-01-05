import { User } from "./UserService";
import momentAPI from "../constants/servercontants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  checkIfStringIsEmail,
  checkIfStringIsAlphanumeric,
} from "../helpers/helpers";

export interface Token {
  UserAccessToken: string;
  Expiration: Date;
}

const USERACCESSTOKEN_STORAGE = "UserAccessToken";
const EXPIRATION_STORAGE = "Expiration";

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
  usercred = usercred.toLowerCase();

  const isEmail: boolean = checkIfStringIsEmail(usercred);

  if (isEmail) {
    const authResp = await fetch(momentAPI + "/authentication/login/email", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: usercred,
        password: password,
      }),
    });

    // Return values here

    // Errors should be Promise.reject

    const createdToken: Token = null;
    return Promise.resolve(createdToken);
  } else {
    if (checkIfStringIsAlphanumeric(usercred)) {
      return Promise.reject("Username is not alphanumeric");
    }
    const authResp = await fetch(momentAPI + "/authentication/login/username", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usercred,
        password: password,
      }),
    });

    // Return values here

    // Errors should be Promise.reject

    const createdToken: Token = null;
    return Promise.resolve(createdToken);
  }
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
  email: string,
  password: string,
  universityID: string
): Promise<Token> {
  if (
    username === "" ||
    username === null ||
    displayName === "" ||
    displayName === null ||
    email === "" ||
    email === null ||
    password === "" ||
    password === null
  ) {
    return Promise.reject("Please enter non-empty values before signing up");
  }
  if (checkIfStringIsAlphanumeric(username)) {
    return Promise.reject("Please enter an alphanumeric username");
  }
  if (checkIfStringIsEmail(email)) {
    return Promise.reject("Please enter a valid email");
  }
  if (universityID === "" || universityID === null) {
    return Promise.reject("Please enter a valid university");
  }
  const authResp = await fetch(momentAPI + "/authentication/signup", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      display_name: displayName,
      email: email,
      password: password,
      university_id: universityID,
    }),
  });

  const createdToken: Token = null;
  return Promise.resolve(createdToken);
}

/******************************************************
 * logout
 *
 * Attempts to logout a user through removing the token
 * from the device by calling deleteToken. This is just a duplicate
 * of deleteToken()
 *
 * Parameters: None
 * Return: A boolean which determines if logging out was successful
 */
export async function logout(): Promise<boolean> {
  deleteToken();
  return Promise.resolve(true);
}

/******************************************************
 * writeToken
 *
 * Attempts to write a token into the storage. It writes the user access token and expiration
 *
 * Parameters: The token we want to write
 * Return: A boolean which determines if writing was successful
 */
async function writeToken(newToken: Token): Promise<boolean> {
  try {
    AsyncStorage.setItem(USERACCESSTOKEN_STORAGE, newToken.UserAccessToken);
    AsyncStorage.setItem(
      EXPIRATION_STORAGE,
      JSON.stringify(newToken.Expiration)
    );
  } catch (error) {
    return Promise.reject(error);
  }

  return Promise.resolve(true);
}

/******************************************************
 * updateToken
 *
 * Attempts to get the token from the storage, increments it by 15 minutes, then writes it again with the same information
 *
 * Parameters: None
 * Return: A boolean which determines if updating was successful
 */
export async function updateToken(): Promise<boolean> {
  var increment = 15; //this is the amount you want to increment the timestamp in minutes
  var newtimestamp = new Date(Date.now() + increment * 60000);
  try {
    AsyncStorage.setItem(EXPIRATION_STORAGE, JSON.stringify(newtimestamp));
  } catch (error) {
    return Promise.reject(error);
  }
  return Promise.resolve(true);
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
  let userAccessToken: string = await AsyncStorage.getItem(
    USERACCESSTOKEN_STORAGE
  );
  let expiration: Date = new Date(
    await AsyncStorage.getItem(EXPIRATION_STORAGE)
  );
  if (userAccessToken == null || expiration == null) {
    return Promise.resolve(null);
  }
  const token = { UserAccessToken: userAccessToken, Expiration: expiration };
  return Promise.resolve(token);
}

/******************************************************
 * deleteToken
 *
 * Attempts to delete the token from the phone
 *
 * Parameters: None
 * Return: True if deletion is successful. False if it is not.
 */
export async function deleteToken(): Promise<boolean> {
  AsyncStorage.removeItem(USERACCESSTOKEN_STORAGE);
  AsyncStorage.removeItem(EXPIRATION_STORAGE);
  return Promise.resolve(true);
}

/******************************************************
 * checkTokenExpirationAndUpdate
 *
 * Checks if a token is there. If not there, return false.
 * If it is there, check if it is expired.
 * If it is not expired, then return true. Token is kept.
 * If it is expired, it checks email and hashed username if it is the same.
 * If so, call updateToken and return true
 * If not, call logout and return false
 *
 * Parameters -
 * none
 * 
 * Return -
 * null if there is no token. a token if there is one
 */
export async function checkTokenExpirationAndUpdate(): Promise<Token> {
  const oldToken = await getToken();
  if (oldToken == null) {
    return Promise.resolve(undefined);
  }
  const min = 15;
  const hours = 0;
  const days = 0;
  const difference = days * 86400000 + hours * 3600000 + min * 60000;
  let currentTime = new Date();
  if (oldToken.Expiration.getTime() >= currentTime.getTime()) {
    //token is not expired, return true
    return Promise.resolve(oldToken)
  }
  const resp = await fetch(
    momentAPI + "/user/user_access_token/" + oldToken.UserAccessToken,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );
  type JSONResponse = {
    data?: {
      userAccessToken: string;
    };
    errors?: Array<{ message: string }>;
  };
  const { data, errors }: JSONResponse = await resp.json();
  if (resp.ok) {
    const userAccessToken = data.userAccessToken;
    if (userAccessToken) {
      updateToken();
      return {
        UserAccessToken: userAccessToken,
        Expiration: new Date(
          oldToken.Expiration.getMilliseconds() + difference
        ),
      };
    } else {
      deleteToken();
      return Promise.reject(new Error("Invalid token"));
    }
  } else {
    const error = new Error(
      errors?.map((e) => e.message).join("\n") ?? "unknown"
    );
    return Promise.reject(error);
  }
}
