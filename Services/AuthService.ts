import { User } from "./UserService"

export interface Token{
    UserID: string,
    PasswordHash: string,
    Expiration: Date,
}

/******************************************************
 * login
 * 
 * Attempts to login a user through checking an inputted User object. It looks
 * up the user based on the email or username and checks hashed password. Once it validates the user, it
 * writes the token.
 * 
 * Parameters:
 *          checkUser: The user in which we will check if it exists and does have the same hash
 * Return: A boolean which determines if logging in was successful
 */
export async function login(checkUser: User): Promise<boolean> {
    return null;
}

/******************************************************
 * signup
 * 
 * Attempts to signup a user through creating an inputted User object into DB by calling UserService createUser. Once it creates the user,
 * it writes the token through calling writeToken.
 * 
 * Parameters:
 *          checkUser: The user in which we will sign up
 * Return: A boolean which determines if signing up was successful
 */
export async function signup(checkUser: User): Promise<boolean> {
    return null;
}

/******************************************************
 * logout
 * 
 * Attempts to logout a user through removing the token
 * from the device by calling deleteToken.
 * 
 * Parameters: None
 * Return: A boolean which determines if logging out was successful
 */
export async function logout(): Promise<boolean> {
    return null;
}

/******************************************************
 * writeToken
 * 
 * Attempts to write a token into the storage. It writes the email and hashed password with expiration date (15 minutes after writing)
 * 
 * Parameters: The token we want to write
 * Return: A boolean which determines if writing was successful
 */
async function writeToken(newToken: Token): Promise<boolean> {
    return null;
}

/******************************************************
 * updateToken
 * 
 * Attempts to get the token from the storage, increments it by 15 minutes, then writes it again with the same information
 * 
 * Parameters: None
 * Return: A boolean which determines if updating was successful
 */
async function updateToken(): Promise<boolean> {
    return null;
}

/******************************************************
 * getToken
 * 
 * Attempts to get a token from the storage
 * 
 * Parameters: None
 * Return: A Token object. Returns null if not found.
 */
async function getToken(): Promise<Token> {
    return null;
}

/******************************************************
 * deleteToken
 * 
 * Attempts to delete the token from the phone
 * 
 * Parameters: None
 * Return: True if deletion is successful. False if it is not.
 */
async function deleteToken(): Promise<boolean> {
    return null;
}

/******************************************************
 * validateToken
 * 
 * Checks if a token is there. If not there, return false.
 * If it is there, check if it is expired. 
 * If it is not expired, then return true. Token is kept.
 * If it is expired, it checks email and hashed username if it is the same.
 * If so, call updateToken and return true
 * If not, call logout and return false
 * 
 * Parameters: None
 * Return: True if we have a token after the function call. False if we do not.
 */
export async function validateToken(): Promise<boolean> {
    return null;
}