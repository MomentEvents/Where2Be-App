export type Token = {
  UserID: string;
  UserAccessToken: string;
};

export type Event = {
  EventID: string;
  Title: string;
  Description: string;
  Picture: string;
  Location: string;
  StartDateTime: string;
  EndDateTime: string | null;
  Visibility: string;
  NumJoins: number;
  NumShoutouts: number;
  UserJoin: boolean;
  UserShoutout: boolean;
  HostUserID: string;
  UserFollowHost?: boolean;
  SignupLink?: string;
};

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
  user_follow_host?: boolean;
  signup_link?: string;
};

export type Interest = {
  InterestID: string;
  Name: string;
};

export type InterestResponse = {
  interest_id: string;
  name: string;
};

export type School = {
  SchoolID: string;
  Name: string;
  Abbreviation: string;
  Latitude: number;
  Longitude: number;
};

export type SchoolResponse = {
  school_id: string;
  name: string;
  abbreviation: string;
  latitude: number;
  longitude: number;
};

export interface User {
  UserID: string;
  DisplayName: string;
  Username: string;
  Picture: string;
  VerifiedOrganization: boolean;
  UserFollow?: boolean;
  NumFollowers?: number;
  NumFollowing?: number;
  NumEvents?: number;
}

export type UserResponse = {
  user_id: string;
  display_name: string;
  username: string;
  picture: string;
  verified_organization: boolean;
  user_follow?: boolean;
  num_followers?: number;
  num_following?: number;
  num_events?: number;
};

export type SignupValues = {
  Name: string;
  Username: string;
  Email: string;
  Password: string;
};

export type NotificationPreferences = {
  DoNotifyFollowing: boolean;
}

export type FirebaseEventMessage = {
  user_id: string,
  message: string,
  timestamp: string,
}

export type UserPrefilledForm = {
  UserID: string;
  Name: string;
  Email: string;
  PhoneNumber: string;
}

export type UserPrefilledFormResponse = {
  user_id: string;
  name: string;
  email: string;
  phone_number: string;
}