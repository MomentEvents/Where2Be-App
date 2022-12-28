import { User } from "./UserService"
import UsedServer from "../constants/servercontants";
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Token{
    id: string,
    password_hash: string
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
 * Return: The user that is found in the database based on the credentials given
 */
export async function login(usercred: string, password:string, credType:string): Promise<User> {
    var resp;
    if(credType == "Username"){
        resp = await fetch(UsedServer + "/userId_login", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: usercred,
                password: password
            }),
          });
    }
    else if (credType == "Email"){
        resp = await fetch(UsedServer + "/email_login", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: usercred,
                password: password
            }),
          });
    }
    else{
        return Promise.reject(new Error(`No username or email included`))
    }

    type JSONResponse = {
        data?: {
            user: User,
            password_hash: string
        }
        errors?: Array<{message: string}>
      }

      const {data, errors}:JSONResponse = await resp.json();
      if (resp.ok){
        const user = data.user
        const password_hash = data.password_hash
        if (user){
            writeToken({id: user.id, password_hash: password_hash})
            return user
        } else{
            return Promise.reject(new Error(`Invalid user credentials for user "${usercred}"`))
        }
      }else{
        const error = new Error(errors?.map(e=>e.message).join('\n') ?? 'unknown')
        return Promise.reject(error)
    }
    
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
export async function signup(checkUser: User, password: string): Promise<User> {
    if(checkUser.id == null || checkUser.email == null || checkUser.name == null){
        return Promise.reject(new Error(`User Object must include name, username, and email`))
    }
    const resp = await fetch(UsedServer + "/create_user", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user: checkUser,
            password: password
        }),
      });

    type JSONResponse = {
        data?: {
            user: User,
            password_hash: string
        }
        errors?: Array<{message: string}>
      }

      const {data, errors}:JSONResponse = await resp.json();
      if (resp.ok){
        const user = data.user
        const password_hash = data.password_hash
        if (user){
            writeToken({id: user.id, password_hash: password_hash})
            return user
        } else{
            return Promise.reject(new Error(`Failed to create a new user "${checkUser.id}"`))
        }
      }else{
        const error = new Error(errors?.map(e=>e.message).join('\n') ?? 'unknown')
        return Promise.reject(error)
    }
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
    deleteToken();
    return true;
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
    AsyncStorage.setItem('uid', newToken.id);
    AsyncStorage.setItem('pass', newToken.password_hash);
    return true;
}

/******************************************************
 * updateToken
 * 
 * Attempts to get the token from the storage, increments it by 15 minutes, then writes it again with the same information
 * 
 * Parameters: None
 * Return: A boolean which determines if updating was successful
 */
export async function updateToken(): Promise<boolean> {
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
    let uid = await AsyncStorage.getItem('uid')
    let pass = await AsyncStorage.getItem('pass')
    const token = {id: uid, password_hash: pass}
    return token;
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
    AsyncStorage.removeItem('uid');
    AsyncStorage.removeItem('pass');
    return true;
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
export async function validateToken(): Promise<User> {
    const token = await getToken()
    if(token.id == null || token.password_hash == null){
        return Promise.reject(new Error("Failed to get token"))
    }
    const resp = await fetch(UsedServer + "/user_test", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid: token.id,
          password: token.password_hash,
        }),
      });
      type JSONResponse = {
        data?: {
          users: User
        }
        errors?: Array<{message: string}>
      }
      const {data, errors}:JSONResponse = await resp.json();
      if (resp.ok){
        const users = data.users
        if (users){
            return users
        } else{
            return Promise.reject(new Error("Invalid token"))
        }
      }else{
        const error = new Error(errors?.map(e=>e.message).join('\n') ?? 'unknown')
        return Promise.reject(error)
    }

}