import type { Request } from 'express';
import type { Role } from '../generated/prisma/client.js';

/** What we know about the logged-in user on every request (read from the token). */
export interface AuthUser {
  id: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}
