import {TimeRecord} from '@/types';

// Constants
export const MISC_ACTIVITY = '잡동사니';
export const MIN_DURATION_MS = 1000;

// Time statistics interface
export interface TimeStats {
  totalTime: number;
  totalCount: number;
  miscTime: number;
  miscCount: number;
  focusTime: number;
  focusCount: number;
}

// Activity statistics interface
export interface ActivityStats {
  name: string;
  duration: number;
  count: number;
  percentage: number;
}

/**
 * Calculate comprehensive time statistics from records
 */
export function calculateTimeStats(records: TimeRecord[]): TimeStats {
  const totalTime = records.reduce((sum, record) => sum + record.duration, 0);
  const totalCount = records.length;

  const miscRecords = records.filter(
    (record) => record.activity === MISC_ACTIVITY
  );
  const miscTime = miscRecords.reduce(
    (sum, record) => sum + record.duration,
    0
  );
  const miscCount = miscRecords.length;

  const focusRecords = records.filter(
    (record) => record.activity !== MISC_ACTIVITY
  );
  const focusTime = totalTime - miscTime;
  const focusCount = focusRecords.length;

  return {
    totalTime,
    totalCount,
    miscTime,
    miscCount,
    focusTime,
    focusCount,
  };
}

/**
 * Calculate activity-based statistics with sorting by duration
 */
export function calculateActivityStats(records: TimeRecord[]): ActivityStats[] {
  const totalTime = records.reduce((sum, record) => sum + record.duration, 0);

  // Aggregate by activity
  const activityMap = records.reduce((acc, record) => {
    const existing = acc.get(record.activity);
    if (existing) {
      existing.duration += record.duration;
      existing.count += 1;
    } else {
      acc.set(record.activity, {
        name: record.activity,
        duration: record.duration,
        count: 1,
        percentage: 0, // Will calculate later
      });
    }
    return acc;
  }, new Map<string, ActivityStats>());

  // Convert to array, calculate percentages, and sort by duration
  const stats = Array.from(activityMap.values())
    .map((stat) => ({
      ...stat,
      percentage: totalTime > 0 ? (stat.duration / totalTime) * 100 : 0,
    }))
    .sort((a, b) => b.duration - a.duration);

  return stats;
}

/**
 * Get unique activities from records (excluding miscellaneous if specified)
 */
export function getUniqueActivities(
  records: TimeRecord[],
  excludeMisc: boolean = false
): string[] {
  const activities = new Set(records.map((r) => r.activity));
  if (excludeMisc) {
    activities.delete(MISC_ACTIVITY);
  }
  return Array.from(activities);
}

/**
 * Check if duration is valid (above minimum threshold)
 */
export function isValidDuration(duration: number): boolean {
  return duration >= MIN_DURATION_MS;
}
