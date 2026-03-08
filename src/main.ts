import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { userAgentMiddleware } from "./common/middlewares/user-agent.middleware";
import { AppConfig, AppEnv } from "./config/app.config";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService<AppConfig>);

  const port = configService.getOrThrow<number>("app.port");
  const appEnv = configService.getOrThrow<AppEnv>("app.env");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true
    })
  );

  app.use(cookieParser());
  app.use(userAgentMiddleware());

  await app.listen(port);

  console.log(
    `Application is running on: http://localhost:${port} in env ${appEnv}`
  );
}
bootstrap();
