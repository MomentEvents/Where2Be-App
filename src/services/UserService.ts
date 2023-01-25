import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import momentAPI from "../constants/server";
import { HELPME, formatError } from "../helpers/helpers";
import { User } from "../constants";

/******************************************************
 * getUser
 *
 * Gets a user by its Id
 *
 * Parameters:
 *          Id: ID to get user
 * Return: The user object (if found. Null if not found.)
 */
export async function getUser(UserID: string): Promise<User> {
  const response = await fetch(momentAPI+`/api_ver_1.0.0/user/user_id/${UserID}`, {
    method: 'GET'
  });
  const data = await response.json();

  const pulledUser: User = {
    UserID: data["UserID"],
    Name: data["Name"],
    Username: data["Username"],
    Picture: data["Picture"],
  };

  return pulledUser;
}

/******************************************************
 * getUserByUserAccessToken
 *
 * Gets a user by its access token
 *
 * Parameters:
 *          userAccessToken
 * Return: The user object (if found. Null if not found.)
 */
export async function getUserByUserAccessToken(
  userAccessToken: string
): Promise<User> {
  const response = await fetch(momentAPI+`/api_ver_1.0.0/user/user_access_token/${userAccessToken}`, {
    method: 'GET'
  });
  const data = await response.json();

  const pulledUser: User = {
    UserID: data["user_id"],
    Name: data["display_name"],
    Username: data["username"],
    Picture: data["picture"],
  };
  return Promise.resolve(pulledUser);
}

/******************************************************
 * updateCurrentUser
 *
 * Updates the current user. All non-null values are updated
 *
 * Parameters -
 * username: the username to update
 * displayName: the display name to update
 * email: the email to update
 * password: the password to update
 * picture: the picture to update
 *
 * Return -
 * a promise if updating the user was successful or not
 */
export async function updateUser(
  userAccessToken: string,

  updatedUser: User,
): Promise<void> {
  return null;
}

export async function getEventHostByEventId(
  userAccessToken: string,

  eventID: string
): Promise<User> {

  const response = await fetch(momentAPI+`/api_ver_1.0.0/user/event_id/${eventID}/host`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_access_token: userAccessToken
    })
  });
  const data = await response.json();

  const pulledUser: User = {
    UserID: data["user_id"],
    Name: data["display_name"],
    Username: data["username"],
    Picture: data["picture"],
  };

  return pulledUser;
}

export async function getUserJoinEvent(
  userAccessToken: string,
  userID: string,

  eventID: string
): Promise<boolean> {
  const response = await fetch(momentAPI+`/api_ver_1.0.0/user/user_id/${userID}/event_id/${eventID}/join`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_access_token: userAccessToken
    })
  });
  const data = await response.json();

  console.log(data["did_join"])

  return data["did_join"];
}

export async function addUserJoinEvent(
  userAccessToken: string,
  userID: string,

  eventID: string
): Promise<void> {

  const response = await fetch(momentAPI+`/api_ver_1.0.0/user/user_id/${userID}/event_id/${eventID}/join`, {
    method: 'UPDATE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_access_token: userAccessToken,
      did_join: true
    })
  });
  const data = await response.json();
}

export async function removeUserJoinEvent(
  userAccessToken: string,
  userID: string,

  eventID: string
): Promise<void> {
  
  const response = await fetch(momentAPI+`/api_ver_1.0.0/user/user_id/${userID}/event_id/${eventID}/join`, {
    method: 'UPDATE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_access_token: userAccessToken,
      did_join: false
    })
  });
  const data = await response.json();
}

export async function getUserShoutoutEvent(
  userAccessToken: string,
  userID: string,

  eventID: string
): Promise<boolean> {

  const response = await fetch(momentAPI+`/api_ver_1.0.0/user/user_id/${userID}/event_id/${eventID}/shoutout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_access_token: userAccessToken
    })
  });
  const data = await response.json();

  return data["did_shoutout"];
}

export async function addUserShoutoutEvent(
  userAccessToken: string,
  userID: string,

  eventID: string
): Promise<void> {
  
  const response = await fetch(momentAPI+`/api_ver_1.0.0/user/user_id/${userID}/event_id/${eventID}/shoutout`, {
    method: 'UPDATE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_access_token: userAccessToken,
      did_shoutout: true
    })
  });
  const data = await response.json();
}

export async function removeUserShoutoutEvent(
  userAccessToken: string,
  userID: string,

  eventID: string
): Promise<void> {
  
  const response = await fetch(momentAPI+`/api_ver_1.0.0/user/user_id/${userID}/event_id/${eventID}/shoutout`, {
    method: 'UPDATE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_access_token: userAccessToken,
      did_shoutout: false
    })
  });
  const data = await response.json();
}
