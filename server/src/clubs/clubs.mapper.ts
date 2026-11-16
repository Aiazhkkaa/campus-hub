import type { Club } from '../generated/prisma/client.js';
import { NO_USER } from '../common/constants.js';

export function clubInclude(userId?: string) {
  return {
    _count: { select: { followers: true } },
    followers: { where: { userId: userId ?? NO_USER }, select: { userId: true } },
  } as const;
}

export type ClubRow = Club & {
  _count: { followers: number };
  followers: { userId: string }[];
};

export function toClubDto(c: ClubRow) {
  return {
    id: c.id,
    name: c.name,
    description: c.description,
    category: c.category,
    logoUrl: c.logoUrl,
    followerCount: c._count.followers,
    isFollowing: c.followers.length > 0,
  };
}
