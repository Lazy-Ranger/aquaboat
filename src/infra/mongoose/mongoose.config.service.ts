import { Injectable } from '@nestjs/common';
import { MongooseOptionsFactory } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { DatabaseConfig } from 'src/config/database.config';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private readonly config: ConfigService<DatabaseConfig>) {}

  createMongooseOptions() {
    return {
      uri: this.config.get<string>('DATABASE.url'),
    };
  }
}
