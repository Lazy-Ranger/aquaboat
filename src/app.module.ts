import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './users/user.module';
import configuration from './config/configuration';
import { DatabaseModule } from './infra/mongoose/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      load: configuration,
      expandVariables: true,
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
  ],
  controllers: [],
})
export class AppModule {}
