import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });

  // All API routes start with /api, e.g. GET /api/activities
  app.setGlobalPrefix('api');

  // Allow the Angular app (another port = another "origin") to call this API
  app.enableCors({ origin: process.env.CLIENT_URL ?? 'http://localhost:4200' });

  // Validate every request body against its DTO class and drop unknown fields
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(process.env.PORT ?? 3001);
}
await bootstrap();
