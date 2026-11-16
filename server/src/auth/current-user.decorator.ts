import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { AuthRequest } from './auth-user.js';

/** Usage in a controller: `@CurrentUser() user: AuthUser` */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    context.switchToHttp().getRequest<AuthRequest>().user,
);
