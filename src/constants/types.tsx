export interface Token {
  UserAccessToken: string;
  Expiration: Date;
}

export interface Event {
  EventID: string;
  Title: string;
  Description: string;
  Picture: string;
  Location: string;
  StartDateTime: Date;
  EndDateTime: Date | null;
  Visibility: boolean;
  NumJoins: number;
  NumShoutouts: number;
  UserJoin: boolean;
  UserShoutout: boolean;
}

export interface EventResponse {
  event_id: string;
  title: string;
  description: string;
  picture: string;
  location: string;
  start_date_time: string;
  end_date_time: string;
  visibility: boolean;
  num_joins: number;
  num_shoutouts: number;
  user_join: boolean;
  user_shoutout: boolean;
}

export interface Interest {
  InterestID: string;
  Name: string;
}

export interface InterestResponse {
  interest_id: string;
  name: string;
}


export interface School {
  SchoolID: string;
  Name: string;
  Abbreviation: string;
}

export interface SchoolResponse {
  school_id: string;
  name: string;
  abbreviation: string;
}

export interface User {
  UserID: string;
  Name: string;
  Username: string;
  Picture: string;
}
