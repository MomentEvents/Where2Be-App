export interface School {
    // Put school type here
}  

/******************************************************
 * getAllSchools
 * 
 * Gets a list of schools in the database
 * 
 * Parameters: None
 * Return: List of all schools with type School
 */
export async function getAllSchools(): Promise<School[]> {
    return null;
}

/******************************************************
 * getSchoolById
 * 
 * Gets a school by its Id
 * 
 * Parameters: ID to get school
 * Return: The school with the matching id
 */
export async function getSchoolById(Id: number): Promise<School> {
    return null;
}

export async function getCurrUserSchool(): Promise<School> {
    return null;
}