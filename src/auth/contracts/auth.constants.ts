export interface UserSession {
  _id: string;
  email: string;
  profile: {
    name: string;
    picture?: string;
  };
}

export interface LoggedInResponse {
  accessToken: string;
}
