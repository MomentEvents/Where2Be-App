import momentAPI from "../constants/server";
import { Event, Interest } from "../constants";
import { formatError } from "../helpers/helpers";

// import * as Base64 from 'js-base64';

import { Platform } from 'react-native';
// import RNFetchBlob from 'rn-fetch-blob';
import * as FileSystem from 'expo-file-system';

// import RNFS from 'react-native-fs';
// import 

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
export async function getEvent(eventID: string): Promise<Event> {
  console.log(eventID)

  return None;

  // need to send user Access token

  const response = await fetch(momentAPI+`/api_ver_1.0.0/event/event_id/${eventID}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_access_token: "DoRyKLAVMRAUpeUc_aoAFwERg3Lgjeq1qgtMd7Wtxao"
    })
  });
  const data = await response.json();

  const pulledEvent: Event = {
    EventID: data["event_id"],
    Title: data["title"],
    Description: data["description"],
    Picture: data["picture"],
    Location: data["location"],
    StartDateTime: new Date(data["start_date_time"]),
    EndDateTime: new Date(data["end_date_time"]),
    Visibility: data["visibility"],
    NumJoins: 0,
    NumShoutouts: 0
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

  console.log(createdEvent.StartDateTime.toISOString())

  const interestIDArray = interests.map((interest) => interest.Name);
  console.log(interestIDArray);

  // convert the image path to a File object
  const Image = createdEvent.Picture;
  // const fileUri = Platform.OS === 'ios' ? ImagePath.replace('file://', '') : ImagePath
  // const fileName = fileUri.substring(fileUri.lastIndexOf('/') + 1);
  // const fileType = fileName.substring(fileName.lastIndexOf('.') + 1);

  // console.log("###########picture,",Image)

  // create FormData with the event data and the image file
  const formData = new FormData();
  formData.append('user_access_token', userAccessToken);
  formData.append('title', createdEvent.Title);
  formData.append('description', createdEvent.Description);
  formData.append('location', createdEvent.Location);
  formData.append('start_date_time', createdEvent.StartDateTime.toISOString());
  formData.append('end_date_time', createdEvent.EndDateTime.toISOString());
  formData.append('visibility', createdEvent.Visibility.toString());
  formData.append('interest_ids', JSON.stringify(interests.map((interest) => interest.Name)));
  formData.append('picture', Image);

  console.log("###########formData,",formData)

  const response = await fetch(momentAPI+`/api_ver_1.0.0/event/create_event`, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    body: formData
    // headers: {
    //   'Content-Type': 'application/json'
    // },
    // body: JSON.stringify({
    //   user_access_token: userAccessToken,
    //   title: createdEvent.Title,
    //   description: createdEvent.Description, 
    //   location: createdEvent.Location,
    //   start_date_time: createdEvent.StartDateTime.toISOString(),
    //   end_date_time: createdEvent.EndDateTime.toISOString(),
    //   visibility: createdEvent.Visibility,
    //   interest_ids: interestIDArray,
    // })
  });
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
  updatedInterests: Interest[], 
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

  return 0;

  const response = await fetch(momentAPI+`/api_ver_1.0.0/event/event_id/${eventID}/num_joins/`, {
    method: 'GET'
  });
  const data = await response.json();
  
  return data;
}

export async function getEventNumShoutouts(eventID: string): Promise<number> {

  return 0;
  
  const response = await fetch(momentAPI+`/api_ver_1.0.0/event/event_id/${eventID}/num_shoutouts/`, {
    method: 'GET'
  });
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
): Promise<Event[]> 

{
  const response = await fetch(momentAPI+`/api_ver_1.0.0/event/user_id/${userID}/join_future`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_access_token: userAccessToken
    })
  });
  const data = await response.json();

  const EventArray = data.map(event => {
    return {
      EventID: event.EventID,
      Title: event.Title,
      Description: event.Description,
      Picture: event.Picture,
      Location: event.Location,
      StartDateTime: new Date(event.StartDateTime),
      EndDateTime: event.EndDateTime != "NULL" ? new Date(event.EndDateTime) : null,
      Visibility: event.Visibility
    }
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

  const response = await fetch(momentAPI+`/api_ver_1.0.0/event/user_id/${userID}/join_past`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_access_token: userAccessToken
    })
  });
  const data = await response.json();

  const EventArray = data.map(event => {
    return {
      EventID: event.EventID,
      Title: event.Title,
      Description: event.Description,
      Picture: event.Picture,
      Location: event.Location,
      StartDateTime: new Date(event.StartDateTime),
      EndDateTime: event.EndDateTime != "NULL" ? new Date(event.EndDateTime) : null,
      Visibility: event.Visibility
    }
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

  const response = await fetch(momentAPI+`/api_ver_1.0.0/event/user_id/${userID}/host_future`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_access_token: userAccessToken
    })
  });
  const data = await response.json();

  const EventArray = data.map(event => {
    return {
      EventID: event.EventID,
      Title: event.Title,
      Description: event.Description,
      Picture: event.Picture,
      Location: event.Location,
      StartDateTime: new Date(event.StartDateTime),
      EndDateTime: event.EndDateTime != "NULL" ? new Date(event.EndDateTime) : null,
      Visibility: event.Visibility
    }
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

  const response = await fetch(momentAPI+`/api_ver_1.0.0/event/user_id/${userID}/host_past`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_access_token: userAccessToken
    })
  });
  const data = await response.json();

  const EventArray = data.map(event => {
    return {
      EventID: event.EventID,
      Title: event.Title,
      Description: event.Description,
      Picture: event.Picture,
      Location: event.Location,
      StartDateTime: new Date(event.StartDateTime),
      EndDateTime: event.EndDateTime != "NULL" ? new Date(event.EndDateTime) : null,
      Visibility: event.Visibility
    }
  });

  console.log("#######Future events", EventArray)

  return EventArray;
}

/*******************************************************
 * getAllSchoolFeaturedEvents
 *
 * Gets all of the featured events from a school
 *
 * Parameters:
 * schoolID: the schoolID
 *
 * Return:
 * An array of events which are labeled as featured
 */
export async function getAllSchoolFeaturedEvents(
  schoolID: string
): Promise<Event[]> {

  return [];

  const response = await fetch(momentAPI+`/api_ver_1.0.0/event/school_id/${schoolID}/featured`, {
    method: 'GET'
  });
  const data = await response.json();

  const EventArray = data.map(event => {
    return {
      EventID: event.EventID,
      Title: event.Title,
      Description: event.Description,
      Picture: event.Picture,
      Location: event.Location,
      StartDateTime: new Date(event.StartDateTime),
      EndDateTime: event.EndDateTime != "NULL" ? new Date(event.EndDateTime) : null,
      Visibility: event.Visibility
    }
  });

  return EventArray;
}

/*******************************************************
 * getAllSchoolOngoingEvents
 *
 * Gets all of the ongoing events from a school
 *
 * Parameters:
 * schoolID: the schoolID
 *
 * Return:
 * An array of events which are labeled as ongoing
 */
export async function getAllSchoolOngoingEvents(
  schoolID: string
): Promise<Event[]> {
  // const ongoingEvents: Event[] = [
  //   {
  //     EventID: "StartingSoon1",
  //     Title: "StartingSoonEvent " + schoolID,
  //     Description: "Description for Event",
  //     Picture:
  //       "https://test-bucket-chirag5241.s3.us-west-1.amazonaws.com/test_image.jpeg",
  //     Location: "Featured Location",
  //     StartDateTime: new Date("2023-06-29T10:30:00.000Z"),
  //     EndDateTime: new Date("2023-06-29T11:30:00.000Z"),
  //     Visibility: true,
  //   },
  //   {
  //     EventID: "StartingSoon3",
  //     Title: "AcademicEvent " + schoolID,
  //     Description: "Description for Event",
  //     Picture:
  //       "https://images.pexels.com/photos/14402633/pexels-photo-14402633.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  //     Location: "Featured Location",
  //     StartDateTime: new Date("2023-06-29T10:30:00.000Z"),
  //     EndDateTime: new Date("2023-06-29T11:30:00.000Z"),
  //     Visibility: true,
  //   },
  //   {
  //     EventID: "StartingSoon2",
  //     Title: "AcademicEvent " + schoolID,
  //     Description: "Description for Event",
  //     Picture:
  //       "https://images.pexels.com/photos/12581595/pexels-photo-12581595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
  //     Location: "Featured Location",
  //     StartDateTime: new Date("2023-06-29T10:30:00.000Z"),
  //     EndDateTime: new Date("2023-06-29T11:30:00.000Z"),
  //     Visibility: true,
  //   },
  // ];

  return [];//ongoingEvents;
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
export async function getAllSchoolEventsByInterest(
  schoolID: string,
  interestID: string
): Promise<Event[]> {
  if (schoolID === null) {
    throw formatError(
      "Development Error in getAllSchoolEventsByCategory",
      "SchoolID is null"
    );
  }

  return [];

  let response;
  let data;

  response = await fetch(momentAPI+`/api_ver_1.0.0/event/school_id/${schoolID}/${interestID}`, {
    method: 'GET'
  });
  data = await response.json();

  const EventArray = data.map(event => {
    return {
      EventID: event.EventID,
      Title: event.Title,
      Description: event.Description,
      Picture: event.Picture,
      Location: event.Location,
      StartDateTime: new Date(event.StartDateTime),
      EndDateTime: event.EndDateTime != "NULL" ? new Date(event.EndDateTime) : null,
      Visibility: event.Visibility
    }
  });

  console.log("############### "+interestID+" array",EventArray)
  return EventArray;
}