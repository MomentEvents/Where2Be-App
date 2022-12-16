export interface User {
    // Put user type here
}  

/******************************************************
 * getAllSchoolUsers
 * 
 * Gets all of the users in the current user's school
 * 
 * Parameters: None
 * Return: An array of Users which are in the User's school
 */
export async function getAllSchoolUsers(): Promise<User[]> {
    return null;
}

/******************************************************
 * getUserById
 * 
 * Gets a user by its Id
 * 
 * Parameters: ID to get user
 * Return: List of all users
 */
export async function getUserById(Id: number): Promise<User> {
    return null;
}

/******************************************************
 * getCurrUser
 * 
 * Gets the logged-in user's information
 * 
 * Parameters: None
 * Return: The current user and its information
 */
export async function getCurrUser(): Promise<User> {
    return null;
}

/******************************************************
 * updateCurrUser
 * 
 * Updates the current user
 * 
 * Parameters: The new updated user (all non-null values will be updated)
 * Return: If updating the user was successful or not
 */
export async function updateCurrUser(updatedUser: User): Promise<boolean> {
    return null;
}

/******************************************************
 * createUser
 * 
 * Creates a new user
 * 
 * Parameters: A new user
 * Return: If creating the user was successful or not
 */
export async function createUser(createdUser: User): Promise<boolean> {
    return null;
}



