import { getUserByUserAccessToken } from "./UserService";
import momentAPI from "../constants/server";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  checkIfStringIsEmail,
  checkIfStringIsAlphanumeric,
  formatError,
  checkIfStringIsReadable,
} from "../helpers/helpers";
import { Token, User } from "../constants";

const USERACCESSTOKEN_STORAGE = "UserAccessToken";
const EXPIRATION_STORAGE = "Expiration";

const MINUTES_TO_UPDATE_TOKEN = 10;

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
    !checkIfStringIsReadable(usercred) ||
    !checkIfStringIsAlphanumeric(usercred)
  ) {
    throw formatError("Input error", "Please enter a valid username");
  }

  if (password === null || password === "") {
    throw formatError("Input error", "Please enter a valid password");
  }

  // usercred = usercred.toLowerCase();

  if (checkIfStringIsEmail(usercred.toLowerCase())) {
    throw formatError("Input error", "Email login is not supported yet");
  }

  // DO LOGIN HERE

  const response = await fetch(momentAPI+`/authentication/login/username`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: usercred,
      password: password,
    })
  });
  const data = await response.json();

  const createdToken: Token = createTokenFromUserAccessToken(data["user_access_token"]);
  writeToken(createdToken);

  console.log(createdToken)

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
    displayName === null ||
    password === "" ||
    password === null
  ) {
    throw formatError(
      "Input error",
      "Please enter non-empty values before signing up"
    );
  }
  if(
  !checkIfStringIsReadable(displayName)){
    throw formatError("Input error", "Please have a readable display name")
  }
  if (!checkIfStringIsAlphanumeric(username)) {
    throw formatError("Input error", "Please enter an alphanumeric username");
  }
  if (schoolID === "" || schoolID === null) {
    throw formatError("Input error", "Please enter a valid school");
  }

  // DO SIGNUP HERE

  const response = await fetch(momentAPI+`/authentication/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username: username,
      display_name: displayName,
      password: password,
      school_id: schoolID,
    })
  }).catch(() => {
      throw formatError("Fetch Error", "Could not signup");
    });;
  const data = await response.json();

  const createdToken: Token = createTokenFromUserAccessToken(data["user_access_token"]);
  writeToken(createdToken);

  console.log(createdToken)

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
  var expiration = new Date(Date.now() + MINUTES_TO_UPDATE_TOKEN * 60000);
  const token = { UserAccessToken: userAccessToken, Expiration: expiration };
  console.log("createTokenFromUserAccessToken() call.\nUser Access Token:");
  console.log(token.UserAccessToken);
  console.log("Expiration:");
  console.log(token.Expiration.toISOString());
  console.log();
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
  console.log("Expiration:");
  console.log(newToken.Expiration);
  console.log();
  await AsyncStorage.setItem(USERACCESSTOKEN_STORAGE, newToken.UserAccessToken);
  await AsyncStorage.setItem(
    EXPIRATION_STORAGE,
    newToken.Expiration.toISOString()
  );
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
  console.log(await AsyncStorage.getItem(USERACCESSTOKEN_STORAGE));
  console.log("Expiration:");
  console.log(await AsyncStorage.getItem(EXPIRATION_STORAGE));
  const userAccessToken: string = await AsyncStorage.getItem(
    USERACCESSTOKEN_STORAGE
  );
  const expirationString: string = await AsyncStorage.getItem(
    EXPIRATION_STORAGE
  );

  if (userAccessToken == null || expirationString == null) {
    return Promise.resolve(null);
  }
  const token = {
    UserAccessToken: userAccessToken,
    Expiration: new Date(expirationString),
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
  console.log(await AsyncStorage.getItem(USERACCESSTOKEN_STORAGE));
  console.log("Expiration:");
  console.log(await AsyncStorage.getItem(EXPIRATION_STORAGE));
  await AsyncStorage.removeItem(USERACCESSTOKEN_STORAGE);
  await AsyncStorage.removeItem(EXPIRATION_STORAGE);
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
export async function validateTokenExpirationAndUpdate(): Promise<Token> {
  console.log("Entering validateTokenExpirationAndUpdate");
  const currentTime = Date.now();

  const storageToken = await getToken();

  console.log("Storage Token");
  console.log(storageToken);
  if (storageToken == null) {
    // Token was not retrieved. User not logged in. Remove context variables and return resolved promise
    console.log("Storage Token is null");
    return Promise.resolve(null);
  }

  var newToken: Token = null;
  if (storageToken.Expiration.getTime() < currentTime) {
    // Storage token is there, and it is not expired. We update the token
    newToken = createTokenFromUserAccessToken(storageToken.UserAccessToken);
  } else {
    newToken = storageToken;
  }

  const pulledUser: User | Error = await getUserByUserAccessToken(
    storageToken.UserAccessToken
  ).catch((error: Error) => {
    return error;
  });

  if (pulledUser instanceof Error) {
    return Promise.resolve(null);
  }

  writeToken(newToken);
  return Promise.resolve(newToken);
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
export async function getServerStatus(): Promise<void> {
  return Promise.resolve();
  throw formatError("Unable to connect to server", "Please try again later");
}
