export interface IUserSession {
  _id: string;
  email: string;
  profile: {
    name: string;
    picture?: string;
  };
}

export interface ILoggedInResponse {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

export interface ILoginUserRequest {
  email: string;
  password: string;
}
