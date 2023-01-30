import momentAPI from "../constants/server";
import { Event, Interest } from "../constants";
import { formatError } from "../helpers/helpers";
import { confirmButtonStyles } from "react-native-modal-datetime-picker";
import { EventResponse } from "../constants/types";

export const ACADEMIC = "academic";
export const ATHLETICS = "athletics";
export const PROFESSIONAL = "professional";
export const SOCIAL = "social";

/******************************************************
 * getEvent
 *
 * Gets an event based on its ID
 *
 * Parameters:
 *
 * eventID - An ID number to search up an event
 *
 * Return:
 *
 * Event: An event if it exists. null if it does not.
 */
export async function getEvent(eventID: string, userAccessToken: string): Promise<Event> {
  // console.log(eventID)

  // need to send user Access token

  console.log("useraccesstoken is" + userAccessToken)
  const response = await fetch(
    momentAPI + `/api_ver_1.0.0/event/event_id/${eventID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_access_token: userAccessToken,
      }),
    }
  ).catch((error: Error) => {
    throw formatError(
      "Error in getting school events",
      error.name + ": " + error.message
    );
  });

  if(!response.ok){
    throw formatError("Error " + response.status, response.statusText)
  }
  const data = await response.json();

  console.log(data)
  const pulledEvent: Event = {
    EventID: data["event_id"],
    Title: data["title"],
    Description: data["description"],
    Picture: data["picture"],
    Location: data["location"],
    StartDateTime: new Date(data["start_date_time"]),
    EndDateTime: new Date(data["end_date_time"]),
    Visibility: data["visibility"],
    NumJoins: data["num_joins"],
    NumShoutouts: data["num_shoutouts"],
    UserJoin: data["user_join"],
    UserShoutout: data["user_shoutout"],
  };

  return pulledEvent;
}

/******************************************************
 * createEvent
 *
 * Creates an event and links it to a school based on what school the user from userAccessToken is in
 *
 * Parameters:
 *
 * userAccessToken - The user access token of the user to send
 * createdEvent - The created event of the
 *
 * Return:
 *
 * string - A string containing the eventID of the created event
 */
export async function createEvent(
  userAccessToken: string,

  createdEvent: Event,
  interests: Interest[]
): Promise<string> {
  console.log(createdEvent.StartDateTime.toISOString());

  const interestIDArray = interests.map((interest) => interest.Name);
  console.log(interestIDArray);

  const response = await fetch(
    momentAPI + `/api_ver_1.0.0/event/create_event`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_access_token: userAccessToken,
        title: createdEvent.Title,
        description: createdEvent.Description,
        location: createdEvent.Location,
        start_date_time: createdEvent.StartDateTime.toISOString(),
        end_date_time: createdEvent.EndDateTime.toISOString(),
        visibility: createdEvent.Visibility,
        interest_ids: interestIDArray,
      }),
    }
  );
  const data = await response.json();

  return data["event_id"];
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
export async function updateEvent(
  userAccessToken: string,

  updatedEvent: Event,
  updatedInterests: Interest[]
): Promise<void> {
  return Promise.resolve();
}

/******************************************************
 * deleteEventById
 *
 * Deletes an event by its id
 *
 * Parameters: The event id to delete the event.
 * Return: A boolean which is true if it's successfully deleted and false if there is an error
 */

export async function deleteEvent(
  userAccessToken: string,

  eventID: string
): Promise<boolean> {
  return null;
}

export async function getEventNumJoins(eventID: string): Promise<number> {
  const response = await fetch(
    momentAPI + `/api_ver_1.0.0/event/event_id/${eventID}/num_joins/`,
    {
      method: "GET",
    }
  );
  const data = await response.json();

  return data;
}

export async function getEventNumShoutouts(eventID: string): Promise<number> {
  const response = await fetch(
    momentAPI + `/api_ver_1.0.0/event/event_id/${eventID}/num_shoutouts/`,
    {
      method: "GET",
    }
  );
  const data = await response.json();

  return data;
}

/******************************************************
 * getCurrUserJoinedFutureEvents
 *
 * Gets all of the events the user has joined
 *
 * Parameters: None
 * Return: An Event array which has all of the joined events of the current user
 */
export async function getUserJoinedFutureEvents(
  userAccessToken: string,
  userID: string
): Promise<Event[]> {
  const response = await fetch(
    momentAPI + `/api_ver_1.0.0/event/user_id/${userID}/join_future`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_access_token: userAccessToken,
      }),
    }
  );
  const responseJSON = await response.json();

  const EventArray: Event[] = []
  responseJSON.forEach((event:EventResponse) => {
    EventArray.push({
      EventID: event.event_id,
      Title: event.title,
      Description: event.description,
      Picture: event.picture,
      Location: event.location,
      StartDateTime: new Date(event.start_date_time),
      EndDateTime: event.end_date_time ? undefined : new Date(event.end_date_time),
      Visibility: event.visibility,
      NumJoins: event.num_joins,
      NumShoutouts: event.num_shoutouts,
      UserJoin: event.user_join,
      UserShoutout: event.user_shoutout
    })
  });

  return EventArray;
}

/******************************************************
 * getCurrUserJoinedEvents
 *
 * Gets all of the events the user has joined
 *
 * Parameters: None
 * Return: An Event array which has all of the joined events of the current user
 */
export async function getUserJoinedPastEvents(
  userAccessToken: string,
  userID: string
): Promise<Event[]> {
  const response = await fetch(
    momentAPI + `/api_ver_1.0.0/event/user_id/${userID}/join_past`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_access_token: userAccessToken,
      }),
    }
  );
  const responseJSON = await response.json();

  const EventArray: Event[] = []
  responseJSON.forEach((event:EventResponse) => {
    EventArray.push({
      EventID: event.event_id,
      Title: event.title,
      Description: event.description,
      Picture: event.picture,
      Location: event.location,
      StartDateTime: new Date(event.start_date_time),
      EndDateTime: event.end_date_time ? undefined : new Date(event.end_date_time),
      Visibility: event.visibility,
      NumJoins: event.num_joins,
      NumShoutouts: event.num_shoutouts,
      UserJoin: event.user_join,
      UserShoutout: event.user_shoutout
    })
  });

  return EventArray;
}

/******************************************************
 * getCurrUserHostedPastEvents
 *
 * Gets all of the events the user has hosted
 *
 * Parameters: None
 * Return: An Event array which has all of the hosted events of the current user
 */

export async function getUserHostedFutureEvents(
  userAccessToken: string,
  userID: string
): Promise<Event[]> {
  const response = await fetch(
    momentAPI + `/api_ver_1.0.0/event/user_id/${userID}/host_future`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_access_token: userAccessToken,
      }),
    }
  );
  const responseJSON = await response.json();

  const EventArray: Event[] = []
  responseJSON.forEach((event:EventResponse) => {
    EventArray.push({
      EventID: event.event_id,
      Title: event.title,
      Description: event.description,
      Picture: event.picture,
      Location: event.location,
      StartDateTime: new Date(event.start_date_time),
      EndDateTime: event.end_date_time ? undefined : new Date(event.end_date_time),
      Visibility: event.visibility,
      NumJoins: event.num_joins,
      NumShoutouts: event.num_shoutouts,
      UserJoin: event.user_join,
      UserShoutout: event.user_shoutout
    })
  });

  return EventArray;
}

/******************************************************
 * getCurrUserHostedFutureEvents
 *
 * Gets all of the events the user has hosted
 *
 * Parameters: None
 * Return: An Event array which has all of the hosted events of the current user
 */

export async function getUserHostedPastEvents(
  userAccessToken: string,
  userID: string
): Promise<Event[]> {
  const response = await fetch(
    momentAPI + `/api_ver_1.0.0/event/user_id/${userID}/host_past`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_access_token: userAccessToken,
      }),
    }
  );

  const responseJSON = await response.json();

  const EventArray: Event[] = []
  responseJSON.forEach((event:EventResponse) => {
    EventArray.push({
      EventID: event.event_id,
      Title: event.title,
      Description: event.description,
      Picture: event.picture,
      Location: event.location,
      StartDateTime: new Date(event.start_date_time),
      EndDateTime: event.end_date_time ? undefined : new Date(event.end_date_time),
      Visibility: event.visibility,
      NumJoins: event.num_joins,
      NumShoutouts: event.num_shoutouts,
      UserJoin: event.user_join,
      UserShoutout: event.user_shoutout
    })
  });

  return EventArray;
}

export async function getAllSchoolEvents(
  userAccessToken: string,
  schoolID: string
): Promise<Event[]> {

  console.log("Call to EventService: getAllSchoolEvents")

  return []
}

export async function getAllSchoolEventsCategorized(
  userAccessToken: string,
  schoolID: string
): Promise<{ [key: string]: Event[] }> {

  console.log("Call to EventService: getAllSchoolEventsCategorized")
  console.log("UserAccessToken: " + userAccessToken)

  const categoryMap: { [key: string]: Event[] } = {};

  const response = await fetch(
    momentAPI + `/api_ver_1.0.0/event/school_id/${schoolID}/categorized`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }, 
      body: JSON.stringify({
        user_access_token: userAccessToken ? userAccessToken : null,
      }),
    }
  ).catch((error: Error) => {
    throw formatError(
      "Error in getting school events",
      error.name + ": " + error.message
    );
  });

  if(!response.ok){
    throw formatError("Error " + response.status, response.statusText)
  }

  const responseJSON = await response.json()

  for(const categoryToEvents in responseJSON){
    categoryMap[categoryToEvents] = []
    responseJSON[categoryToEvents].forEach((event: EventResponse) => {
      categoryMap[categoryToEvents].push({
        EventID: event.event_id,
        Title: event.title,
        Description: event.description,
        Picture: event.picture,
        Location: event.location,
        StartDateTime: new Date(event.start_date_time),
        EndDateTime: event.end_date_time ? undefined : new Date(event.end_date_time),
        Visibility: event.visibility,
        NumJoins: event.num_joins,
        NumShoutouts: event.num_shoutouts,
        UserJoin: event.user_join,
        UserShoutout: event.user_shoutout
      })
    })
  }

  return Promise.resolve(categoryMap);
}
