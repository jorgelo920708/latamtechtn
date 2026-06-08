import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const defaultCorsOrigins = [
  'http://localhost:4200',
  'http://localhost',
  'https://latamtechtn.com',
  'https://www.latamtechtn.com',
];

function getCorsOrigins() {
  const configuredOrigins =
    process.env.CORS_ORIGINS ?? process.env.ALLOWED_ORIGINS;
  if (!configuredOrigins) return defaultCorsOrigins;

  return [
    ...defaultCorsOrigins,
    ...configuredOrigins
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  ];
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: getCorsOrigins(),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
