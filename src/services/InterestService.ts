import momentAPI from "../constants/server";
import { Interest } from "../constants";
import { ACADEMIC, ATHLETICS, PROFESSIONAL, SOCIAL } from "./EventService";

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
  const pulledInterests: Interest[] = [
    {
      InterestID: ACADEMIC,
      Name: "Academic",
    },
    {
      InterestID: ATHLETICS,
      Name: "Athletics",
    },
    {
      InterestID: PROFESSIONAL,
      Name: "Professional",
    },
    {
      InterestID: SOCIAL,
      Name: "Social",
    },
  ];
  return pulledInterests;
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
  eventID: number
): Promise<Interest[]> {
  return null;
}
