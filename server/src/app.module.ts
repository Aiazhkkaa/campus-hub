import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { ActivitiesModule } from './activities/activities.module.js';
import { EventsModule } from './events/events.module.js';
import { ClubsModule } from './clubs/clubs.module.js';
import { SeedModule } from './seed/seed.module.js';
import { PollsModule } from './polls/polls.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    ObserveModule.forRoot({
      appKey: process.env.OBSERVE_APP_KEY ?? 'YOUR_APP_KEY',
      appSecret: process.env.OBSERVE_APP_SECRET ?? 'YOUR_APP_SECRET',
      serviceId: 'server',
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ActivitiesModule,
    EventsModule,
    ClubsModule,
    PollsModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
