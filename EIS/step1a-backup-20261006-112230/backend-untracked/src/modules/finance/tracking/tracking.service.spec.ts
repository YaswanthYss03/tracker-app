jest.mock('../../../../generated/prisma/client', () => ({
  PrismaClient: class {},
  Prisma: { PrismaClientKnownRequestError: class {} },
}));
jest.mock('@prisma/adapter-pg', () => ({ PrismaPg: class {} }));

import { FinanceTrackingService } from './tracking.service';

describe('FinanceTrackingService.update — cancelling an order', () => {
  const ctx = { ip: null, userAgent: null };
  let prisma: any;
  let audit: { record: jest.Mock };
  let service: FinanceTrackingService;

  beforeEach(() => {
    prisma = {
      finance_order_tracking: {
        findUnique: jest.fn().mockResolvedValue({
          id: 5,
          order_kind: 'purchase',
          purchase_order_id: 70,
          service_order_id: null,
          delivery_status: 'ordered',
          quantity_delivered: 0,
          quantity_ordered: 2,
        }),
        update: jest.fn(),
      },
      purchase_orders: {
        findUnique: jest.fn().mockResolvedValue({ proposal_id: 7 }),
      },
      service_orders: { findUnique: jest.fn() },
      finance_ledger_entries: { findMany: jest.fn().mockResolvedValue([]) },
    };
    audit = { record: jest.fn().mockResolvedValue(undefined) };
    service = new FinanceTrackingService(prisma as never, audit as never);
  });

  const cancelled = {
    id: 5,
    order_kind: 'purchase',
    purchase_order_id: 70,
    service_order_id: null,
    delivery_status: 'cancelled',
    quantity_delivered: 0,
  };

  it('reports, and audits, a commitment left standing by the cancellation', async () => {
    prisma.finance_order_tracking.update.mockResolvedValue(cancelled);
    prisma.finance_ledger_entries.findMany.mockResolvedValue([
      {
        entry_type: 'debit',
        amount: 4000,
        purchase_order_proposal_id: 7,
        service_order_proposal_id: null,
      },
    ]);

    const result = await service.update(
      5,
      { delivery_status: 'cancelled' } as never,
      42,
      ctx,
    );

    expect(result).toEqual({
      id: 5,
      delivery_status: 'cancelled',
      unreleased_commitment: 4000,
    });
    expect(audit.record).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'tracking.updated',
        after: expect.objectContaining({
          delivery_status: 'cancelled',
          unreleased_commitment: 4000,
        }),
      }),
    );
  });

  it('reports nothing outstanding when the commitment was already released', async () => {
    prisma.finance_order_tracking.update.mockResolvedValue(cancelled);
    prisma.finance_ledger_entries.findMany.mockResolvedValue([
      {
        entry_type: 'debit',
        amount: 4000,
        purchase_order_proposal_id: 7,
        service_order_proposal_id: null,
      },
      {
        entry_type: 'reversal',
        amount: 4000,
        purchase_order_proposal_id: 7,
        service_order_proposal_id: null,
      },
    ]);

    const result = await service.update(
      5,
      { delivery_status: 'cancelled' } as never,
      42,
      ctx,
    );

    expect(result.unreleased_commitment).toBe(0);
    expect(audit.record.mock.calls[0][0].after).not.toHaveProperty(
      'unreleased_commitment',
    );
  });

  it('never writes to the ledger or the fund itself', async () => {
    prisma.finance_order_tracking.update.mockResolvedValue(cancelled);

    await service.update(5, { delivery_status: 'cancelled' } as never, 42, ctx);

    expect(prisma.finance_ledger_entries).not.toHaveProperty('create');
  });

  it('does not look up commitments for an ordinary stage change', async () => {
    prisma.finance_order_tracking.update.mockResolvedValue({
      ...cancelled,
      delivery_status: 'dispatched',
    });

    const result = await service.update(
      5,
      { delivery_status: 'dispatched' } as never,
      42,
      ctx,
    );

    expect(result.unreleased_commitment).toBe(0);
    expect(prisma.purchase_orders.findUnique).not.toHaveBeenCalled();
  });
});
