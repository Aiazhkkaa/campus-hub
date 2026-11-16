/** Cleans a search query from the URL: trims it and ignores empty / too long values. */
export function cleanQuery(q?: string): string | undefined {
  const value = q?.trim();
  return value && value.length <= 100 ? value : undefined;
}

/** Prisma filter: "text contains q", ignoring upper/lower case. */
export function contains(q: string) {
  return { contains: q, mode: 'insensitive' as const };
}
