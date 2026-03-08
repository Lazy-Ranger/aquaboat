import { Module, Provider } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AUTH_REPO } from "../../../tokens";
import { AuthSessionMongoMapper } from "./mapper/auth.session-mongo.mapper";
import { AuthMongoRepo } from "./repos/auth.mongo.repo";
import { AUTH_SESSION_MODEL, AuthSessionSchemaDef } from "./schemas";

const MODELS = [
  {
    name: AUTH_SESSION_MODEL,
    schema: AuthSessionSchemaDef
  }
];

const PROVIDERS: Provider[] = [
  AuthSessionMongoMapper,
  {
    provide: AUTH_REPO,
    useClass: AuthMongoRepo
  }
];

@Module({
  imports: [MongooseModule.forFeature(MODELS)],
  providers: PROVIDERS,
  exports: PROVIDERS
})
export class AuthMongoModule {}
