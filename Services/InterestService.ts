export interface Interest {
    // Put interest type here
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
    return null;
}

/******************************************************
 * getCurrUserInterests
 * 
 * Gets a list of interests linked to the current user
 * 
 * Parameters: None
 * Return: List of all interests relating to the user
 */
export async function getCurrUserInterests(): Promise<Interest[]> {
    return null;
}

/******************************************************
 * updateCurrUserInterests
 * 
 * Updates a list of interests linked to the current user
 * 
 * Parameters: The updated interests of the user. These interests will replace the current interests of the user.
 * Return: A boolean which determines if the update was successful
 */
export async function updateCurrUserInterests(updatedInterests: Interest[]): Promise<boolean> {
    return null;
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
    return null;
}