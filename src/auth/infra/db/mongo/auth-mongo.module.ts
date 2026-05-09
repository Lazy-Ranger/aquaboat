import { Module, Provider } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { SESSION_REPO } from "../../../tokens";
import { AuthSessionMongoMapper } from "./mapper/session-mongo.mapper";
import { SessionMongoRepo } from "./repos/session.mongo.repo";
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
    provide: SESSION_REPO,
    useClass: SessionMongoRepo
  }
];

@Module({
  imports: [MongooseModule.forFeature(MODELS)],
  providers: PROVIDERS,
  exports: PROVIDERS
})
export class AuthMongoModule {}
