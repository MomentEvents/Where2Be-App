import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import momentAPI from "../constants/server";
import { formatError } from "../helpers/helpers";
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
  return null;
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
  const pulledUser: User = {
    UserID: "test123",
    Name: "Kyle",
    Username: "kyle1373",
    Email: "kwade@ucsd.edu",
    Picture:
      "https://test-bucket-chirag5241.s3.us-west-1.amazonaws.com/test_image.jpeg",
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
  userID: string,
  userAccessToken: string,

  username: string | null,
  displayName: string | null,
  password: string | null,
  picture: string | null
): Promise<void> {
  return null;
}

export async function getEventHostByEventId(
  userAccessToken: string,

  eventID: string
): Promise<User> {
  return null;
}

export async function getUserJoinEvent(
  userAccessToken: string,
  userID: string,

  eventID: string
): Promise<boolean> {
  return null
}

export async function addUserJoinEvent(
  userAccessToken: string,
  userID: string,

  eventID: string
): Promise<void> {}

export async function removeUserJoinEvent(
  userAccessToken: string,
  userID: string,

  eventID: string
): Promise<void> {

}

export async function getUserShoutoutEvent(
  userAccessToken: string,
  userID: string,

  eventID: string
): Promise<boolean> {
  return null
}

export async function addUserShoutoutEvent(
  userAccessToken: string,
  userID: string,

  eventID: string
): Promise<void> {

}

export async function removeUserShoutoutEvent(
  userAccessToken: string,
  userID: string,

  eventID: string
): Promise<void> {

}
