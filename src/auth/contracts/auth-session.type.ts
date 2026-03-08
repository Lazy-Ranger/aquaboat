import { IUserAgent } from "src/common/interfaces";

export interface IAuthSession {
  id: string;

  jti: string;

  userId: string;

  email: string;

  accessToken: string;

  refreshToken: string;

  ip: string[];

  createdAt: Date;

  updatedAt: Date;

  userAgent: IUserAgent;
}
