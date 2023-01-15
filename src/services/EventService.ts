import momentAPI from "../constants/server";
import { Event } from "../constants";
import { formatError } from "../helpers/helpers";

// createEvent DONE

// getEvent DONE

// updateEvent DONE

// deleteEvent DONE

// getFutureHostedEventsByUserId DONE

// getPastHostedEventsByUserId DONE

// getCurrUserFutureJoinedEvents DONE

// getCurrUserPastJoinedEvents DONE

// getEventsByCategory DONE

// Constants for category parameter checking in getAllSchoolEventsByCategory
export const ACADEMIC = "academic";
export const ATHLETICS = "athletics";
export const PROFESSIONAL = "professional";
export const SOCIAL = "social";

/******************************************************
 * getEventById
 *
 * Gets an event based on its ID
 *
 * Parameters: An ID number to search up an event
 * Return: An event if it exists. null if it does not.
 */
export async function getEvent(eventID: string): Promise<Event> {
  
  const pulledEvent: Event =     {
    EventID: eventID,
    Title: "I am a pulled Event",
    Description: "Description for Event\n\n\n\n\n\n\n\n yo\n expand me",
    Picture:
      "https://images.pexels.com/photos/12581595/pexels-photo-12581595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    Location: "Featured Location",
    StartDateTime: new Date("2023-01-29T10:30:00.000Z"),
    EndDateTime: new Date("2023-01-29T11:30:00.000Z"),
    Visibility: true,
  }
  return pulledEvent;
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
export async function createEvent(
  userAccessToken: string,

  createdEvent: Event): Promise<boolean> {
  return null;
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
): Promise<boolean> {
  return null;
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
  
  eventID: string): Promise<boolean> {
  return null;
}

export async function getEventNumJoins(eventID: string): Promise<number>{

  return 7;
}

export async function getEventNumShoutouts(eventID: string): Promise<number>{

  return 7;
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
  userID: string,
  userAccessToken: string,
): Promise<Event[]> {
  return null
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
  userID: string,
  userAccessToken: string,
): Promise<Event[]> {
  return null
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
  userID: string,
  userAccessToken: string,
): Promise<Event[]> {
  return null;
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
  userID: string,
  userAccessToken: string,
): Promise<Event[]> {
  return null;
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
export async function getAllSchoolFeaturedEvents(schoolID: string): Promise<Event[]>{
  const pulledFeaturedEvents: Event[] = [
    {
      EventID: "Featured1",
      Title: "Bonfire at La Jolla shores! All are welcome to join",
      Description: "Description for Event",
      Picture:
        "https://cdn.discordapp.com/attachments/770851058019991569/1031579004114845766/bonfire_graphic.png",
      Location: "Featured Location",
      StartDateTime: new Date("2023-06-29T10:30:00.000Z"),
      EndDateTime: new Date("2023-06-29T10:30:00.000Z"),
      Visibility: true,
    },
    {
      EventID: "Featured2",
      Title: "Another Featured Event " + schoolID,
      Description: "Description for Event",
      Picture:
        "https://test-bucket-chirag5241.s3.us-west-1.amazonaws.com/test_image.jpeg",
      Location: "Featured Location",
      StartDateTime: new Date("2023-06-29T10:30:00.000Z"),
      EndDateTime: new Date("2023-06-29T11:30:00.000Z"),
      Visibility: true,
    },
  ];

  return pulledFeaturedEvents;
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
export async function getAllSchoolOngoingEvents(schoolID: string): Promise<Event[]>{
  const ongoingEvents: Event[] = [
    {
      EventID: "StartingSoon1",
      Title: "StartingSoonEvent " + schoolID,
      Description: "Description for Event",
      Picture:
        "https://test-bucket-chirag5241.s3.us-west-1.amazonaws.com/test_image.jpeg",
      Location: "Featured Location",
      StartDateTime: new Date("2023-06-29T10:30:00.000Z"),
      EndDateTime: new Date("2023-06-29T11:30:00.000Z"),
      Visibility: true,
    },
    {
      EventID: "StartingSoon3",
      Title: "AcademicEvent " + schoolID,
      Description: "Description for Event",
      Picture:
        "https://images.pexels.com/photos/14402633/pexels-photo-14402633.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      Location: "Featured Location",
      StartDateTime: new Date("2023-06-29T10:30:00.000Z"),
      EndDateTime: new Date("2023-06-29T11:30:00.000Z"),
      Visibility: true,
    },
    {
      EventID: "StartingSoon2",
      Title: "AcademicEvent " + schoolID,
      Description: "Description for Event",
      Picture:
        "https://images.pexels.com/photos/12581595/pexels-photo-12581595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      Location: "Featured Location",
      StartDateTime: new Date("2023-06-29T10:30:00.000Z"),
      EndDateTime: new Date("2023-06-29T11:30:00.000Z"),
      Visibility: true,
    },
  ];

  return ongoingEvents
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
  switch (interestID) {

    case ACADEMIC:
      const pulledAcademicEvents: Event[] = [
        {
          EventID: "Academic1",
          Title: "AcademicEvent " + schoolID,
          Description: "Description for Event",
          Picture:
            "https://images.pexels.com/photos/14402633/pexels-photo-14402633.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          Location: "Featured Location",
          StartDateTime: new Date("2023-06-29T10:30:00.000Z"),
          EndDateTime: new Date("2023-06-29T11:30:00.000Z"),
          Visibility: true,
        },
      ];

      return pulledAcademicEvents;

    case ATHLETICS:
      const pulledAthleticsEvents: Event[] = [
        {
          EventID: "Athletics1",
          Title: "AthleticsEvent " + schoolID,
          Description: "Description for Event",
          Picture:
            "https://test-bucket-chirag5241.s3.us-west-1.amazonaws.com/test_image.jpeg",
          Location: "Featured Location",
          StartDateTime: new Date("2023-06-29T10:30:00.000Z"),
          EndDateTime: new Date("2023-06-29T11:30:00.000Z"),
          Visibility: true,
        },
      ];

      return pulledAthleticsEvents;

    case PROFESSIONAL:
      const pulledProfessionalEvents: Event[] = [
        {
          EventID: "Entertainment1",
          Title: "EntertainmentEvent " + schoolID,
          Description: "Description for Event",
          Picture:
            "https://test-bucket-chirag5241.s3.us-west-1.amazonaws.com/test_image.jpeg",
          Location: "Featured Location",
          StartDateTime: new Date("2023-06-29T10:30:00.000Z"),
          EndDateTime: new Date("2023-06-29T11:30:00.000Z"),
          Visibility: true,
        },
      ];

      return pulledProfessionalEvents;

    case SOCIAL:
      const pulledSocialEvents: Event[] = [
        {
          EventID: "Recreation1",
          Title: "RecreationEvent " + schoolID,
          Description: "Description for Event",
          Picture:
            "https://test-bucket-chirag5241.s3.us-west-1.amazonaws.com/test_image.jpeg",
          Location: "Featured Location",
          StartDateTime: new Date("2023-06-29T10:30:00.000Z"),
          EndDateTime: new Date("2023-06-29T11:30:00.000Z"),
          Visibility: true,
        },
      ];

      return pulledSocialEvents;

    default:
      throw formatError(
        "Development Error in getAllSchoolEventsByCategory",
        "Invalid category " + interestID + " passed in"
      );
  }
}
