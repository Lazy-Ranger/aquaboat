import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  'DATABASE.USER': string;
  'DATABASE.PASSWORD': string;
  'DATABASE.HOST': string;
  'DATABASE.NAME': string;
  'DATABASE.PORT': string;
  'DATABASE.url': string;
  'DATABASE.isLocal()': boolean;
}

export const DATABASE_CONFIG = registerAs('DATABASE', () => {
  const userName = process.env.DATABASE_USER;
  const password = process.env.DATABASE_PASSWORD;
  const host = process.env.DATABASE_HOST;
  const name = process.env.DATABASE_NAME;
  const port = process.env.DATABASE_PORT;

  return {
    USER: userName,
    PASSWORD: password,
    HOST: host,
    NAME: name,
    PORT: port,
    get url() {
      if (process.env['NODE_ENV'] === 'LOCAL') {
        return {
          uri: 'mongodb://localhost:27017/aquabot',
        };
      }

      return `mongodb+srv://${userName}:${password}@${host}/${name}?retryWrites=true&w=majority&appName=Cluster0`;
    },
    isLocal() {
      return process.env['DATABASE_HOST']?.includes('localhost') ?? false;
    },
  };
});
