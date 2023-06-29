import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { momentAPI } from "../constants/server";
import { CustomError, NetworkError } from "../constants/error";
import { formatError, responseHandler } from "../helpers/helpers";
import { User } from "../constants";
import { UserResponse } from "../constants/types";
import { userResponseToUser, userResponseToUsers } from "../helpers/converters";

/******************************************************
 * getUser
 *
 * Gets a user by its id
 */
export async function getUser(
  userAccessToken: string,
  userID: string
): Promise<User> {
  const response = await fetch(momentAPI + `/user/user_id/${userID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user_access_token: userAccessToken }),
  })

  const pulledUser: UserResponse = await responseHandler<UserResponse>(response, "Could not fetch user by user id", true);
  const convertedUser: User = userResponseToUser(pulledUser);

  return convertedUser;
}

/******************************************************
 * getUserByUserAccessToken
 *
 * Gets a user by its user access token
 */
export async function getUserByUserAccessToken(
  userAccessToken: string,
  userID: string,
): Promise<User> {
  const response = await fetch(
    momentAPI + `/user/user_access_token/${userAccessToken}`,
    {
      method: "GET",
    }
  )

  const pulledUser: UserResponse = await responseHandler<UserResponse>(response, "Could not get user by user access token", true);
  const convertedUser: User = userResponseToUser(pulledUser);

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
): Promise<void> {
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
  )

  await responseHandler<void>(response, "Could not update user", false);

  return Promise.resolve()
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
  })

  await responseHandler<void>(response, "Could not delete user", false);

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
  })

  const pulledUser: UserResponse = await responseHandler<UserResponse>(response, "Could not fetch event host", true);
  const convertedUser: User = userResponseToUser(pulledUser);

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
  )

  await responseHandler<void>(response, "Could not add join", false);
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
  )

  await responseHandler<void>(response, "Could not remove join", false);
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
  )

  await responseHandler<void>(response, "Could not add shoutout", false);
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
  )

  await responseHandler<void>(response, "Could not remove shoutout", false);
}

export async function searchSchoolUsers(
  userAccessToken: string,
  schoolID: string,
  query: string
): Promise<User[]> {
  console.log("Call to UserService: searchSchoolUsers");

  if (query === "" || !query) {
    return [];
  }

  const response = await fetch(
    momentAPI + `/user/school_id/${schoolID}/search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_access_token: userAccessToken,
        query: query,
      }),
    }
  )

  const pulledUsers: UserResponse[] = await responseHandler<UserResponse[]>(response, "Could not get all school users", true);
  const convertedUsers: User[] = userResponseToUsers(pulledUsers);

  return convertedUsers;
}

export async function followUser(
  userAccessToken: string,
  userID: string,
  toUserID: string
): Promise<void> {

  const response = await fetch(
    momentAPI + `/user/user_id/${userID}/follow/user_id/${toUserID}`,
    {
      method: "UPDATE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_access_token: userAccessToken,
        did_follow: true,
      }),
    }
  )

  await responseHandler<void>(response, "Could follow user", false);
}

export async function unfollowUser(
  userAccessToken: string,
  userID: string,
  toUserID: string
): Promise<void> {
  
  const response = await fetch(
    momentAPI + `/user/user_id/${userID}/follow/user_id/${toUserID}`,
    {
      method: "UPDATE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_access_token: userAccessToken,
        did_follow: false,
      }),
    }
  )

  await responseHandler<void>(response, "Could unfollow user", false);
}

export async function getUserEmail(
  userAccessToken: string,
  userID: string,
): Promise<string> {
  const response = await fetch(
    momentAPI + `/user/user_id/${userID}/get_email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_access_token: userAccessToken,
      }),
    }
  ).catch((error: Error) => {
    throw formatError("Network error", "Could not get email");
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error " + response.status, message);
  }

  const responseJSON: {email: string} = await response.json()

  return responseJSON.email
}