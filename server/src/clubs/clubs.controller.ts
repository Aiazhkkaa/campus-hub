import { Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ClubCategory } from '../generated/prisma/enums.js';
import type { AuthUser } from '../auth/auth-user.js';
import { JwtAuthGuard } from '../auth/auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { cleanQuery } from '../common/search.js';
import { ClubsService } from './clubs.service.js';

function parseCategory(value?: string): ClubCategory | undefined {
  return Object.values(ClubCategory).find((c) => c === value);
}

@Controller('clubs')
@UseGuards(JwtAuthGuard)
export class ClubsController {
  constructor(private readonly clubs: ClubsService) {}

  @Get()
  list(@CurrentUser() user: AuthUser, @Query('category') category?: string, @Query('q') q?: string) {
    return this.clubs.list(user.id, parseCategory(category), cleanQuery(q));
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.clubs.findOne(id, user);
  }

  @Post(':id/follow')
  follow(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.clubs.follow(id, user);
  }

  @Delete(':id/follow')
  unfollow(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.clubs.unfollow(id, user);
  }
}
