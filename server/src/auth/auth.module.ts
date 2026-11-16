import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { JwtAuthGuard } from './auth.guard.js';
import { AuthService } from './auth.service.js';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard],
  // Other modules import AuthModule to protect their routes with JwtAuthGuard
  exports: [AuthService, JwtAuthGuard],
})
export class AuthModule {}
