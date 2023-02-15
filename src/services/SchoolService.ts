import { momentAPI } from "../constants/server";
import { formatError } from "../helpers/helpers";
import { School } from "../constants/types";
import { SchoolResponse } from "../constants/types";

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
  const response = await fetch(momentAPI + `/school`, {
    method: "GET",
  }).catch((error: Error) => {
    throw formatError("Network error", "Could not get all schools");
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error: " + response.statusText, message);
  }
  const data = await response.json();

  const SchoolArray = data.map((school: SchoolResponse) => {
    return {
      SchoolID: school.school_id,
      Name: school.name,
      Abbreviation: school.abbreviation,
    };
  });

  return Promise.resolve(SchoolArray);
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
  console.log("########UserID", UserID);

  const response = await fetch(momentAPI + `/school/user_id/${UserID}`, {
    method: "GET",
  }).catch((error: Error) => {
    throw formatError("Network error", "Could not get school user's school");
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error: " + response.statusText, message);
  }
  const data = await response.json();

  const pulledSchool: School = {
    SchoolID: data["school_id"],
    Name: data["name"],
    Abbreviation: data["abbreviation"],
  };

  return Promise.resolve(pulledSchool);
}
