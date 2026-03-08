import { Request } from "express";
import { IPrincipal } from "./principal.types";

export interface IUserAgent {
  browser: string;
  device: string;
  os: string;
  ua: string;
}

export interface IClientRequestInfo {
  ip: string[];
  userAgent: IUserAgent;
}

export interface IHttpRequest<TUser = IPrincipal>
  extends Omit<Request, "user"> {
  userAgent: IUserAgent;
  clientRequestInfo: IClientRequestInfo;
  user: TUser;
}
