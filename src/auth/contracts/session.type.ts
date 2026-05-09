import { IUserAgent } from "src/common/interfaces";

export interface ISession {
  id: string;

  jti: string;

  userId: string;

  email: string;

  accessToken: string;

  refreshToken: string;

  idToken: string;

  ip: string[];

  createdAt: Date;

  updatedAt: Date;

  userAgent: IUserAgent;
}

export interface ISessionCreateParams {
  jti: string;

  userId: string;

  email: string;

  accessToken: string;

  refreshToken: string;

  idToken: string;

  ip: string[];

  userAgent: IUserAgent;
}
