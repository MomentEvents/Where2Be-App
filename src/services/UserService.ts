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
    UserID: "kyle1373",
    Name: "Kyle",
    Username: "kyle1373",
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
  const pulledUser: User = {
    UserID: "kyle1373",
    Name: "Kyle Wade",
    Username: "kyle1373",
    Picture:
      "https://images.unsplash.com/photo-1671433002028-f72f14b56b7a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
  };

  return pulledUser
}

export async function getUserJoinEvent(
  userAccessToken: string,
  userID: string,

  eventID: string
): Promise<boolean> {
  return false;
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
): Promise<void> {}

export async function getUserShoutoutEvent(
  userAccessToken: string,
  userID: string,

  eventID: string
): Promise<boolean> {
  return false;
}

export async function addUserShoutoutEvent(
  userAccessToken: string,
  userID: string,

  eventID: string
): Promise<void> {}

export async function removeUserShoutoutEvent(
  userAccessToken: string,
  userID: string,

  eventID: string
): Promise<void> {}
