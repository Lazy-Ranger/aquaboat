import { IUserAgent } from "../../../common/interfaces";
import { IAuthSession } from "../../contracts";

export class AuthSession implements IAuthSession {
  readonly id: string;

  jti: string;

  userId: string;

  email: string;

  accessToken: string;

  refreshToken: string;

  ip: string[];

  createdAt: Date;

  updatedAt: Date;

  userAgent: IUserAgent;

  constructor(props) {
    this.id = props.id;
    this.jti = props.jti;
    this.userId = props.userId;
    this.email = props.email;
    this.accessToken = props.accessToken;
    this.refreshToken = props.refreshToken;
    this.ip = props.ip;
    this.userAgent = props.userAgent;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
