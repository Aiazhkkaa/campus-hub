import { Injectable, NotFoundException } from '@nestjs/common';
import type { ClubCategory } from '../generated/prisma/enums.js';
import type { AuthUser } from '../auth/auth-user.js';
import { eventInclude, toEventDto } from '../events/events.mapper.js';
import { contains } from '../common/search.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { clubInclude, toClubDto } from './clubs.mapper.js';

@Injectable()
export class ClubsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string, category?: ClubCategory, q?: string) {
    const rows = await this.prisma.club.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(q ? { OR: [{ name: contains(q) }, { description: contains(q) }] } : {}),
      },
      include: clubInclude(userId),
      orderBy: { name: 'asc' },
    });
    return rows.map(toClubDto);
  }

  async findOne(id: string, user: AuthUser) {
    const row = await this.prisma.club.findUnique({ where: { id }, include: clubInclude(user.id) });
    if (!row) throw new NotFoundException('Club not found');

    const [events, rep] = await Promise.all([
      this.prisma.event.findMany({
        where: { clubId: id, startsAt: { gte: new Date() } },
        include: eventInclude(user.id),
        orderBy: { startsAt: 'asc' },
        take: 12,
      }),
      this.prisma.clubMember.findFirst({
        where: { userId: user.id, clubId: id, role: 'REPRESENTATIVE', status: 'APPROVED' },
      }),
    ]);

    return {
      ...toClubDto(row),
      events: events.map(toEventDto),
      canManage: user.role === 'ADMIN' || rep !== null,
    };
  }

  async follow(id: string, user: AuthUser) {
    await this.ensureExists(id);
    await this.prisma.clubFollow.upsert({
      where: { userId_clubId: { userId: user.id, clubId: id } },
      create: { userId: user.id, clubId: id },
      update: {},
    });
    return this.findOne(id, user);
  }

  async unfollow(id: string, user: AuthUser) {
    await this.prisma.clubFollow.deleteMany({ where: { userId: user.id, clubId: id } });
    return this.findOne(id, user);
  }

  private async ensureExists(id: string) {
    const club = await this.prisma.club.findUnique({ where: { id }, select: { id: true } });
    if (!club) throw new NotFoundException('Club not found');
  }
}
