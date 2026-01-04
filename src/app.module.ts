import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module";
import configuration from "./config/configuration";
import { AppInfraModule } from "./infra/app-infra.module";
import { UserModule } from "./user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      load: configuration,
      expandVariables: true,
      isGlobal: true
    }),
    AppInfraModule,
    UserModule,
    AuthModule
  ],
  controllers: []
})
export class AppModule {}
