export interface User {
    id: string | null, // This is also a username
    picture: string | null,
    name: string | null,
    email: string | null,
    password_hash: string | null,
    push_token: string[] | null,
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
 * Gets a user by its Id / username
 * 
 * Parameters: 
 *          Id: ID to get user
 * Return: The user object (if found. Null if not found.)
 */
export async function getUserById(Id: string): Promise<User> {
    return null;
}

/******************************************************
 * getUserByEmail
 * 
 * Gets a user by its email
 * 
 * Parameters: 
 *          email: email to get user
 * Return: The user object (if found. Null if not found.)
 */
export async function getUserByEmail(email: string): Promise<User | null> {
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
 * Parameters: 
 *          updatedUser: The new updated user (all non-null values will be updated)
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
 * Parameters: 
 *          createdUser: A new user
 * Return: If creating the user was successful or not
 */
export async function createUser(createdUser: User): Promise<boolean> {
    return null;
}