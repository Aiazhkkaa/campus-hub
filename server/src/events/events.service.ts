import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { AuthUser } from '../auth/auth-user.js';
import { isUniqueError } from '../common/prisma-errors.js';
import { contains } from '../common/search.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateEventDto } from './events.dto.js';
import { eventInclude, toEventDto } from './events.mapper.js';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string, q?: string) {
    const rows = await this.prisma.event.findMany({
      where: {
        startsAt: { gte: new Date() },
        ...(q ? { OR: [{ title: contains(q) }, { description: contains(q) }, { location: contains(q) }] } : {}),
      },
      include: eventInclude(userId),
      orderBy: { startsAt: 'asc' },
      take: 60,
    });
    return rows.map(toEventDto);
  }

  async findOne(id: string, userId: string) {
    const row = await this.prisma.event.findUnique({ where: { id }, include: eventInclude(userId) });
    if (!row) throw new NotFoundException('Event not found');
    return toEventDto(row);
  }

  /** Admins can create any event; club representatives only for their own club. */
  async create(user: AuthUser, dto: CreateEventDto) {
    if (user.role !== 'ADMIN') {
      if (!dto.clubId) throw new ForbiddenException('Only club representatives can create events');
      const rep = await this.prisma.clubMember.findFirst({
        where: { userId: user.id, clubId: dto.clubId, role: 'REPRESENTATIVE', status: 'APPROVED' },
      });
      if (!rep) throw new ForbiddenException('You are not a representative of this club');
    }

    const startsAt = new Date(dto.startsAt);
    if (startsAt < new Date()) throw new BadRequestException('Please choose a time in the future');

    const event = await this.prisma.event.create({
      data: {
        title: dto.title.trim(),
        description: dto.description.trim(),
        startsAt,
        location: dto.location.trim(),
        imageUrl: dto.imageUrl || null,
        capacity: dto.capacity ?? null,
        registrationUrl: dto.registrationUrl || null,
        clubId: dto.clubId ?? null,
        createdById: user.id,
      },
    });
    return this.findOne(event.id, user.id);
  }

  async register(id: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: { _count: { select: { registrations: true } } },
    });
    if (!event) throw new NotFoundException('Event not found');
    if (event.startsAt < new Date()) throw new BadRequestException('This event has already started');
    if (event.capacity !== null && event._count.registrations >= event.capacity) {
      throw new BadRequestException('Sorry, this event is full');
    }

    try {
      await this.prisma.eventRegistration.create({ data: { userId, eventId: id } });
    } catch (error) {
      if (isUniqueError(error)) throw new ConflictException('You are already registered');
      throw error;
    }
    return this.findOne(id, userId);
  }

  async unregister(id: string, userId: string) {
    await this.prisma.eventRegistration.deleteMany({ where: { userId, eventId: id } });
    return this.findOne(id, userId);
  }
}
