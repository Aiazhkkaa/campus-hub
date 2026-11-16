import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import type { AuthUser } from '../auth/auth-user.js';
import { JwtAuthGuard } from '../auth/auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { cleanQuery } from '../common/search.js';
import { CreateEventDto } from './events.dto.js';
import { EventsService } from './events.service.js';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly events: EventsService) {}

  @Get()
  list(@CurrentUser() user: AuthUser, @Query('q') q?: string) {
    return this.events.list(user.id, cleanQuery(q));
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.events.findOne(id, user.id);
  }

  @Post()
  create(@Body() dto: CreateEventDto, @CurrentUser() user: AuthUser) {
    return this.events.create(user, dto);
  }

  @Post(':id/register')
  register(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.events.register(id, user.id);
  }

  @Delete(':id/register')
  unregister(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.events.unregister(id, user.id);
  }
}
