export interface Event{
    // Event type here
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
export async function getEventDetailsById(eventId: number): Promise<Event> {
    return null;
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
    return null;
}

/******************************************************
 * updateEventById
 * 
 * Updates an event by its id
 * 
 * Parameters: 
 *          eventId: The event id to update the event. 
 *          updatedEvent: The changed values to update to the event. All null values are ignored.
 * Return: A boolean which is true if it's successfully updated and false if there is an error
 */
export async function updateEventById(eventId: number, updatedEvent: Event): Promise<boolean> {
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

export async function deleteEventById(eventId: number): Promise<boolean> {
    return null;
}

/******************************************************
 * getCurrUserShoutedEvents
 * 
 * Gets all of the events the user has shouted out
 * 
 * Parameters: None
 * Return: An Event array which has all of the shouted events of the current user
 */

export async function getCurrUserShoutedEvents(): Promise<Event[]> {
    return null;
}

/******************************************************
 * getCurrUserJoinedEvents
 * 
 * Gets all of the events the user has joined
 * 
 * Parameters: None
 * Return: An Event array which has all of the joined events of the current user
 */
export async function getCurrUserJoinedEvents(): Promise<Event[]> {
    return null;
}

/******************************************************
 * getCurrUserHostedEvents
 * 
 * Gets all of the events the user has hosted
 * 
 * Parameters: None
 * Return: An Event array which has all of the hosted events of the current user
 */

export async function getCurrUserHostedEvents(): Promise<Event[]> {
    return null;
}

/******************************************************
 * getHostedEventsByUserId
 * 
 * Gets all of the hosted events of a user
 * 
 * Parameters:
 *      userId: The user id of the user
 * Return: An Event array which has all of the hosted events of the respective user
 */
export async function getHostedEventsByUserId(userId: number): Promise<Event[]> {
    return null;
}

/******************************************************
 * getAllSchoolEvents
 * 
 * Gets all of the events within the current user's school
 * 
 * Parameters: None
 * Return: An Event array which has all of the events of that user's current school
 */
export async function getAllSchoolEvents(): Promise<Event[]> {
    return null;
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
export async function getAllSchoolEventsByCategory(category: string): Promise<Event[]> {

    return null;
}