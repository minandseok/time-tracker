import {TimeRecord} from '@/types';

const STORAGE_KEY = 'timeTracker_records';

export function saveRecords(records: TimeRecord[]): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  }
}

export function loadRecords(): TimeRecord[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Convert date strings back to Date objects
      return parsed.map((record: any) => ({
        ...record,
        startTime: new Date(record.startTime),
        endTime: new Date(record.endTime),
      }));
    }
  }
  return [];
}
