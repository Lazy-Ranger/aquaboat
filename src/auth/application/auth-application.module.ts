import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from "src/user/user.module";
import { GenerateToken, RegisterUserUseCase } from "./use-cases";

const PROVIDERS = [RegisterUserUseCase, GenerateToken];

@Module({
  imports: [
    UserModule,
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
