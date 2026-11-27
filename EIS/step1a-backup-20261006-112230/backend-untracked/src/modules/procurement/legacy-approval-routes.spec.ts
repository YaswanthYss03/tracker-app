jest.mock('../../../generated/prisma/client', () => ({
  PrismaClient: class {},
  Prisma: { sql: () => ({}) },
}));
jest.mock('@prisma/adapter-pg', () => ({ PrismaPg: class {} }));

// Controller methods are referenced below only as metadata keys for the
// roles guard; they are never invoked detached from their instance.
/* eslint-disable @typescript-eslint/unbound-method */
import {
  ExecutionContext,
  ForbiddenException,
  GoneException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ROLES } from 'src/common/constants/roles.constant';
import { PurchaseOrderProposalsController } from './purchase-order-proposals/purchase-order-proposals.controller';
import { PurchaseOrderProposalsService } from './purchase-order-proposals/purchase-order-proposals.service';
import { ServiceOrderProposalsController } from './service-order-proposals/service-order-proposals.controller';
import { ServiceOrderProposalsService } from './service-order-proposals/service-order-proposals.service';
import { PrincipalApprovalsController } from '../principal-approvals/principal-approvals.controller';
import { PrincipalApprovalsService } from '../principal-approvals/principal-approvals.service';

/**
 * The routes below used to change a proposal's approval status outside the
 * one real implementation (FinanceApprovalsService.decide for Finance,
 * Purchase/ServiceRequestsService.hodReview for the HoD). They must stay
 * answerable — an old client gets a clear 410 — but must never write.
 */
describe('retired approval routes cannot bypass the state machine', () => {
  // A service double with NO methods: any attempt to delegate would throw a
  // TypeError rather than the GoneException asserted below.
  const noService = {} as never;

  const cases: Array<[string, () => unknown]> = [
    [
      'PATCH /purchase-order-proposals/:id/finance-review',
      () => new PurchaseOrderProposalsController(noService).financeReview(1),
    ],
    [
      'PATCH /purchase-order-proposals/:id/hod-review',
      () => new PurchaseOrderProposalsController(noService).hodReview(1),
    ],
    [
      'PATCH /service-order-proposals/:id/finance-review',
      () => new ServiceOrderProposalsController(noService).financeReview(1),
    ],
    [
      'PATCH /service-order-proposals/:id/hod-review',
      () => new ServiceOrderProposalsController(noService).hodReview(1),
    ],
    [
      'PATCH /principal-approvals/purchase/:id/approve',
      () => new PrincipalApprovalsController(noService).approvePurchase(1),
    ],
    [
      'PATCH /principal-approvals/purchase/:id/reject',
      () => new PrincipalApprovalsController(noService).rejectPurchase(1),
    ],
    [
      'PATCH /principal-approvals/service/:id/approve',
      () => new PrincipalApprovalsController(noService).approveService(1),
    ],
    [
      'PATCH /principal-approvals/service/:id/reject',
      () => new PrincipalApprovalsController(noService).rejectService(1),
    ],
  ];

  it.each(cases)(
    '%s answers 410 Gone with ENDPOINT_RETIRED',
    (_route, call) => {
      try {
        call();
        throw new Error('expected the route to be retired');
      } catch (err) {
        expect(err).toBeInstanceOf(GoneException);
        expect((err as GoneException).getStatus()).toBe(410);
        expect((err as GoneException).getResponse()).toMatchObject({
          errorCode: 'ENDPOINT_RETIRED',
        });
      }
    },
  );

  it('the services no longer expose any way to set an approval status', () => {
    for (const proto of [
      PurchaseOrderProposalsService.prototype,
      ServiceOrderProposalsService.prototype,
    ] as unknown as Record<string, unknown>[]) {
      expect(proto.financeReview).toBeUndefined();
      expect(proto.hodReview).toBeUndefined();
    }
    for (const method of [
      'approvePurchase',
      'rejectPurchase',
      'approveService',
      'rejectService',
    ]) {
      expect(
        (
          PrincipalApprovalsService.prototype as unknown as Record<
            string,
            unknown
          >
        )[method],
      ).toBeUndefined();
    }
  });

  it('the only proposal write left on the generic CRUD service is vendor_id', async () => {
    const prisma = {
      purchase_order_proposals: {
        findUnique: jest.fn().mockResolvedValue({
          id: 1,
          status: 'finance_approved',
          vendor_id: null,
        }),
        update: jest.fn().mockResolvedValue({ id: 1 }),
      },
      vendors: { findUnique: jest.fn().mockResolvedValue({ id: 4 }) },
    };
    const service = new PurchaseOrderProposalsService(prisma as never);

    await service.update(1, { vendor_id: 4, status: 'hod_approved' } as never);

    const { data } = prisma.purchase_order_proposals.update.mock.calls[0][0];
    expect(data).not.toHaveProperty('status');
    expect(Object.keys(data)).toEqual(['vendor_id']);
  });

  describe('role guards are unchanged on the retired routes', () => {
    const guard = new RolesGuard(new Reflector());
    const ctx = (
      cls: unknown,
      handler: unknown,
      role: string,
    ): ExecutionContext =>
      ({
        getHandler: () => handler,
        getClass: () => cls,
        switchToHttp: () => ({
          getRequest: () => ({ user: { sub: 1, role } }),
        }),
      }) as unknown as ExecutionContext;

    it('a student is still refused before reaching a retired route', () => {
      expect(() =>
        guard.canActivate(
          ctx(
            PurchaseOrderProposalsController,
            PurchaseOrderProposalsController.prototype.financeReview,
            ROLES.STUDENT,
          ),
        ),
      ).toThrow(ForbiddenException);
      expect(() =>
        guard.canActivate(
          ctx(
            PrincipalApprovalsController,
            PrincipalApprovalsController.prototype.approvePurchase,
            ROLES.STUDENT,
          ),
        ),
      ).toThrow(ForbiddenException);
    });

    it('the HoD cannot reach the retired Finance route', () => {
      expect(() =>
        guard.canActivate(
          ctx(
            ServiceOrderProposalsController,
            ServiceOrderProposalsController.prototype.financeReview,
            ROLES.HOD,
          ),
        ),
      ).toThrow(ForbiddenException);
    });
  });
});
