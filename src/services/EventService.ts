import { momentAPI } from "../constants/server";
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
export async function getEvent(
  eventID: string,
  userAccessToken: string
): Promise<Event> {
  console.log("useraccesstoken is" + userAccessToken);
  const response = await fetch(momentAPI + `/event/event_id/${eventID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_access_token: userAccessToken,
    }),
  }).catch((error: Error) => {
    throw formatError("Network error", "Could not get event");
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error: " + response.statusText, message);
  }

  const event: EventResponse = await response.json();

  console.log(event);

  const pulledEvent: Event = {
    EventID: event.event_id,
    Title: event.title,
    Description: event.description,
    Picture: event.picture,
    Location: event.location,
    StartDateTime: new Date(event.start_date_time),
    EndDateTime: event.end_date_time
      ? new Date(event.end_date_time)
      : undefined,
    Visibility: event.visibility,
    NumJoins: event.num_joins,
    NumShoutouts: event.num_shoutouts,
    UserJoin: event.user_join,
    UserShoutout: event.user_shoutout,
  };

  console.log(pulledEvent);
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
  const formData = new FormData();
  formData.append("user_access_token", userAccessToken);
  formData.append("title", createdEvent.Title);
  formData.append("description", createdEvent.Description);
  formData.append("location", createdEvent.Location);
  formData.append("start_date_time", createdEvent.StartDateTime.toISOString());
  formData.append("end_date_time", createdEvent.EndDateTime.toISOString());
  formData.append("visibility", createdEvent.Visibility.toString());
  formData.append(
    "interest_ids",
    JSON.stringify(interests.map((interest) => interest.Name))
  );
  formData.append("picture", createdEvent.Picture);

  const response = await fetch(momentAPI + `/event/create_event`, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  }).catch((error: Error) => {
    throw formatError("Network error", "Could not create event");
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error: " + response.statusText, message);
  }

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
  // updatedEvent.Picture is assumed to be base64 string
  const formData: FormData = new FormData();
  formData.append("user_access_token", userAccessToken);
  formData.append("title", updatedEvent.Title);
  formData.append("description", updatedEvent.Description);
  formData.append("location", updatedEvent.Location);
  formData.append("start_date_time", updatedEvent.StartDateTime.toISOString());
  formData.append("end_date_time", updatedEvent.EndDateTime.toISOString());
  formData.append("visibility", updatedEvent.Visibility.toString());
  formData.append(
    "interest_ids",
    JSON.stringify(updatedInterests.map((interest) => interest.Name))
  );
  formData.append("picture", updatedEvent.Picture);

  console.log(updatedEvent.Picture);

  const response = await fetch(
    momentAPI + `/event/event_id/${updatedEvent.EventID}`,
    {
      method: "UPDATE",
      headers: {
        "Content-Type": "multipart/form-data",
      },
      body: formData,
    }
  ).catch((error: Error) => {
    throw formatError("Network error", "Could not update event");
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error: " + response.statusText, message);
  }

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
): Promise<void> {
  const response = await fetch(momentAPI + `/event/event_id/${eventID}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_access_token: userAccessToken,
    }),
  }).catch((error: Error) => {
    throw formatError("Network error", "Could not delete event");
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error: " + response.statusText, message);
  }

  // const data = await response.json();

  return Promise.resolve();
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
    momentAPI + `/event/user_id/${userID}/join_future`,
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
      "Network error",
      "Could not get user joined future events"
    );
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error: " + response.statusText, message);
  }

  const responseJSON = await response.json();

  const EventArray: Event[] = [];
  responseJSON.forEach((event: EventResponse) => {
    EventArray.push({
      EventID: event.event_id,
      Title: event.title,
      Description: event.description,
      Picture: event.picture,
      Location: event.location,
      StartDateTime: new Date(event.start_date_time),
      EndDateTime: event.end_date_time
        ? new Date(event.end_date_time)
        : undefined,
      Visibility: event.visibility,
      NumJoins: event.num_joins,
      NumShoutouts: event.num_shoutouts,
      UserJoin: event.user_join,
      UserShoutout: event.user_shoutout,
    });
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
    momentAPI + `/event/user_id/${userID}/join_past`,
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
    throw formatError("Network error", "Could not get user joined past events");
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error: " + response.statusText, message);
  }

  const responseJSON = await response.json();

  const EventArray: Event[] = [];
  responseJSON.forEach((event: EventResponse) => {
    EventArray.push({
      EventID: event.event_id,
      Title: event.title,
      Description: event.description,
      Picture: event.picture,
      Location: event.location,
      StartDateTime: new Date(event.start_date_time),
      EndDateTime: event.end_date_time
        ? new Date(event.end_date_time)
        : undefined,
      Visibility: event.visibility,
      NumJoins: event.num_joins,
      NumShoutouts: event.num_shoutouts,
      UserJoin: event.user_join,
      UserShoutout: event.user_shoutout,
    });
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
    momentAPI + `/event/user_id/${userID}/host_future`,
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
      "Network error",
      "Could not get user hosted future events"
    );
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error: " + response.statusText, message);
  }

  const responseJSON = await response.json();

  const EventArray: Event[] = [];
  responseJSON.forEach((event: EventResponse) => {
    EventArray.push({
      EventID: event.event_id,
      Title: event.title,
      Description: event.description,
      Picture: event.picture,
      Location: event.location,
      StartDateTime: new Date(event.start_date_time),
      EndDateTime: event.end_date_time
        ? new Date(event.end_date_time)
        : undefined,
      Visibility: event.visibility,
      NumJoins: event.num_joins,
      NumShoutouts: event.num_shoutouts,
      UserJoin: event.user_join,
      UserShoutout: event.user_shoutout,
    });
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
    momentAPI + `/event/user_id/${userID}/host_past`,
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
    throw formatError("Network error", "Could not get user hosted past events");
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error: " + response.statusText, message);
  }

  const responseJSON = await response.json();

  const EventArray: Event[] = [];
  responseJSON.forEach((event: EventResponse) => {
    EventArray.push({
      EventID: event.event_id,
      Title: event.title,
      Description: event.description,
      Picture: event.picture,
      Location: event.location,
      StartDateTime: new Date(event.start_date_time),
      EndDateTime: event.end_date_time
        ? new Date(event.end_date_time)
        : undefined,
      Visibility: event.visibility,
      NumJoins: event.num_joins,
      NumShoutouts: event.num_shoutouts,
      UserJoin: event.user_join,
      UserShoutout: event.user_shoutout,
    });
  });

  return EventArray;
}

export async function getAllSchoolEvents(
  userAccessToken: string,
  schoolID: string
): Promise<Event[]> {
  console.log("Call to EventService: getAllSchoolEvents");
  const response = await fetch(momentAPI + `/event/school_id/${schoolID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_access_token: userAccessToken,
    }),
  }).catch((error: Error) => {
    throw formatError("Network error", "Could not get all school events");
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error: " + response.statusText, message);
  }

  const responseJSON = await response.json();

  console.log("getAllSchoolEvents");
  console.log(responseJSON);
  const EventArray: Event[] = [];
  responseJSON.forEach((event: EventResponse) => {
    EventArray.push({
      EventID: event.event_id,
      Title: event.title,
      Description: event.description,
      Picture: event.picture,
      Location: event.location,
      StartDateTime: new Date(event.start_date_time),
      EndDateTime: event.end_date_time
        ? new Date(event.end_date_time)
        : undefined,
      Visibility: event.visibility,
      NumJoins: event.num_joins,
      NumShoutouts: event.num_shoutouts,
      UserJoin: event.user_join,
      UserShoutout: event.user_shoutout,
    });
  });

  return EventArray;
}

export async function getAllSchoolEventsCategorized(
  userAccessToken: string,
  schoolID: string
): Promise<{ [key: string]: Event[] }> {
  console.log("Call to EventService: getAllSchoolEventsCategorized");
  console.log("UserAccessToken: " + userAccessToken);

  const categoryMap: { [key: string]: Event[] } = {};

  const response = await fetch(
    momentAPI + `/event/school_id/${schoolID}/categorized`,
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
    throw formatError("Network error", "Could not get all categorized events");
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error: " + response.statusText, message);
  }

  const responseJSON = await response.json();

  for (const categoryToEvents in responseJSON) {
    categoryMap[categoryToEvents] = [];
    responseJSON[categoryToEvents].forEach((event: EventResponse) => {
      categoryMap[categoryToEvents].push({
        EventID: event.event_id,
        Title: event.title,
        Description: event.description,
        Picture: event.picture,
        Location: event.location,
        StartDateTime: new Date(event.start_date_time),
        EndDateTime: event.end_date_time
          ? new Date(event.end_date_time)
          : undefined,
        Visibility: event.visibility,
        NumJoins: event.num_joins,
        NumShoutouts: event.num_shoutouts,
        UserJoin: event.user_join,
        UserShoutout: event.user_shoutout,
      });
    });
  }

  console.log(categoryMap);
  return Promise.resolve(categoryMap);
}
