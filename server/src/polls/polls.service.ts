import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { personSelect } from '../activities/activities.mapper.js';
import { NO_USER } from '../common/constants.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePollDto } from './polls.dto.js';

function pollInclude(userId: string) {
  return {
    creator: { select: personSelect },
    options: {
      orderBy: { position: 'asc' },
      select: { id: true, text: true, _count: { select: { votes: true } } },
    },
    // Only my own vote -> tells us which option I picked
    votes: { where: { userId: userId || NO_USER }, select: { optionId: true } },
  } as const;
}

@Injectable()
export class PollsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string) {
    const polls = await this.prisma.poll.findMany({
      include: pollInclude(userId),
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return polls.map((p) => this.toDto(p));
  }

  async create(userId: string, dto: CreatePollDto) {
    const options = dto.options.map((o) => o.trim()).filter(Boolean);
    if (new Set(options.map((o) => o.toLowerCase())).size !== options.length) {
      throw new BadRequestException('Options must be different');
    }
    const endsAt = dto.endsAt ? new Date(dto.endsAt) : null;
    if (endsAt && endsAt < new Date()) throw new BadRequestException('End date must be in the future');

    const poll = await this.prisma.poll.create({
      data: {
        question: dto.question.trim(),
        endsAt,
        creatorId: userId,
        options: { create: options.map((text, position) => ({ text, position })) },
      },
    });
    return this.findOne(poll.id, userId);
  }

  /** Vote, or change your vote. One vote per person per poll. */
  async vote(pollId: string, userId: string, optionId: string) {
    const poll = await this.prisma.poll.findUnique({
      where: { id: pollId },
      include: { options: { select: { id: true } } },
    });
    if (!poll) throw new NotFoundException('Poll not found');
    if (poll.endsAt && poll.endsAt < new Date()) throw new BadRequestException('This poll is closed');
    if (!poll.options.some((o) => o.id === optionId)) throw new BadRequestException('Unknown option');

    await this.prisma.pollVote.upsert({
      where: { userId_pollId: { userId, pollId } },
      create: { userId, pollId, optionId },
      update: { optionId },
    });
    return this.findOne(pollId, userId);
  }

  async removeVote(pollId: string, userId: string) {
    await this.prisma.pollVote.deleteMany({ where: { userId, pollId } });
    return this.findOne(pollId, userId);
  }

  private async findOne(id: string, userId: string) {
    const poll = await this.prisma.poll.findUnique({ where: { id }, include: pollInclude(userId) });
    if (!poll) throw new NotFoundException('Poll not found');
    return this.toDto(poll);
  }

  private toDto(p: {
    id: string;
    question: string;
    endsAt: Date | null;
    createdAt: Date;
    creatorId: string;
    creator: { id: string; name: string; avatarUrl: string | null; faculty: string | null };
    options: { id: string; text: string; _count: { votes: number } }[];
    votes: { optionId: string }[];
  }) {
    const options = p.options.map((o) => ({ id: o.id, text: o.text, votes: o._count.votes }));
    return {
      id: p.id,
      question: p.question,
      endsAt: p.endsAt,
      createdAt: p.createdAt,
      isClosed: p.endsAt !== null && p.endsAt < new Date(),
      creator: p.creator,
      options,
      totalVotes: options.reduce((sum, o) => sum + o.votes, 0),
      myOptionId: p.votes[0]?.optionId ?? null,
    };
  }
}
