export interface ElapsedTime {
  days: number;
  hours: number;
  minutes: number;
  totalHours: number;
}

export function computeElapsed(quitDate: Date, now: Date = new Date()): ElapsedTime {
  const ms = Math.max(0, now.getTime() - quitDate.getTime());
  const totalSeconds = Math.floor(ms / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    totalHours: ms / 3_600_000,
  };
}

export function computeUnitsAvoided(totalHours: number, unitsPerDay: number): number {
  return Math.floor((totalHours / 24) * unitsPerDay);
}

export type SecondaryStatFormat = 'currency' | 'hours';

export function formatSecondaryStat(
  unitsAvoided: number,
  costPerUnit: number,
  format: SecondaryStatFormat,
  currencySymbol: string
): string {
  const raw = unitsAvoided * costPerUnit;
  if (format === 'hours') {
    return `${Math.round(raw / 60)} hrs`;
  }
  return `${currencySymbol}${raw.toFixed(2)}`;
}

export function isMilestoneReached(milestoneHours: number, elapsedHours: number): boolean {
  return elapsedHours >= milestoneHours;
}

export function formatDuration(hours: number): string {
  if (hours < 1) return `${Math.round(hours * 60)} min`;
  if (hours < 24) return `${Math.round(hours)} hr`;
  const days = hours / 24;
  if (days < 30) return `${Math.round(days)} day${Math.round(days) === 1 ? '' : 's'}`;
  const months = days / 30;
  if (months < 12) return `${Math.round(months)} month${Math.round(months) === 1 ? '' : 's'}`;
  const years = months / 12;
  return `${Math.round(years)} year${Math.round(years) === 1 ? '' : 's'}`;
}
