import momentAPI from "../constants/server";
import { formatError } from "../helpers/helpers";
import { School } from "../constants";

// getAllUniversities

// getUniversityByUserId

/******************************************************
 * getAllUniversities
 *
 * Gets a list of all of the schools in the database
 *
 * Parameters: None
 * Return: List of all schools with type School
 */
export async function getAllSchools(): Promise<School[]> {

  //throw formatError("Error", "Unable to pull schools")
  const pulledUniversities: School[] = [
    {
      SchoolID: "SomeUCSDID",
      Name: "University of California, San Diego",
      Abbreviation: "UCSD",
    },
    {
      SchoolID: "SomeUIUCID",
      Name: "University of Illinois Urbana-Champaign",
      Abbreviation: "UIUC",
    },
  ];

  return Promise.resolve(pulledUniversities)
}

/******************************************************
 * getSchoolByUserId
 *
 * Gets the current user's school
 *
 * Parameters: None
 * Return: The school that the current user is in
 */
export async function getSchoolByUserId(
  UserID: string
): Promise<School> {
  // const resp = await fetch(momentAPI + "/school/user_id/" + UserID, {
  //   method: "GET",
  //   headers: {
  //     Accept: "application/json",
  //     "Content-Type": "application/json",
  //   },
  // }).catch((error: Error) => {throw formatError("School Service error", error.message)});

  const pulledSchool: School =    
  {
    SchoolID: "SomeUCSDID",
    Name: "UC San Diego",
    Abbreviation: "UCSD",
  }
  return Promise.resolve(pulledSchool)
}
