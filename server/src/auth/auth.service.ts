import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { Role, User } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { AuthUser } from './auth-user.js';
import { LoginDto, RegisterDto } from './auth.dto.js';

const TOKEN_TTL = '7d';

function jwtSecret(): string {
  return process.env.JWT_SECRET ?? 'dev-only-secret-change-me';
}

/** The user object we send to the browser — never includes the password hash. */
export function toPublicUser(user: User) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    faculty: user.faculty,
    year: user.year,
    bio: user.bio,
    role: user.role,
  };
}

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();

    // Optional: only allow university emails, e.g. ALLOWED_EMAIL_DOMAIN="kbtu.kz"
    const domain = process.env.ALLOWED_EMAIL_DOMAIN;
    if (domain && !email.endsWith(`@${domain}`)) {
      throw new BadRequestException(`Please use your @${domain} university email`);
    }

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('An account with this email already exists');

    const user = await this.prisma.user.create({
      data: {
        email,
        name: dto.name.trim(),
        faculty: dto.faculty?.trim() || null,
        year: dto.year ?? null,
        passwordHash: await bcrypt.hash(dto.password, 10),
      },
    });
    return this.session(user);
  }

  async login(dto: LoginDto) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email } });
    const ok = user ? await bcrypt.compare(dto.password, user.passwordHash) : false;
    if (!user || !ok) throw new UnauthorizedException('Invalid email or password');
    return this.session(user);
  }

  async me(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return toPublicUser(user);
  }

  /** Reads a token. Returns the user inside it, or null if the token is missing/invalid/expired. */
  verifyToken(token: string): AuthUser | null {
    try {
      const payload = jwt.verify(token, jwtSecret()) as { sub: string; role: Role };
      return { id: payload.sub, role: payload.role };
    } catch {
      return null;
    }
  }

  private session(user: User) {
    const token = jwt.sign({ sub: user.id, role: user.role }, jwtSecret(), { expiresIn: TOKEN_TTL });
    return { token, user: toPublicUser(user) };
  }
}
