import type { Event } from '../generated/prisma/client.js';
import type { ClubCategory } from '../generated/prisma/enums.js';
import { NO_USER } from '../common/constants.js';

export const clubSummarySelect = { id: true, name: true, category: true, logoUrl: true } as const;

export function eventInclude(userId?: string) {
  return {
    club: { select: clubSummarySelect },
    _count: { select: { registrations: true } },
    registrations: { where: { userId: userId ?? NO_USER }, select: { userId: true } },
  } as const;
}

export type EventRow = Event & {
  club: { id: string; name: string; category: ClubCategory; logoUrl: string | null } | null;
  _count: { registrations: number };
  registrations: { userId: string }[];
};

export function toEventDto(e: EventRow) {
  return {
    id: e.id,
    title: e.title,
    description: e.description,
    startsAt: e.startsAt,
    location: e.location,
    imageUrl: e.imageUrl,
    capacity: e.capacity,
    registrationUrl: e.registrationUrl,
    registrationCount: e._count.registrations,
    isRegistered: e.registrations.length > 0,
    club: e.club,
  };
}
