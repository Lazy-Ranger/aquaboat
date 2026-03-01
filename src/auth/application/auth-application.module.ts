import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "src/user/user.module";
import interceptorsProviders from "../interceptors/interceptors.provider";
import JwtStrategy from "../strategies/strategies.provider";
import useCasesProviders from "./use-cases/use-case.provider";

const PROVIDERS = [
  ...JwtStrategy,
  ...useCasesProviders,
  ...interceptorsProviders
];
@Module({
  imports: [UserModule, PassportModule, JwtModule],
  providers: PROVIDERS,
  exports: [...PROVIDERS, JwtModule]
})
export class AuthApplicationModule {}
