import { Interest, InterestResponse } from "./../constants/types";
import { momentAPI } from "../constants/server";
import { CustomError, NetworkError } from "../constants/error";
import { formatError, responseHandler } from "../helpers/helpers";
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
  }).catch(() => {
    return undefined
  })

  const pulledInterests: InterestResponse[] = await responseHandler<InterestResponse[]>(response, "Could not get all interests", true);
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
  const response = await fetch(momentAPI + `/interest/event_id/${eventID}`, {
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

  const pulledInterests: InterestResponse[] = await responseHandler<InterestResponse[]>(response, "Could not get event interests", true);
  const convertedInterests: Interest[] = interestResponseToInterests(pulledInterests)

  return convertedInterests;
}
