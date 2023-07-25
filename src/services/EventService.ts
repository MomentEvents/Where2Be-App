import { momentAPI } from "../constants/server";
import { Event, Interest } from "../constants";
import { CustomError, NetworkError } from "../constants/error";
import { formatError, responseHandler } from "../helpers/helpers";
import { confirmButtonStyles } from "react-native-modal-datetime-picker";
import { EventResponse, User, UserResponse } from "../constants/types";
import {
  eventResponseToEvent,
  eventResponseToEvents,
  userResponseToUser,
} from "../helpers/converters";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const READ_EVENTS = "ReadEvents"

/******************************************************
 * getEvent
 *
 * Gets an event based on its ID
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
  }).catch(() => {
    return undefined;
  });

  const pulledEvent: EventResponse = await responseHandler<EventResponse>(
    response,
    "Could not get event",
    true
  );
  const convertedEvent: Event = eventResponseToEvent(pulledEvent);

  return convertedEvent;
}

/******************************************************
 * createEvent
 *
 * Creates an event and links it to a school based on what school the
 * user from userAccessToken is in
 */
export async function createEvent(
  userAccessToken: string,

  createdEvent: Event,
  interests: Interest[],
  doNotifyFollowers: boolean
): Promise<string> {
  const formData = new FormData();
  formData.append("user_access_token", userAccessToken);
  formData.append("title", createdEvent.Title);
  formData.append("description", createdEvent.Description);
  formData.append("location", createdEvent.Location);
  formData.append("start_date_time", createdEvent.StartDateTime);
  formData.append("end_date_time", createdEvent.EndDateTime);
  formData.append("visibility", createdEvent.Visibility);
  formData.append(
    "interest_ids",
    JSON.stringify(interests.map((interest) => interest.InterestID))
  );
  formData.append("picture", createdEvent.Picture);
  formData.append("ping_followers", JSON.stringify(doNotifyFollowers));

  const response = await fetch(momentAPI + `/event/create_event`, {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  }).catch(() => {
    return undefined;
  });

  const data = await responseHandler<EventResponse>(
    response,
    "Could not create event",
    true
  );

  return data["event_id"];
}

/******************************************************
 * updateEvent
 *
 * Updates an event by its id
 */
export async function updateEvent(
  userAccessToken: string,
  updatedEvent: Event,
  updatedInterests: Interest[],
  doNotifyJoinedUsers: boolean
): Promise<void> {
  // updatedEvent.Picture is assumed to be base64 string if it exists
  console.log(JSON.stringify(updatedInterests));
  const formData: FormData = new FormData();
  formData.append("user_access_token", userAccessToken);
  formData.append("title", updatedEvent.Title);
  formData.append("description", updatedEvent.Description);
  formData.append("location", updatedEvent.Location);
  formData.append("start_date_time", updatedEvent.StartDateTime);
  formData.append("end_date_time", updatedEvent.EndDateTime);
  formData.append("visibility", updatedEvent.Visibility);
  formData.append(
    "interest_ids",
    JSON.stringify(updatedInterests.map((interest) => interest.InterestID))
  );
  formData.append("picture", updatedEvent.Picture);

  formData.append("ping_joined_users", JSON.stringify(doNotifyJoinedUsers));

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
  ).catch(() => {
    return undefined;
  });

  console.log("UPDATING EVENT");
  console.log("RESPONSE IS " + JSON.stringify(response));

  await responseHandler<void>(response, "Could not update event", false);

  return Promise.resolve();
}

/******************************************************
 * deleteEvent
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
  }).catch(() => {
    return undefined;
  });

  await responseHandler<void>(response, "Could not delete event", false);

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
  userID: string,
  cursor?: { eventID: string; date: string }
): Promise<Event[]> {
  const body: {
    user_access_token: string;
    cursor_event_id?: string;
    cursor_start_date_time?: string;
  } = {
    user_access_token: userAccessToken,
  };
  if (cursor) {
    body.cursor_event_id = cursor.eventID;
    body.cursor_start_date_time = cursor.date;
  }
  const response = await fetch(
    momentAPI + `/event/user_id/${userID}/join_future`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  ).catch(() => {
    return undefined;
  });

  const pulledEvents: EventResponse[] = await responseHandler<EventResponse[]>(
    response,
    "Could not get user joined future events",
    true
  );
  const convertedEvents: Event[] = eventResponseToEvents(pulledEvents);

  return convertedEvents;
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
  userID: string,
  cursor?: { eventID: string; date: string }
): Promise<Event[]> {
  const body: {
    user_access_token: string;
    cursor_event_id?: string;
    cursor_start_date_time?: string;
  } = {
    user_access_token: userAccessToken,
  };
  if (cursor) {
    body.cursor_event_id = cursor.eventID;
    body.cursor_start_date_time = cursor.date;
  }
  const response = await fetch(
    momentAPI + `/event/user_id/${userID}/join_past`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  ).catch(() => {
    return undefined;
  });

  const pulledEvents: EventResponse[] = await responseHandler<EventResponse[]>(
    response,
    "Could not get user joined past events",
    true
  );
  const convertedEvents: Event[] = eventResponseToEvents(pulledEvents);

  return convertedEvents;
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
  userID: string,
  cursor?: { eventID: string; date: string }
): Promise<Event[]> {
  const body: {
    user_access_token: string;
    cursor_event_id?: string;
    cursor_start_date_time?: string;
  } = {
    user_access_token: userAccessToken,
  };
  if (cursor) {
    body.cursor_event_id = cursor.eventID;
    body.cursor_start_date_time = cursor.date;
  }
  const response = await fetch(
    momentAPI + `/event/user_id/${userID}/host_future`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  ).catch(() => {
    return undefined;
  });

  const pulledEvents: EventResponse[] = await responseHandler<EventResponse[]>(
    response,
    "Could not get user hosted future events",
    true
  );
  const convertedEvents: Event[] = eventResponseToEvents(pulledEvents);

  return convertedEvents;
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
  userID: string,
  cursor?: { eventID: string; date: string }
): Promise<Event[]> {
  const body: {
    user_access_token: string;
    cursor_event_id?: string;
    cursor_start_date_time?: string;
  } = {
    user_access_token: userAccessToken,
  };
  if (cursor) {
    body.cursor_event_id = cursor.eventID;
    body.cursor_start_date_time = cursor.date;
  }
  const response = await fetch(
    momentAPI + `/event/user_id/${userID}/host_past`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  ).catch(() => {
    return undefined;
  });

  const pulledEvents: EventResponse[] = await responseHandler<EventResponse[]>(
    response,
    "Could not get user hosted past events",
    true
  );
  const convertedEvents: Event[] = eventResponseToEvents(pulledEvents);

  return convertedEvents;
}

export async function searchSchoolEvents(
  userAccessToken: string,
  schoolID: string,
  query: string
): Promise<Event[]> {
  if (query === "" || !query) {
    return [];
  }

  console.log("Call to EventService: searchSchoolEvents");
  const response = await fetch(
    momentAPI + `/event/school_id/${schoolID}/search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_access_token: userAccessToken,
        query: query,
      }),
    }
  ).catch(() => {
    return undefined;
  });

  const pulledEvents: EventResponse[] = await responseHandler<EventResponse[]>(
    response,
    "Could not get all school events",
    true
  );
  const convertedEvents: Event[] = eventResponseToEvents(pulledEvents);

  return convertedEvents;
}

export async function getAllSchoolEventsCategorized(
  userAccessToken: string,
  schoolID: string
): Promise<{ [key: string]: Event[] }> {
  console.log("Call to EventService: getAllSchoolEventsCategorized");
  console.log("UserAccessToken: " + userAccessToken);

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
  ).catch(() => {
    return undefined;
  });

  const responseJSON = await responseHandler<{}>(
    response,
    "Could not get all categorized events",
    true
  );
  const categoryMap: { [key: string]: Event[] } = {};

  for (const categoryToEvents in responseJSON) {
    const convertedEvents: Event[] = eventResponseToEvents(
      responseJSON[categoryToEvents]
    );
    categoryMap[categoryToEvents] = convertedEvents;
  }

  return Promise.resolve(categoryMap);
}

export async function getAllHomePageEventsWithHosts(
  userAccessToken: string,
  schoolID: string
): Promise<{ Host: User; Event: Event; Reason: string }[]> {
  // Get home events and hosts through API response
  const response = await fetch(
    momentAPI + `/event/school_id/${schoolID}/home`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_access_token: userAccessToken,
        school_id: schoolID,
      }),
    }
  ).catch(() => {
    return undefined;
  });

  const responseJSON: [
    { host: UserResponse; event: EventResponse; reason: string }
  ] = await responseHandler<
    [{ host: UserResponse; event: EventResponse; reason: string }]
  >(response, "Could not get home page events", true);

  const returnedData: { Host: User; Event: Event; Reason: string }[] = [];

  responseJSON.forEach((value) => {
    if (!value.host) {
      console.log("Error in getting a host for a home page event!");
    }
    if (!value.event) {
      console.log(
        "Error in getting a home page event when a host for it exists!"
      );
    }
    returnedData.push({
      Host: userResponseToUser(value.host),
      Event: eventResponseToEvent(value.event),
      Reason: value.reason,
    });
  });

  return returnedData;
}

export const saveReadEventIDs = async (
  events: { eventID: string; startDateTime: Date }[]
) => {
  try {
    const existingEvents = await AsyncStorage.getItem(READ_EVENTS);
    const existingEventsParsed = existingEvents ? JSON.parse(existingEvents) : [];

    const newEvents = events.map(event => ({
      id: event.eventID,
      timestamp: event.startDateTime.getTime(),
    }));

    // Create a map for faster lookup
    const newEventsMap = newEvents.reduce((map, event) => {
      map[event.id] = event;
      return map;
    }, {});

    // Update or add new events
    const allEvents = existingEventsParsed.map(event =>
      newEventsMap[event.id] ? newEventsMap[event.id] : event
    );

    // Check for events not yet in AsyncStorage
    newEvents.forEach(newEvent => {
      if (!allEvents.some(event => event.id === newEvent.id)) {
        allEvents.push(newEvent);
      }
    });

    await AsyncStorage.setItem(READ_EVENTS, JSON.stringify(allEvents));
  } catch (error) {
    console.warn(error);
  }
};

export const getAndCleanReadEventIDs = async (): Promise<string[]> => {
  try {
    const allEventsString = await AsyncStorage.getItem(READ_EVENTS);
    if (!allEventsString) {
      return [];
    }

    const allEvents = JSON.parse(allEventsString);
    const validEventIds: string[] = [];
    const now = new Date().getTime();

    const validEvents = allEvents.filter((event: { id: string; timestamp: number }) => {
      if (now - event.timestamp < 0) {
        // startDateTime is in the future
        validEventIds.push(event.id);
        return true;
      } else {
        // startDateTime is in the past
        return false;
      }
    });

    // Overwrite the event data with the valid events
    await AsyncStorage.setItem(READ_EVENTS, JSON.stringify(validEvents));

    return validEventIds;
  } catch (error) {
    console.warn(error);
    return [];
  }
};

