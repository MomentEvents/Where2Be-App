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

export const eventResponseToEvent = (pulledEvent: EventResponse) => {
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
    }
}
export const eventResponseToEvents = (
  pulledEvents: EventResponse[]
): Event[] => {
  const eventArray: Event[] = [];

  pulledEvents.forEach((event: EventResponse) => {
    var timestamp = Date.parse(event.start_date_time);
    if (isNaN(timestamp)) {
      throw formatError(
        "Parse error",
        "Cannot parse date for eventID " + event.event_id
      );
    }
    var parsedStartDateTime = new Date(timestamp);

    var parsedEndDateTime: Date;

    timestamp = Date.parse(event.end_date_time);

    if (isNaN(timestamp)) {
      parsedEndDateTime = undefined;
    } else {
      parsedEndDateTime = new Date(timestamp);
    }

    eventArray.push({
      EventID: event.event_id,
      Title: event.title,
      Description: event.description,
      Picture: event.picture,
      Location: event.location,
      StartDateTime: parsedStartDateTime,
      EndDateTime: parsedEndDateTime,
      Visibility: event.visibility,
      NumJoins: event.num_joins,
      NumShoutouts: event.num_shoutouts,
      UserJoin: event.user_join,
      UserShoutout: event.user_shoutout,
    });
  });

  return eventArray;
};

export const userResponseToUser = (pulledUser: UserResponse): User => {
  const formattedUser: User = {
    UserID: pulledUser.user_id,
    DisplayName: pulledUser.display_name,
    Username: pulledUser.username,
    Picture: pulledUser.picture,
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

export const interestResponseToInterests = (
  pulledInterests: InterestResponse[]
): Interest[] => {};

export const schoolResponseToSchools = (
  pulledSchools: SchoolResponse[]
): School[] => {};
