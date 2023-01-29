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
  EndDateTime: Date | null; // startingDateTime and endingDateTime will be same date but different times
  Visibility: boolean;
  NumJoins: number;
  NumShoutouts: number;
  UserJoin: boolean;
  UserShoutout: boolean;
}

export interface Interest {
  InterestID: string;
  Name: string;
}

export interface School {
  SchoolID: string;
  Name: string;
  Abbreviation: string;
}

export interface User {
  UserID: string;
  Name: string;
  Username: string;
  Picture: string;
}
