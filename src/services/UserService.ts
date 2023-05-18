import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { momentAPI } from "../constants/server";
import { formatError } from "../helpers/helpers";
import { User } from "../constants";
import { UserResponse } from "../constants/types";
import { userResponseToUser, userResponseToUsers } from "../helpers/converters";

/******************************************************
 * getUser
 *
 * Gets a user by its id
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
  const pulledUser: UserResponse = await response.json();
  const convertedUser: User = userResponseToUser(pulledUser)

  return convertedUser;
}

/******************************************************
 * getUserByUserAccessToken
 *
 * Gets a user by its user access token
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

  const pulledUser: UserResponse = await response.json();
  const convertedUser: User = userResponseToUser(pulledUser)

  return convertedUser;
}

/******************************************************
 * updateCurrentUser
 *
 * Updates the current user
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

  const pulledUser: UserResponse = await response.json();
  const convertedUser: User = userResponseToUser(pulledUser)

  return convertedUser;
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
  if (new Date().getSeconds()%3 == 0){
    throw formatError("Error ", "test");
  } else if (new Date().getSeconds()%2 == 0) {
    throw formatError("Network error", "Could not fetch event host");
  }
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

  const pulledUser: UserResponse = await response.json();
  const convertedUser: User = userResponseToUser(pulledUser)

  return convertedUser;
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


export async function searchSchoolUsers(
  userAccessToken: string,
  schoolID: string,
  query: string
): Promise<User[]> {
  console.log("Call to UserService: searchSchoolUsers");

  if(query === "" || !query){
    return []
  }

  if (new Date().getSeconds()%3 == 0){
    throw formatError("Error ", "test");
  } else if (new Date().getSeconds()%2 == 0) {
    console.log("network error");
    throw formatError("Network error", "Could not get all school users");
  }

  const response = await fetch(momentAPI + `/user/school_id/${schoolID}/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_access_token: userAccessToken,
      query: query
    }),
  }).catch((error: Error) => {
    throw formatError("Network error", "Could not get all school users");
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error " + response.status, message);
  }

  const pulledUsers: UserResponse[] = await response.json();
  const convertedUsers: User[] = userResponseToUsers(pulledUsers)

  return convertedUsers;
}