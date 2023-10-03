import {
  Event,
  EventResponse,
  User,
  UserResponse,
  Interest,
  InterestResponse,
  School,
  SchoolResponse,
  UserPrefilledFormResponse,
  UserPrefilledForm,
  SearchResponse,
  SearchResult,
} from "../constants/types";
import { formatError } from "./helpers";

export const eventResponseToEvent = (pulledEvent: EventResponse | SearchResponse): Event => {

  // check for null or undefined values in pulledEvent
  const keys = Object.keys(pulledEvent);
  for (const key of keys) {
    if (pulledEvent[key] === null || pulledEvent[key] === undefined) {
      console.warn(
        `${key} is null or undefined when converting to Event. EventID is ${pulledEvent.event_id}`
      );
    }
  }

  var timestamp = Date.parse(pulledEvent.start_date_time);
  if (isNaN(timestamp)) {
    throw formatError(
      "Parse error",
      "Cannot parse date for eventID " + pulledEvent.event_id
    );
  }
  var parsedStartDateTime = pulledEvent.start_date_time;

  var parsedEndDateTime = pulledEvent.end_date_time;

  timestamp = Date.parse(pulledEvent.end_date_time);

  if (isNaN(timestamp)) {
    parsedEndDateTime = undefined;
  }

  
  
  const formattedEvent: Event = {
    EventID: pulledEvent.event_id,
    Title: pulledEvent.title,
    Description: pulledEvent.description,
    Picture: pulledEvent.picture,
    Location: pulledEvent.location,
    StartDateTime: parsedStartDateTime,
    EndDateTime: parsedEndDateTime,
    Visibility: pulledEvent.visibility,
    NumJoins: pulledEvent.num_joins,
    NumShoutouts: pulledEvent.num_shoutouts,
    UserJoin: pulledEvent.user_join,
    UserShoutout: pulledEvent.user_shoutout,
    HostUserID: pulledEvent.host_user_id,
  };
  
  if(pulledEvent.user_follow_host !== undefined && pulledEvent.user_follow_host !== null){
    formattedEvent.UserFollowHost = pulledEvent.user_follow_host
  }

  if(pulledEvent.signup_link !== undefined && pulledEvent.signup_link !== null){
    formattedEvent.SignupLink = pulledEvent.signup_link
  }

  // check for null or undefined values in formattedEvent
  const convertedKeys = Object.keys(formattedEvent);
  for (const key of convertedKeys) {
    if (formattedEvent[key] === null || formattedEvent[key] === undefined) {
      console.warn(
        `${key} is null or undefined when converting to Event. EventID is ${formattedEvent.EventID}`
      );
    }
  }

  return formattedEvent;
};

export const eventResponseToEvents = (
  pulledEvents: EventResponse[]
): Event[] => {
  const eventArray: Event[] = [];

  pulledEvents.forEach((event: EventResponse) => {
    eventArray.push(eventResponseToEvent(event));
  });

  return eventArray;
};

export const userResponseToUser = (pulledUser: UserResponse | SearchResponse): User => {

  // check for null or undefined values in pulledUser
  const keys = Object.keys(pulledUser);
  for (const key of keys) {
    if (pulledUser[key] === null || pulledUser[key] === undefined) {
      console.warn(
        `${key} is null or undefined in UserResponse with user_id ${pulledUser.user_id}`
      );
    }
  }

  const formattedUser: User = {
    UserID: pulledUser.user_id,
    DisplayName: pulledUser.display_name,
    Username: pulledUser.username,
    Picture: pulledUser.picture,
    VerifiedOrganization: pulledUser.verified_organization,
  };

  if(pulledUser.user_follow !== undefined && pulledUser.user_follow !== null){
    formattedUser.UserFollow = pulledUser.user_follow
  }
  if(pulledUser.num_followers !== undefined && pulledUser.num_followers !== null){
    formattedUser.NumFollowers = pulledUser.num_followers
  }
  if(pulledUser.num_following !== undefined && pulledUser.num_following !== null){
    formattedUser.NumFollowing = pulledUser.num_following
  }
  if(pulledUser.num_events !== undefined && pulledUser.num_events !== null){
    formattedUser.NumEvents = pulledUser.num_events
  }
  // check for null or undefined values in formattedUser
  const keysConvert = Object.keys(formattedUser);
  for (const key of keysConvert) {
    if (formattedUser[key] === null || formattedUser[key] === undefined) {
      console.warn(
        `${key} is null or undefined when converting to User. UserID is ${formattedUser.UserID}`
      );
    }
  }
  return formattedUser;
};

export const userResponseToUsers = (pulledUsers: UserResponse[]): User[] => {
  const userArray: User[] = [];

  pulledUsers.forEach((user: UserResponse) => {
    userArray.push(userResponseToUser(user));
  });

  return userArray;
};

export const interestResponseToInterest = (
  pulledInterest: InterestResponse
): Interest => {
  const keysConvert = Object.keys(pulledInterest);
  for (const key of keysConvert) {
    if (pulledInterest[key] === null || pulledInterest[key] === undefined) {
      console.warn(
        `${key} is null or undefined for InterestResponse. interest_id is ${pulledInterest.interest_id}`
      );
    }
  }

  const formattedInterest: Interest = {
    InterestID: pulledInterest.interest_id,
    Name: pulledInterest.name,
  };

  const keys = Object.keys(formattedInterest);
  for (const key of keys) {
    if (formattedInterest[key] === null || formattedInterest[key] === undefined) {
      console.warn(
        `${key} is null or undefined when converting to Interest. InterestID is ${formattedInterest.InterestID}`
      );
    }
  }

  return formattedInterest;
};

export const interestResponseToInterests = (
  pulledInterests: InterestResponse[]
): Interest[] => {
  const interestArray: Interest[] = [];

  pulledInterests.forEach((interest: InterestResponse) => {
    interestArray.push(interestResponseToInterest(interest));
  });

  return interestArray;
};

export const schoolResponseToSchool = (
  pulledSchool: SchoolResponse
): School => {

  const keys = Object.keys(pulledSchool);
  for (const key of keys) {
    if (pulledSchool[key] === null || pulledSchool[key] === undefined) {
      console.warn(
        `${key} is null or undefined for SchoolResponse. school_id is ${pulledSchool.school_id}`
      );
    }
  }
  const formattedSchool: School = {
    SchoolID: pulledSchool.school_id,
    Name: pulledSchool.name,
    Abbreviation: pulledSchool.abbreviation,
    Latitude: pulledSchool.latitude,
    Longitude: pulledSchool.longitude
  };

  const keysConvert = Object.keys(pulledSchool);
  for (const key of keysConvert) {
    if (pulledSchool[key] === null || pulledSchool[key] === undefined) {
      console.warn(
        `${key} is null or undefined when converting to School. SchoolID is ${formattedSchool.SchoolID}`
      );
    }
  }

  return formattedSchool;
};

export const schoolResponseToSchools = (
  pulledSchools: SchoolResponse[]
): School[] => {
  const schoolArray: School[] = [];

  pulledSchools.forEach((school: SchoolResponse) => {
    schoolArray.push(schoolResponseToSchool(school));
  });

  return schoolArray;
};


export const prefilledFormResponseToPrefilledForm = (
  pulledUserPrefilledForm: UserPrefilledFormResponse
): UserPrefilledForm => {
  const formattedUserPrefilledForm: UserPrefilledForm = {
    UserID: pulledUserPrefilledForm.user_id,
    Name: pulledUserPrefilledForm.name,
    Email: pulledUserPrefilledForm.email,
    PhoneNumber: pulledUserPrefilledForm.phone_number,
    Major: pulledUserPrefilledForm.major,
    Year: pulledUserPrefilledForm.year, 
  };
  return formattedUserPrefilledForm;
};

export const eventToSearchResult = (
  event: Event,
): SearchResult => {
  const searchResult: SearchResult = {
    Type: 'event',
    Event: event,
  }

  return searchResult;
}

export const userToSearchResult = (
  user: User,
): SearchResult => {
  const searchResult: SearchResult = {
    Type: 'user',
    User: user,
  }

  return searchResult;
}

export const searchResponseToSearchResults = (
  pulledSearchResults: SearchResponse[]
): SearchResult[] => {
  const resultArray: SearchResult[] = [];

  pulledSearchResults.forEach((result: SearchResponse) => {
    if (result['type'] == 'event'){
      resultArray.push(eventToSearchResult(eventResponseToEvent(result)));
    } else if (result['type'] == 'user'){
      resultArray.push(userToSearchResult(userResponseToUser(result)));
    }
  });

  return resultArray;
};