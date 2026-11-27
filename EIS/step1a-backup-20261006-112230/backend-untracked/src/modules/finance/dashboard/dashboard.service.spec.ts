jest.mock('../../../../generated/prisma/client', () => ({
  PrismaClient: class {},
  Prisma: {},
}));
jest.mock('@prisma/adapter-pg', () => ({ PrismaPg: class {} }));

import { FinanceDashboardService } from './dashboard.service';
import { isFinanceActionable } from '../approvals/proposal-states';

const groups = (counts: Record<string, number>) =>
  Object.entries(counts).map(([status, n]) => ({
    status,
    _count: { _all: n },
  }));

describe('FinanceDashboardService — queue counts', () => {
  // The same mix the Finance approval pages are filtered from.
  const pop = {
    pending: 13,
    hod_approved: 6,
    principal_approved: 6,
    finance_approved: 13,
    rejected: 1,
  };
  const sop = {
    pending: 9,
    hod_approved: 4,
    principal_approved: 4,
    finance_approved: 1,
  };

  function build() {
    const prisma = {
      finance_funds: { findMany: jest.fn().mockResolvedValue([]) },
      purchase_order_proposals: {
        groupBy: jest.fn().mockResolvedValue(groups(pop)),
      },
      service_order_proposals: {
        groupBy: jest.fn().mockResolvedValue(groups(sop)),
      },
      finance_order_tracking: { findMany: jest.fn().mockResolvedValue([]) },
      finance_ledger_entries: { findMany: jest.fn().mockResolvedValue([]) },
      $queryRaw: jest.fn().mockResolvedValue([]),
    };
    return new FinanceDashboardService(prisma as never);
  }

  /** What the approval page shows as "Awaiting your decision" for the same rows. */
  const queueCount = (counts: Record<string, number>) =>
    Object.entries(counts)
      .filter(([status]) => isFinanceActionable(status))
      .reduce((sum, [, n]) => sum + n, 0);

  it('"awaiting decision" counts exactly the proposals Finance can decide', async () => {
    const { queues } = await build().overview();

    expect(queues.pop_pending).toBe(12);
    expect(queues.sop_pending).toBe(8);
    expect(queues.pop_pending).toBe(queueCount(pop));
    expect(queues.sop_pending).toBe(queueCount(sop));
  });

  it('proposals still with the HoD are reported separately, not as Finance work', async () => {
    const { queues } = await build().overview();

    expect(queues.pop_awaiting_hod).toBe(13);
    expect(queues.sop_awaiting_hod).toBe(9);
  });

  it('"approved" counts only Finance-approved (funded) proposals', async () => {
    const { queues } = await build().overview();

    expect(queues.pop_approved).toBe(13);
    expect(queues.sop_approved).toBe(1);
    expect(queues.rejected).toBe(1);
  });

  it('every proposal lands in exactly one bucket', async () => {
    const { queues } = await build().overview();
    const total = (c: Record<string, number>) =>
      Object.values(c).reduce((s, n) => s + n, 0);

    expect(
      queues.pop_pending +
        queues.sop_pending +
        queues.pop_awaiting_hod +
        queues.sop_awaiting_hod +
        queues.pop_approved +
        queues.sop_approved +
        queues.rejected,
    ).toBe(total(pop) + total(sop));
  });
});
