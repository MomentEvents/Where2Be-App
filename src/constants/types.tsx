export type Token = {
  UserAccessToken: string;
  Expiration: Date;
}

export type Event = {
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

export type EventResponse = {
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

export type Interest = {
  InterestID: string;
  Name: string;
}

export type InterestResponse = {
  interest_id: string;
  name: string;
}


export type School =  {
  SchoolID: string;
  Name: string;
  Abbreviation: string;
  Latitude: number;
  Longitude: number;
}

export type SchoolResponse = {
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
  UserFollow?: boolean;
  NumFollowers?: number;
  NumFollowing?: number;
  Email?: string;
}

// TODO: Create a UserDetailed object which has the UserFollow, NumFollowers, NumFollowing

// export interface UserDetailed implements User {
  
// }

export type UserResponse = {
  user_id: string;
  display_name: string;
  username: string;
  picture: string;
  verified_organization: boolean;
  user_follow?: boolean;
  num_followers?: number;
  num_following?: number;
  email?: string;
}
