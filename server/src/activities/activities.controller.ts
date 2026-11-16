import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ActivityCategory } from '../generated/prisma/enums.js';
import type { AuthUser } from '../auth/auth-user.js';
import { JwtAuthGuard } from '../auth/auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { cleanQuery } from '../common/search.js';
import { CreateActivityDto } from './activities.dto.js';
import { ActivitiesService } from './activities.service.js';

function parseCategory(value?: string): ActivityCategory | undefined {
  return Object.values(ActivityCategory).find((c) => c === value);
}

@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private readonly activities: ActivitiesService) {}

  @Get()
  list(@CurrentUser() user: AuthUser, @Query('category') category?: string, @Query('q') q?: string) {
    return this.activities.list(user.id, parseCategory(category), cleanQuery(q));
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.activities.findOne(id, user.id);
  }

  @Post()
  create(@Body() dto: CreateActivityDto, @CurrentUser() user: AuthUser) {
    return this.activities.create(user.id, dto);
  }

  @Post(':id/cancel')
  cancel(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.activities.cancel(id, user.id);
  }

  @Post(':id/join')
  join(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.activities.join(id, user.id);
  }

  @Delete(':id/join')
  leave(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.activities.leave(id, user.id);
  }
}
