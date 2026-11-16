import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import type { AuthUser } from '../auth/auth-user.js';
import { JwtAuthGuard } from '../auth/auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { CreatePollDto, VoteDto } from './polls.dto.js';
import { PollsService } from './polls.service.js';

@Controller('polls')
@UseGuards(JwtAuthGuard)
export class PollsController {
  constructor(private readonly polls: PollsService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.polls.list(user.id);
  }

  @Post()
  create(@Body() dto: CreatePollDto, @CurrentUser() user: AuthUser) {
    return this.polls.create(user.id, dto);
  }

  @Post(':id/vote')
  vote(@Param('id') id: string, @Body() dto: VoteDto, @CurrentUser() user: AuthUser) {
    return this.polls.vote(id, user.id, dto.optionId);
  }

  @Delete(':id/vote')
  removeVote(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.polls.removeVote(id, user.id);
  }
}
