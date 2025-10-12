import { Module } from "@nestjs/common";
import { CacheModule } from "./cache/cache.module";
import { DatabaseModule } from "./db/database.module";

@Module({
  imports: [DatabaseModule, CacheModule],
  exports: [DatabaseModule, CacheModule],
})
export class AppInfraModule {}
