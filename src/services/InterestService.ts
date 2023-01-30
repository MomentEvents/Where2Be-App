import momentAPI from "../constants/server";
import { Interest } from "../constants";
import { ACADEMIC, ATHLETICS, PROFESSIONAL, SOCIAL } from "./EventService";
import { formatError } from "../helpers/helpers";
import { InterestResponse } from "../constants/types";

// getAllInterests

// getCurrUserInterests

// updateCurrUserInterests

// updateEventInterestsByEventId

// getInterestsByEventId

/******************************************************
 * getAllInterests
 *
 * Gets a list of interests in the database
 *
 * Parameters: None
 * Return: List of all interests
 */
export async function getAllInterests(schoolID: string): Promise<Interest[]> {
  const response = await fetch(momentAPI+`/interest`, {
    method: 'GET'
  }).catch((error: Error) => {
    throw formatError("Error getting all interests", error.message)
  });
  const data = await response.json();

  const InterestArray = data.map((interest: InterestResponse) => {
    return {
      InterestID: interest.interest_id,
      Name: interest.name,
    }
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
  eventID: string
): Promise<Interest[]> {

  // need user_access_token

  console.log("INTEREST#######",eventID)

  const response = await fetch(momentAPI+`/interest/event_id/${eventID}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_access_token: "DoRyKLAVMRAUpeUc_aoAFwERg3Lgjeq1qgtMd7Wtxao"
    })
  });
  const data = await response.json();

  console.log("INTEREST#######",data)
  const InterestArray = data.map(interest => {
    return {
      InterestID: interest.interest_id,
      Name: interest.name,
    }
  });

  return InterestArray;
}

export async function updateEventInterestsByEventId(userAccessToken: string,
  
  interests: Interest[],
  eventID: string): Promise<void>
  {
    return Promise.resolve()
  }
