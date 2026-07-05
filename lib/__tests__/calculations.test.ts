import {
  computeElapsed,
  computeUnitsAvoided,
  formatSecondaryStat,
  isMilestoneReached,
  formatDuration,
} from '../calculations';

describe('computeElapsed', () => {
  it('returns zeroed fields when quit date is now', () => {
    const now = new Date('2026-01-01T00:00:00Z');
    const elapsed = computeElapsed(now, now);
    expect(elapsed).toEqual({ days: 0, hours: 0, minutes: 0, totalHours: 0 });
  });

  it('splits elapsed time into days/hours/minutes', () => {
    const quitDate = new Date('2026-01-01T00:00:00Z');
    const now = new Date('2026-01-03T05:30:00Z');
    const elapsed = computeElapsed(quitDate, now);
    expect(elapsed.days).toBe(2);
    expect(elapsed.hours).toBe(5);
    expect(elapsed.minutes).toBe(30);
    expect(elapsed.totalHours).toBeCloseTo(53.5, 5);
  });

  it('clamps to zero when quit date is in the future', () => {
    const quitDate = new Date('2026-01-05T00:00:00Z');
    const now = new Date('2026-01-01T00:00:00Z');
    const elapsed = computeElapsed(quitDate, now);
    expect(elapsed).toEqual({ days: 0, hours: 0, minutes: 0, totalHours: 0 });
  });
});

describe('computeUnitsAvoided', () => {
  it('scales units-per-day by elapsed days', () => {
    expect(computeUnitsAvoided(48, 2)).toBe(4);
  });

  it('floors partial units', () => {
    expect(computeUnitsAvoided(30, 1)).toBe(1);
  });

  it('returns 0 for no elapsed time', () => {
    expect(computeUnitsAvoided(0, 5)).toBe(0);
  });
});

describe('formatSecondaryStat', () => {
  it('formats currency with the symbol and two decimals', () => {
    expect(formatSecondaryStat(10, 1.5, 'currency', '$')).toBe('$15.00');
  });

  it('formats hours by dividing minutes-based cost by 60', () => {
    // 4 sessions avoided, 30 minutes each = 120 minutes = 2 hours
    expect(formatSecondaryStat(4, 30, 'hours', '$')).toBe('2 hrs');
  });

  it('handles zero units avoided', () => {
    expect(formatSecondaryStat(0, 18, 'currency', '$')).toBe('$0.00');
  });
});

describe('isMilestoneReached', () => {
  it('is true once elapsed hours meets the threshold', () => {
    expect(isMilestoneReached(24, 24)).toBe(true);
    expect(isMilestoneReached(24, 25)).toBe(true);
  });

  it('is false before the threshold', () => {
    expect(isMilestoneReached(24, 23.9)).toBe(false);
  });
});

describe('formatDuration', () => {
  it('formats sub-hour durations as minutes', () => {
    expect(formatDuration(0.5)).toBe('30 min');
  });

  it('formats sub-day durations as hours', () => {
    expect(formatDuration(8)).toBe('8 hr');
  });

  it('formats sub-month durations as days', () => {
    expect(formatDuration(72)).toBe('3 days');
  });

  it('formats sub-year durations as months', () => {
    expect(formatDuration(24 * 60)).toBe('2 months');
  });

  it('formats year-plus durations as years', () => {
    expect(formatDuration(8760)).toBe('1 year');
  });
});
