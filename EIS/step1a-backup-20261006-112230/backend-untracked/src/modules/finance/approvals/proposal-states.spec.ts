import {
  AWAITING_HOD_STATUS,
  FINANCE_ACTIONABLE_STATUSES,
  countStatuses,
  isFinanceActionable,
} from './proposal-states';

describe('proposal-states — the POP/SOP state definitions', () => {
  it('Finance acts on HoD-cleared proposals, including legacy principal_approved rows', () => {
    expect([...FINANCE_ACTIONABLE_STATUSES]).toEqual([
      'hod_approved',
      'principal_approved',
    ]);
    expect(isFinanceActionable('hod_approved')).toBe(true);
    expect(isFinanceActionable('principal_approved')).toBe(true);
  });

  it.each(['pending', 'finance_approved', 'rejected', '', 'HOD_APPROVED'])(
    'Finance cannot act on %p',
    (status) => {
      expect(isFinanceActionable(status)).toBe(false);
    },
  );

  it('a proposal still with the HoD is not Finance-actionable', () => {
    expect(AWAITING_HOD_STATUS).toBe('pending');
    expect(isFinanceActionable(AWAITING_HOD_STATUS)).toBe(false);
  });

  it('countStatuses sums only the requested statuses', () => {
    const groups = [
      { status: 'pending', _count: { _all: 13 } },
      { status: 'hod_approved', _count: { _all: 6 } },
      { status: 'principal_approved', _count: { _all: 6 } },
      { status: 'finance_approved', _count: { _all: 13 } },
    ];
    expect(countStatuses(groups, FINANCE_ACTIONABLE_STATUSES)).toBe(12);
    expect(countStatuses(groups, [AWAITING_HOD_STATUS])).toBe(13);
    expect(countStatuses([], FINANCE_ACTIONABLE_STATUSES)).toBe(0);
  });
});
