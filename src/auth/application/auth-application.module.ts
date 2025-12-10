import { Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
const PROVIDERS = [];

@Module({
  imports: [UserModule],
  providers: PROVIDERS,
  exports: []
})
export class AuthApplicationModule {}
