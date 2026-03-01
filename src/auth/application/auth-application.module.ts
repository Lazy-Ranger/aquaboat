import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "src/user/user.module";
import JwtStrategy from "../strategies/strategies.provider";
import servicesProviders from "./services/service.provider";
import useCasesProviders from "./use-cases/use-case.provider";

const PROVIDERS = [...JwtStrategy, ...useCasesProviders, ...servicesProviders];
@Module({
  imports: [UserModule, PassportModule, JwtModule],
  providers: PROVIDERS,
  exports: [JwtModule, ...useCasesProviders, ...servicesProviders]
})
export class AuthApplicationModule {}
