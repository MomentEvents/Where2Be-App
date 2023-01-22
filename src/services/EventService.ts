import momentAPI from "../constants/server";
import { Event, Interest } from "../constants";
import { formatError } from "../helpers/helpers";

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
  const pulledEvent: Event = {
    EventID: eventID,
    Title: "I am a pulled Event",
    Description: "Description for Event\n\n\n\n\n\n\n\n yo\n expand me",
    Picture:
      "https://images.pexels.com/photos/12581595/pexels-photo-12581595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    Location: "Featured Location",
    StartDateTime: new Date("2023-01-29T10:30:00.000Z"),
    EndDateTime: new Date("2023-01-29T11:30:00.000Z"),
    Visibility: true,
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

  // SHOULD RETURN EVENT ID

  return "Random event ID";
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

  updatedEvent: Event
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
  return 20;
}

export async function getEventNumShoutouts(eventID: string): Promise<number> {
  return 20;
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
  const pulledFeaturedEvents: Event[] = [
    {
      EventID: "Featured1",
      Title: "Bonfire at La Jolla shores! All are welcome to join",
      Description: "Come join a fun bonfire event at La Jolla Shores! We will be having snacks, dinner, games, and more! Meet new people who you have not met before.",
      Picture:
        "https://cdn.discordapp.com/attachments/770851058019991569/1031579004114845766/bonfire_graphic.png",
      Location: "La Jolla Shores",
      StartDateTime: new Date("2023-06-29T23:30:00.000Z"),
      EndDateTime: new Date("2023-06-30T05:30:00.000Z"),
      Visibility: true,
    },
    {
      EventID: "Featured2",
      Title: "Another Featured Event",
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
  return null;
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
  const pulledFeaturedEvents: Event[] = [
    {
      EventID: "Featured1",
      Title: "Bonfire at La Jolla shores!",
      Description: "Come join a fun bonfire event at La Jolla Shores! We will be having snacks, dinner, games, and more! Meet new people who you have not met before.",
      Picture:
        "https://cdn.discordapp.com/attachments/770851058019991569/1031579004114845766/bonfire_graphic.png",
      Location: "La Jolla Shores",
      StartDateTime: new Date("2022-10-22T05:00:00.000Z"),
      EndDateTime: new Date("2022-10-22T05:30:00.000Z"),
      Visibility: true,
    },
    {
      EventID: "Featured2",
      Title: "Another Featured Event",
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
  return [];
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
  const pulledFeaturedEvents: Event[] = [
    {
      EventID: "Featured1",
      Title: "Bonfire at La Jolla shores! All are welcome to join",
      Description: "Description for Event",
      Picture:
        "https://cdn.discordapp.com/attachments/770851058019991569/1031579004114845766/bonfire_graphic.png",
      Location: "Featured Location",
      StartDateTime: new Date("2023-01-29T10:30:00.000Z"),
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
export async function getAllSchoolOngoingEvents(
  schoolID: string
): Promise<Event[]> {
  const ongoingEvents: Event[] = [
    {
      EventID: "StartingSoon1",
      Title: "pSemi Techtalk & Recruiting Event",
      Description: "Description for Event",
      Picture:
        "https://media.discordapp.net/attachments/693568717300301946/959659695398862928/pSemi_Techtalk_and_Recruiting_Event.jpg?width=1442&height=755",
      Location: "Featured Location",
      StartDateTime: new Date("2023-10-18T17:30:00.000Z"),
      EndDateTime: new Date("2023-06-29T18:30:00.000Z"),
      Visibility: true,
    },
    {
      EventID: "StartingSoon2",
      Title: "Interview Workshop",
      Description: "Description for Event",
      Picture:
        "https://media.discordapp.net/attachments/693568717300301946/958126142160789595/Interview_Workshop.png?width=1280&height=670",
      Location: "Featured Location",
      StartDateTime: new Date("2023-10-18T18:00:00.000Z"),
      EndDateTime: new Date("2023-06-29T18:30:00.000Z"),
      Visibility: true,
    },
  ];

  return ongoingEvents;
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
          Title: "SWE x HKN Health Devices Workshop",
          Description: "Description for Event",
          Picture:
            "https://media.discordapp.net/attachments/693568717300301946/975856601263145050/devopsworkshopgraphic2.png",
          Location: "Featured Location",
          StartDateTime: new Date("2022-11-22T11:30:00.000Z"),
          EndDateTime: new Date("2023-11-22T11:45:00.000Z"),
          Visibility: true,
        },
        {
          EventID: "Academic3",
          Title: "SWE x HKN Health Devices Workshop",
          Description: "Description for Event",
          Picture:
            "https://media.discordapp.net/attachments/693568717300301946/947657617063444500/TinkerCAD_Workshop.jpg?width=1280&height=670",
          Location: "Featured Location",
          StartDateTime: new Date("2022-11-22T11:30:00.000Z"),
          EndDateTime: new Date("2023-11-22T11:45:00.000Z"),
          Visibility: true,
        },
        {
          EventID: "Academic2",
          Title: "SWE x HKN Health Devices Workshop",
          Description: "Description for Event",
          Picture:
            "https://media.discordapp.net/attachments/693568717300301946/947915123366961192/Cards_against_humanity_social_v1.2.png?width=1280&height=670",
          Location: "Featured Location",
          StartDateTime: new Date("2022-11-22T11:30:00.000Z"),
          EndDateTime: new Date("2023-11-22T11:45:00.000Z"),
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
