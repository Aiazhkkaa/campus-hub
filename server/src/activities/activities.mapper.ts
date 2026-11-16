import type { Activity } from '../generated/prisma/client.js';
import { NO_USER } from '../common/constants.js';

/** Public info about a person (shown on cards and participant lists). */
export const personSelect = { id: true, name: true, avatarUrl: true, faculty: true } as const;

/** What to load together with an activity so we can build the card for `userId`. */
export function activityInclude(userId?: string) {
  return {
    creator: { select: personSelect },
    _count: { select: { participants: true } },
    // Only this user's own participation row -> tells us "isJoined"
    participants: { where: { userId: userId ?? NO_USER }, select: { userId: true } },
  } as const;
}

type Person = { id: string; name: string; avatarUrl: string | null; faculty: string | null };

export type ActivityRow = Activity & {
  creator: Person;
  _count: { participants: number };
  participants: { userId: string }[];
};

/** Turns a database row into the JSON the frontend expects. */
export function toActivityDto(a: ActivityRow, userId?: string) {
  return {
    id: a.id,
    title: a.title,
    description: a.description,
    category: a.category,
    startsAt: a.startsAt,
    location: a.location,
    maxParticipants: a.maxParticipants,
    status: a.status,
    participantCount: a._count.participants,
    isJoined: a.participants.length > 0,
    isCreator: a.creatorId === userId,
    creator: a.creator,
  };
}
