import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import type { AuthRequest } from './auth-user.js';
import { AuthService } from './auth.service.js';

function readToken(req: AuthRequest): string | null {
  const header = req.headers.authorization;
  return header?.startsWith('Bearer ') ? header.slice(7) : null;
}

/** Route requires a logged-in user. Puts the user on `request.user`. */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthRequest>();
    const token = readToken(req);
    const user = token ? this.auth.verifyToken(token) : null;
    if (!user) throw new UnauthorizedException('Please log in');
    req.user = user;
    return true;
  }
}
