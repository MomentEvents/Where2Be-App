import momentAPI from "../constants/servercontants";
export interface Event{
    EventID: string,
    Title: string,
    Description: string,
    Picture: string,
    Location: string,
    StartDateTime: Date,
    EndDateTime: Date | null, // startingDateTime and endingDateTime will be same date but different times
    Visibility: boolean,
}

// Constants for category parameter checking in getAllSchoolEventsByCategory
export const FEATURED = "Featured"
export const FOR_YOU = "For You"
export const STARTING_SOON = "Starting Soon"
export const ONGOING = "Ongoing"
export const ACADEMIC = "Academic"
export const ATHLETICS = "Athletics"
export const CAREER_DEVELOPMENT = "Career Development"
export const COMMUNITY = "Community"
export const ENTERTAINMENT = "Entertainment"
export const RECREATION = "Recreation"
export const OTHER = "Other"

/******************************************************
 * getEventDetailsById
 * 
 * Gets an event based on its ID
 * 
 * Parameters: An ID number to search up an event
 * Return: An event if it exists. null if it does not.
 */
export async function getEventDetailsById(EventID: string): Promise<Event> {
    const resp = await fetch(momentAPI + "/get_event_by_id", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            EventID: EventID,
        }),
      });
      type JSONResponse = {
        data?: {
            event: Event
        }
        errors?: Array<{message: string}>
      }

      const {data, errors}:JSONResponse = await resp.json();
      if (resp.ok){
        const event = data.event
        if (event){
            return event
        } else{
            return Promise.reject(new Error(`Can't find event with ID: "${EventID}"`))
        }
      }else{
        const error = new Error(errors?.map(e=>e.message).join('\n') ?? 'unknown')
        return Promise.reject(error)
    }
}

/******************************************************
 * createEvent
 * 
 * Creates an event and links it to a school based on what school the currentUser is in
 * 
 * Parameters: 
 *          createdEvent: A created event to put in the database
 * Return: A boolean which is true if it's successfully created and false if there is an error
 */
export async function createEvent(createdEvent: Event): Promise<boolean> {
    const resp = await fetch(momentAPI + "/create_event", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            createdEvent: createdEvent,
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
            return Promise.reject(new Error(`failed to create new event`))
        }
      }else{
        const error = new Error(errors?.map(e=>e.message).join('\n') ?? 'unknown')
        return Promise.reject(error)
    }
}

/******************************************************
 * updateEventById
 * 
 * Updates an event by its id
 * 
 * Parameters: 
 *          EventID: The event id to update the event. 
 *          updatedEvent: The changed values to update to the event. All null values are ignored.
 * Return: A boolean which is true if it's successfully updated and false if there is an error
 */
export async function updateEventById(EventID: string, updatedEvent: Event): Promise<boolean> {
    const resp = await fetch(momentAPI + "/update_event", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            EventID: EventID,
            updatedEvent: updatedEvent,
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
            return Promise.reject(new Error(`failed to update new event`))
        }
      }else{
        const error = new Error(errors?.map(e=>e.message).join('\n') ?? 'unknown')
        return Promise.reject(error)
    }
}

/******************************************************
 * deleteEventById
 * 
 * Deletes an event by its id
 * 
 * Parameters: The event id to delete the event.
 * Return: A boolean which is true if it's successfully deleted and false if there is an error
 */

export async function deleteEventById(EventID: string): Promise<boolean> {
    const resp = await fetch(momentAPI + "/delete_event", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            EventID: EventID,
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
            return Promise.reject(new Error(`failed to delete event by id`))
        }
      }else{
        const error = new Error(errors?.map(e=>e.message).join('\n') ?? 'unknown')
        return Promise.reject(error)
    }
}

/******************************************************
 * getCurrUserShoutedEvents
 * 
 * Gets all of the events the user has shouted out
 * 
 * Parameters: None
 * Return: An Event array which has all of the shouted events of the current user
 */

export async function getCurrUserShoutedEvents(UserID: string): Promise<Event[]> {
    const resp = await fetch(momentAPI + "/get_user_shoutouts", {
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
            event: Event[]
        }
        errors?: Array<{message: string}>
      }

      const {data, errors}:JSONResponse = await resp.json();
      if (resp.ok){
        const event = data.event
        if (event){
            return event
        } else{
            return Promise.reject(new Error(`Can't get shoutouts for user with ID: "${UserID}"`))
        }
      }else{
        const error = new Error(errors?.map(e=>e.message).join('\n') ?? 'unknown')
        return Promise.reject(error)
    }
}

/******************************************************
 * getCurrUserJoinedEvents
 * 
 * Gets all of the events the user has joined
 * 
 * Parameters: None
 * Return: An Event array which has all of the joined events of the current user
 */
export async function getCurrUserJoinedEvents(UserID: string): Promise<Event[]> {
    const resp = await fetch(momentAPI + "/get_user_joins", {
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
            event: Event[]
        }
        errors?: Array<{message: string}>
      }

      const {data, errors}:JSONResponse = await resp.json();
      if (resp.ok){
        const event = data.event
        if (event){
            return event
        } else{
            return Promise.reject(new Error(`Can't get joins for user with ID: "${UserID}"`))
        }
      }else{
        const error = new Error(errors?.map(e=>e.message).join('\n') ?? 'unknown')
        return Promise.reject(error)
    }
}

/******************************************************
 * getCurrUserHostedEvents
 * 
 * Gets all of the events the user has hosted
 * 
 * Parameters: None
 * Return: An Event array which has all of the hosted events of the current user
 */

export async function getCurrUserHostedEvents(UserID: string): Promise<Event[]> {
    const resp = await fetch(momentAPI + "/get_current_user_hosted_events", {
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
            event: Event[]
        }
        errors?: Array<{message: string}>
      }

      const {data, errors}:JSONResponse = await resp.json();
      if (resp.ok){
        const event = data.event
        if (event){
            return event
        } else{
            return Promise.reject(new Error(`Can't get current hosted events for user with ID: "${UserID}"`))
        }
      }else{
        const error = new Error(errors?.map(e=>e.message).join('\n') ?? 'unknown')
        return Promise.reject(error)
    }
}

/******************************************************
 * getAllUserHostedEvents
 * 
 * Gets all of the hosted events of a user
 * 
 * Parameters:
 *      userId: The user id of the user
 * Return: An Event array which has all of the hosted events of the respective user
 */
export async function getAllUserHostedEvents(UserID: string): Promise<Event[]> {
    const resp = await fetch(momentAPI + "/get_all_user_hosted_events", {
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
            event: Event[]
        }
        errors?: Array<{message: string}>
      }

      const {data, errors}:JSONResponse = await resp.json();
      if (resp.ok){
        const event = data.event
        if (event){
            return event
        } else{
            return Promise.reject(new Error(`Can't get all hosted events for user with ID: "${UserID}"`))
        }
      }else{
        const error = new Error(errors?.map(e=>e.message).join('\n') ?? 'unknown')
        return Promise.reject(error)
    }
}

/******************************************************
 * getAllSchoolEvents
 * 
 * Gets all of the events within the current user's school
 * 
 * Parameters: None
 * Return: An Event array which has all of the events of that user's current school
 */
export async function getAllSchoolEvents(UserID: string): Promise<Event[]> {
    const resp = await fetch(momentAPI + "/get_all_school_events", {
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
            event: Event[]
        }
        errors?: Array<{message: string}>
      }

      const {data, errors}:JSONResponse = await resp.json();
      if (resp.ok){
        const event = data.event
        if (event){
            return event
        } else{
            return Promise.reject(new Error(`Can't get all school events for user with ID: "${UserID}"`))
        }
      }else{
        const error = new Error(errors?.map(e=>e.message).join('\n') ?? 'unknown')
        return Promise.reject(error)
    }
}

/******************************************************
 * getAllSchoolEventsByCategory
 * 
 * Gets all of the events in the current user's school which has a specific category. This is used in our home (1st iteration) page
 * 
 * Parameters:
 *          category: A string which corresponds to a constant of either FEATURED, FOR_YOU,
 *                    STARTING_SOON, ONGOING, ACADEMIC, ATHLETICS, CAREER_DEVELOPMENT, COMMUNITY,
 *                    ENTERTAINMENT, RECREATION, or OTHER.
 * Return: An Event array which are based on one of the categories above
 */
export async function getAllSchoolEventsByCategory(UserID: string, category: string): Promise<Event[]> {
    const resp = await fetch(momentAPI + "/get_all_events_by_category", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            UserID: UserID,
            category: category,
        }),
      });
      type JSONResponse = {
        data?: {
            event: Event[]
        }
        errors?: Array<{message: string}>
      }

      const {data, errors}:JSONResponse = await resp.json();
      if (resp.ok){
        const event = data.event
        if (event){
            return event
        } else{
            return Promise.reject(new Error(`Can't get all events by category for user with ID: "${UserID}"`))
        }
      }else{
        const error = new Error(errors?.map(e=>e.message).join('\n') ?? 'unknown')
        return Promise.reject(error)
    }
}