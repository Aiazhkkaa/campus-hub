/** True when Prisma rejected a write because a unique value already exists (code P2002). */
export function isUniqueError(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'P2002'
  );
}
