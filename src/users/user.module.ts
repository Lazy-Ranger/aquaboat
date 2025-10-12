import { Module } from "@nestjs/common";
import { UserApplicationModule } from "./application/user-application.module";
import { HttpEntryPointModule } from "./entry-points/http/http-entry-point.module";

@Module({
  imports: [UserApplicationModule, HttpEntryPointModule],
  exports: [UserApplicationModule],
})
export class UserModule {}
