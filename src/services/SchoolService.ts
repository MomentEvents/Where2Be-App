import { momentAPI } from "../constants/server";
import { CustomError, NetworkError } from "../constants/error";
import { formatError, responseHandler } from "../helpers/helpers";
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
  })

  const pulledSchools: SchoolResponse[] = await responseHandler<SchoolResponse[]>(response, "Could not get all schools", true);
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
  })

  const pulledSchool: SchoolResponse = await responseHandler<SchoolResponse>(response, "Could not get school user's school", true);
  const convertedSchool: School = schoolResponseToSchool(pulledSchool)

  return convertedSchool;
}
