import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AppConfig, AppEnv } from "./config/app.config";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<AppConfig>);

  const port = configService.getOrThrow<number>("app.port");
  const appEnv = configService.getOrThrow<AppEnv>("app.env");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(port);

  console.log(
    `Application is running on: http://localhost:${port} in env ${appEnv}`,
  );
}
bootstrap();
