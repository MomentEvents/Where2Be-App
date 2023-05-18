import { Interest, InterestResponse } from "./../constants/types";
import { momentAPI } from "../constants/server";
import { formatError } from "../helpers/helpers";
import { interestResponseToInterests } from "../helpers/converters";

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
    throw formatError("Error " + response.status, message);
  }

  const pulledInterests: InterestResponse[] = await response.json();
  const convertedInterests: Interest[] = interestResponseToInterests(pulledInterests)

  return convertedInterests;
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
  if (new Date().getSeconds()%3 == 0){
    throw formatError("Error ", "test");
  } else if (new Date().getSeconds()%2 == 0) {
    console.log("network error");
    throw formatError("Network error", "Could not get event interests");
  }
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
    throw formatError("Error " + response.status, message);
  }

  const pulledInterests: InterestResponse[] = await response.json();
  const convertedInterests: Interest[] = interestResponseToInterests(pulledInterests)

  return convertedInterests;
}
