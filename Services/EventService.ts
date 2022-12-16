interface Event{
    // Event type here
}

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
 * Creates an event and links it to a school
 * 
 * Parameters: A created event to put in the database
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
 * Parameters: The event id to update the event. The changed values to update to the event. All null values are ignored.
 * Return: A boolean which is true if it's successfully updated and false if there is an error
 */
export async function updateEventById(eventId: number, createdEvent: Event): Promise<boolean> {
    return null;
}

export async function deleteEventById(eventId: number): Promise<boolean> {
    return null;
}

export async function getCurrUserShoutedEvents(): Promise<Event[]> {
    return null;
}

export async function getCurrUserJoinedEvents(): Promise<Event[]> {
    return null;
}

export async function getHostedEventsByUserId(userId: number): Promise<Event[]> {
    return null;
}

export async function getHostedEventsByCurrUser(): Promise<Event[]> {
    return null;
}

export async function getAllSchoolEvents(): Promise<Event[]> {
    return null;
}

export async function getAllSchoolEventsByCategory(category: string): Promise<Event[]> {
    return null;
}