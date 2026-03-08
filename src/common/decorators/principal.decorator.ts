import { createParamDecorator } from "@nestjs/common";
import { IHttpRequest } from "../interfaces";

export const Principal = createParamDecorator((dataOrKey, req) => {
  const request = req.switchToHttp().getRequest<IHttpRequest>();

  if (!request?.user) {
    return null;
  }

  if (dataOrKey?.trim().length) {
    return request.user[dataOrKey];
  }

  return request.user;
});
