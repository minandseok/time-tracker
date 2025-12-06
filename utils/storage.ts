import {TimeRecord} from '@/types';

const STORAGE_KEY = 'timeTracker_records';
const TIMER_STATE_KEY = 'timeTracker_timerState';

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
      return parsed.map((record: TimeRecord) => ({
        ...record,
        startTime: new Date(record.startTime),
        endTime: new Date(record.endTime),
      }));
    }
  }
  return [];
}

// Timer state types
interface TimerState {
  isRunning: boolean;
  isPaused: boolean;
  startTime: string | null;
  pausedTime: number;
  currentActivity: string;
  isMiscRunning: boolean;
  miscStartTime: string | null;
  miscEnabled: boolean;
}

export function saveTimerState(state: {
  isRunning: boolean;
  isPaused: boolean;
  startTime: Date | null;
  pausedTime: number;
  currentActivity: string;
  isMiscRunning: boolean;
  miscStartTime: Date | null;
  miscEnabled: boolean;
}): void {
  if (typeof window !== 'undefined') {
    const timerState: TimerState = {
      isRunning: state.isRunning,
      isPaused: state.isPaused,
      startTime: state.startTime?.toISOString() || null,
      pausedTime: state.pausedTime,
      currentActivity: state.currentActivity,
      isMiscRunning: state.isMiscRunning,
      miscStartTime: state.miscStartTime?.toISOString() || null,
      miscEnabled: state.miscEnabled,
    };
    localStorage.setItem(TIMER_STATE_KEY, JSON.stringify(timerState));
  }
}

export function loadTimerState(): {
  isRunning: boolean;
  isPaused: boolean;
  startTime: Date | null;
  pausedTime: number;
  currentActivity: string;
  isMiscRunning: boolean;
  miscStartTime: Date | null;
  miscEnabled: boolean;
} | null {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(TIMER_STATE_KEY);
    if (saved) {
      const parsed: TimerState = JSON.parse(saved);
      return {
        isRunning: parsed.isRunning,
        isPaused: parsed.isPaused,
        startTime: parsed.startTime ? new Date(parsed.startTime) : null,
        pausedTime: parsed.pausedTime,
        currentActivity: parsed.currentActivity,
        isMiscRunning: parsed.isMiscRunning,
        miscStartTime: parsed.miscStartTime
          ? new Date(parsed.miscStartTime)
          : null,
        miscEnabled: parsed.miscEnabled,
      };
    }
  }
  return null;
}
