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
  Visibility: string;
  NumJoins: number;
  NumShoutouts: number;
  UserJoin: boolean;
  UserShoutout: boolean;
  HostUserID: string;
}

export interface EventResponse {
  event_id: string;
  title: string;
  description: string;
  picture: string;
  location: string;
  start_date_time: string;
  end_date_time: string;
  visibility: string;
  num_joins: number;
  num_shoutouts: number;
  user_join: boolean;
  user_shoutout: boolean;
  host_user_id: string;
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
  latitude: number;
  longitude: number;
}

export interface User {
  UserID: string;
  DisplayName: string;
  Username: string;
  Picture: string;
  VerifiedOrganization: boolean;
  UserFollow: boolean;
  NumFollowers: number;
  NumFollowing: number;
  Email?: string;
}

export interface UserResponse {
  user_id: string;
  display_name: string;
  username: string;
  picture: string;
  verified_organization: boolean;
  user_follow: boolean;
  email?: string;
}
