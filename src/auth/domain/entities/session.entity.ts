import { IUserAgent } from "../../../common/interfaces";
import { ISession } from "../../contracts";

export class Session implements ISession {
  readonly id: string;

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

  constructor(props) {
    this.id = props.id;
    this.jti = props.jti;
    this.userId = props.userId;
    this.email = props.email;
    this.accessToken = props.accessToken;
    this.refreshToken = props.refreshToken;
    this.idToken = props.idToken;
    this.ip = props.ip;
    this.userAgent = props.userAgent;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }
}
