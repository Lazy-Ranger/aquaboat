import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "src/user/user.module";
import { JwtConfig } from "../../config/jwt.config";
import JwtStrategy from "../strategies/strategies.provider";
import useCasesProviders from "./use-cases/use-case.provider";

const PROVIDERS = [...JwtStrategy, ...useCasesProviders];
@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<JwtConfig>) => {
        return {
          secret: configService.get("jwt.secret"),
          signOptions: { expiresIn: configService.get("jwt.expireTime") }
        };
      }
    })
  ],
  providers: PROVIDERS,
  exports: [...PROVIDERS, JwtModule]
})
export class AuthApplicationModule {}
