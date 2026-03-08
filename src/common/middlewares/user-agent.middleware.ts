import { NextFunction, Request, Response } from "express";
import { UAParser } from "ua-parser-js";

export function userAgentMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    const uaString = req.headers["user-agent"] || "";
    const ip =
      req.ip || req.header["x-forwarded-for"] || req.socket.remoteAddress;

    const parser = new UAParser(uaString);
    const result = parser.getResult();

    req["userAgent"] = {
      browser:
        `${result.browser.name || ""} ${result.browser.version || ""}`.trim(),
      os: `${result.os.name || ""} ${result.os.version || ""}`.trim(),
      device: result.device.model || "",
      ua: result.ua
    };

    req["clientRequestInfo"] = {
      ip,
      userAgent: req["userAgent"]
    };

    next();
  };
}
