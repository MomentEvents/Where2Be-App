import { InterestResponse } from "./../constants/types";
import { momentAPI } from "../constants/server";
import { Interest } from "../constants";
import { formatError } from "../helpers/helpers";

/******************************************************
 * getAllInterests
 *
 * Gets a list of interests in the database
 *
 * Parameters: None
 * Return: List of all interests
 */
export async function getAllInterests(schoolID: string): Promise<Interest[]> {
  const response = await fetch(momentAPI + `/interest`, {
    method: "GET",
  }).catch((error: Error) => {
    throw formatError("Network error", "Could not get all interests");
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error: " + response.statusText, message);
  }

  const data = await response.json();

  const InterestArray = data.map((interest: InterestResponse) => {
    return {
      InterestID: interest.interest_id,
      Name: interest.name,
    };
  });

  return InterestArray;
}

/******************************************************
 * getEventInterestsByEventId
 *
 * Gets a list of interests linked to an event
 *
 * Parameters: The event id corresponding to an event
 * Return: List of all interests relating to that event
 */
export async function getEventInterestsByEventId(
  eventID: string,
  userAccessToken: string
): Promise<Interest[]> {
  const response = await fetch(momentAPI + `/interest/event_id/${eventID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_access_token: userAccessToken,
    }),
  }).catch((error: Error) => {
    throw formatError("Network error", "Could not get event interests");
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error: " + response.statusText, message);
  }

  const data = await response.json();

  console.log("INTEREST#######", data);
  const InterestArray = data.map((interest: InterestResponse) => {
    return {
      InterestID: interest.interest_id,
      Name: interest.name,
    };
  });

  return InterestArray;
}
