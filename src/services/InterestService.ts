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
  ]
  return pulledInterests
}

/******************************************************
 * getInterestsByUserId
 * 
 * Gets a list of interests linked to the current user
 * 
 * Parameters: None
 * Return: List of all interests relating to the user
 */
export async function getInterestsByUserId(UserID: string): Promise<Interest[]> {
    const resp = await fetch(momentAPI + "/get_user_interests", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            UserID: UserID,
        }),
      });
      type JSONResponse = {
        data?: {
          inters: Interest[]
        }
        errors?: Array<{message: string}>
      }

      const {data, errors}:JSONResponse = await resp.json();
      if (resp.ok){
        const inters = data.inters
        if (inters){
            return inters
        } else{
            return Promise.reject(new Error("Could not get user interests"))
        }
      }else{
        const error = new Error(errors?.map(e=>e.message).join('\n') ?? 'unknown')
        return Promise.reject(error)
    }
}

/******************************************************
 * updateInterestsByUserId
 * 
 * Updates a list of interests linked to the current user
 * 
 * Parameters: The updated interests of the user. These interests will replace the current interests of the user.
 * Return: A boolean which determines if the update was successful
 */
export async function updateInterestsByUserId(UserID: string, updatedInterests: Interest[]): Promise<boolean> {
    const resp = await fetch(momentAPI + "/update_user_interests", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            UserID: UserID,
            newInts: updatedInterests,
        }),
      });
      type JSONResponse = {
        data?: {
          res: boolean
        }
        errors?: Array<{message: string}>
      }

      const {data, errors}:JSONResponse = await resp.json();
      if (resp.ok){
        const res = data.res
        if (res){
            return res
        } else{
            return Promise.reject(new Error(`failed to update user interests`))
        }
      }else{
        const error = new Error(errors?.map(e=>e.message).join('\n') ?? 'unknown')
        return Promise.reject(error)
    }
}

/******************************************************
 * getEventInterestsByEventId
 * 
 * Gets a list of interests linked to an event
 * 
 * Parameters: The event id corresponding to an event
 * Return: List of all interests relating to that event
 */
export async function getEventInterestsByEventId(eventId: number): Promise<Interest[]> {
    const resp = await fetch(momentAPI + "/get_event_interests", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            eventId: eventId,
        }),
      });
      type JSONResponse = {
        data?: {
          inters: Interest[]
        }
        errors?: Array<{message: string}>
      }

      const {data, errors}:JSONResponse = await resp.json();
      if (resp.ok){
        const inters = data.inters
        if (inters){
            return inters
        } else{
            return Promise.reject(new Error("Failed to get event interests"))
        }
      }else{
        const error = new Error(errors?.map(e=>e.message).join('\n') ?? 'unknown')
        return Promise.reject(error)
    }
}