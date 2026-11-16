import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import type { AuthUser } from '../auth/auth-user.js';
import { JwtAuthGuard } from '../auth/auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { UpdateProfileDto } from './users.dto.js';
import { UsersService } from './users.service.js';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get('me')
  profile(@CurrentUser() user: AuthUser) {
    return this.users.profile(user.id);
  }

  @Patch('me')
  update(@CurrentUser() user: AuthUser, @Body() dto: UpdateProfileDto) {
    return this.users.update(user.id, dto);
  }
}
