import { Module, Global } from '@nestjs/common';
import { UserSchemaDef, USER_MODEL } from './schemas';
import { MongooseModule } from '@nestjs/mongoose';

const MODELS = [
  {
    name: USER_MODEL,
    schema: UserSchemaDef,
  },
];

@Global()
@Module({
  imports: [MongooseModule.forFeature(MODELS)],
  exports: [MongooseModule],
})
export class MongooseModuleModel {}
