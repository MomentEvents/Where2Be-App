import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { momentAPI } from "../constants/server";
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
  }).catch((error: Error) => {
    throw formatError("Network error", "Could not fetch user by user id");
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error " + response.status, message);
  }
  const data: UserResponse = await response.json();

  const pulledUser: User = {
    UserID: data.user_id,
    DisplayName: data.display_name,
    Username: data.username,
    Picture: data.picture,
  };

  return Promise.resolve(pulledUser);
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
    throw formatError(
      "Network error",
      "Could not get user by user access token"
    );
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error " + response.status, message);
  }

  const responseJSON = await response.json();

  const pulledUser: User = {
    UserID: responseJSON["user_id"],
    DisplayName: responseJSON["display_name"],
    Username: responseJSON["username"],
    Picture: responseJSON["picture"],
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
): Promise<User> {
  //updatedUser.Picture is assumed to be base64
  const formData: FormData = new FormData();
  formData.append("user_access_token", userAccessToken);
  formData.append("display_name", updatedUser.DisplayName);
  formData.append("username", updatedUser.Username);
  formData.append("picture", updatedUser.Picture);

  const response = await fetch(
    momentAPI + `/user/user_id/${updatedUser.UserID}`,
    {
      method: "UPDATE",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    }
  ).catch((error: Error) => {
    throw formatError("Network error", "Could not update user");
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error " + response.status, message);
  }

  const responseJSON: UserResponse = await response.json();

  const pulledUser: User = {
    UserID: responseJSON.user_id,
    DisplayName: responseJSON.display_name,
    Username: responseJSON.username,
    Picture: responseJSON.picture,
  };

  return Promise.resolve(pulledUser);
}

export async function deleteUser(
  userAccessToken: string,

  userID: string
): Promise<void> {
  const response = await fetch(momentAPI + `/user/user_id/${userID}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_access_token: userAccessToken,
    }),
  }).catch((error: Error) => {
    throw formatError("Network error", "Could not delete user");
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error " + response.status, message);
  }

  return Promise.resolve();
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
  }).catch((error: Error) => {
    throw formatError("Network error", "Could not fetch event host");
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error " + response.status, message);
  }

  const responseJSON = await response.json();

  const pulledUser: User = {
    UserID: responseJSON["user_id"],
    DisplayName: responseJSON["display_name"],
    Username: responseJSON["username"],
    Picture: responseJSON["picture"],
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
  ).catch((error: Error) => {
    throw formatError("Network error", "Could not add join");
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error " + response.status, message);
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
  ).catch((error: Error) => {
    throw formatError("Network error", "Could not remove join");
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error " + response.status, message);
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
  ).catch((error: Error) => {
    throw formatError("Network error", "Could not add shoutout");
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error " + response.status, message);
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
  ).catch((error: Error) => {
    throw formatError("Network error", "Could not remove shoutout");
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error " + response.status, message);
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
  }).catch((error: Error) => {
    throw formatError("Network error", "Could not get all school users");
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error " + response.status, message);
  }

  const responseJSON = await response.json();

  console.log(responseJSON);
  const userArray: User[] = [];

  responseJSON.forEach((user: UserResponse) => {
    userArray.push({
      UserID: user.user_id,
      DisplayName: user.display_name,
      Username: user.username,
      Picture: user.picture,
    });
  });

  return userArray;
}
