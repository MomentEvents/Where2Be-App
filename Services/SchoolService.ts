import momentAPI from "../constants/servercontants";

export interface School {
    // Put school type here
    UniversityID:string,
    Name:string,
    Abbreviation:string
}  

/******************************************************
 * getAllSchools
 * 
 * Gets a list of all of the schools in the database
 * 
 * Parameters: None
 * Return: List of all schools with type School
 */
export async function getAllSchools(): Promise<School[]> {
    const resp = await fetch(momentAPI + "/get_schools", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        }),
      });
      type JSONResponse = {
        data?: {
          schools: School[]
        }
        errors?: Array<{message: string}>
      }

      const {data, errors}:JSONResponse = await resp.json();
      if (resp.ok){
        const schools = data.schools
        if (schools){
            return schools
        } else{
            return Promise.reject(new Error("Failed to retrieve schools info"))
        }
      }else{
        const error = new Error(errors?.map(e=>e.message).join('\n') ?? 'unknown')
        return Promise.reject(error)
    }
}

/******************************************************
 * getSchoolById
 * 
 * Gets a school by its Id
 * 
 * Parameters: ID to get the school
 * Return: The school with the matching id
 */
export async function getSchoolById(Id: string): Promise<School> {
    const resp = await fetch(momentAPI + "/get_school_by_id", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            Id: Id
        }),
      });
      type JSONResponse = {
        data?: {
          school: School
        }
        errors?: Array<{message: string}>
      }

      const {data, errors}:JSONResponse = await resp.json();
      if (resp.ok){
        const school = data.school
        if (school){
            return school
        } else{
            return Promise.reject(new Error(`Can't find school with ID: "${Id}"`))
        }
      }else{
        const error = new Error(errors?.map(e=>e.message).join('\n') ?? 'unknown')
        return Promise.reject(error)
    }
}

/******************************************************
 * getSchoolByUserId
 * 
 * Gets the current user's school
 * 
 * Parameters: None
 * Return: The school that the current user is in
 */
export async function getSchoolByUserId(UserID: string): Promise<School> {
    const resp = await fetch(momentAPI + "/get_curr_school", {
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
          school: School
        }
        errors?: Array<{message: string}>
      }

      const {data, errors}:JSONResponse = await resp.json();
      if (resp.ok){
        const school = data.school
        if (school){
            return school
        } else{
            return Promise.reject(new Error(`Can't find current users school`))
        }
      }else{
        const error = new Error(errors?.map(e=>e.message).join('\n') ?? 'unknown')
        return Promise.reject(error)
    }
}