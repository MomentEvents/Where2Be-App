import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { momentAPI } from "../constants/server";
import { CustomError, NetworkError } from "../constants/error";
import { formatError, responseHandler } from "../helpers/helpers";
import { User } from "../constants";
import { UserResponse, UserPrefilledForm, UserPrefilledFormResponse } from "../constants/types";
import { prefilledFormResponseToPrefilledForm, userResponseToUser, userResponseToUsers } from "../helpers/converters";

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
  }).catch(() => {
    return undefined
  })

  const pulledUser: UserResponse = await responseHandler<UserResponse>(response, "Could not get user", true);
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
  ).catch(() => {
    return undefined
  })

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
  ).catch(() => {
    return undefined
  })

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
  }).catch(() => {
    return undefined
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
  }).catch(() => {
    return undefined
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
  ).catch(() => {
    return undefined
  })

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
  ).catch(() => {
    return undefined
  })

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
  ).catch(() => {
    return undefined
  })

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
  ).catch(() => {
    return undefined
  })

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
  ).catch(() => {
    return undefined
  })

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
  ).catch(() => {
    return undefined
  })

  await responseHandler<void>(response, "Could not follow user", false);
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
  ).catch(() => {
    return undefined
  })

  await responseHandler<void>(response, "Could not unfollow user", false);
}

export async function setNotInterestedInEvent(
  userAccessToken: string,
  userID: string,
  eventID: string,
): Promise<void> {
  
  const response = await fetch(
    momentAPI + `/user/user_id/${userID}/event_id/${eventID}/not_interested`,
    {
      method: "UPDATE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_access_token: userAccessToken,
        did_not_interested: true,
      }),
    }
  ).catch(() => {
    return undefined
  })

  await responseHandler<void>(response, "Could not set uninterested in event", false);
}

export async function undoNotInterestedInEvent(
  userAccessToken: string,
  userID: string,
  eventID: string,
): Promise<void> {
  
  const response = await fetch(
    momentAPI + `/user/user_id/${userID}/event_id/${eventID}/not_interested`,
    {
      method: "UPDATE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_access_token: userAccessToken,
        did_not_interested: false,
      }),
    }
  ).catch(() => {
    return undefined
  })

  await responseHandler<void>(response, "Could not set undo not interested in event", false);
}

// THIS IS TO BE IMPLEMENTED LATER WHEN WE HAVE THE DATABASE CAPACITY TO STORE IF A USER HAS VIEWED AN EVENT

// export async function setViewedEvents(
//   userAccessToken: string,
//   userID: string,
//   eventIDs: string[],
// ): Promise<void> {
  
//   const response = await fetch(
//     momentAPI + `/user/user_id/${userID}/set_viewed_events`,
//     {
//       method: "UPDATE",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         user_access_token: userAccessToken,
//         event_ids: eventIDs
//       }),
//     }
//   ).catch(() => {
//     return undefined
//   })

//   await responseHandler<void>(response, "Could not set viewed event", false);
// }

export async function getUserEmail(
  userAccessToken: string,
  userID: string,
): Promise<{email: string, email_verified: boolean}> {
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
  ).catch(() => {
    return undefined
  })

  const responseJSON: {email: string, email_verified: boolean} = await responseHandler<{email: string, email_verified: boolean}>(response, "Could not get user email", true);

  return responseJSON
}

export async function getUserFollowers(
  userAccessToken: string,
  userID: string,
  cursorUserID?: string,
): Promise<User[]> {
  const response = await fetch(
    momentAPI + `/user/user_id/${userID}/followers`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_access_token: userAccessToken,
        user_id_cursor: cursorUserID,
      }),
    }
  ).catch(() => {
    return undefined
  })

  const pulledUsers: UserResponse[] = await responseHandler<UserResponse[]>(response, "Could not get followers", true);
  const convertedUsers: User[] = userResponseToUsers(pulledUsers);

  return convertedUsers;
}

export async function getUserFollowing(
  userAccessToken: string,
  userID: string,
  cursorUserID?: string,
): Promise<User[]> {
  const response = await fetch(
    momentAPI + `/user/user_id/${userID}/following`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_access_token: userAccessToken,
        user_id_cursor: cursorUserID,
      }),
    }
  ).catch(() => {
    return undefined
  })

  const pulledUsers: UserResponse[] = await responseHandler<UserResponse[]>(response, "Could not get following list", true);
  const convertedUsers: User[] = userResponseToUsers(pulledUsers);

  return convertedUsers;
}

/******************************************************
 * getUserPrefilledForm
 *
 * Gets a user's prefilled form by its id
 */
 export async function getUserPrefilledForm(
  userID: string
): Promise<UserPrefilledForm> {
  const response = await fetch(momentAPI + `/user/user_id/${userID}/prefilled_form`, {
    method: "GET",
  }).catch(() => {
    return undefined
  })

  const userPrefilledForm: UserPrefilledFormResponse = await responseHandler<UserPrefilledFormResponse>(response, "Could not get user", true);
  const convertedUsersPrefilledForm: UserPrefilledForm = prefilledFormResponseToPrefilledForm(userPrefilledForm);

  return convertedUsersPrefilledForm;
}

/******************************************************
 * updateUserPrefilledForm
 *
 * Updates the current user
 */
 export async function updateUserPrefilledForm(
  updatedUserPrefilledForm: UserPrefilledForm
): Promise<void> {
  //updatedUser.Picture is assumed to be base64
  const formData: FormData = new FormData();
  formData.append("name", updatedUserPrefilledForm.Name);
  formData.append("email", updatedUserPrefilledForm.Email);
  formData.append("phone_number", updatedUserPrefilledForm.PhoneNumber);
  formData.append("major", updatedUserPrefilledForm.Major);
  formData.append("year", updatedUserPrefilledForm.Year);

  const response = await fetch(
    momentAPI + `/user/user_id/${updatedUserPrefilledForm.UserID}/prefilled_form`,
    {
      method: "UPDATE",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    }
  ).catch(() => {
    return undefined
  })

  await responseHandler<void>(response, "Could not update user", false);

  return Promise.resolve()
}