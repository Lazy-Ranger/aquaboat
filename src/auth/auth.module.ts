import { Module } from "@nestjs/common";
import { AuthApplicationModule } from "./application/auth-application.module";
import { AuthHttpEntryPointModule } from "./entry-points/http/auth-http-entry-point.module";

@Module({
  imports: [AuthApplicationModule, AuthHttpEntryPointModule],
  exports: [AuthApplicationModule]
})
export class AuthModule {}
