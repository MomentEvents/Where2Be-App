import UsedServer from "../constants/servercontants";

export interface User {
    id: string | null, // This is also a username
    picture: string | null,
    name: string | null,
    email: string | null,
    // password_hash: string | null,
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
export async function getUserById(Id: string): Promise<User> {
    const resp = await fetch(UsedServer + "/get_user_by_id", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            Id: Id,
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
            return Promise.reject(new Error(`Can't find user with ID: "${Id}"`))
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
 * getCurrUser
 * 
 * Gets the logged-in user's information
 * 
 * Parameters: None
 * Return: The current user and its information
 */
export async function getCurrUser(UserID: string): Promise<User> {
    const resp = await fetch(UsedServer + "/get_curr_user", {
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
            return Promise.reject(new Error(`Can't find current user`))
        }
      }else{
        const error = new Error(errors?.map(e=>e.message).join('\n') ?? 'unknown')
        return Promise.reject(error)
    }
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