import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { ActivityCategory } from '../generated/prisma/enums.js';
import { isUniqueError } from '../common/prisma-errors.js';
import { contains } from '../common/search.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateActivityDto } from './activities.dto.js';
import { activityInclude, personSelect, toActivityDto } from './activities.mapper.js';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  /** Upcoming, not cancelled activities — soonest first. */
  async list(userId: string, category?: ActivityCategory, q?: string) {
    const rows = await this.prisma.activity.findMany({
      where: {
        status: 'OPEN',
        startsAt: { gte: new Date() },
        ...(category ? { category } : {}),
        ...(q ? { OR: [{ title: contains(q) }, { description: contains(q) }, { location: contains(q) }] } : {}),
      },
      include: activityInclude(userId),
      orderBy: { startsAt: 'asc' },
      take: 60,
    });
    return rows.map((a) => toActivityDto(a, userId));
  }

  async findOne(id: string, userId: string) {
    const row = await this.prisma.activity.findUnique({
      where: { id },
      include: activityInclude(userId),
    });
    if (!row) throw new NotFoundException('Activity not found');

    const participants = await this.prisma.activityParticipant.findMany({
      where: { activityId: id },
      orderBy: { joinedAt: 'asc' },
      select: { user: { select: personSelect } },
    });

    return { ...toActivityDto(row, userId), participants: participants.map((p) => p.user) };
  }

  async create(userId: string, dto: CreateActivityDto) {
    const startsAt = new Date(dto.startsAt);
    if (startsAt < new Date()) throw new BadRequestException('Please choose a time in the future');

    const activity = await this.prisma.activity.create({
      data: {
        title: dto.title.trim(),
        description: dto.description.trim(),
        category: dto.category,
        startsAt,
        location: dto.location.trim(),
        maxParticipants: dto.maxParticipants,
        creatorId: userId,
        // The creator is automatically the first participant
        participants: { create: { userId } },
      },
    });
    return this.findOne(activity.id, userId);
  }

  async cancel(id: string, userId: string) {
    const activity = await this.prisma.activity.findUnique({ where: { id } });
    if (!activity) throw new NotFoundException('Activity not found');
    if (activity.creatorId !== userId) {
      throw new ForbiddenException('Only the creator can cancel this activity');
    }
    await this.prisma.activity.update({ where: { id }, data: { status: 'CANCELLED' } });
    return this.findOne(id, userId);
  }

  async join(id: string, userId: string) {
    const activity = await this.prisma.activity.findUnique({
      where: { id },
      include: { _count: { select: { participants: true } } },
    });
    if (!activity) throw new NotFoundException('Activity not found');
    if (activity.status !== 'OPEN') throw new BadRequestException('This activity was cancelled');
    if (activity.startsAt < new Date()) throw new BadRequestException('This activity has already started');
    if (activity._count.participants >= activity.maxParticipants) {
      throw new BadRequestException('This activity is full');
    }

    try {
      await this.prisma.activityParticipant.create({ data: { userId, activityId: id } });
    } catch (error) {
      if (isUniqueError(error)) throw new ConflictException('You have already joined');
      throw error;
    }
    return this.findOne(id, userId);
  }

  async leave(id: string, userId: string) {
    const activity = await this.prisma.activity.findUnique({ where: { id } });
    if (!activity) throw new NotFoundException('Activity not found');
    if (activity.creatorId === userId) {
      throw new BadRequestException('You are the host — cancel the activity instead');
    }
    await this.prisma.activityParticipant.deleteMany({ where: { userId, activityId: id } });
    return this.findOne(id, userId);
  }
}
