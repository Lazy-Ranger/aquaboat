import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration";
import { AppInfraModule } from "./infra/app-infra.module";
import { UserModule } from "./users/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      load: configuration,
      expandVariables: true,
      isGlobal: true,
    }),
    AppInfraModule,
    UserModule,
  ],
  controllers: [],
})
export class AppModule {}
