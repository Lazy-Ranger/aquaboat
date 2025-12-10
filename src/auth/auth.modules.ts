import { Module } from "@nestjs/common";
import { AuthApplicationModule } from "./application/auth-application.module";
import { HttpEntryPointModule } from "./entry-points/http/http-entry-point.user.modules";

@Module({
  imports: [AuthApplicationModule, HttpEntryPointModule],
  exports: [AuthApplicationModule]
})
export class AuthModule {}
