import { Global, Module, Provider } from "@nestjs/common";
import { CACHE_SERVICE } from "../../tokens";
import { RedisService } from "./adapters/redis.service";

const PROVIDERS: Provider[] = [
  {
    provide: CACHE_SERVICE,
    useClass: RedisService
  }
];

@Global()
@Module({
  providers: PROVIDERS,
  exports: PROVIDERS
})
export class CacheModule {}
