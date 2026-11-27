/**
 * The POP/SOP approval state machine, in one place.
 *
 *   pending ──HoD──► hod_approved ──Finance──► finance_approved  (fund debited, order placed)
 *      │                  │
 *      └──HoD reject──►   └──Finance reject──► rejected
 *
 * The Principal is not part of this workflow. `principal_approved` is a legacy
 * status left on rows decided before that was settled; every such row had
 * already been HoD-approved, so Finance treats it exactly like `hod_approved`.
 * Nothing writes `principal_approved` any more.
 *
 * Every queue, count and guard that asks "can Finance act on this?" must use
 * these definitions rather than its own status literal, so the dashboard, the
 * approval pages and the decision endpoint can never disagree.
 */
export const AWAITING_HOD_STATUS = 'pending' as const;

export const FINANCE_ACTIONABLE_STATUSES = [
  'hod_approved',
  'principal_approved',
] as const;

export type FinanceActionableStatus =
  (typeof FINANCE_ACTIONABLE_STATUSES)[number];

export function isFinanceActionable(
  status: string,
): status is FinanceActionableStatus {
  return (FINANCE_ACTIONABLE_STATUSES as readonly string[]).includes(status);
}

/** Sums the given statuses out of a Prisma `groupBy({ by: ['status'] })` result. */
export function countStatuses(
  groups: Array<{ status: string; _count: { _all: number } }>,
  statuses: readonly string[],
): number {
  return groups
    .filter((g) => statuses.includes(g.status))
    .reduce((sum, g) => sum + g._count._all, 0);
}
