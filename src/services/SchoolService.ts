import { momentAPI } from "../constants/server";
import { CustomError, NetworkError } from "../constants/error";
import { formatError, responseHandler } from "../helpers/helpers";
import { School, SearchResult, User } from "../constants/types";
import { SchoolResponse, SearchResponse } from "../constants/types";
import { schoolResponseToSchool, schoolResponseToSchools, searchResponseToSearchResults } from "../helpers/converters";

/******************************************************
 * getAllSchools
 *
 * Gets a list of all of the schools in the database
 */
export async function getAllSchools(): Promise<School[]> {
  const response = await fetch(momentAPI + `/school`, {
    method: "GET",
  }).catch(() => {
    return undefined
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
  }).catch(() => {
    return undefined
  })

  const pulledSchool: SchoolResponse = await responseHandler<SchoolResponse>(response, "Could not get school user's school", true);
  const convertedSchool: School = schoolResponseToSchool(pulledSchool)

  return convertedSchool;
}


export async function searchSchoolEventsAndUsers(
  userAccessToken: string,
  schoolID: string,
  query: string
): Promise<SearchResult[]> {
  if (query === "" || !query) {
    return [];
  }

  const response = await fetch(
    momentAPI + `/school/school_id/${schoolID}/search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_access_token: userAccessToken,
        query: query,
      }),
    }
  ).catch(() => {
    return undefined;
  });

  const pulledSearchResponse: SearchResponse[] = await responseHandler<SearchResponse[]>(
    response,
    "Could not get all school search results",
    true
  );
  const convertedSearchResults: SearchResult[] = searchResponseToSearchResults(pulledSearchResponse);

  return convertedSearchResults;
}