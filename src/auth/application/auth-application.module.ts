import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "src/user/user.module";
import { JwtStrategy } from "./services";
import {
  GenerateToken,
  RegisterUserUseCase,
  ValidateUserUseCase
} from "./use-cases";

const PROVIDERS = [
  RegisterUserUseCase,
  GenerateToken,
  ValidateUserUseCase,
  JwtStrategy
];
@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get("JWT_SECRET"),
          signOptions: { expiresIn: configService.get("JWT_EXPIRE_TIME") }
        };
      }
    })
  ],
  providers: PROVIDERS,
  exports: PROVIDERS
})
export class AuthApplicationModule {}
