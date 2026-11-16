import { Injectable, NotFoundException } from '@nestjs/common';
import { activityInclude, toActivityDto } from '../activities/activities.mapper.js';
import { toPublicUser } from '../auth/auth.service.js';
import { clubInclude, toClubDto } from '../clubs/clubs.mapper.js';
import { eventInclude, toEventDto } from '../events/events.mapper.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateProfileDto } from './users.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /** Everything for the profile & home page: who I am + my upcoming plans + my clubs. */
  async profile(userId: string) {
    const now = new Date();
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const [activities, events, clubs] = await Promise.all([
      this.prisma.activity.findMany({
        where: { status: 'OPEN', startsAt: { gte: now }, participants: { some: { userId } } },
        include: activityInclude(userId),
        orderBy: { startsAt: 'asc' },
      }),
      this.prisma.event.findMany({
        where: { startsAt: { gte: now }, registrations: { some: { userId } } },
        include: eventInclude(userId),
        orderBy: { startsAt: 'asc' },
      }),
      this.prisma.club.findMany({
        where: { followers: { some: { userId } } },
        include: clubInclude(userId),
        orderBy: { name: 'asc' },
      }),
    ]);

    return {
      user: toPublicUser(user),
      activities: activities.map((a) => toActivityDto(a, userId)),
      events: events.map(toEventDto),
      clubs: clubs.map(toClubDto),
    };
  }

  async update(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name?.trim(),
        faculty: dto.faculty === undefined ? undefined : dto.faculty.trim() || null,
        year: dto.year,
        bio: dto.bio === undefined ? undefined : dto.bio.trim() || null,
        avatarUrl: dto.avatarUrl === undefined ? undefined : dto.avatarUrl || null,
      },
    });
    return toPublicUser(user);
  }
}
