import { Module, Global } from '@nestjs/common';
import { UserSchema, USER_MODEL } from './user.schema';
import { MongooseModule } from '@nestjs/mongoose';

const MODELS = [
  {
    name: USER_MODEL,
    schema: UserSchema,
  },
];

@Global()
@Module({
  imports: [MongooseModule.forFeature(MODELS)],
  exports: [MongooseModule],
})
export class MongooseModuleModel {}
