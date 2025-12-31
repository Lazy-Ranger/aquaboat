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
  idToken: string;
  refreshToken: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}
