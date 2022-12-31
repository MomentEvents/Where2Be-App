export interface School {
    // Put school type here
    UniversityID: string,
    Name: string,
    Abbreviation: string,
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
    return null;
}

/******************************************************
 * getSchoolById
 * 
 * Gets a school by its Id
 * 
 * Parameters: ID to get the school
 * Return: The school with the matching id
 */
export async function getSchoolById(Id: number): Promise<School> {
    return null;
}

/******************************************************
 * getSchoolById
 * 
 * Gets the current user's school
 * 
 * Parameters: None
 * Return: The school that the current user is in
 */
export async function getCurrUserSchool(): Promise<School> {
    return null;
}