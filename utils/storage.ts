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

export function exportData(records: TimeRecord[]): void {
  const data = {
    records,
    exportDate: new Date().toISOString(),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `time-tracker-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
