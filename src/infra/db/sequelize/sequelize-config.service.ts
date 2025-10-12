import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from "@nestjs/sequelize";
import { DatabaseConfig } from "src/config/database.config";

@Injectable()
export class SequelizeConfigService implements SequelizeOptionsFactory {
  constructor(private readonly config: ConfigService<DatabaseConfig>) {}

  createSequelizeOptions(
    connectionName?: string,
  ): Promise<SequelizeModuleOptions> | SequelizeModuleOptions {
    return {
      dialect: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "admin",
      database: "users_db",
    };
  }
}
