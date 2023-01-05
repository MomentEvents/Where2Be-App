import { User } from "./UserService";
import momentAPI from "../constants/servercontants";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Token {
  UserAccessToken: string;
  Expiration: Date;
}

/******************************************************
 * login
 *
 * Attempts to login a user through giving a username, . It looks
 * up the user based on the email or username and checks hashed password. Once it validates the user, it
 * writes the token.
 *
 * Parameters:
 *          checkUser: The user in which we will check if it exists and does have the same hash
 * Return: The user that is found in the database based on the credentials given
 */
export async function login(
  usercred: string,
  password: string,
  credType: string
): Promise<Token> {
  var resp;
  if (credType == "Username") {
    resp = await fetch(momentAPI + "/authentication/username_login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usercred,
        password: password,
      }),
    });
  } else if (credType == "Email") {
    resp = await fetch(momentAPI + "/authentication/email_login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: usercred,
        password: password,
      }),
    });
  } else {
    return Promise.reject(new Error(`No username or email included`));
  }

  type JSONResponse = {
    data?: {
      userAccessToken: string;
    };
    errors?: Array<{ message: string }>;
  };

  const { data, errors }: JSONResponse = await resp.json();
  if (resp.ok) {
    const userAccessToken: string = data.userAccessToken;
    if (userAccessToken) {
      var currentTime = new Date();
      writeToken({ UserAccessToken: userAccessToken, Expiration: currentTime });
      return userAccessToken;
    } else {
      return Promise.reject(
        new Error(`Invalid user credentials for user "${usercred}"`)
      );
    }
  } else {
    const error = new Error(
      errors?.map((e) => e.message).join("\n") ?? "unknown"
    );
    return Promise.reject(error);
  }
}

/******************************************************
 * signup
 *
 * Attempts to signup a user through creating an inputted User object into DB by calling UserService createUser. Once it creates the user,
 * it writes the token through calling writeToken.
 *
 * Parameters:
 *          checkUser: The user in which we will sign up
 * Return: A user access token.
 */
export async function signup(
  checkUser: User,
  password: string
): Promise<string> {
  if (
    checkUser.UserID == null ||
    checkUser.Email == null ||
    checkUser.Name == null
  ) {
    return Promise.reject(
      new Error(`User Object must include name, username, and email`)
    );
  }
  const resp = await fetch(momentAPI + "/create_user", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: checkUser,
      password: password,
    }),
  });

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
      var currentTime = new Date();
      writeToken({ UserAccessToken: userAccessToken, Expiration: currentTime });
      return userAccessToken;
    } else {
      return Promise.reject(
        new Error(`Failed to create a new user "${checkUser.UserID}"`)
      );
    }
  } else {
    const error = new Error(
      errors?.map((e) => e.message).join("\n") ?? "unknown"
    );
    return Promise.reject(error);
  }
}

/******************************************************
 * logout
 *
 * Attempts to logout a user through removing the token
 * from the device by calling deleteToken.
 *
 * Parameters: None
 * Return: A boolean which determines if logging out was successful
 */
export async function logout(): Promise<boolean> {
  deleteToken();
  return true;
}

/******************************************************
 * writeToken
 *
 * Attempts to write a token into the storage. It writes the email and hashed password with expiration date (15 minutes after writing)
 *
 * Parameters: The token we want to write
 * Return: A boolean which determines if writing was successful
 */
async function writeToken(newToken: Token): Promise<boolean> {
  AsyncStorage.setItem("UserAccessToken", newToken.UserAccessToken);
  AsyncStorage.setItem("Expiration", JSON.stringify(newToken.Expiration));
  return true;
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
  AsyncStorage.setItem("Expiration", JSON.stringify(newtimestamp));
  return null;
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
  let userAccessToken: string = await AsyncStorage.getItem("UserAccessToken");
  let expiration: Date = new Date(await AsyncStorage.getItem("Expiration"));
  if (userAccessToken == null || expiration == null) {
    return null;
  }
  const token = { UserAccessToken: userAccessToken, Expiration: expiration };
  return token;
}

/******************************************************
 * deleteToken
 *
 * Attempts to delete the token from the phone
 *
 * Parameters: None
 * Return: True if deletion is successful. False if it is not.
 */
async function deleteToken(): Promise<boolean> {
  AsyncStorage.removeItem("UserAccessToken");
  AsyncStorage.removeItem("Expiration");
  return true;
}

/******************************************************
 * validateToken
 *
 * Checks if a token is there. If not there, return false.
 * If it is there, check if it is expired.
 * If it is not expired, then return true. Token is kept.
 * If it is expired, it checks email and hashed username if it is the same.
 * If so, call updateToken and return true
 * If not, call logout and return false
 *
 * Parameters: None
 * Return: True if we have a token after the function call. False if we do not.
 */
export async function validateToken(): Promise<Token> {
  const oldToken = await getToken();
  if (oldToken == null) {
    return Promise.reject(new Error("Failed to get token"));
  }
    const min = 15;
    const hours = 0;
    const days = 0;
  const difference = days * 86400000 + hours * 3600000 + min * 60000;
  let currentTime = new Date();
  if (oldToken.Expiration.getTime() >= currentTime.getTime()) {
    //token is not expired, return true
    return oldToken;
  }
  const resp = await fetch(momentAPI + "/user_test", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userAccessToken: oldToken.UserAccessToken,
    }),
  });
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
        Expiration: new Date(oldToken.Expiration.getMilliseconds() + difference),
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
