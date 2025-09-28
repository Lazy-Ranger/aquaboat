import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/users.service';
import { MongooseModuleModel } from '../users/infra/db/user-mongo.module';

@Module({
  imports: [MongooseModuleModel],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
