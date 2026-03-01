import { registerAs } from "@nestjs/config";

export interface PlatformConfig {
  "platform.name": string;
}

export const getPlatformConfig = () => {
  return {
    name: process.env["ORG_NAME"]
  };
};

export const PLATFORM_CONFIG = registerAs("platform", getPlatformConfig);
