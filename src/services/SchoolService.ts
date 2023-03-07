import { momentAPI } from "../constants/server";
import { formatError } from "../helpers/helpers";
import { School } from "../constants/types";
import { SchoolResponse } from "../constants/types";
import { schoolResponseToSchool, schoolResponseToSchools } from "../helpers/converters";

/******************************************************
 * getAllSchools
 *
 * Gets a list of all of the schools in the database
 */
export async function getAllSchools(): Promise<School[]> {
  const response = await fetch(momentAPI + `/school`, {
    method: "GET",
  }).catch((error: Error) => {
    throw formatError("Network error", "Could not get all schools");
  });

  if (!response.ok) {
    const message = await response.text();
    throw formatError("Error " + response.status, message);
  }

  const pulledSchools: SchoolResponse[] = await response.json();
  const convertedSchools: School[] = schoolResponseToSchools(pulledSchools)

  return convertedSchools;
}

/******************************************************
 * getSchoolByUserId
 *
 * Gets the user's school by user id
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
    throw formatError("Error " + response.status, message);
  }

  const pulledSchool: SchoolResponse = await response.json();
  const convertedSchool: School = schoolResponseToSchool(pulledSchool)

  return convertedSchool;
}
