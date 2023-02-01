import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import momentAPI from "../constants/server";
import { HELPME, formatError } from "../helpers/helpers";
import { User } from "../constants";
import { UserResponse } from "../constants/types";

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
  const response = await fetch(momentAPI + `/user/user_id/${UserID}`, {
    method: "GET",
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
  const response = await fetch(
    momentAPI + `/user/user_access_token/${userAccessToken}`,
    {
      method: "GET",
    }
  ).catch((error: Error) => {
    throw formatError("Error", "Unable to get user by access token");
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

  updatedUser: User
): Promise<void> {
  //updatedUser.Picture is assumed to be base64
  return null;
}

export async function getEventHostByEventId(
  userAccessToken: string,

  eventID: string
): Promise<User> {
  const response = await fetch(momentAPI + `/user/event_id/${eventID}/host`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_access_token: userAccessToken,
    }),
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

export async function addUserJoinEvent(
  userAccessToken: string,
  userID: string,

  eventID: string
): Promise<void> {
  const response = await fetch(
    momentAPI + `/user/user_id/${userID}/event_id/${eventID}/join`,
    {
      method: "UPDATE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_access_token: userAccessToken,
        did_join: true,
      }),
    }
  );
  if (!response.ok) {
    throw formatError("Error: " + response.status, response.statusText);
  }
}

export async function removeUserJoinEvent(
  userAccessToken: string,
  userID: string,

  eventID: string
): Promise<void> {
  const response = await fetch(
    momentAPI + `/user/user_id/${userID}/event_id/${eventID}/join`,
    {
      method: "UPDATE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_access_token: userAccessToken,
        did_join: false,
      }),
    }
  );
  if (!response.ok) {
    throw formatError("Error: " + response.status, response.statusText);
  }
}

export async function addUserShoutoutEvent(
  userAccessToken: string,
  userID: string,

  eventID: string
): Promise<void> {
  const response = await fetch(
    momentAPI + `/user/user_id/${userID}/event_id/${eventID}/shoutout`,
    {
      method: "UPDATE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_access_token: userAccessToken,
        did_shoutout: true,
      }),
    }
  );
  if (!response.ok) {
    throw formatError("Error: " + response.status, response.statusText);
  }
}

export async function removeUserShoutoutEvent(
  userAccessToken: string,
  userID: string,

  eventID: string
): Promise<void> {
  const response = await fetch(
    momentAPI + `/user/user_id/${userID}/event_id/${eventID}/shoutout`,
    {
      method: "UPDATE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_access_token: userAccessToken,
        did_shoutout: false,
      }),
    }
  );
  if (!response.ok) {
    throw formatError("Error: " + response.status, response.statusText);
  }
}

export async function getAllSchoolUsers(
  userAccessToken: string,
  schoolID: string
): Promise<User[]> {
  console.log("Call to UserService: getAllSchoolUsers");
  const response = await fetch(momentAPI + `/user/school_id/${schoolID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_access_token: userAccessToken,
    }),
  });
  if (!response.ok) {
    throw formatError("Error: " + response.status, response.statusText);
  }

  const responseJSON = await response.json();

  console.log(responseJSON);
  const userArray: User[] = [];

  responseJSON.forEach((user: UserResponse) => {
    userArray.push({
      UserID: user.user_id,
      Name: user.display_name,
      Username: user.username,
      Picture: user.picture,
    });
  });

  return userArray;
}
