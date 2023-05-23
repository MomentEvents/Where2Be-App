import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { momentAPI } from "../constants/server";
import { formatError, responseHandler } from "../helpers/helpers";
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
  })

  const pulledUser: UserResponse = await responseHandler<UserResponse>(response, "Could not fetch user by user id");
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
  )

  const pulledUser: UserResponse = await responseHandler<UserResponse>(response, "Could not get user by user access token");
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
  )

  const pulledUser: UserResponse = await responseHandler<UserResponse>(response, "Could not update user");
  const convertedUser: User = userResponseToUser(pulledUser);

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
  })

  responseHandler<void>(response, "Could not delete user");

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

  const pulledUser: UserResponse = await responseHandler<UserResponse>(response, "Could not fetch event host");
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

  responseHandler<void>(response, "Could not add join");
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

  responseHandler<void>(response, "Could not remove join");
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

  responseHandler<void>(response, "Could not add shoutout");
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

  responseHandler<void>(response, "Could not remove shoutout");
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

  const response = await fetch(momentAPI + `/user/school_id/${schoolID}/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_access_token: userAccessToken,
      query: query
    }),
  })

  const pulledUsers: UserResponse[] = await responseHandler<UserResponse[]>(response, "Could not get all school users");
  const convertedUsers: User[] = userResponseToUsers(pulledUsers)

  return convertedUsers;
}