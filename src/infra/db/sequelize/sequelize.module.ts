import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { SequelizeConfigService } from "./sequelize-config.service";

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: SequelizeConfigService,
    }),
  ],
  exports: [],
})
export class MongoModule {}
