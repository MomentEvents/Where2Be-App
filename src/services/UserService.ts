import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import momentAPI from "../constants/server";
import { formatError } from "../helpers/helpers";
import { User } from "../constants";

// searchUserInSchoolId

// createUser

// updateCurrUser

// getUserByUserId

// getEventHostByEventId

/******************************************************
 * getUserByUserId
 *
 * Gets a user by its Id
 *
 * Parameters:
 *          Id: ID to get user
 * Return: The user object (if found. Null if not found.)
 */
export async function getUserByUserId(UserID: string): Promise<User> {
  const resp = await fetch(momentAPI + "/get_user_by_id", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      UserID: UserID,
    }),
  });

  return null;
}

/******************************************************
 * getUserByUsername
 *
 * Gets a user by its username
 *
 * Parameters:
 *          username: username to get user
 * Return: The user object (if found. Null if not found.)
 */
export async function getUserByUsername(username: string): Promise<User> {
  const resp = await fetch(momentAPI + "/get_user_by_username", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
    }),
  });
  type JSONResponse = {
    data?: {
      user: User;
    };
    errors?: Array<{ message: string }>;
  };

  const { data, errors }: JSONResponse = await resp.json();
  if (resp.ok) {
    const user = data.user;
    if (user) {
      return user;
    } else {
      return Promise.reject(
        new Error(`Can't find user with username: "${username}"`)
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
 * getUserByEmail
 *
 * Gets a user by its email
 *
 * Parameters:
 *          email: email to get user
 * Return: The user object (if found. Null if not found.)
 */
export async function getUserByEmail(email: string): Promise<User> {
  const resp = await fetch(momentAPI + "/get_user_by_email", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
    }),
  });
  type JSONResponse = {
    data?: {
      user: User;
    };
    errors?: Array<{ message: string }>;
  };

  const { data, errors }: JSONResponse = await resp.json();
  if (resp.ok) {
    const user = data.user;
    if (user) {
      return user;
    } else {
      return Promise.reject(
        new Error(`Can't find user with email: "${email}"`)
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
 * getUserByEmail
 *
 * Gets a user by its email
 *
 * Parameters:
 *          email: email to get user
 * Return: The user object (if found. Null if not found.)
 */
export async function getUserByUserAccessToken(
  userAccessToken: string
): Promise<User> {
  console.log("Going before user access token");
  // const userResp = await fetch(
  //   momentAPI + "/user/user_access_token/" + userAccessToken,
  //   {
  //     method: "GET",
  //     headers: {
  //       Accept: "application/json",
  //       "Content-Type": "application/json",
  //     },
  //   }
  // ).catch((error: Error) => {
  //   console.log("Throwing error");
  //   throw formatError("User Service error", error.message);
  // });

  // PLACEHOLDER. REMOVE BELOW LATER

  const pulledUser: User = {
    UserID: "test123",
    Name: "Kyle",
    Username: "kyle1373",
    Email: "kwade@ucsd.edu",
    Picture:
      "https://test-bucket-chirag5241.s3.us-west-1.amazonaws.com/test_image.jpeg",
  };
  return Promise.resolve(pulledUser);

  // PLACEHOLDER. REMOVE ABOVE

  // if (!userResp.ok) {
  //   return Promise.reject(
  //     formatError("Error " + userResp.status, userResp.statusText)
  //   );
  // }
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
export async function updateCurrentUser(
  username: string | null,
  displayName: string | null,
  email: string | null,
  password: string | null,
  picture: string | null
): Promise<void> {
  // const userResp = await fetch(momentAPI + "/user/user_id/" + currentUser.UserID, {
  //   method: "UPDATE",
  //   headers: {
  //     Accept: "application/json",
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     user_access_token: userToken.UserAccessToken,
  //     username: username,
  //     display_name: displayName,
  //     email: email,
  //     password: password,
  //     picture: picture,
  //   })
  // });
  // if(!userResp.ok){
  //   return Promise.reject(formatError("Error " + userResp.status, userResp.statusText))
  // }
}

/******************************************************
 * createUser
 *
 * Creates a new user
 *
 * Parameters:
 *          createdUser: A new user
 * Return: If creating the user was successful or not
 */
export async function createUser(createdUser: User): Promise<boolean> {
  const resp = await fetch(momentAPI + "/create_user", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: createdUser,
    }),
  });
  type JSONResponse = {
    data?: {
      res: boolean;
    };
    errors?: Array<{ message: string }>;
  };

  const { data, errors }: JSONResponse = await resp.json();
  if (resp.ok) {
    const res = data.res;
    if (res) {
      return res;
    } else {
      return Promise.reject(new Error(`failed to create new user`));
    }
  } else {
    const error = new Error(
      errors?.map((e) => e.message).join("\n") ?? "unknown"
    );
    return Promise.reject(error);
  }
}
