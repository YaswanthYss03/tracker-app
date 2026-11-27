jest.mock('../../../../generated/prisma/client', () => ({
  PrismaClient: class {},
  Prisma: {
    Decimal: class Decimal {
      constructor(public value: unknown) {}
    },
  },
}));
jest.mock('@prisma/adapter-pg', () => ({ PrismaPg: class {} }));

import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ROLES } from 'src/common/constants/roles.constant';
import { FinanceApprovalsController } from './approvals.controller';

/** A request context for one controller method, as the guard sees it. */
function contextFor(
  handler: (...args: never[]) => unknown,
  role: string | null,
): ExecutionContext {
  return {
    getHandler: () => handler,
    getClass: () => FinanceApprovalsController,
    switchToHttp: () => ({
      getRequest: () => ({ user: role ? { sub: 1, role } : undefined }),
    }),
  } as unknown as ExecutionContext;
}

describe('FinanceApprovalsController — who may decide', () => {
  const guard = new RolesGuard(new Reflector());
  // Only used as metadata keys for the guard, never invoked detached.
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const decide = FinanceApprovalsController.prototype.decide;
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const list = FinanceApprovalsController.prototype.list;

  it.each([ROLES.FINANCE, ROLES.ADMIN])(
    '%s may make a Finance decision',
    (role) => {
      expect(guard.canActivate(contextFor(decide, role))).toBe(true);
    },
  );

  it.each([
    ROLES.PRINCIPAL,
    ROLES.CORRESPONDENT,
    ROLES.HOD,
    ROLES.SECRETARY,
    ROLES.BILLING,
    ROLES.FACULTY,
    ROLES.STUDENT,
    ROLES.PARENT,
  ])('%s may not make a Finance decision', (role) => {
    expect(() => guard.canActivate(contextFor(decide, role))).toThrow(
      ForbiddenException,
    );
  });

  it('an unauthenticated request may not make a Finance decision', () => {
    expect(() => guard.canActivate(contextFor(decide, null))).toThrow(
      ForbiddenException,
    );
  });

  it('the Principal can read the queue but not decide from it', () => {
    expect(guard.canActivate(contextFor(list, ROLES.PRINCIPAL))).toBe(true);
    expect(() =>
      guard.canActivate(contextFor(decide, ROLES.PRINCIPAL)),
    ).toThrow(ForbiddenException);
  });

  it('the acting user comes from the authenticated token, never from the request body', async () => {
    const service = { decide: jest.fn().mockResolvedValue({ id: 5 }) };
    const controller = new FinanceApprovalsController(service as never);
    const body = {
      decision: 'reject',
      remarks: 'no',
      finance_reviewed_by: 999,
    } as never;

    await controller.decide(
      'pop',
      5,
      body,
      { sub: 42, role: ROLES.FINANCE } as never,
      {
        headers: {},
        ip: '10.0.0.1',
      } as never,
    );

    expect(service.decide).toHaveBeenCalledWith(
      'pop',
      5,
      body,
      42,
      expect.any(Object),
    );
  });

  it('rejects an unknown proposal kind', () => {
    const controller = new FinanceApprovalsController({
      decide: jest.fn(),
    } as never);
    expect(() =>
      controller.decide(
        'grant',
        5,
        {} as never,
        { sub: 42 } as never,
        { headers: {} } as never,
      ),
    ).toThrow("kind must be either 'pop' or 'sop'");
  });
});
