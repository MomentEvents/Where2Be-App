import UsedServer from "../constants/servercontants";

export interface User {
    UserID: string,
    Name: string,
    Username: string,
    Email: string,
    Picture: string,
}  

/******************************************************
 * getAllSchoolUsers
 * 
 * Gets all of the users in the current user's school
 * 
 * Parameters: None
 * Return: An array of Users which are in the User's school
 */
export async function getAllSchoolUsers(UserID: string): Promise<User[]>  {
    const resp = await fetch(UsedServer + "/school_users", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            UserID: UserID,
        }),
      });
      type JSONResponse = {
        data?: {
          users: User[]
        }
        errors?: Array<{message: string}>
      }

      const {data, errors}:JSONResponse = await resp.json();
      if (resp.ok){
        const users = data.users
        if (users){
            return users
        } else{
            return Promise.reject(new Error("No schools for given user "))
        }
      }else{
        const error = new Error(errors?.map(e=>e.message).join('\n') ?? 'unknown')
        return Promise.reject(error)
    }
}


/******************************************************
 * getUserById
 * 
 * Gets a user by its Id
 * 
 * Parameters: 
 *          Id: ID to get user
 * Return: The user object (if found. Null if not found.)
 */
export async function getUserById(UserID: string): Promise<User> {
    const resp = await fetch(UsedServer + "/get_user_by_id", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            UserID: UserID,
        }),
      });
      type JSONResponse = {
        data?: {
            user: User
        }
        errors?: Array<{message: string}>
      }

      const {data, errors}:JSONResponse = await resp.json();
      if (resp.ok){
        const user = data.user
        if (user){
            return user
        } else{
            return Promise.reject(new Error(`Can't find user with ID: "${UserID}"`))
        }
      }else{
        const error = new Error(errors?.map(e=>e.message).join('\n') ?? 'unknown')
        return Promise.reject(error)
    }
}

/******************************************************
 * getUserByUsername
 * 
 * Gets a user by its username
 * 
 * Parameters: 
 *          username: username to get user
 * Return: The user object (if found. Null if not found.)
 */
 export async function getUsgetUserByUsernameerById(username: string): Promise<User> {
    const resp = await fetch(UsedServer + "/get_user_by_username", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
        }),
      });
      type JSONResponse = {
        data?: {
            user: User
        }
        errors?: Array<{message: string}>
      }

      const {data, errors}:JSONResponse = await resp.json();
      if (resp.ok){
        const user = data.user
        if (user){
            return user
        } else{
            return Promise.reject(new Error(`Can't find user with username: "${username}"`))
        }
      }else{
        const error = new Error(errors?.map(e=>e.message).join('\n') ?? 'unknown')
        return Promise.reject(error)
    }
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
export async function getUserByEmail(email: string): Promise<User> {
    const resp = await fetch(UsedServer + "/get_user_by_email", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
        }),
      });
      type JSONResponse = {
        data?: {
          user: User
        }
        errors?: Array<{message: string}>
      }

      const {data, errors}:JSONResponse = await resp.json();
      if (resp.ok){
        const user = data.user
        if (user){
            return user
        } else{
            return Promise.reject(new Error(`Can't find user with email: "${email}"`))
        }
      }else{
        const error = new Error(errors?.map(e=>e.message).join('\n') ?? 'unknown')
        return Promise.reject(error)
    }
}



/******************************************************
 * updateUserById
 * 
 * Updates a user though an ID
 * 
 * Parameters: 
 *          updatedUser: The new updated user (all non-null values will be updated)
 * Return: If updating the user was successful or not
 */
export async function updateUserById(updatedUser: User): Promise<boolean> {
    const resp = await fetch(UsedServer + "/update_curr_user", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user: updatedUser
        }),
      });
      type JSONResponse = {
        data?: {
          res: boolean
        }
        errors?: Array<{message: string}>
      }

      const {data, errors}:JSONResponse = await resp.json();
      if (resp.ok){
        const res = data.res
        if (res){
            return res
        } else{
            return Promise.reject(new Error(`Failed to update current user`))
        }
      }else{
        const error = new Error(errors?.map(e=>e.message).join('\n') ?? 'unknown')
        return Promise.reject(error)
    }
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
    const resp = await fetch(UsedServer + "/create_user", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            user: createdUser
        }),
      });
      type JSONResponse = {
        data?: {
          res: boolean
        }
        errors?: Array<{message: string}>
      }

      const {data, errors}:JSONResponse = await resp.json();
      if (resp.ok){
        const res = data.res
        if (res){
            return res
        } else{
            return Promise.reject(new Error(`failed to create new user`))
        }
      }else{
        const error = new Error(errors?.map(e=>e.message).join('\n') ?? 'unknown')
        return Promise.reject(error)
    }
}