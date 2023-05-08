import {
  Event,
  EventResponse,
  User,
  UserResponse,
  Interest,
  InterestResponse,
  School,
  SchoolResponse,
} from "../constants/types";
import { formatError } from "./helpers";

export const eventResponseToEvent = (pulledEvent: EventResponse): Event => {
  var timestamp = Date.parse(pulledEvent.start_date_time);
  if (isNaN(timestamp)) {
    throw formatError(
      "Parse error",
      "Cannot parse date for eventID " + pulledEvent.event_id
    );
  }
  var parsedStartDateTime = new Date(timestamp);

  var parsedEndDateTime: Date;

  timestamp = Date.parse(pulledEvent.end_date_time);

  if (isNaN(timestamp)) {
    parsedEndDateTime = undefined;
  } else {
    parsedEndDateTime = new Date(timestamp);
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
    HostUserID: pulledEvent.host_user_id
  };

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

export const userResponseToUser = (pulledUser: UserResponse): User => {
  const formattedUser: User = {
    UserID: pulledUser.user_id,
    DisplayName: pulledUser.display_name,
    Username: pulledUser.username,
    Picture: pulledUser.picture,
    VerifiedOrganization: pulledUser.verified_organization,
    UserFollow: false, // FXCHANGETHIS
    NumFollowers: 0,
    NumFollowing: 0,
  };
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
  const formattedInterest: Interest = {
    InterestID: pulledInterest.interest_id,
    Name: pulledInterest.name,
  };

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
  const formattedSchool: School = {
    SchoolID: pulledSchool.school_id,
    Name: pulledSchool.name,
    Abbreviation: pulledSchool.abbreviation,
  };

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
