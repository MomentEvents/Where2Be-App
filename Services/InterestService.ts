import UsedServer from "../constants/servercontants";
export interface Interest {
    // Put interest type here
    ID?:number;
    category?:string;
    name:string;
}  

/******************************************************
 * getAllInterests
 * 
 * Gets a list of interests in the database
 * 
 * Parameters: None
 * Return: List of all interests
 */
export async function getAllInterests(): Promise<Interest[]> {
    const resp = await fetch(UsedServer + "/get_interests", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
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
            return Promise.reject(new Error("Could not get interests"))
        }
      }else{
        const error = new Error(errors?.map(e=>e.message).join('\n') ?? 'unknown')
        return Promise.reject(error)
    }
}

/******************************************************
 * getCurrUserInterests
 * 
 * Gets a list of interests linked to the current user
 * 
 * Parameters: None
 * Return: List of all interests relating to the user
 */
export async function getCurrUserInterests(UserID: string): Promise<Interest[]> {
    const resp = await fetch(UsedServer + "/get_user_interests", {
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
 * updateCurrUserInterests
 * 
 * Updates a list of interests linked to the current user
 * 
 * Parameters: The updated interests of the user. These interests will replace the current interests of the user.
 * Return: A boolean which determines if the update was successful
 */
export async function updateCurrUserInterests(UserID: string, updatedInterests: Interest[]): Promise<boolean> {
    const resp = await fetch(UsedServer + "/update_user_interests", {
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
    const resp = await fetch(UsedServer + "/get_user_interests", {
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